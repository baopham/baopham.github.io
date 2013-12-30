var Cell = function (life, x, y, interval) {
  this.alive = life;
  this.futureAlive = life;
  this.x = x;
  this.y = y;
  this.interval = interval;
  this.aliveColor = "#FF4500";
  this.deadColor = "#FFFFFF";
};

Cell.prototype.update = function () {
  this.alive = this.futureAlive;
};

Cell.prototype.fillRect = function(ctx) {
  ctx.fillStyle = this.aliveColor;
  ctx.fillRect(this.x*board.interval, this.y*board.interval, this.interval, this.interval);
};

Cell.prototype.disableRect = function(ctx) {
  ctx.fillStyle = this.deadColor;
  ctx.fillRect(this.x*board.interval, this.y*board.interval, this.interval, this.interval);
};

var CellManager = function() {
  this.stop = false;
  this.gen = false;
  this.cells2D = new Array();
  for (var i = 0; i < board.width/board.interval; i++) {
    this.cells2D[i] = new Array();
    for (var j = 0; j < board.height/board.interval; j++) {
      this.cells2D[i][j] = new Cell(false, i, j, board.interval);
    }
  }
};
CellManager.prototype.addCell =  function(cell, ctx) {
  this.cells2D[cell.x][cell.y] = cell;
  cell.fillRect(ctx);
};

CellManager.prototype.removeCell =  function(cell, ctx) {
  cell.alive = false;
  cell.disableRect(ctx);
};

CellManager.prototype.nextStep = function(ctx){
  for(var row=0; row<board.width/board.interval; row++){
    for(var col=0; col<board.height/board.interval; col++){
      var count = 0;
      for(var i=row-1; i<=row+1; i++){
        for(var j=col-1; j<=col+1; j++){
          if (i >= 0 && j >= 0 && i < board.width/board.interval && j < board.height/board.interval && !(i === row && j === col)){
            if(this.cells2D[i][j].alive){
              count++;
            }
          }
        }
      }
      if((count >=4) || (count <=1)){
        this.cells2D[row][col].futureAlive = false;
      }else if((this.cells2D[row][col].alive)){
        if(count == 3){
          this.cells2D[row][col].futureAlive = true;
        }else if(count == 2){
          this.cells2D[row][col].futureAlive = true;
        }
      }else if(!this.cells2D[row][col].alive){
        if(count == 3){
          this.cells2D[row][col].futureAlive = true;
        }else if(count == 2){
          this.cells2D[row][col].futureAlive = false;
        }
      }
    }
  }
  for(var row=0; row<board.width/board.interval; row++){
    for(var col=0; col<board.height/board.interval; col++){
      var cell = this.cells2D[row][col];
      cell.update();
      if(cell.alive){
        this.addCell(cell,ctx);
      }else{
        this.removeCell(cell,ctx);
      }
    }
  }
};

function generate() {

  board = {
    width: 900,
    height: 300,
    interval: 5
  }

  this.ctx  = $("#canvas_life")[0].getContext('2d');
  this.ctx.fillStyle = "rgb(200,0,0)";

  this.cellManager = new CellManager();
  for (var i=0; i<3000; i++) {
    var x = Math.floor((Math.random()*board.width/board.interval));
    var y = Math.floor((Math.random()*board.height/board.interval));
    var cell = new Cell(true, x, y, board.interval);
    this.cellManager.addCell(cell, ctx);
  }
}

function run(){
  (function execute() {
    if (!this.cellManager.stop) {
      setTimeout(function() {
        this.cellManager.nextStep(this.ctx);
        execute();
      }, 500);
    }
  })();
}

function clear(){
  var length1 = this.cellManager.cells2D.length;
  var length2 = this.cellManager.cells2D[0].length;
  for(var i=0; i<length1; i++){
    for(var j=0; j<length2; j++){
      var cell = this.cellManager.cells2D[i][j];
      this.cellManager.removeCell(cell, ctx);
    }
  }
}

function startLife(){
  $(function() {
    $("#generate").attr('disabled', false);
    $("#run").attr('disabled', '');
    $("#buttons_maze").find("button").attr("disabled", '');
  });
  var gen = false;
  $("#generate").click(function(){
    $(this).attr('disabled', true);
    $("#run").attr('disabled', false);
    gen = true;
    generate();
  });

  $("#run").click(function(){
    if(gen===true){
      $(this).attr('disabled', true);
      cellManager.stop = false;
      run();
    }
  });

  $("#stop").click(function(){
    $("#run").attr('disabled', false);
    cellManager.stop = true;
  });

  $("#clear").click(function(){
    $("#generate").attr('disabled', false);
    $("#run").attr('disabled', false);
    gen = false;
    cellManager.stop = true;
    clear();
  });
}

$(document).ready(function() {
  startLife();
});
