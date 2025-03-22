function runCode() {
    const htmlContent = htmlEditor.getValue();
    const cssContent = cssEditor.getValue();
    const jsContent = jsEditor.getValue();

    // Create a new HTML document with the combined code
    const combinedContent = htmlContent.replace('</head>', `<style>${cssContent}</style></head>`)
                                     .replace('</body>', `<script>try { ${jsContent} } catch (error) { console.error("JavaScript Error:", error.message); document.body.innerHTML += '<div style="color: red; background: rgba(255,0,0,0.1); padding: 10px; margin-top: 10px; border-left: 4px solid red; font-family: monospace;">Error: ' + error.message + '</div>'; }</script></body>`);

    // Write to the iframe
    const iframe = document.getElementById('output');
    const iframeDoc = iframe.contentDocument || iframe.contentWindow.document;
    iframeDoc.open();
    iframeDoc.write(combinedContent);
    iframeDoc.close();
}

// Initialize CodeMirror editors
const htmlEditor = CodeMirror.fromTextArea(document.getElementById('html-code'), {
    mode: 'xml',
    theme: 'monokai',
    lineNumbers: true,
    autoCloseTags: true,
    autoCloseBrackets: true,
    matchBrackets: true,
    indentUnit: 2,
    tabSize: 2,
    lineWrapping: true
});

const cssEditor = CodeMirror.fromTextArea(document.getElementById('css-code'), {
    mode: 'css',
    theme: 'monokai',
    lineNumbers: true,
    autoCloseBrackets: true,
    matchBrackets: true,
    indentUnit: 2,
    tabSize: 2,
    lineWrapping: true
});

const jsEditor = CodeMirror.fromTextArea(document.getElementById('js-code'), {
    mode: 'javascript',
    theme: 'monokai',
    lineNumbers: true,
    autoCloseBrackets: true,
    matchBrackets: true,
    indentUnit: 2,
    tabSize: 2,
    lineWrapping: true
});

// Set default content
const defaultHtml = `<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>My Project</title>
  <style>
    /* CSS will be injected here */
  </style>
</head>
<body>
  <div class="container">
    Your code goes here
  </div>
</body>
</html>`;

const defaultCss = `@import url('https://fonts.googleapis.com/css2?family=Bree+Serif&family=Caveat:wght@400;700&family=Lobster&family=Monoton&family=Open+Sans:ital,wght@0,400;0,700;1,400;1,700&family=Playfair+Display+SC:ital,wght@0,400;0,700;1,700&family=Playfair+Display:ital,wght@0,400;0,700;1,700&family=Roboto:ital,wght@0,400;0,700;1,400;1,700&family=Source+Sans+Pro:ital,wght@0,400;0,700;1,700&family=Work+Sans:ital,wght@0,400;0,700;1,700&display=swap');

/* Add your styles here */
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  min-height: 100vh;
  font-family: 'Roboto', sans-serif;
  background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
  display: flex;
  justify-content: flex-start;
  align-items: center;
  padding: 20px;
  padding-right: 10%;
}

.container {
  width: 100%;
  max-width: 1200px;
  margin-left: 5%;
  padding: 2rem;
  background: rgba(255, 255, 255, 0.9);
  border-radius: 15px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
  backdrop-filter: blur(10px);
}`;

const defaultJs = `// Add your JavaScript code here
document.addEventListener('DOMContentLoaded', function() {
  console.log('Ready to code!');
});`;

// Set default content
htmlEditor.setValue(defaultHtml);
cssEditor.setValue(defaultCss);
jsEditor.setValue(defaultJs);

// Tab switching functionality
const tabButtons = document.querySelectorAll('.tab-button');
const editorWrappers = document.querySelectorAll('.editor-wrapper');

tabButtons.forEach(button => {
    button.addEventListener('click', () => {
        // Remove active class from all buttons and editors
        tabButtons.forEach(btn => btn.classList.remove('active'));
        editorWrappers.forEach(editor => editor.classList.remove('active'));

        // Add active class to clicked button and corresponding editor
        button.classList.add('active');
        const editorType = button.dataset.editor;
        document.getElementById(`${editorType}-editor`).classList.add('active');

        // Refresh the active editor
        switch(editorType) {
            case 'html':
                htmlEditor.refresh();
                break;
            case 'css':
                cssEditor.refresh();
                break;
            case 'js':
                jsEditor.refresh();
                break;
        }
    });
});

// Resizer functionality
const resizer = document.querySelector('.resizer');
const leftPanel = document.querySelector('.code-panel');
const rightPanel = document.querySelector('.output-panel');

let isResizing = false;
let startX;
let startLeftWidth;

resizer.addEventListener('mousedown', (e) => {
    isResizing = true;
    startX = e.pageX;
    startLeftWidth = leftPanel.offsetWidth;
    resizer.classList.add('active');
});

document.addEventListener('mousemove', (e) => {
    if (!isResizing) return;

    const diffX = e.pageX - startX;
    const containerWidth = resizer.parentNode.offsetWidth;
    const newLeftWidth = ((startLeftWidth + diffX) * 100) / containerWidth;

    if (newLeftWidth > 20 && newLeftWidth < 80) {
        leftPanel.style.flex = `0 0 ${newLeftWidth}%`;
        rightPanel.style.flex = `0 0 ${100 - newLeftWidth}%`;
    }
});

document.addEventListener('mouseup', () => {
    isResizing = false;
    resizer.classList.remove('active');
});

// Run code functionality
const runButton = document.getElementById('run-btn');
const output = document.getElementById('output');

runButton.addEventListener('click', runCode);

// Run code on startup
runCode();

// Navbar functionality
const hamburger = document.querySelector('.hamburger');
const navbar = document.querySelector('.left-navbar');
    
hamburger.addEventListener('click', function() {
    navbar.classList.toggle('expanded');
});

// Autorun functionality
const autorunCheckbox = document.getElementById('autorun');
let autorunEnabled = false;
let typingTimer;
const doneTypingInterval = 1000; // Time in ms (1 second)

// Set up autorun functionality
autorunCheckbox.addEventListener('change', function() {
    autorunEnabled = this.checked;
    if (autorunEnabled) {
        // Run immediately when autorun is enabled
        runCode();
    }
});

// Function to handle code changes with debounce
function codeChanged() {
    if (autorunEnabled) {
        clearTimeout(typingTimer);
        typingTimer = setTimeout(runCode, doneTypingInterval);
    }
}

// Add input event listeners to all code editors
htmlEditor.on('change', codeChanged);
cssEditor.on('change', codeChanged);
jsEditor.on('change', codeChanged);

// Add keyboard shortcut for running code (Ctrl+Enter)
document.addEventListener('keydown', function(e) {
    if (e.ctrlKey && e.key === 'Enter') {
        e.preventDefault();
        runCode();
    }
});