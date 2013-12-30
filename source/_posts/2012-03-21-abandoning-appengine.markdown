---
layout: post
title: "Abandoning AppEngine"
date: 2012-03-21
comments: true
external-url:
categories: [Web Development, Rack, Ruby]
---

These last 2 days have been insane!! You know why? Let me tell you the story:

I was sick. It was a random cold that I caught from someone. But now I'm glad I had it because if not because of it, I wouldn't have had the time to wander around [github](https://github.com), looking at people's repos, and then stumbled upon this project [toto](https://github.com/cloudhead/toto). And now, it's like a dream come true!.
<!--more-->

**toto** is really the tiniest and coolest blogging engine yet! It has all that I love: git and ruby on rails. It makes everything so easy to manage and configure, from archiving all the posts you wrote, to having a markdown converter by default, and articles embeded with metadata (which makes it easy to add tags/categories), etc.

I'm not going to explain all **toto**'s features but as a future reference for myself, I'd like to summarize all the steps that I took during the last 2 days to port my old website from [Google AppEngine](http://code.google.com/appengine/) to [toto](https://github.com/cloudhead/toto) and [Heroku](http://www.heroku.com/).

### Installation
```bash
gem install toto
git clone git://github.com/cloudhead/dorothy.git myblog
```

**dorothy** is **toto**'s default template. This gives you the bone structure of your blog

### config.ru

Add personal settings to `config.ru`:

```ruby
require 'toto'
require File.expand_path('../sitemap', __FILE__)
require 'rack/mobile-detect'

# Rack config
use Rack::Static,
    :urls => ['/css', '/js', '/images', '/favicon.ico', '/Resume.pdf', 'BingSiteAuth.xml', '/robots.txt'],
    :root => 'public'
use Rack::CommonLogger

# Redirect to mobile site
use Rack::MobileDetect, :catchall => /[Bb]lack[Bb]erry|i[Pp]hone|[Aa]ndroid/,
                        :redirect_to => 'http://baopham-mobile.heroku.com/'

if ENV['RACK_ENV'] == 'development'
    use Rack::ShowExceptions
end

class Toto::Site
    alias_method :old_go, :go

    def go route, env = {}, type = :html
        if not route.first =~ /\d{4}/ and route.size == 2 and route.last =~ /(\d+)/
            @config[:id] = route.last.to_i
            route.pop
        end
        ret = old_go route, env, type
        @config.delete :id
        ret
    end
end

toto = Toto::Server.new do
    #
    # Add your settings here
    # set [:setting], [value]
    #
    set :author,    "Bao Pham"                                  # blog author
    set :title,     "Bao Pham"
    set :url,       "http://baopham.heroku.com"
    set :root,      "page"                                      # page to load on /
    set :articles_per_page,     6
    set :date,      lambda {|now| now.strftime("%d/%m/%Y") }    # date format for articles
    set :markdown,  :smart                                      # use markdown + smart-mode
    set :disqus,    "bpmsworld"                                 # disqus id, or false
    set :summary,   :max => 150, :delim => /~/                  # length of article summary and delimiter
    set :ext,       'txt'                                       # file extension for articles
    set :cache,     28800                                       # cache duration, in seconds

    set :date,      lambda {|now| now.strftime("%B #{now.day.ordinal} %Y") }

    set :error,     lambda {|code|
        ERB.new(File.read("templates/pages/#{code}.rhtml")).result
    }
end

run toto
```

Some changes I made:

- Add sitemap builder (line 2): [sitemap](#sitemap)

- Redirect for mobile view (line 11): [useragent](#useragent)

- Class `Toto::Site` (lines 19-31): [pagination](#paginate)

- Set `:root` to `"page"` (line 41): [pagination](#paginate)

- Changed the default number of articles per page to 6 (line 42)

- Added customed error pages in `templates/pages` (line 52)

<h3 id="sitemap">Sitemap</h3>

Just follow the instruction from [this article](http://artemk.name/2011/06/01/sitemap-in-toto/), you'll have a sitemap automatically

<h3 id="useragent">Mobile UserAgent Detect</h3>

This project is very neat. It detects mobile user-agents (iphone, ipad, android, blackberry,etc) and has options for you to redirect to other link. You can specifies specific link for different user-agents.

Github repo: [talison/rack-mobile-detect](https://github.com/talison/rack-mobile-detect)

<h3 id="paginate">Pagination</h3>

It took me a while to get it to understand and make it work: [cheap toto pagination](http://vincentwoo.com/2011/02/23/cheap-toto-pagination/)

- So first add the class `Toto::Site` to your `config.ru` (now you see why i have it there)

- Remember to set your `:root` to `"page"` instead of `"index"`

- Next, add `templates/pages/page.rhtml`

- Replace the `...` with your `index.rhtml` content

### Add Articles

Now adding articles are a piece of cake. Only a few things you need to watch out for:

- Name your article (text file) in folder **articles** exactly in this format: **YYYY-MM-DD-article-title**, which follows closely with the article's URL: **YYYY/MM/DD/article-title**

- If you article title has characters like: **:** , **.** , **'** , they are ignored in the URL, so that I noticed

- Before writing your article, add a few lines of metadata:

```
title: My Post Title
author: Bao Pham
date: 2012/03/21
```

- If your title has non-alphabet characters, keep the title in double quote like `title: "Emmy's Post"` or `title: "I-Like-Dashes"` and of course, name the file as **2012-03-21-emmys-post** or **2012-03-21-i---like---dashes** respectively

- The article can be in markdown format or HTML  
*Tips:* Alternately, you can make use of the provided **Rakefile** then you don't have to worry about how to name your article files: just type this in your terminal: **rake Rakefile new**, it will ask for your article's title and creates it for you:

```bash
$ rake Rakefile new
Title: Emmy's Post

  toto ~ an article was created for you at articles/2012-04-11-emmys-post.txt.
```

Those are the few things that I picked up from playing with **toto** for 2 days

### Tags/Categories

**toto** lacks support for tags unfortunately but no worries you have [karakuri](https://github.com/5v3n/karakuri). Follow the README and you're all set to go!

### Deploy to Heroku

2 days to learn Rack, ERB templates, discover [disqus](http://disqus.com/), and many more interesting projects, finally... goodbye Google AppEngine and Django, I'm joining the Ruby and Rails community!
