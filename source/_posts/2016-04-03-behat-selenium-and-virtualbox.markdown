---
layout: post
title: "Behat, Selenium and VirtualBox"
date: 2016-04-03 22:57:47 -0700
comments: true
categories: [Behat, Selenium, VirtualBox]
---

If you want to run selenium server on the host machine and behat in VirtualBox, this setup could work for you:

```yaml behat.yml
default:
extensions:
    Behat\MinkExtension:
    base_url: https://foobar.dev
    default_session: laravel
    laravel: ~
    selenium2:
        wd_host: "http://selenium-server.dev:4444/wd/hub"
    browser_name: chrome
```

In your virtualbox, edit the `/etc/hosts` and add a line:

```text /etc/hosts
10.0.2.2 selenium-server.dev 
```

Then run your selenium server on your host machine.
