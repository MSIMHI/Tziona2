/* =========================================================
   TZ MAIN LIST COLLECTIONS - Collections Grid Interactions
   RTL-First Theme - Enhanced user experience for collections
   ========================================================= */

document.addEventListener('DOMContentLoaded', () => {
  console.log('TZ Main List Collections Loaded');

  // Initialize all collections sections
  initCollectionsSections();
});

function initCollectionsSections() {
  // Find all collections sections
  const collectionsSections = document.querySelectorAll('.tz-collections-section');

  collectionsSections.forEach((section) => {
    // Initialize collection cards
    initCollectionCards(section);

    // Initialize lazy loading for images
    initLazyLoading(section);

    // Initialize pagination if present
    initPagination(section);
  });
}

/* --- COLLECTION CARDS --- */
function initCollectionCards(section) {
  const collectionCards = section.querySelectorAll('.tz-collection-card');

  collectionCards.forEach((card, index) => {
    // Add staggered animation delay
    if (card.classList.contains('scroll-trigger')) {
      card.style.setProperty('--animation-order', index);
    }

    // Add keyboard navigation
    card.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        card.click();
      }
    });

    // Add touch feedback for mobile
    card.addEventListener('touchstart', () => {
      card.style.transform = 'scale(0.98)';
    });

    card.addEventListener('touchend', () => {
      setTimeout(() => {
        card.style.transform = '';
      }, 150);
    });
  });
}

/* --- LAZY LOADING --- */
function initLazyLoading(section) {
  const images = section.querySelectorAll('.tz-collection-image img[loading="lazy"]');

  if ('IntersectionObserver' in window) {
    const imageObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const img = entry.target;
          img.classList.add('loaded');
          observer.unobserve(img);
        }
      });
    });

    images.forEach(img => imageObserver.observe(img));
  } else {
    // Fallback for browsers without IntersectionObserver
    images.forEach(img => {
      img.classList.add('loaded');
    });
  }
}

/* --- PAGINATION --- */
function initPagination(section) {
  const paginationContainer = section.querySelector('.tz-collections-pagination');

  if (paginationContainer) {
    // Add loading states for pagination links
    const paginationLinks = paginationContainer.querySelectorAll('a');

    paginationLinks.forEach(link => {
      link.addEventListener('click', () => {
        // Add loading state
        link.style.opacity = '0.7';
        link.style.pointerEvents = 'none';

        // Remove loading state after navigation (this won't execute due to navigation)
        // The new page will handle loading states
      });
    });
  }
}

/* --- ENHANCED INTERACTIONS --- */

// Add smooth scrolling for anchor links
document.addEventListener('click', (e) => {
  const link = e.target.closest('a[href^="#"]');
  if (link) {
    const targetId = link.getAttribute('href').substring(1);
    const targetElement = document.getElementById(targetId);

    if (targetElement) {
      e.preventDefault();
      targetElement.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
      });
    }
  }
});

/* --- ACCESSIBILITY --- */
function enhanceAccessibility(section) {
  // Add proper ARIA labels
  const collectionCards = section.querySelectorAll('.tz-collection-card');

  collectionCards.forEach(card => {
    const title = card.querySelector('.tz-collection-title');
    if (title && !card.getAttribute('aria-label')) {
      card.setAttribute('aria-label', `View ${title.textContent.trim()} collection`);
    }
  });

  // Ensure proper heading hierarchy
  const mainTitle = section.querySelector('.tz-collections-title');
  if (mainTitle && mainTitle.tagName !== 'H1') {
    // If it's not already an h1, we might want to adjust the hierarchy
    // But we'll keep it as is since the original used h1
  }
}

// Initialize accessibility on load
document.addEventListener('DOMContentLoaded', () => {
  const collectionsSections = document.querySelectorAll('.tz-collections-section');
  collectionsSections.forEach(section => enhanceAccessibility(section));
});

/* --- PERFORMANCE OPTIMIZATIONS --- */

// Debounce function for performance
function debounce(func, wait) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

// Throttle scroll events
const throttledScrollHandler = throttle(() => {
  // Handle scroll-based animations or lazy loading triggers
}, 16); // ~60fps

window.addEventListener('scroll', throttledScrollHandler);

/* --- UTILITY FUNCTIONS --- */

// Throttle function for performance
function throttle(func, limit) {
  let inThrottle;
  return function() {
    const args = arguments;
    const context = this;
    if (!inThrottle) {
      func.apply(context, args);
      inThrottle = true;
      setTimeout(() => inThrottle = false, limit);
    }
  }
}

/* --- RESPONSIVE BEHAVIOR --- */
window.addEventListener('resize', debounce(() => {
  // Re-initialize components if needed for responsive changes
  initCollectionsSections();
}, 250));

/* --- ERROR HANDLING --- */
window.addEventListener('error', (e) => {
  // Log errors for debugging
  console.error('Collections section error:', e.error);

  // Gracefully handle image loading errors
  if (e.target.tagName === 'IMG' && e.target.closest('.tz-collection-image')) {
    const img = e.target;
    img.style.display = 'none';

    // Show fallback placeholder
    const placeholder = img.parentElement.querySelector('.placeholder') ||
                       document.createElement('div');
    placeholder.className = 'tz-collection-placeholder';
    placeholder.innerHTML = '<span class="material-icons-outlined">collections</span>';
    img.parentElement.appendChild(placeholder);
  }
});

/* --- ANALYTICS & TRACKING --- */

// Track collection clicks for analytics
document.addEventListener('click', (e) => {
  const collectionCard = e.target.closest('.tz-collection-card');
  if (collectionCard) {
    const collectionTitle = collectionCard.querySelector('.tz-collection-title');
    if (collectionTitle) {
      // Track collection click
      console.log('Collection clicked:', collectionTitle.textContent.trim());

      // Here you could send analytics events
      // gtag('event', 'collection_click', {
      //   collection_name: collectionTitle.textContent.trim()
      // });
    }
  }
});