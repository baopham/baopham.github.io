function dragStart(event) {
  event.dataTransfer.effectAllowed = 'move';
  event.dataTransfer.setData("Text", event.target.getAttribute('id'));
}

function dragOver(event) {
  return false;
}

function isBlocked(elemPos, targetPos, direction, pieces) {
  if (direction == 'vertical') {
    if (targetPos > elemPos) {
      //Anthing in btw?
      for (var i = elemPos + 8; i < targetPos; i += 8) {
        if (pieces[i] == 1) {
          return true;
        }
      }
      return false;
    } else {
      //Anything in btw?
      for (var j = targetPos + 8; j < elemPos; j += 8) {
        if (pieces[j] == 1) {
          return true;
        }
      }
      return false;
    }
  }

  else if (direction == 'horizontal') {
    if (targetPos > elemPos) {
      for (var i = elemPos + 1; i < targetPos; i++) {
        if (pieces[i] == 1) {
          return true;
        }
      }
      return false;
    } else {
      for (var j = targetPos + 1; j < elemPos; j++) {
        if (pieces[j] == 1) {
          return true;
        }
      }
      return false;
    }
  }

  else if (direction == 'diagonal right') {
    if (targetPos > elemPos) {
      for (var i = elemPos + 9; i < targetPos; i += 9) {
        if (pieces[i] == 1) {
          return true;
        }
      }
      return false;
    } else {
      for (var j = targetPos + 9; j < elemPos; j += 9) {
        if (pieces[j] == 1) {
          return true;
        }
      }
      return false;
    }
  }

  else if (direction == 'diagonal left') {
    if (targetPos > elemPos) {
      for (var i = elemPos + 7; i < targetPos; i += 7) {
        if (pieces[i] == 1) {
          return true;
        }
      }
      return false;
    } else {
      for (var j = targetPos + 7; j < elemPos; j += 7) {
        if (pieces[j] == 1) {
          return true;
        }
      }
      return false;
    }
  }

}

function validMove(elemIDs, targetIDs, elemColor, targetColor, pieces) {
  var elemPiece = elemIDs[1];
  var elemPos = parseInt(elemIDs[0], 10);
  var targetPos = parseInt(targetIDs[0], 10);
  var diff = Math.abs(targetPos - elemPos);

  if (elemPiece == 'pawn') {

    if (elemColor == 'black') {
      //Move one step forward with nothing in front
      if ( !pieces[elemPos + 8] && targetPos == elemPos + 8) {
        return true;
      }
      //Move two steps forward from the pawn row with nothing in between
      else if ( elemPos >= 9 && elemPos <= 16 && targetPos == elemPos + 16 && !pieces[elemPos + 8]) {
        return true;
      }
      //Move diagonally one step only to kill enemy
      else if (targetColor != elemColor && targetColor != 'none') {
        if (diff == 9 || diff == 7) {
          return true;
        }
      }
    }

    else {
      //Move one step forward with nothing in front
      if ( pieces[elemPos - 8] === 0 && targetPos == elemPos - 8) {
        return true;
      }
      //Move two steps forward from the pawn row with nothing in between
      else if ( elemPos >= 49 && elemPos <= 56 && targetPos == elemPos - 16 && !pieces[elemPos - 8]) {
        return true;
      }
      //Move diagonally one step only to kill enemy
      else if (targetColor != elemColor && targetColor != 'none') {
        if (diff == 9 || diff == 7) {
          return true;
        }
      }
    }
  }

  else if (elemPiece == 'rook') {
    //Move vertically or horrizontally
    if ( diff % 8 === 0 && !isBlocked(elemPos, targetPos, 'vertical', pieces) )
      return true;
    else if ( diff % 9 !== 0 && diff % 7 !== 0 && !isBlocked(elemPos, targetPos, 'horizontal', pieces) )
      return true;
  }

  else if (elemPiece == 'bishop') {
    //Move diagonally
    if ( diff % 9 === 0 && !isBlocked(elemPos, targetPos, 'diagonal right', pieces) )
      return true;
    else if ( diff % 7 === 0 && !isBlocked(elemPos, targetPos, 'diagonal left', pieces) )
      return true;
  }

  else if (elemPiece == 'knight') {
    if ( (elemPos + 1) + (2 * 8) ==  targetPos || (elemPos + 1) - (2 * 8) == targetPos ) {
      return true;
    }
    else if ( (elemPos - 1) + (2 * 8) == targetPos || (elemPos - 1) - (2 * 8) == targetPos ) {
      return true;
    }
    else if ( (elemPos - 8) + 2 == targetPos || (elemPos - 8) - 2 == targetPos ) {
      return true;
    }
    else if ( (elemPos + 8) + 2 == targetPos || (elemPos + 8) - 2 == targetPos ) {
      return true;
    }
  }

  else if (elemPiece == 'queen') {
    if ( diff % 8 === 0 && !isBlocked(elemPos, targetPos, 'vertical', pieces) )
      return true;
    else if ( diff % 9 === 0 && !isBlocked(elemPos, targetPos, 'diagonal right', pieces) )
      return true;
    else if ( diff % 7 === 0 && !isBlocked(elemPos, targetPos, 'diagonal left', pieces) )
      return true;
    else if ( diff % 9 !== 0 && diff % 7 !== 0 && !isBlocked(elemPos, targetPos, 'horizontal', pieces) )
      return true;
  }

  else if (elemPiece == 'king') {
    if (targetPos > elemPos) {
      if ( (diff == 8 && !pieces[elemPos + 8])  ||
          (diff == 1 && !pieces[elemPos + 1])  ||
            (diff == 9 && !pieces[elemPos + 9])  ||
              (diff == 7 && !pieces[elemPos + 7])) {
        return true;
      }
    } else {
      if ( (diff == 8 && !pieces[elemPos - 8])  ||
          (diff == 1 && !pieces[elemPos - 1])  ||
            (diff == 9 && !pieces[elemPos - 9])  ||
              (diff == 7 && !pieces[elemPos - 7])) {
        return true;
      }
    }
  }

  return false;

}

