# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Team Nexus AI Team website - a modern, modular HTML/CSS/JavaScript site for team workflows, roadmap, documentation, blogs, and more. Built with vanilla web technologies using component-based architecture.

## Development Commands

```bash
# Start local development server
python -m http.server 8000
# or
npx serve .

# For live reload during development (if using live-server)
npx live-server
```

## Architecture & File Structure

```
/
├── index.html              # Main landing page
├── css/
│   ├── foundation/         # Base component styles
│   │   ├── reset.css       # CSS reset/normalize
│   │   ├── variables.css   # CSS custom properties
│   │   ├── typography.css  # Font styles and hierarchy
│   │   ├── layout.css      # Grid and layout utilities
│   │   └── components.css  # Reusable UI components
│   ├── pages/             # Page-specific styles
│   └── main.css           # Main stylesheet (imports all)
├── js/
│   ├── components/        # Modular JS components
│   ├── utils/             # Utility functions
│   ├── pages/             # Page-specific JavaScript
│   └── main.js            # Entry point
├── pages/                 # HTML pages
│   ├── workflows/
│   ├── roadmap/
│   ├── docs/
│   └── blog/
├── assets/
│   ├── images/
│   ├── icons/
│   └── fonts/
└── components/            # Reusable HTML components
    ├── header.html
    ├── navigation.html
    ├── footer.html
    └── roadmap-item.html
```

## CSS Architecture

### Foundation System
- **CSS Custom Properties**: Use for theming, spacing, colors
- **Component-Based**: Each component has its own CSS class structure
- **Utility Classes**: For spacing, typography, and layout
- **Mobile-First**: Responsive design starting from mobile
- **CSS Grid & Flexbox**: Modern layout techniques

### Naming Convention
```css
/* BEM methodology */
.component-name { }
.component-name__element { }
.component-name--modifier { }

/* Utility classes */
.u-margin-large { }
.u-text-center { }
.u-hide-mobile { }
```

## JavaScript Architecture

### Modular Components
- Each component is a self-contained module
- Use ES6 modules with import/export
- Component initialization in main.js
- Event delegation for dynamic content

### Modern JavaScript Patterns
```javascript
// Component structure
class RoadmapItem {
  constructor(element) {
    this.element = element;
    this.init();
  }
  
  init() {
    this.bindEvents();
  }
  
  bindEvents() {
    // Event handling
  }
}

// Module exports
export default RoadmapItem;
```

## Component Guidelines

### Reusable Components
- **Cards**: For blog posts, roadmap items, documentation sections
- **Buttons**: Primary, secondary, ghost variants
- **Navigation**: Header nav, breadcrumbs, pagination
- **Forms**: Input fields, validation states
- **Modals**: Overlay dialogs
- **Timeline**: For roadmap visualization

### Component Structure
```html
<div class="card card--elevated" data-component="card">
  <div class="card__header">
    <h3 class="card__title">Title</h3>
  </div>
  <div class="card__content">
    <p class="card__description">Description</p>
  </div>
  <div class="card__actions">
    <button class="btn btn--primary">Action</button>
  </div>
</div>
```

## Roadmap Experience

### Interactive Timeline
- Horizontal scrolling timeline for desktop
- Vertical stacked for mobile
- Filter by status, category, priority
- Smooth animations and transitions
- Progressive disclosure of details

### Modern Techniques
- **CSS Grid**: Complex roadmap layouts
- **Intersection Observer**: Lazy loading and animations
- **CSS Animations**: Smooth transitions
- **Local Storage**: Save user preferences
- **Fetch API**: Dynamic content loading

## Development Standards

### HTML
- Semantic HTML5 elements
- Accessibility attributes (ARIA labels, roles)
- Progressive enhancement approach
- Valid markup (use HTML validator)

### CSS
- Modern CSS features (Grid, Flexbox, Custom Properties)
- Consistent spacing scale (8px base unit)
- Responsive design patterns
- Performance-optimized (minimize repaints)

### JavaScript
- ES6+ syntax
- No external dependencies unless necessary
- Performance-conscious (debouncing, throttling)
- Error handling and graceful degradation

## Performance Considerations

- Optimize images (WebP format when possible)
- Minimize CSS/JS bundle sizes
- Use CSS containment for complex components
- Implement lazy loading for images and content
- Cache static assets appropriately

## Accessibility Requirements

- WCAG 2.1 AA compliance
- Keyboard navigation support
- Screen reader compatibility
- Color contrast ratios
- Focus management for interactive elements