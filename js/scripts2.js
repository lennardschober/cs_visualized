/*!
* Start Bootstrap - Grayscale v7.0.6 (https://startbootstrap.com/theme/grayscale)
* Copyright 2013-2023 Start Bootstrap
* Licensed under MIT (https://github.com/StartBootstrap/startbootstrap-grayscale/blob/master/LICENSE)
*/
//
// Scripts
// 

/*
 *
 * GLOBAL VARIABLES
 *
 */
let globalGrid = 0;
let animationGrid = 0;
let weightGrid = 0;
let cellWidth = 25;
let cellHeight = 25;
const padding = 1;
let sRow, sCol, tRow, tCol = 0;
let canvas = document.getElementById('pathfindingCanvas');
let ctx = canvas.getContext('2d');
let globalSpeed = 1;
let globalAlgo = 0;
let visBtnText = "choose algo";
let printedW = 0;
let aStarHeuristic = "manhattan";
let gottaStop = 0;
let globalObstacle = "wall";
let changedRow = -1;
let changedCol = -1;
let canMove = 0;
let stopper = 0;
let startX = -1;
let startY = -1;


/*
 *
 * EVENT LISTENERS
 *
 */

// called when first loading the page
window.addEventListener('DOMContentLoaded', event => {
    initializeGrid();
    drawGrid();
    // Function to set active navbar item
    var setActiveNavItem = function (navItemSelector) {
        const navbarLinks = document.querySelectorAll('.nav-link');
        navbarLinks.forEach(link => {
            if (link.getAttribute('href') === navItemSelector) {
                link.classList.add('active');
            } else {
                link.classList.remove('active');
            }
        });
    };

    // Navbar shrink function
    var navbarShrink = function () {
        const navbarCollapsible = document.body.querySelector('#mainNav');
        var navbarHeight = document.getElementById('mainNav').offsetHeight; // Get the height of the navbar
        // get distance from top of doc to top of section (accounting for navbar)
        var projects = document.getElementById('projects');
        var top1 = projects.getBoundingClientRect().top + window.scrollY - navbarHeight;
        var contact = document.getElementById('contact');
        var top2 = contact.getBoundingClientRect().top + window.scrollY - navbarHeight;
        var scrollPos = window.scrollY;

        if (!navbarCollapsible) {
            return;
        }
        // decide which navbar to show depending on scroll position
        if (scrollPos < top1) { // transparent navbar
            navbarCollapsible.classList.remove('navbar-shrink');
            navbarCollapsible.classList.remove('navbar-shrink2');
            setActiveNavItem('#home'); // Set the home element as active
        } else if (scrollPos >= top1 && scrollPos < top2) { // white navbar
            navbarCollapsible.classList.remove('navbar-shrink2');
            navbarCollapsible.classList.add('navbar-shrink');
            setActiveNavItem('#projects'); // Set the projects element as active
        } else { // black navbar
            navbarCollapsible.classList.remove('navbar-shrink');
            navbarCollapsible.classList.add('navbar-shrink2');
            setActiveNavItem('#contact'); // Set the contact element as active
        }
    };

    // Shrink the navbar 
    navbarShrink();

    // Shrink the navbar when page is scrolled
    document.addEventListener('scroll', navbarShrink);

    // Collapse responsive navbar when toggler is visible
    const navbarToggler = document.body.querySelector('.navbar-toggler');
    const responsiveNavItems = [].slice.call(
        document.querySelectorAll('#navbarResponsive .nav-link')
    );
    responsiveNavItems.map(function (responsiveNavItem) {
        responsiveNavItem.addEventListener('click', () => {
            if (window.getComputedStyle(navbarToggler).display !== 'none') {
                navbarToggler.click();
            }
        });
    });
    updateWindow();
});

// called when resizing the window, calls updateWindow
window.addEventListener('resize', updateWindow);

// adjusts the cell size depending on the updated window size
function updateWindow() {
    // Set canvas size to match viewport
    tempWidth = window.innerWidth; // Adjust multiplier as needed
    tempHeight = window.innerHeight - 1.2 * document.getElementById('mainNav').offsetHeight; // Adjust multiplier as needed
    let numCols = globalGrid[0].length;
    let numRows = globalGrid.length;

    // update cell size if window dimensions changed
    while (numRows * (cellHeight + padding) + padding < tempHeight) {
        cellHeight++;
    }
    while (numCols * (cellWidth + padding) + padding < tempWidth) {
        cellWidth++;
    }
    while (numRows * (cellHeight + padding) + padding > tempHeight) {
        cellHeight--;
    }
    while (numCols * (cellWidth + padding) + padding > tempWidth) {
        cellWidth--;
    }

    // set canvas dimensions so that I can center the canvas thus centering the grid
    canvas.width = numCols * (cellWidth + padding) + padding;
    canvas.height = numRows * (cellHeight + padding) + padding;

    drawGrid();
}

// Function to manually set a navbar element as active
function setActiveNavItem(navItemId) {
    const navItems = document.querySelectorAll('nav ul li');
    navItems.forEach(navItem => {
        navItem.classList.remove('active'); // Remove active class from all navbar elements
        if (navItem.querySelector('a').getAttribute('href') === navItemId) {
            navItem.classList.add('active'); // Add active class to the selected navbar element
        }
    });
}

// event listener for the dropdown items
document.querySelectorAll('.dropdown-item').forEach(item => {
    item.addEventListener('click', function () {
        const selectedFunction = this.getAttribute('data-value');
        var elem = document.getElementById("visualizeButton");
        gottaStop = 1;

        switch (selectedFunction) {
            case "bfs":
                elem.innerText = "stop!";
                toggleVisualizeButton();
                globalAlgo = "bfs";
                elem.innerText = "BFS";
                visBtnText = elem.innerText;
                break;
            case "dfs":
                elem.innerText = "stop!";
                toggleVisualizeButton();
                globalAlgo = "dfs";
                elem.innerText = "DFS";
                visBtnText = elem.innerText;
                break;
            case "astarMan":
                elem.innerText = "stop!";
                toggleVisualizeButton();
                globalAlgo = "astar";
                aStarHeuristic = "manhattan";
                elem.innerText = "A*";
                visBtnText = elem.innerText;
                break;
            case "astarEuc":
                elem.innerText = "stop!";
                toggleVisualizeButton();
                globalAlgo = "astar";
                aStarHeuristic = "euclidean";
                elem.innerText = "A*";
                visBtnText = elem.innerText;
                break;
            case "dijkstra":
                elem.innerText = "stop!";
                toggleVisualizeButton();
                globalAlgo = "dijkstra";
                elem.innerText = "Dijkstra";
                visBtnText = elem.innerText;
                break;
            case "greedyBestFirst":
                elem.innerText = "stop!";
                toggleVisualizeButton();
                globalAlgo = "greedyBestFirst";
                elem.innerText = "Greedy BeFS";
                visBtnText = elem.innerText;
                break;
            case "genEmpty":
                generateEmpty();
                break;
            case "genRandom":
                generateRandom();
                break;
            case "genRandomWeights":
                generateRandomWeights();
                break;
            case "genRandomObstaclesWeights":
                generateRandomObstaclesWeights();
                break;
            case "genRecursiveDFS":
                generateRecursiveDFS();
                break;
            case "genRecursive":
                generateRecursive(0);
                break;
            case "genRecursiveHorizontal":
                generateRecursive(1);
                break;
            case "genRecursiveVertical":
                generateRecursive(-1);
                break;
            default:
                break;
        }
    });
});

