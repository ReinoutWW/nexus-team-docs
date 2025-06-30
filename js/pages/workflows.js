// Workflows page functionality
class WorkflowsPage {
  constructor() {
    this.currentWorkflow = 'development';
    this.workflowButtons = [];
    this.workflowSections = [];
    this.animationObserver = null;
    
    this.init();
  }

  init() {
    this.workflowButtons = document.querySelectorAll('[data-workflow]');
    this.workflowSections = document.querySelectorAll('[data-workflow-content]');
    
    this.setupWorkflowNavigation();
    this.setupAnimations();
    this.addInteractiveElements();
    this.initFromURL();
  }

  setupWorkflowNavigation() {
    this.workflowButtons.forEach(button => {
      button.addEventListener('click', (e) => {
        e.preventDefault();
        
        const workflow = button.getAttribute('data-workflow');
        this.switchWorkflow(workflow);
        this.updateActiveButton(button);
      });
    });
  }

  switchWorkflow(workflow) {
    // Hide current workflow with animation
    const currentSection = document.querySelector('.workflow-section.active');
    if (currentSection) {
      currentSection.style.opacity = '0';
      currentSection.style.transform = 'translateY(20px)';
      
      setTimeout(() => {
        currentSection.classList.remove('active');
        this.showWorkflow(workflow);
      }, 300);
    } else {
      this.showWorkflow(workflow);
    }

    this.currentWorkflow = workflow;
    this.updateURL(workflow);
  }

  showWorkflow(workflow) {
    const targetSection = document.querySelector(`[data-workflow-content="${workflow}"]`);
    if (targetSection) {
      targetSection.classList.add('active');
      
      // Trigger entrance animation
      setTimeout(() => {
        targetSection.style.opacity = '1';
        targetSection.style.transform = 'translateY(0)';
      }, 50);

      // Restart animations for elements in this section
      this.restartAnimations(targetSection);
    }
  }

  updateActiveButton(activeButton) {
    this.workflowButtons.forEach(button => {
      button.classList.remove('nav-pill--active');
    });
    activeButton.classList.add('nav-pill--active');
  }

