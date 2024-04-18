/*!
* Start Bootstrap - Grayscale v7.0.6 (https://startbootstrap.com/theme/grayscale)
* Copyright 2013-2023 Start Bootstrap
* Licensed under MIT (https://github.com/StartBootstrap/startbootstrap-grayscale/blob/master/LICENSE)
*/
//
// Scripts
// 


// global variables
var globalArray = 0;
var globalSortingAlgorithm = "";
var gottaStop = 0;
var instantSort = 0;
var customArr = "9, 8, 7, 6, 5, 4, 3, 2, 1";
var globalStyle = "random";
var globalComputationTime = -1;
var globalErrorText = 1;
var globalArraySize = 100;


window.addEventListener('DOMContentLoaded', event => {
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

window.addEventListener('resize', updateWindow);

function updateWindow() {
    setSelectionCanvas();
    if (globalArray != 0) drawArray(Math.max(...globalArray));
    else drawArray(100);
    updatePromptText();
}

function updatePromptText() {
    if (globalErrorText) return;
    const canvas = document.getElementById('errorText');
    const ctx = canvas.getContext('2d');
    // Set canvas size to match viewport
    canvas.width = window.innerWidth * 0.9; // Adjust multiplier as needed
    canvas.height = window.innerHeight; // Adjust multiplier as needed
    canvas.style.position = 'absolute';
    canvas.style.top = "5rem";
    if (globalArray == 0) {
        if (globalSortingAlgorithm == "") {
            ctx.font = getFont(4, canvas) + "px serif";
            ctx.textAlign = "center";
            ctx.fillStyle = "rgba(0, 0, 0, 0.55)";
            ctx.fillText("choose an array and select a sorting algorithm.", canvas.width / 2, 5 * canvas.height / 6);
            return;
        }
        ctx.font = getFont(4, canvas) + "px serif";
        ctx.textAlign = "center";
        ctx.fillStyle = "rgba(0, 0, 0, 0.55)";
        ctx.fillText("choose an array.", canvas.width / 2, 5 * canvas.height / 6);
        return;
    }
    else if (globalSortingAlgorithm == "") {
        ctx.font = getFont(4, canvas) + "px serif";
        ctx.textAlign = "center";
        ctx.fillStyle = "rgba(0, 0, 0, 0.55)";
        ctx.fillText("select a sorting algorithm.", canvas.width / 2, 5 * canvas.height / 6);
        return;
    }
    else if (instantSort) {
        ctx.font = getFont(4, canvas) + "px serif";
        ctx.textAlign = "center";
        ctx.fillStyle = "rgba(0, 0, 0, 0.55)";
        ctx.fillText("" + globalComputationTime + "ms", canvas.width / 2, 5 * canvas.height / 6);
        return;
    }
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

function createRandomArray(numItems) {
    const inputArray = [];
    for (let i = 0; i < numItems; i++) {
        inputArray[i] = i + 1;
    }

    shuffle(inputArray)
    globalArray = inputArray; // set global array
}

// draw bars for sorting visualization
function drawArray(tallest) {
    const canvas = document.getElementById('arrayBarsCanvas');
    const ctx = canvas.getContext('2d');

    // Set canvas size to match viewport
    canvas.width = window.innerWidth * 0.9; // Adjust multiplier as needed
    canvas.height = window.innerHeight * 0.6; // Adjust multiplier as needed
    if (canvas.height > canvas.width)
        canvas.height = canvas.width;

    const canvas2 = document.getElementById('glowCanvas');
    const ctx2 = canvas2.getContext('2d');

    // Set canvas size to match viewport
    canvas2.width = window.innerWidth * 0.9; // Adjust multiplier as needed
    canvas2.height = window.innerHeight * 0.25; // Adjust multiplier as needed
    if (canvas2.height > canvas2.width)
        canvas2.height = canvas2.width;


    // Clear the canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx2.clearRect(0, 0, canvas2.width, canvas2.height);

    // draw bars
    const gap = 0.2 * canvas.width;
    const barWidth = 7 / 8 * (canvas.width - gap) / (globalArray.length);
    globalArray.forEach((value, index) => {
        const barHeight = value * canvas.height / tallest; // normalized s.t. tallest bar is at canvas top
        const correction = 0.05 * window.innerWidth;
        const x = gap / 2 + index * (8 / 7 * barWidth) + 1 / 16 * barWidth - correction;
        const y = canvas.height - barHeight;

        // shadow
        // Draw the parallelogram
        var offsetY = barHeight / 2.7;
        var shearAngle = 42 * (1 - canvas.height / (2 * canvas.width)) * Math.PI / 180;
        var offsetX = offsetY * Math.tan(shearAngle)
        var newX = x + barWidth;
        var newY = y + barHeight;
        ctx.beginPath();
        ctx.moveTo(newX, newY);
        ctx.lineTo(newX + offsetX, newY - offsetY);
        ctx.lineTo(newX + offsetX - barWidth, newY - offsetY);
        ctx.lineTo(newX - barWidth, newY);
        ctx.closePath();
        ctx.fillStyle = "rgba(0, 0, 0, 0.15)"; // Stroke color
        ctx.fill();

        // draw bars last to appear in front of shadow
        var alpha = value / tallest;
        var r = 255 * (1 - alpha);
        var g = 255 - (155 * alpha);
        ctx.fillStyle = 'rgba(' + r + ', ' + g + ', 255, 1)'; // bar colors = blue gradient
        ctx.fillRect(x, y, barWidth, barHeight);

        const gradient = ctx2.createLinearGradient(0, 0, 0, 0.55 * canvas2.height * alpha);

        // Add three color stops
        gradient.addColorStop(0, 'rgba(' + r + ', ' + g + ', 255, 0.1)');
        gradient.addColorStop(1, 'rgba(' + r + ', ' + g + ', 255, 0)');

        // Set the fill style and draw a rectangle
        ctx2.fillStyle = gradient;
        ctx2.fillRect(x, 0, barWidth, 0.55 * canvas2.height * alpha);

        // if at most 10 elements show number
        if (globalArraySize <= 20) {
            ctx2.font = getFont(2, canvas2) + "px serif";
            ctx2.textAlign = "center";
            ctx2.fillStyle = "rgba(0, 0, 0, 0.55)";
            if (value == 0) {
                ctx2.fillText("", x + barWidth / 2, canvas2.height / 8);
            }
            else {
                ctx2.fillText(value, x + barWidth / 2, canvas2.height / 8);
            }
        }

    });
}

function shuffle(array) {
    let currentIndex = array.length, randomIndex;

    // While there remain elements to shuffle.
    while (currentIndex > 0) {

        // Pick a remaining element.
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex--;

        // And swap it with the current element.
        [array[currentIndex], array[randomIndex]] = [
            array[randomIndex], array[currentIndex]];
    }

    return array;
}

function isSorted(arr) {
    return arr.every((value, index, array) =>
        index === 0 || value >= array[index - 1]);
}

// Add event listener to the dropdown items
document.querySelectorAll('.dropdown-item').forEach(item => {
    item.addEventListener('click', function () {
        const selectedFunction = this.getAttribute('data-value');
        var elem = document.getElementById("sortButton");
        elem.innerText = "sort!";
        elem.style.backgroundColor = "#26ff60";
        gottaStop = 1;

        switch (selectedFunction) {
            // draw arrays
            case 'drawRandomArray10':
                switch (globalStyle) {
                    case "inverted":
                        invertedArray(10);
                        globalArraySize = 10;
                        break;
                    case "almostSorted":
                        almostSortedArray(10);
                        globalArraySize = 10;
                        break;
                    case "manyDuplicates":
                        manyDuplicatesArray(10);
                        globalArraySize = 10;
                        break;
                    case "invertedAlmostSorted":
                        invertedAlmostSortedArray(10);
                        globalArraySize = 10;
                        break;
                    case "highDifference":
                        highDifferenceArray(10);
                        globalArraySize = 10;
                        break;
                    default:
                        createRandomArray(10);
                        globalArraySize = 10;
                        break;
                }
                drawArray(Math.max(...globalArray));
                break;
            case 'drawRandomArray100':
                switch (globalStyle) {
                    case "inverted":
                        invertedArray(100);
                        globalArraySize = 100;
                        break;
                    case "almostSorted":
                        almostSortedArray(100);
                        globalArraySize = 100;
                        break;
                    case "manyDuplicates":
                        manyDuplicatesArray(100);
                        globalArraySize = 100;
                        break;
                    case "invertedAlmostSorted":
                        invertedAlmostSortedArray(100);
                        globalArraySize = 100;
                        break;
                    case "highDifference":
                        highDifferenceArray(100);
                        globalArraySize = 100;
                        break;
                    default:
                        createRandomArray(100);
                        globalArraySize = 100;
                        break;
                }
                drawArray(Math.max(...globalArray));
                break;
            case 'drawRandomArray1000':
                switch (globalStyle) {
                    case "inverted":
                        invertedArray(1000);
                        globalArraySize = 1000;
                        break;
                    case "almostSorted":
                        almostSortedArray(1000);
                        globalArraySize = 1000;
                        break;
                    case "manyDuplicates":
                        manyDuplicatesArray(1000);
                        globalArraySize = 1000;
                        break;
                    case "invertedAlmostSorted":
                        invertedAlmostSortedArray(1000);
                        globalArraySize = 1000;
                        break;
                    case "highDifference":
                        highDifferenceArray(1000);
                        globalArraySize = 1000;
                        break;
                    default:
                        createRandomArray(1000);
                        globalArraySize = 1000;
                        break;
                }
                drawArray(Math.max(...globalArray));
                break;
            case 'drawRandomArray10000':
                switch (globalStyle) {
                    case "inverted":
                        invertedArray(10000);
                        globalArraySize = 10000;
                        break;
                    case "almostSorted":
                        almostSortedArray(10000);
                        globalArraySize = 10000;
                        break;
                    case "manyDuplicates":
                        manyDuplicatesArray(10000);
                        globalArraySize = 10000;
                        break;
                    case "invertedAlmostSorted":
                        invertedAlmostSortedArray(10000);
                        globalArraySize = 10000;
                        break;
                    case "highDifference":
                        highDifferenceArray(10000);
                        globalArraySize = 10000;
                        break;
                    default:
                        createRandomArray(10000);
                        globalArraySize = 10000;
                        break;
                }
                drawArray(Math.max(...globalArray));
                break;
            case 'drawRandomArray50000':
                switch (globalStyle) {
                    case "inverted":
                        invertedArray(50000);
                        globalArraySize = 50000;
                        break;
                    case "almostSorted":
                        almostSortedArray(50000);
                        globalArraySize = 50000;
                        break;
                    case "manyDuplicates":
                        manyDuplicatesArray(50000);
                        globalArraySize = 50000;
                        break;
                    case "invertedAlmostSorted":
                        invertedAlmostSortedArray(50000);
                        globalArraySize = 50000;
                        break;
                    case "highDifference":
                        highDifferenceArray(50000);
                        globalArraySize = 50000;
                        break;
                    default:
                        createRandomArray(50000);
                        globalArraySize = 50000;
                        break;
                }
                drawArray(Math.max(...globalArray));
                break;
            case 'custom':
                pop();
                break;
            // select sorting algorithm
            case 'bogoSort':
                globalSortingAlgorithm = 'bogo';
                break;
            case 'bubbleSort':
                globalSortingAlgorithm = 'bubble';
                break;
            case 'insertionSort':
                globalSortingAlgorithm = 'insertion';
                break;
            case 'selectionSort':
                globalSortingAlgorithm = 'selection';
                break;
            case 'quickSort':
                globalSortingAlgorithm = 'quick';
                break;
            case 'heapSort':
                globalSortingAlgorithm = 'heap';
                break;
            case 'mergeSort':
                globalSortingAlgorithm = 'merge';
                break;
            case 'countingSort':
                globalSortingAlgorithm = 'counting';
                break;
            case 'radixSort':
                globalSortingAlgorithm = 'radix';
                break;
            case 'shellSort':
                globalSortingAlgorithm = 'shell';
                break;
            // array styles
            case 'almostSorted':
                globalStyle = "almostSorted";
                if (globalArray == 0) {
                    almostSortedArray(100);
                    globalArraySize = 100;
                }
                else {
                    almostSortedArray(globalArray.length);
                }
                drawArray(Math.max(...globalArray));
                break;
            case 'inverted':
                globalStyle = "inverted";
                if (globalArray == 0) {
                    invertedArray(100);
                    globalArraySize = 100;
                }
                else {
                    invertedArray(globalArray.length);
                }
                drawArray(Math.max(...globalArray));
                break;
            case 'manyDuplicates':
                globalStyle = "manyDuplicates";
                if (globalArray == 0) {
                    manyDuplicatesArray(100);
                    globalArraySize = 100;
                }
                else {
                    manyDuplicatesArray(globalArray.length);
                }
                drawArray(Math.max(...globalArray));
                break;
            case 'invertedAlmostSorted':
                globalStyle = "invertedAlmostSorted";
                if (globalArray == 0) {
                    invertedAlmostSortedArray(100);
                    globalArraySize = 100;
                }
                else {
                    invertedAlmostSortedArray(globalArray.length);
                }
                drawArray(Math.max(...globalArray));
                break;
            case 'random':
                globalStyle = "random";
                if (globalArray == 0) {
                    createRandomArray(100);
                    globalArraySize = 100;
                }
                else {
                    createRandomArray(globalArray.length);
                }
                drawArray(Math.max(...globalArray));
                break;
            case 'highDifference':
                globalStyle = "highDifference";
                if (globalArray == 0) {
                    highDifferenceArray(100);
                    globalArraySize = 100;
                }
                else {
                    highDifferenceArray(globalArray.length);
                }
                drawArray(Math.max(...globalArray));
                break;
            default:
                displayBogo();
                break;
        }
        setSelectionCanvas();
    });
});

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
 * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
 * SORTING  ALGORITHMS * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
 * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
 * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * */
function getFont(fontSize, canvas) {
    var ratio = fontSize / 150;   // calc ratio
    var size = canvas.width * ratio;   // get font size based on current width
    return (size | 0); // set font
}

function setSelectionCanvas() {
    const canvas = document.getElementById('selectionCanvas');
    const ctx = canvas.getContext('2d');
    // Set canvas size to match viewport
    canvas.width = window.innerWidth * 0.1; // Adjust multiplier as needed
    canvas.height = window.innerHeight; // Adjust multiplier as needed
    canvas.style.position = 'absolute';
    canvas.style.top = "5rem";
    canvas.style.bottom = "5rem";
    canvas.style.left = canvas.width / 2 + "px"; // Position the canvas on the left side

    // ALGO
    ctx.font = getFont(28, canvas) + 'px serif';
    ctx.textAlign = "center";
    ctx.fillStyle = "rgba(0, 0, 0, 0.55)";
    let textX = canvas.width / 2;
    let textY = canvas.height / 4 + canvas.height / 20;
    var lineHeight1 = getFont(28, canvas); // Adjust as needed
    ctx.fillText("ALGO", textX, textY - lineHeight1);
    ctx.font = getFont(24, canvas) + 'px serif';
    ctx.fillStyle = "rgba(0, 100, 255, 0.5)";
    let algo = "none";
    if (globalSortingAlgorithm != "") algo = globalSortingAlgorithm;
    ctx.fillText(algo, textX, textY);


    // SIZE
    ctx.font = getFont(28, canvas) + 'px serif';
    ctx.textAlign = "center";
    ctx.fillStyle = "rgba(0, 0, 0, 0.55)";
    textX = canvas.width / 2;
    textY = canvas.height / 2.8 + canvas.height / 20;
    var lineHeight1 = getFont(28, canvas); // Adjust as needed
    ctx.fillText("SIZE", textX, textY - lineHeight1);
    ctx.font = getFont(24, canvas) + 'px serif';
    ctx.fillStyle = "rgba(0, 100, 255, 0.5)";
    let size = 100;
    if (globalArray != 0) size = globalArray.length;
    ctx.fillText(size, textX, textY);

    // STYLE
    ctx.font = getFont(28, canvas) + 'px serif';
    ctx.textAlign = "center";
    ctx.fillStyle = "rgba(0, 0, 0, 0.55)";
    textX = canvas.width / 2;
    textY = 13 * canvas.height / 28 + canvas.height / 20;
    var lineHeight1 = getFont(28, canvas); // Adjust as needed
    ctx.fillText("STYLE", textX, textY - lineHeight1);
    ctx.font = getFont(24, canvas) + 'px serif';
    ctx.fillStyle = "rgba(0, 100, 255, 0.5)";
    switch (globalStyle) {
        case "almostSorted":
            ctx.fillText("almost sorted", textX, textY);
            break;
        case "inverted":
            ctx.fillText("inverted", textX, textY);
            break;
        case "invertedAlmostSorted":
            var lines = ["inverted", "almost sorted"];
            var offsetY = textY; // Starting y-coordinate for the first line
            for (var i = 0; i < lines.length; i++) {
                ctx.fillText(lines[i], textX, offsetY);
                offsetY += 24; // Move to the next line
            }
            break;
        case "manyDuplicates":
            var lines = ["many", "duplicates"];
            var offsetY = textY; // Starting y-coordinate for the first line
            for (var i = 0; i < lines.length; i++) {
                ctx.fillText(lines[i], textX, offsetY);
                offsetY += 24; // Move to the next line
            }
            break;
        case "highDifference":
            var lines = ["high", "difference"];
            var offsetY = textY; // Starting y-coordinate for the first line
            for (var i = 0; i < lines.length; i++) {
                ctx.fillText(lines[i], textX, offsetY);
                offsetY += 24; // Move to the next line
            }
            break;
        default:
            ctx.fillText("random", textX, textY);
            break;
    }
}


function toggleSortButton() {
    const canvas = document.getElementById('errorText');
    const ctx = canvas.getContext('2d');
    // Set canvas size to match viewport
    canvas.width = window.innerWidth * 0.8; // Adjust multiplier as needed
    canvas.height = window.innerHeight; // Adjust multiplier as needed
    canvas.style.position = 'absolute';
    canvas.style.top = "5rem";
    if (globalArray == 0) {
        if (globalSortingAlgorithm == "") {
            ctx.font = getFont(4, canvas) + "px serif";
            ctx.textAlign = "center";
            ctx.fillStyle = "rgba(0, 0, 0, 0.55)";
            ctx.fillText("choose an array and select a sorting algorithm.", canvas.width / 2, 5 * canvas.height / 6);
            return;
        }
        ctx.font = getFont(4, canvas) + "px serif";
        ctx.textAlign = "center";
        ctx.fillStyle = "rgba(0, 0, 0, 0.55)";
        ctx.fillText("choose an array.", canvas.width / 2, 5 * canvas.height / 6);
        return;
    }
    else if (globalSortingAlgorithm == "") {
        ctx.font = getFont(4, canvas) + "px serif";
        ctx.textAlign = "center";
        ctx.fillStyle = "rgba(0, 0, 0, 0.55)";
        ctx.fillText("select a sorting algorithm.", canvas.width / 2, 5 * canvas.height / 6);
        return;
    }

    var elem = document.getElementById("sortButton");
    if (elem.innerText == "sort!") {
        elem.innerText = "stop!";
        elem.style.backgroundColor = "red";
        gottaStop = 0;
        sortArray();
    }
    else {
        elem.innerText = "sort!";
        elem.style.backgroundColor = "#26ff60";
        gottaStop = 1;
    }
}

function toggleInstantButton() {
    var elem = document.getElementById("sortButton");
    elem.innerText = "sort!";
    elem.style.backgroundColor = "#26ff60";
    gottaStop = 1;
    var elem = document.getElementById("instantButton");
    if (elem.innerText == "instant?") {
        elem.innerText = "instant!";
        elem.style.backgroundColor = "#26ff60";
        instantSort = 1;
    }
    else {
        elem.innerText = "instant?";
        elem.style.backgroundColor = "rgba(0, 0, 0, 0.1)";
        instantSort = 0;
    }
}

function writeNum(num) {
    const canvas = document.getElementById('errorText');
    const ctx = canvas.getContext('2d');
    // Set canvas size to match viewport
    canvas.width = window.innerWidth * 0.9; // Adjust multiplier as needed
    canvas.height = window.innerHeight; // Adjust multiplier as needed
    canvas.style.position = 'absolute';
    canvas.style.top = "5rem";
    ctx.font = ctx.font = getFont(4, canvas) + "px serif";
    ctx.textAlign = "center";
    ctx.fillStyle = "rgba(0, 0, 0, 0.55)";
    ctx.fillText("" + num + "ms", canvas.width / 2, 5 * canvas.height / 6);
}

function sortArray() {
    switch (globalSortingAlgorithm) {
        case 'bogo':
            bogoSort();
            break;
        case 'bubble':
            bubbleSort();
            break;
        case 'insertion':
            insertionSort();
            break;
        case 'selection':
            selectionSort();
            break;
        case 'quick':
            quickSort();
            break;
        case 'heap':
            heapSort();
            break;
        case 'merge':
            mergeSort();
            break;
        case 'counting':
            countingSort();
            break;
        case 'radix':
            radixSort();
            break;
        case 'shell':
            shellSort();
            break;
        default:
            console.log("No function selected");
    }
}

async function bogoSort() {
    let delay = 500;
    let len = globalArray.length;
    let tallest = Math.max(...globalArray);
    // select speed depending on array size
    if (len > 10000) {
        delay = 1;
    }
    else if (len <= 10000 && len > 1000) {
        delay = 2;
    }
    else if (len <= 1000 && len > 100) {
        delay = 5;
    }

    else if (len <= 100 && len > 10) {
        delay = 40;
    }

    if (instantSort) {
        let startTime = performance.now();
        while (!isSorted(globalArray)) {
            shuffle(globalArray);
            drawArray(tallest);
            if (gottaStop)
                return;
        }
        let diff = Math.round(performance.now() - startTime);
        globalComputationTime = diff;
        drawArray(tallest);
        toggleSortButton();
        writeNum(diff);

        return;
    }

    while (!isSorted(globalArray)) {
        shuffle(globalArray);
        drawArray(tallest);
        await sleep(delay);
        if (gottaStop)
            return;
    }
    toggleSortButton();

    return;
}

async function bubbleSort() {
    let delay = 500;
    let len = globalArray.length;
    let tallest = Math.max(...globalArray);

    if (instantSort) {
        let startTime = performance.now();
        for (var i = 0; i < globalArray.length; i++) {
            // Last i elements are already in place  
            for (var j = 0; j < (globalArray.length - i - 1); j++) {
                // Checking if the item at present iteration 
                // is greater than the next iteration
                if (globalArray[j] > globalArray[j + 1]) {
                    // If the condition is true
                    // then swap them
                    var temp = globalArray[j];
                    globalArray[j] = globalArray[j + 1];
                    globalArray[j + 1] = temp;
                    // update drawing iff items were swapped
                    if (gottaStop)
                        return;
                }
            }
        }
        let diff = Math.round(performance.now() - startTime);
        globalComputationTime = diff;
        drawArray(tallest);
        toggleSortButton();
        writeNum(diff);
        return;
    }

    // select speed depending on array size
    if (len > 10000) {
        delay = 1;
        for (var i = 0; i < globalArray.length; i++) {
            // Last i elements are already in place  
            for (var j = 0; j < (globalArray.length - i - 1); j++) {
                // Checking if the item at present iteration 
                // is greater than the next iteration
                if (globalArray[j] > globalArray[j + 1]) {
                    // If the condition is true
                    // then swap them
                    var temp = globalArray[j];
                    globalArray[j] = globalArray[j + 1];
                    globalArray[j + 1] = temp;
                    if (gottaStop)
                        return;
                }
            }

            if (i % 100 == 0) {
                drawArray(tallest);
                await sleep(delay);
            }
            if (gottaStop)
                return;
            if (isSorted(globalArray))
                break;
        }
        drawArray(tallest);
        toggleSortButton();
        return;
    }
    else if (len <= 10000 && len > 1000) {
        delay = 10;
        for (var i = 0; i < globalArray.length; i++) {
            // Last i elements are already in place  
            for (var j = 0; j < (globalArray.length - i - 1); j++) {
                // Checking if the item at present iteration 
                // is greater than the next iteration
                if (globalArray[j] > globalArray[j + 1]) {
                    // If the condition is true
                    // then swap them
                    var temp = globalArray[j];
                    globalArray[j] = globalArray[j + 1];
                    globalArray[j + 1] = temp;
                    if (gottaStop)
                        return;
                }
                if (gottaStop)
                    return;
            }

            if (i % 10 == 0) {
                drawArray(tallest);
                await sleep(delay);
            }
            if (gottaStop)
                return;
            if (isSorted(globalArray))
                break;
        }
        drawArray(tallest);
        toggleSortButton();
        return;
    }
    else if (len <= 1000 && len > 100) {
        delay = 5;
        for (var i = 0; i < globalArray.length; i++) {
            // Last i elements are already in place  
            for (var j = 0; j < (globalArray.length - i - 1); j++) {
                // Checking if the item at present iteration 
                // is greater than the next iteration
                if (globalArray[j] > globalArray[j + 1]) {
                    // If the condition is true
                    // then swap them
                    var temp = globalArray[j];
                    globalArray[j] = globalArray[j + 1];
                    globalArray[j + 1] = temp;
                    if (j % 100 == 0) {
                        drawArray(tallest);
                        await sleep(delay);
                    }
                    if (gottaStop)
                        return;
                }
            }
            if (gottaStop)
                return;
        }
        drawArray(tallest);
        toggleSortButton();
        return;
    }
    else if (len <= 100 && len > 10) {
        delay = 5;
    }

    for (var i = 0; i < globalArray.length; i++) {
        // Last i elements are already in place  
        for (var j = 0; j < (globalArray.length - i - 1); j++) {
            // Checking if the item at present iteration 
            // is greater than the next iteration
            if (globalArray[j] > globalArray[j + 1]) {
                // If the condition is true
                // then swap them
                var temp = globalArray[j];
                globalArray[j] = globalArray[j + 1];
                globalArray[j + 1] = temp;
                // update drawing iff items were swapped
                drawArray(tallest);
                await sleep(delay);
                if (gottaStop)
                    return;
            }
        }
    }
    toggleSortButton();

    return;
}

async function insertionSort() {
    let delay = 500;
    let len = globalArray.length;
    let tallest = Math.max(...globalArray);

    if (instantSort) {
        let startTime = performance.now();
        for (let i = 1; i < globalArray.length; i++) {
            let currentValue = globalArray[i];
            let j = i - 1;
            while (j >= 0 && globalArray[j] > currentValue) {
                globalArray[j + 1] = globalArray[j];
                j--;
            }
            globalArray[j + 1] = currentValue;
        }
        let diff = Math.round(performance.now() - startTime);
        globalComputationTime = diff;
        drawArray(tallest);
        toggleSortButton();
        writeNum(diff);
        return;
    }

    // select speed depending on array size
    if (len > 10000) {
        delay = 1;
        for (let i = 1; i < globalArray.length; i++) {
            let swapped = 0;
            let currentValue = globalArray[i];
            let j = i - 1;
            while (j >= 0 && globalArray[j] > currentValue) {
                globalArray[j + 1] = globalArray[j];
                j--;
                swapped = 1;
            }
            globalArray[j + 1] = currentValue;
            if (gottaStop) {
                return;
            }
            if (swapped && i % 100 == 0) {
                drawArray(tallest);
                await sleep(delay);
                swapped = 0;
            }
        }
        toggleSortButton();
        return;
    }
    else if (len <= 10000 && len > 1000) {
        delay = 2;
        for (let i = 1; i < globalArray.length; i++) {
            let swapped = 0;
            let currentValue = globalArray[i];
            let j = i - 1;
            while (j >= 0 && globalArray[j] > currentValue) {
                globalArray[j + 1] = globalArray[j];
                j--;
                swapped = 1;
            }
            globalArray[j + 1] = currentValue;
            if (gottaStop) {
                return;
            }
            if (swapped && i % 10 == 0) {
                drawArray(tallest);
                await sleep(delay);
                swapped = 0;
            }
        }
        toggleSortButton();
        return;
    }
    else if (len <= 1000 && len > 100) {
        delay = 10;
    }

    else if (len <= 100 && len > 10) {
        delay = 80;
    }

    for (let i = 1; i < globalArray.length; i++) {
        let swapped = 0;
        let currentValue = globalArray[i];
        let j = i - 1;
        while (j >= 0 && globalArray[j] > currentValue) {
            globalArray[j + 1] = globalArray[j];
            j--;
            swapped = 1;
        }
        globalArray[j + 1] = currentValue;
        if (gottaStop) {
            return;
        }
        if (swapped) {
            drawArray(tallest);
            await sleep(delay);
            swapped = 0;
        }
    }
    toggleSortButton();
    return;
}

async function selectionSort() {
    let delay = 500;
    let len = globalArray.length;
    let tallest = Math.max(...globalArray);

    if (instantSort) {
        let n = globalArray.length;
        let startTime = performance.now();
        for (let i = 0; i < n; i++) {
            let min = i;
            for (let j = i + 1; j < n; j++) {
                if (globalArray[j] < globalArray[min]) {
                    min = j;
                }
            }
            if (min != i) {
                let tmp = globalArray[i];
                globalArray[i] = globalArray[min];
                globalArray[min] = tmp;
            }
        }
        let diff = Math.round(performance.now() - startTime);
        globalComputationTime = diff;
        drawArray(tallest);
        toggleSortButton();
        writeNum(diff);
        return;
    }

    // select speed depending on array size
    if (len > 10000) {
        delay = 1;
        let n = globalArray.length;
        for (let i = 0; i < n; i++) {
            let min = i;
            for (let j = i + 1; j < n; j++) {
                if (globalArray[j] < globalArray[min]) {
                    min = j;
                }
            }
            if (min != i) {
                let tmp = globalArray[i];
                globalArray[i] = globalArray[min];
                globalArray[min] = tmp;
                if (i % 100 == 0) {
                    drawArray(tallest);
                    await sleep(delay);
                }
            }
            if (gottaStop)
                return;
            if (isSorted(globalArray))
                break;
        }
        toggleSortButton();
        return;
    }
    else if (len <= 10000 && len > 1000) {
        delay = 2;
        let n = globalArray.length;
        for (let i = 0; i < n; i++) {
            let min = i;
            for (let j = i + 1; j < n; j++) {
                if (globalArray[j] < globalArray[min]) {
                    min = j;
                }
            }
            if (min != i) {
                let tmp = globalArray[i];
                globalArray[i] = globalArray[min];
                globalArray[min] = tmp;
                if (i % 10 == 0) {
                    drawArray(tallest);
                    await sleep(delay);
                }
            }
            if (gottaStop)
                return;
            if (isSorted(globalArray))
                break;
        }
        toggleSortButton();
        return;
    }
    else if (len <= 1000 && len > 100) {
        delay = 10;
    }

    else if (len <= 100 && len > 10) {
        delay = 80;
    }

    let n = globalArray.length;
    for (let i = 0; i < n; i++) {
        let min = i;
        for (let j = i + 1; j < n; j++) {
            if (globalArray[j] < globalArray[min]) {
                min = j;
            }
        }
        if (min != i) {
            let tmp = globalArray[i];
            globalArray[i] = globalArray[min];
            globalArray[min] = tmp;
            drawArray(tallest);
            await sleep(delay);
        }
        if (gottaStop)
            return;
        if (isSorted(globalArray))
            break;
    }
    toggleSortButton();

    return;
}

const swap = (arr, left, right) => {
    const temp = arr[left]
    arr[left] = arr[right]
    arr[right] = temp;
}

const partitionHigh = (arr, low, high) => {
    //Pick the first element as pivot
    let pivot = arr[high];
    let i = low;

    //Partition the array into two parts using the pivot
    for (let j = low; j < high; j++) {
        if (arr[j] <= pivot) {
            swap(arr, i, j);
            i++;
        }
    }

    swap(arr, i, high);

    //Return the pivot index
    return i;
}

async function quickSort() {
    let delay = 500;
    let len = globalArray.length;
    let tallest = Math.max(...globalArray);
    //Stack for storing start and end index
    let stack = [];

    //Get the start and end index
    let start = 0;
    let end = globalArray.length - 1;


    if (instantSort) {
        let startTime = performance.now();

        //Push start and end index in the stack
        stack.push({ x: start, y: end });

        //Iterate the stack
        while (stack.length) {
            //Get the start and end from the stack
            const { x, y } = stack.shift();

            //Partition the array along the pivot
            const PI = partitionHigh(globalArray, x, y);

            //Push sub array with less elements than pivot into the stack
            if (PI - 1 > x) {
                stack.push({ x: x, y: PI - 1 });
            }

            //Push sub array with greater elements than pivot into the stack
            if (PI + 1 < y) {
                stack.push({ x: PI + 1, y: y });
            }
            if (gottaStop)
                return;
        }

        let diff = Math.round(performance.now() - startTime);
        globalComputationTime = diff;
        drawArray(tallest);
        toggleSortButton();
        writeNum(diff);
        return;
    }

    // select speed depending on array size
    if (len > 10000) {
        delay = 5;
        //Push start and end index in the stack
        stack.push({ x: start, y: end });

        //Iterate the stack
        let i = 0;
        while (stack.length) {
            let changed = 0;
            //Get the start and end from the stack
            const { x, y } = stack.shift();

            //Partition the array along the pivot
            const PI = partitionHigh(globalArray, x, y);

            //Push sub array with less elements than pivot into the stack
            if (PI - 1 > x) {
                stack.push({ x: x, y: PI - 1 });
                changed = 1;
            }

            //Push sub array with greater elements than pivot into the stack
            if (PI + 1 < y) {
                stack.push({ x: PI + 1, y: y });
                changed = 1;
            }
            if (changed && i % 20 == 0) {
                drawArray(tallest);
                await sleep(delay);
                changed = 0;
            }
            i += 1;
            if (gottaStop)
                return;
            if (isSorted(globalArray))
                break;
        }
        drawArray(tallest);
        toggleSortButton();
        return;
    }
    else if (len <= 10000 && len > 1000) {
        delay = 20;
        //Push start and end index in the stack
        stack.push({ x: start, y: end });

        //Iterate the stack
        let i = 0;
        while (stack.length) {
            let changed = 0;
            //Get the start and end from the stack
            const { x, y } = stack.shift();

            //Partition the array along the pivot
            const PI = partitionHigh(globalArray, x, y);

            //Push sub array with less elements than pivot into the stack
            if (PI - 1 > x) {
                stack.push({ x: x, y: PI - 1 });
                changed = 1;
            }

            //Push sub array with greater elements than pivot into the stack
            if (PI + 1 < y) {
                stack.push({ x: PI + 1, y: y });
                changed = 1;
            }
            if (changed && i % 2 == 0) {
                drawArray(tallest);
                await sleep(delay);
                changed = 0;
            }
            i += 1;
            if (gottaStop)
                return;
            if (isSorted(globalArray))
                break;
        }
        drawArray(tallest);
        toggleSortButton();
        return;
    }
    else if (len <= 1000 && len > 100) {
        delay = 50;
    }

    else if (len <= 100 && len > 10) {
        delay = 100;
    }

    //Push start and end index in the stack
    stack.push({ x: start, y: end });

    //Iterate the stack
    while (stack.length) {
        let changed = 0;
        //Get the start and end from the stack
        const { x, y } = stack.shift();

        //Partition the array along the pivot
        const PI = partitionHigh(globalArray, x, y);

        //Push sub array with less elements than pivot into the stack
        if (PI - 1 > x) {
            stack.push({ x: x, y: PI - 1 });
            changed = 1;
        }

        //Push sub array with greater elements than pivot into the stack
        if (PI + 1 < y) {
            stack.push({ x: PI + 1, y: y });
            changed = 1;
        }
        if (changed) {
            drawArray(tallest);
            await sleep(delay);
            changed = 0;
        }
        if (gottaStop)
            return;
        if (isSorted(globalArray))
            break;
    }
    drawArray(tallest);
    toggleSortButton();
    return;
}

async function maxHeapify(arr, n, tallest) {
    var delay = 200;
    // select speed depending on array size
    if (n > 10000) {
        delay = 1;
        for (let i = 1; i < n; i++) {
            //If child is greater than parent
            if (arr[i] > arr[parseInt((i - 1) / 2)]) {
                let j = i;

                // swap child and parent until 
                // parent is smaller
                while (arr[j] > arr[parseInt((j - 1) / 2)]) {
                    //Get the indexes of both the child
                    const l = j;
                    const r = parseInt((j - 1) / 2);

                    //Swap
                    [arr[l], arr[r]] = [arr[r], arr[l]];

                    //reduce
                    j = parseInt((j - 1) / 2);
                    if (gottaStop) {
                        return 0;
                    }
                }
                if (i % 100 == 0) {
                    drawArray(tallest);
                    await sleep(delay);
                }
                if (gottaStop) {
                    return 0;
                }
            }
            if (gottaStop) {
                return 0;
            }
        }
        return;
    }
    else if (n <= 10000 && n > 1000) {
        delay = 1;
        for (let i = 1; i < n; i++) {
            //If child is greater than parent
            if (arr[i] > arr[parseInt((i - 1) / 2)]) {
                let j = i;

                // swap child and parent until 
                // parent is smaller
                while (arr[j] > arr[parseInt((j - 1) / 2)]) {
                    //Get the indexes of both the child
                    const l = j;
                    const r = parseInt((j - 1) / 2);

                    //Swap
                    [arr[l], arr[r]] = [arr[r], arr[l]];

                    //reduce
                    j = parseInt((j - 1) / 2);
                    if (gottaStop) {
                        return 0;
                    }
                }
                if (i % 20 == 0) {
                    drawArray(tallest);
                    await sleep(delay);
                }
                if (gottaStop) {
                    return 0;
                }
            }
            if (gottaStop) {
                return 0;
            }
        }
        return;
    }
    else if (n <= 1000 && n > 100) {
        delay = 5;
    }

    else if (n <= 100 && n > 10) {
        delay = 40;
    }

    for (let i = 1; i < n; i++) {
        //If child is greater than parent
        if (arr[i] > arr[parseInt((i - 1) / 2)]) {
            let j = i;

            // swap child and parent until 
            // parent is smaller
            while (arr[j] > arr[parseInt((j - 1) / 2)]) {
                //Get the indexes of both the child
                const l = j;
                const r = parseInt((j - 1) / 2);

                //Swap
                [arr[l], arr[r]] = [arr[r], arr[l]];

                //reduce
                j = parseInt((j - 1) / 2);
                drawArray(tallest);
                await sleep(delay);
                if (gottaStop) {
                    return 0;
                }
            }
        }
        if (gottaStop) {
            return 0;
        }
    }
    return;
}

function instantMaxHeapify(arr, n, tallest) {
    for (let i = 1; i < n; i++) {
        //If child is greater than parent
        if (arr[i] > arr[parseInt((i - 1) / 2)]) {
            let j = i;

            // swap child and parent until 
            // parent is smaller
            while (arr[j] > arr[parseInt((j - 1) / 2)]) {
                //Get the indexes of both the child
                const l = j;
                const r = parseInt((j - 1) / 2);

                //Swap
                [arr[l], arr[r]] = [arr[r], arr[l]];

                //reduce
                j = parseInt((j - 1) / 2);
            }
        }
    }
}

async function heapSort() {
    let delay = 300;
    let len = globalArray.length;
    let tallest = Math.max(...globalArray);

    if (instantSort) {
        let startTime = performance.now();

        instantMaxHeapify(globalArray, len);

        for (let i = len - 1; i > 0; i--) {
            // swap value of first indexed 
            // with last indexed 
            [globalArray[0], globalArray[i]] = [globalArray[i], globalArray[0]];

            // maintaining heap property 
            // after each swapping 
            let j = 0, index;

            do {
                index = (2 * j + 1);

                // if left child is smaller than 
                // right child point index variable 
                // to right child 
                if (index < (i - 1) && globalArray[index] < globalArray[index + 1]) {
                    index++;
                }

                // if parent is smaller than child 
                // then swapping parent with child 
                // having higher value 
                if (index < i && globalArray[j] < globalArray[index]) {
                    [globalArray[j], globalArray[index]] = [globalArray[index], globalArray[j]];
                }

                j = index;
                if (gottaStop)
                    return;
                if (isSorted(globalArray))
                    break;
            } while (index < i);
        }

        let diff = Math.round(performance.now() - startTime);
        globalComputationTime = diff;
        drawArray(tallest);
        toggleSortButton();
        writeNum(diff);

        return;
    }

    // select speed depending on array size
    if (len > 10000) {
        delay = 1;
        await maxHeapify(globalArray, len, tallest);
        if (gottaStop) return;

        for (let i = len - 1; i > 0; i--) {
            // swap value of first indexed 
            // with last indexed 
            [globalArray[0], globalArray[i]] = [globalArray[i], globalArray[0]];

            // maintaining heap property 
            // after each swapping 
            let j = 0, index;

            do {
                index = (2 * j + 1);

                // if left child is smaller than 
                // right child point index variable 
                // to right child 
                if (index < (i - 1) && globalArray[index] < globalArray[index + 1]) {
                    index++;
                }

                // if parent is smaller than child 
                // then swapping parent with child 
                // having higher value 
                if (index < i && globalArray[j] < globalArray[index]) {
                    [globalArray[j], globalArray[index]] = [globalArray[index], globalArray[j]];
                }

                j = index;
                if (gottaStop)
                    return;
                if (isSorted(globalArray))
                    break;
            } while (index < i);
            if (i % 100 == 0) {
                drawArray(tallest);
                await sleep(delay);
            }
            if (gottaStop)
                return;
        }
        drawArray(tallest);
        toggleSortButton();
        return;
    }
    else if (len <= 10000 && len > 1000) {
        delay = 1;
        await maxHeapify(globalArray, len, tallest);
        if (gottaStop) return;

        for (let i = len - 1; i > 0; i--) {
            // swap value of first indexed 
            // with last indexed 
            [globalArray[0], globalArray[i]] = [globalArray[i], globalArray[0]];

            // maintaining heap property 
            // after each swapping 
            let j = 0, index;

            do {
                index = (2 * j + 1);

                // if left child is smaller than 
                // right child point index variable 
                // to right child 
                if (index < (i - 1) && globalArray[index] < globalArray[index + 1]) {
                    index++;
                }

                // if parent is smaller than child 
                // then swapping parent with child 
                // having higher value 
                if (index < i && globalArray[j] < globalArray[index]) {
                    [globalArray[j], globalArray[index]] = [globalArray[index], globalArray[j]];
                }

                j = index;
                if (gottaStop)
                    return;
                if (isSorted(globalArray))
                    break;
            } while (index < i);
            if (i % 10 == 0) {
                drawArray(tallest);
                await sleep(delay);
            }
            if (gottaStop)
                return;
        }
        drawArray(tallest);
        toggleSortButton();
        return;
    }
    else if (len <= 1000 && len > 100) {
        delay = 1;
    }

    else if (len <= 100 && len > 10) {
        delay = 20;
    }

    await maxHeapify(globalArray, len, tallest);
    if (gottaStop) return;

    for (let i = len - 1; i > 0; i--) {
        // swap value of first indexed 
        // with last indexed 
        [globalArray[0], globalArray[i]] = [globalArray[i], globalArray[0]];

        // maintaining heap property 
        // after each swapping 
        let j = 0, index;

        do {
            index = (2 * j + 1);

            // if left child is smaller than 
            // right child point index variable 
            // to right child 
            if (index < (i - 1) && globalArray[index] < globalArray[index + 1]) {
                index++;
            }

            // if parent is smaller than child 
            // then swapping parent with child 
            // having higher value 
            if (index < i && globalArray[j] < globalArray[index]) {
                [globalArray[j], globalArray[index]] = [globalArray[index], globalArray[j]];
            }

            j = index;
            drawArray(tallest);
            await sleep(delay);
            if (gottaStop)
                return;
            if (isSorted(globalArray))
                break;
        } while (index < i);
    }
    toggleSortButton();
    return;
}

async function mergeSort() {
    let delay = 500;
    let len = globalArray.length;
    let n = globalArray.length;
    let tallest = Math.max(...globalArray);

    if (instantSort) {
        let startTime = performance.now();

        //Create two arrays for sorting
        let n = globalArray.length;
        let buffer = new Array(n);

        for (let size = 1; size < n; size *= 2) {
            for (let leftStart = 0; leftStart < n; leftStart += 2 * size) {

                //Get the two sub arrays
                let left = leftStart,
                    right = Math.min(left + size, n),
                    leftLimit = right,
                    rightLimit = Math.min(right + size, n);

                //Merge the sub arrays
                merge(left, right, leftLimit, rightLimit, globalArray, buffer, tallest, delay);
            }

            //Swap the sorted sub array and merge them
            let temp = globalArray;
            globalArray = buffer;
            buffer = temp;

            if (gottaStop)
                return;
        }

        let diff = Math.round(performance.now() - startTime);
        globalComputationTime = diff;
        drawArray(tallest);
        toggleSortButton();
        writeNum(diff);

        return;
    }

    // select speed depending on array size
    if (len > 10000) {
        delay = 2;
        let z = 0;
        for (let size = 1; size < n; size *= 2) {
            for (let leftStart = 0; leftStart < n; leftStart += 2 * size) {

                //Get the two sub arrays
                let left = leftStart,
                    right = Math.min(left + size, n),
                    leftLimit = right,
                    rightLimit = Math.min(right + size, n);

                let i = left,
                    j = right;

                // merge
                while (i < j && j < rightLimit) {
                    console.log(i, j);
                    console.log(leftLimit, rightLimit);
                    if (globalArray[j] < globalArray[i]) {
                        for (let k = i; k < j; k++) {
                            swap(globalArray, j, k);
                        }
                        j++;
                    }
                    else {
                        i++;
                    }
                    if (z % 2000 == 0) {
                        drawArray(tallest);
                        await sleep(1);
                    }
                    if (gottaStop) return;
                    z++;
                }
            }

            drawArray(tallest);
            await sleep(delay);
            if (gottaStop) return;
            if (isSorted(globalArray))
                break;
        }
        toggleSortButton();
        return;
    }
    else if (len <= 10000 && len > 1000) {
        delay = 5;
        for (let size = 1; size < n; size *= 2) {
            let z = 0;
            for (let leftStart = 0; leftStart < n; leftStart += 2 * size) {

                //Get the two sub arrays
                let left = leftStart,
                    right = Math.min(left + size, n),
                    leftLimit = right,
                    rightLimit = Math.min(right + size, n);

                let i = left,
                    j = right;

                // merge
                while (i < j && j < rightLimit) {
                    console.log(i, j);
                    console.log(leftLimit, rightLimit);
                    if (globalArray[j] < globalArray[i]) {
                        for (let k = i; k < j; k++) {
                            swap(globalArray, j, k);
                        }
                        j++;
                    }
                    else {
                        i++;
                    }
                    if (z % 200 == 0) {
                        drawArray(tallest);
                        await sleep(1);
                    }
                    if (gottaStop) return;
                    z++;
                }
            }

            drawArray(tallest);
            await sleep(delay);
            if (gottaStop) return;
            if (isSorted(globalArray))
                break;
        }
        toggleSortButton();
        return;
    }
    else if (len <= 1000 && len > 100) {
        delay = 1;
    }

    else if (len <= 100 && len > 10) {
        delay = 70;
    }

    for (let size = 1; size < n; size *= 2) {
        for (let leftStart = 0; leftStart < n; leftStart += 2 * size) {

            //Get the two sub arrays
            let left = leftStart,
                right = Math.min(left + size, n),
                leftLimit = right,
                rightLimit = Math.min(right + size, n);

            let i = left,
                j = right;

            // merge
            while (i < j && j < rightLimit) {
                console.log(i, j);
                console.log(leftLimit, rightLimit);
                if (globalArray[j] < globalArray[i]) {
                    for (let k = i; k < j; k++) {
                        swap(globalArray, j, k);
                    }
                    j++;
                    drawArray(tallest);
                    await sleep(delay);
                    if (gottaStop) return;
                }
                else {
                    i++;
                }
            }
        }

        drawArray(tallest);
        await sleep(delay);
        if (gottaStop) return;
        if (isSorted(globalArray))
            break;
    }
    toggleSortButton();
    return;
}

const merge = (left, right, leftLimit, rightLimit, sorted, buffer) => {
    let i = left;

    //Compare the two sub arrays and merge them in the sorted order
    while (left < leftLimit && right < rightLimit) {
        if (sorted[left] <= sorted[right]) {
            buffer[i++] = sorted[left++];
        } else {
            buffer[i++] = sorted[right++];
        }
    }

    //If there are elements in the left sub arrray then add it to the result
    while (left < leftLimit) {
        buffer[i++] = sorted[left++];
    }

    //If there are elements in the right sub array then add it to the result
    while (right < rightLimit) {
        buffer[i++] = sorted[right++];
    }
}

function pop() {
    let str = prompt("enter custom array.", customArr);
    let arr = extractPositiveIntegersFromString(str);
    customArr = arr.toString();
    globalArray = arr;
    globalArraySize = globalArray.length;
    drawArray(Math.max(...globalArray));
}

function extractPositiveIntegersFromString(inputString) {
    // Regular expression to match positive integers
    var regex = /\b\d+\b/g; // \b matches word boundaries, \d+ matches one or more digits

    // Extract positive integers from the string using match() method
    var positiveIntegers = inputString.match(regex);

    // Filter out non-integer values and convert strings to integers
    if (positiveIntegers) {
        positiveIntegers = positiveIntegers.map(function (str) {
            return parseInt(str, 10);
        }).filter(function (num) {
            return !isNaN(num) && num > 0; // Filter out NaN and non-positive numbers
        });
    } else {
        positiveIntegers = []; // Return an empty array if no positive integers found
    }

    return positiveIntegers;
}


async function countingSort() {
    let delay = 500;
    let len = globalArray.length;
    let tallest = Math.max(...globalArray);

    let min = Math.min(...globalArray);
    let max = Math.max(...globalArray);
    let i = min,
        j = 0,
        count = [];

    if (instantSort) {
        let startTime = performance.now();

        for (i; i <= max; i++) {
            count[i] = 0;
        }

        for (i = 0; i < len; i++) {
            count[globalArray[i]] += 1;
        }

        for (i = min; i <= max; i++) {
            while (count[i] > 0) {
                globalArray[j] = i;
                j++;
                count[i]--;
            }
            if (gottaStop)
                return;
        }

        let diff = Math.round(performance.now() - startTime);
        globalComputationTime = diff;
        drawArray(tallest);
        toggleSortButton();
        writeNum(diff);

        return;
    }

    // select speed depending on array size
    if (len > 10000) {
        delay = 1;
        for (i; i <= max; i++) {
            count[i] = 0;
        }

        for (i = 0; i < len; i++) {
            count[globalArray[i]] += 1;
            globalArray[i] = 0;
            if (i % 200 == 0) {
                drawArray(tallest);
                await sleep(delay);
            }
            if (gottaStop)
                return;
        }

        drawArray(tallest);

        for (i = min; i <= max; i++) {
            while (count[i] > 0) {
                globalArray[j] = i;
                j++;
                count[i]--;
                if (j % 200 == 0) {
                    drawArray(tallest);
                    await sleep(delay);
                }
                if (gottaStop)
                    return;
            }
            if (i % 200 == 0) {
                drawArray(tallest);
                await sleep(delay);
            }

            if (gottaStop)
                return;
            if (isSorted(globalArray))
                break;
        }
        drawArray(tallest);
        toggleSortButton();
        return;
    }
    else if (len <= 10000 && len > 1000) {
        delay = 1;
        for (i; i <= max; i++) {
            count[i] = 0;
        }

        for (i = 0; i < len; i++) {
            count[globalArray[i]] += 1;
            globalArray[i] = 0;
            if (i % 30 == 0) {
                drawArray(tallest);
                await sleep(delay);
            }
            if (gottaStop)
                return;
        }

        drawArray(tallest);

        for (i = min; i <= max; i++) {
            let wasIn = 0;
            while (count[i] > 0) {
                wasIn = 1;
                globalArray[j] = i;
                j++;
                count[i]--;
                if (j % 30 == 0) {
                    drawArray(tallest);
                    await sleep(delay);
                }
                if (gottaStop)
                    return;
            }

            if (wasIn && i % 30 == 0) {
                drawArray(tallest);
                await sleep(delay);
            }

            if (gottaStop)
                return;
            if (isSorted(globalArray))
                break;
        }
        drawArray(tallest);
        toggleSortButton();
        return;
    }
    else if (len <= 1000 && len > 100) {
        delay = 1;
    }
    else if (len <= 100 && len > 10) {
        delay = 50;
    }

    for (i; i <= max; i++) {
        count[i] = 0;
    }

    for (i = 0; i < len; i++) {
        count[globalArray[i]] += 1;
        globalArray[i] = 0;
        drawArray(tallest);
        await sleep(delay);
        if (gottaStop)
            return;
    }

    for (i = min; i <= max; i++) {
        while (count[i] > 0) {
            globalArray[j] = i;
            j++;
            count[i]--;
            drawArray(tallest);
            await sleep(delay);
            if (gottaStop)
                return;
        }
        drawArray(tallest);
        if (gottaStop)
            return;
        if (isSorted(globalArray))
            break;
    }
    toggleSortButton();
    return;
}

async function radixSort() {
    let tallest = Math.max(...globalArray);
    let delay = 1500;

    if (instantSort) {
        let startTime = performance.now();

        const maxDigits = Math.max(...globalArray.map(num => Math.floor(Math.log2(num)) + 1));
        for (let k = 0; k < maxDigits; k++) {
            let digitBuckets = [[], []]; // Two buckets for 0 and 1
            for (let i = 0; i < globalArray.length; i++) {
                const digit = (globalArray[i] >> k) & 1; // Extract kth bit from right
                digitBuckets[digit].push(globalArray[i]);
            }
            globalArray = [].concat(...digitBuckets);
        }

        let diff = Math.round(performance.now() - startTime);
        globalComputationTime = diff;
        drawArray(tallest);
        toggleSortButton();
        writeNum(diff);

        return;
    }

    if (tallest > 10000) {
        delay = 300;
    }

    else if (tallest <= 10000 && tallest > 1000) {
        delay = 500;
    }
    else if (tallest <= 1000 && tallest > 100) {
        delay = 800;
    }

    else if (tallest <= 100 && tallest > 10) {
        delay = 1000;
    }

    const maxDigits = Math.max(...globalArray.map(num => Math.floor(Math.log2(num)) + 1));
    for (let k = 0; k < maxDigits; k++) {
        let digitBuckets = [[], []]; // Two buckets for 0 and 1
        for (let i = 0; i < globalArray.length; i++) {
            const digit = (globalArray[i] >> k) & 1; // Extract kth bit from right
            digitBuckets[digit].push(globalArray[i]);
            if (gottaStop) return;
        }
        globalArray = [].concat(...digitBuckets);
        drawArray(tallest);
        await sleep(delay);
        if (gottaStop) return;
    }

    toggleSortButton();
    return;
}


async function shellSort() {
    let delay = 500;
    let len = globalArray.length;
    let tallest = Math.max(...globalArray);

    if (instantSort) {
        let startTime = performance.now();

        // Start with a big gap, then reduce the gap
        for (var gap = Math.floor(len / 2); gap > 0; gap = Math.floor(gap / 2)) {
            // Do a gapped insertion sort for this gap size.
            for (var i = gap; i < len; i++) {
                // add arr[i] to the elements that have been gap sorted
                var temp = globalArray[i];
                var j;
                for (j = i; j >= gap && globalArray[j - gap] > temp; j -= gap)
                    globalArray[j] = globalArray[j - gap];

                // put temp (the original arr[i]) in its correct location
                globalArray[j] = temp;

                if (gottaStop)
                    return;
            }
        }

        let diff = Math.round(performance.now() - startTime);
        globalComputationTime = diff;
        drawArray(tallest);
        toggleSortButton();
        writeNum(diff);
        return;
    }

    // select speed depending on array size
    if (len > 10000) {
        delay = 1;
        // Start with a big gap, then reduce the gap
        for (var gap = Math.floor(len / 2); gap > 0; gap = Math.floor(gap / 2)) {
            // Do a gapped insertion sort for this gap size.
            for (var i = gap; i < len; i++) {
                let tempArr = [...globalArray];
                // add arr[i] to the elements that have been gap sorted
                var temp = globalArray[i];
                var j;
                for (j = i; j >= gap && globalArray[j - gap] > temp; j -= gap)
                    globalArray[j] = globalArray[j - gap];

                // put temp (the original arr[i]) in its correct location
                globalArray[j] = temp;

                if (i % 5000 / gap == 0 && JSON.stringify(tempArr) != JSON.stringify(globalArray)) {
                    drawArray(tallest);
                    await sleep(delay);
                }
                if (gottaStop)
                    return;
            }
        }
        drawArray(tallest);
        toggleSortButton();
        return;
    }
    else if (len <= 10000 && len > 1000) {
        delay = 1;
        // Start with a big gap, then reduce the gap
        for (var gap = Math.floor(len / 2); gap > 0; gap = Math.floor(gap / 2)) {
            // Do a gapped insertion sort for this gap size.
            for (var i = gap; i < len; i++) {
                let tempArr = [...globalArray];
                // add arr[i] to the elements that have been gap sorted
                var temp = globalArray[i];
                var j;
                for (j = i; j >= gap && globalArray[j - gap] > temp; j -= gap)
                    globalArray[j] = globalArray[j - gap];

                // put temp (the original arr[i]) in its correct location
                globalArray[j] = temp;

                if (i % 100 / gap == 0 && JSON.stringify(tempArr) != JSON.stringify(globalArray)) {
                    drawArray(tallest);
                    await sleep(delay * gap / 100);
                }
                if (gottaStop)
                    return;
                if (isSorted(globalArray))
                    break;
            }
        }
        drawArray(tallest);
        toggleSortButton();
        return;
    }
    else if (len <= 1000 && len > 100) {
        delay = 2;
    }

    else if (len <= 100 && len > 10) {
        delay = 50;
    }

    // Start with a big gap, then reduce the gap
    for (var gap = Math.floor(len / 2); gap > 0; gap = Math.floor(gap / 2)) {
        // Do a gapped insertion sort for this gap size.
        for (var i = gap; i < len; i++) {
            let tempArr = [...globalArray];
            // add arr[i] to the elements that have been gap sorted
            var temp = globalArray[i];
            var j;
            for (j = i; j >= gap && globalArray[j - gap] > temp; j -= gap)
                globalArray[j] = globalArray[j - gap];

            // put temp (the original arr[i]) in its correct location
            globalArray[j] = temp;

            if (JSON.stringify(tempArr) != JSON.stringify(globalArray)) {
                drawArray(tallest);
                await sleep(delay);
            }
            if (gottaStop)
                return;
            if (isSorted(globalArray))
                break;
        }
    }
    toggleSortButton();
    return;
}

// on page load
async function displayBogo() {
    setSelectionCanvas();
    let delay = 800;
    var localArray = [...Array(100).keys()].map(x => x + 1);
    globalArray = 0;
    globalSortingAlgorithm = "";
    gottaStop = 0;
    globalArray = localArray;
    while (!gottaStop) {
        shuffle(localArray);
        while (isSorted(localArray)) {
            shuffle(localArray);
        }
        displayDrawArray(localArray);
        await sleep(delay);
    }
    // set some global variable to false s.t.
    // error text can be displayed
    globalErrorText = 0;
    return;
}

// draw bars for sorting visualization
function displayDrawArray(arr) {
    const canvas = document.getElementById('arrayBarsCanvas');
    const ctx = canvas.getContext('2d');

    // Set canvas size to match viewport
    canvas.width = window.innerWidth * 0.9; // Adjust multiplier as needed
    canvas.height = window.innerHeight * 0.6; // Adjust multiplier as needed
    if (canvas.height > canvas.width)
        canvas.height = canvas.width;

    const canvas2 = document.getElementById('glowCanvas');
    const ctx2 = canvas2.getContext('2d');

    // Set canvas size to match viewport
    canvas2.width = window.innerWidth * 0.9; // Adjust multiplier as needed
    canvas2.height = window.innerHeight * 0.25; // Adjust multiplier as needed
    if (canvas2.height > canvas2.width)
        canvas2.height = canvas2.width;


    // Clear the canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx2.clearRect(0, 0, canvas2.width, canvas2.height);
    let tallest = 100;
    // draw bars
    const gap = 0.2 * canvas.width;
    const barWidth = 7 / 8 * (canvas.width - gap) / (arr.length);
    arr.forEach((value, index) => {
        const barHeight = value * canvas.height / tallest; // normalized s.t. tallest bar is at canvas top
        const correction = 0.05 * window.innerWidth;
        const x = gap / 2 + index * (8 / 7 * barWidth) + 1 / 16 * barWidth - correction;
        const y = canvas.height - barHeight;

        // shadow
        // Draw the parallelogram
        var offsetY = barHeight / 2.7;
        var shearAngle = 42 * (1 - canvas.height / (2 * canvas.width)) * Math.PI / 180;
        var offsetX = offsetY * Math.tan(shearAngle)
        var newX = x + barWidth;
        var newY = y + barHeight;
        ctx.beginPath();
        ctx.moveTo(newX, newY);
        ctx.lineTo(newX + offsetX, newY - offsetY);
        ctx.lineTo(newX + offsetX - barWidth, newY - offsetY);
        ctx.lineTo(newX - barWidth, newY);
        ctx.closePath();
        ctx.fillStyle = "rgba(0, 0, 0, 0.15)"; // Stroke color
        ctx.fill();

        // draw bars last to appear in front of shadow
        var alpha = value / tallest;
        var r = 255 * (1 - alpha);
        var g = 255 - (155 * alpha);
        ctx.fillStyle = 'rgba(' + r + ', ' + g + ', 255, 1)'; // bar colors = blue gradient
        ctx.fillRect(x, y, barWidth, barHeight);

        const gradient = ctx2.createLinearGradient(0, 0, 0, 0.55 * canvas2.height * alpha);

        // Add three color stops
        gradient.addColorStop(0, 'rgba(' + r + ', ' + g + ', 255, 0.1)');
        gradient.addColorStop(1, 'rgba(' + r + ', ' + g + ', 255, 0)');

        // Set the fill style and draw a rectangle
        ctx2.fillStyle = gradient;
        ctx2.fillRect(x, 0, barWidth, 0.55 * canvas2.height * alpha);
    });
}


/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
 * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
 * ARRAY STYLE * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
 * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
 * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * */
function almostSortedArray(size) {
    // Create a sorted array
    let numSwaps = 0.2 * size;
    let array = Array.from({ length: size }, (_, index) => index + 1);

    // Perform random swaps
    for (let i = 0; i < numSwaps; i++) {
        const index1 = Math.floor(Math.random() * size);
        const index2 = Math.floor(Math.random() * size);
        // Swap elements
        const temp = array[index1];
        array[index1] = array[index2];
        array[index2] = temp;
    }
    globalArray = array;
}

function invertedArray(size) {
    globalArray = Array.from({ length: size }, (_, index) => size - index);
}

function manyDuplicatesArray(size) {
    // Determine the number of unique elements required for 80% of the array
    var uniqueCount = Math.ceil(size * 0.5);
    if (size > 10 && size <= 100) uniqueCount = Math.ceil(size * 0.3);
    else if (size > 100 && size <= 1000) uniqueCount = Math.ceil(size * 0.08);
    if (size > 1000 && size <= 10000) uniqueCount = Math.ceil(size * 0.005);
    if (size > 10000) uniqueCount = Math.ceil(size * 0.002);

    // Generate an array with unique elements
    var uniqueArray = [];
    for (var i = 1; i <= uniqueCount; i++) {
        uniqueArray.push(i);
    }

    // Duplicate elements to fill the remaining 90%
    var remainingCount = size - uniqueCount;
    var arrayWithDuplicates = uniqueArray.slice(); // Copy the unique array
    for (var j = 0; j < remainingCount; j++) {
        var randomIndex = Math.floor(Math.random() * uniqueCount);
        arrayWithDuplicates.push(uniqueArray[randomIndex]);
    }

    globalArray = shuffle(arrayWithDuplicates);
}

function invertedAlmostSortedArray(size) {
    // Create a sorted array
    let numSwaps = 0.2 * size;
    let array = Array.from({ length: size }, (_, index) => size - index);

    // Perform random swaps
    for (let i = 0; i < numSwaps; i++) {
        const index1 = Math.floor(Math.random() * size);
        const index2 = Math.floor(Math.random() * size);
        // Swap elements
        const temp = array[index1];
        array[index1] = array[index2];
        array[index2] = temp;
    }
    globalArray = array;
}

function highDifferenceArray(size) {
    const totalElements = 1000 * size;
    const randomElements = [];

    for (let i = 0; i < size; i++) {
        const randomIndex = Math.floor(Math.random() * totalElements) + 1;
        randomElements.push(randomIndex);
    }
    randomElements[0] = 1;
    randomElements[1] = totalElements;
    shuffle(randomElements);

    globalArray = randomElements; // set global array
}

