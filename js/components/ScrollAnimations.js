// Scroll-triggered animations using Intersection Observer
class ScrollAnimations {
  constructor() {
    this.observer = null;
    this.init();
  }

  init() {
    // Create intersection observer
    const options = {
      root: null,
      rootMargin: '0px 0px -50px 0px',
      threshold: 0.1
    };

    this.observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          this.animateElement(entry.target);
        }
      });
    }, options);

    // Observe all elements with reveal class
    this.observeElements();
    
    // Add scroll progress indicator
    this.initScrollProgress();
  }

  observeElements() {
    const elements = document.querySelectorAll('.reveal, [data-animate]');
    elements.forEach(el => {
      this.observer.observe(el);
    });
  }

  animateElement(element) {
    // Add active class to trigger CSS animations
    element.classList.add('active');
    
    // Apply specific animations based on data attributes
    const animationType = element.dataset.animate;
    
    switch (animationType) {
      case 'fade-up':
        this.fadeUp(element);
        break;
      case 'fade-in':
        this.fadeIn(element);
        break;
      case 'scale':
        this.scale(element);
        break;
      case 'slide-left':
        this.slideLeft(element);
        break;
      case 'slide-right':
        this.slideRight(element);
        break;
      default:
        this.defaultAnimation(element);
    }

    // Stop observing this element
    this.observer.unobserve(element);
  }

  fadeUp(element) {
    element.style.animation = 'fadeInUp 0.8s ease-out forwards';
  }

  fadeIn(element) {
    element.style.animation = 'fadeIn 0.6s ease-out forwards';
  }

  scale(element) {
    element.style.animation = 'fadeInScale 0.6s ease-out forwards';
  }

  slideLeft(element) {
    element.style.animation = 'slideInLeft 0.8s ease-out forwards';
  }

  slideRight(element) {
    element.style.animation = 'slideInRight 0.8s ease-out forwards';
  }

  defaultAnimation(element) {
    element.style.animation = 'fadeInUp 0.8s ease-out forwards';
  }

  initScrollProgress() {
    // Create scroll progress bar
    const progressBar = document.createElement('div');
    progressBar.className = 'scroll-progress';
    progressBar.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      width: 0%;
      height: 2px;
      background: linear-gradient(90deg, #667eea, #764ba2);
      z-index: 9999;
      transition: width 0.1s ease-out;
    `;
    document.body.appendChild(progressBar);

    // Update progress on scroll
    let ticking = false;
    
    const updateProgress = () => {
      const scrollTop = window.pageYOffset;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const scrollPercent = (scrollTop / docHeight) * 100;
      
      progressBar.style.width = `${Math.min(scrollPercent, 100)}%`;
      ticking = false;
    };

    window.addEventListener('scroll', () => {
      if (!ticking) {
        requestAnimationFrame(updateProgress);
        ticking = true;
      }
    });
  }

  // Add new elements to observer (useful for dynamic content)
  addElement(element) {
    if (this.observer) {
      this.observer.observe(element);
    }
  }

  // Remove element from observer
  removeElement(element) {
    if (this.observer) {
      this.observer.unobserve(element);
    }
  }

  // Cleanup
  destroy() {
    if (this.observer) {
      this.observer.disconnect();
    }
    
    // Remove scroll progress bar
    const progressBar = document.querySelector('.scroll-progress');
    if (progressBar) {
      progressBar.remove();
    }
  }
}

// Add additional keyframes for animations
const additionalAnimations = `
  @keyframes fadeIn {
    from {
      opacity: 0;
    }
    to {
      opacity: 1;
    }
  }

  @keyframes slideInLeft {
    from {
      opacity: 0;
      transform: translateX(-50px);
    }
    to {
      opacity: 1;
      transform: translateX(0);
    }
  }

  @keyframes slideInRight {
    from {
      opacity: 0;
      transform: translateX(50px);
    }
    to {
      opacity: 1;
      transform: translateX(0);
    }
  }
`;

// Inject additional animations into the page
const style = document.createElement('style');
style.textContent = additionalAnimations;
document.head.appendChild(style);

export default ScrollAnimations;