---
layout: post
title: "Schedule Running Full Tests"
date: 2016-07-23 01:12:41 -0700
comments: true
categories: [Laravel, Testing, CI]
---

Often time when your project starts to grow, the test suite also starts to get bigger, i.e slower CI.  

You will notice that there are tests that hardly ever fail. Maybe we shouldn't run these every commit? How about run these and the full test suite on schedule such as once a day?  

For a Laravel project that is hosted on Github, here is the idea:

**1.** Create a branch `ci-full-tests` off your main branch and set up your CI to run tests for this branch  
**2.** Get a Github OAuth token  
**3.** Create a console command to merge the main branch to `ci-full-tests`:  
```php
<?php

namespace App\Console\Commands;

use GuzzleHttp\Client;
use Illuminate\Console\Command;

class TriggerCIToRunFullTests extends Command
{
    /**
    * The name and signature of the console command.
    *
    * @var string
    */
    protected $signature = 'ci:full-tests';

    /**
    * The console command description.
    *
    * @var string
    */
    protected $description = 'Trigger CI to run the full tests';

    /**
    * @var Client
    */
    protected $client;

    /**
    * Create a new command instance.
    *
    * @return void
    */
    public function __construct(Client $client)
    {
        parent::__construct();

        $this->client = $client;
    }

    /**
    * Execute the console command.
    *
    * @return mixed
    */
    public function handle()
    {
        if (app()->environment() !== 'staging') {
            return;
        }

        $this->client->post("https://api.github.com/repos/YOUR_ORG/REPO_NAME/merges", [
            'headers' => [
                'X-GitHub-Media-Type' => 'application/vnd.github.v3+json',
                'Authorization' => 'token ' . env('GITHUB_OAUTH_TOKEN'),
            ],
            'json' => [
                'base' => 'ci-full-tests',
                'head' => env('BRANCH_FOR_CODESHIP_FULL_TESTS', 'master'),
                'commit_message' => '[Schedule] Run full tests',
            ],
        ]);
    }
}
```
**4.** Schedule to run this command once a day
```php
// app/Console/Kernel.php

$schedule->command('ci:full-tests')->daily();
```
**5.** Add an if condition in your CI bash script
```bash
ci_branch=`printenv GIT_BRANCH`

if [[ $ci_branch == "ci-full-tests" ]]
then
    vendor/bin/behat --tags=~@wip
else
    vendor/bin/behat --tags='@important'
fi
```