// handle mousedown events
// iterate through texts[] and see if the user
// mousedown'ed on one of them
// If yes, set the selectedText to the index of that text
// Add the event listeners for mousedown, mousemove, and mouseup
canvas.addEventListener("mousedown", (e) => {
    var elem = document.getElementById("visualizeButton");
    if (elem.innerText == "stop!") toggleVisualizeButton();

    if (!weightGrid) {
        weightGrid = Array.from({ length: globalGrid.length }, () => Array(globalGrid[0].length).fill(CellState.EMPTY));
    }

    startX = getMousePos(e).x;
    startY = getMousePos(e).y;
    // Put your mousedown stuff here
    if (textHittest(startX, startY) == "start") {
        canMove = 1;
    }
    else if (textHittest(startX, startY) == "end") {
        canMove = 2;
    }
    else {
        canMove = 3;
        mouseX = getMousePos(e).x;
        mouseY = getMousePos(e).y;
        for (var row = 0; row < globalGrid.length; row++) {
            for (var col = 0; col < globalGrid[0].length; col++) {
                if (mouseX >= col * (cellWidth + padding) + padding && mouseX <= col * (cellWidth + padding) + padding + cellWidth &&
                    mouseY >= row * (cellWidth + padding) + padding && mouseY <= row * (cellWidth + padding) + padding + cellWidth) {
                    switch (globalGrid[row][col]) {
                        case CellState.OBSTACLE:
                            if (changedCol == col && changedRow == row) continue;
                            if (globalObstacle == "wall") {
                                globalGrid[row][col] = CellState.EMPTY;
                                weightGrid[row][col] = CellState.EMPTY;
                            }
                            else {
                                globalGrid[row][col] = CellState.WEIGHT;
                                weightGrid[row][col] = CellState.WEIGHT;
                            }
                            changedRow = row;
                            changedCol = col;
                            break;
                        case CellState.WEIGHT:
                            if (changedCol == col && changedRow == row) continue;
                            if (globalObstacle == "wall") {
                                globalGrid[row][col] = CellState.OBSTACLE;
                                animationGrid[row][col] = 2;
                                weightGrid[row][col] = CellState.EMPTY;
                            }
                            else {
                                globalGrid[row][col] = CellState.EMPTY;
                                weightGrid[row][col] = CellState.EMPTY;
                            }
                            changedRow = row;
                            changedCol = col;
                            break;
                        case CellState.EMPTY:
                            if (changedCol == col && changedRow == row) continue;
                            if (globalObstacle == "wall") {
                                globalGrid[row][col] = CellState.OBSTACLE;
                                animationGrid[row][col] = 2;
                                weightGrid[row][col] = CellState.EMPTY;
                            }
                            else {
                                globalGrid[row][col] = CellState.WEIGHT;
                                weightGrid[row][col] = CellState.WEIGHT;
                            }
                            changedRow = row;
                            changedCol = col;
                            break;
                        default:
                            // do nothing
                            break;
                    }
                    resetCanvas();
                    drawGrid();
                }
            }
        }
    }
});

// handle mousemove events
window.addEventListener("mousemove", (e) => {
    if (!canMove) return;

    mouseX = getMousePos(e).x;
    mouseY = getMousePos(e).y;

    if (canMove == 1) {
        for (var row = 0; row < globalGrid.length; row++) {
            for (var col = 0; col < globalGrid[0].length; col++) {
                if (mouseX >= col * (cellWidth + padding) + padding && mouseX <= col * (cellWidth + padding) + padding + cellWidth &&
                    mouseY >= row * (cellWidth + padding) + padding && mouseY <= row * (cellWidth + padding) + padding + cellWidth) {
                    // prevent overwriting of walls / weights / end
                    if (globalGrid[row][col] != CellState.EMPTY && globalGrid[row][col] != CellState.START) continue;
                    sRow = row;
                    sCol = col;
                    globalGrid[row][col] = CellState.EMPTY;
                    resetCanvas();
                    drawGrid();
                }
            }
        }
    }
    else if (canMove == 2) {
        for (var row = 0; row < globalGrid.length; row++) {
            for (var col = 0; col < globalGrid[0].length; col++) {
                if (mouseX >= col * (cellWidth + padding) + padding && mouseX <= col * (cellWidth + padding) + padding + cellWidth &&
                    mouseY >= row * (cellWidth + padding) + padding && mouseY <= row * (cellWidth + padding) + padding + cellWidth) {
                    // prevent overwriting of walls / weights / start
                    if (globalGrid[row][col] != CellState.EMPTY && globalGrid[row][col] != CellState.END) continue;
                    tRow = row;
                    tCol = col;
                    globalGrid[row][col] = CellState.EMPTY;
                    resetCanvas();
                    drawGrid();
                }
            }
        }
    }
    else if (canMove == 3) {
        for (var row = 0; row < globalGrid.length; row++) {
            for (var col = 0; col < globalGrid[0].length; col++) {
                if (mouseX >= col * (cellWidth + padding) + padding && mouseX <= col * (cellWidth + padding) + padding + cellWidth &&
                    mouseY >= row * (cellWidth + padding) + padding && mouseY <= row * (cellWidth + padding) + padding + cellWidth) {
                    switch (globalGrid[row][col]) {
                        case CellState.OBSTACLE:
                            if (changedCol == col && changedRow == row) continue;
                            if (globalObstacle == "wall") {
                                globalGrid[row][col] = CellState.EMPTY;
                                weightGrid[row][col] = CellState.EMPTY;
                            }
                            else {
                                globalGrid[row][col] = CellState.WEIGHT;
                                weightGrid[row][col] = CellState.WEIGHT;
                            }
                            changedRow = row;
                            changedCol = col;
                            break;
                        case CellState.WEIGHT:
                            if (changedCol == col && changedRow == row) continue;
                            if (globalObstacle == "wall") {
                                globalGrid[row][col] = CellState.OBSTACLE;
                                animationGrid[row][col] = 2;
                                weightGrid[row][col] = 0;
                            }
                            else {
                                globalGrid[row][col] = CellState.EMPTY;
                                weightGrid[row][col] = 0;
                            }
                            changedRow = row;
                            changedCol = col;
                            break;
                        case CellState.EMPTY:
                            if (changedCol == col && changedRow == row) continue;
                            if (globalObstacle == "wall") {
                                globalGrid[row][col] = CellState.OBSTACLE;
                                animationGrid[row][col] = 2;
                                weightGrid[row][col] = CellState.EMPTY;
                            }
                            else {
                                globalGrid[row][col] = CellState.WEIGHT;
                                weightGrid[row][col] = CellState.WEIGHT;
                            }
                            changedRow = row;
                            changedCol = col;
                            break;
                        default:
                            // do nothing
                            break;
                    }
                    resetCanvas();
                    drawGrid();
                }
            }
        }
    }
});

// handle mouseup events
canvas.addEventListener("mouseup", (e) => {
    mouseX = getMousePos(e).x;
    mouseY = getMousePos(e).y;
    canMove = 0;
    changedRow = -1;
    changedCol = -1;

    // reset all cells where start or end were
    for (var row = 0; row < globalGrid.length; row++) {
        for (var col = 0; col < globalGrid[0].length; col++) {
            if (globalGrid[row][col] == CellState.START || globalGrid[row][col] == CellState.END) {
                globalGrid[row][col] = CellState.EMPTY;
            }
        }
    }

    //globalGrid[sRow][sCol] = CellState.START;
    //globalGrid[tRow][tCol] = CellState.END;
    if (weightGrid) {
        weightGrid[sRow][sCol] = CellState.EMPTY;
        weightGrid[tRow][tCol] = CellState.EMPTY;
    }
    ctx.clearRect(sCol * (cellWidth + padding), sRow * (cellHeight + padding), cellWidth + 2 * padding, cellHeight + 2 * padding);
    ctx.clearRect(tCol * (cellWidth + padding), tRow * (cellHeight + padding), cellWidth + 2 * padding, cellHeight + 2 * padding);
    resetCanvas();
    drawGrid();
});


/*
 *
 * TOGGLES
 *
 */

// toggles the visualization button to be on or off
function toggleVisualizeButton() {
    var elem = document.getElementById("visualizeButton");

    if (elem.innerText == "BFS" || elem.innerText == "DFS" || elem.innerText == "A*"
        || elem.innerText == "Dijkstra" || elem.innerText == "Greedy BeFS") {
        visBtnText = elem.innerText;
        elem.innerText = "stop!";
        elem.style.backgroundColor = "red";
        gottaStop = 0;
        resetCanvas();
        drawGrid();
        visualizeAlgos();
    }
    else if (elem.innerText == "stop!") {
        elem.innerText = visBtnText;
        elem.style.backgroundColor = "#26ff60";
        gottaStop = 1;
    }
}

// toggles the speed button to be fast or slow
function toggleSpeedButton() {
    var elem = document.getElementById("speedButton");
    if (elem.innerText == "fast") {
        elem.innerText = "slow";
        elem.style.backgroundColor = "rgba(0, 0, 0, 0.3)";
        globalSpeed = 15;
    }
    else {
        elem.innerText = "fast";
        elem.style.backgroundColor = "rgba(0, 0, 0, 0.1)";
        globalSpeed = 1;
    }
}

// toggles the obstacle button to draw walls or weights
function toggleObstacleButton() {
    var elem = document.getElementById("obstacleButton");
    if (elem.innerText == "wall") {
        elem.innerText = "weight";
        elem.style.backgroundColor = "rgba(0, 0, 0, 0.1)";
        globalObstacle = "weight";
    }
    else {
        elem.innerText = "wall";
        elem.style.backgroundColor = "rgba(0, 0, 0, 0.1)";
        globalObstacle = "wall";
    }
}

