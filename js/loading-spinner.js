class LoadingSpinner {
  constructor() {
    // Create spinner HTML structure
    this.spinnerContainer = document.createElement('div');
    this.spinnerContainer.id = 'loading-spinner-container';
    this.spinnerContainer.style.cssText = `
      display: none;
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background-color: rgba(255,255,255,0.7);
      z-index: 9999;
      backdrop-filter: blur(2px);
    `;
    
    this.spinnerContainer.innerHTML = `
      <div class="loadingio-spinner-spin-2by998twmg8" style="position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%);">
        <div class="ldio-yzaezf3dcmj">
          <div><div></div></div><div><div></div></div>
          <div><div></div></div><div><div></div></div>
          <div><div></div></div><div><div></div></div>
          <div><div></div></div><div><div></div></div>
        </div>
      </div>
    `;
    
    document.body.prepend(this.spinnerContainer);
  }

  show() {
    this.spinnerContainer.style.display = 'block';
  }

  hide() {
    this.spinnerContainer.style.display = 'none';
  }
}

// Initialize spinner immediately when this script loads
const spinner = new LoadingSpinner();

// Export for other scripts to use
window.spinner = spinner;

// Script loading functionality
function loadScript(src) {
  return new Promise((resolve, reject) => {
    const script = document.createElement('script');
    script.src = src;
    script.onload = resolve;
    script.onerror = reject;
    document.body.appendChild(script);
  });
}

// Load dependencies in order
async function initializeApp() {
  try {
    spinner.show(); // Show spinner before loading

    // Load scripts in order
    await loadScript('db/firebase-server.js');
    await loadScript('js/login-script.js');

    console.log('All scripts loaded successfully');
  } catch (error) {
    console.error('Script loading error:', error);
  } finally {
    spinner.hide(); // Hide spinner regardless of success/failure
  }
}

// Start loading process when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initializeApp);
} else {
  initializeApp();
}