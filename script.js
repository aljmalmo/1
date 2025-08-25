// ======= Advanced Text Converter Script =======

// Elements
const inputText = document.getElementById('inputText');
const outputText = document.getElementById('outputText');
const charCount = document.getElementById('charCount');
const wordCount = document.getElementById('wordCount');
const paraCount = document.getElementById('paraCount');
const themeToggle = document.getElementById('themeToggle');

// Undo/Redo stack
let undoStack = [];
let redoStack = [];

// Load saved text from localStorage
window.onload = () => {
    if (localStorage.getItem('textInput')) {
        inputText.value = localStorage.getItem('textInput');
        updateOutput();
    }
}

// Theme toggle
themeToggle.addEventListener('click', () => {
    document.body.classList.toggle('dark');
    themeToggle.textContent = document.body.classList.contains('dark') ? '☀️ Light Mode' : '🌙 Dark Mode';
});

// Real-time update
inputText.addEventListener('input', () => {
    saveState();
    updateOutput();
});

// Save state for undo
function saveState() {
    undoStack.push(inputText.value);
    if (undoStack.length > 50) undoStack.shift(); // limit stack
    redoStack = [];
}

// Undo
function undo() {
    if (undoStack.length > 0) {
        redoStack.push(inputText.value);
        inputText.value = undoStack.pop();
        updateOutput();
    }
}

// Redo
function redo() {
    if (redoStack.length > 0) {
        undoStack.push(inputText.value);
        inputText.value = redoStack.pop();
        updateOutput();
    }
}

// Update output & stats
function updateOutput() {
    outputText.value = inputText.value;
    charCount.textContent = `Characters: ${inputText.value.length}`;
    wordCount.textContent = `Words: ${inputText.value.trim().split(/\s+/).filter(Boolean).length}`;
    paraCount.textContent = `Paragraphs: ${inputText.value.split(/\n+/).filter(Boolean).length}`;

    // Save to localStorage
    localStorage.setItem('textInput', inputText.value);
}

// Convert Text Functions
function convertText(type) {
    let text = inputText.value;

    switch(type) {
        case 'uppercase':
            text = text.toUpperCase();
            break;
        case 'lowercase':
            text = text.toLowerCase();
            break;
        case 'title':
            text = text.replace(/\w\S*/g, w => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase());
            break;
        case 'sentence':
            text = text.replace(/(^\s*\w|[\.\!\?]\s*\w)/g, c => c.toUpperCase());
            break;
        case 'toggle':
            text = Array.from(text).map(c => c === c.toUpperCase() ? c.toLowerCase() : c.toUpperCase()).join('');
            break;
    }

    inputText.value = text;
    saveState();
    updateOutput();
}

// Remove extra spaces
function removeExtraSpaces() {
    inputText.value = inputText.value.replace(/\s+/g, ' ').trim();
    saveState();
    updateOutput();
}

// Copy to clipboard
function copyToClipboard() {
    outputText.select();
    document.execCommand('copy');
    alert('Text copied to clipboard!');
}

// Download file
function downloadFile(type) {
    const text = outputText.value;
    if (!text) return alert('No text to download!');
    
    if(type === 'txt') {
        const blob = new Blob([text], {type: 'text/plain'});
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = 'text.txt';
        link.click();
    } else if(type === 'pdf') {
        const doc = new jsPDF();
        const lines = doc.splitTextToSize(text, 180);
        doc.text(lines, 10, 10);
        doc.save('text.pdf');
    }
}

// Text-to-Speech
function speakText() {
    if(!outputText.value) return;
    const utterance = new SpeechSynthesisUtterance(outputText.value);
    utterance.lang = 'en-US';
    speechSynthesis.speak(utterance);
}
