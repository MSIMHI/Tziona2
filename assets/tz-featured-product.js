/* =========================================================
   TZ FEATURED PRODUCT - Single Product Interactions
   RTL-First Theme - Custom functionality for single product display
   ========================================================= */

document.addEventListener('DOMContentLoaded', () => {
  console.log('TZ Featured Product Loaded');

  // Initialize all featured product sections
  initFeaturedProducts();
});

function initFeaturedProducts() {
  // Find all featured product sections
  const productSections = document.querySelectorAll('.tz-featured-product-section');

  productSections.forEach((section) => {
    // Initialize variant picker
    initVariantPicker(section);

    // Initialize quantity selector
    initQuantitySelector(section);

    // Initialize buy buttons
    initBuyButtons(section);

    // Initialize wishlist functionality
    initWishlistButtons(section);

    // Initialize share functionality
    initShareButtons(section);

    // Initialize form validation
    initFormValidation(section);

    // Initialize accessibility features
    initAccessibility(section);
  });
}

/* --- VARIANT PICKER --- */
function initVariantPicker(section) {
  const variantPickers = section.querySelectorAll('.tz-variant-picker');

  variantPickers.forEach(picker => {
    const buttons = picker.querySelectorAll('button, input[type="radio"], select');

    buttons.forEach(button => {
      button.addEventListener('change', () => {
        // Update product price, availability, etc.
        updateProductInfo(section);
      });
    });
  });
}

/* --- QUANTITY SELECTOR --- */
function initQuantitySelector(section) {
  const quantitySelectors = section.querySelectorAll('.tz-quantity-selector');

  quantitySelectors.forEach(selector => {
    const minusBtn = selector.querySelector('.quantity__button[name="minus"]');
    const plusBtn = selector.querySelector('.quantity__button[name="plus"]');
    const input = selector.querySelector('.quantity__input');

    if (minusBtn && plusBtn && input) {
      minusBtn.addEventListener('click', (e) => {
        e.preventDefault();
        const currentValue = parseInt(input.value) || 1;
        const minValue = parseInt(input.min) || 1;
        if (currentValue > minValue) {
          input.value = currentValue - 1;
          updateQuantityDisplay(section, currentValue - 1);
        }
      });

      plusBtn.addEventListener('click', (e) => {
        e.preventDefault();
        const currentValue = parseInt(input.value) || 1;
        const maxValue = input.max ? parseInt(input.max) : null;
        if (!maxValue || currentValue < maxValue) {
          input.value = currentValue + 1;
          updateQuantityDisplay(section, currentValue + 1);
        }
      });

      input.addEventListener('change', () => {
        const value = parseInt(input.value) || 1;
        updateQuantityDisplay(section, value);
      });
    }
  });
}

