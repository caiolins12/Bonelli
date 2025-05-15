// Script to ensure page only displays after all GIFs are loaded
document.addEventListener('DOMContentLoaded', function() {
  // Create loading overlay
  const loadingOverlay = document.createElement('div');
  loadingOverlay.className = 'loading-overlay';
  loadingOverlay.innerHTML = `
    <div class="loading-spinner"></div>
    <div class="loading-text">Carregando...</div>
  `;
  document.body.appendChild(loadingOverlay);
  
  // Hide the main content until everything is loaded
  document.body.style.overflow = 'hidden';
  const mainContent = document.querySelector('main');
  if (mainContent) {
    mainContent.style.visibility = 'hidden';
  }
  
  // Get all GIF images from the page
  const gifImages = Array.from(document.querySelectorAll('img[src$=".gif"]'));
  let loadedGifs = 0;
  
  // If there are no GIFs, show the page immediately
  if (gifImages.length === 0) {
    hideLoadingScreen();
    return;
  }
  
  // Add load event listener to each GIF
  gifImages.forEach(img => {
    // Remove lazy loading attribute to force loading
    img.removeAttribute('loading');
    
    // Check if already loaded
    if (img.complete) {
      gifLoaded();
    } else {
      img.addEventListener('load', gifLoaded);
      img.addEventListener('error', gifLoaded); // Count errors as loaded to prevent hanging
    }
    
    // Force reload to ensure complete loading
    if (img.src) {
      const currentSrc = img.src;
      img.src = '';
      img.src = currentSrc;
    }
  });
  
  // Function to track GIF loading progress
  function gifLoaded() {
    loadedGifs++;
    
    // Update loading percentage if desired
    const percentage = Math.round((loadedGifs / gifImages.length) * 100);
    const loadingText = document.querySelector('.loading-text');
    if (loadingText) {
      loadingText.textContent = `Carregando... ${percentage}%`;
    }
    
    // When all GIFs are loaded, show the page
    if (loadedGifs >= gifImages.length) {
      hideLoadingScreen();
    }
  }
  
  // Function to hide loading screen and show content
  function hideLoadingScreen() {
    // Short delay to ensure smooth transition
    setTimeout(() => {
      // Show main content
      if (mainContent) {
        mainContent.style.visibility = 'visible';
      }
      
      // Fade out loading overlay
      loadingOverlay.classList.add('fade-out');
      
      // Remove overlay after animation completes
      setTimeout(() => {
        document.body.style.overflow = '';
        loadingOverlay.remove();
      }, 500);
    }, 200);
  }
  
  // Add safety timeout to prevent infinite loading
  setTimeout(hideLoadingScreen, 10000); // 10 second max loading time
}); 