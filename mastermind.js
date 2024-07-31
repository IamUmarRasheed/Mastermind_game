let board = [];
let currentguess = [];
let solution = [];
const colors = ["red", "green", "blue", "yellow"];
const turns = 10;
const pegs = 4;
let allowDuplicates = true;

function correctPattern() {
  solution = [];

  if (allowDuplicates) {
    for (let i = 0; i < pegs; i++) {
      console.log("Duplicate pattern");
      const random_color = colors[Math.floor(Math.random() * colors.length)];
      solution.push(random_color);
    }
  } else {
    const copycolors = [...colors];
    for (let i = 0; i < pegs; i++) {
      let randomindex = Math.floor(Math.random() * copycolors.length);
      solution.push(copycolors[randomindex]);
      copycolors.splice(randomindex, 1);
    }
  }
  console.log(solution);
}

function createBoard() {
  board = [];
  const mainBoard = document.getElementById("board");
  mainBoard.innerHTML = "";
  //   console.log(mainBoard.innerHTML);

  for (let i = 0; i < turns; i++) {
    const row = Array(pegs).fill("empty");
    board.push(row);
    // console.log(board);
    const rowElement = document.createElement("div");
    rowElement.classList.add("row");
    // console.log(mainBoard);
    row.forEach((_, index) => {
      const cell = document.createElement("div");
      cell.classList.add("cell", "empty");
      cell.dataset.index = index;
      rowElement.appendChild(cell);
    });

    const emptyfeedcorner = document.createElement("div");
    emptyfeedcorner.classList.add("feedback");

    for (let j = 0; j < pegs; j++) {
      const emptyfeed = document.createElement("div");
      emptyfeed.classList.add("peg", "empty-feedback");
      emptyfeedcorner.appendChild(emptyfeed);
    }
    rowElement.appendChild(emptyfeedcorner);
    mainBoard.appendChild(rowElement);
  }
}

function generateChoices() {
  const choicesContainer = document.getElementById("peg-container");
  choicesContainer.innerHTML = "";
  colors.forEach((color) => {
    {
      const choice = document.createElement("div");
      choice.classList.add("peg", color);
      choice.style.backgroundColor = color;
      choice.addEventListener("click", () => handlechoices(color));
      choicesContainer.appendChild(choice);
    }
  });
}
function handlechoices(color) {
  if (currentguess.length < pegs) {
    // console.log(color);
    // console.log("hdhd");
    currentguess.push(color);
    updateBoard();
  }
}

function handleremover() {
  if (currentguess.length > 0) {
    currentguess.pop();
    updateBoard();
  }
}

function updateBoard() {
  const currentTurn = turns - board.length;
  const currentrow = document.getElementsByClassName("row")[currentTurn];

  if (!currentrow) return;

  const cells = currentrow.getElementsByClassName("cell");

  currentguess.forEach((color, index) => {
    const cell = cells[index];
    if (cell) {
      if (color) {
        cell.classList.remove("empty");
        cell.classList.add(color);
        cell.style.backgroundColor = color;
      } else {
        cell.classList.add("empty");
        cell.classList.remove(...colors);
        cell.style.backgroundColor = "";
      }
    }
  });

  for (let i = currentguess.length; i < pegs; i++) {
    const cell = cells[i];

    if (cell) {
      cell.classList.add("empty");
      cell.classList.remove(...colors);
      cell.style.backgroundColor = "";
    }
  }
}

function checkGuess() {
  if (currentguess.length == pegs) {
    const result = getResult(currentguess);
    displayFeedback(result);
    if (result.correct == pegs) {
      document.getElementById("result").textContent = "You win!";
    } else if (board.length === 1) {
      document.getElementById(
        "result"
      ).textContent = `Game over! The correct sequence was ${solution.join(
        ", "
      )}.`;
    } else {
      board.shift();
      currentguess = [];
    }
  } else {
    alert("Please make a complete guess");
    return;
  }
}
function getResult(turn) {
  let correct = 0;
  let misplaced = 0;
  const solutionCopy = [...solution];
  const turnCopy = [...turn];

  for (let i = 0; i < pegs; i++) {
    if (turnCopy[i] == solutionCopy[i]) {
      correct++;
      solutionCopy[i] = null;
      turnCopy[i] = null;
    }
  }

  for (let i = 0; i < pegs; i++) {
    if (turnCopy[i]) {
      const indexofmismatch = solutionCopy.indexOf(turnCopy[i]);
      if (indexofmismatch !== -1) {
        misplaced++;
        solutionCopy[indexofmismatch] = null;
      }
    }
  }
  return { correct, misplaced };
}

function displayFeedback(result) {
  const currentTurn = turns - board.length;
  const rowElemnt = document.getElementsByClassName("row")[currentTurn];
  const feedbackElement = rowElemnt.getElementsByClassName("feedback")[0];
  feedbackElement.innerHTML = "";

  for (let i = 0; i < result.correct; i++) {
    const pegs = document.createElement("div");
    pegs.classList.add("peg", "correct");
    feedbackElement.appendChild(pegs);
  }

  for (let i = 0; i < result.misplaced; i++) {
    const pegs = document.createElement("div");
    pegs.classList.add("peg", "misplaced");
    feedbackElement.appendChild(pegs);
  }
}

function restartGame() {
  document.getElementById("result").textContent = "";
  currentguess = [];
  createBoard();
  correctPattern();
  generateChoices();
}

document
  .getElementById("remove-color")
  .addEventListener("click", handleremover);

document.getElementById("allow-duplicates").addEventListener("change", (e) => {
  allowDuplicates = e.target.checked;
  console.log(allowDuplicates);
  restartGame();
});

document.getElementById("restart").addEventListener("click", restartGame);
document.getElementById("check-guess").addEventListener("click", checkGuess);

correctPattern();
createBoard();
generateChoices();