/* --- BUY BUTTONS --- */
function initBuyButtons(section) {
  const buyButtons = section.querySelectorAll('.tz-buy-buttons button, .tz-buy-buttons input[type="submit"]');

  buyButtons.forEach(button => {
    button.addEventListener('click', async (e) => {
      const form = button.closest('form');
      if (!form) return;

      // Show loading state
      const originalText = button.textContent;
      button.textContent = 'מוסיף לסל...';
      button.disabled = true;

      try {
        const formData = new FormData(form);
        const response = await fetch('/cart/add.js', {
          method: 'POST',
          body: formData
        });

        const data = await response.json();

        if (response.ok) {
          showToast('נוסף לסל הקניות!', 'success');
          updateCartCount();
          // Optionally redirect to cart
          // window.location.href = '/cart';
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

/* --- WISHLIST FUNCTIONALITY --- */
function initWishlistButtons(section) {
  const wishlistButtons = section.querySelectorAll('.tz-wishlist-btn, [data-wishlist-btn]');

  wishlistButtons.forEach(button => {
    button.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();

      // Toggle wishlist state
      const icon = button.querySelector('.material-icons-outlined');
      const isActive = button.classList.contains('is-active');

      if (isActive) {
        // Remove from wishlist
        button.classList.remove('is-active');
        if (icon) icon.textContent = 'favorite_border';
        showToast('הוסר מהרשימה', 'info');
      } else {
        // Add to wishlist
        button.classList.add('is-active');
        if (icon) icon.textContent = 'favorite';
        showToast('נוסף לרשימה', 'success');
      }

      // Here you would typically make an API call to save/remove from wishlist
    });
  });
}

/* --- SHARE FUNCTIONALITY --- */
function initShareButtons(section) {
  const shareButtons = section.querySelectorAll('.tz-share-button, [data-share-btn]');

  shareButtons.forEach(button => {
    button.addEventListener('click', async (e) => {
      e.preventDefault();

      const url = window.location.href;
      const title = document.title;

      if (navigator.share) {
        try {
          await navigator.share({
            title: title,
            text: 'בדוק מוצר זה',
            url: url
          });
          showToast('שיתוף הצליח!', 'success');
        } catch (error) {
          // User cancelled or share failed
          console.log('Share cancelled or failed');
        }
      } else {
        // Fallback: copy to clipboard
        try {
          await navigator.clipboard.writeText(url);
          showToast('הקישור הועתק!', 'success');
        } catch (error) {
          showToast('שיתוף נכשל', 'error');
        }
      }
    });
  });
}

/* --- FORM VALIDATION --- */
function initFormValidation(section) {
  const forms = section.querySelectorAll('form[action*="/cart/add"]');

  forms.forEach(form => {
    form.addEventListener('submit', (e) => {
      // Basic validation - ensure quantity is valid
      const quantityInput = form.querySelector('input[name="quantity"]');
      if (quantityInput) {
        const quantity = parseInt(quantityInput.value);
        const min = parseInt(quantityInput.min) || 1;
        const max = quantityInput.max ? parseInt(quantityInput.max) : null;

        if (quantity < min) {
          e.preventDefault();
          showToast(`הכמות המינימלית היא ${min}`, 'error');
          return;
        }

        if (max && quantity > max) {
          e.preventDefault();
          showToast(`הכמות המקסימלית היא ${max}`, 'error');
          return;
        }
      }
    });
  });
}

/* --- ACCESSIBILITY --- */
function initAccessibility(section) {
  // Add proper ARIA labels and roles
  const variantPickers = section.querySelectorAll('.tz-variant-picker');
  variantPickers.forEach(picker => {
    const label = picker.querySelector('legend, label');
    if (label && !picker.getAttribute('aria-labelledby')) {
      picker.setAttribute('aria-labelledby', label.id || `variant-picker-${Math.random().toString(36).substr(2, 9)}`);
    }
  });

  // Ensure quantity inputs have proper labels
  const quantityInputs = section.querySelectorAll('.quantity__input');
  quantityInputs.forEach(input => {
    if (!input.getAttribute('aria-describedby')) {
      const label = section.querySelector(`[for="${input.id}"]`);
      if (label) {
        input.setAttribute('aria-describedby', label.id);
      }
    }
  });
}

/* --- UTILITY FUNCTIONS --- */

function updateProductInfo(section) {
  // Update price, availability, images based on selected variants
  // This would typically be handled by Shopify's product-info.js
  console.log('Product info updated');
}

function updateQuantityDisplay(section, quantity) {
  // Update any quantity-related displays
  const quantityDisplays = section.querySelectorAll('[data-cart-quantity]');
  quantityDisplays.forEach(display => {
    display.textContent = quantity;
  });
}

function updateCartCount() {
  // Update cart count in header/navigation
  const cartCountElements = document.querySelectorAll('.cart-count, [data-cart-count]');
  cartCountElements.forEach(element => {
    // This would typically fetch the actual cart count
    const currentCount = parseInt(element.textContent) || 0;
    element.textContent = currentCount + 1;
  });
}

/* --- TOAST NOTIFICATIONS --- */
function showToast(message, type = 'info') {
  // Remove existing toast
  const existingToast = document.querySelector('.tz-toast');
  if (existingToast) {
    existingToast.remove();
  }

  // Create new toast
  const toast = document.createElement('div');
  toast.className = `tz-toast tz-toast--${type}`;
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

/* --- RESPONSIVE BEHAVIOR --- */
window.addEventListener('resize', () => {
  // Re-initialize components if needed for responsive changes
  setTimeout(() => {
    initFeaturedProducts();
  }, 250);
});

/* --- KEYBOARD NAVIGATION --- */
document.addEventListener('keydown', (e) => {
  // Add keyboard shortcuts for product interactions
  if (e.key === 'Enter' && e.target.closest('.tz-buy-buttons button')) {
    // Buy button enter key handling is already covered by click events
  }
});