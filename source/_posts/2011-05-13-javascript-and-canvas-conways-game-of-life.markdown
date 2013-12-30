---
layout: post
title: "JavaScript and Canvas: Conway's Game of Life"
date: 2011-07-03 5:59
comments: true
external-url:
categories: [JavaScript, HTML5]
---

<p>Being inspired by my school project from CS111 <b>Introduction to Computation</b>, I implemented the game again in JavaScript and used HTML5 canvas to display the cells and animation (HTML5 browser support is required).</p>

**Supported Browsers:**

* Firefox 4+
* Google Chrome
* Opera 10.6+
* Apple Safari 4+
* Internet Explorer 9

<!--more-->

<script src="/javascripts/custom/life.js" type="text/javascript"></script>

**From wikipedia:**

>   &#8220;The Game of Life, also known simply as Life, is a [cellular automaton](http://en.wikipedia.org/wiki/Cellular_automaton) devised by the British mathematician [John Horton Conway](http://en.wikipedia.org/wiki/John_Horton_Conway) in 1970  
>   **Rules:**  
>    1.  Any live cell with fewer than two live neighbours dies, as if caused by under-population.  
>    2.  Any live cell with two or three live neighbours lives on to the next generation.  
>    3.  Any live cell with more than three live neighbours dies, as if by overcrowding.  
>    4.  Any dead cell with exactly three live neighbours becomes a live cell, as if by reproduction.&#8221;  

<canvas id="canvas_life"></canvas>
<div id="buttons_life">
    <button class="btn" id="generate" type="button">Generate Random Cells</button>
    <button class="btn" id="run" type="button">Run</button>
    <button class="btn" id="stop" type="button">Stop</button>
    <button class="btn" id="clear" type="button">Clear</button>
</div>
