// ** Connect Four
//   *
//   *
//   Player 1 and 2 alternate turns.On each turn, a piece is dropped down a *
//   column until a player gets four - in -a - row(horiz, vert, or diag) or until *
//   board fills(tie) 

//   /

let WIDTH = 7;
let HEIGHT = 6;

let currPlayer = 1; // active player: 1 or 2
let board = []; // array of rows, each row is array of cells  (board[y][x])
let endOfGame = false;

/** makeBoard: create in-JS board structure:
 *    board = array of rows, each row is array of cells  (board[y][x])
 */

function makeBoard() {
  //set "board" to empty HEIGHT x WIDTH matrix array
  const board = new Array(HEIGHT).fill(null).map(() => new Array(WIDTH).fill(null));
  return board;
}

/** makeHtmlBoard: make HTML table and row of column tops. */

function makeHtmlBoard() {
  // get "htmlBoard" variable from the item in HTML w/ID of "board"
  let htmlBoard = document.getElementById("board");
  let top = document.createElement("tr");
  top.setAttribute("id", "column-top");
  top.addEventListener("click", handleClick); //we add an eventListener to the top

  for (let x = 0; x < WIDTH; x++) { //we loop over all values of the colums 
    let headCell = document.createElement("td"); // we create a td which allows us to modify it CSS
    headCell.setAttribute("id", x); // and give each id of x a td
    top.append(headCell); //append each head cell to the top row
  }
  htmlBoard.append(top); //append top to htmlBoard so it's on the board div.
  //There! we have our clickable top row.

  for (let y = 0; y < HEIGHT; y++) { //let's iterate through the rows
    const row = document.createElement("tr"); //creating a tr for each
    for (let x = 0; x < WIDTH; x++) { //let's iterate through the cells in each row
      const cell = document.createElement("td"); //creating a td for each
      cell.setAttribute("id", `${y}-${x}`); //let's give each cell its id
      row.append(cell); //and append them to each row
    }
    htmlBoard.append(row); //then we append each row to the htmlBoard, and it's finished!
  }
}

/** findSpotForCol: given column x, return top empty y (null if filled) */
board = makeBoard();

function findSpotForCol(x) {

  for (let y = HEIGHT - 1; y >= 0; y--) { //iterating through columns backwards, excepting the top row so you can't put a piece there
    if (!board[y][x]) { //if you've got an empty spot
      return y; //return y as the spot
    }
  }
  return null; //else, return null
}

/** placeInTable: update DOM to place piece into HTML table of board */

function placeInTable(y, x) {
  // TODO: make a div and insert into correct table cell
  let piece = document.createElement("div"); //creating a div for the pice
  piece.setAttribute("class", "piece"); //giving it a class of "piece"
  piece.classList.add("flip-horizontal-bottom");
  if (currPlayer === 1) { //if currPlayer is one.. 
    piece.classList.add("p1"); //give it the proper CSS class
  }
  if (currPlayer === 2) { //if currPlayer is two.. 
    piece.classList.add("p2"); //give it the proper CSS class
  }
  let cell = document.getElementById(`${y}-${x}`); //get the cell
  cell.append(piece); //append the piece to the cell so it shows up on click
}
/** endGame: announce game end */
function endGame(msg) {
  alert(msg); //give an alert
}
/** handleClick: handle click of column top to play piece */
function handleClick(evt) {

  if (endOfGame) {
    return alert("Game is over!"); // we short-circuit and end the handleClick function here if gameOver is true
  }

  // get x from ID of clicked cell, + coerces value into number
  let x = +evt.target.id;
  // get next spot in column (if none, ignore click)
  let y = findSpotForCol(x);
  if (y === null) {
    return;
  }
  // place piece in board and add to HTML table
  // add line to update in-memory board
  board[y][x] = currPlayer;
  placeInTable(y, x);
  // check for tie
  if (board.every(row => row.every(cell => cell))) {
    return endGame('Tie!');
  }
  // check for win

  if (checkForWin()) {
    endOfGame = true;
    setTimeout(function () {
        winText = document.getElementById("win-txt")
        winText.innerHTML = `Player ${currPlayer} won!`;
        //stopping clicking after win
        // document.getElementById('td').onclick = function () {
        //   this.disabled = true;
        // }
        this.removeEventListener("click", handleClick);
      },
      1000)
    // endGame(`Player ${currPlayer} won!`);

  }


  // check for tie
  // check if all cells in board are filled; if so, call endGame



  // switch players
  //  switch currPlayer 1 <-> 2
  currPlayer = currPlayer === 1 ? 2 : 1;
}

/** checkForWin: check board cell-by-cell for "does a win start here?" */

function checkForWin() {
  function _win(cells) {
    // Check four cells to see if they're all color of current player
    //  - cells: list of four (y, x) cells
    //  - returns true if all are legal coordinates & all match currPlayer

    return cells.every(
      ([y, x]) =>
      y >= 0 &&
      y < HEIGHT &&
      x >= 0 &&
      x < WIDTH &&
      board[y][x] === currPlayer
    );
  }

  for (let y = 0; y < HEIGHT; y++) { //iterating through columns
    for (let x = 0; x < WIDTH; x++) { //iterating through rows
      let horiz = [ //creating horiz, which equals a lineup of cells with x-coordinates
        //incrementing by one to make a horizontal line
        [y, x],
        [y, x + 1],
        [y, x + 2],
        [y, x + 3]
      ];
      let vert = [ //creating vert, which equals any lineup of cells with the value of 
        //each row increasing by 1 to make a vertical line
        [y, x],
        [y + 1, x],
        [y + 2, x],
        [y + 3, x]
      ];
      let diagDR = [ //this diagonal will go up to the right due to the coordinates 
        //incrementing by one each time
        [y, x],
        [y + 1, x + 1],
        [y + 2, x + 2],
        [y + 3, x + 3]
      ];
      diagDL = [ //this diagonal will go down to the left due to the x-coordinates each 
        //decrementing by one each time (that's down) and the y-coordinates incrementing
        //by one each time(that's left)
        [y, x],
        [y + 1, x - 1],
        [y + 2, x - 2],
        [y + 3, x - 3]
      ];

      if (_win(horiz) || _win(vert) || _win(diagDR) || _win(diagDL)) {
        return true; //if any of these conditions exist, call _win()
      }
    }
  }
}

makeBoard();
makeHtmlBoard();
let button = document.getElementById("restart-btn")
button.addEventListener('click', function () {
  endOfGame = false;
  // clear the current board from the page
  const htmlBoard = document.getElementById('board');
  htmlBoard.innerHTML = "";
  // create a new empty board array and draw a new html board on the page
  board = makeBoard();
  makeHtmlBoard();
  winText.innerHTML = "";
});