/*
 *
 * DRAWING
 *
 */

// resets the canvas
function resetCanvas() {
    // Iterate over each row in the 2D array
    globalGrid.forEach((row, rInd) => {
        // Inside the outer forEach, iterate over each element in the row
        row.forEach((element, cInd) => {
            if (element == CellState.VISITED || element == CellState.PATH) globalGrid[rInd][cInd] = CellState.EMPTY;
        });
    });
    animationGrid.forEach((row, rInd) => {
        // Inside the outer forEach, iterate over each element in the row
        row.forEach((element, cInd) => {
            if (globalGrid[rInd][cInd] != CellState.OBSTACLE) animationGrid[rInd][cInd] = 0;
        });
    });
    globalGrid[sRow][sCol] = CellState.START;
    globalGrid[tRow][tCol] = CellState.END;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    printedW = 0;
    drawGrid();
}

// draws globalGrid
async function drawGrid() {
    // Clear the canvas
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.font = getFont(10, 400) + "px serif";

    let numRows = globalGrid.length;
    let numCols = globalGrid[0].length;
    // draw grid
    for (let row = 0; row < numRows; row++) {
        for (let col = 0; col < numCols; col++) {
            let skip = 0;
            switch (globalGrid[row][col]) {
                case CellState.OBSTACLE:
                    if (animationGrid[row][col] == 0) {
                        animationGrid[row][col] = 1;
                        drawObstacleCell(canvas, col, row);
                        skip = 1;
                    }
                    else if (animationGrid[row][col] == 2) {
                        ctx.fillStyle = "rgba(0, 0, 0, 1)";
                        let tempX = col * (cellWidth + padding) + padding;
                        let tempY = row * (cellHeight + padding) + padding;
                        let tempW = cellWidth;
                        let tempH = cellHeight;
                        if (row > 0 && globalGrid[row - 1][col] == CellState.OBSTACLE) {
                            tempY -= padding;
                            tempH += padding;
                        }
                        if (row < numRows - 1 && globalGrid[row + 1][col] == CellState.OBSTACLE) {
                            tempH += padding;
                        }
                        if (col > 0 && globalGrid[row][col - 1] == CellState.OBSTACLE) {
                            tempX -= padding;
                            tempW += padding;
                        }
                        if (col < numCols - 1 && globalGrid[row][col + 1] == CellState.OBSTACLE) {
                            tempW += padding;
                        }

                        ctx.clearRect(tempX, tempY, tempW, tempH);
                        ctx.fillRect(tempX, tempY, tempW, tempH);
                        printedW = 0;
                    }
                    break;
                case CellState.VISITED:
                    if (animationGrid[row][col] == 0) {
                        animationGrid[row][col] = 1;
                        drawCell(canvas, col, row);
                        skip = 1;
                    }
                    else if (animationGrid[row][col] == 2) {
                        ctx.fillStyle = "rgba(0, 100, 255, 0.55)";
                        ctx.clearRect(col * (cellWidth + padding) + padding, row * (cellHeight + padding) + padding, cellWidth, cellHeight);
                        ctx.fillRect(col * (cellWidth + padding) + padding, row * (cellHeight + padding) + padding, cellWidth, cellHeight);
                        printedW = 0;
                    }
                    break;
                case CellState.PATH:
                    if (animationGrid[row][col] == 0) {
                        animationGrid[row][col] = 1;
                        drawPathCell(canvas, col, row);
                        skip = 1;
                    }
                    else if (animationGrid[row][col] == 2) {
                        ctx.fillStyle = "rgba(0, 220, 0, 1)";
                        let tempX2 = col * (cellWidth + padding) + padding;
                        let tempY2 = row * (cellHeight + padding) + padding;
                        let tempW2 = cellWidth;
                        let tempH2 = cellHeight;
                        if (row > 0 && globalGrid[row - 1][col] == CellState.PATH) {
                            tempY2 -= padding;
                            tempH2 += padding;
                        }
                        if (row < numRows - 1 && globalGrid[row + 1][col] == CellState.PATH) {
                            tempH2 += padding;
                        }
                        if (col > 0 && globalGrid[row][col - 1] == CellState.PATH) {
                            tempX2 -= padding;
                            tempW2 += padding;
                        }
                        if (col < numCols - 1 && globalGrid[row][col + 1] == CellState.PATH) {
                            tempW2 += padding;
                        }

                        ctx.clearRect(tempX2, tempY2, tempW2, tempH2);
                        ctx.fillRect(tempX2, tempY2, tempW2, tempH2);
                        printedW = 0;
                    }
                    break;
                default:
                    ctx.fillStyle = "rgba(0, 0, 0, 0.2)";
                    ctx.clearRect(col * (cellWidth + padding) + padding, row * (cellHeight + padding) + padding, cellWidth, cellHeight);
                    ctx.fillRect(col * (cellWidth + padding) + padding, row * (cellHeight + padding) + padding, cellWidth, cellHeight);
                    printedW = 0;
                    break;
            }
            if (skip) continue;

            if (row == sRow && col == sCol) {
                drawStart(col, row);
            }
            else if (row == tRow && col == tCol) {
                drawTarget(col, row);
            }
            else if (weightGrid && weightGrid[row][col] == CellState.WEIGHT && !printedW) {
                drawWeight(col, row);
                printedW = 1;
            }
        }
    }
}

// animate drawing
async function drawCell(canvas, x, y) {
    if (globalGrid[y][x] == CellState.PATH) return;

    // set canvas and ctx
    const ctx = canvas.getContext('2d');
    for (let i = 1; i < 14; i++) {
        if (gottaStop) break;
        ctx.clearRect(x * (cellWidth + padding) + padding, y * (cellHeight + padding) + padding, cellWidth, cellHeight);
        ctx.fillStyle = "rgba(0, 0, 0, 0.2)";
        ctx.fillRect(x * (cellWidth + padding) + padding, y * (cellHeight + padding) + padding, cellWidth, cellHeight);
        printedW = 0;
        ctx.fillStyle = "rgba(0, " + (200 * (i / 13)) + ", 255, 0.55)";
        ctx.fillRect(x * (cellWidth + padding) + padding + cellWidth / 2 - i, y * (cellHeight + padding) + padding + cellHeight / 2 - i, 2 * i, 2 * i);
        if (y == sRow && x == sCol) {
            drawStart(x, y);
        }
        else if (y == tRow && x == tCol) {
            drawTarget(x, y);
        }
        else if (weightGrid && weightGrid[y][x] == CellState.WEIGHT && !printedW) {
            drawWeight(x, y);
            printedW = 1;
        }
        await sleep(50);
        if (globalGrid[y][x] == CellState.PATH || animationGrid[y][x] == 2) return;
    }
    ctx.clearRect(x * (cellWidth + padding) + padding + cellWidth / 2 - 13, y * (cellHeight + padding) + padding + cellHeight / 2 - 13, 2 * 13, 2 * 13);
    printedW = 0;
    for (let i = 0; i <= 100; i++) {
        if (gottaStop) break;
        ctx.clearRect(x * (cellWidth + padding) + padding, y * (cellHeight + padding) + padding, cellWidth, cellHeight);
        ctx.fillStyle = "rgba(0, " + (200 - i) + ", 255, 0.55)";
        ctx.fillRect(x * (cellWidth + padding) + padding, y * (cellHeight + padding) + padding, cellWidth, cellHeight);
        printedW = 0;
        if (y == sRow && x == sCol) {
            drawStart(x, y);
        }
        else if (y == tRow && x == tCol) {
            drawTarget(x, y);
        }
        else if (weightGrid && weightGrid[y][x] == CellState.WEIGHT && !printedW) {
            drawWeight(x, y);
            printedW = 1;
        }
        await sleep(10);
        if (globalGrid[y][x] == CellState.PATH || animationGrid[y][x] == 2) return;
    }

    ctx.clearRect(x * (cellWidth + padding), y * (cellHeight + padding), cellWidth + 2 * padding, cellHeight + 2 * padding);
    ctx.fillStyle = "rgba(0, 100, 255, 0.55)";
    ctx.fillRect(x * (cellWidth + padding) + padding, y * (cellHeight + padding) + padding, cellWidth, cellHeight);
    printedW = 0;
    if (y == sRow && x == sCol) {
        drawStart(x, y);
    }
    else if (y == tRow && x == tCol) {
        drawTarget(x, y);
    }
    else if (weightGrid && weightGrid[y][x] == CellState.WEIGHT && !printedW) {
        drawWeight(x, y);
        printedW = 1;
    }

    animationGrid[y][x] = 2;
}

