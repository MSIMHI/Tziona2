/**
 * TZ Collection Hero JavaScript
 * Handles collection hero banner interactions
 * RTL-first implementation
 */

class TzCollectionHero {
  constructor(section) {
    this.section = section;
    this.sectionId = section.dataset.sectionId;

    this.init();
  }

  init() {
    // Initialize lazy loading for images if needed
    this.initLazyLoading();
    
    // Initialize animations if scroll trigger is enabled
    if (this.section.classList.contains('scroll-trigger')) {
      this.initScrollAnimations();
    }
  }

  // Initialize lazy loading for hero image
  initLazyLoading() {
    const image = this.section.querySelector('.tz-collection-hero__image-container img');
    if (image && 'loading' in HTMLImageElement.prototype) {
      // Browser supports native lazy loading
      image.loading = 'lazy';
    } else if (image) {
      // Fallback for browsers that don't support native lazy loading
      const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const img = entry.target;
            if (img.dataset.src) {
              img.src = img.dataset.src;
              img.removeAttribute('data-src');
            }
            observer.unobserve(img);
          }
        });
      });

      imageObserver.observe(image);
    }
  }

  // Initialize scroll animations
  initScrollAnimations() {
    const observerOptions = {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.style.animationPlayState = 'running';
        }
      });
    }, observerOptions);

    observer.observe(this.section);
  }

  // RTL-specific helpers
  isRTL() {
    return document.documentElement.dir === 'rtl' ||
           document.documentElement.getAttribute('dir') === 'rtl';
  }
}

// Initialize collection heroes when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  const heroSections = document.querySelectorAll('[data-section-type="tz-collection-hero"]');

  heroSections.forEach(section => {
    new TzCollectionHero(section);
  });
});

// Shopify section events
document.addEventListener('shopify:section:load', (event) => {
  if (event.target.querySelector('[data-section-type="tz-collection-hero"]')) {
    const section = event.target.querySelector('[data-section-type="tz-collection-hero"]');
    new TzCollectionHero(section);
  }
});

document.addEventListener('shopify:section:unload', (event) => {
  // Cleanup if needed
});

document.addEventListener('shopify:section:select', (event) => {
  // Handle section selection in theme editor
});

document.addEventListener('shopify:section:deselect', (event) => {
  // Handle section deselection in theme editor
});
