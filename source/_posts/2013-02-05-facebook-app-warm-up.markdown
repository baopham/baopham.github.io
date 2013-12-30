---
layout: post
title: "Facebook App Warm-up"
date: 2013-05-02
comments: true
external-url:
categories: [PHP, Facebook]
---

This week I decided to try to build a Facebook app. It turns out to be not too bad. Facebook API and Heroku really make things easier. If you do a few googling around, I'm sure you can find many good tutorials on how to build a Facebook app - if you're interested in making one yourself.

There are a few challenges / nuisances I faced during the making though:

<!--more-->
* First, of course, is the question: what kind of app? Ideally, I would like to build a game, but with the time constraint of only a few hours and my main focus was to get a taste of building a Facebook app, I decided to go with a simple app: Horoscope.
* After registering to be a Facebook developer, I selected Heroku to host my PHP app. Heroku then generated a dummy app so the next step is to download the sample code to local dev (Side note: remember to use `--recursive` with `git clone` if you also want to get the Facebook PHP SDK). But it doesn't work out of the box unless you have the most perfect Apache configuration. It took me a while to dig things out and set things up. Solution to this really depends on your OS and environtment so I'm not going to go into details about it.

* Next, read the code, learn the api, write some class, add more stuff, edit the content, test it... That was easy... Until I bumped into an annoying [FB's Javascript bug](https://developers.facebook.com/bugs/524245490930206?browse=search_50f87d9e8869a5e06191882#). I did not find this post until much much later though so it was quite frustrating to see the page not reloaded after the user logged in. If you scroll down the post to see the comments, you can see some suggested fixes. I tried one of them and it works :)

**UPDATE**: Looks like the fix is ready as of now.

In total, it took me about ~5 hours to finish this app. I think putting a time limit on how long I can work on a problem really helps. It pushes me to be more alert and work more efficiently. It is also to make sure that I have time to do my homework! 

