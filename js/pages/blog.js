// Blog page functionality
class BlogPage {
  constructor() {
    this.currentFilter = 'all';
    this.blogCards = [];
    this.filterButtons = [];
    this.init();
  }

  init() {
    this.blogCards = document.querySelectorAll('.blog-card');
    this.filterButtons = document.querySelectorAll('[data-filter]');
    
    this.setupFilters();
    this.setupCardInteractions();
    this.setupSearchFunctionality();
    this.addReadingProgress();
  }

  setupFilters() {
    this.filterButtons.forEach(button => {
      button.addEventListener('click', (e) => {
        e.preventDefault();
        
        const filter = button.getAttribute('data-filter');
        this.applyFilter(filter);
        this.updateActiveFilter(button);
      });
    });
  }

  applyFilter(filter) {
    this.currentFilter = filter;
    
    // Add loading state
    const blogGrid = document.querySelector('.blog-grid');
    blogGrid.classList.add('blog-grid--loading');
    
    setTimeout(() => {
      this.blogCards.forEach((card, index) => {
        const category = card.getAttribute('data-category');
        const shouldShow = filter === 'all' || category === filter;
        
        if (shouldShow) {
          card.classList.remove('hidden');
          card.classList.add('visible');
          card.style.animationDelay = `${index * 0.1}s`;
          card.style.animation = 'none';
          
          // Trigger reflow and add animation
          setTimeout(() => {
            card.style.animation = 'fadeInUp 0.6s ease-out forwards';
          }, index * 100);
        } else {
          card.classList.add('hidden');
          card.classList.remove('visible');
        }
      });
      
      // Remove loading state
      setTimeout(() => {
        blogGrid.classList.remove('blog-grid--loading');
      }, 300);
    }, 200);

    // Update URL without page reload
    const url = new URL(window.location);
    if (filter === 'all') {
      url.searchParams.delete('filter');
    } else {
      url.searchParams.set('filter', filter);
    }
    window.history.replaceState({}, '', url);
  }

  updateActiveFilter(activeButton) {
    this.filterButtons.forEach(button => {
      button.classList.remove('nav-pill--active');
    });
    activeButton.classList.add('nav-pill--active');
  }

  setupCardInteractions() {
    this.blogCards.forEach(card => {
      // Add hover tracking for analytics
      let hoverStart = null;
      
      card.addEventListener('mouseenter', () => {
        hoverStart = Date.now();
      });
      
      card.addEventListener('mouseleave', () => {
        if (hoverStart) {
          const hoverDuration = Date.now() - hoverStart;
          // Could send analytics data here
          console.log(`Card hovered for ${hoverDuration}ms`);
        }
      });
      
      // Add click interactions
      card.addEventListener('click', (e) => {
        this.handleCardClick(card, e);
      });

      // Add keyboard navigation
      card.setAttribute('tabindex', '0');
      card.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          this.handleCardClick(card, e);
        }
      });

