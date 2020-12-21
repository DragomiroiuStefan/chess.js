class ChessBoard {
  constructor() {
    this.pieces = [];
    for (let i = 0; i < 8; i++) {
      this.pieces[i] = [];
    }

    // this.addBottomPieces("white");
    // this.addBottomPieces("black");

    //Add pawns
    for (let i = 0; i < 8; i++) {
      this.pieces[i][1] = new Pawn("white");
      this.pieces[i][6] = new Pawn("black");
    }
  }

  addBottomPieces(color) {
    let yCoord = color === "white" ? 0 : 6;
    this.pieces[0][yCoord] = new Rook(color);
    this.pieces[1][yCoord] = new Knight(color);
    this.pieces[2][yCoord] = new Bishop(color);
    this.pieces[3][yCoord] = new King(color);
    this.pieces[4][yCoord] = new Queen(color);
    this.pieces[5][yCoord] = new Bishop(color);
    this.pieces[6][yCoord] = new Knight(color);
    this.pieces[7][yCoord] = new Rook(color);
  }

  movePiece(oldPosition, newPosition) {
    this.pieces[newPosition.x][newPosition.y] = this.pieces[oldPosition.x][oldPosition.y];
    this.pieces[oldPosition.x][oldPosition.y] = undefined;
  }
}

class ChessPiece {
  constructor(color) {
    this.color = color;
  }
}

class Pawn extends ChessPiece {
  move(oldPosition, newPosition, chessBoard) {
    for (const legalMove of getLegalMoves(oldPosition, chessBoard)) {
      if (newPosition.x === legalMove.x && newPosition.y === legalMove.y) {
        chessBoard.movePiece(oldPosition, newPosition);
      }
    }
  }
  getLegalMoves(position, chessBoard) {
    let legalMoves = [];
    if (this.color === "white") {
      // Check if move forward is legal
      if (position.y < 7 && !chessBoard.pieces[position.x][position.y + 1]) {
        legalMoves.push({x: position.x, y: position.y + 1});
      }
      // Check if move forward 2 cells is legal
      if (position.y === 1 && !chessBoard.pieces[position.x][position.y + 2]) {
        legalMoves.push({x: position.x, y: position.y + 2});
      }
      // Check if capture left is a legal move
      if (chessBoard.pieces[position.x + 1][position.y + 1]) {
        legalMoves.push({x: position.x + 1, y: position.y + 1});
      }
      // Check if capture right is a legal move
      if (chessBoard.pieces[position.x - 1][position.y + 1]) {
        legalMoves.push({x: position.x - 1, y: position.y + 1});
      }
    } else {
      // todo for black
    }
    return legalMoves;
  }
}

//-----------GUI----------------

const SELECTED_CELL_COLOR = "yellow";
const CHECK_COLOR = "red";
const CELL_COLLOR_1 = "cornsilk";
const CELL_COLLOR_2 = "#863403";
const LEGAL_MOVES_COLOR = "green"

let chessBoard = new ChessBoard();

// Make pieces selectable
const cells = document.querySelectorAll("td");
for (let i = 0; i < cells.length; i++) {
  cells[i].addEventListener("click", function () {
    let coords = getPositionCoords(this.id);

    if (this.style.backgroundColor !== SELECTED_CELL_COLOR) {
      this.style.backgroundColor = SELECTED_CELL_COLOR;
    } else {
      if ((coords.x % 2 != 0 && coords.y % 2 != 0) || 
      (coords.x % 2 == 0 && coords.y % 2 == 0)) {
        this.style.backgroundColor = CELL_COLLOR_1;
      } else {
        this.style.backgroundColor = CELL_COLLOR_2;
      }
    }
    const selectedPiece = chessBoard.pieces[coords.x - 1][coords.y - 1];
    const legalMoves = selectedPiece.getLegalMoves({x: coords.x - 1, y: coords.y - 1}, chessBoard);
    for (const legalMove of legalMoves) {
      const id = getChessPositionFromArrayIndexes(legalMove);
      document.getElementById(id).style.backgroundColor = "green"
    }
  });
}

// Make pieces selectable - TODO not working
// const cells = document.querySelectorAll("td");
// for (let i = 0; i < cells.length; i++) {
//   cells[i].addEventListener("click", function () {
//     if (!selectedCell.id) {
//       selectedCell.id = this.id;
//       selectedCell.color = this.style.backgroundColor;
//       this.style.backgroundColor = SELECTED_CELL_COLOR;
//     } else {
//       selectedCell.id = this.id;
//       selectedCell.color = this.style.backgroundColor;
//       this.style.backgroundColor = SELECTED_CELL_COLOR;

//       document.getElementById(selectedCell.id).style.backgroundColor = selectedCell.color;
//     }
//   });
// }

// For simpler calculations chess letter position are converted to numbers
function getPositionCoords(position) {
  const conversions = {
    A: 8,
    B: 7,
    C: 6,
    D: 5,
    E: 4,
    F: 3,
    G: 2,
    H: 1,
  };
  const xCoord = conversions[position[0]];
  return {x: xCoord, y: position[1]};
}

function getChessPositionFromArrayIndexes(coords) {
  const conversions = {
    8: "A",
    7: "B",
    6: "C",
    5: "D",
    4: "E",
    3: "F",
    2: "G",
    1: "H",
  };
  return conversions[coords.x + 1] + (coords.y + 1);
}