// animate drawing the path
async function drawPathCell(canvas, x, y) {
    // set canvas and ctx
    const ctx = canvas.getContext('2d');
    for (let i = 1; i < 14; i++) {
        if (gottaStop || animationGrid[y][x] == 2) break;
        ctx.clearRect(x * (cellWidth + padding) + padding + cellWidth / 2 - i, y * (cellHeight + padding) + padding + cellHeight / 2 - i, 2 * i, 2 * i);
        printedW = 0;
        ctx.fillStyle = "rgba(0, " + (220 * (i / 13)) + ", " + 254 * (1 - i / 26) + ", " + (0.55 + 0.45 * (i / 13)) + ")";
        ctx.fillRect(x * (cellWidth + padding) + padding + cellWidth / 2 - i, y * (cellHeight + padding) + padding + cellHeight / 2 - i, 2 * i, 2 * i);
        if (y == sRow && x == sCol) {
            drawStart(x, y);
        }
        else if (y == tRow && x == tCol) {
            drawTarget(x, y);
        }
        else if (weightGrid && weightGrid[y][x] == CellState.WEIGHT && !printedW) {
            drawWeight(x, y);
            printedW = 1;
        }
        await sleep(50);
        if (animationGrid[y][x] == 2) return;
    }
    ctx.clearRect(x * (cellWidth + padding) + padding + cellWidth / 2 - 13, y * (cellHeight + padding) + padding + cellHeight / 2 - 13, 2 * 13, 2 * 13);
    printedW = 0;
    for (let i = 0; i <= 127; i++) {
        if (gottaStop || animationGrid[y][x] == 2) break;
        ctx.clearRect(x * (cellWidth + padding) + padding, y * (cellHeight + padding) + padding, cellWidth, cellHeight);
        printedW = 0;
        ctx.fillStyle = "rgba(0, 220, " + (127 - i) + ", 1)";

        let tempX = x * (cellWidth + padding) + padding;
        let tempY = y * (cellHeight + padding) + padding;
        let tempW = cellWidth;
        let tempH = cellHeight;
        let numRows = globalGrid.length;
        let numCols = globalGrid[0].length;
        if (y > 0 && globalGrid[y - 1][x] == CellState.PATH) {
            tempY -= padding;
            tempH += padding;
        }
        if (y < numRows - 1 && globalGrid[y + 1][x] == CellState.PATH) {
            tempH += padding;
        }
        if (x > 0 && globalGrid[y][x - 1] == CellState.PATH) {
            tempX -= padding;
            tempW += padding;
        }
        if (x < numCols - 1 && globalGrid[y][x + 1] == CellState.PATH) {
            tempW += padding;
        }

        ctx.clearRect(tempX, tempY, tempW, tempH);
        ctx.fillRect(tempX, tempY, tempW, tempH);
        printedW = 0;

        if (y == sRow && x == sCol) {
            drawStart(x, y);
        }
        else if (y == tRow && x == tCol) {
            drawTarget(x, y);
        }
        else if (weightGrid && weightGrid[y][x] == CellState.WEIGHT && !printedW) {
            drawWeight(x, y);
            printedW = 1;
        }
        await sleep(5);
        if (animationGrid[y][x] == 2) return;
    }

    ctx.fillStyle = "rgba(0, 220, 0, 1)";
    let tempX = x * (cellWidth + padding) + padding;
    let tempY = y * (cellHeight + padding) + padding;
    let tempW = cellWidth;
    let tempH = cellHeight;
    let numRows = globalGrid.length;
    let numCols = globalGrid[0].length;
    if (y > 0 && globalGrid[y - 1][x] == CellState.PATH) {
        tempY -= padding;
        tempH += padding;
    }
    if (y < numRows - 1 && globalGrid[y + 1][x] == CellState.PATH) {
        tempH += padding;
    }
    if (x > 0 && globalGrid[y][x - 1] == CellState.PATH) {
        tempX -= padding;
        tempW += padding;
    }
    if (x < numCols - 1 && globalGrid[y][x + 1] == CellState.PATH) {
        tempW += padding;
    }

    ctx.clearRect(tempX, tempY, tempW, tempH);
    ctx.fillRect(tempX, tempY, tempW, tempH);
    printedW = 0;

    if (y == sRow && x == sCol) {
        drawStart(x, y);
    }
    else if (y == tRow && x == tCol) {
        drawTarget(x, y);
    }
    else if (weightGrid && weightGrid[y][x] == CellState.WEIGHT && !printedW) {
        drawWeight(x, y);
        printedW = 1;
    }

    animationGrid[y][x] = 2;
}

// animate drawing the walls
async function drawObstacleCell(canvas, x, y) {
    // set canvas and ctx
    const ctx = canvas.getContext('2d');
    for (let i = 1; i < 14; i++) {
        if (animationGrid[y][x] == 2) return;
        ctx.clearRect(x * (cellWidth + padding) + padding + cellWidth / 2 - i, y * (cellHeight + padding) + padding + cellHeight / 2 - i, 2 * i, 2 * i);
        ctx.fillStyle = "rgba(0, 0, 0, 1)";
        ctx.fillRect(x * (cellWidth + padding) + padding + cellWidth / 2 - i, y * (cellHeight + padding) + padding + cellHeight / 2 - i, 2 * i, 2 * i);
        printedW = 0;
        if (y == sRow && x == sCol) {
            drawStart(x, y);
        }
        else if (y == tRow && x == tCol) {
            drawTarget(x, y);
        }
        await sleep(50);
        if (animationGrid[y][x] == 2) return;
    }
    ctx.clearRect(x * (cellWidth + padding) + padding + cellWidth / 2 - 13, y * (cellHeight + padding) + padding + cellHeight / 2 - 13, 2 * 13, 2 * 13);
    printedW = 0;

    ctx.fillStyle = "rgba(0, 0, 0, 1)";
    let tempX = x * (cellWidth + padding) + padding;
    let tempY = y * (cellHeight + padding) + padding;
    let tempW = cellWidth;
    let tempH = cellHeight;
    let numRows = globalGrid.length;
    let numCols = globalGrid[0].length;
    if (y > 0 && globalGrid[y - 1][x] == CellState.OBSTACLE) {
        tempY -= padding;
        tempH += padding;
    }
    if (y < numRows - 1 && globalGrid[y + 1][x] == CellState.OBSTACLE) {
        tempH += padding;
    }
    if (x > 0 && globalGrid[y][x - 1] == CellState.OBSTACLE) {
        tempX -= padding;
        tempW += padding;
    }
    if (x < numCols - 1 && globalGrid[y][x + 1] == CellState.OBSTACLE) {
        tempW += padding;
    }

    ctx.clearRect(tempX, tempY, tempW, tempH);
    ctx.fillRect(tempX, tempY, tempW, tempH);
    printedW = 0;

    if (y == sRow && x == sCol) {
        drawStart(x, y);
    }
    else if (y == tRow && x == tCol) {
        drawTarget(x, y);
    }
    animationGrid[y][x] = 2;
}

// draws the start symbol
function drawStart(x, y) {
    // Define the coordinates of the triangle vertices
    var x1 = x * (cellWidth + padding) + padding + cellWidth / 2 - 8;
    var y1 = y * (cellHeight + padding) + padding + cellHeight / 2 - 5;
    var x2 = x * (cellWidth + padding) + padding + cellWidth / 2;
    var y2 = y * (cellHeight + padding) + padding + cellHeight / 2 + 4;
    var x3 = x * (cellWidth + padding) + padding + cellWidth / 2 + 8;
    var y3 = y * (cellHeight + padding) + padding + cellHeight / 2 - 5;

    // Draw the triangle
    ctx.beginPath();
    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y2);
    ctx.lineTo(x3, y3);
    ctx.lineWidth = 4;
    ctx.strokeStyle = "red"; // Set the stroke color
    ctx.stroke(); // Draw the stroke
}

// draws the target symbol
function drawTarget(x, y) {
    // Radius of the outer circle
    var radius = 10;

    // Draw the outer circle
    ctx.beginPath();
    ctx.arc(x * (cellWidth + padding) + padding + cellWidth / 2, y * (cellHeight + padding) + padding + cellHeight / 2, radius, 0, 2 * Math.PI);
    ctx.strokeStyle = "red";
    ctx.lineWidth = 3; // Adjust the thickness here
    ctx.stroke();

    // Draw the inner dot
    ctx.beginPath();
    ctx.arc(x * (cellWidth + padding) + padding + cellWidth / 2, y * (cellHeight + padding) + padding + cellHeight / 2, 5, 0, 2 * Math.PI);
    ctx.fillStyle = "red";
    ctx.fill();
}

