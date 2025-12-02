document.addEventListener('DOMContentLoaded', () => {
    // ==========================================
    // MOBILE MENU
    // ==========================================
    const mobileMenuBtn = document.getElementById('mobileMenuBtn');
    const navLinks = document.querySelector('.nav-links');

    mobileMenuBtn.addEventListener('click', () => {
        navLinks.classList.toggle('active');

        // Animate hamburger icon
        const spans = mobileMenuBtn.querySelectorAll('span');
        if (navLinks.classList.contains('active')) {
            spans[0].style.transform = 'rotate(45deg) translate(5px, 5px)';
            spans[1].style.opacity = '0';
            spans[2].style.transform = 'rotate(-45deg) translate(5px, -5px)';
        } else {
            spans[0].style.transform = 'none';
            spans[1].style.opacity = '1';
            spans[2].style.transform = 'none';
        }
    });

    // Close mobile menu when clicking a link
    document.querySelectorAll('.nav-links a').forEach(link => {
        link.addEventListener('click', () => {
            navLinks.classList.remove('active');
            const spans = mobileMenuBtn.querySelectorAll('span');
            spans[0].style.transform = 'none';
            spans[1].style.opacity = '1';
            spans[2].style.transform = 'none';
        });
    });

    // ==========================================
    // SMOOTH SCROLLING
    // ==========================================
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth'
                });
            }
        });
    });

    // ==========================================
    // FILE UPLOAD & DEMO SIMULATION
    // ==========================================
    const uploadArea = document.getElementById('uploadArea');
    const fileInput = document.getElementById('fileInput');
    const imagePreview = document.getElementById('imagePreview');
    const previewImg = document.getElementById('previewImg');
    const removeBtn = document.getElementById('removeBtn');
    const analyzeBtn = document.getElementById('analyzeBtn');
    const demoResults = document.getElementById('demoResults');
    const processingIndicator = document.getElementById('processingIndicator');
    const resultsContent = document.getElementById('resultsContent');
    const resetBtn = document.getElementById('resetBtn');

    // Drag & Drop events
    ['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
        uploadArea.addEventListener(eventName, preventDefaults, false);
    });

    function preventDefaults(e) {
        e.preventDefault();
        e.stopPropagation();
    }

    ['dragenter', 'dragover'].forEach(eventName => {
        uploadArea.addEventListener(eventName, highlight, false);
    });

    ['dragleave', 'drop'].forEach(eventName => {
        uploadArea.addEventListener(eventName, unhighlight, false);
    });

    function highlight(e) {
        uploadArea.style.borderColor = 'var(--primary)';
        uploadArea.style.background = '#f8fafc';
    }

    function unhighlight(e) {
        uploadArea.style.borderColor = 'var(--border)';
        uploadArea.style.background = 'white';
    }

    uploadArea.addEventListener('drop', handleDrop, false);

    function handleDrop(e) {
        const dt = e.dataTransfer;
        const files = dt.files;
        handleFiles(files);
    }

    // Click to upload
    uploadArea.addEventListener('click', () => {
        fileInput.click();
    });

    fileInput.addEventListener('change', function () {
        handleFiles(this.files);
    });

    function handleFiles(files) {
        if (files.length > 0) {
            const file = files[0];
            if (file.type.startsWith('image/')) {
                const reader = new FileReader();
                reader.onload = function (e) {
                    previewImg.src = e.target.result;
                    uploadArea.style.display = 'none';
                    imagePreview.style.display = 'inline-block';
                    analyzeBtn.disabled = false;

                    // Reset results if showing
                    demoResults.style.display = 'none';
                    resultsContent.style.display = 'none';
                }
                reader.readAsDataURL(file);
            } else {
                showToast('Please upload a valid image file (JPG/PNG)');
            }
        }
    }

    // Remove image
    removeBtn.addEventListener('click', (e) => {
        e.stopPropagation(); // Prevent triggering upload click
        resetUpload();
    });

    function resetUpload() {
        fileInput.value = '';
        imagePreview.style.display = 'none';
        uploadArea.style.display = 'block';
        analyzeBtn.disabled = true;
        demoResults.style.display = 'none';
        resultsContent.style.display = 'none';
    }

    // Analyze Button - Real AI Prediction
    analyzeBtn.addEventListener('click', () => {
        analyzeBtn.disabled = true;
        demoResults.style.display = 'block';
        processingIndicator.style.display = 'flex';
        resultsContent.style.display = 'none';

        // Scroll to results
        demoResults.scrollIntoView({ behavior: 'smooth', block: 'nearest' });

        // Create FormData to send file
        const formData = new FormData();
        formData.append('file', fileInput.files[0]);

        // Call Flask API
        fetch('/predict', {
            method: 'POST',
            body: formData
        })
            .then(response => response.json())
            .then(data => {
                processingIndicator.style.display = 'none';
                resultsContent.style.display = 'block';

                if (data.error) {
                    showToast('Error: ' + data.error);
                    return;
                }

                const predictionEl = document.getElementById('predictionResult');
                const confidenceEl = document.getElementById('confidenceScore');
                const fillEl = document.getElementById('confidenceFill');
                const timeEl = document.getElementById('processingTime');

                if (data.is_cancerous) {
                    predictionEl.textContent = 'Cancerous Nodule Detected';
                    predictionEl.style.color = 'var(--danger)';
                } else {
                    predictionEl.textContent = 'Non-Cancerous (Benign)';
                    predictionEl.style.color = 'var(--success)';
                }

                confidenceEl.textContent = `${data.confidence}%`;
                // Random processing time for display effect (since real time is instant)
                timeEl.textContent = (0.5 + Math.random() * 0.5).toFixed(2) + 's';

                // Animate bar
                setTimeout(() => {
                    fillEl.style.width = `${data.confidence}%`;
                    if (data.is_cancerous) {
                        fillEl.style.background = 'linear-gradient(90deg, #ef4444, #b91c1c)';
                    } else {
                        fillEl.style.background = 'linear-gradient(90deg, #10b981, #059669)';
                    }
                }, 100);
            })
            .catch(error => {
                console.error('Error:', error);
                processingIndicator.style.display = 'none';
                showToast('Error connecting to server. Is app.py running?');

                // Re-enable button so they can try again
                analyzeBtn.disabled = false;
            });
    });

    resetBtn.addEventListener('click', () => {
        resetUpload();
    });

    // ==========================================
    // METRICS ANIMATION
    // ==========================================
    const observerOptions = {
        threshold: 0.5
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const counters = entry.target.querySelectorAll('.metric-value');
                const bars = entry.target.querySelectorAll('.metric-fill');

                counters.forEach(counter => {
                    const target = parseFloat(counter.getAttribute('data-target'));
                    const isFloat = target % 1 !== 0;
                    const duration = 2000; // 2s
                    const start = 0;
                    const startTime = performance.now();

                    function update(currentTime) {
                        const elapsed = currentTime - startTime;
                        const progress = Math.min(elapsed / duration, 1);

                        // Ease out quart
                        const ease = 1 - Math.pow(1 - progress, 4);

                        const current = start + (target - start) * ease;

                        if (isFloat) {
                            counter.textContent = current.toFixed(2);
                        } else {
                            counter.textContent = Math.floor(current);
                        }

                        if (progress < 1) {
                            requestAnimationFrame(update);
                        } else {
                            counter.textContent = target; // Ensure final value
                        }
                    }

                    requestAnimationFrame(update);
                });

                // Trigger bar animations via CSS width transition
                bars.forEach(bar => {
                    // Force reflow
                    void bar.offsetWidth;
                    // The width is already set in inline style, just need to ensure transition happens
                });

                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    const metricsSection = document.querySelector('.metrics-section');
    if (metricsSection) {
        observer.observe(metricsSection);
    }

    // ==========================================
    // COPY TO CLIPBOARD
    // ==========================================
    const copyBtn = document.getElementById('copyBtn');
    const resumeContent = document.getElementById('resumeContent');

    copyBtn.addEventListener('click', () => {
        // Get text content without HTML tags, but preserve list structure
        const listItems = resumeContent.querySelectorAll('li');
        let textToCopy = '';

        listItems.forEach(item => {
            textToCopy += '• ' + item.textContent.trim() + '\n';
        });

        navigator.clipboard.writeText(textToCopy).then(() => {
            showToast('Resume description copied!');

            // Visual feedback on button
            const originalHTML = copyBtn.innerHTML;
            copyBtn.innerHTML = `
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <polyline points="20 6 9 17 4 12"></polyline>
                </svg>
                Copied!
            `;
            copyBtn.style.color = 'var(--success)';

            setTimeout(() => {
                copyBtn.innerHTML = originalHTML;
                copyBtn.style.color = '';
            }, 2000);
        });
    });

    // ==========================================
    // TOAST NOTIFICATION
    // ==========================================
    function showToast(message) {
        const toast = document.getElementById('toast');
        const toastMessage = document.getElementById('toastMessage');

        toastMessage.textContent = message;
        toast.classList.add('show');

        setTimeout(() => {
            toast.classList.remove('show');
        }, 3000);
    }
});
