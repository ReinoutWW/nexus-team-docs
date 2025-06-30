// Smooth scrolling functionality
class SmoothScroll {
  constructor() {
    this.init();
  }

  init() {
    // Handle smooth scroll for anchor links
    this.handleAnchorLinks();
    
    // Handle custom scroll buttons
    this.handleScrollButtons();
    
    // Add scroll to top button
    this.addScrollToTop();
  }

  handleAnchorLinks() {
    // Get all anchor links
    const anchorLinks = document.querySelectorAll('a[href^="#"]');
    
    anchorLinks.forEach(link => {
      link.addEventListener('click', (e) => {
        e.preventDefault();
        
        const targetId = link.getAttribute('href').substring(1);
        const targetElement = document.getElementById(targetId);
        
        if (targetElement) {
          this.scrollToElement(targetElement);
        }
      });
    });
  }

  handleScrollButtons() {
    // Handle buttons with data-scroll-to attribute
    const scrollButtons = document.querySelectorAll('[data-scroll-to]');
    
    scrollButtons.forEach(button => {
      button.addEventListener('click', (e) => {
        e.preventDefault();
        
        const targetId = button.getAttribute('data-scroll-to');
        const targetElement = document.getElementById(targetId);
        
        if (targetElement) {
          this.scrollToElement(targetElement);
        }
      });
    });
  }

  scrollToElement(element, offset = 80) {
    const elementPosition = element.offsetTop - offset;
    
    window.scrollTo({
      top: elementPosition,
      behavior: 'smooth'
    });
  }

  scrollToTop() {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  }

  addScrollToTop() {
    // Create scroll to top button
    const scrollTopBtn = document.createElement('button');
    scrollTopBtn.className = 'scroll-to-top';
    scrollTopBtn.innerHTML = '↑';
    scrollTopBtn.setAttribute('aria-label', 'Scroll to top');
    
    // Style the button
    scrollTopBtn.style.cssText = `
      position: fixed;
      bottom: 30px;
      right: 30px;
      width: 50px;
      height: 50px;
      border-radius: 50%;
      background: var(--glass-bg-primary);
      backdrop-filter: var(--glass-blur);
      -webkit-backdrop-filter: var(--glass-blur);
      border: 1px solid var(--glass-border);
      color: var(--text-primary);
      font-size: 18px;
      font-weight: bold;
      cursor: pointer;
      z-index: 1000;
      opacity: 0;
      visibility: hidden;
      transform: scale(0.8);
      transition: all 0.3s ease;
      box-shadow: var(--shadow-lg);
    `;

    // Add hover effects
    scrollTopBtn.addEventListener('mouseenter', () => {
      scrollTopBtn.style.transform = 'scale(1.1)';
      scrollTopBtn.style.background = 'var(--glass-bg-secondary)';
      scrollTopBtn.style.boxShadow = 'var(--shadow-xl)';
    });

    scrollTopBtn.addEventListener('mouseleave', () => {
      scrollTopBtn.style.transform = 'scale(1)';
      scrollTopBtn.style.background = 'var(--glass-bg-primary)';
      scrollTopBtn.style.boxShadow = 'var(--shadow-lg)';
    });

    // Add click handler
    scrollTopBtn.addEventListener('click', () => {
      this.scrollToTop();
    });

    // Show/hide button based on scroll position
    let isVisible = false;
    
    const toggleVisibility = () => {
      const scrollY = window.pageYOffset;
      const shouldShow = scrollY > 300;
      
      if (shouldShow && !isVisible) {
        scrollTopBtn.style.opacity = '1';
        scrollTopBtn.style.visibility = 'visible';
        scrollTopBtn.style.transform = 'scale(1)';
        isVisible = true;
      } else if (!shouldShow && isVisible) {
        scrollTopBtn.style.opacity = '0';
        scrollTopBtn.style.visibility = 'hidden';
        scrollTopBtn.style.transform = 'scale(0.8)';
        isVisible = false;
      }
    };

    // Throttle scroll events for performance
    let ticking = false;
    
    window.addEventListener('scroll', () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          toggleVisibility();
          ticking = false;
        });
        ticking = true;
      }
    });

    // Add button to page
    document.body.appendChild(scrollTopBtn);
  }

  // Utility method to scroll to a specific position
  scrollTo(position, duration = 1000) {
    const start = window.pageYOffset;
    const distance = position - start;
    const startTime = performance.now();

    const easeInOutCubic = (t) => {
      return t < 0.5 ? 4 * t * t * t : (t - 1) * (2 * t - 2) * (2 * t - 2) + 1;
    };

    const animateScroll = (currentTime) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const easeProgress = easeInOutCubic(progress);
      
      window.scrollTo(0, start + distance * easeProgress);
      
      if (progress < 1) {
        requestAnimationFrame(animateScroll);
      }
    };

    requestAnimationFrame(animateScroll);
  }

  // Cleanup
  destroy() {
    const scrollTopBtn = document.querySelector('.scroll-to-top');
    if (scrollTopBtn) {
      scrollTopBtn.remove();
    }
  }
}

export default SmoothScroll;