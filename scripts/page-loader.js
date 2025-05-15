// Script to ensure page only displays after all GIFs are loaded
document.addEventListener('DOMContentLoaded', function() {
  // Hide the main content until everything is loaded (without visible loading animation)
  document.body.style.visibility = 'hidden';
  
  // Get all GIF images from the page
  const gifImages = Array.from(document.querySelectorAll('img[src$=".gif"]'));
  let loadedGifs = 0;
  
  // If there are no GIFs, show the page immediately
  if (gifImages.length === 0) {
    showPage();
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
    
    // When all GIFs are loaded, show the page
    if (loadedGifs >= gifImages.length) {
      showPage();
    }
  }
  
  // Function to show the page content
  function showPage() {
    document.body.style.visibility = 'visible';
  }
  
  // Add safety timeout to prevent infinite loading
  setTimeout(showPage, 10000); // 10 second max loading time
}); 
}); 