---
layout: post
title: "Modelling with Behat and Laravel"
date: 2016-04-03 23:17:34 -0700
comments: true
categories: [Behat, Laravel]
---

Here is an interesting read talking about how to "do a Domain-Driven Design while doing Behaviour-Driven Development's red-green-refactor cycle": [Introducing Modelling by Example](http://stakeholderwhisperer.com/posts/2014/10/introducing-modelling-by-example)  

If you like the author's idea and want to apply this to your Laravel projects, here is something you can do to get most (if not all) Laravel PHPUnit helper methods in your Behat Domain Context class:

* Have a base Context class. I call it `DomainContext` but you could do something similar for the default `FeatureContext`. Having a separate abstract parent class lets me divide my context classes into 2 categories: UI and Domain.

```php
<?php

use App\User;
use Behat\Behat\Context\SnippetAcceptingContext;
use Behat\MinkExtension\Context\MinkContext;
use Illuminate\Foundation\Testing\ApplicationTrait;
use Illuminate\Foundation\Testing\CrawlerTrait;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Session;
use Laracasts\Behat\Context\KernelAwareContext;
use PHPUnit_Framework_Assert as PHPUnit;
use Symfony\Component\HttpKernel\HttpKernelInterface;


abstract class DomainContext extends MinkContext implements KernelAwareContext, SnippetAcceptingContext
{
    use ApplicationTrait;
    use CrawlerTrait;

    protected $baseUrl = 'http://localhost';

    /**
     * @var User
     */
    protected $currentUser;

    public function setApp(HttpKernelInterface $app)
    {
        $this->app = $app;
    }

    public function be(User $user)
    {
        Session::start();

        Auth::loginUsingId($user->id);

        $this->currentUser = $user;
    }

    public function __call($name, array $arguments)
    {
        forward_static_call_array([PHPUnit::class, $name], $arguments);
    }
}
```
* Extend this base class for all your Domain Context classes then you will have access to methods such as:

```php
$this->be($user);

$this->get('users');

$this->post('users', ['_token' =>  csrf_token(), 'email' => 'foo@bar.com']);

$this->expectsJobs(SendInvitationEmail::class);

$this->seeInDatabase('users', ['email' => $payload['email']]);
```
