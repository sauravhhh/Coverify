document.addEventListener('DOMContentLoaded', function() {
    const canvas = document.getElementById('coverCanvas');
    const ctx = canvas.getContext('2d');
    const imageUpload = document.getElementById('imageUpload');
    const coverText = document.getElementById('coverText');
    const fontFamily = document.getElementById('fontFamily');
    const fontSize = document.getElementById('fontSize');
    const fontSizeValue = document.getElementById('fontSizeValue');
    const textColor = document.getElementById('textColor');
    const textShadowToggle = document.getElementById('textShadowToggle');
    const textBorderToggle = document.getElementById('textBorderToggle');
    const borderOptionsContainer = document.getElementById('borderOptionsContainer');
    const borderWidthContainer = document.getElementById('borderWidthContainer');
    const borderWidth = document.getElementById('borderWidth');
    const borderWidthValue = document.getElementById('borderWidthValue');
    const borderOptions = document.querySelectorAll('.border-option');
    const positionOptions = document.querySelectorAll('.position-option');
    const gradientToggle = document.getElementById('gradientToggle');
    const gradientColor = document.getElementById('gradientColor');
    const colorPresets = document.querySelectorAll('.color-preset');
    const downloadBtn = document.getElementById('downloadBtn');
    
    let uploadedImage = null;
    let textShadowEnabled = true;
    let textBorderEnabled = false;
    let selectedBorderColor = 'white';
    let currentBorderWidth = 2;
    let selectedPosition = 'middle';
    let gradientEnabled = false;
    
    // Initialize canvas with default background
    function initCanvas() {
        ctx.fillStyle = '#333333';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
    }
    
    // Draw the cover based on current settings
    function drawCover() {
        // Clear canvas
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        // Draw background image or default background
        if (uploadedImage) {
            // Calculate aspect ratio
            const imgRatio = uploadedImage.width / uploadedImage.height;
            const canvasRatio = canvas.width / canvas.height;
            
            let drawWidth, drawHeight, offsetX, offsetY;
            
            if (imgRatio > canvasRatio) {
                drawHeight = canvas.height;
                drawWidth = canvas.height * imgRatio;
                offsetX = (canvas.width - drawWidth) / 2;
                offsetY = 0;
            } else {
                drawWidth = canvas.width;
                drawHeight = canvas.width / imgRatio;
                offsetX = 0;
                offsetY = (canvas.height - drawHeight) / 2;
            }
            
            ctx.drawImage(uploadedImage, offsetX, offsetY, drawWidth, drawHeight);
        } else {
            ctx.fillStyle = '#333333';
            ctx.fillRect(0, 0, canvas.width, canvas.height);
        }
        
        // Apply gradient overlay if enabled
        if (gradientEnabled) {
            const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
            gradient.addColorStop(0, gradientColor.value);
            gradient.addColorStop(1, 'transparent');
            ctx.fillStyle = gradient;
            ctx.fillRect(0, 0, canvas.width, canvas.height);
        }
        
        // Draw text if provided
        if (coverText.value) {
            const x = canvas.width / 2; // Always center horizontally
            let y;
            
            // Calculate vertical position based on selection
            switch(selectedPosition) {
                case 'upper':
                    y = canvas.height * 0.25;
                    break;
                case 'middle':
                    y = canvas.height * 0.5;
                    break;
                case 'lower':
                    y = canvas.height * 0.75;
                    break;
            }
            
            ctx.font = `bold ${fontSize.value}px ${fontFamily.value}`;
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            
            // Add text shadow if enabled
            if (textShadowEnabled) {
                ctx.shadowColor = 'rgba(0, 0, 0, 0.7)';
                ctx.shadowBlur = 4;
                ctx.shadowOffsetX = 2;
                ctx.shadowOffsetY = 2;
            } else {
                ctx.shadowColor = 'transparent';
                ctx.shadowBlur = 0;
                ctx.shadowOffsetX = 0;
                ctx.shadowOffsetY = 0;
            }
            
            // Draw text border if enabled
            if (textBorderEnabled) {
                ctx.strokeStyle = selectedBorderColor;
                ctx.lineWidth = currentBorderWidth;
                ctx.strokeText(coverText.value, x, y);
            }
            
            // Draw the actual text
            ctx.fillStyle = textColor.value;
            ctx.fillText(coverText.value, x, y);
            
            // Reset shadow
            ctx.shadowColor = 'transparent';
            ctx.shadowBlur = 0;
            ctx.shadowOffsetX = 0;
            ctx.shadowOffsetY = 0;
        }
    }
    
    // Event listeners
    imageUpload.addEventListener('change', function(e) {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = function(event) {
                const img = new Image();
                img.onload = function() {
                    uploadedImage = img;
                    drawCover();
                };
                img.src = event.target.result;
            };
            reader.readAsDataURL(file);
        }
    });
    
    coverText.addEventListener('input', drawCover);
    fontFamily.addEventListener('change', drawCover);
    textColor.addEventListener('input', drawCover);
    
    fontSize.addEventListener('input', function() {
        fontSizeValue.textContent = this.value;
        drawCover();
    });
    
    textShadowToggle.addEventListener('change', function() {
        textShadowEnabled = this.checked;
        drawCover();
    });
    
    textBorderToggle.addEventListener('change', function() {
        textBorderEnabled = this.checked;
        if (textBorderEnabled) {
            borderOptionsContainer.style.display = 'flex';
            borderWidthContainer.style.display = 'block';
        } else {
            borderOptionsContainer.style.display = 'none';
            borderWidthContainer.style.display = 'none';
        }
        drawCover();
    });
    
    borderWidth.addEventListener('input', function() {
        borderWidthValue.textContent = this.value;
        currentBorderWidth = parseInt(this.value);
        drawCover();
    });
    
    // Border color selection
    borderOptions.forEach(option => {
        option.addEventListener('click', function() {
            borderOptions.forEach(opt => opt.classList.remove('selected'));
            this.classList.add('selected');
            selectedBorderColor = this.dataset.border;
            drawCover();
        });
    });
    
    // Position selection
    positionOptions.forEach(option => {
        option.addEventListener('click', function() {
            positionOptions.forEach(opt => opt.classList.remove('selected'));
            this.classList.add('selected');
            selectedPosition = this.dataset.position;
            drawCover();
        });
    });
    
    // Color presets
    colorPresets.forEach(preset => {
        preset.addEventListener('click', function() {
            colorPresets.forEach(p => p.classList.remove('selected'));
            this.classList.add('selected');
            textColor.value = this.dataset.color;
            drawCover();
        });
    });
    
    // Gradient toggle
    gradientToggle.addEventListener('change', function() {
        gradientEnabled = this.checked;
        if (gradientEnabled) {
            gradientColor.style.display = 'block';
        } else {
            gradientColor.style.display = 'none';
        }
        drawCover();
    });
    
    gradientColor.addEventListener('input', drawCover);
    
    // Set default selections
    document.querySelector('.border-option[data-border="white"]').classList.add('selected');
    document.querySelector('.color-preset.spotify-white').classList.add('selected');
    
    downloadBtn.addEventListener('click', function() {
        canvas.toBlob(function(blob) {
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = 'spotify-cover.png';
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
        });
    });
    
    // Initialize canvas
    initCanvas();
});
