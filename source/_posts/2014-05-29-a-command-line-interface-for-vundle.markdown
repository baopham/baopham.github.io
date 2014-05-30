---
layout: post
title: "A Command Line Interface for Vundle"
date: 2014-05-29 21:30:24 -0700
comments: true
categories: [VimL, Ruby]
---

I'm a die hard fan of Vim and sometimes can be obsessed with trying out new plugins. I really like [Vundle](https://github.com/gmarik/Vundle.vim) - a Vim plugin manager that simplifies plugin installation. I recently reorganized my [.vimrc](https://github.com/baopham/vim/blob/master/vimrc) so that it's easier to keep track of my plugin configurations. My [.vim](https://github.com/baopham/vim) folder now has a sub directory `settings` that contains different files for each plugin configuration:
<!--more-->

<img src="http://f.cl.ly/items/2p3c0E1q3f053K0L1N2M/Screen%20Shot%202014-05-29%20at%209.53.32%20PM.png" class="center">

and `.vimrc` file will source these files one by one:

```vim
for fpath in split(globpath('~/.vim/settings', '*.vim'), '\n')
  exe 'source' fpath
endfor
```

The only problem is whenever I uninstall a plugin, I have to remember to remove the configuration file for that plugin in the `settings` directory. Of course I don't always remember, and so [Vundle CLI](https://github.com/baopham/vundle-cli) is built for this.  

To quote from the `README.md`:  

>Available commands:

> * `rm` remove a plugin
> * `list` list all installed plugins
> * `find` find an installed plugin
> * `clean` clean up unused plugin related files

> `rm` will remove the line `Bundle plugin_name` or `Plugin plugin_name` in your `.vimrc`, 
>delete the configuration file for this plugin in the specified settings directory, 
>and the plugin folder. Before anything is deleted, the command will prompt you 
>for confirmation unless the `--force` switch is on.

Rather than explaining what each command does, I think a gif would do a much better job:

<img src="/images/vundlecli.gif" alt="Vundle CLI gif" class="center"/>

The locations of `.vimrc` file, `.vim` and `settings` directories can be specified with options `--vimrc`, `--vimdir`, `--settings` respectively.  Otherwise, the default values are `~/.vimrc`, `~/.vim`, and `~/.vim/settings`. It should also be able to follow symlinks.

I still need to write tests but I'm leaving it for the future when I have more time and energy.

[Vundle CLI](https://github.com/baopham/vundle-cli) is a Ruby gem so to install it, run this in your terminal: 

```bash
$ gem install vundle-cli
```
