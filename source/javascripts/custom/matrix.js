function add(matA, matB){
  if(matA.length != matB.length){
    alert("Your matrices don't have the same number of rows");
    return;
  }
  var result = [];
  try{
    for(var i=0; i<matA.length; i++){
      result[i] = [];
      for(var j=0; j<matA[0].length; j++){
        result[i][j] = matA[i][j] + matB[i][j];
      }
    }
    return result;
  }
  catch(er){
    alert("Your matrices don't look right, cannot compute");
    return;
  }
}

function subtract(matA, matB){
  if(matA.length != matB.length){
    alert("Your matrices don't have the same number of rows");
    return;
  }
  var result = [];
  try{
    for(var i=0; i<matA.length; i++){
      result[i] = [];
      for(var j=0; j<matA[0].length; j++){
        result[i][j] = matA[i][j] - matB[i][j];
      }
    }
    return result;
  }
  catch(er){
    alert("Your matrices don't look right, cannot compute");
    return;
  }

}

function multiply(matA, matB){
  if(matA[0].length != matB.length){
    alert("Hmm cannot multiply your matrices, the column and row numbers don't look right");
    return;
  }
  var row = matA.length;
  var col = matA[0].length;
  var col2 = matB[0].length;
  var result = [];
  try{
    for(var i=0; i<col; i++){
      result[i] = [];
    }
    var total;
    for(var i=0; i<row; i++){
      for(var k=0; k<col2; k++){
        total = 0;
        for(var j=0; j<col; j++){
          total += matA[i][j] * matB[j][k];
        }
        result[i][k] = total;
      }
    }
    return result;
  }
  catch(er){
    alert("Your matrices don't look right, cannot compute");
    return;
  }
}

function transpose(matrix){
  var transposed = new Array(matrix[0].length);
  for(var i=0; i<matrix[0].length; i++){
    transposed[i] = new Array(matrix.length);
  }
  for(var i=0; i<matrix.length; i++){
    for(var j=0; j<matrix[0].length; j++){
      transposed[j][i] = matrix[i][j];
    }
  }
  return transposed;
}

function dotProduct(vecA, vecB){
  return mutiply(vecA, transpose(vecB))[0][0];
}

function prettify(matrix, name){
  var row = '';
  for(var i=0; i<matrix.length; i++){
    row += '<mtr>';
    for(var j=0; j<matrix[0].length; j++){
      row += ('<mtd><mi>' + matrix[i][j] + '</mi></mtd>');
    }
    row += '</mtr>';
  }
  var html = '<math xmlns="http://www.w3.org/1998/Math/MathML"><mrow><mi>' + name + '</mi><mo>=</mo><mfenced open="[" close="]"><mtable>' + row + '</mtable></mfenced></mrow></math>';
  return html;
}

function prettify2(matrix, name){
  var html = name + ' = [ ';
  for(var i=0; i<matrix.length; i++){
    html += '[ ';
    for(var j=0; j<matrix[0].length; j++){
      html += matrix[i][j] + ' ';
    }
    html += '] ';
  }
  html += ' ]';
  return html;
}


function check(matrix){
  if(matrix.length === 0) return true;
  var cols = matrix[0].length;
  for(var i=0; i<matrix.length; i++){
    if(matrix[i].length != cols){
      alert("One or more columns need more inputs");
      return false;
    }
  }
  return true;
}

function computeMatrix(){
  var notDisplayCorr = '<div><a id="not-display-correctly">Not display correctly? Click here</a></div>';
  $(".add").click(function(){
    var inputMatrix = $(this).closest(".matrix").find(".inputMatrix");
    inputMatrix.append("<div class='matrix-row'><input type='text'></input></div>");
  });
  $(".remove").click(function(){
    var rows = $(this).closest(".matrix").find(".inputMatrix").find(".matrix-row");
    var lastRow = rows[rows.length-1];
    $(lastRow).remove();
  });
  $("#compute").click(function() {
    var inputs_A = $(".matrixA").find("input:text");
    arrayA = [];
    for(var i=0; i<inputs_A.length; i++){
      var val = $(inputs_A[i]).val();
      if($.trim(val) !== ''){
        arrayA.push(val.split(','));
      }
    }
    var inputs_B = $(".matrixB").find("input:text");
    arrayB = [];
    for(var i=0; i<inputs_B.length; i++){
      var val = $(inputs_B[i]).val();
      if($.trim(val) !== ''){
        arrayB.push(val.split(','));
      }
    }
    if(check(arrayA) && check(arrayB)) {
      var matrixA = [];
      for(var i=0; i<arrayA.length; i++){
        matrixA[i] = [];
        for(var j=0; j<arrayA[0].length; j++){
          matrixA[i][j] = parseInt(arrayA[i][j], 10);
        }
      }

      var matrixB = [];
      for(var i=0; i<arrayB.length; i++){
        matrixB[i] = [];
        for(var j=0; j<arrayB[0].length; j++){
          matrixB[i][j] = parseInt(arrayB[i][j], 10);
        }
      }
    }
    func = $("input:radio[name='method']:checked").val();
    var answer = $("#answer");
    answer.empty();
    if(func == 'multiply'){
      var ans = multiply(matrixA, matrixB);
      answer.append(prettify(ans, 'Answer'));
      answer.append(notDisplayCorr);
      $("#not-display-correctly").click(function(){
        answer.append($('<p />').append(prettify2(ans, 'Answer')));
      });
    }
    else if(func == 'add'){
      var ans = add(matrixA, matrixB);
      answer.append(prettify(ans, 'Answer'));
      answer.append(notDisplayCorr);
      $("#not-display-correctly").click(function(){
        answer.append($('<p />').append(prettify2(ans, 'Answer')));
      });
    }
    else if(func == 'subtract'){
      var ans = subtract(matrixA, matrixB);
      answer.append(prettify(ans, 'Answer'));
      answer.append(notDisplayCorr);
      $("#not-display-correctly").click(function(){
        answer.append($('<p />').append(prettify2(ans, 'Answer')));
      });
    }
    else if(func == 'transpose'){
      console.log(matrixB);
      if(matrixA.length !== 0 && matrixB.length !== 0){
        ansA = transpose(matrixA);
        answer.append($('<div />').append(prettify(ansA, 'Matrix 1')));
        ansB = transpose(matrixB);
        answer.append($('<div />').append(prettify(ansB, 'Matrix 2')));
        answer.append(notDisplayCorr);
        $("#not-display-correctly").click(function(){
          answer.append($('<p />').append(prettify2(ansA, 'Matrix 1')));
          answer.append($('<p />').append(prettify2(ansB, 'Matrix 2')));
        });

      }
      else if(matrixA.length !== 0){
        ansA = transpose(matrixA);
        answer.append($('<div />').append(prettify(ansA, 'Matrix 1')));
        answer.append(notDisplayCorr);
        $("#not-display-correctly").click(function(){
          answer.append($('<p />').append(prettify2(ansA, 'Matrix 1')));
        });
      }
      else if(matrixB.length !== 0){
        ansB = transpose(matrixB);
        answer.append($('<div />').append(prettify(ansB, 'Matrix 2')));
        answer.append(notDisplayCorr);
        $("#not-display-correctly").click(function(){
          answer.append($('<p />').append(prettify2(ansB, 'Matrix 2')));
        });
      }
    }
  });

}

$(document).ready(function() {
  computeMatrix();
});
