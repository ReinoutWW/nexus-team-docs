// Roadmap page functionality
class RoadmapPage {
  constructor() {
    this.currentFilter = 'all';
    this.projectCards = [];
    this.filterButtons = [];
    this.timelineMarkers = [];
    this.animationObserver = null;
    
    this.init();
  }

  init() {
    this.projectCards = document.querySelectorAll('.project-card');
    this.filterButtons = document.querySelectorAll('[data-status]');
    this.timelineMarkers = document.querySelectorAll('.timeline-marker');
    
    this.setupFilters();
    this.setupProjectInteractions();
    this.setupTimelineInteractions();
    this.setupAnimations();
    this.initProgressBars();
    this.addStatCounters();
    this.initFromURL();
  }

  setupFilters() {
    this.filterButtons.forEach(button => {
      button.addEventListener('click', (e) => {
        e.preventDefault();
        
        const status = button.getAttribute('data-status');
        this.applyFilter(status);
        this.updateActiveFilter(button);
      });
    });
  }

  applyFilter(status) {
    this.currentFilter = status;
    
    this.projectCards.forEach((card, index) => {
      const cardStatus = card.getAttribute('data-status');
      const shouldShow = status === 'all' || cardStatus === status;
      
      if (shouldShow) {
        card.classList.remove('hidden');
        card.classList.add('visible');
        card.style.animationDelay = `${index * 0.1}s`;
        
        // Re-trigger entrance animation
        setTimeout(() => {
          card.style.animation = 'none';
          setTimeout(() => {
            card.style.animation = 'fadeInUp 0.6s ease-out forwards';
          }, 10);
        }, index * 50);
      } else {
        card.classList.add('hidden');
        card.classList.remove('visible');
      }
    });

    // Update URL
    this.updateURL(status);
    
    // Update stats if needed
    this.updateFilterStats(status);
  }

  updateActiveFilter(activeButton) {
    this.filterButtons.forEach(button => {
      button.classList.remove('nav-pill--active');
    });
    activeButton.classList.add('nav-pill--active');
  }

  setupProjectInteractions() {
    this.projectCards.forEach((card, index) => {
      // Add click interactions
      card.addEventListener('click', (e) => {
        this.handleProjectClick(card, e);
      });

      // Add keyboard navigation
      card.setAttribute('tabindex', '0');
      card.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          this.handleProjectClick(card, e);
        }
      });

      // Add hover effects for feature tags
      const featureTags = card.querySelectorAll('.feature-tag');
      featureTags.forEach(tag => {
        tag.addEventListener('mouseenter', () => {
          this.animateFeatureTag(tag);
        });
      });

      // Add team avatar interactions
      const avatars = card.querySelectorAll('.avatar');
      avatars.forEach(avatar => {
        avatar.addEventListener('click', (e) => {
          e.stopPropagation();
          this.showTeamMemberInfo(avatar.textContent);
        });
      });

