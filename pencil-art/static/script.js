// DOM Elements
const fileInput = document.getElementById('fileInput');
const uploadButton = document.getElementById('uploadButton');
const uploadArea = document.getElementById('uploadArea');
const uploadContainer = document.getElementById('uploadContainer');
const styleSelector = document.getElementById('styleSelector');
const loading = document.getElementById('loading');
const resultsSection = document.getElementById('resultsSection');
const originalImage = document.getElementById('originalImage');
const sketchImage = document.getElementById('sketchImage');
const downloadBtn = document.getElementById('downloadBtn');
const tryAgainBtn = document.getElementById('tryAgainBtn');
const enhanceBtn = document.getElementById('enhanceBtn');

let currentSketchData = null;
let selectedStyle = 'classic';

// Style selection
document.querySelectorAll('.style-option').forEach(button => {
    button.addEventListener('click', () => {
        document.querySelectorAll('.style-option').forEach(b => b.classList.remove('active'));
        button.classList.add('active');
        selectedStyle = button.dataset.style;
    });
});

// Upload button click
uploadButton.addEventListener('click', (e) => {
    e.stopPropagation();
    fileInput.click();
});

// Upload area click
uploadArea.addEventListener('click', () => {
    fileInput.click();
});

// File input change
fileInput.addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (file) {
        handleFile(file);
    }
});

// Drag and drop
uploadArea.addEventListener('dragover', (e) => {
    e.preventDefault();
    uploadArea.classList.add('dragover');
});

uploadArea.addEventListener('dragleave', () => {
    uploadArea.classList.remove('dragover');
});

uploadArea.addEventListener('drop', (e) => {
    e.preventDefault();
    uploadArea.classList.remove('dragover');
    
    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith('image/')) {
        handleFile(file);
    }
});

// Handle file upload
async function handleFile(file) {
    // Validate file type
    const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/bmp', 'image/tiff', 'image/webp'];
    if (!validTypes.includes(file.type)) {
        alert('Please upload a valid image file (JPG, PNG, BMP, TIFF, WEBP)');
        return;
    }

    // Validate file size (16MB max)
    if (file.size > 16 * 1024 * 1024) {
        alert('File size must be less than 16MB');
        return;
    }

    // Show style selector
    styleSelector.style.display = 'block';
    
    // Wait a moment for user to see style options
    setTimeout(() => {
        uploadImage(file);
    }, 500);
}

// Upload image to server
async function uploadImage(file) {
    // Hide upload area and show loading
    uploadContainer.style.display = 'none';
    styleSelector.style.display = 'none';
    loading.style.display = 'block';

    const formData = new FormData();
    formData.append('image', file);
    formData.append('style', selectedStyle);

    try {
        const response = await fetch('/upload', {
            method: 'POST',
            body: formData
        });

        const data = await response.json();

        if (data.success) {
            // Hide loading and show results
            loading.style.display = 'none';
            resultsSection.style.display = 'block';

            // Set images
            originalImage.src = data.original;
            sketchImage.src = data.sketch;
            currentSketchData = data.sketch;

            // Smooth scroll to results
            resultsSection.scrollIntoView({ behavior: 'smooth', block: 'center' });
        } else {
            throw new Error(data.error || 'Failed to process image');
        }
    } catch (error) {
        loading.style.display = 'none';
        uploadContainer.style.display = 'block';
        alert('Error: ' + error.message);
    }
}

// Download sketch
downloadBtn.addEventListener('click', () => {
    if (currentSketchData) {
        const link = document.createElement('a');
        link.href = currentSketchData;
        link.download = `sketch-${Date.now()}.png`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }
});

// Try again
tryAgainBtn.addEventListener('click', () => {
    resultsSection.style.display = 'none';
    uploadContainer.style.display = 'block';
    styleSelector.style.display = 'none';
    fileInput.value = '';
    currentSketchData = null;
    
    // Scroll to upload section
    uploadContainer.scrollIntoView({ behavior: 'smooth', block: 'center' });
});

// Enhance further (placeholder)
enhanceBtn.addEventListener('click', () => {
    alert('Enhancement features coming soon! 🎨\n\nFuture options:\n- Adjust sketch intensity\n- Add custom filters\n- Multiple style combinations\n- Advanced enhancements');
});

// Smooth scroll for navigation
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({ behavior: 'smooth' });
        }
    });
});

// Add loading animation text variation
const loadingMessages = [
    'Creating your masterpiece...',
    'Applying artistic touches...',
    'Converting to sketch...',
    'Adding pencil strokes...',
    'Almost there...'
];

let messageIndex = 0;
setInterval(() => {
    if (loading.style.display === 'block') {
        const loadingText = loading.querySelector('p');
        if (loadingText) {
            messageIndex = (messageIndex + 1) % loadingMessages.length;
            loadingText.textContent = loadingMessages[messageIndex];
        }
    }
}, 2000);
