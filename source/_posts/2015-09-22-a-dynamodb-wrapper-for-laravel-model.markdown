---
layout: post
title: "A DynamoDb wrapper for Laravel model"
date: 2015-09-22 00:21:39 -0700
comments: true
categories: [Laravel, PHP, DynamoDb]
---

With this package [baopham/dynamodb](https://packagist.org/packages/baopham/dynamodb), you can do:

```php

class Campaign extends BaoPham\DynamoDb\DynamoDbModel
{
    protected $table = 'dynamodb_table_for_campaign';

    protected $fillable = ['name', 'description', 'status'];
}

$campaign = new Campaign();

$campaign->find('campaign-id'); // it's best to use UUID instead of incremented id - less work since you have to set the id attribute yourself.

// or
$campaign->where('name', 'foo')
        ->where('status', true)
        ->get();

// or
$campaign->first();

// or
$campaign->update(['name' => 'foo2', 'description' => 'bar2', 'status' => false]);

// or
$campaign->find('campaign-id')->delete();

```

For more, `README`, tests and code are available here: [https://github.com/baopham/laravel-dynamodb](https://github.com/baopham/laravel-dynamodb)
