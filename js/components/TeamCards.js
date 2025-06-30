// Team card interactions and animations
class TeamCards {
  constructor() {
    this.cards = [];
    this.init();
  }

  init() {
    // Find all team cards
    const cardElements = document.querySelectorAll('[data-component="team-card"]');
    
    cardElements.forEach((element, index) => {
      const card = new TeamCard(element, index);
      this.cards.push(card);
    });
  }

  // Get specific card by index
  getCard(index) {
    return this.cards[index];
  }

  // Cleanup
  destroy() {
    this.cards.forEach(card => card.destroy());
    this.cards = [];
  }
}

// Individual team card class
class TeamCard {
  constructor(element, index) {
    this.element = element;
    this.index = index;
    this.overlay = element.querySelector('.team-card__overlay');
    this.isHovered = false;
    this.animationId = null;
    
    this.init();
  }

  init() {
    this.bindEvents();
    this.addMouseTracker();
    this.addEntryAnimation();
  }

  bindEvents() {
    // Mouse events
    this.element.addEventListener('mouseenter', this.handleMouseEnter.bind(this));
    this.element.addEventListener('mouseleave', this.handleMouseLeave.bind(this));
    this.element.addEventListener('mousemove', this.handleMouseMove.bind(this));
    
    // Touch events for mobile
    this.element.addEventListener('touchstart', this.handleTouchStart.bind(this));
    this.element.addEventListener('touchend', this.handleTouchEnd.bind(this));
    
    // Click events
    this.element.addEventListener('click', this.handleClick.bind(this));
  }

  handleMouseEnter(e) {
    this.isHovered = true;
    this.element.style.zIndex = '10';
    
    // Add glow effect
    this.element.style.boxShadow = `
      var(--shadow-xl),
      0 20px 40px rgba(0, 0, 0, 0.15),
      0 0 30px rgba(102, 126, 234, 0.2)
    `;

    // Animate skills tags
    this.animateSkillTags();
  }

  handleMouseLeave(e) {
    this.isHovered = false;
    this.element.style.zIndex = '';
    this.element.style.boxShadow = '';
    
    // Reset skill tags
    this.resetSkillTags();
  }

  handleMouseMove(e) {
    if (!this.isHovered) return;
    
    const rect = this.element.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    
    const rotateX = (y - centerY) / 20;
    const rotateY = (centerX - x) / 20;
    
    this.element.style.transform = `
      translateY(-8px) 
      scale(1.02) 
      rotateX(${rotateX}deg) 
      rotateY(${rotateY}deg)
    `;
  }

  handleTouchStart(e) {
    // Simulate mouse enter for touch devices
    this.handleMouseEnter(e);
  }

  handleTouchEnd(e) {
    // Simulate mouse leave for touch devices
    setTimeout(() => {
      this.handleMouseLeave(e);
    }, 2000); // Keep effect for 2 seconds on touch
  }

  handleClick(e) {
    // Add ripple effect
    this.createRipple(e);
    
    // Optionally trigger modal or detailed view
    // this.showDetailedView();
  }

  addMouseTracker() {
    // Create a subtle light following the mouse
    const lightTracker = document.createElement('div');
    lightTracker.className = 'card-light-tracker';
    lightTracker.style.cssText = `
      position: absolute;
      width: 100px;
      height: 100px;
      background: radial-gradient(circle, rgba(79, 172, 254, 0.1) 0%, transparent 70%);
      border-radius: 50%;
      pointer-events: none;
      opacity: 0;
      transition: opacity 0.3s ease;
      z-index: 1;
    `;
    
    this.element.appendChild(lightTracker);
    this.lightTracker = lightTracker;

    this.element.addEventListener('mousemove', (e) => {
      if (!this.isHovered) return;
      
      const rect = this.element.getBoundingClientRect();
      const x = e.clientX - rect.left - 50;
      const y = e.clientY - rect.top - 50;
      
      lightTracker.style.left = `${x}px`;
      lightTracker.style.top = `${y}px`;
      lightTracker.style.opacity = '1';
    });

    this.element.addEventListener('mouseleave', () => {
      lightTracker.style.opacity = '0';
    });
  }

  addEntryAnimation() {
    // Stagger the entry animation based on card index
    const delay = this.index * 200;
    
    this.element.style.opacity = '0';
    this.element.style.transform = 'translateY(50px) scale(0.9)';
    
    setTimeout(() => {
      this.element.style.transition = 'all 0.8s cubic-bezier(0.25, 1, 0.5, 1)';
      this.element.style.opacity = '1';
      this.element.style.transform = 'translateY(0) scale(1)';
    }, delay);
  }

  animateSkillTags() {
    const skillTags = this.element.querySelectorAll('.skill-tag');
    
    skillTags.forEach((tag, index) => {
      setTimeout(() => {
        tag.style.transform = 'scale(1.1) translateY(-2px)';
        tag.style.boxShadow = '0 4px 12px rgba(79, 172, 254, 0.3)';
      }, index * 100);
    });
  }

  resetSkillTags() {
    const skillTags = this.element.querySelectorAll('.skill-tag');
    
    skillTags.forEach(tag => {
      tag.style.transform = '';
      tag.style.boxShadow = '';
    });
  }

  createRipple(e) {
    const rect = this.element.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    const ripple = document.createElement('div');
    ripple.className = 'card-ripple';
    ripple.style.cssText = `
      position: absolute;
      left: ${x}px;
      top: ${y}px;
      width: 0;
      height: 0;
      border-radius: 50%;
      background: rgba(79, 172, 254, 0.3);
      transform: translate(-50%, -50%);
      animation: ripple 0.6s ease-out;
      pointer-events: none;
      z-index: 2;
    `;
    
    this.element.appendChild(ripple);
    
    // Remove ripple after animation
    setTimeout(() => {
      ripple.remove();
    }, 600);
  }

  showDetailedView() {
    // Could implement a modal or expanded view here
    console.log(`Showing detailed view for card ${this.index}`);
  }

  // Cleanup
  destroy() {
    if (this.lightTracker) {
      this.lightTracker.remove();
    }
    
    // Remove event listeners
    this.element.removeEventListener('mouseenter', this.handleMouseEnter);
    this.element.removeEventListener('mouseleave', this.handleMouseLeave);
    this.element.removeEventListener('mousemove', this.handleMouseMove);
    this.element.removeEventListener('touchstart', this.handleTouchStart);
    this.element.removeEventListener('touchend', this.handleTouchEnd);
    this.element.removeEventListener('click', this.handleClick);
  }
}

// Add ripple animation keyframes
const rippleAnimation = `
  @keyframes ripple {
    0% {
      width: 0;
      height: 0;
      opacity: 0.5;
    }
    100% {
      width: 300px;
      height: 300px;
      opacity: 0;
    }
  }
`;

const style = document.createElement('style');
style.textContent = rippleAnimation;
document.head.appendChild(style);

export default TeamCards;