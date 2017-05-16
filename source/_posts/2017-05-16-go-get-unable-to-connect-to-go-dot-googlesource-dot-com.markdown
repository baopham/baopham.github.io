---
layout: post
title: "go get - unable to connect to go.googlesource.com"
date: 2017-05-16 19:19:19 +0800
comments: true
categories: Go
---

> Given I want to install a go library  
> When I run `go get github.com/author/repo`  
> Then I should not see the error `unable to connect to go.googlesource.com`  


If the above scenario isn't working out for you, make sure you don't have this in your `.gitconfig`:

```
[url "git://"]
	insteadOf = https://
```
