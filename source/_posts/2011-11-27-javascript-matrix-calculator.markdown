---
layout: post
title: "JavaScript: Matrix Calculator"
date: 2011-11-27
comments: true
external-url:
categories: [JavaScript, Math]
---

<script src="/javascripts/custom/matrix.js" type="text/javascript"></script>

<div class="matrix-post">
  <p>A matrix calculator written in JavaScript :)</p>
  <div class="matrix">
    <div style="margin: 10px 0">
      <b>Matrix 1</b>
      <input style="float:right" class="add btn btn-mini" type="button" value="+"/>
      <input style="float:right" class="remove btn btn-mini" type="button" value="&#8211;"/>
    </div>
    <div class="matrixA inputMatrix">
      <div class="matrix-row">
          <input type="text" value="1, 2, 3"/>
      </div>
      <div class="matrix-row">
          <input type="text" value="4, 5, 6"/>
      </div>
      <div class="matrix-row">
          <input type="text" value="7, 8, 9"/>
      </div>
    </div>
  </div>
  <div class="matrix">
    <div style="margin: 10px 0">
      <b>Matrix 2</b>
      <input style="float: right;" class="add btn btn-mini" type="button" value="+"/>
      <input style="float: right;" class="remove btn btn-mini" type="button" value="&#8211;"/>
    </div>
    <div class="matrixB inputMatrix">
      <div class="matrix-row">
          <input type="text" value="1, 2, 3"/>
      </div>
      <div class="matrix-row">
          <input type="text" value="4, 5, 6"/>
      </div>
      <div class="matrix-row">
          <input type="text" value="7, 8, 9"/>
      </div>
    </div>
  </div>
  <div id="selection">
    <label for="multiply">Multiply</label>
    <input type="radio" name="method" id="multiply" value="multiply" checked="checked">
    <input type="radio" name="method" id="transpose" value="transpose"/>
    <label for="transpose">Transpose</label>
    <input type="radio" name="method" id="add" value="add"/>
    <label for="add">Addition</label>
    <input type="radio" name="method" id="substract" value="subtract"/>
    <label for="substract">Subtraction</label>
  </div>
  <div id="compute">
      <input class="btn" type="button" value="Compute"/>
  </div>
  <div id="answer"></div>
</div>