// draws the weights
function drawWeight(x, y) {
    // Define parameters for the dumbbell
    var centerX = x * (cellWidth + padding) + padding + cellWidth / 2;
    var centerY = y * (cellHeight + padding) + padding + cellHeight / 2;
    var yOffset = 2;
    var radius = 9; // Radius of the dumbbell handle

    // Draw the handle
    ctx.beginPath();
    ctx.arc(centerX, centerY - 5, 3 * radius / 5, Math.PI - 0.5, 0.5);
    ctx.lineWidth = 2;
    ctx.strokeStyle = "black";
    ctx.stroke();

    // draw the weight
    ctx.beginPath();
    ctx.arc(centerX, centerY + yOffset, radius - 1, 0, 2 * Math.PI);
    ctx.fillStyle = "black";
    ctx.fill();

    ctx.fillStyle = "white";
    ctx.font = getFont(4, 400) + "px bold";
    ctx.fillText("5", centerX, centerY + yOffset + 1);
}

// animates the found path
async function drawShortestPath(parent, endCell) {
    let path = []; // Array to store the path cells
    let pathLength = 2;

    if (parent[0].length == 2) {
        path = parent;
    }
    else {
        let currentCell = endCell;
        // Traverse from end to start and store the path cells
        while (parent[currentCell[0]][currentCell[1]] !== undefined) {
            path.push(currentCell);
            currentCell = parent[currentCell[0]][currentCell[1]];
        }
    }
    globalGrid[sRow][sCol] = CellState.PATH;
    drawGrid();
    await sleep(globalSpeed * 25);
    // Draw the path in reverse order (from start to end)
    for (let i = path.length - 1; i >= 0; i--) {
        const cell = path[i];
        if ((cell[0] == sRow && cell[1] == sCol) || (cell[0] == tRow && cell[1] == tCol)) continue;
        globalGrid[cell[0]][cell[1]] = CellState.PATH;
        animationGrid[cell[0]][cell[1]] = 0;
        // sum up the path length
        pathLength += (weightGrid && weightGrid[cell[0]][cell[1]] == CellState.WEIGHT) ? 5 : 1;
        drawGrid();
        await sleep(globalSpeed * 20);
        if (gottaStop) return;
    }
    globalGrid[tRow][tCol] = CellState.PATH;
    animationGrid[tRow][tCol] = 0;
    drawGrid();

    while (animationGrid[tRow][tCol] != 2) {
        if (gottaStop) return;
        await sleep(globalSpeed * 2);
    }
    toggleVisualizeButton();
    drawGrid();

    // display how many nodes were visited
    let numVisited = 0;
    globalGrid.forEach((row, rInd) => {
        // Inside the outer forEach, iterate over each element in the row
        row.forEach((element, cInd) => {
            if (element == CellState.VISITED || element == CellState.PATH
                || element == CellState.START || element == CellState.END) numVisited++;
        });
    });
    ctx.font = getFont(4, canvas.width) + "px serif";
    var fM = ctx.measureText("A");
    var height = fM.actualBoundingBoxAscent + fM.actualBoundingBoxDescent - 1;
    drawTextBG("Visited " + numVisited + " cells.", canvas.width / 2, canvas.height / 2 - 2 * height, getFont(4, canvas.width) + "px serif");

    // display path length
    const delay = 5000;
    switch (globalAlgo) {
        case "dijkstra":
            drawTextBG("Found optimal path of length " + pathLength + ".", canvas.width / 2, canvas.height / 2, getFont(5, canvas.width) + "px serif");
            await sleep(delay);
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            drawGrid();
            break;
        case "astar":
            drawTextBG("Found optimal path of length " + pathLength + ".", canvas.width / 2, canvas.height / 2, getFont(5, canvas.width) + "px serif");
            await sleep(delay);
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            drawGrid();
            break;
        case "bfs":
            if (usesWeights()) {
                ctx.font = getFont(5, canvas.width) + "px serif";
                var fM = ctx.measureText("A");
                var height = fM.actualBoundingBoxAscent + fM.actualBoundingBoxDescent - 1;
                drawTextBG("Found path of length " + pathLength + ".", canvas.width / 2, canvas.height / 2, getFont(5, canvas.width) + "px serif");
                drawTextBG("(didn't consider weights)", canvas.width / 2, canvas.height / 2 + 2 * height, getFont(4, canvas.width) + "px serif");
            }
            else drawTextBG("Found optimal path of length " + pathLength + ".", canvas.width / 2, canvas.height / 2, getFont(5, canvas.width) + "px serif");
            await sleep(delay);
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            drawGrid();
            break;
        case "dfs":
            if (usesWeights()) {
                ctx.font = getFont(5, canvas.width) + "px serif";
                var fM = ctx.measureText("A");
                var height = fM.actualBoundingBoxAscent + fM.actualBoundingBoxDescent - 1;
                drawTextBG("Found path of length " + pathLength + ".", canvas.width / 2, canvas.height / 2, getFont(5, canvas.width) + "px serif");
                drawTextBG("(may be suboptimal, didn't consider weights)", canvas.width / 2, canvas.height / 2 + 2 * height, getFont(4, canvas.width) + "px serif");
            }
            else {
                ctx.font = getFont(5, canvas.width) + "px serif";
                var fM = ctx.measureText("A");
                var height = fM.actualBoundingBoxAscent + fM.actualBoundingBoxDescent - 1;
                drawTextBG("Found path of length " + pathLength + ".", canvas.width / 2, canvas.height / 2, getFont(5, canvas.width) + "px serif");
                drawTextBG("(may be suboptimal)", canvas.width / 2, canvas.height / 2 + 2 * height, getFont(4, canvas.width) + "px serif");
            }
            await sleep(delay);
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            drawGrid();
            break;
        case "greedyBestFirst":
            ctx.font = getFont(5, canvas.width) + "px serif";
            var fM = ctx.measureText("A");
            var height = fM.actualBoundingBoxAscent + fM.actualBoundingBoxDescent - 1;
            drawTextBG("Found path of length " + pathLength + ".", canvas.width / 2, canvas.height / 2, getFont(5, canvas.width) + "px serif");
            drawTextBG("(may be suboptimal)", canvas.width / 2, canvas.height / 2 + 2 * height, getFont(4, canvas.width) + "px serif");
            await sleep(delay);
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            drawGrid();
            break;
    }
}

// draws text of visited nodes, path length, ... after computation
function drawTextBG(txt, x, y, font) {
    /// lets save current state as we make a lot of changes        
    ctx.save();

    /// set font
    ctx.font = font;

    /// draw text from top - makes life easier at the moment
    ctx.textBaseline = 'top';

    /// get width of text
    ctx.textAlign = 'center';
    var width = 1.1 * ctx.measureText(txt).width;
    var fM = ctx.measureText("A");
    var height = fM.actualBoundingBoxAscent + fM.actualBoundingBoxDescent;

    /// draw background rect assuming height of font
    ctx.fillStyle = "rgba(255, 255, 255, 1)";
    ctx.beginPath();
    ctx.roundRect(x - width / 2, y, width, 2 * height, [10]);
    ctx.fill();

    /// text color
    ctx.fillStyle = "black";

    /// draw text on top
    ctx.fillText(txt, x, y);

    /// restore original state
    ctx.restore();
}

/*
 *
 * ENUM
 *
 */
const CellState = {
    EMPTY: 0,
    OBSTACLE: 1,
    START: 2,
    END: 3,
    VISITED: 4,
    PATH: 5,
    WEIGHT: 6
};

/*
 *
 * INITIALIZATION
 *
 */
function initializeGrid() {
    // Set canvas size to match viewport
    tempWidth = window.innerWidth; // Adjust multiplier as needed
    tempHeight = window.innerHeight - 1.2 * document.getElementById('mainNav').offsetHeight; // Adjust multiplier as needed
    let numCols = Math.floor((tempWidth - 2 * padding) / (cellWidth + padding) - 0.5);
    let numRows = Math.floor((tempHeight - 2 * padding) / (cellHeight + padding)) - 1;
    sRow = Math.floor(numRows / 2);
    sCol = Math.floor(numCols / 4);
    tRow = Math.floor(numRows / 2);;
    tCol = Math.floor(3 * numCols / 4);;

    // set canvas dimensions so that I can center the canvas thus centering the grid
    canvas.width = numCols * (cellWidth + padding) + padding;
    canvas.height = numRows * (cellHeight + padding) + padding;

    const grid = [];
    for (let i = 0; i < numRows; i++) {
        const row = [];
        for (let j = 0; j < numCols; j++) {
            row.push(CellState.EMPTY);
        }
        grid.push(row);
    }
    grid[sRow][sCol] = CellState.START;
    grid[tRow][tCol] = CellState.END;

    globalGrid = grid;
    animationGrid = Array.from({ length: globalGrid.length }, () => Array(globalGrid[0].length).fill(0));
}

