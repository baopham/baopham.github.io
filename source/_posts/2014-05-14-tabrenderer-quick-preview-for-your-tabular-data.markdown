---
layout: post
title: "TabRenderer - Quick preview for your tabular data"
date: 2014-05-14 20:05:26 -0700
comments: true
categories: [JavaScript, Web Development, Github, Ruby]
---

I recently learned from a friend that [Github renders tabular data](https://help.github.com/articles/rendering-csv-and-tsv-data) (.csv and .tsv) as interactive table, which is really neat. However, it won't work if there's a mismatched column or illegal quoting so I quickly built a [tabrenderer](http://tabrenderer.herokuapp.com/) to help people preview their data before pushing them to Github. At first, I was going to use JavaScript to parse the data but was afraid that it will not work the same way as Github's parser. After browsing their repos, I thought it's very likely that they use Ruby to do this given how often they use Ruby for their own projects. <!--more-->Besides, Ruby has its built-in class [CSV](http://ruby-doc.org/stdlib-1.9.2/libdoc/csv/rdoc/CSV.html) that takes care of almost everything.  

So far, [tabrenderer](http://tabrenderer.herokuapp.com/) notifies users of errors that prevent the parser to work such as illegal quoting. It will jump to the row that has such errors but will not scream if there's a mismatched column (it will be obvious to the users though to see some rows don't have columns). The users can either upload their file or simply type the data in the text box.