//Store pieces and their position
var PIECES = {};
for (var i = 1; i <= 16; i++) {
  PIECES[i] = 1;
}
for (var j = 49; j <= 64; j++) {
  PIECES[j] = 1;
}
for (var k = 17; k <= 48; k++) {
  PIECES[k] = 0;
}

function drop(event) {

  var coordinate = event.dataTransfer.getData("Text");
  var element = document.getElementById(coordinate);

  var targetClasses = event.target.getAttribute('class').split(' ');
  var targetIDs = event.target.getAttribute('id').split('-');

  var elementClasses = element.getAttribute('class').split(' ');
  var elementIDs = element.getAttribute('id').split('-');


  //You don't want to kill your own PIECES
  //And enforce chess rules
  if( targetClasses[0] != elementClasses[0] && validMove(elementIDs, targetIDs, elementClasses[0], targetClasses[0], PIECES) ){
    event.target.innerHTML = element.innerHTML; // Move piece to new cell
    var newclass = elementClasses[0] + ' ' + targetClasses[1];
    var newID = targetIDs[0] + '-' + elementIDs[1];

    //Set new attrs to the new cell
    event.target.setAttribute('class', newclass);
    event.target.setAttribute('id', newID);
    event.target.setAttribute('draggable', 'true');

    element.innerHTML = ""; // Clear old cell
    element.setAttribute('draggable', 'false'); // Make the old cell undraggable
    element.setAttribute('class', 'none ' + elementClasses[1]); //Change the old cell's class names
    element.setAttribute('id', elementIDs[0]); //Set old cell's id to its position with no piece name

    //Update the dictionary
    var elemPos = parseInt(elementIDs[0], 10);
    var targetPos = parseInt(targetIDs[0], 10);
    PIECES[elemPos] = 0;
    PIECES[targetPos] = 1;

  }
  event.preventDefault();
  return false;
}

function storeNotes(id) {
  var notes = document.getElementById('editable').innerHTML;
  localStorage.setItem('userScribble',notes);
}

function getNotes() {
  if ( localStorage.getItem('userScribble')) {
    var notes = localStorage.getItem('userScribble');
  }
  else {
    var notes = "<h3>Go ahead, edit me</h3><p>Write down your strategies so you won't forget and for next time you visit my blog!</p>";
  }
  document.getElementById('editable').innerHTML = notes;
}

$(document).ready(function() {
  getNotes();
  $("#clearNotes").click( function () {
    localStorage.clear();
  });
  $("#resetChess").click( function () {
    window.location = window.location;
  });
});