// returns if a cell can be visited or not
function isValid(vis, row, col) {
    // If cell lies out of bounds
    if (row < 0 || col < 0
        || row >= globalGrid.length || col >= globalGrid[0].length)
        return false;

    // If cell is already visited
    if (vis[row][col])
        return false;

    // If cell is obstacle
    if (globalGrid[row][col] == CellState.OBSTACLE)
        return false;

    // Otherwise
    return true;
}


/*
 *
 * ALGORITHMS
 *
 */

// function to perform BFS
async function BFS(row, col) {
    if (gottaStop) {
        return;
    }

    // Direction vectors
    var dRow = [-1, 0, 1, 0];
    var dCol = [0, 1, 0, -1];

    // Declare the visited array
    var vis = Array.from(Array(globalGrid.length), () => Array(globalGrid[0].length).fill(false));
    var parent = Array.from(Array(globalGrid.length), () => Array(globalGrid[0].length));

    // Stores indices of the matrix cells
    var q = [];

    // Mark the starting cell as visited
    // and push it into the queue
    q.push([row, col]);
    vis[row][col] = true;
    globalGrid[row][col] = CellState.VISITED;
    animationGrid[row][col] = 2;
    drawGrid();
    await sleep(globalSpeed * 5);
    if (gottaStop) {
        return;
    }
    // Iterate while the queue
    // is not empty
    while (q.length != 0) {
        var cell = q[0];
        var x = cell[0];
        var y = cell[1];

        q.shift();

        // Go to the adjacent cells
        for (var i = 0; i < 4; i++) {

            var adjx = x + dRow[i];
            var adjy = y + dCol[i];

            if (isValid(vis, adjx, adjy)) {
                q.push([adjx, adjy]);
                vis[adjx][adjy] = true;
                parent[adjx][adjy] = [x, y]; // Store the parent of the adjacent cell
                if (globalGrid[adjx][adjy] == CellState.END) {
                    globalGrid[adjx][adjy] = CellState.VISITED;
                    await drawShortestPath(parent, [adjx, adjy]); // Draw the shortest path
                    return;
                }
                globalGrid[adjx][adjy] = CellState.VISITED;
                drawGrid();
                await sleep(globalSpeed * 5);
                if (gottaStop) {
                    return;
                }
            }
        }
    }

    await sleep(globalSpeed * 1500);
    drawTextBG("No path found.", canvas.width / 2, canvas.height / 2, getFont(5, canvas.width) + "px serif");
    toggleVisualizeButton();
}

// function to perform DFS
async function DFS(startRow, startCol) {
    if (gottaStop) return;

    const numRows = globalGrid.length;
    const numCols = globalGrid[0].length;
    const visited = new Array(numRows).fill(false).map(() => new Array(numCols).fill(false));
    var parent = Array.from(Array(globalGrid.length), () => Array(globalGrid[0].length));
    const stack = [[startRow, startCol]];

    // Define the four directions: up, down, left, right
    const directions = [[-1, 0], [1, 0], [0, -1], [0, 1]];

    // Mark the start cell as visited
    visited[startRow][startCol] = true;
    globalGrid[startRow][startCol] = CellState.VISITED;
    animationGrid[startRow][startCol] = 2;
    drawGrid();
    await sleep(globalSpeed * 5);
    if (gottaStop) return;

    while (stack.length > 0) {
        const [row, col] = stack.pop();
        // Explore all neighbors of the current cell
        for (const [dx, dy] of directions) {
            const newRow = row + dx;
            const newCol = col + dy;

            // Check if the new position is within the grid boundaries and not visited
            if (isValid(visited, newRow, newCol)) {
                // Mark the neighbor as visited and add it to the stack for further exploration
                stack.push([newRow, newCol]);

                visited[newRow][newCol] = true;
                parent[newRow][newCol] = [row, col]; // Store the parent of the adjacent cell
                if (globalGrid[newRow][newCol] == CellState.END) {
                    globalGrid[newRow][newCol] = CellState.VISITED;
                    await drawShortestPath(parent, [newRow, newCol]); // Draw the shortest path
                    return;
                }
                globalGrid[newRow][newCol] = CellState.VISITED;
                drawGrid();
                await sleep(globalSpeed * 5);
                if (gottaStop) return;
            }
        }
    }

    await sleep(globalSpeed * 1500);
    drawTextBG("No path found.", canvas.width / 2, canvas.height / 2, getFont(5, canvas.width) + "px serif");
    toggleVisualizeButton();
}

// function to perform A* and greedy BFS
async function ASTAR(startRow, startCol) {
    const numRows = globalGrid.length;
    const numCols = globalGrid[0].length;

    const endRow = tRow;
    const endCol = tCol;

    // Priority queue to store nodes with their f-values
    const pq = new PriorityQueue({ comparator: (a, b) => a.f - b.f });

    // Initialize distances and parent pointers
    const distances = Array.from({ length: numRows }, () => Array(numCols).fill(Infinity));
    const parents = Array.from({ length: numRows }, () => Array(numCols).fill(null));

    // Initialize start node
    distances[startRow][startCol] = 0;
    pq.enqueue([startRow, startCol], 0);

    while (!pq.isEmpty()) {
        const cell = pq.dequeue().element;
        const currentRow = cell[0];
        const currentCol = cell[1];
        globalGrid[currentRow][currentCol] = CellState.VISITED;
        drawGrid();
        await sleep(globalSpeed * 5);
        if (gottaStop) return;

        // Check if we reached the goal
        if (currentRow == endRow && currentCol == endCol) {
            await getPath(parents, currentRow, currentCol);
            return;
        }

        const neighbors = getNeighbors(currentRow, currentCol, numRows, numCols);
        for (const neighbor of neighbors) {
            const { row, col } = neighbor;
            let newDistance = 0
            if (globalAlgo != "greedyBestFirst") {
                newDistance = (weightGrid && weightGrid[row][col] == CellState.WEIGHT) ? distances[currentRow][currentCol] + 5 : distances[currentRow][currentCol] + 1;
            }
            if (newDistance < distances[row][col]) {
                distances[row][col] = newDistance;
                parents[row][col] = { row: currentRow, col: currentCol };
                const f = newDistance + heuristic(row, col, endRow, endCol);
                pq.enqueue([row, col], f);
            }
            if (gottaStop) return;
        }
    }

    await sleep(globalSpeed * 1500);
    drawTextBG("No path found.", canvas.width / 2, canvas.height / 2, getFont(5, canvas.width) + "px serif");
    toggleVisualizeButton();
}

/*
 *
 * GRID GENERATION
 *
 */

// generates an empty grid
async function generateEmpty() {
    if (stopper) return;
    const numRows = globalGrid.length;
    const numCols = globalGrid[0].length;

    var elem = document.getElementById("visualizeButton");
    elem.innerText = "stop!";
    toggleVisualizeButton();
    globalGrid = Array.from({ length: numRows }, () => Array(numCols).fill(CellState.EMPTY));
    weightGrid = Array.from({ length: numRows }, () => Array(numCols).fill(CellState.EMPTY));
    globalGrid[sRow][sCol] = CellState.START;
    globalGrid[tRow][tCol] = CellState.END;
    resetCanvas();
    animationGrid.forEach((row, rInd) => {
        row.forEach((element, cInd) => {
            animationGrid[rInd][cInd] = 2;
        });
    });
    drawGrid();
}

