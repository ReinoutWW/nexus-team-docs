// Navigation component with glassmorphism effects
class Navigation {
  constructor() {
    this.navbar = document.querySelector('.navbar');
    this.navLinks = document.querySelectorAll('.navbar__link');
    this.isScrolled = false;
    this.activeLink = null;
    
    this.init();
  }

  init() {
    if (!this.navbar) return;
    
    this.handleScroll();
    this.handleActiveStates();
    this.addMobileMenu();
    this.addNavHoverEffects();
  }

  handleScroll() {
    let ticking = false;
    
    const updateNavbar = () => {
      const scrollY = window.pageYOffset;
      const shouldBeScrolled = scrollY > 50;
      
      if (shouldBeScrolled !== this.isScrolled) {
        this.isScrolled = shouldBeScrolled;
        
        if (this.isScrolled) {
          this.navbar.style.background = 'var(--glass-bg-secondary)';
          this.navbar.style.backdropFilter = 'var(--glass-blur-strong)';
          this.navbar.style.boxShadow = 'var(--shadow-lg)';
          this.navbar.style.borderBottom = '1px solid var(--glass-border)';
        } else {
          this.navbar.style.background = 'var(--glass-bg-primary)';
          this.navbar.style.backdropFilter = 'var(--glass-blur)';
          this.navbar.style.boxShadow = '';
          this.navbar.style.borderBottom = '1px solid var(--glass-border)';
        }
      }
      
      ticking = false;
    };

    window.addEventListener('scroll', () => {
      if (!ticking) {
        requestAnimationFrame(updateNavbar);
        ticking = true;
      }
    });
  }

  handleActiveStates() {
    // Set initial active state
    this.setActiveLink();
    
    // Handle section-based active states (for single page)
    if (this.isSinglePage()) {
      this.handleSectionActive();
    }
    
    // Handle click events
    this.navLinks.forEach(link => {
      link.addEventListener('click', (e) => {
        // If it's an anchor link on the same page
        if (link.getAttribute('href').startsWith('#')) {
          this.setActiveLink(link);
        }
      });
    });
  }

  setActiveLink(clickedLink = null) {
    // Remove active class from all links
    this.navLinks.forEach(link => {
      link.classList.remove('navbar__link--active');
    });
    
    // Set active link
    if (clickedLink) {
      clickedLink.classList.add('navbar__link--active');
      this.activeLink = clickedLink;
    } else {
      // Set based on current page
      const currentPath = window.location.pathname;
      this.navLinks.forEach(link => {
        const linkPath = link.getAttribute('href');
        
        if (currentPath === '/' && linkPath.includes('#home')) {
          link.classList.add('navbar__link--active');
          this.activeLink = link;
        } else if (currentPath.includes(linkPath.replace('./', '').replace('pages/', '')) && !linkPath.includes('#')) {
          link.classList.add('navbar__link--active');
          this.activeLink = link;
        }
      });
    }
  }

  isSinglePage() {
    return window.location.pathname === '/' || window.location.pathname.endsWith('index.html');
  }

