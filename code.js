let lettersEl = document.querySelector("#letters");
let squareEl = document.querySelector("#squares");
let calcEl = document.querySelector("#calc");
let actualLettersEl = document.querySelector("#actual-letters");

let letters;
let board;

lettersEl.addEventListener("keyup", refreshLetters);

calcEl.addEventListener("click", () => {
  let newBoard = board.calculate();
  if (newBoard.special[0] === null) {
    calcEl.classList.add("done");
  } else {
    calcEl.classList.remove("done");
  }
  board = newBoard;
  board.display();
});

function refreshLetters() {
  letters = new Set();
  for (let i=0; i<lettersEl.value.length; i++) {
    letters.add(lettersEl.value.charAt(i));
  }
  actualLettersEl.textContent = lettersEl.value;
  calcEl.classList.remove("done");
  generateSquares();
}

function generateSquares() {
  squareEl.innerHTML = "";
  for (let i=0; i<letters.size; i++) {
    for (let j=0; j<letters.size; j++) {
      let input = document.createElement("input");
      input.setAttribute("type", "text");
      input.classList.add("square");
      input.id = `box-${i}-${j}`;
      input.addEventListener("keyup", changeInput);
      squareEl.appendChild(input);
    }
    let br = document.createElement("br");
    squareEl.appendChild(br);
  }
}

function changeInput(event) {
  calcEl.classList.remove("done");
  saveInputs();
  board.calculate();
}

function saveInputs() {
  board = new Board(letters);
  for (let i=0; i<letters.size; i++) {
    for (let j=0; j<letters.size; j++) {
      let input = document.querySelector(`#box-${i}-${j}`);
      board.set(i, j, input.value);
    }
  }
  board.display();
}

class Board {
  constructor(letters) {
    this.letters = letters;
    this.rows = [];
    for (let i=0; i<letters.size; i++) {
      let col = [];
      for (let j=0; j<letters.size; j++) {
        col.push(new Set(letters));
      }
      this.rows.push(col);
    }
    this.special = [null, null];
  }

  display() {
    for (let i=0; i<letters.size; i++) {
      for (let j=0; j<letters.size; j++) {
        let input = document.querySelector(`#box-${i}-${j}`);
        input.setAttribute("placeholder", setDisplay(this.rows[i][j]));
        if (this.special[0] === i && this.special[1] === j) {
          input.classList.add("special");
        } else {
          input.classList.remove("special");
        }
      }
    }
  }

  set(i, j, value) {
    if (!value) {
      this.rows[i][j] = new Set(letters);
    } else {
      this.rows[i][j] = new Set(value);
    }
  }

  value(i, j) {
    return this.rows[i][j];
  }

  copy() {
    let b = new Board(this.letters);
    for (let i=0; i<letters.size; i++) {
      for (let j=0; j<letters.size; j++) {
        b.set(i, j, this.rows[i][j]);
      }
    }
    return b;
  }

  equals(other) {
    for (let i=0; i<letters.size; i++) {
      for (let j=0; j<letters.size; j++) {
        if (setDisplay(this.value(i, j)) != setDisplay(other.value(i, j))) {
          return false;
        }
      }
    }
    return true;
  }

  delete(i, j, v) {
    let has = this.rows[i][j].has(v);
    this.rows[i][j].delete(v);
    return has;
  }

  calculate() {
    let newBoard = this.copy();
    for (let i=0; i<letters.size; i++) {
      for (let j=0; j<letters.size; j++) {
        let x = this.rows[i][j];
        if (x.size === 1) {
          let found = false;
          let l = Array.from(x)[0];
          for (let j2=0; j2<letters.size; j2++) {
            if (j !== j2) {
              found = newBoard.delete(i, j2, l) || found;
            }
            if (i !== j2) {
              found = newBoard.delete(j2, j, l) || found;
            }
          }
          if (found) {
            newBoard.special = [i, j];
            return newBoard;
          }
        }
      }
    }
    return newBoard;
  }
}

function setDisplay(s) {
  let a = [];
  for (let letter of s) {
    a.push(letter);
  }
  a.sort();
  return a.join("");
}

refreshLetters();
