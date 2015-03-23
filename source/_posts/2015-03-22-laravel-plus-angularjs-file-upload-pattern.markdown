---
layout: post
title: "Laravel + Angularjs: file upload pattern"
date: 2015-03-22 22:36:38 -0700
comments: true
categories: [Laravel, PHP, Angularjs, S3]
---

The thing with uploading files via AJAX is that users can just keep uploading files to the server without having to save the form. This leaves a lot of junk files around if you don't clean them up later. But we don't want to delete the files that are actually being used. This means we need to keep records of uploaded files.

This pattern is working for me - assuming we want to keep files on S3:
<!--more-->

**1.** A table to store records of uploaded files.

```php
// database/migrations/2015_03_05_004850_create_files_table.php

public function up()
{
    Schema::create('files', function(Blueprint $table)
    {
        $table->string('id', 36)->primary();
        $table->string('mime', 255);
        $table->string('filename', 255);
        $table->bigInteger('size')->unsigned();
        $table->string('storage_path')->unique();
        $table->string('disk', 10);
        $table->boolean('status');
        $table->timestamps();
    });
}

// app/Models/File.php

use CRT\Models\BaseModel;
use Illuminate\Support\Facades\Storage;

class File extends BaseModel {

    protected $fillable = ['mime', 'storage_path', 'status', 'filename', 'size', 'disk'];

    public static function boot()
    {
        parent::boot();

        static::deleting(function($model)
        {
            Storage::disk($model->disk)->delete($model->storage_path);
        });
    }
}
```

**2.** Use Javascript library to upload files thru AJAX ([Flowjs](https://github.com/flowjs), [Dropzonejs](http://www.dropzonejs.com/), etc.)

**3.** In the controller's upload method:

```php
// app/Http/Controllers/FileUploadController.php

use CRT\Models\File as FileModel;

use Flow\Config as FlowConfig;
use Flow\Request as FlowRequest;
use Flow\ConfigInterface;
use Flow\RequestInterface;

public function upload()
{
    $config = new FlowConfig();
    $config->setTempDir(storage_path() . '/tmp');
    $config->setDeleteChunksOnSave(false);

    $request = new FlowRequest();

    $totalSize = $request->getTotalSize();

    if ($totalSize && $totalSize > (1024 * 1024 * 4))
    {
        return $this->responseWithError('File size exceeds 4MB');
    }

    $uploadFile = $request->getFile();

    list($path, $destination) = $this->getDestinationPathInfo($uploadFile);

    // @see: http://baopham.github.io/blog/2015/03/16/laravel-merge-flowjs-chunks-directly-to-s3
    if (\Bao\Flow\Basic::save($destination, $config, $request, $this->s3Client))
    {
        $file = FileModel::create([
            'mime' => $uploadFile['type'],
            'size' => $request->getTotalSize(),
            'storage_path' => $path,
            'filename' => $uploadFile['name'],
            'disk' => 's3',
            'status' => false,
        ]);

        // Send JSON response.
        return $this->responseWithData($file);
    }
    else
    {
        // Indicate that we are not done with all the chunks.
        return $this->responseWithData('', 204);
    }
}
```
This will save the [uploaded file to S3 directly](http://baopham.github.io/blog/2015/03/16/laravel-merge-flowjs-chunks-directly-to-s3/).

**4.** Angular side will store the response that has the file's info (id, size, filename, etc.) - mark this file as new, e.g:

```javascript
// public/assets/js/thing/controller.js

var vm = this;
vm.processFileSuccess = processFileSuccess;

// ...

function processFileSuccess(file) {
    file.isNew = true;
    vm.files.push(file);
}
```

**5.** When user saves the form, we submit the form including the file's info.

**6.** Then in the backend, we process the file and mark the file's status as `true`:

```php
$store = Input::all();
foreach ($store['files'] as &$fileInput)
{
    if (array_get($fileInput, 'isNew'))
    {
        $file = FileModel::find($fileInput['id']);
        if ($file->disk == 's3')
        {
            // move file to a different S3 folder
            ...
            // update file's storage path and status
            $file->storage_path = ...;
            $file->status = true;
            $file->save();
        }
        else
        {
            // upload local file to S3 then update the file's record if needed or just delete it:
            $file->delete();
        }
        // update the file input info before saving it to DB - store the S3 URL for example:
        $fileInput['url'] = ...;
    }
}

// then save $store in DB.
```

**7.** Create a command to clean up tmp files that are older than x hours: `php artisan make:console CleanupFiles`

```php
// app/Console/Commands/CleanupFiles.php

/**
 * The console command name.
 *
 * @var string
 */
protected $name = 'files:clean';

/**
 * Execute the console command.
 *
 * @return mixed
 */
public function fire()
{
    $date = new DateTime;
    $date->modify('-3 hours');
    $formatted = $date->format('Y-m-d H:i:s');
    FileModel::where('updated_at', '<=', $formatted)
        ->where('status', '=', 0)
        ->get()->each(function($file)
        {
            $file->delete();
        });

    \Flow\Uploader::pruneChunks(config('filesystems.disks.local.root') . '/tmp', 3*60*60);
    $this->info('Files older than 3 hours have been cleaned up.');
}
```

Set a scheduler for it:

```php
// app/Console/Kernel.php

protected $commands = [
    'CRT\Console\Commands\CleanupFiles',
];

protected function schedule(Schedule $schedule)
{
    $schedule->command('files:clean')
            ->hourly();
}
```

And then setup cronjob:

```
* * * * * php /home/vagrant/projects/CRT/artisan schedule:run 1>> /dev/null 2>&1
```