  handleSectionActive() {
    const sections = ['home', 'team', 'projects'];
    const sectionElements = sections.map(id => document.getElementById(id)).filter(Boolean);
    
    if (sectionElements.length === 0) return;

    const options = {
      root: null,
      rootMargin: '-50% 0px -50% 0px',
      threshold: 0
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const sectionId = entry.target.id;
          const correspondingLink = document.querySelector(`a[href="#${sectionId}"]`);
          
          if (correspondingLink) {
            this.setActiveLink(correspondingLink);
          }
        }
      });
    }, options);

    sectionElements.forEach(section => {
      observer.observe(section);
    });
  }

  addMobileMenu() {
    // Create mobile menu toggle
    const mobileToggle = document.createElement('button');
    mobileToggle.className = 'navbar__mobile-toggle';
    mobileToggle.innerHTML = `
      <span class="hamburger-line"></span>
      <span class="hamburger-line"></span>
      <span class="hamburger-line"></span>
    `;
    mobileToggle.setAttribute('aria-label', 'Toggle mobile menu');
    
    // Style the mobile toggle
    mobileToggle.style.cssText = `
      display: none;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      width: 30px;
      height: 30px;
      background: none;
      border: none;
      cursor: pointer;
      padding: 0;
      gap: 4px;
    `;

    // Style hamburger lines
    const hamburgerStyle = `
      .hamburger-line {
        width: 20px;
        height: 2px;
        background: var(--text-primary);
        transition: all 0.3s ease;
        transform-origin: center;
      }
      
      .navbar__mobile-toggle.active .hamburger-line:nth-child(1) {
        transform: rotate(45deg) translate(3px, 3px);
      }
      
      .navbar__mobile-toggle.active .hamburger-line:nth-child(2) {
        opacity: 0;
      }
      
      .navbar__mobile-toggle.active .hamburger-line:nth-child(3) {
        transform: rotate(-45deg) translate(3px, -3px);
      }
      
      @media (max-width: 768px) {
        .navbar__mobile-toggle {
          display: flex !important;
        }
        
        .navbar__menu {
          position: absolute;
          top: 100%;
          left: 0;
          right: 0;
          background: var(--glass-bg-primary);
          backdrop-filter: var(--glass-blur-strong);
          -webkit-backdrop-filter: var(--glass-blur-strong);
          border: 1px solid var(--glass-border);
          border-top: none;
          flex-direction: column;
          padding: var(--space-lg);
          gap: var(--space-md);
          transform: translateY(-100%);
          opacity: 0;
          visibility: hidden;
          transition: all 0.3s ease;
        }
        
        .navbar__menu.active {
          transform: translateY(0);
          opacity: 1;
          visibility: visible;
        }
        
        .navbar__link {
          padding: var(--space-md);
          text-align: center;
          border-radius: var(--radius-lg);
        }
      }
    `;

    const style = document.createElement('style');
    style.textContent = hamburgerStyle;
    document.head.appendChild(style);

    // Add toggle to navbar
    const navbarContainer = this.navbar.querySelector('.navbar__container');
    navbarContainer.appendChild(mobileToggle);

    // Handle mobile menu toggle
    const navMenu = this.navbar.querySelector('.navbar__menu');
    let isMenuOpen = false;

    mobileToggle.addEventListener('click', () => {
      isMenuOpen = !isMenuOpen;
      
      mobileToggle.classList.toggle('active', isMenuOpen);
      navMenu.classList.toggle('active', isMenuOpen);
      
      // Prevent body scroll when menu is open
      document.body.style.overflow = isMenuOpen ? 'hidden' : '';
    });

    // Close menu when clicking a link
    this.navLinks.forEach(link => {
      link.addEventListener('click', () => {
        if (isMenuOpen) {
          isMenuOpen = false;
          mobileToggle.classList.remove('active');
          navMenu.classList.remove('active');
          document.body.style.overflow = '';
        }
      });
    });

    // Close menu when clicking outside
    document.addEventListener('click', (e) => {
      if (isMenuOpen && !this.navbar.contains(e.target)) {
        isMenuOpen = false;
        mobileToggle.classList.remove('active');
        navMenu.classList.remove('active');
        document.body.style.overflow = '';
      }
    });
  }

  addNavHoverEffects() {
    this.navLinks.forEach(link => {
      // Create hover indicator
      const indicator = document.createElement('div');
      indicator.className = 'nav-hover-indicator';
      indicator.style.cssText = `
        position: absolute;
        bottom: -1px;
        left: 50%;
        width: 0;
        height: 2px;
        background: var(--accent-gradient);
        transform: translateX(-50%);
        transition: width 0.3s ease;
        border-radius: 1px;
      `;
      
      link.style.position = 'relative';
      link.appendChild(indicator);

      // Hover effects
      link.addEventListener('mouseenter', () => {
        if (!link.classList.contains('navbar__link--active')) {
          indicator.style.width = '80%';
        }
      });

      link.addEventListener('mouseleave', () => {
        if (!link.classList.contains('navbar__link--active')) {
          indicator.style.width = '0';
        }
      });

      // Active state indicator
      const updateActiveIndicator = () => {
        if (link.classList.contains('navbar__link--active')) {
          indicator.style.width = '100%';
          indicator.style.background = 'var(--primary-gradient)';
        } else {
          indicator.style.background = 'var(--accent-gradient)';
        }
      };

      // Observer for class changes
      const observer = new MutationObserver(updateActiveIndicator);
      observer.observe(link, {
        attributes: true,
        attributeFilter: ['class']
      });

      updateActiveIndicator();
    });
  }

  // Utility method to highlight a specific nav item
  highlightNavItem(selector) {
    const link = document.querySelector(selector);
    if (link) {
      this.setActiveLink(link);
    }
  }

  // Cleanup
  destroy() {
    // Remove mobile menu styles and event listeners
    const mobileToggle = this.navbar.querySelector('.navbar__mobile-toggle');
    if (mobileToggle) {
      mobileToggle.remove();
    }
    
    // Reset body overflow
    document.body.style.overflow = '';
  }
}

export default Navigation;