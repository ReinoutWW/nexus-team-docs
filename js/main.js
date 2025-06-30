// Main JavaScript Entry Point
import ScrollAnimations from './components/ScrollAnimations.js';
import SmoothScroll from './components/SmoothScroll.js';
import TeamCards from './components/TeamCards.js';
import Navigation from './components/Navigation.js';

class App {
  constructor() {
    this.components = new Map();
    this.init();
  }

  init() {
    // Wait for DOM to be ready
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', () => this.initializeComponents());
    } else {
      this.initializeComponents();
    }
  }

  initializeComponents() {
    // Initialize scroll animations
    this.components.set('scrollAnimations', new ScrollAnimations());
    
    // Initialize smooth scroll
    this.components.set('smoothScroll', new SmoothScroll());
    
    // Initialize team cards
    this.components.set('teamCards', new TeamCards());
    
    // Initialize navigation
    this.components.set('navigation', new Navigation());

    // Add reveal class to elements that should animate on scroll
    this.setupRevealElements();
    
    // Initialize page-specific functionality
    this.initPageSpecific();
  }

  setupRevealElements() {
    const revealElements = document.querySelectorAll('.team-card, .project-card, .hero__content > *');
    revealElements.forEach((el, index) => {
      el.classList.add('reveal');
      el.style.animationDelay = `${index * 0.1}s`;
    });
  }

  initPageSpecific() {
    // Add any page-specific initialization here
    const currentPage = this.getCurrentPage();
    
    switch (currentPage) {
      case 'home':
        this.initHomePage();
        break;
      case 'blog':
        this.initBlogPage();
        break;
      case 'workflows':
        this.initWorkflowsPage();
        break;
      case 'roadmap':
        this.initRoadmapPage();
        break;
    }
  }

  getCurrentPage() {
    const path = window.location.pathname;
    if (path.includes('blog')) return 'blog';
    if (path.includes('workflows')) return 'workflows';
    if (path.includes('roadmap')) return 'roadmap';
    return 'home';
  }

  initHomePage() {
    // Add floating particles background
    this.createFloatingParticles();
    
    // Add typing effect to hero subtitle
    this.addTypingEffect();
  }

  initBlogPage() {
    // Blog-specific initialization
    console.log('Blog page initialized');
  }

  initWorkflowsPage() {
    // Workflows-specific initialization
    console.log('Workflows page initialized');
  }

  initRoadmapPage() {
    // Roadmap-specific initialization
    console.log('Roadmap page initialized');
  }

  createFloatingParticles() {
    const hero = document.querySelector('.hero');
    if (!hero) return;

    const particlesContainer = document.createElement('div');
    particlesContainer.className = 'floating-particles';
    particlesContainer.style.cssText = `
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      pointer-events: none;
      overflow: hidden;
    `;

    // Create floating particles
    for (let i = 0; i < 20; i++) {
      const particle = document.createElement('div');
      particle.className = 'particle';
      particle.style.cssText = `
        position: absolute;
        width: ${Math.random() * 4 + 2}px;
        height: ${Math.random() * 4 + 2}px;
        background: rgba(79, 172, 254, ${Math.random() * 0.5 + 0.2});
        border-radius: 50%;
        animation: float ${Math.random() * 20 + 10}s infinite linear;
        left: ${Math.random() * 100}%;
        top: ${Math.random() * 100}%;
      `;
      particlesContainer.appendChild(particle);
    }

    // Add floating animation
    const style = document.createElement('style');
    style.textContent = `
      @keyframes float {
        0% {
          transform: translateY(100vh) rotate(0deg);
          opacity: 0;
        }
        10% {
          opacity: 1;
        }
        90% {
          opacity: 1;
        }
        100% {
          transform: translateY(-100vh) rotate(360deg);
          opacity: 0;
        }
      }
    `;
    document.head.appendChild(style);

    hero.appendChild(particlesContainer);
  }

  addTypingEffect() {
    const subtitle = document.querySelector('.hero__subtitle');
    if (!subtitle) return;

    const text = subtitle.textContent;
    subtitle.textContent = '';
    subtitle.style.opacity = '1';

    let index = 0;
    const typeWriter = () => {
      if (index < text.length) {
        subtitle.textContent += text.charAt(index);
        index++;
        setTimeout(typeWriter, 50);
      }
    };

    // Start typing effect after hero title animation
    setTimeout(typeWriter, 1000);
  }

  // Utility method to get component instance
  getComponent(name) {
    return this.components.get(name);
  }

  // Cleanup method
  destroy() {
    this.components.forEach(component => {
      if (component.destroy) {
        component.destroy();
      }
    });
    this.components.clear();
  }
}

// Initialize the application
const app = new App();

// Make app globally available for debugging
window.app = app;

// Handle page navigation
window.addEventListener('beforeunload', () => {
  app.destroy();
});

export default App;