/* =========================================================
   TZ FEATURED COLLECTION - JavaScript Functionality
   RTL-First Theme - Built from scratch
   ========================================================= */

document.addEventListener('DOMContentLoaded', () => {
  console.log('TZ Featured Collection Loaded');

  // Initialize all featured collection sections
  initFeaturedCollections();
});

function initFeaturedCollections() {
  // Find all featured collection sections
  const collectionSections = document.querySelectorAll('.tz-featured-collection-section');

  collectionSections.forEach((section) => {
    // Initialize slider functionality if needed
    initCollectionSlider(section);

    // Initialize wishlist buttons
    initWishlistButtons(section);

    // Initialize quick add functionality if enabled
    initQuickAddButtons(section);
  });
}

/* --- SLIDER FUNCTIONALITY --- */
function initCollectionSlider(section) {
  const sliderContainer = section.querySelector('.tz-collection-slider');
  const prevBtn = section.querySelector('.tz-collection-slider-prev');
  const nextBtn = section.querySelector('.tz-collection-slider-next');
  const counter = section.querySelector('.tz-collection-slider-counter');

  if (!sliderContainer || !prevBtn || !nextBtn) return;

  const slides = sliderContainer.querySelectorAll('.tz-collection-slide');
  let currentIndex = 0;
  const totalSlides = slides.length;

  // Update counter
  function updateCounter() {
    if (counter) {
      const currentSpan = counter.querySelector('.tz-collection-counter-current');
      const totalSpan = counter.querySelector('.tz-collection-counter-total');
      if (currentSpan) currentSpan.textContent = currentIndex + 1;
      if (totalSpan) totalSpan.textContent = totalSlides;
    }
  }

  // Show slide at specific index
  function showSlide(index) {
    // Remove active class from all slides
    slides.forEach(slide => slide.classList.remove('is-active'));

    // Add active class to current slide
    if (slides[index]) {
      slides[index].classList.add('is-active');
    }

    currentIndex = index;
    updateCounter();
  }

  // Next slide
  function nextSlide() {
    const nextIndex = (currentIndex + 1) % totalSlides;
    showSlide(nextIndex);
  }

  // Previous slide
  function prevSlide() {
    const prevIndex = currentIndex === 0 ? totalSlides - 1 : currentIndex - 1;
    showSlide(prevIndex);
  }

  // Event listeners
  nextBtn.addEventListener('click', nextSlide);
  prevBtn.addEventListener('click', prevSlide);

  // Keyboard navigation
  document.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowLeft') {
      nextSlide(); // RTL: left arrow goes to next slide
    } else if (e.key === 'ArrowRight') {
      prevSlide(); // RTL: right arrow goes to previous slide
    }
  });

  // Initialize first slide
  showSlide(0);
}

/* --- WISHLIST FUNCTIONALITY --- */
function initWishlistButtons(section) {
  const wishlistButtons = section.querySelectorAll('.tz-collection-wishlist-btn');

  wishlistButtons.forEach(button => {
    button.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation(); // Prevent card click

      // Toggle wishlist state
      const icon = button.querySelector('.material-icons-outlined');
      const isActive = button.classList.contains('is-active');

      if (isActive) {
        // Remove from wishlist
        button.classList.remove('is-active');
        icon.textContent = 'favorite_border';
        icon.style.color = '';
        showToast('הוסר מהרשימה', 'info');
      } else {
        // Add to wishlist
        button.classList.add('is-active');
        icon.textContent = 'favorite';
        icon.style.color = '#ff5a1f';
        showToast('נוסף לרשימה', 'success');
      }

      // Here you would typically make an API call to save/remove from wishlist
      // For now, we'll just update the UI
    });
  });
}

/* --- QUICK ADD FUNCTIONALITY --- */
function initQuickAddButtons(section) {
  const quickAddButtons = section.querySelectorAll('.tz-collection-quick-add-btn');

  quickAddButtons.forEach(button => {
    button.addEventListener('click', async (e) => {
      e.preventDefault();
      e.stopPropagation();

      const card = button.closest('.tz-collection-product-card');
      const productId = button.dataset.productId;
      const variantId = button.dataset.variantId || button.dataset.productId;

      if (!variantId) {
        showToast('שגיאה: לא ניתן להוסיף למלאי', 'error');
        return;
      }

      // Show loading state
      const originalText = button.textContent;
      button.textContent = 'מוסיף...';
      button.disabled = true;

      try {
        // Add to cart via Shopify AJAX API
        const response = await fetch('/cart/add.js', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            items: [{
              id: variantId,
              quantity: 1
            }]
          })
        });

        const data = await response.json();

        if (response.ok) {
          showToast('נוסף לסל הקניות!', 'success');
          // Update cart count if you have a cart counter
          updateCartCount();
        } else {
          throw new Error(data.message || 'שגיאה בהוספה לסל');
        }
      } catch (error) {
        console.error('Error adding to cart:', error);
        showToast(error.message || 'שגיאה בהוספה לסל', 'error');
      } finally {
        // Reset button state
        button.textContent = originalText;
        button.disabled = false;
      }
    });
  });
}

/* --- UTILITY FUNCTIONS --- */

// Toast notification system
function showToast(message, type = 'info') {
  // Remove existing toast
  const existingToast = document.querySelector('.tz-collection-toast');
  if (existingToast) {
    existingToast.remove();
  }

  // Create new toast
  const toast = document.createElement('div');
  toast.className = `tz-collection-toast tz-collection-toast--${type}`;
  toast.textContent = message;

  // Add to page
  document.body.appendChild(toast);

  // Show toast
  setTimeout(() => toast.classList.add('is-visible'), 100);

  // Hide toast after 3 seconds
  setTimeout(() => {
    toast.classList.remove('is-visible');
    setTimeout(() => toast.remove(), 300);
  }, 3000);
}

// Update cart count (if you have a cart counter element)
function updateCartCount() {
  // This would update your cart counter
  // Example: document.querySelector('.cart-count').textContent = newCount;
  console.log('Cart updated');
}

/* --- RESPONSIVE BEHAVIOR --- */

// Handle window resize for responsive behavior
let resizeTimeout;
window.addEventListener('resize', () => {
  clearTimeout(resizeTimeout);
  resizeTimeout = setTimeout(() => {
    // Re-initialize sliders if needed for responsive changes
    initFeaturedCollections();
  }, 250);
});

/* --- ACCESSIBILITY --- */

// Add ARIA labels and keyboard navigation
function enhanceAccessibility(section) {
  // Add ARIA labels to interactive elements
  const wishlistButtons = section.querySelectorAll('.tz-collection-wishlist-btn');
  wishlistButtons.forEach(btn => {
    if (!btn.getAttribute('aria-label')) {
      btn.setAttribute('aria-label', 'הוסף לרשימה');
    }
  });

  const quickAddButtons = section.querySelectorAll('.tz-collection-quick-add-btn');
  quickAddButtons.forEach(btn => {
    if (!btn.getAttribute('aria-label')) {
      btn.setAttribute('aria-label', 'הוסף לסל');
    }
  });
}

// Initialize accessibility on load
document.addEventListener('DOMContentLoaded', () => {
  const collectionSections = document.querySelectorAll('.tz-featured-collection-section');
  collectionSections.forEach(section => enhanceAccessibility(section));
});