  setupAnimations() {
    // Create intersection observer for scroll animations
    const options = {
      root: null,
      rootMargin: '0px 0px -20% 0px',
      threshold: 0.1
    };

    this.animationObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          this.animateElement(entry.target);
        }
      });
    }, options);

    // Observe all animated elements
    this.observeAnimatedElements();
  }

  observeAnimatedElements() {
    const animatedElements = document.querySelectorAll('[data-animate]');
    animatedElements.forEach(el => {
      this.animationObserver.observe(el);
    });
  }

  animateElement(element) {
    const animationType = element.getAttribute('data-animate');
    
    element.classList.add('animate-in');
    
    switch (animationType) {
      case 'slide-right':
        element.style.animation = 'slideInLeft 0.8s ease-out forwards';
        break;
      case 'slide-left':
        element.style.animation = 'slideInRight 0.8s ease-out forwards';
        break;
      case 'fade-up':
        element.style.animation = 'fadeInUp 0.8s ease-out forwards';
        break;
      case 'scale':
        element.style.animation = 'fadeInScale 0.6s ease-out forwards';
        break;
      default:
        element.style.animation = 'fadeInUp 0.8s ease-out forwards';
    }

    // Stop observing this element
    this.animationObserver.unobserve(element);
  }

  restartAnimations(section) {
    const animatedElements = section.querySelectorAll('[data-animate]');
    animatedElements.forEach((el, index) => {
      // Reset animation
      el.classList.remove('animate-in');
      el.style.animation = 'none';
      
      // Restart animation with delay
      setTimeout(() => {
        this.animateElement(el);
      }, index * 100);
    });
  }

  addInteractiveElements() {
    this.addTimelineInteractions();
    this.addCollabCardInteractions();
    this.addDeploymentStageInteractions();
    this.addQualityItemInteractions();
  }

  addTimelineInteractions() {
    const timelineItems = document.querySelectorAll('.timeline-item');
    
    timelineItems.forEach((item, index) => {
      // Add hover effects for timeline markers
      const marker = item.querySelector('.timeline-marker');
      const content = item.querySelector('.timeline-content');
      
      item.addEventListener('mouseenter', () => {
        marker.style.transform = 'scale(1.1)';
        marker.style.boxShadow = 'var(--shadow-xl), 0 0 30px rgba(102, 126, 234, 0.4)';
        
        // Highlight tool tags
        const toolTags = content.querySelectorAll('.tool-tag');
        toolTags.forEach((tag, tagIndex) => {
          setTimeout(() => {
            tag.style.transform = 'scale(1.05)';
            tag.style.background = 'var(--accent-gradient)';
            tag.style.color = 'var(--text-primary)';
          }, tagIndex * 50);
        });
      });

      item.addEventListener('mouseleave', () => {
        marker.style.transform = '';
        marker.style.boxShadow = '';
        
        const toolTags = content.querySelectorAll('.tool-tag');
        toolTags.forEach(tag => {
          tag.style.transform = '';
          tag.style.background = '';
          tag.style.color = '';
        });
      });

      // Add click interaction for detailed view
      content.addEventListener('click', () => {
        this.showTimelineDetail(index);
      });
    });
  }

  addCollabCardInteractions() {
    const collabCards = document.querySelectorAll('.collab-card');
    
    collabCards.forEach(card => {
      card.addEventListener('click', () => {
        // Add ripple effect
        this.createRipple(card, event);
        
        // Pulse animation
        card.style.transform = 'scale(0.98)';
        setTimeout(() => {
          card.style.transform = '';
        }, 150);
      });

      // Add floating animation on hover
      card.addEventListener('mouseenter', () => {
        const icon = card.querySelector('.collab-icon');
        icon.style.animation = 'float 2s ease-in-out infinite';
      });

      card.addEventListener('mouseleave', () => {
        const icon = card.querySelector('.collab-icon');
        icon.style.animation = '';
      });
    });
  }

  addDeploymentStageInteractions() {
    const stages = document.querySelectorAll('.deployment-stage');
    
    stages.forEach((stage, index) => {
      stage.addEventListener('click', () => {
        this.highlightDeploymentFlow(index);
      });

      // Add progress indicator
      const progressBar = document.createElement('div');
      progressBar.className = 'stage-progress';
      progressBar.style.cssText = `
        position: absolute;
        bottom: 0;
        left: 0;
        height: 3px;
        background: var(--accent-gradient);
        width: 0%;
        transition: width 2s ease-out;
        border-radius: 0 0 var(--radius-xl) var(--radius-xl);
      `;
      stage.appendChild(progressBar);

      // Animate progress on hover
      stage.addEventListener('mouseenter', () => {
        progressBar.style.width = '100%';
      });

      stage.addEventListener('mouseleave', () => {
        progressBar.style.width = '0%';
      });
    });
  }

  addQualityItemInteractions() {
    const qualityItems = document.querySelectorAll('.quality-item');
    
    qualityItems.forEach(item => {
      item.addEventListener('click', () => {
        const check = item.querySelector('.quality-check');
        
        // Animate checkmark
        check.style.transform = 'scale(1.5)';
        check.style.color = 'var(--text-accent)';
        
        setTimeout(() => {
          check.style.transform = '';
          check.style.color = '';
        }, 300);
      });
    });
  }

  highlightDeploymentFlow(clickedIndex) {
    const stages = document.querySelectorAll('.deployment-stage');
    const arrows = document.querySelectorAll('.deployment-arrow');
    
    // Reset all stages
    stages.forEach(stage => {
      stage.style.background = 'var(--glass-bg-primary)';
      stage.style.borderColor = 'var(--glass-border)';
    });

    // Highlight stages up to clicked one
    for (let i = 0; i <= clickedIndex; i++) {
      setTimeout(() => {
        stages[i].style.background = 'var(--glass-bg-secondary)';
        stages[i].style.borderColor = 'var(--text-accent)';
        stages[i].style.boxShadow = '0 0 20px rgba(79, 172, 254, 0.3)';
        
        if (i < arrows.length) {
          arrows[i].style.color = 'var(--text-accent)';
          arrows[i].style.transform = 'scale(1.2)';
        }
      }, i * 200);
    }

    // Reset after 3 seconds
    setTimeout(() => {
      stages.forEach(stage => {
        stage.style.background = '';
        stage.style.borderColor = '';
        stage.style.boxShadow = '';
      });
      
      arrows.forEach(arrow => {
        arrow.style.color = '';
        arrow.style.transform = '';
      });
    }, 3000);
  }

  showTimelineDetail(index) {
    const timelineItems = document.querySelectorAll('.timeline-item');
    const item = timelineItems[index];
    const content = item.querySelector('.timeline-content');
    
    // Create detailed view modal (simplified for this example)
    console.log(`Showing details for timeline item ${index + 1}`);
    
    // Add visual feedback
    content.style.transform = 'scale(1.05)';
    content.style.zIndex = '10';
    
    setTimeout(() => {
      content.style.transform = '';
      content.style.zIndex = '';
    }, 300);
  }

  createRipple(element, event) {
    const rect = element.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    
    const ripple = document.createElement('div');
    ripple.className = 'workflow-ripple';
    ripple.style.cssText = `
      position: absolute;
      left: ${x}px;
      top: ${y}px;
      width: 0;
      height: 0;
      border-radius: 50%;
      background: rgba(79, 172, 254, 0.2);
      transform: translate(-50%, -50%);
      animation: workflowRipple 0.6s ease-out;
      pointer-events: none;
      z-index: 1;
    `;
    
    element.appendChild(ripple);
    
    setTimeout(() => {
      ripple.remove();
    }, 600);
  }

  updateURL(workflow) {
    const url = new URL(window.location);
    if (workflow === 'development') {
      url.searchParams.delete('workflow');
    } else {
      url.searchParams.set('workflow', workflow);
    }
    window.history.replaceState({}, '', url);
  }

  initFromURL() {
    const urlParams = new URLSearchParams(window.location.search);
    const workflow = urlParams.get('workflow') || 'development';
    
    const workflowButton = document.querySelector(`[data-workflow="${workflow}"]`);
    if (workflowButton) {
      this.switchWorkflow(workflow);
      this.updateActiveButton(workflowButton);
    }
  }

  // Cleanup
  destroy() {
    if (this.animationObserver) {
      this.animationObserver.disconnect();
    }
  }
}

// Add additional animations and styles
const workflowAnimations = `
  @keyframes workflowRipple {
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
  
  @keyframes float {
    0%, 100% {
      transform: translateY(0);
    }
    50% {
      transform: translateY(-10px);
    }
  }
  
  .stage-progress {
    border-radius: 0 0 var(--radius-xl) var(--radius-xl);
  }
`;

const style = document.createElement('style');
style.textContent = workflowAnimations;
document.head.appendChild(style);

// Initialize workflows page
const workflowsPage = new WorkflowsPage();

// Handle browser navigation
window.addEventListener('popstate', () => {
  workflowsPage.initFromURL();
});

export default WorkflowsPage;