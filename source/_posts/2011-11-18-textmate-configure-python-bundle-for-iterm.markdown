---
layout: post
title: "TextMate: Configure Python Bundle for iTerm"
date: 2011-11-08
comments: true
external-url:
categories: [Python, Iterm]
---

Ever since I migrated to iTerm2, it's become frustrating that I cannot run my Python scripts in iTerm through my editor TextMate, so I decided to dig in the bundle editor:  

To run your Python scripts in [iTerm2](http://www.iterm2.com/) or [iTerm](http://iterm.sourceforge.net/):  

Go to TextMate's menu: **Bundles** &#8594; **Bundle Editor** &#8594; **Show Bundle Editor**.
Now go to the Python bundle, duplicate the **Run Script (Terminal)** and rename it to **Run Script (iTerm)**, then replace the whole command(s) section with:  

<!--more-->

```bash
    #!/bin/bash
    TPY=${TM_PYTHON:-python}

    esc () {
    STR="$1" ruby &lt;&lt;"RUBY"
    str = ENV['STR']
    str = str.gsub(/'/, "'\\\\''")
    str = str.gsub(/[\\"]/, '\\\\\\0')
    print "'#{str}'"
    RUBY
    }

    osascript &lt;&lt;- APPLESCRIPT
    tell application "iTerm"
        activate
        make new terminal
        tell the first terminal
            launch session "Default Session"
            tell the last session
                write text "python $TM_FILEPATH"
            end tell
        end tell
    end tell
    APPLESCRIPT
```

Next one is **Debug script in Terminal**. This one is easier because you can just replace this line `TP=${TM_TERM_PROG:=Terminal}` with `TP=${TM_TERM_PROG:=iTerm}`, and now rename your command.  
DONE!

Now you can run your scripts in iTerm through the specified shortcuts and not the old school Terminal.
