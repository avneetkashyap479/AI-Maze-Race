import { createGrid } from "./utils/grid.js";
import { bfs } from "./algorithms/bfs.js";
import { dfs } from "./algorithms/dfs.js";
import { astar } from "./algorithms/astar.js";
import { bestFirst } from "./algorithms/bestfirst.js";

const rows = 20;
const cols = 20;

let baseGrid = createGrid(rows, cols);
let grids = {};

const winnerText = document.getElementById("winner");
const startBtn = document.getElementById("startBtn");
const resetBtn = document.getElementById("resetBtn");

// 🔁 Clone grid (important so each algo gets same maze)
function cloneGrid(grid) {
  return grid.map(row =>
    row.map(cell => ({
      ...cell,
      div: null
    }))
  );
}

// 🎨 Draw grid
function drawGrid(grid, id) {
  const container = document.getElementById(id);
  container.innerHTML = "";

  grid.forEach(row => {
    row.forEach(cell => {
      let div = document.createElement("div");
      div.classList.add("cell");

      if (cell.isWall) div.classList.add("wall");

      cell.div = div;
      container.appendChild(div);
    });
  });

  let start = grid[0][0];
  let goal = grid[rows - 1][cols - 1];

  // 🔥 Ensure start & goal are NOT walls
  start.isWall = false;
  goal.isWall = false;

  start.div.classList.add("start");
  goal.div.classList.add("goal");

  return { start, goal };
}

// 🎯 Visit node (coloring)
function visit(node, type) {
  if (
    !node.div.classList.contains("start") &&
    !node.div.classList.contains("goal")
  ) {
    node.div.classList.add(type);
  }
}

// 🚀 Start race
async function startRace() {
  winnerText.textContent = "Running...";

  grids = {
    bfs: cloneGrid(baseGrid),
    dfs: cloneGrid(baseGrid),
    astar: cloneGrid(baseGrid),
    best: cloneGrid(baseGrid),
  };

  const bfsData = drawGrid(grids.bfs, "grid-bfs");
  const dfsData = drawGrid(grids.dfs, "grid-dfs");
  const astarData = drawGrid(grids.astar, "grid-astar");
  const bestData = drawGrid(grids.best, "grid-best");

  const result = await Promise.race([
    bfs(bfsData.start, bfsData.goal, grids.bfs, visit),
    dfs(dfsData.start, dfsData.goal, grids.dfs, visit),
    astar(astarData.start, astarData.goal, grids.astar, visit),
    bestFirst(bestData.start, bestData.goal, grids.best, visit),
  ]);

  winnerText.textContent = result ? `Winner: ${result.winner}` : "No Path";
}

// 🔄 RESET (🔥 FIXED VERSION)
function resetGrid() {
  // Create new maze
  baseGrid = createGrid(rows, cols);

  // Clone for all algorithms
  grids = {
    bfs: cloneGrid(baseGrid),
    dfs: cloneGrid(baseGrid),
    astar: cloneGrid(baseGrid),
    best: cloneGrid(baseGrid),
  };

  // 🔥 Draw immediately (THIS WAS MISSING BEFORE)
  drawGrid(grids.bfs, "grid-bfs");
  drawGrid(grids.dfs, "grid-dfs");
  drawGrid(grids.astar, "grid-astar");
  drawGrid(grids.best, "grid-best");

  winnerText.textContent = "Winner: None";
}

// 🎯 Button events
startBtn.onclick = startRace;
resetBtn.onclick = resetGrid;

// 🔥 INITIAL LOAD (so grids show immediately)
resetGrid();