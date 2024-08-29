const defaultSize = 16;
const container = document.getElementById("container");

// Slider to adjust the grid size
const slider = document.getElementById('gridSizeSlider');
const sliderValue = document.getElementById('sliderValue');

// Buttons
const blackButton = document.getElementById('blackButton');
const shadingButton = document.getElementById('shadingButton');
const eraseButton = document.getElementById('eraseButton');
const originalButton = document.getElementById('originalButton');

// Colors 
const retroColors = [
    '#FF6F61', '#6B5B95', '#88B04B', '#F7CAC9', 
    '#92A8D1', '#955251', '#B565A7', '#009B77'
];

const blackColor = '#000000';
const shadingAmount = 0.1;

let colorMode = 'retro';

// Function to get a random color from the retro palette
function getRandomColor() {
    const randomIndex = Math.floor(Math.random() * retroColors.length);
    return retroColors[randomIndex];
}

// Function to lighten a color
function lightenColor(color, amount) {
    let colorObj = parseInt(color.slice(1), 16);
    let r = (colorObj >> 16) & 0xff;
    let g = (colorObj >>  8) & 0xff;
    let b = (colorObj >>  0) & 0xff;

    r = Math.min(255, Math.floor(r + (255 - r) * amount));
    g = Math.min(255, Math.floor(g + (255 - g) * amount));
    b = Math.min(255, Math.floor(b + (255 - b) * amount));

    return `#${(1 << 24 | r << 16 | g << 8 | b).toString(16).slice(1)}`;
}

// Utility function to convert RGB to HEX
function rgbToHex(rgb) {
    let rgbArray = rgb.match(/\d+/g).map(Number);
    return '#' + rgbArray.map(x => x.toString(16).padStart(2, '0')).join('');
}

// Function to handle the color change based on the mode
function applyColor(cell) {
    switch (colorMode) {
        case 'black':
            cell.style.backgroundColor = blackColor;
            break;
        case 'shading':
            if (!cell.style.backgroundColor || cell.style.backgroundColor === 'transparent') {
                cell.style.backgroundColor = getRandomColor();
            } else {
                let hexColor = rgbToHex(cell.style.backgroundColor);
                cell.style.backgroundColor = lightenColor(hexColor, shadingAmount);
            }
            break;
        case 'erase':
            cell.style.backgroundColor = '';
            break;
        case 'retro':
        default:
            cell.style.backgroundColor = getRandomColor();
            break;
    }
}

function createGrid(size) {
    container.style.setProperty('--grid-size', size);
    container.innerHTML = ''; // Clear the container

    for (let i = 0; i < size * size; i++) {
        const cell = document.createElement("div");
        cell.classList.add("grid-cell");
        container.appendChild(cell);
    }

    // Add event listeners to each cell
    const gridCells = document.getElementsByClassName("grid-cell");

    for (let i = 0; i < gridCells.length; i++) {
        gridCells[i].addEventListener("mouseover", () => {
            applyColor(gridCells[i]);
        });
    }
}

// Create the initial default grid
createGrid(defaultSize);

// Button to ask the user for a new grid size
const button = document.getElementById("numberofsquareButton");
button.addEventListener("click", () => {
    let newSize = prompt('Enter the number of squares per side between 1 and 100');
    newSize = parseInt(newSize);

    if (newSize > 0 && newSize <= 100) {
        createGrid(newSize);
    } else {
        alert('Please enter a number between 1 and 100');
    }
});

// Slider to adjust the grid size 
slider.addEventListener('input', () => {
    const newSize = parseInt(slider.value);
    sliderValue.textContent = newSize;
    createGrid(newSize);
});

// Adjust grid size when the window is resized
window.addEventListener('resize', () => {
    createGrid(document.documentElement.style.getPropertyValue('--grid-size') || defaultSize);
});

// Change color mode with the buttons:
blackButton.addEventListener('click', () => {
    colorMode = 'black';
});

shadingButton.addEventListener('click', () => {
    colorMode = 'shading';
});

eraseButton.addEventListener('click', () => {
    colorMode = 'erase';
});

originalButton.addEventListener('click', () => {
    colorMode = 'retro';
});