      // Add ripple effect on click
      card.addEventListener('click', (e) => {
        this.createRipple(card, e);
      });
    });
  }

  handleCardClick(card, event) {
    const title = card.querySelector('.blog-card__title').textContent;
    const category = card.getAttribute('data-category');
    
    // Add click animation
    card.style.transform = 'scale(0.98)';
    setTimeout(() => {
      card.style.transform = '';
    }, 150);

    // For now, just log the interaction
    // In a real app, this could navigate to a full blog post
    console.log(`Clicked on blog post: ${title} (Category: ${category})`);
    
    // Could implement modal or navigation here
    // this.openBlogPost(card);
  }

  createRipple(card, event) {
    const rect = card.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    
    const ripple = document.createElement('div');
    ripple.className = 'blog-ripple';
    ripple.style.cssText = `
      position: absolute;
      left: ${x}px;
      top: ${y}px;
      width: 0;
      height: 0;
      border-radius: 50%;
      background: rgba(102, 126, 234, 0.2);
      transform: translate(-50%, -50%);
      animation: blogRipple 0.6s ease-out;
      pointer-events: none;
      z-index: 1;
    `;
    
    card.appendChild(ripple);
    
    setTimeout(() => {
      ripple.remove();
    }, 600);
  }

  setupSearchFunctionality() {
    // Create search input
    const searchContainer = document.createElement('div');
    searchContainer.className = 'blog-search';
    searchContainer.innerHTML = `
      <div class="search-input-container">
        <input 
          type="text" 
          class="search-input" 
          placeholder="Search blog posts..."
          aria-label="Search blog posts"
        >
        <div class="search-icon">🔍</div>
      </div>
    `;

    // Style the search
    const searchStyle = `
      .blog-search {
        margin-bottom: var(--space-xl);
        display: flex;
        justify-content: center;
      }
      
      .search-input-container {
        position: relative;
        max-width: 400px;
        width: 100%;
      }
      
      .search-input {
        width: 100%;
        padding: var(--space-md) var(--space-xl) var(--space-md) var(--space-lg);
        background: var(--glass-bg-primary);
        backdrop-filter: var(--glass-blur);
        -webkit-backdrop-filter: var(--glass-blur);
        border: 1px solid var(--glass-border);
        border-radius: var(--radius-xl);
        color: var(--text-primary);
        font-size: var(--font-size-base);
        transition: all var(--transition-base);
      }
      
      .search-input:focus {
        outline: none;
        border-color: var(--text-accent);
        box-shadow: 0 0 0 3px rgba(79, 172, 254, 0.2);
        background: var(--glass-bg-secondary);
      }
      
      .search-input::placeholder {
        color: var(--text-muted);
      }
      
      .search-icon {
        position: absolute;
        right: var(--space-md);
        top: 50%;
        transform: translateY(-50%);
        color: var(--text-muted);
        pointer-events: none;
      }
    `;

    const style = document.createElement('style');
    style.textContent = searchStyle;
    document.head.appendChild(style);

    // Insert search before filters
    const blogFilters = document.querySelector('.blog-filters');
    blogFilters.parentNode.insertBefore(searchContainer, blogFilters);

    // Setup search functionality
    const searchInput = searchContainer.querySelector('.search-input');
    let searchTimeout;

    searchInput.addEventListener('input', (e) => {
      clearTimeout(searchTimeout);
      searchTimeout = setTimeout(() => {
        this.performSearch(e.target.value);
      }, 300);
    });
  }

  performSearch(query) {
    const searchTerm = query.toLowerCase().trim();
    
    this.blogCards.forEach((card, index) => {
      const title = card.querySelector('.blog-card__title').textContent.toLowerCase();
      const excerpt = card.querySelector('.blog-card__excerpt').textContent.toLowerCase();
      const text = card.querySelector('.blog-card__text').textContent.toLowerCase();
      const category = card.getAttribute('data-category').toLowerCase();
      
      const matchesSearch = !searchTerm || 
        title.includes(searchTerm) || 
        excerpt.includes(searchTerm) || 
        text.includes(searchTerm) ||
        category.includes(searchTerm);
      
      const matchesFilter = this.currentFilter === 'all' || 
        card.getAttribute('data-category') === this.currentFilter;
      
      const shouldShow = matchesSearch && matchesFilter;
      
      if (shouldShow) {
        card.classList.remove('hidden');
        card.classList.add('visible');
        card.style.animationDelay = `${index * 0.05}s`;
      } else {
        card.classList.add('hidden');
        card.classList.remove('visible');
      }
    });

    // Show "no results" message if needed
    this.toggleNoResultsMessage();
  }

  toggleNoResultsMessage() {
    const visibleCards = document.querySelectorAll('.blog-card.visible').length;
    let noResultsMsg = document.querySelector('.no-results-message');
    
    if (visibleCards === 0 && !noResultsMsg) {
      noResultsMsg = document.createElement('div');
      noResultsMsg.className = 'no-results-message';
      noResultsMsg.innerHTML = `
        <div class="no-results-content">
          <div class="no-results-icon">📭</div>
          <h3>No posts found</h3>
          <p>Try adjusting your search or filter criteria</p>
        </div>
      `;
      
      const style = `
        .no-results-message {
          grid-column: 1 / -1;
          text-align: center;
          padding: var(--space-3xl) var(--space-lg);
        }
        
        .no-results-icon {
          font-size: var(--font-size-4xl);
          margin-bottom: var(--space-lg);
        }
        
        .no-results-content h3 {
          color: var(--text-secondary);
          margin-bottom: var(--space-sm);
        }
        
        .no-results-content p {
          color: var(--text-muted);
        }
      `;
      
      const styleElement = document.createElement('style');
      styleElement.textContent = style;
      document.head.appendChild(styleElement);
      
      document.querySelector('.blog-grid').appendChild(noResultsMsg);
    } else if (visibleCards > 0 && noResultsMsg) {
      noResultsMsg.remove();
    }
  }

  addReadingProgress() {
    // Add estimated reading time calculation
    this.blogCards.forEach(card => {
      const text = card.querySelector('.blog-card__text').textContent;
      const wordCount = text.split(' ').length;
      const readingTime = Math.ceil(wordCount / 200); // 200 words per minute
      
      const readTimeElement = card.querySelector('.blog-card__read-time');
      if (readTimeElement && !readTimeElement.textContent.includes('min')) {
        readTimeElement.textContent = `${readingTime} min read`;
      }
    });
  }

  // Initialize from URL parameters
  initFromURL() {
    const urlParams = new URLSearchParams(window.location.search);
    const filter = urlParams.get('filter');
    
    if (filter && filter !== 'all') {
      const filterButton = document.querySelector(`[data-filter="${filter}"]`);
      if (filterButton) {
        this.applyFilter(filter);
        this.updateActiveFilter(filterButton);
      }
    }
  }

  // Cleanup
  destroy() {
    const searchContainer = document.querySelector('.blog-search');
    if (searchContainer) {
      searchContainer.remove();
    }
  }
}

// Add ripple animation
const blogRippleStyle = `
  @keyframes blogRipple {
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
style.textContent = blogRippleStyle;
document.head.appendChild(style);

// Initialize blog page
const blogPage = new BlogPage();

// Initialize from URL on load
document.addEventListener('DOMContentLoaded', () => {
  blogPage.initFromURL();
});

// Handle browser back/forward
window.addEventListener('popstate', () => {
  blogPage.initFromURL();
});

export default BlogPage;