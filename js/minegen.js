"use strict";

const randomNumber = (max) => {
  return Math.floor(Math.random() * max);
};

const mineGen = (mines, mineNum, max) => {
  for (let i = 0; i < mineNum; i++) {
    mines.push([randomNumber(max), randomNumber(max)]);
  }

  mines.sort();
  return mines;
};

const checkMines = (mines) => {
  let dupeCount = 0;

  for (let mine of mines) {
    for (let mine2 of mines) {
      if (mine.toString() === mine2.toString()) dupeCount++;
    }
  }

  return (dupeCount > mines.length);
};

const mineDisplay = (mines) => {
  let mineString = `\n\t`;
  for (let mine of mines) { mineString += `[${mine}] `; }
  console.log(mineString);
};

const fieldGen = (mines, max) => {
  let minefield = [];

  for (let y = 0; y < max; y++) {
    let mineRow = [];
    for (let x = 0; x < max; x++) { mineRow.push('.'); }
    minefield.push(mineRow);
  }

  for (let mine of mines) {
    minefield[mine[0]][mine[1]] = 'X';
  }

  return minefield;
};

const fieldDisplay = (minefield, max) => {
  let fieldString = ``;
  for (let row of minefield) {
    let fieldRow = `\n\t`;
    for (let mine of row) { fieldRow += `${mine}  `; }
    fieldString += fieldRow;
  }
  console.log(fieldString);
};

const rowCluesGen = (rows, max) => {

  max--;
  let rowClues = [];

  for (let i = 1; i < max; i++) {
    let A = rows[0][i-1];
    let B = rows[0][i];
    let C = rows[0][i+1];
    let D = rows[1][i-1];
    let E = rows[1][i];
    let F = rows[1][i+1];
    if (B === 'X') {
      rowClues.push('X');
    } else {
      rowClues.push(countSquares([A, C, D, E, F]));
    }
  }

  return rowClues;
};

const leftClueGen = (rows, max) => {
  let leftClues = [];

  for (let i = 1; i < max - 1; i++) {
    let A = rows[i - 1][0]; let B = rows[i - 1][1];
    let C = rows[i][0]; let D = rows[i][1];
    let E = rows[i + 1][0]; let F = rows[i + 1][1];

    if (C === 'X') {
      leftClues.push('X');
    } else {
      leftClues.push(countSquares([A, B, D, E, F]));
    }
  }

  return leftClues;
};

const rightClueGen = (rows, max) => {
  let rightClues = [];

  for (let i = 1; i < max - 1; i++) {
    let A = rows[i - 1][0]; let B = rows[i - 1][1];
    let C = rows[i][0]; let D = rows[i][1];
    let E = rows[i + 1][0]; let F = rows[i + 1][1];

    if (C === 'X') {
      rightClues.push('X');
    } else {
      rightClues.push(countSquares([A, B, D, E, F]));
    }
  }

  return rightClues;
};

const outerClueGen = (minefield, corners, max) => {

  let topClues = [corners[0]];
  let rowClues = rowCluesGen([minefield[0], minefield[1]], max);

  for (let clue of rowClues) { topClues.push(clue); }

  topClues.push(corners[1]);

  ///////////////////////////////////////////////////////////////////////

  let leftRows = [];

  for (let i = 0; i < max; i++) {
    leftRows.push([minefield[i][0], minefield[i][1]]);
  }

  let leftClues = leftClueGen(leftRows, max);

  ///////////////////////////////////////////////////////////////////////

  let rightRows = [];

  for (let i = 0; i < max; i++) {
    rightRows.push([minefield[i][max - 1], minefield[i][max - 2]]);
  }
  let rightClues = rightClueGen(rightRows, max);

  ///////////////////////////////////////////////////////////////////////

  let bottomClues = [corners[2]];
  rowClues = rowCluesGen([minefield[max-1],minefield[max-2]], max);

  for (let clue of rowClues) { bottomClues.push(clue); }
  bottomClues.push(corners[3]);

  return {
    top: topClues,
    left: leftClues,
    right: rightClues,
    bottom: bottomClues
  };
};

const cornerClueGen = (minefield, max) => {
  max--;

  let corners = [
    { corner: minefield[0][0],
      squares: [minefield[0][1],
        minefield[1][0],
        minefield[1][1]]
    },
    { corner: minefield[0][max],
      squares: [minefield[0][max - 1],
        minefield[1][max - 1],
        minefield[1][max]]
    },
    { corner: minefield[max][0],
      squares: [minefield[max - 1][0],
        minefield[max - 1][1],
        minefield[max][1]]
    },
    { corner: minefield[max][max],
      squares: [minefield[max - 1][max - 1],
        minefield[max - 1][max],
        minefield[max][max - 1]]
    }
  ];

  let cornerClues = [];

  for (let corner of corners) {
    if (corner.corner === 'X') {
      cornerClues.push('X')
    } else {
      cornerClues.push(countSquares(corner.squares));
    }
  }

  return cornerClues;
};

const bodyClueGen = (minefield, max) => {

  let bodyClues = [];

  for (let y = 1; y < max - 1; y++) {
    let bodyRow = [];

    for (let x = 1; x < max - 1; x++) {
      const A = minefield[(y - 1)][(x - 1)];
      const B = minefield[(y - 1)][x];
      const C = minefield[(y - 1)][(x + 1)];

      const D = minefield[y][(x - 1)];
      const E = minefield[y][x];
      const F = minefield[y][(x + 1)];

      const G = minefield[(y + 1)][(x - 1)];
      const H = minefield[(y + 1)][x];
      const I = minefield[(y + 1)][(x + 1)];

      if (E === 'X') {
        bodyRow.push('X')
      } else {
        bodyRow.push(countSquares([A, B, C, D, F, G, H, I]));
      }
    }
    bodyClues.push(bodyRow);
  }

  return bodyClues;
};

const clueGen = (minefield, max) => {

  let bodyClues = bodyClueGen(minefield, max);
  let cornerClues = cornerClueGen(minefield, max);
  let outerClues = outerClueGen(minefield, cornerClues, max);

  let mineClues = [];

  let clueRow = [];
  for (let clue of outerClues.top) { clueRow.push(clue); }
  mineClues.push(clueRow);

  bodyClues.forEach((row, i) => {
    clueRow = [];
    clueRow.push(outerClues.left[i]);
    for (let clue of row) { clueRow.push(clue); }
    clueRow.push(outerClues.right[i]);
    mineClues.push(clueRow);
  });

  clueRow = [];
  for (let clue of outerClues.bottom) { clueRow.push(clue); }
  mineClues.push(clueRow);

  return mineClues;
};

const countSquares = (squares) => {
  let count = 0;
  for (let square of squares) { if (square === 'X') count++; }
  return (count > 0) ? count : '.';
};

const displayField = (clues, rows, cols) => {
  let minePlots = {
    displayString: ``,
    plots: []}
  ;
  for (let y = 0; y < rows; y++) {
    minePlots.displayString += `<div class="row">`;
    for (let x = 0; x < cols; x++) {
      minePlots.displayString += `<div class="field" id="plot-${y}-${x}"></div>`;
    }
    minePlots.displayString += `</div>`;
  }

  return minePlots;
};