// generates a grid with random walls
async function generateRandom() {
    if (stopper) return;
    const numRows = globalGrid.length;
    const numCols = globalGrid[0].length;

    var elem = document.getElementById("visualizeButton");
    elem.innerText = "stop!";
    toggleVisualizeButton();
    globalGrid = Array.from({ length: numRows }, () => Array(numCols).fill(CellState.EMPTY));
    weightGrid = Array.from({ length: numRows }, () => Array(numCols).fill(CellState.EMPTY));
    globalGrid[sRow][sCol] = CellState.START;
    globalGrid[tRow][tCol] = CellState.END;
    resetCanvas();
    animationGrid.forEach((row, rInd) => {
        row.forEach((element, cInd) => {
            animationGrid[rInd][cInd] = 2;
        });
    });
    drawGrid();

    do {
        const grid = [];
        for (let i = 0; i < numRows; i++) {
            const row = [];
            for (let j = 0; j < numCols; j++) {
                if (Math.floor(Math.random() * 10) + 1 > 6) {
                    row.push(CellState.OBSTACLE);
                    continue;
                }
                row.push(CellState.EMPTY);
            }
            grid.push(row);
        }
        grid[sRow][sCol] = CellState.START;
        grid[tRow][tCol] = CellState.END;
        globalGrid = grid;
    } while (!fastBFS(sRow, sCol));
    drawGrid();
}

// generates a grid with random weights
async function generateRandomWeights() {
    if (stopper) return;
    const numRows = globalGrid.length;
    const numCols = globalGrid[0].length;

    var elem = document.getElementById("visualizeButton");
    elem.innerText = "stop!";
    toggleVisualizeButton();
    globalGrid = Array.from({ length: numRows }, () => Array(numCols).fill(CellState.EMPTY));
    weightGrid = Array.from({ length: numRows }, () => Array(numCols).fill(CellState.EMPTY));
    globalGrid[sRow][sCol] = CellState.START;
    globalGrid[tRow][tCol] = CellState.END;
    resetCanvas();
    animationGrid.forEach((row, rInd) => {
        row.forEach((element, cInd) => {
            animationGrid[rInd][cInd] = 2;
        });
    });
    drawGrid();

    do {
        const grid = [];
        weightGrid = [];
        for (let i = 0; i < numRows; i++) {
            const row = [];
            for (let j = 0; j < numCols; j++) {
                if (Math.floor(Math.random() * 10) + 1 > 6) {
                    row.push(CellState.WEIGHT);
                    continue;
                }
                row.push(CellState.EMPTY);
            }
            grid.push(row);
        }
        grid[sRow][sCol] = CellState.START;
        grid[tRow][tCol] = CellState.END;
        globalGrid = grid;
        weightGrid = deepCopyArray(grid);
    } while (!fastBFS(sRow, sCol));
    drawGrid();
}

// generates a grid with random walls and weights
async function generateRandomObstaclesWeights() {
    if (stopper) return;
    const numRows = globalGrid.length;
    const numCols = globalGrid[0].length;

    var elem = document.getElementById("visualizeButton");
    elem.innerText = "stop!";
    toggleVisualizeButton();
    globalGrid = Array.from({ length: numRows }, () => Array(numCols).fill(CellState.EMPTY));
    globalGrid[sRow][sCol] = CellState.START;
    globalGrid[tRow][tCol] = CellState.END;
    resetCanvas();
    animationGrid.forEach((row, rInd) => {
        row.forEach((element, cInd) => {
            animationGrid[rInd][cInd] = 2;
        });
    });
    drawGrid();

    do {
        const grid = [];
        weightGrid = [];
        for (let i = 0; i < numRows; i++) {
            const row = [];
            for (let j = 0; j < numCols; j++) {
                if (Math.random() > 0.55) {
                    Math.random() < 0.25 ? row.push(CellState.WEIGHT) : row.push(CellState.OBSTACLE);
                    continue;
                }
                row.push(CellState.EMPTY);
            }
            grid.push(row);
        }
        grid[sRow][sCol] = CellState.START;
        grid[tRow][tCol] = CellState.END;
        globalGrid = grid;
        weightGrid = deepCopyArray(grid);
    } while (!fastBFS(sRow, sCol));
    drawGrid();
}

// generate recursively using DFS
async function generateRecursiveDFS() {
    if (stopper) return;
    stopper = 1;
    generateEmpty();

    const rows = globalGrid.length;
    const cols = globalGrid[0].length;
    // Create a grid and fill with walls
    globalGrid = Array.from({ length: rows }, () => Array(cols).fill(1));
    weightGrid = Array.from({ length: rows }, () => Array(cols).fill(CellState.EMPTY));
    animationGrid = Array.from({ length: rows }, () => Array(cols).fill(2));
    drawGrid();

    // Recursive DFS function
    async function dfs(x, y) {
        globalGrid[y][x] = 0; // Mark the current cell as visited
        const directions = [
            [-1, 0], // up
            [0, 1],  // right
            [1, 0],  // down
            [0, -1]  // left
        ];

        shuffle(directions); // Randomize the directions

        for (let i = 0; i < directions.length; i++) {
            const [dx, dy] = directions[i];
            const nx = x + dx * 2;
            const ny = y + dy * 2;

            // Check if the next cell is within the grid and not visited
            if (nx >= 0 && nx < cols && ny >= 0 && ny < rows && globalGrid[ny][nx] === 1) {
                const mx = x + dx;
                const my = y + dy;
                globalGrid[my][mx] = 0; // Make the wall a passage

                resetCanvas();
                drawGrid();
                await sleep(globalSpeed * 10);

                await dfs(nx, ny);
            }
        }
    }

    await dfs(sCol, sRow);

    // open one random side of end point if encased
    if (!endHasEmptyNeighbors()) {
        let temp = getClosedSides();
        console.log(temp)
        console.log(tRow, tCol);
        shuffle(temp);
        const [dx, dy] = temp[0];
        const mx = tRow + dx;
        const my = tCol + dy;
        globalGrid[mx][my] = 0; // Make the wall a passage
    }

    stopper = 0;
    resetCanvas();
    drawGrid();
}

// function to generate a maze using recursive division algorithm
// 1 = horizontal bias
// -1 = vertical bias
// 0 = no bias
async function generateRecursive(bias) {
    if (stopper) return;
    generateEmpty();
    stopper = 1;
    const numRows = globalGrid.length;
    const numCols = globalGrid[0].length;
    resetCanvas();
    var elem = document.getElementById("visualizeButton");
    elem.innerText = "stop!";
    toggleVisualizeButton();
    globalGrid = Array.from({ length: numRows }, () => Array(numCols).fill(CellState.EMPTY));
    weightGrid = Array.from({ length: numRows }, () => Array(numCols).fill(CellState.EMPTY));
    animationGrid = Array.from({ length: numRows }, () => Array(numCols).fill(0));
    globalGrid[sRow][sCol] = CellState.START;
    globalGrid[tRow][tCol] = CellState.END;
    drawGrid();

    const rows = globalGrid.length;
    const cols = globalGrid[0].length;

    // Recursive division algorithm
    await divide(0, 0, rows - 1, cols - 1, true, bias);

    drawGrid();
    await sleep(800);
    stopper = 0;
}

/*
 *
 * PRIORITY QUEUE
 *
 */
// User defined class
// to store element and its priority
class QElement {
    constructor(element, priority) {
        this.element = element;
        this.priority = priority;
    }
}

// PriorityQueue class
class PriorityQueue {

    // An array is used to implement priority
    constructor() {
        this.items = [];
    }

    // enqueue function to add element
    // to the queue as per priority
    enqueue(element, priority) {
        // creating object from queue element
        let qElement = new QElement(element, priority);
        let contain = false;

        // iterating through the entire
        // item array to add element at the
        // correct location of the Queue
        for (let i = 0; i < this.items.length; i++) {
            if (this.items[i].priority > qElement.priority) {
                // Once the correct location is found it is
                // enqueued
                this.items.splice(i, 0, qElement);
                contain = true;
                break;
            }
        }

        // if the element have the highest priority
        // it is added at the end of the queue
        if (!contain) {
            this.items.push(qElement);
        }
    }

    // dequeue method to remove
    // element from the queue
    dequeue() {
        // return the dequeued element
        // and remove it.
        // if the queue is empty
        // returns Underflow
        if (this.isEmpty())
            return "Underflow";
        return this.items.shift();
    }

    // isEmpty function
    isEmpty() {
        // return true if the queue is empty.
        return this.items.length == 0;
    }
}

/*
 *
 * HELPER FUNCTIONS
 *
 */

function endHasEmptyNeighbors() {
    if (tRow > 0 && globalGrid[tRow - 1][tCol] == CellState.EMPTY) return true;
    if (tRow + 1 < globalGrid.length && globalGrid[tRow + 1][tCol] == CellState.EMPTY) return true;
    if (tCol > 0 && globalGrid[tRow][tCol - 1] == CellState.EMPTY) return true;
    if (tCol + 1 < globalGrid[0].length && globalGrid[tRow][tCol + 1] == CellState.EMPTY) return true;
    return false;
}

