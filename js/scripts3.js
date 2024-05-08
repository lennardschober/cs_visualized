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
let padding = 1;
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

let originPoint = 0;
let anchorPoint = 0;
let anchorFixed = false;
let gridSize = 161;


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

        switch (selectedFunction) {
            case "dda":
                globalAlgo = "dda";
                elem.innerText = "DDA";
                visBtnText = elem.innerText;
                break;
            case "bresenham":
                globalAlgo = "bresenham";
                elem.innerText = "Bresenham";
                visBtnText = elem.innerText;
                break;
            case "aa":
                globalAlgo = "aa";
                elem.innerText = "AA";
                visBtnText = elem.innerText;
                break;
            case "midPoint":
                globalAlgo = "midPoint";
                elem.innerText = "Midpoint";
                visBtnText = elem.innerText;
                break;
            default:
                globalAlgo = "";
                elem.innerText = "choose algo";
                visBtnText = elem.innerText;
                break;
        }
        rasterize();
    });
});


// handle mousemove events
window.addEventListener('mousemove', (e) => {
    if (anchorFixed) return;

    mouseX = getMousePos(e).x;
    mouseY = getMousePos(e).y;

    for (var row = 0; row < globalGrid.length; row++) {
        for (var col = 0; col < globalGrid[0].length; col++) {
            if (mouseX >= col * (cellWidth + padding) + padding && mouseX <= col * (cellWidth + padding) + padding + cellWidth &&
                mouseY >= row * (cellWidth + padding) + padding && mouseY <= row * (cellWidth + padding) + padding + cellWidth) {
                // set anchor point
                anchorPoint = [row, col];
                rasterize();
                return;
            }
        }
    }

});

