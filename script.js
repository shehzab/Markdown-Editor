let darkMode = true;
const editor = document.getElementById('editor');
const preview = document.getElementById('preview');
const darkModeBtn = document.getElementById('darkModeBtn');
let debounceTimer;


marked.setOptions({
    highlight: function(code, language) {
        if (language && hljs.getLanguage(language)) {
            return hljs.highlight(code, { language }).value;
        }
        return hljs.highlightAuto(code).value;
    },
    breaks: true,
    gfm: true
});

// Event Listeners
editor.addEventListener('input', function() {
    clearTimeout(debounceTimer);
    debounceTimer = setTimeout(updatePreview, 300);
});

darkModeBtn.addEventListener('click', toggleTheme);


loadSavedContent();
updatePreview();


function updatePreview() {
    const markdown = editor.value;
    preview.innerHTML = marked.parse(markdown);
    updateCounts();
    hljs.highlightAll();
}

function updateCounts() {
    const text = editor.value;
    document.getElementById('wordCount').textContent = `Words: ${text.trim().split(/\s+/).length}`;
    document.getElementById('charCount').textContent = `Characters: ${text.length}`;
}

function toggleTheme() {
    darkMode = !darkMode;
    document.documentElement.style.setProperty('--editor-bg', darkMode ? '#282c34' : '#ffffff');
    document.documentElement.style.setProperty('--bg-color', darkMode ? '#1a1a1a' : '#f5f6fa');
    editor.style.color = darkMode ? '#abb2bf' : '#000000';
}

// Text Manipulation Functions
function insertText(prefix, suffix = '') {
    const start = editor.selectionStart;
    const end = editor.selectionEnd;
    const selectedText = editor.value.substring(start, end);
    const replacement = prefix + selectedText + suffix;
    
    editor.value = editor.value.substring(0, start) + replacement + editor.value.substring(end);
    editor.focus();
    editor.setSelectionRange(start + prefix.length, end + prefix.length);
    updatePreview();
}


const templates = {
    readme: `# Project Title\n\n## Description\n\nBrief description of your project\n\n## Installation\n\n\`\`\`bash\nnpm install\n\`\`\`\n\n## Usage\n\n\`\`\`javascript\nconst example = 'Hello World';\nconsole.log(example);\n\`\`\`\n\n## License\n\nMIT`,
    blog: `# Blog Post Title\n\n![Cover Image](image-url)\n\n## Introduction\n\nStart with an engaging introduction.\n\n## Main Content\n\nYour main content here.\n\n### Subheading\n\nMore detailed information.\n\n## Conclusion\n\nSum up your post.\n\n---\n*Author: Your Name*`
};

function insertTemplate(type) {
    editor.value = templates[type];
    updatePreview();
    closePopup();
}


function saveMarkdown() {
    localStorage.setItem('markdownContent', editor.value);
    alert('Content saved!');
}

function loadSavedContent() {
    const savedContent = localStorage.getItem('markdownContent');
    if (savedContent) {
        editor.value = savedContent;
    }
}

function loadMarkdown() {
    const savedContent = localStorage.getItem('markdownContent');
    if (savedContent) {
        editor.value = savedContent;
        updatePreview();
    }
}


function showTemplates() {
    document.getElementById('templatesPopup').style.display = 'block';
    document.getElementById('overlay').style.display = 'block';
}

function closePopup() {
    document.getElementById('templatesPopup').style.display = 'none';
    document.getElementById('overlay').style.display = 'none';
}


document.addEventListener('keydown', function(e) {
    if (e.ctrlKey || e.metaKey) {
        switch(e.key) {
            case 's':
                e.preventDefault();
                saveMarkdown();
                break;
            case 'b':
                e.preventDefault();
                insertText('**', '**');
                break;
            case 'i':
                e.preventDefault();
                insertText('*', '*');
                break;
        }
    }
});