// check if end point has any opening
function getClosedSides() {
    let directions = [];
    if (tRow > 0 && globalGrid[tRow - 1][tCol] == CellState.OBSTACLE) directions.push([-1, 0]);
    if (tRow + 1 < globalGrid.length && globalGrid[tRow + 1][tCol] == CellState.OBSTACLE) directions.push([1, 0]);
    if (tCol > 0 && globalGrid[tRow][tCol - 1] == CellState.OBSTACLE) directions.push([0, -1]);
    if (tCol + 1 < globalGrid[0].length && globalGrid[tRow][tCol + 1] == CellState.OBSTACLE) directions.push([0, 1]);

    return directions;
}

// Function to shuffle array
function shuffle(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}

// returns the heuristic value for A* and greedy BFS
function heuristic(row, col, goalRow, goalCol) {
    // Manhattan distance heuristic
    if (globalAlgo == "dijkstra") return 0;
    if (globalAlgo == "greedyBestFirst") {
        return (weightGrid && weightGrid[row][col] == CellState.WEIGHT) ?
            Math.abs(row - goalRow) + Math.abs(col - goalCol) + 5 : Math.abs(row - goalRow) + Math.abs(col - goalCol);
    }
    return (aStarHeuristic == "manhattan") ? Math.abs(row - goalRow) + Math.abs(col - goalCol) : Math.hypot(Math.abs(row - goalRow), Math.abs(col - goalCol));
}

// Recursive function to divide the maze
async function divide(startX, startY, endX, endY, horizontal, bias) {
    if (endX - startX < 2 || endY - startY < 2) {
        return; // Base case: corridor is too small to divide further
    }

    // Make a gap in the wall
    let diffX = endX - startX;
    let diffY = endY - startY;
    let tempX = Math.floor(Math.random() * (diffX / 5 + 1) + 2 * diffX / 5) + startX;
    let tempY = Math.floor(Math.random() * (diffY / 5 + 1) + 2 * diffY / 5) + startY;
    let wallX = 0;
    let wallY = 0;
    if (horizontal) {
        wallX = tempX % 2 == 0 ? tempX : tempX + 1;
        wallY = tempY % 2 == 0 ? tempY + 1 : tempY;
    }
    else {
        wallX = tempX % 2 == 0 ? tempX + 1 : tempX;
        wallY = tempY % 2 == 0 ? tempY : tempY + 1;
    }
    // Create the wall
    for (let i = startX; i <= endX; i++) {
        for (let j = startY; j <= endY; j++) {
            if (globalGrid[i][j] == CellState.START || globalGrid[i][j] == CellState.END) continue;
            if (horizontal) {
                if (j == wallY && i != wallX) {
                    globalGrid[i][j] = CellState.OBSTACLE;
                    drawGrid();
                    await sleep(globalSpeed * 2);
                }
                else if (j == wallY && i == wallX) globalGrid[i][j] = CellState.EMPTY;
            }
            else {
                if (i == wallX && j != wallY) {
                    globalGrid[i][j] = CellState.OBSTACLE;
                    drawGrid();
                    await sleep(globalSpeed * 2);
                }
                else if (i == wallX && j == wallY) globalGrid[i][j] = CellState.EMPTY;
            }
        }
    }

    // Recursively divide the sub-mazes
    if (horizontal) {
        if (bias == -1) {
            horizontal = Math.random() < 0.3;
        }
        else if (bias == 1) {
            horizontal = Math.random() < 0.7;
        }

        await divide(startX, startY, endX, wallY - 1, !horizontal, bias); // Upper sub-maze
        await divide(startX, wallY + 1, endX, endY, !horizontal, bias); // Lower sub-maze
    } else {
        if (bias == -1) {
            horizontal = Math.random() < 0.3;
        }
        else if (bias == 1) {
            horizontal = Math.random() < 0.7;
        }

        await divide(startX, startY, wallX - 1, endY, !horizontal, bias); // Left sub-maze
        await divide(wallX + 1, startY, endX, endY, !horizontal, bias); // Right sub-maze
    }
}

// deeply copies arr
function deepCopyArray(arr) {
    return arr.map(item => Array.isArray(item) ? deepCopyArray(item) : item);
}

// takes ms time
function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

// returns the correct font size depending on canvas width
function getFont(fontSize, width) {
    var ratio = fontSize / 150;   // calc ratio
    var size = width * ratio;   // get font size based on current width
    return (size | 0); // set font
}

// returns all valid neighbors in the grid
function getNeighbors(row, col, numRows, numCols) {
    const neighbors = [];
    if (row > 0 && globalGrid[row - 1][col] !== CellState.OBSTACLE) neighbors.push({ row: row - 1, col });
    if (row < numRows - 1 && globalGrid[row + 1][col] !== CellState.OBSTACLE) neighbors.push({ row: row + 1, col });
    if (col > 0 && globalGrid[row][col - 1] !== CellState.OBSTACLE) neighbors.push({ row, col: col - 1 });
    if (col < numCols - 1 && globalGrid[row][col + 1] !== CellState.OBSTACLE) neighbors.push({ row, col: col + 1 });
    return neighbors;
}

// computes the path based on parents
async function getPath(parents, endRow, endCol) {
    const path = [];
    const temp = []
    let currentRow = endRow;
    let currentCol = endCol;
    while (currentRow !== null && currentCol !== null) {
        path.unshift({ row: currentRow, col: currentCol });
        temp.push([currentRow, currentCol]);
        const parent = parents[currentRow][currentCol];
        currentRow = parent ? parent.row : null;
        currentCol = parent ? parent.col : null;
    }
    while (animationGrid[sRow][sCol] != 2) {
        await sleep(2);
    }
    drawShortestPath(temp, [tRow, tCol]);
}

// Function to generate a random number within a range
function randomRange(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

// returns whether or not there are any weights on the grid
function usesWeights() {
    for (let i = 0; i < weightGrid.length; i++) {
        for (let j = 0; j < weightGrid[i].length; j++) {
            if (weightGrid[i][j] != 0) {
                return true; // Found a non-zero element, return false
            }
        }
    }
    return false; // All elements are zero
}

// called when pressing visualization button, calls correct algorithm
function visualizeAlgos() {
    switch (globalAlgo) {
        case "bfs":
            BFS(sRow, sCol);
            break;
        case "dfs":
            DFS(sRow, sCol);
            break;
        case "astar":
            ASTAR(sRow, sCol);
            break;
        case "dijkstra":
            ASTAR(sRow, sCol);
            break;
        case "greedyBestFirst":
            ASTAR(sRow, sCol);
            break;
        default:
            break;
    }
}

// get mouse position on canvas
function getMousePos(evt) {
    var rect = canvas.getBoundingClientRect();
    return {
        x: (evt.clientX - rect.left) / (rect.right - rect.left) * canvas.width,
        y: (evt.clientY - rect.top) / (rect.bottom - rect.top) * canvas.height
    };
}

// test if x,y is inside the bounding box of texts[textIndex]
function textHittest(x, y) {
    if (x >= sCol * (cellWidth + padding) + padding && x <= sCol * (cellWidth + padding) + padding + cellWidth &&
        y >= sRow * (cellWidth + padding) + padding && y <= sRow * (cellWidth + padding) + padding + cellWidth) {
        return "start";
    }
    else if (x >= tCol * (cellWidth + padding) + padding && x <= tCol * (cellWidth + padding) + padding + cellWidth &&
        y >= tRow * (cellWidth + padding) + padding && y <= tRow * (cellWidth + padding) + padding + cellWidth) {
        return "end";
    }
    return 0;
}

// function to quickly check if a path exists
function fastBFS(row, col) {
    // Direction vectors
    var dRow = [-1, 0, 1, 0];
    var dCol = [0, 1, 0, -1];

    // Declare the visited array
    var vis = Array.from(Array(globalGrid.length), () => Array(globalGrid[0].length).fill(false));

    // Stores indices of the matrix cells
    var q = [];

    // Mark the starting cell as visited
    // and push it into the queue
    q.push([row, col]);
    vis[row][col] = true;

    // Iterate while the queue
    // is not empty
    while (q.length != 0) {
        var cell = q[0];
        var x = cell[0];
        var y = cell[1];
        q.shift();

        // Go to the adjacent cells
        for (var i = 0; i < 4; i++) {
            var adjx = x + dRow[i];
            var adjy = y + dCol[i];
            if (isValid(vis, adjx, adjy)) {
                q.push([adjx, adjy]);
                vis[adjx][adjy] = true;
                if (globalGrid[adjx][adjy] == CellState.END) {
                    return true;
                }
            }
        }
    }
    return false;
}




