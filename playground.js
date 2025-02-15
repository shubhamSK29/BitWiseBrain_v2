function runCode() {
    let html = document.getElementById("html-code").value;
    let css = document.getElementById("css-code").value;
    let js = document.getElementById("js-code").value;

    // Get the iframe and wait for it to load
    let output = document.getElementById("output");
    
    // Set sandbox attribute to allow scripts to run
    output.setAttribute('sandbox', 'allow-scripts allow-same-origin');
    
    // Write the content
    output.contentWindow.document.open();
    output.contentWindow.document.write(`
        <!DOCTYPE html>
        <html>
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <style>
                ${css}
            </style>
        </head>
        <body>
            ${html}
            <script>
                window.onerror = function(msg, url, lineNo, columnNo, error) {
                    console.error(msg, url, lineNo, columnNo, error);
                    return false;
                };
                ${js}
            </script>
        </body>
        </html>
    `);
    output.contentWindow.document.close();
}

// Initialize sidebar and playground
document.addEventListener('DOMContentLoaded', function() {
    const sidebar = document.querySelector('.sidebar');
    const sidebarItems = document.querySelectorAll('.nav-link, .sidebar-btn');
    
    // Set initial state
    sidebar.classList.add('closed');
    
    // Add click event listener to all sidebar items
    sidebarItems.forEach(item => {
        item.addEventListener('click', function() {
            // Remove active class from all items
            sidebarItems.forEach(i => i.classList.remove('active'));
            // Add active class to clicked item
            this.classList.add('active');
        });
    });

    // Run code once on page load to initialize the output
    runCode();
}); 