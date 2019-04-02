

const setField = (mines, clues, rows, cols) => {

  const minefield = document.getElementById('minefield');
  const fieldPlots = displayField(clues, rows, cols);
  minefield.innerHTML = fieldPlots.displayString;

  for (let y = 0; y < rows; y++) {
    for (let x = 0; x < cols; x++) {
      fieldPlots.plots.push({
        plot: document.getElementById(`plot-${y}-${x}`),
        clue: clues[y][x]
      });
    }
  }

  let minePlots = [];
  for (let mine of mines) {
    minePlots.push(document.getElementById(`plot-${mine[0]}-${mine[1]}`));
  }

  fieldPlots.plots.forEach((plot) => {
    switch (plot.clue) {
      case 'X':
        plot.plot.addEventListener("click", function () {
          for (let mine of minePlots) {
            mine.style['background-color'] = 'red';
          }
          console.log(`YOU LOSE, GOOD DAY SIR`);
        });
        break;
      case '.':
        plot.plot.addEventListener("click", function () {
          plot.plot.style['background-color'] = 'lightblue';
        });
        break;
      default:
        plot.plot.addEventListener("click", function () {
          plot.plot.style['background-color'] = 'lightblue';
          plot.plot.innerHTML = plot.clue;
        });
    }
  });

};

const main = () => {
  let mineNum = 10;
  let max = 8;
  let duplicates = false;
  let mines = [];

  do {
    mines = [];
    duplicates = false;
    mines = mineGen(mines, mineNum, max);
    duplicates = checkMines(mines);
  } while (duplicates);

  // mineDisplay(mines);

  let minefield = fieldGen(mines, max);
  // fieldDisplay(minefield, max);

  let clues = clueGen(minefield, max);
  fieldDisplay(clues);



  let game = {
    easy: {
      mineNum: 10,
      rows: 8,
      cols: 8,
      vMax: 7,
      hMax: 7,
    },
  };

    setField(mines, clues, game.easy.rows, game.easy.cols);

};

main();