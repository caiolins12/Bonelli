document.addEventListener('DOMContentLoaded', () => {
  const heroGifsContainer = document.querySelector('.hero-gifs');
  if (!heroGifsContainer) {
    console.error('Hero GIFs container (.hero-gifs) not found.');
    return;
  }

  let isMobile = false;
  let currentIndex = 0; // For mobile
  let gifWrappers = [];
  let mobileCarouselTrackEl = null;
  let dotsContainerEl = null;
  let desktopRotationIntervalId = null;
  let activePlaybackTimerIntervalId = null;
  const PLAYBACK_TOTAL_DURATION = 5; // Seconds for playback bar and timer

  function formatTime(totalSeconds) {
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  }

  function wrapGifImages() {
    // Only wrap if direct img children exist and wrappers haven't been made yet by this script run
    const directImages = Array.from(heroGifsContainer.querySelectorAll(':scope > img'));
    if (directImages.length > 0) {
      directImages.forEach(img => {
        const wrapper = document.createElement('div');
        wrapper.classList.add('gif-wrapper');
        heroGifsContainer.insertBefore(wrapper, img);
        wrapper.appendChild(img);
      });
    }
    // Always re-query wrappers after potential modification
    gifWrappers = Array.from(heroGifsContainer.querySelectorAll('.gif-wrapper'));
  }

  function addPlaybackControls(wrapper) {
    if (!wrapper || wrapper.querySelector('.playback-controls')) return;

    const controlsContainer = document.createElement('div');
    controlsContainer.className = 'playback-controls';

    const playBtn = document.createElement('span');
    playBtn.className = 'play-pause-btn';
    playBtn.textContent = '▶';

    const progressBarContainer = document.createElement('div');
    progressBarContainer.className = 'progress-bar-container';
    const fill = document.createElement('div');
    fill.className = 'progress-bar-fill';
    progressBarContainer.appendChild(fill);

    const timeCounter = document.createElement('span');
    timeCounter.className = 'time-counter';
    
    controlsContainer.appendChild(playBtn);
    controlsContainer.appendChild(progressBarContainer);
    controlsContainer.appendChild(timeCounter);
    wrapper.appendChild(controlsContainer);

    if (activePlaybackTimerIntervalId) clearInterval(activePlaybackTimerIntervalId);
    
    let elapsedSeconds = 0;
    timeCounter.textContent = `${formatTime(elapsedSeconds)} / ${formatTime(PLAYBACK_TOTAL_DURATION)}`;
    
    fill.style.animation = 'none'; // Reset animation
    requestAnimationFrame(() => { // Ensure reset takes effect before restarting
        requestAnimationFrame(() => { // And then restart
            fill.style.animation = `progressBarAnimation ${PLAYBACK_TOTAL_DURATION}s linear forwards`;
        });
    });


    activePlaybackTimerIntervalId = setInterval(() => {
      elapsedSeconds++;
      const currentTimerTargetWrapper = isMobile ? 
        (gifWrappers[currentIndex] || null) : 
        (heroGifsContainer.querySelector('.gif-wrapper:nth-child(3)') || null);
      
      if (wrapper === currentTimerTargetWrapper && wrapper.querySelector('.playback-controls')) {
        if (elapsedSeconds <= PLAYBACK_TOTAL_DURATION) {
          timeCounter.textContent = `${formatTime(elapsedSeconds)} / ${formatTime(PLAYBACK_TOTAL_DURATION)}`;
        } else {
          timeCounter.textContent = `${formatTime(PLAYBACK_TOTAL_DURATION)} / ${formatTime(PLAYBACK_TOTAL_DURATION)}`;
          clearInterval(activePlaybackTimerIntervalId);
          activePlaybackTimerIntervalId = null;
          if (fill) { 
            fill.style.width = '100%';
            fill.style.animationPlayState = 'paused'; 
          }
          // Auto-advance for mobile when timer ends
          if (isMobile) {
            currentIndex = (currentIndex + 1) % gifWrappers.length; // Loop back to the first GIF
            updateMobileView(currentIndex, true);
          }
        }
      } else { 
        clearInterval(activePlaybackTimerIntervalId);
        activePlaybackTimerIntervalId = null;
      }
    }, 1000);
  }

  function removePlaybackControls(wrapper) {
    if (!wrapper) return;
    const controls = wrapper.querySelector('.playback-controls');
    if (controls) {
      wrapper.removeChild(controls);
    }
    // If a timer was specifically for this wrapper and it's being removed,
    // the timer's own check should ideally clear it.
    // However, direct clearing might be needed if the timer check is not robust enough.
  }
  
  function clearAllIntervalsAndControls() {
    if (desktopRotationIntervalId) clearInterval(desktopRotationIntervalId);
    desktopRotationIntervalId = null;
    
    if (activePlaybackTimerIntervalId) clearInterval(activePlaybackTimerIntervalId);
    activePlaybackTimerIntervalId = null;

    gifWrappers.forEach(removePlaybackControls);
  }

  function clearWrapperInlineStyles(wrapper) {
    wrapper.style.height = '';
    wrapper.style.paddingTop = '';
    wrapper.style.paddingBottom = ''; // Just in case
    // Keep width and flexShrink as they are likely managed by carousel logic generally
    // wrapper.style.width = '';
    // wrapper.style.flexShrink = '';
    // Opacity might be controlled by desktop/mobile logic, so leave it unless it was part of the experiment
    // wrapper.style.opacity = '';
  }

  function setupDesktopCarousel() {
    heroGifsContainer.classList.remove('mobile-carousel-active');
    heroGifsContainer.style.overflow = 'visible'; // Or as per original desktop CSS

    if (mobileCarouselTrackEl && mobileCarouselTrackEl.parentNode === heroGifsContainer) {
      // Move wrappers from mobile track back to heroGifsContainer directly
      while (mobileCarouselTrackEl.firstChild) {
        const wrapper = mobileCarouselTrackEl.firstChild;
        clearWrapperInlineStyles(wrapper); // Clear styles before moving
        heroGifsContainer.appendChild(wrapper);
      }
      heroGifsContainer.removeChild(mobileCarouselTrackEl);
    }
    mobileCarouselTrackEl = null; 

    if (dotsContainerEl && dotsContainerEl.parentNode) {
      dotsContainerEl.parentNode.removeChild(dotsContainerEl);
      dotsContainerEl = null;
    }
    
    heroGifsContainer.style.transform = ''; // Reset any transform
    gifWrappers.forEach(w => { // Reset styles for desktop display
        clearWrapperInlineStyles(w); // Ensure clean state for desktop CSS
        // Desktop CSS will take over for :nth-child etc.
    });
    // Ensure gifWrappers are direct children for :nth-child CSS to work as expected
    // This should be handled by moving them out of mobileCarouselTrackEl


    const updateAndAddControlsForDesktop = () => {
      gifWrappers.forEach(removePlaybackControls); // Remove from all first
      const middleWrapper = heroGifsContainer.querySelector('.gif-wrapper:nth-child(3)');
      if (middleWrapper) {
        addPlaybackControls(middleWrapper);
      }
    };

    updateAndAddControlsForDesktop(); 
    desktopRotationIntervalId = setInterval(() => {
      const first = heroGifsContainer.querySelector('.gif-wrapper:first-child');
      if (first && heroGifsContainer.children.length > 1) { // Ensure there's something to rotate
        heroGifsContainer.appendChild(first);
        updateAndAddControlsForDesktop();
      }
    }, PLAYBACK_TOTAL_DURATION * 1000);
  }

  function setupMobileCarousel() {
    heroGifsContainer.classList.add('mobile-carousel-active');
    heroGifsContainer.style.overflow = 'hidden'; // Essential for swipe container

    if (!mobileCarouselTrackEl || mobileCarouselTrackEl.parentNode !== heroGifsContainer) {
        if (mobileCarouselTrackEl && mobileCarouselTrackEl.parentNode) { // Detach if wrongly parented
             mobileCarouselTrackEl.parentNode.removeChild(mobileCarouselTrackEl);
        }
        mobileCarouselTrackEl = document.createElement('div');
        mobileCarouselTrackEl.className = 'mobile-carousel-track';
        // Move wrappers to track. If they are direct children of heroGifsContainer:
        gifWrappers.forEach(wrapper => {
          clearWrapperInlineStyles(wrapper); // Clear styles before moving to track
          mobileCarouselTrackEl.appendChild(wrapper);
        });
        heroGifsContainer.appendChild(mobileCarouselTrackEl);
    } else {
        // Ensure all wrappers are in the track if it exists
        gifWrappers.forEach(w => {
            if (w.parentNode !== mobileCarouselTrackEl) {
                clearWrapperInlineStyles(w);
                mobileCarouselTrackEl.appendChild(w);
            }
        });
    }
    
    if (gifWrappers.length > 0) { // Ensure gifWrappers is not empty before calculations
        mobileCarouselTrackEl.style.width = `${gifWrappers.length * 100}%`;
        mobileCarouselTrackEl.style.display = 'flex';
        gifWrappers.forEach(wrapper => {
          // Each wrapper takes 100% of the heroGifsContainer's width effectively
          wrapper.style.width = `${100 / gifWrappers.length}%`; 
          wrapper.style.flexShrink = '0';
          // Opacity is handled by CSS or general logic, not specifically reset here unless problematic
          // wrapper.style.opacity = '1'; 
          // Height and padding-top are now intended to be controlled by CSS for the "initial" state
        });
    }

    createMobileDots();
    currentIndex = Math.max(0, Math.min(currentIndex, gifWrappers.length - 1));
    updateMobileView(currentIndex, false);

    let touchStartX = 0;
    heroGifsContainer.ontouchstart = (e) => { 
        // Prevent scroll interference if desired, but be cautious
        // e.preventDefault(); 
        touchStartX = e.touches[0].clientX; 
        if(mobileCarouselTrackEl) mobileCarouselTrackEl.style.transition = 'none'; // No animation during drag
    };
    heroGifsContainer.ontouchend = (e) => {
      if (gifWrappers.length <= 1) return; // No swipe if only one item
      let touchEndX = e.changedTouches[0].clientX;
      const swipeThreshold = 50; 
      if (touchStartX - touchEndX > swipeThreshold) { 
        currentIndex = Math.min(currentIndex + 1, gifWrappers.length - 1);
      } else if (touchEndX - touchStartX > swipeThreshold) { 
        currentIndex = Math.max(currentIndex - 1, 0);
      }
      updateMobileView(currentIndex, true); // Animate to new position
    };
     heroGifsContainer.ontouchmove = (e) => {
        // Optional: live dragging, more complex. For now, just end.
        // e.preventDefault(); // Can prevent page scrolling
    };
  }

  function updateMobileView(index, animate = true) {
    if (!mobileCarouselTrackEl || gifWrappers.length === 0) return; // Check gifWrappers.length
    
    // Corrected translation calculation:
    const itemWidthAsPercentageOfTrack = 100 / gifWrappers.length;
    const translatePercentage = -index * itemWidthAsPercentageOfTrack;
    
    mobileCarouselTrackEl.style.transition = animate ? 'transform 0.5s ease-in-out' : 'none';
    mobileCarouselTrackEl.style.transform = `translateX(${translatePercentage}%)`;
    
    gifWrappers.forEach(removePlaybackControls); // Remove from all
    if (gifWrappers[index]) { // Add to current
      addPlaybackControls(gifWrappers[index]);
    }

    if (dotsContainerEl) {
      Array.from(dotsContainerEl.children).forEach((dot, i) => {
        dot.classList.toggle('active', i === index);
      });
    }
  }

  function createMobileDots() {
    if (dotsContainerEl && dotsContainerEl.parentNode) { // Clear if exists
        dotsContainerEl.parentNode.removeChild(dotsContainerEl);
    }
    dotsContainerEl = document.createElement('div');
    dotsContainerEl.className = 'carousel-indicators';

    if (gifWrappers.length <= 1) return; // No dots for 1 or 0 items

    gifWrappers.forEach((_, i) => {
      const dot = document.createElement('button');
      dot.className = 'dot';
      dot.type = 'button';
      dot.setAttribute('aria-label', `Go to GIF ${i + 1}`);
      dot.addEventListener('click', (e) => {
        e.stopPropagation(); // Prevent heroGifsContainer touch events if dots are inside
        currentIndex = i;
        updateMobileView(i, true);
      });
      dotsContainerEl.appendChild(dot);
    });
    
    // const heroSection = heroGifsContainer.closest('.hero'); // OLD LOGIC
    // if (heroSection) {
    //     heroSection.insertBefore(dotsContainerEl, heroGifsContainer); // OLD PLACEMENT
    // } else {
    //     heroGifsContainer.parentNode.insertBefore(dotsContainerEl, heroGifsContainer); // OLD FALLBACK
    // }

    // NEW PLACEMENT: Insert dotsContainerEl after heroGifsContainer within the same parent
    if (heroGifsContainer.parentNode) {
      heroGifsContainer.parentNode.insertBefore(dotsContainerEl, heroGifsContainer.nextSibling);
    }
  }
  
  let resizeTimeout;
  function handleResize() {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(() => {
        const newIsMobile = window.innerWidth <= 767;
        if (newIsMobile !== isMobile || !gifWrappers.length) { 
            isMobile = newIsMobile;
            clearAllIntervalsAndControls(); 
            wrapGifImages(); // Re-wrap/re-query wrappers
            if(gifWrappers.length === 0) return; // Nothing to do if no wrappers

            // Explicitly clear potentially conflicting inline styles on all wrappers before setup
            gifWrappers.forEach(wrapper => {
              clearWrapperInlineStyles(wrapper);
            });

            if (isMobile) {
                setupMobileCarousel();
            } else {
                setupDesktopCarousel();
            }
        } else if (isMobile) { // Still mobile, but resized
            if(mobileCarouselTrackEl && gifWrappers.length > 0) {
                 mobileCarouselTrackEl.style.transition = 'none'; // No animation during resize adjustment
                 mobileCarouselTrackEl.style.width = `${gifWrappers.length * 100}%`;
                 gifWrappers.forEach(wrapper => {
                    // Only set width, let CSS handle aspect ratio
                    wrapper.style.width = `${100 / gifWrappers.length}%`;
                    // Explicitly ensure others are not re-set here if not needed
                    wrapper.style.height = ''; 
                    wrapper.style.paddingTop = '';
                 });
                 updateMobileView(currentIndex, false); 
            }
        }
    }, 250);
  }

  // Initial Setup
  wrapGifImages(); 
  if (gifWrappers.length > 0) { // Only setup if there are items
    gifWrappers.forEach(wrapper => clearWrapperInlineStyles(wrapper)); // Initial clear
    isMobile = window.innerWidth <= 767;
    if (isMobile) {
      setupMobileCarousel();
    } else {
      setupDesktopCarousel();
    }
  }
  window.addEventListener('resize', handleResize);
});