---
layout: post
title: "Laravel - Upload to a non-default S3 bucket"
date: 2015-09-22 00:11:45 -0700
comments: true
categories: [Laravel, PHP, S3]
---

Very easy. Define a new "disk" in `config/filesystems.php`:

```php
        's3-stage' => [
            'driver' => 's3',
            'key'    => env('S3_STAGE_KEY'),
            'secret' => env('S3_STAGE_SECRET'),
            'region' => env('S3_STAGE_REGION'),
            'bucket' => env('S3_STAGE_BUCKET'),
        ],
```

But don't use `.` in your disk name as it will confuse with the array dot notation:

```php
# Illuminate\Filesystem\FilesystemManager

   /**
     * Get the filesystem connection configuration.
     *
     * @param  string  $name
     * @return array
     */
    protected function getConfig($name)
    {
        return $this->app['config']["filesystems.disks.{$name}"];
    }
```
