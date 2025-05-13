document.addEventListener('DOMContentLoaded', () => {
    const buttons = document.querySelectorAll('.hero-buttons a');

    document.addEventListener('mousemove', (e) => {
        buttons.forEach(btn => {
            const rect = btn.getBoundingClientRect();
            const x = ((e.clientX - rect.left) / rect.width) * 100;
            const y = ((e.clientY - rect.top) / rect.height) * 100;
            btn.style.setProperty('--x', `${x}%`);
            btn.style.setProperty('--y', `${y}%`);
        });
    });

    if (document.querySelector('.hero-gifs')) {
        setupMobileCarousel();
    }
});

function setupMobileCarousel() {
    const heroGifsContainer = document.querySelector('.hero-gifs');
    const gifWrappers = Array.from(heroGifsContainer.querySelectorAll('.gif-wrapper'));
    const totalGifs = gifWrappers.length;

    if (totalGifs === 0) return;

    // Add class to activate mobile-specific styles
    heroGifsContainer.classList.add('mobile-carousel-active');

    // Create and prepend the track if it doesn't exist
    let track = heroGifsContainer.querySelector('.mobile-carousel-track');
    if (!track) {
        track = document.createElement('div');
        track.className = 'mobile-carousel-track';
        gifWrappers.forEach(wrapper => track.appendChild(wrapper));
        heroGifsContainer.insertBefore(track, heroGifsContainer.firstChild); // Prepend track
    }

    // Set width for each gif wrapper within the track
    // Each item takes up 100% of the track's parent (.hero-gifs)
    gifWrappers.forEach(wrapper => {
        wrapper.style.width = '100%'; 
        // Ensure other styles that might interfere are reset or managed by CSS
        wrapper.style.position = ''; // Let CSS handle or default
        wrapper.style.opacity = ''; // Let CSS handle
        wrapper.style.transform = ''; // Let CSS handle
        wrapper.style.boxShadow = ''; // Let CSS handle
        wrapper.style.zIndex = ''; // Let CSS handle
        wrapper.style.border = ''; // Let CSS handle
        wrapper.style.padding = ''; // Let CSS handle
        wrapper.style.margin = ''; // Let CSS handle
    });

    // Set the track width to accommodate all gifs side-by-side
    track.style.width = `${totalGifs * 100}%`;
    track.style.display = 'flex'; // Ensure flex display for the track
    track.style.transition = 'transform 0.5s ease-in-out';

    let currentIndex = 0;
    let intervalId = null;
    const slideDuration = 5000; // 5 seconds per slide

    // Create indicators if they don't exist
    let indicatorsContainer = heroGifsContainer.querySelector('.carousel-indicators');
    if (!indicatorsContainer) {
        indicatorsContainer = document.createElement('div');
        indicatorsContainer.className = 'carousel-indicators';
        // Insert indicators after the track (which is now the first child of heroGifsContainer)
        heroGifsContainer.insertBefore(indicatorsContainer, track.nextSibling);
    }
    indicatorsContainer.innerHTML = ''; // Clear existing indicators

    gifWrappers.forEach((_, index) => {
        const dot = document.createElement('button');
        dot.classList.add('dot');
        if (index === 0) dot.classList.add('active');
        dot.setAttribute('aria-label', `Go to slide ${index + 1}`);
        dot.addEventListener('click', () => {
            goToSlide(index);
            resetInterval(); // Reset timer when manually changing slide
        });
        indicatorsContainer.appendChild(dot);
    });

    const dots = indicatorsContainer.querySelectorAll('.dot');

    function updateIndicators(index) {
        dots.forEach((dot, idx) => {
            dot.classList.toggle('active', idx === index);
        });
    }

    function goToSlide(index, directTransition = false) {
        currentIndex = (index + totalGifs) % totalGifs;
        track.style.transform = `translateX(-${currentIndex * (100 / totalGifs)}%)`;
        updateIndicators(currentIndex);
        
        // Manage playback controls for the current slide
        gifWrappers.forEach((wrapper, idx) => {
            const video = wrapper.querySelector('img'); // Assuming img is the target for play/pause
            const playbackControls = wrapper.querySelector('.playback-controls');
            if (idx === currentIndex) {
                if (playbackControls) playbackControls.style.display = 'flex';
                // Attempt to play the current GIF if it's an actual GIF (not just an image)
                // This requires your GIFs to be playable or a more complex setup for video-like GIFs
                if (video && typeof video.play === 'function') {
                    video.play().catch(e => console.warn("Could not play video/gif:", e));
                }
            } else {
                if (playbackControls) playbackControls.style.display = 'none';
                if (video && typeof video.pause === 'function') {
                    video.pause();
                }
            }
        });
    }

    function nextSlide() {
        goToSlide(currentIndex + 1);
    }

    function startInterval() {
        if (intervalId) clearInterval(intervalId);
        intervalId = setInterval(nextSlide, slideDuration);
    }

    function resetInterval() {
        startInterval();
    }

    // Initialize
    goToSlide(0, true); // Go to the first slide without animation initially
    startInterval();

    // Add touch/swipe functionality (basic example)
    let touchstartX = 0;
    let touchendX = 0;

    track.addEventListener('touchstart', function(event) {
        touchstartX = event.changedTouches[0].screenX;
        clearInterval(intervalId); // Pause autoplay on touch
    }, { passive: true });

    track.addEventListener('touchend', function(event) {
        touchendX = event.changedTouches[0].screenX;
        handleSwipeGesture();
        startInterval(); // Resume autoplay
    }, { passive: true });

    function handleSwipeGesture() {
        if (touchendX < touchstartX && (touchstartX - touchendX > 50)) { // Swiped left
            nextSlide();
        }
        if (touchendX > touchstartX && (touchendX - touchstartX > 50)) { // Swiped right
            goToSlide(currentIndex - 1);
        }
    }

    // Playback controls for each GIF (if applicable)
    gifWrappers.forEach((wrapper, index) => {
        const gifImage = wrapper.querySelector('img');
        const playPauseBtn = wrapper.querySelector('.play-pause-btn');
        const progressBarFill = wrapper.querySelector('.progress-bar-fill');
        const timeCounter = wrapper.querySelector('.time-counter');
        const playbackControls = wrapper.querySelector('.playback-controls');

        // Initially hide all playback controls, goToSlide will show for the active one

        if (playbackControls) playbackControls.style.display = 'none';

        // This is a placeholder for actual GIF playback control logic.
        // Controlling animated GIFs (play/pause/progress) is non-trivial and often requires
        // libraries or converting GIFs to video formats for better control.
        // The following implementation assumes 'gifImage' (the <img> tag) behaves like an HTMLMediaElement.
        // If these are actual GIFs, direct playback control (pause, specific frame, progress) is not
        // possible with standard HTML img tags and requires more complex solutions (e.g., canvas rendering).

        if (!gifImage || !playPauseBtn || !progressBarFill || !timeCounter) {
            // console.warn('Essential playback control elements not found for a GIF wrapper, index:', index);
            return; // Skip setup for this item if controls are missing
        }

        const formatTime = (timeInSeconds) => {
            if (isNaN(timeInSeconds) || timeInSeconds === Infinity) return '--:--';
            const minutes = Math.floor(timeInSeconds / 60);
            const seconds = Math.floor(timeInSeconds % 60).toString().padStart(2, '0');
            return `${minutes}:${seconds}`;
        };

        const updateMediaUITextAndButton = () => {
            if (gifImage.duration && isFinite(gifImage.duration)) {
                timeCounter.textContent = `${formatTime(gifImage.currentTime)} / ${formatTime(gifImage.duration)}`;
            } else {
                timeCounter.textContent = `${formatTime(gifImage.currentTime || 0)} / --:--`;
            }
            if (playPauseBtn) { // Check if playPauseBtn exists
                 playPauseBtn.textContent = (gifImage.paused || gifImage.ended) ? 'Play' : 'Pause';
            }
        };
        
        const updateMediaProgressBarState = () => {
            if (gifImage.duration && isFinite(gifImage.duration) && gifImage.currentTime >= 0) {
                const percentage = (gifImage.currentTime / gifImage.duration) * 100;
                progressBarFill.style.width = `${Math.max(0, Math.min(100, percentage))}%`;
            } else {
                progressBarFill.style.width = '0%';
            }
        };

        const initializeMediaUIStates = () => {
            updateMediaUITextAndButton();
            updateMediaProgressBarState();
        };
        
        if (typeof gifImage.addEventListener === 'function') {
            // Initialize UI once metadata is loaded or if already loaded
            gifImage.addEventListener('loadedmetadata', initializeMediaUIStates);
            gifImage.addEventListener('durationchange', initializeMediaUIStates); // Handle duration changes (e.g. for live streams, though not typical for GIFs)

            // Update UI during playback
            gifImage.addEventListener('timeupdate', () => {
                updateMediaUITextAndButton();
                updateMediaProgressBarState();
            });

            // Update button text on play/pause events triggered by player or code
            gifImage.addEventListener('play', updateMediaUITextAndButton);
            gifImage.addEventListener('pause', updateMediaUITextAndButton);
            gifImage.addEventListener('ended', () => {
                updateMediaUITextAndButton(); // Should show 'Play'
                // Optionally reset currentTime to 0 if desired for replayability from this control
                // gifImage.currentTime = 0; 
                // updateMediaProgressBarState();
            });

            // If media is already loaded (e.g. from cache), initialize UI
            if (gifImage.readyState >= 1) { // HAVE_METADATA or more
                initializeMediaUIStates();
            }
        } else {
            // Fallback for elements that don't support media events (e.g., actual <img> GIFs without special libraries)
            // In this case, progress bar and time counter will be static or largely non-functional.
            timeCounter.textContent = '0:00 / --:--';
            progressBarFill.style.width = '0%';
            if(playPauseBtn) playPauseBtn.textContent = 'Play'; // Default button text
        }


        if(playPauseBtn) { // Ensure playPauseBtn exists before adding listener
            playPauseBtn.addEventListener('click', (event) => {
                event.stopPropagation(); // Prevent carousel swipe/click logic if any parent handlers exist
                if (typeof gifImage.play === 'function' && typeof gifImage.pause === 'function') {
                    if (gifImage.paused || gifImage.ended) {
                        gifImage.play().catch(e => console.warn("Error playing media:", e));
                    } else {
                        gifImage.pause();
                    }
                } else {
                    // console.warn("Media element does not support play/pause or is not a standard media element.");
                }
            });
        }

        // Progress bar click to seek
        const progressBarContainer = progressBarFill.parentElement; // Assuming .progress-bar-fill is inside a .progress-bar container
        if (progressBarContainer && typeof gifImage.seekable !== 'undefined' && typeof gifImage.currentTime !== 'undefined' && typeof gifImage.duration !== 'undefined') {
             progressBarContainer.addEventListener('click', (event) => {
                event.stopPropagation();
                if (gifImage.duration && isFinite(gifImage.duration)) {
                    const rect = progressBarContainer.getBoundingClientRect();
                    const clickX = event.clientX - rect.left;
                    const seekPercentage = Math.max(0, Math.min(1, clickX / rect.width));
                    
                    // Check if media is seekable (e.g. not a live stream without DVR)
                    if (gifImage.seekable && gifImage.seekable.length > 0) { 
                        // A simple check for seekable ranges. For robust seeking, one might need to check:
                        // gifImage.seekable.start(0) <= targetTime && targetTime <= gifImage.seekable.end(0)
                        try {
                            gifImage.currentTime = gifImage.duration * seekPercentage;
                            // UI updates (text, progress bar) will be handled by the 'timeupdate' event,
                            // or can be called directly here for more immediate feedback:
                            updateMediaUITextAndButton(); 
                            updateMediaProgressBarState();
                        } catch (e) {
                            // console.warn("Error seeking media:", e);
                        }
                    } else {
                        // console.warn("Media is not seekable or has no seekable ranges.");
                    }
                }
            });
        }
    }); // End of gifWrappers.forEach

} // End of setupMobileCarousel function

// Note: To initialize the carousel, setupMobileCarousel() needs to be called.
// This is typically done after the DOM is fully loaded. For example, you could add it
// to the existing DOMContentLoaded event listener in this file:
//
// document.addEventListener('DOMContentLoaded', () => {
//     // ... existing button hover logic ...
//
//     if (document.querySelector('.hero-gifs')) {
//         setupMobileCarousel();
//     }
//
//     // Optional: Add a resize listener if the carousel needs to adapt to viewport changes
//     // let resizeTimeout;
//     // window.addEventListener('resize', () => {
//     //     clearTimeout(resizeTimeout);
//     //     resizeTimeout = setTimeout(() => {
//     //         if (document.querySelector('.hero-gifs.mobile-carousel-active')) {
//     //             // Consider if re-initialization is needed and how to do it cleanly
//     //             // (e.g., destroy existing instance first if setupMobileCarousel isn't idempotent)
//     //             // setupMobileCarousel(); 
//     //         }
//     //     }, 250);
//     // });
// });
// Make sure this call is placed appropriately in your script execution flow.