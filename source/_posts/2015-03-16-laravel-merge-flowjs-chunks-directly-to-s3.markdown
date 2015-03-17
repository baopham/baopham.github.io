---
layout: post
title: "Laravel - Merge Flowjs chunks directly to S3"
date: 2015-03-16 23:02:03 -0700
comments: true
categories: [PHP, Laravel, S3, Flowjs]
---

**Motivation**: [Laravel 5](http://laravel.com/docs/5.0/filesystem) now has support for Cloud storage.  

**Problem**: [Flowjs](https://github.com/flowjs/flow.js) library allows files to be uploaded in chunks making it possible to upload large files but by default it [saves the final file to local storage](https://github.com/flowjs/flow-php-server/blob/84c928090c060238d15e89dd7e252acf8eff1140/src/Flow/File.php#L147).

We could extend this class so that it uses [S3 Stream Wrapper](http://docs.aws.amazon.com/aws-sdk-php/guide/latest/feature-s3-stream-wrapper.html):

```
<?php namespace Bao\Flow;

use Flow\ConfigInterface;
use Flow\RequestInterface;
use Flow\FileOpenException;
use Flow\FileLockException;

use Illuminate\Support\Facades\Storage;
use League\Flysystem\FilesystemInterface;

use Aws\S3\S3Client;

use Exception;

class File extends \Flow\File {

    /**
     * @var \Flow\RequestInterface
     */
    private $request;

    /**
     * @var \Flow\ConfigInterface
     */
    private $config;

    /**
     * @var \Aws\S3\S3Client
     */
    private $s3Client;

    public function __construct(ConfigInterface $config, RequestInterface $request = null, S3Client $s3Client = null)
    {
        parent::__construct($config, $request);
        $this->config = $config;
        $this->request = $request;
        $this->s3Client = $s3Client;
    }

    /**
     * Merge all chunks to single file
     *
     * @param string $destination final file location
     *
     * @throws FileLockException
     * @throws FileOpenException
     * @throws \Exception
     *
     * @return bool indicates if file was saved
     */
    public function save($destination)
    {
        $toS3 = !empty($this->s3Client);
        $local = !$toS3;

        if ($toS3 && !starts_with($destination, 's3://'))
        {
            // @see http://docs.aws.amazon.com/aws-sdk-php/guide/latest/feature-s3-stream-wrapper.html
            throw new Exception('Not a valid S3 protocol');
        }

        if ($toS3)
        {
            $this->s3Client->registerStreamWrapper();
        }

        $fh = fopen($destination, 'w');
        if (!$fh)
        {
            throw new FileOpenException('failed to open destination file: ' . $destination);
        }

        if ($local && !flock($fh, LOCK_EX | LOCK_NB, $blocked)) {
            // @codeCoverageIgnoreStart
            if ($blocked)
            {
                // Concurrent request has requested a lock.
                // File is being processed at the moment.
                // Warning: lock is not checked in windows.
                return false;
            }
            // @codeCoverageIgnoreEnd

            throw new FileLockException('failed to lock file: ' . $destination);
        }

        $totalChunks = $this->request->getTotalChunks();

        try
        {
            $preProcessChunk = $this->config->getPreprocessCallback();

            for ($i = 1; $i <= $totalChunks; $i++)
            {
                $file = $this->getChunkPath($i);
                $chunk = fopen($file, "rb");

                if (!$chunk)
                {
                    throw new FileOpenException('failed to open chunk: ' . $file);
                }

                if ($preProcessChunk !== null)
                {
                    call_user_func($preProcessChunk, $chunk);
                }

                stream_copy_to_stream($chunk, $fh);
                fclose($chunk);
            }
        }
        catch (\Exception $e)
        {
            if ($local) flock($fh, LOCK_UN);

            fclose($fh);
            throw $e;
        }

        if ($this->config->getDeleteChunksOnSave())
        {
            $this->deleteChunks();
        }

        if ($local) flock($fh, LOCK_UN);

        fclose($fh);

        return true;
    }
}
```
