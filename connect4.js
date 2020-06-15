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

/** makeBoard: create in-JS board structure:
 *    board = array of rows, each row is array of cells  (board[y][x])
 */

function makeBoard() {
  //set "board" to empty HEIGHT x WIDTH matrix array
  const board = new Array(WIDTH).fill(null).map(() => new Array(HEIGHT).fill(null));
  return board;
}

/** makeHtmlBoard: make HTML table and row of column tops. */

function makeHtmlBoard() {
  // get "htmlBoard" variable from the item in HTML w/ID of "board"
  let htmlBoard = document.getElementById("board");
  // we need to add an EventListener for the top row.
  //This allows us to start the logic on the player's click.
  // We set the top row, creating it in the DOM and then giving it
  // an id of 'column-top', after which we give it an addEventListener.
  // We are essentially working with a table, so we loop over the columns and
  // create a td for each one with an id of x. We then append it to the top 
  // of the column. That's why the CSS can make each border dashed and
  // add yellow on hover. After all this we append the top to the htmlBoard so 
  // it's on the board div.
  let top = document.createElement("tr");
  top.setAttribute("id", "column-top");
  top.addEventListener("click", handleClick);

  for (let x = 0; x < WIDTH; x++) {
    let headCell = document.createElement("td");
    headCell.setAttribute("id", x);
    top.append(headCell);
  }
  htmlBoard.append(top);

  //  Now we are iterating through the rows, creating a tr for each. 
  //  Like with the top row of clickable squares we also iterate through the 
  //  columns to give them rows of cells with ids of td. We need the inner loop to access the 
  //  cells because it is a two-dimensional array.  Now we give each cell an id of y-x,
  //  and append each cell to its row. At the end, we append the rows to the htmlBoard.
  for (let y = 0; y < HEIGHT; y++) {
    const row = document.createElement("tr");
    for (let x = 0; x < WIDTH; x++) {
      const cell = document.createElement("td");
      cell.setAttribute("id", `${y}-${x}`);
      row.append(cell);
    }
    htmlBoard.append(row);
  }
}

/** findSpotForCol: given column x, return top empty y (null if filled) */
let newBoard = makeBoard();

function findSpotForCol(x) {
  console.log(newBoard); // Checking whole board
  console.log(newBoard[x]); // Checking col
  col = newBoard[x];
  let y = col.lastIndexOf(null);
  col[y] = currPlayer;
  console.log(newBoard[x]); // Checking col to see if now placed correctly
  return y;
}

/** placeInTable: update DOM to place piece into HTML table of board */

function placeInTable(y, x) {
  // TODO: make a div and insert into correct table cell
  let piece = document.createElement("div");
  piece.setAttribute("class", "piece");
  if (currPlayer === 1) {
    piece.classList.add("p1");
  }
  if (currPlayer === 2) {
    piece.classList.add("p2");
  }
  let cell = document.getElementById(`${y}-${x}`);
  cell.append(piece);
}

/** endGame: announce game end */

function endGame(msg) {
  msg = "Game over!";
  alert(msg);
}

/** handleClick: handle click of column top to play piece */

function handleClick(evt) {
  // get x from ID of clicked cell, + coerces value into number
  let x = +evt.target.id;

  // get next spot in column (if none, ignore click)
  let y = findSpotForCol(x);
  if (y === null);

  // place piece in board and add to HTML table
  // TODO: add line to update in-memory board
  newBoard[y][x] = currPlayer;

  placeInTable(y, x);

  // check for win
  if (checkForWin()) {
    endGame(`Player ${currPlayer} won!`);
  }

  // check for tie
  // TODO: check if all cells in board are filled; if so call, call endGame
  function checkEvery(cell) {
    if (newBoard.every(typeof cell === null)) {
      endGame()
    };
  };

  checkEvery();
  // switch players
  // TODO: switch currPlayer 1 <-> 2
  function switchPlayers(currPlayer) {
    return (currPlayer === 1 ? 2 : 1);
  }
  switchPlayers();
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

  // TODO: read and understand this code. Add comments to help you.

  for (let y = 0; y < HEIGHT; y++) {
    for (let x = 0; x < WIDTH; x++) {
      let horiz = [
        [y, x],
        [y, x + 1],
        [y, x + 2],
        [y, x + 3]
      ];
      let vert = [
        [y, x],
        [y + 1, x],
        [y + 2, x],
        [y + 3, x]
      ];
      let diagDR = [
        [y, x],
        [y + 1, x + 1],
        [y + 2, x + 2],
        [y + 3, x + 3]
      ];
      diagDL = [
        [y, x],
        [y + 1, x - 1],
        [y + 2, x - 2],
        [y + 3, x - 3]
      ];

      if (_win(horiz) || _win(vert) || _win(diagDR) || _win(diagDL)) {
        return true;
      }
    }
  }
}

makeBoard();
makeHtmlBoard();