      // Add progress bar animation on scroll
      this.setupProgressBarAnimation(card);
    });
  }

  handleProjectClick(card, event) {
    const title = card.querySelector('.project-title').textContent;
    const status = card.getAttribute('data-status');
    
    // Add click animation
    card.style.transform = 'scale(0.98)';
    setTimeout(() => {
      card.style.transform = '';
    }, 150);

    // Create ripple effect
    this.createRipple(card, event);
    
    // Show project details
    this.showProjectDetails(card);
  }

  createRipple(card, event) {
    const rect = card.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    
    const ripple = document.createElement('div');
    ripple.className = 'roadmap-ripple';
    ripple.style.cssText = `
      position: absolute;
      left: ${x}px;
      top: ${y}px;
      width: 0;
      height: 0;
      border-radius: 50%;
      background: rgba(102, 126, 234, 0.2);
      transform: translate(-50%, -50%);
      animation: roadmapRipple 0.6s ease-out;
      pointer-events: none;
      z-index: 1;
    `;
    
    card.appendChild(ripple);
    
    setTimeout(() => {
      ripple.remove();
    }, 600);
  }

  animateFeatureTag(tag) {
    tag.style.transform = 'scale(1.1) rotate(2deg)';
    tag.style.boxShadow = '0 4px 12px rgba(79, 172, 254, 0.3)';
    
    setTimeout(() => {
      tag.style.transform = '';
      tag.style.boxShadow = '';
    }, 300);
  }

  showTeamMemberInfo(memberName) {
    const memberInfo = {
      'RG': 'Senior AI Engineer - Specializes in machine learning architecture and LLM integration',
      'DM': 'AI Solutions Architect - Expert in AI solution design and implementation'
    };
    
    // Create tooltip or modal with member info
    console.log(`${memberName}: ${memberInfo[memberName] || 'Team Nexus Engineer'}`);
    
    // Could implement a proper tooltip here
    this.showTooltip(memberInfo[memberName] || 'Team Nexus Engineer');
  }

  showTooltip(text) {
    // Simple tooltip implementation
    const tooltip = document.createElement('div');
    tooltip.className = 'member-tooltip';
    tooltip.textContent = text;
    tooltip.style.cssText = `
      position: fixed;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      background: var(--glass-bg-primary);
      backdrop-filter: var(--glass-blur);
      -webkit-backdrop-filter: var(--glass-blur);
      border: 1px solid var(--glass-border);
      border-radius: var(--radius-lg);
      padding: var(--space-md);
      color: var(--text-primary);
      font-size: var(--font-size-sm);
      max-width: 300px;
      z-index: 1000;
      animation: fadeInScale 0.3s ease-out;
    `;
    
    document.body.appendChild(tooltip);
    
    setTimeout(() => {
      tooltip.remove();
    }, 3000);
  }

  showProjectDetails(card) {
    const title = card.querySelector('.project-title').textContent;
    const description = card.querySelector('.project-description').textContent;
    
    // For now, just log the details
    // In a real app, this could open a detailed modal
    console.log(`Project Details: ${title}\n${description}`);
    
    // Add visual feedback
    card.style.borderColor = 'var(--text-accent)';
    card.style.boxShadow = '0 0 30px rgba(79, 172, 254, 0.4)';
    
    setTimeout(() => {
      card.style.borderColor = '';
      card.style.boxShadow = '';
    }, 2000);
  }

  setupTimelineInteractions() {
    this.timelineMarkers.forEach((marker, index) => {
      marker.addEventListener('click', () => {
        this.highlightTimelinePeriod(marker);
      });

      marker.addEventListener('mouseenter', () => {
        this.showTimelineTooltip(marker);
      });
    });
  }

  highlightTimelinePeriod(clickedMarker) {
    const quarter = clickedMarker.getAttribute('data-quarter');
    
    // Reset all markers
    this.timelineMarkers.forEach(marker => {
      marker.style.transform = 'scale(1)';
    });
    
    // Highlight clicked marker
    clickedMarker.style.transform = 'scale(1.2)';
    
    // Filter projects for this quarter
    this.filterByQuarter(quarter);
    
    // Reset after 3 seconds
    setTimeout(() => {
      clickedMarker.style.transform = '';
      this.applyFilter('all');
      this.updateActiveFilter(document.querySelector('[data-status="all"]'));
    }, 3000);
  }

  filterByQuarter(quarter) {
    this.projectCards.forEach(card => {
      const timeline = card.querySelector('.project-timeline');
      const isRelevant = timeline && timeline.textContent.includes(quarter.replace('-', ' '));
      
      if (isRelevant) {
        card.classList.add('visible');
        card.classList.remove('hidden');
        card.style.borderColor = 'var(--text-accent)';
      } else {
        card.classList.add('hidden');
        card.classList.remove('visible');
      }
    });
  }

  showTimelineTooltip(marker) {
    const content = marker.querySelector('.marker-content');
    if (content) {
      content.style.opacity = '1';
      content.style.transform = 'translateX(-50%) translateY(0)';
    }
  }

  setupAnimations() {
    // Create intersection observer for scroll animations
    const options = {
      root: null,
      rootMargin: '0px 0px -10% 0px',
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
    const animatedElements = document.querySelectorAll('[data-animate]');
    animatedElements.forEach(el => {
      this.animationObserver.observe(el);
    });
  }

  animateElement(element) {
    const animationType = element.getAttribute('data-animate');
    
    element.classList.add('animate-in');
    
    switch (animationType) {
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

  setupProgressBarAnimation(card) {
    const progressBar = card.querySelector('.progress-fill');
    if (!progressBar) return;

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const targetWidth = progressBar.style.width;
          progressBar.style.width = '0%';
          
          setTimeout(() => {
            progressBar.style.width = targetWidth;
          }, 200);
          
          observer.unobserve(card);
        }
      });
    }, { threshold: 0.5 });

    observer.observe(card);
  }

  initProgressBars() {
    // Animate all progress bars on page load
    const progressBars = document.querySelectorAll('.progress-fill');
    progressBars.forEach((bar, index) => {
      const targetWidth = bar.style.width;
      bar.style.width = '0%';
      
      setTimeout(() => {
        bar.style.width = targetWidth;
      }, 1000 + (index * 200));
    });
  }

  addStatCounters() {
    const statNumbers = document.querySelectorAll('.stat-number');
    
    statNumbers.forEach(stat => {
      const targetValue = stat.textContent.replace(/[^\d]/g, '');
      if (targetValue) {
        this.animateCounter(stat, 0, parseInt(targetValue), 2000);
      }
    });
  }

  animateCounter(element, start, end, duration) {
    const startTime = performance.now();
    const originalText = element.textContent;
    const isPercentage = originalText.includes('%');
    const hasPlus = originalText.includes('+');
    
    const animate = (currentTime) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      
      const currentValue = Math.floor(start + (end - start) * this.easeOut(progress));
      
      let displayValue = currentValue.toString();
      if (hasPlus) displayValue += '+';
      if (isPercentage) displayValue += '%';
      
      element.textContent = displayValue;
      
      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };
    
    requestAnimationFrame(animate);
  }

  easeOut(t) {
    return 1 - Math.pow(1 - t, 3);
  }

  updateFilterStats(status) {
    // Update visible counts based on filter
    const visibleCards = document.querySelectorAll('.project-card.visible').length;
    console.log(`Showing ${visibleCards} projects for filter: ${status}`);
  }

  updateURL(status) {
    const url = new URL(window.location);
    if (status === 'all') {
      url.searchParams.delete('status');
    } else {
      url.searchParams.set('status', status);
    }
    window.history.replaceState({}, '', url);
  }

  initFromURL() {
    const urlParams = new URLSearchParams(window.location.search);
    const status = urlParams.get('status') || 'all';
    
    const filterButton = document.querySelector(`[data-status="${status}"]`);
    if (filterButton) {
      this.applyFilter(status);
      this.updateActiveFilter(filterButton);
    }
  }

  // Cleanup
  destroy() {
    if (this.animationObserver) {
      this.animationObserver.disconnect();
    }
  }
}

// Add ripple animation keyframes
const roadmapAnimations = `
  @keyframes roadmapRipple {
    0% {
      width: 0;
      height: 0;
      opacity: 0.5;
    }
    100% {
      width: 400px;
      height: 400px;
      opacity: 0;
    }
  }
  
  .member-tooltip {
    box-shadow: var(--shadow-xl);
  }
`;

const style = document.createElement('style');
style.textContent = roadmapAnimations;
document.head.appendChild(style);

// Initialize roadmap page
const roadmapPage = new RoadmapPage();

// Handle browser navigation
window.addEventListener('popstate', () => {
  roadmapPage.initFromURL();
});

export default RoadmapPage;