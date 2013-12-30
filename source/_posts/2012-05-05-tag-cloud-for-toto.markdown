---
layout: post
title: "Tag Cloud for Toto"
date: 2012-05-05
comments: true
external-url:
categories: [Ruby, Web Development]
---

As I mentioned in the [previous post]("/2012/03/21/abandoning-appengine/") about [toto]("http://cloudhead.io/toto") blog engine, and how I have made some customizations, I still felt like something was missing.

Okay, I have sitemap, pagination, mobile redirect, tags... what else could be missing that would appear in most blog websites? 
<!--more-->
**tag cloud** of course!! Duh...

<a href="http://www.flickr.com/photos/willrad/209637446/" title="DUH. by Willrad, on Flickr"><img class="img-border" src="http://farm1.staticflickr.com/66/209637446_ee265fbfa6.jpg" width="400" height="275" alt="DUH."></a>  
<small>*Just joking...*</small>

Anyway, so I went back and fired an issue on the [karakuri]("https://github.com/5v3n/karakuri") rack plugin github to see if this feature is possible to implement. Long story short, I made a pull request and with the support of the [author]("https://github.com/5v3n"), now you can have the tag cloud feature. Isn't it sweet?


>    **Tag Cloud**  
>    Example usage:
      <h1>Tags</h1>
      <%  Karakuri::tag_cloud(@articles).each do |tag, freq| %>
          <%= %|<a href="/tagged?tag=#{tag}" title="articles concerning #{tag}" style="font-size: #{10 * freq}px">#{tag}</a>| %>
      <% end %>