// handle mousedown events
canvas.addEventListener("mousedown", (e) => {
    mouseX = getMousePos(e).x;
    mouseY = getMousePos(e).y;

    for (var row = 0; row < globalGrid.length; row++) {
        for (var col = 0; col < globalGrid[0].length; col++) {
            if (mouseX >= col * (cellWidth + padding) + padding && mouseX <= col * (cellWidth + padding) + padding + cellWidth &&
                mouseY >= row * (cellWidth + padding) + padding && mouseY <= row * (cellWidth + padding) + padding + cellWidth) {
                // set anchor point
                anchorPoint = [row, col];
                resetCanvas();
            }
        }
    }

    anchorFixed = !anchorFixed;
    rasterize();
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
function toggleAntiAliasing() {
    var elem = document.getElementById("antiAliasingButton");
    if (elem.innerText == "Anti-Aliasing?") {
        elem.innerText = "Anti-Aliasing!";
        elem.style.backgroundColor = "rgba(0, 0, 0, 0.3)";
    }
    else {
        elem.innerText = "Anti-Aliasing?";
        elem.style.backgroundColor = "rgba(0, 0, 0, 0.1)";
    }
}

function initializeGrid() {
    // Set canvas size to match viewport
    winWidth = window.innerWidth; // Adjust multiplier as needed
    winHeight = window.innerHeight - 1.2 * document.getElementById('mainNav').offsetHeight; // Adjust multiplier as needed

    let numCols = gridSize;
    let numRows = Math.floor(numCols * winHeight / winWidth);

    if (numRows % 2 == 0) numRows--;

    cellWidth = (winWidth - padding * (numCols - 1)) / numCols;
    cellHeight = cellWidth;

    originPoint = [Math.floor(numRows / 2), Math.floor(numCols / 2)]

    // set canvas dimensions so that I can center the canvas thus centering the grid
    canvas.width = numCols * (cellWidth + padding) + padding;
    canvas.height = numRows * (cellHeight + padding) + padding;

    globalGrid = Array.from({ length: numRows }, () => Array(numCols).fill(CellState.WHITE));

    globalGrid[originPoint[0]][originPoint[1]] = CellState.BLACK;
}

function drawGrid() {
    // Clear the canvas
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.font = getFont(10, 400) + "px serif";

    let numRows = globalGrid.length;
    let numCols = globalGrid[0].length;

    // center drawn stuff
    const corrX = (canvas.width - (numCols * (cellWidth + padding) - padding)) / 2;
    const corrY = (canvas.height - (numRows * (cellHeight + padding) - padding)) / 2;

    // draw grid
    for (let row = 0; row < numRows; row++) {
        for (let col = 0; col < numCols; col++) {
            switch (globalGrid[row][col]) {
                case CellState.WHITE:
                    ctx.fillStyle = "rgba(200, 200, 200, 1)";
                    ctx.clearRect(col * (cellWidth + padding) + padding + corrX, row * (cellHeight + padding) + padding + corrY, cellWidth, cellHeight);
                    ctx.fillRect(col * (cellWidth + padding) + padding + corrX, row * (cellHeight + padding) + padding + corrY, cellWidth, cellHeight);
                    break;
                case CellState.BLACK20:
                    ctx.fillStyle = "rgba(0, 0, 0, 0.2)";
                    ctx.clearRect(col * (cellWidth + padding) + padding + corrX, row * (cellHeight + padding) + padding + corrY, cellWidth, cellHeight);
                    ctx.fillRect(col * (cellWidth + padding) + padding + corrX, row * (cellHeight + padding) + padding + corrY, cellWidth, cellHeight);
                    break;
                case CellState.BLACK30:
                    ctx.fillStyle = "rgba(0, 0, 0, 0.3)";
                    ctx.clearRect(col * (cellWidth + padding) + padding + corrX, row * (cellHeight + padding) + padding + corrY, cellWidth, cellHeight);
                    ctx.fillRect(col * (cellWidth + padding) + padding + corrX, row * (cellHeight + padding) + padding + corrY, cellWidth, cellHeight);
                    break;
                case CellState.BLACK40:
                    ctx.fillStyle = "rgba(0, 0, 0, 0.4)";
                    ctx.clearRect(col * (cellWidth + padding) + padding + corrX, row * (cellHeight + padding) + padding + corrY, cellWidth, cellHeight);
                    ctx.fillRect(col * (cellWidth + padding) + padding + corrX, row * (cellHeight + padding) + padding + corrY, cellWidth, cellHeight);
                    break;
                case CellState.BLACK50:
                    ctx.fillStyle = "rgba(0, 0, 0, 0.5)";
                    ctx.clearRect(col * (cellWidth + padding) + padding + corrX, row * (cellHeight + padding) + padding + corrY, cellWidth, cellHeight);
                    ctx.fillRect(col * (cellWidth + padding) + padding + corrX, row * (cellHeight + padding) + padding + corrY, cellWidth, cellHeight);
                    break;
                case CellState.BLACK60:
                    ctx.fillStyle = "rgba(0, 0, 0, 0.6)";
                    ctx.clearRect(col * (cellWidth + padding) + padding + corrX, row * (cellHeight + padding) + padding + corrY, cellWidth, cellHeight);
                    ctx.fillRect(col * (cellWidth + padding) + padding + corrX, row * (cellHeight + padding) + padding + corrY, cellWidth, cellHeight);
                    break;
                case CellState.BLACK70:
                    ctx.fillStyle = "rgba(0, 0, 0, 0.7)";
                    ctx.clearRect(col * (cellWidth + padding) + padding + corrX, row * (cellHeight + padding) + padding + corrY, cellWidth, cellHeight);
                    ctx.fillRect(col * (cellWidth + padding) + padding + corrX, row * (cellHeight + padding) + padding + corrY, cellWidth, cellHeight);
                    break;
                case CellState.BLACK80:
                    ctx.fillStyle = "rgba(0, 0, 0, 0.8)";
                    ctx.clearRect(col * (cellWidth + padding) + padding + corrX, row * (cellHeight + padding) + padding + corrY, cellWidth, cellHeight);
                    ctx.fillRect(col * (cellWidth + padding) + padding + corrX, row * (cellHeight + padding) + padding + corrY, cellWidth, cellHeight);
                    break;
                case CellState.BLACK90:
                    ctx.fillStyle = "rgba(0, 0, 0, 0.9)";
                    ctx.clearRect(col * (cellWidth + padding) + padding + corrX, row * (cellHeight + padding) + padding + corrY, cellWidth, cellHeight);
                    ctx.fillRect(col * (cellWidth + padding) + padding + corrX, row * (cellHeight + padding) + padding + corrY, cellWidth, cellHeight);
                    break;
                default:
                    ctx.fillStyle = "rgba(0, 0, 0, 1)";
                    ctx.clearRect(col * (cellWidth + padding) + padding + corrX, row * (cellHeight + padding) + padding + corrY, cellWidth, cellHeight);
                    ctx.fillRect(col * (cellWidth + padding) + padding + corrX, row * (cellHeight + padding) + padding + corrY, cellWidth, cellHeight);
                    break;
            }
        }
    }

    if (originPoint == anchorPoint) return;

    // draw line between origin and anchor
    ctx.beginPath(); // Start a new path
    ctx.moveTo(originPoint[1] * (cellWidth + padding) + padding + corrX + cellWidth / 2, originPoint[0] * (cellHeight + padding) + padding + corrY + cellHeight / 2); // Move the pen to (30, 50)
    ctx.lineTo(anchorPoint[1] * (cellWidth + padding) + padding + corrX + cellWidth / 2, anchorPoint[0] * (cellHeight + padding) + padding + corrY + cellHeight / 2); // Draw a line to (150, 100)
    ctx.strokeStyle = "rgba(255, 0, 0, 1)";

    // Calculate the logarithm of gridSize and known gridSizes
    var logGridSize = Math.log(gridSize);
    var logGridSize1 = Math.log(21);
    var logGridSize2 = Math.log(301);

    ctx.lineWidth = Math.exp((logGridSize - logGridSize1) / (logGridSize2 - logGridSize1) * (Math.log(0.5) - Math.log(5)) + Math.log(5));
    ctx.stroke(); // Render the path
}

// resets the canvas
function resetCanvas() {
    // Iterate over each row in the 2D array
    globalGrid = Array.from({ length: globalGrid.length }, () => Array(globalGrid[0].length).fill(CellState.WHITE));
    globalGrid[originPoint[0]][originPoint[1]] = CellState.BLACK;
    globalGrid[anchorPoint[0]][anchorPoint[1]] = CellState.BLACK;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawGrid();
}

/*
 *
 * ENUM
 *
 */
const CellState = {
    WHITE: 0,
    BLACK: 1,
    BLACK20: 2,
    BLACK30: 3,
    BLACK40: 4,
    BLACK50: 5,
    BLACK60: 6,
    BLACK70: 7,
    BLACK80: 8,
    BLACK90: 9,
};


// returns the correct font size depending on canvas width
function getFont(fontSize, width) {
    var ratio = fontSize / 150;   // calc ratio
    var size = width * ratio;   // get font size based on current width
    return (size | 0); // set font
}

// get mouse position on canvas
function getMousePos(evt) {
    const numRows = globalGrid.length;
    const numCols = globalGrid[0].length;
    // center drawn stuff
    const corrX = (canvas.width - (numCols * (cellWidth + padding) - padding)) / 2;
    const corrY = (canvas.height - (numRows * (cellHeight + padding) - padding)) / 2;
    var rect = canvas.getBoundingClientRect();
    return {
        x: (evt.clientX - rect.left) / (rect.right - rect.left) * canvas.width - corrX,
        y: (evt.clientY - rect.top) / (rect.bottom - rect.top) * canvas.height - corrY
    };
}

// Update the current slider value (each time you drag the slider handle)
document.getElementById("sizeSlider").oninput = function () {
    gridSize = 2 * this.value + 1;

    // adjust padding
    padding = 2 + (0 - 2) / (301 - 21) * (gridSize - 21);

    let numCols = gridSize;
    let numRows = Math.floor(numCols * winHeight / winWidth);

    if (numRows % 2 == 0) numRows--;

    cellWidth = (winWidth * 0.95 - padding * (numCols - 1)) / numCols;
    cellHeight = cellWidth;

    originPoint = [Math.floor(numRows / 2), Math.floor(numCols / 2)]

    globalGrid = Array.from({ length: numRows }, () => Array(numCols).fill(CellState.WHITE));
    globalGrid[originPoint[0]][originPoint[1]] = CellState.BLACK;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    anchorPoint = originPoint;

    anchorFixed = false;

    resetCanvas();
}

function rasterize() {
    resetCanvas();
    var timeDisplay = document.getElementById("timeDisplay");
    switch (globalAlgo) {
        case "dda":
            var t0 = performance.now();
            for (let i = 0; i < 100000; i++) {
                rasterizeDDA();
            }
            var t1 = performance.now();
            timeDisplay.textContent = "" + ((t1 - t0) / 100).toFixed(2) + "\u03BC" + "s";
            break;
        case "bresenham":
            var t0 = performance.now();
            for (let i = 0; i < 100000; i++) {
                rasterizeBresenham();
            }
            var t1 = performance.now();
            timeDisplay.textContent = "" + ((t1 - t0) / 100).toFixed(2) + "\u03BC" + "s";
            break;
        case "aa":
            var t0 = performance.now();
            for (let i = 0; i < 100; i++) {
                rasterizeAntiAliasedLine();
            }
            var t1 = performance.now();
            timeDisplay.textContent = "" + ((t1 - t0) / 100).toFixed(2) + "ms";
            break;
        case "midPoint":
            var t0 = performance.now();
            for (let i = 0; i < 100000; i++) {
                midPointCircle();
            }
            var t1 = performance.now();
            timeDisplay.textContent = "" + ((t1 - t0) / 100).toFixed(2) + "\u03BC" + "s";
            break;
        default:
            break;
    }

    drawGrid();
}

function rasterizeDDA() {
    const x0 = originPoint[0];
    const y0 = originPoint[1];
    const x1 = anchorPoint[0];
    const y1 = anchorPoint[1];

    const length = Math.max(Math.abs(x1 - x0), Math.abs(y1 - y0));

    const dx = (x1 - x0) / length;
    const dy = (y1 - y0) / length;

    for (let i = 0; i <= length; i++) {
        globalGrid[Math.round(x0 + i * dx)][Math.round(y0 + i * dy)] = CellState.BLACK;
    }
}

const { abs, sign } = Math;

function rasterizeBresenham() {
    let x0 = originPoint[0];
    let y0 = originPoint[1];
    let x1 = anchorPoint[0];
    let y1 = anchorPoint[1];
    const dx = abs(x1 - x0);
    const dy = abs(y1 - y0);
    const sx = sign(x1 - x0);
    const sy = sign(y1 - y0);
    let err = dx - dy;

    while (true) {
        globalGrid[x0][y0] = CellState.BLACK;

        if (x0 === x1 && y0 === y1) break;

        const e2 = 2 * err;
        if (e2 > -dy) { err -= dy; x0 += sx; }
        if (e2 < dx) { err += dx; y0 += sy; }
    }
}

function rasterizeAntiAliasedLine() {
    const x0 = originPoint[1];
    const y0 = originPoint[0];
    const x1 = anchorPoint[1];
    const y1 = anchorPoint[0];

    const xMax = Math.max(x0, x1);
    const xMin = Math.min(x0, x1);
    const yMax = Math.max(y0, y1);
    const yMin = Math.min(y0, y1);

    globalGrid.forEach((row, rInd) => {
        row.forEach((elem, cInd) => {
            if (cInd <= xMax && cInd >= xMin && rInd <= yMax && rInd >= yMin) {
                lineThroughPixel(cInd, rInd, x0, y0, x1, y1);
            }
        });
    });
}

function lineThroughPixel(x, y, x1, y1, x2, y2) {
    if (x2 == x1) {
        globalGrid[y][x] = CellState.BLACK;
        return;
    }

    // Calculate the slope of the line
    var slope = (y2 - y1) / (x2 - x1);

    // Calculate the y-intercept of the line
    var yIntercept = y1 - slope * x1;

    // subpixels
    const topLeft = { x: x - 0.5, y: y - 0.5 };
    const topMid = { x: x, y: y - 0.5 };
    const topRight = { x: x + 0.5, y: y - 0.5 };
    const midLeft = { x: x - 0.5, y: y };
    const midMid = { x: x, y: y };
    const midRight = { x: x + 0.5, y: y };
    const lowLeft = { x: x - 0.5, y: y + 0.5 };
    const lowMid = { x: x, y: y + 0.5 };
    const lowRight = { x: x + 0.5, y: y + 0.5 };

    // calculate y distance if we make line 0.5 thick
    const a = 0.1 * slope;
    const yThick = Math.abs(slope) < 1 ? 1 : Math.sqrt((a ** 2) + (slope ** 2));

    let counter = 0
    // count how many subpixels are covered
    // top row
    if (slope * topLeft.x + yIntercept - yThick <= topLeft.y && slope * topLeft.x + yIntercept + yThick >= topLeft.y) counter++;
    if (slope * topMid.x + yIntercept - yThick <= topMid.y && slope * topMid.x + yIntercept + yThick >= topMid.y) counter++;
    if (slope * topRight.x + yIntercept - yThick <= topRight.y && slope * topRight.x + yIntercept + yThick >= topRight.y) counter++;
    // mid row
    if (slope * midLeft.x + yIntercept - yThick <= midLeft.y && slope * midLeft.x + yIntercept + yThick >= midLeft.y) counter++;
    if (slope * midMid.x + yIntercept - yThick <= midMid.y && slope * midMid.x + yIntercept + yThick >= midMid.y) counter++;
    if (slope * midRight.x + yIntercept - yThick <= midRight.y && slope * midRight.x + yIntercept + yThick >= midRight.y) counter++;
    // bottom row
    if (slope * lowLeft.x + yIntercept - yThick <= lowLeft.y && slope * lowLeft.x + yIntercept + yThick >= lowLeft.y) counter++;
    if (slope * lowMid.x + yIntercept - yThick <= lowMid.y && slope * lowMid.x + yIntercept + yThick >= lowMid.y) counter++;
    if (slope * lowRight.x + yIntercept - yThick <= lowRight.y && slope * lowRight.x + yIntercept + yThick >= lowRight.y) counter++;

    // Check if the point (x, y) lies on the line
    switch (counter) {
        case 1:
            globalGrid[y][x] = CellState.BLACK30;
            break;
        case 2:
            globalGrid[y][x] = CellState.BLACK30;
            break;
        case 3:
            globalGrid[y][x] = CellState.BLACK40;
            break;
        case 4:
            globalGrid[y][x] = CellState.BLACK50;
            break;
        case 5:
            globalGrid[y][x] = CellState.BLACK60;
            break;
        case 6:
            globalGrid[y][x] = CellState.BLACK70;
            break;
        case 7:
            globalGrid[y][x] = CellState.BLACK80;
            break;
        case 8:
            globalGrid[y][x] = CellState.BLACK90;
            break;
        case 9:
            globalGrid[y][x] = CellState.BLACK;
            break;
        default:
            globalGrid[y][x] = CellState.WHITE;
            break;
    }
}

var midPointCircle = function () {
    const numRows = globalGrid.length;
    const numCols = globalGrid[0].length;

    const x0 = originPoint[1];
    const y0 = originPoint[0];
    const radius = Math.floor(Math.sqrt(Math.abs(x0 - anchorPoint[1]) ** 2 + Math.abs(y0 - anchorPoint[0]) ** 2));
    var x = radius;
    var y = 0;
    var radiusError = 1 - x;


    let YY0 = y + y0;
    let minusYY0 = -y + y0;
    let XX0 = x + x0;
    let minusXX0 = -x + x0;
    let XY0 = x + y0;
    let minusXY0 = -x + y0;
    let YX0 = y + x0;
    let minusYX0 = -y + x0;

    while (x >= y) {

        if (YY0 >= 0 && YY0 < numRows && XX0 >= 0 && XX0 < numCols) globalGrid[y + y0][x + x0] = CellState.BLACK;
        if (XY0 >= 0 && XY0 < numRows && YX0 >= 0 && YX0 < numCols) globalGrid[x + y0][y + x0] = CellState.BLACK;
        if (YY0 >= 0 && YY0 < numRows && minusXX0 >= 0 && minusXX0 < numCols) globalGrid[y + y0][-x + x0] = CellState.BLACK;
        if (XY0 >= 0 && XY0 < numRows && minusYX0 >= 0 && minusYX0 < numCols) globalGrid[x + y0][-y + x0] = CellState.BLACK;
        if (minusYY0 >= 0 && minusYY0 < numRows && minusXX0 >= 0 && minusXX0 < numCols) globalGrid[-y + y0][-x + x0] = CellState.BLACK;
        if (minusXY0 >= 0 && minusXY0 < numRows && minusYX0 >= 0 && minusYX0 < numCols) globalGrid[-x + y0][-y + x0] = CellState.BLACK;
        if (minusYY0 >= 0 && minusYY0 < numRows && XX0 >= 0 && XX0 < numCols) globalGrid[-y + y0][x + x0] = CellState.BLACK;
        if (minusXY0 >= 0 && minusXY0 < numRows && YX0 >= 0 && YX0 < numCols) globalGrid[-x + y0][y + x0] = CellState.BLACK;


        y++;

        if (radiusError < 0) {
            radiusError += 2 * y + 1;
        }
        else {
            x--;
            radiusError += 2 * (y - x + 1);
            // update x stuff
            XX0 = x + x0;
            minusXX0 = -x + x0;
            XY0 = x + y0;
            minusXY0 = -x + y0;
        }
        // update y stuff
        YY0 = y + y0;
        minusYY0 = -y + y0;
        YX0 = y + x0;
        minusYX0 = -y + x0;
    }
};


function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}