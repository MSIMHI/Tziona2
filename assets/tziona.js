document.addEventListener('DOMContentLoaded', () => {
  // Mobile Menu Toggle
  const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
  const mobileMenuDrawer = document.getElementById('mobile-menu-drawer');
  const mobileMenuOverlay = document.querySelector('.mobile-menu-overlay');
  const mobileMenuClose = document.querySelector('.mobile-menu-close');
  
  if (mobileMenuToggle && mobileMenuDrawer) {
    mobileMenuToggle.addEventListener('click', () => {
      const isOpen = mobileMenuToggle.getAttribute('aria-expanded') === 'true';
      mobileMenuToggle.setAttribute('aria-expanded', !isOpen);
      mobileMenuDrawer.classList.toggle('is-open');
      if (mobileMenuOverlay) {
        mobileMenuOverlay.classList.toggle('is-visible');
      }
      document.body.style.overflow = isOpen ? '' : 'hidden';
    });
    
    if (mobileMenuClose) {
      mobileMenuClose.addEventListener('click', () => {
        mobileMenuToggle.setAttribute('aria-expanded', 'false');
        mobileMenuDrawer.classList.remove('is-open');
        if (mobileMenuOverlay) {
          mobileMenuOverlay.classList.remove('is-visible');
        }
        document.body.style.overflow = '';
      });
    }
    
    if (mobileMenuOverlay) {
      mobileMenuOverlay.addEventListener('click', () => {
        mobileMenuToggle.setAttribute('aria-expanded', 'false');
        mobileMenuDrawer.classList.remove('is-open');
        mobileMenuOverlay.classList.remove('is-visible');
        document.body.style.overflow = '';
      });
    }
  }

  // Select cart button (looking for the specific SVG pattern or a data-attribute if added)
  const cartBtns = document.querySelectorAll('.icon-btn');
  const cartDrawer = document.getElementById('cartDrawer');
  const cartOverlay = document.getElementById('cartOverlay');
  const closeCartBtn = document.getElementById('closeCartBtn');

  // In a real theme, you might want to add a specific class to the cart button
  // For now, adhering to the provided index logic (3rd button)
  const cartBtn = cartBtns[2];

  function openCart() {
    if (cartDrawer && cartOverlay) {
      cartDrawer.classList.add('open');
      cartOverlay.classList.add('open');
      document.body.style.overflow = 'hidden';
    }
  }

  function closeCart() {
    if (cartDrawer && cartOverlay) {
      cartDrawer.classList.remove('open');
      cartOverlay.classList.remove('open');
      document.body.style.overflow = '';
    }
  }

  if (cartBtn) {
    cartBtn.addEventListener('click', (e) => {
      e.preventDefault();
      openCart();
    });
  }

  if (closeCartBtn) {
    closeCartBtn.addEventListener('click', closeCart);
  }

  if (cartOverlay) {
    cartOverlay.addEventListener('click', closeCart);
  }

  // Cart Drawer Quantity Updates (AJAX)
  function updateCartQuantity(line, quantity) {
    return fetch('/cart/change.js', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        line: line,
        quantity: quantity
      })
    });
  }

  let isRefreshing = false;
  let refreshTimeout = null;

  // Make refreshCartDrawer globally accessible
  window.refreshCartDrawer = function refreshCartDrawer() {
    // Prevent multiple simultaneous refreshes
    if (isRefreshing) {
      return Promise.resolve();
    }
    
    isRefreshing = true;
    
    // Clear any pending refresh
    if (refreshTimeout) {
      clearTimeout(refreshTimeout);
    }
    // Fetch updated cart data
    return fetch('/cart.js')
      .then(res => res.json())
      .then(cart => {
        // Update cart count in header if exists
        const cartCountElements = document.querySelectorAll('[data-cart-count]');
        cartCountElements.forEach(el => {
          el.textContent = cart.item_count;
        });

        // Update cart title count
        const cartTitleCount = document.querySelector('.cart-title-count');
        if (cartTitleCount) {
          const itemText = cart.item_count === 1 ? 'פריט' : 'פריטים';
          cartTitleCount.textContent = `(${cart.item_count} ${itemText})`;
        }

        const currentCartDrawer = document.getElementById('cartDrawer');
        if (!currentCartDrawer) {
          isRefreshing = false;
          return;
        }

        // Update cart items list
        const cartItemsList = currentCartDrawer.querySelector('.cart-items-list');
        if (!cartItemsList) {
          isRefreshing = false;
          return;
        }

        // If cart is empty, show empty message
        if (cart.item_count === 0) {
          cartItemsList.innerHTML = '<div style="padding: 30px; text-align:center;">העגלה ריקה</div>';
          
          // Update footer total
          const totalPrice = currentCartDrawer.querySelector('.checkout-btn span:last-child');
          if (totalPrice) {
            totalPrice.textContent = '₪0';
          }
          
          setTimeout(() => {
            initCartQuantityButtons();
            isRefreshing = false;
          }, 100);
          return;
        }

        // Build cart items HTML from cart data
        let itemsHTML = '';
        cart.items.forEach((item, index) => {
          const line = index + 1;
          // Handle image URL - cart.js returns full URL or we need to construct it
          let itemImageHTML = '';
          if (item.image) {
            // If image is already a full URL, use it; otherwise construct it
            const imageUrl = item.image.startsWith('http') ? item.image : item.image;
            itemImageHTML = `<img src="${imageUrl}" alt="${item.product_title}" style="width: 80px; height: 80px; object-fit: cover;">`;
          } else {
            itemImageHTML = '<div style="width: 80px; height: 80px; background: #f0f0f0;"></div>';
          }
          const itemPrice = formatMoney(item.final_line_price);
          
          itemsHTML += `
            <div class="cart-item">
              ${itemImageHTML}
              <div class="item-details">
                <div class="item-title">
                  <a href="${item.url}">${item.product_title}</a>
                </div>
                <div class="item-variant">${item.variant_title || ''}</div>
                <div class="qty-selector">
                  <button
                    type="button"
                    class="qty-btn qty-btn-minus"
                    data-line="${line}"
                    data-quantity="${item.quantity - 1}"
                    aria-label="Decrease quantity"
                    ${item.quantity <= 0 ? 'disabled' : ''}
                    >&minus;</button>
                  <div class="qty-val">${item.quantity}</div>
                  <button
                    type="button"
                    class="qty-btn qty-btn-plus"
                    data-line="${line}"
                    data-quantity="${item.quantity + 1}"
                    aria-label="Increase quantity"
                    >&plus;</button>
                </div>
              </div>
              <div class="item-price-col">
                <div class="item-price">${itemPrice}</div>
                <button
                  type="button"
                  class="item-remove"
                  data-line="${line}"
                  aria-label="Remove item"
                  >הסר</button>
              </div>
            </div>
          `;
        });

        cartItemsList.innerHTML = itemsHTML;

        // Update cart footer totals
        const totalPrice = currentCartDrawer.querySelector('.checkout-btn span:last-child');
        if (totalPrice) {
          totalPrice.textContent = formatMoney(cart.total_price);
        }

        // Re-initialize quantity buttons after update (with delay to prevent loops)
        setTimeout(() => {
          initCartQuantityButtons();
          isRefreshing = false;
        }, 100);
      })
      .catch(err => {
        console.error('Error fetching cart:', err);
        isRefreshing = false;
        // Fallback: reload page to show updated cart
        window.location.reload();
      });
  }

  function formatMoney(cents) {
    // Use Shopify's money formatter if available
    if (typeof Shopify !== 'undefined' && typeof Shopify.formatMoney === 'function') {
      return Shopify.formatMoney(cents, window.Shopify?.money_format || '{{amount}}');
    }
    // Fallback: Use cart currency if available
    if (typeof window.Shopify !== 'undefined' && window.Shopify.currency) {
      const currency = window.Shopify.currency.active || 'ILS';
      const locale = document.documentElement.lang || 'he-IL';
      return new Intl.NumberFormat(locale, {
        style: 'currency',
        currency: currency,
        minimumFractionDigits: 0,
        maximumFractionDigits: 0
      }).format(cents / 100);
    }
    // Final fallback
    return new Intl.NumberFormat('he-IL', {
      style: 'currency',
      currency: 'ILS',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(cents / 100);
  }

  function initCartQuantityButtons() {
    // Quantity decrease buttons
    const qtyMinusButtons = document.querySelectorAll('.qty-btn-minus');
    qtyMinusButtons.forEach(btn => {
      // Remove existing listeners by cloning
      const newBtn = btn.cloneNode(true);
      btn.parentNode.replaceChild(newBtn, btn);
      
      newBtn.addEventListener('click', async (e) => {
        e.preventDefault();
        e.stopPropagation();
        
        const line = parseInt(newBtn.dataset.line);
        const quantity = parseInt(newBtn.dataset.quantity);
        
        if (quantity < 0) return;
        
        newBtn.disabled = true;
        try {
          const response = await updateCartQuantity(line, quantity);
          if (!response.ok) {
            throw new Error('Failed to update cart');
          }
          await refreshCartDrawer();
        } catch (error) {
          console.error('Error updating cart quantity:', error);
          alert('שגיאה בעדכון הכמות. נסה שוב.');
        } finally {
          newBtn.disabled = false;
        }
      });
    });

    // Quantity increase buttons
    const qtyPlusButtons = document.querySelectorAll('.qty-btn-plus');
    qtyPlusButtons.forEach(btn => {
      // Remove existing listeners by cloning
      const newBtn = btn.cloneNode(true);
      btn.parentNode.replaceChild(newBtn, btn);
      
      newBtn.addEventListener('click', async (e) => {
        e.preventDefault();
        e.stopPropagation();
        
        const line = parseInt(newBtn.dataset.line);
        const quantity = parseInt(newBtn.dataset.quantity);
        
        newBtn.disabled = true;
        try {
          const response = await updateCartQuantity(line, quantity);
          if (!response.ok) {
            throw new Error('Failed to update cart');
          }
          await refreshCartDrawer();
        } catch (error) {
          console.error('Error updating cart quantity:', error);
          alert('שגיאה בעדכון הכמות. נסה שוב.');
        } finally {
          newBtn.disabled = false;
        }
      });
    });

    // Remove buttons
    const removeButtons = document.querySelectorAll('.item-remove');
    removeButtons.forEach(btn => {
      // Remove existing listeners by cloning
      const newBtn = btn.cloneNode(true);
      btn.parentNode.replaceChild(newBtn, btn);
      
      newBtn.addEventListener('click', async (e) => {
        e.preventDefault();
        e.stopPropagation();
        
        const line = parseInt(newBtn.dataset.line);
        
        newBtn.disabled = true;
        try {
          const response = await updateCartQuantity(line, 0);
          if (!response.ok) {
            throw new Error('Failed to remove item');
          }
          await refreshCartDrawer();
        } catch (error) {
          console.error('Error removing cart item:', error);
          alert('שגיאה בהסרת הפריט. נסה שוב.');
        } finally {
          newBtn.disabled = false;
        }
      });
    });
  }

  // Initialize quantity buttons when drawer opens
  if (cartDrawer) {
    let isInitializing = false;
    let initTimeout = null;
    
    // Use MutationObserver to detect when drawer content changes (but not from our own updates)
    const observer = new MutationObserver((mutations) => {
      // Skip if we're currently refreshing or initializing
      if (isRefreshing || isInitializing) return;
      
      // Only initialize if drawer is open and changes are from user interaction
      if (cartDrawer.classList.contains('open')) {
        // Debounce initialization to prevent loops
        clearTimeout(initTimeout);
        initTimeout = setTimeout(() => {
          if (!isRefreshing && !isInitializing) {
            isInitializing = true;
            initCartQuantityButtons();
            setTimeout(() => { isInitializing = false; }, 200);
          }
        }, 500);
      }
    });

    observer.observe(cartDrawer, {
      childList: true,
      subtree: true,
      attributes: false // Don't watch attribute changes
    });

    // Also initialize on initial load (with delay)
    setTimeout(() => {
      if (!isRefreshing) {
        initCartQuantityButtons();
      }
    }, 200);
  }
});

/*-----*/

document.addEventListener('DOMContentLoaded', () => {
  console.log('TZ Mega Menu Loaded'); // Debug check

  const triggers = document.querySelectorAll('[data-tz-index]');
  const header = document.querySelector('.section-header');

  function closeAll() {
    document.querySelectorAll('.tz-mega-menu').forEach((el) => {
      el.classList.remove('is-active');
    });
  }

  triggers.forEach((trigger) => {
    trigger.addEventListener('mouseenter', () => {
      const index = trigger.getAttribute('data-tz-index');
      console.log('Hovering Index:', index); // Debug check

      const menu = document.getElementById(`mega-menu-${index}`);

      // Close others first
      closeAll();

      if (menu) {
        console.log('Opening Menu:', index); // Debug check
        menu.classList.add('is-active');
      } else {
        console.log('No menu found for Index:', index);
      }
    });
  });

  if (header) {
    header.addEventListener('mouseleave', closeAll);
  }
});

/* =========================================================
   TZ PRODUCT PAGE - JavaScript Interactions
   RTL-First Theme
   ========================================================= */

document.addEventListener('DOMContentLoaded', () => {
  // Product Gallery - Thumbnail Navigation (RTL-aware)
  const thumbnails = document.querySelectorAll('.tz-product-thumbnail');
  const mainImage = document.getElementById('tz-product-main-img');
  
  if (thumbnails.length > 0 && mainImage) {
    thumbnails.forEach(thumb => {
      thumb.addEventListener('click', (e) => {
        e.preventDefault();
        const mediaIndex = thumb.dataset.mediaIndex;
        const thumbnailImg = thumb.querySelector('img');
        
        if (thumbnailImg && mainImage) {
          // Get full-size image URL from thumbnail
          const thumbnailSrc = thumbnailImg.src;
          const fullSizeSrc = thumbnailSrc.replace(/width=\d+/, 'width=1200');
          
          mainImage.src = fullSizeSrc;
          mainImage.alt = thumbnailImg.alt;
          
          // Update active state
          thumbnails.forEach(t => t.classList.remove('is-active'));
          thumb.classList.add('is-active');
        }
      });
    });
  }

  // Variant Selection
  const productInfo = document.querySelector('product-info');
  if (productInfo) {
    const productId = productInfo.dataset.productId;
    const form = productInfo.querySelector('.tz-product-form');
    const variantInput = form ? form.querySelector('input[name="id"]') : null;
    
    // Handle form submission - open cart drawer instead of redirecting
    if (form) {
      form.addEventListener('submit', async (e) => {
        e.preventDefault();
        e.stopPropagation();
        
        const buyButton = form.querySelector('.tz-product-buy-button');
        if (buyButton && buyButton.disabled) return;
        
        // Store original button state
        const originalText = buyButton ? buyButton.textContent : '';
        const originalHTML = buyButton ? buyButton.innerHTML : '';
        
        // Show loader and disable button during submission
        if (buyButton) {
          buyButton.disabled = true;
          buyButton.classList.add('is-loading');
          buyButton.innerHTML = '<span class="tz-loader"></span><span class="tz-button-text">' + (buyButton.dataset.addToCartText ? buyButton.dataset.addToCartText.replace('הוספה', 'מוסיף') : 'מוסיף לסל...') + '</span>';
        }
        
        // Get form data
        const formData = new FormData(form);
        
        try {
          // Submit to cart
          const response = await fetch('/cart/add.js', {
            method: 'POST',
            body: formData
          });
          
          // Check if response is ok
          if (!response.ok) {
            const errorText = await response.text();
            console.error('Cart add error:', errorText);
            throw new Error('Failed to add to cart: ' + errorText);
          }
          
          // Parse response to check for errors
          const result = await response.json();
          if (result.errors) {
            console.error('Cart add errors:', result.errors);
            throw new Error(result.errors || 'Failed to add to cart');
          }
          
          // Remove loader and restore button state
          if (buyButton) {
            buyButton.classList.remove('is-loading');
            buyButton.innerHTML = originalHTML;
            buyButton.disabled = false;
          }
          
          // Refresh cart drawer first, then open it
          if (typeof window.refreshCartDrawer === 'function') {
            await window.refreshCartDrawer();
          } else {
            // Fallback: reload page if function not available
            console.warn('refreshCartDrawer not available, reloading page');
            window.location.reload();
            return;
          }
          
          // Open cart drawer after refresh
          const cartDrawer = document.getElementById('cartDrawer');
          const cartOverlay = document.getElementById('cartOverlay');
          if (cartDrawer && cartOverlay) {
            cartDrawer.classList.add('open');
            cartOverlay.classList.add('open');
            document.body.style.overflow = 'hidden';
          }
        } catch (error) {
          console.error('Error adding to cart:', error);
          alert('שגיאה בהוספה לעגלה. נסה שוב.');
          
          // Re-enable button and restore original state on error
          if (buyButton) {
            buyButton.disabled = false;
            buyButton.classList.remove('is-loading');
            buyButton.innerHTML = originalHTML;
          }
        }
      });
    }
    const updateUrl = productInfo.dataset.updateUrl === 'true';
    const productUrl = productInfo.dataset.url;
    
    // Get product variants data from JSON script tag if available
    let productData = null;
    const variantDataScript = productInfo.querySelector('script[type="application/json"][data-product-json]');
    if (variantDataScript) {
      try {
        productData = JSON.parse(variantDataScript.textContent);
      } catch (e) {
        console.error('Error parsing product data:', e);
      }
    }
    
    // Collect selected options and find matching variant
    function getSelectedOptions() {
      const options = [];
      const variantOptions = productInfo.querySelectorAll('.tz-variant-option');
      
      variantOptions.forEach((optionEl, index) => {
        const activeButton = optionEl.querySelector('.is-active');
        if (activeButton) {
          options.push(activeButton.dataset.value);
        } else {
          // Fallback to first available option
          const firstButton = optionEl.querySelector('[data-option-index]');
          if (firstButton) {
            options.push(firstButton.dataset.value);
          }
        }
      });
      
      return options;
    }
    
    function findVariant(options) {
      if (!productData || !productData.variants) return null;
      
      return productData.variants.find(variant => {
        return variant.options.length === options.length &&
               variant.options.every((opt, idx) => opt === options[idx]);
      });
    }
    
    function updateVariant(variant) {
      if (!variant || !variantInput) return;
      
      // Update hidden input
      variantInput.value = variant.id;
      
      // Update price and image via AJAX if updateUrl is enabled
      if (updateUrl && productUrl) {
        const url = new URL(productUrl, window.location.origin);
        url.searchParams.set('variant', variant.id);
        url.searchParams.set('view', 'json');
        
        fetch(url)
          .then(response => response.json())
          .then(html => {
            const parser = new DOMParser();
            const doc = parser.parseFromString(html, 'text/html');
            
            // Update price
            const newPriceContainer = doc.querySelector('.tz-product-price');
            if (newPriceContainer) {
              const currentPriceContainer = productInfo.querySelector('.tz-product-price');
              if (currentPriceContainer) {
                currentPriceContainer.innerHTML = newPriceContainer.innerHTML;
              }
            }
            
            // Update main image
            const newMainImage = doc.querySelector('#tz-product-main-img');
            const mainImage = productInfo.querySelector('#tz-product-main-img');
            if (newMainImage && mainImage) {
              mainImage.src = newMainImage.src;
              mainImage.alt = newMainImage.alt || mainImage.alt;
              
              // Update active thumbnail based on variant's featured media
              if (variant.featured_media && variant.featured_media.id) {
                updateActiveThumbnail(variant.featured_media.id);
              }
            }
          })
          .catch(err => {
            console.error('Error updating product info:', err);
            // Fallback: update price manually
            updatePriceManually(variant);
            // Try to update image from thumbnails
            updateImageFromThumbnails(variant);
          });
      } else {
        updatePriceManually(variant);
        updateImageFromThumbnails(variant);
      }
      
      function updateImageFromThumbnails(variant) {
        if (!variant.featured_media || !variant.featured_media.id) return;
        
        const mainImage = productInfo.querySelector('#tz-product-main-img');
        const thumbnails = productInfo.querySelectorAll('.tz-product-thumbnail');
        
        thumbnails.forEach(thumb => {
          if (parseInt(thumb.dataset.mediaId) === variant.featured_media.id) {
            const thumbImg = thumb.querySelector('img');
            if (thumbImg && mainImage) {
              // Get full-size image URL from thumbnail
              const thumbnailSrc = thumbImg.src;
              const fullSizeSrc = thumbnailSrc.replace(/width=\d+/, 'width=1200');
              mainImage.src = fullSizeSrc;
              mainImage.alt = thumbImg.alt || mainImage.alt;
              
              // Update active thumbnail
              updateActiveThumbnail(variant.featured_media.id);
            }
          }
        });
      }
      
      function updateActiveThumbnail(mediaId) {
        const thumbnails = productInfo.querySelectorAll('.tz-product-thumbnail');
        thumbnails.forEach(thumb => {
          thumb.classList.remove('is-active');
          if (parseInt(thumb.dataset.mediaId) === mediaId) {
            thumb.classList.add('is-active');
          }
        });
      }
      
      function updatePriceManually(variant) {
        const priceContainer = productInfo.querySelector('.tz-product-price');
        if (priceContainer && variant.price !== undefined) {
          // Try to find existing price elements
          const regularPrice = priceContainer.querySelector('.price-item--regular:not(s)');
          const salePrice = priceContainer.querySelector('.price-item--sale, .price-item--last');
          
          if (variant.compare_at_price && variant.compare_at_price > variant.price) {
            // Sale price
            if (salePrice) {
              salePrice.textContent = formatMoney(variant.price);
            }
            const comparePrice = priceContainer.querySelector('s.price-item--regular');
            if (comparePrice) {
              comparePrice.textContent = formatMoney(variant.compare_at_price);
            }
          } else {
            // Regular price
            if (regularPrice) {
              regularPrice.textContent = formatMoney(variant.price);
            }
          }
        }
      }
      
      function formatMoney(cents) {
        // Use Shopify's money formatter if available
        if (typeof Shopify !== 'undefined' && typeof Shopify.formatMoney === 'function') {
          return Shopify.formatMoney(cents, window.Shopify?.money_format || '{{amount}}');
        }
        // Fallback: Use cart currency if available
        if (typeof window.Shopify !== 'undefined' && window.Shopify.currency) {
          const currency = window.Shopify.currency.active || 'ILS';
          const locale = document.documentElement.lang || 'he-IL';
          return new Intl.NumberFormat(locale, {
            style: 'currency',
            currency: currency,
            minimumFractionDigits: 0,
            maximumFractionDigits: 0
          }).format(cents / 100);
        }
        // Final fallback
        return new Intl.NumberFormat('he-IL', {
          style: 'currency',
          currency: 'ILS',
          minimumFractionDigits: 0,
          maximumFractionDigits: 0
        }).format(cents / 100);
      }
      
      // Update buy button
      const buyButton = form ? form.querySelector('.tz-product-buy-button') : null;
      if (buyButton) {
        if (variant.available) {
          buyButton.disabled = false;
          buyButton.textContent = buyButton.dataset.addToCartText || 'הוספה לסל';
        } else {
          buyButton.disabled = true;
          buyButton.textContent = buyButton.dataset.soldOutText || 'אזל מהמלאי';
        }
      }
      
      // Update URL if needed
      if (updateUrl && variant.id) {
        const url = new URL(window.location);
        url.searchParams.set('variant', variant.id);
        window.history.replaceState({}, '', url);
      }
      
      // Trigger variant change event
      const event = new CustomEvent('variant:change', {
        detail: { variant }
      });
      productInfo.dispatchEvent(event);
    }
    
    // Color button selection
    const colorButtons = productInfo.querySelectorAll('.tz-color-button');
    colorButtons.forEach(button => {
      button.addEventListener('click', (e) => {
        e.preventDefault();
        const optionIndex = parseInt(button.dataset.optionIndex);
        const value = button.dataset.value;
        
        // Update active state for this option
        const optionEl = button.closest('.tz-variant-option');
        if (optionEl) {
          optionEl.querySelectorAll('[data-option-index]').forEach(el => {
            el.classList.remove('is-active');
          });
          button.classList.add('is-active');
          
          // Update selected value display
          const label = optionEl.querySelector('.tz-variant-selected');
          if (label) label.textContent = value;
        }
        
        // Find and update variant
        const selectedOptions = getSelectedOptions();
        const variant = findVariant(selectedOptions);
        if (variant) {
          updateVariant(variant);
        }
      });
    });
    
    // Size/option button selection
    const sizeButtons = productInfo.querySelectorAll('.tz-size-button');
    sizeButtons.forEach(button => {
      button.addEventListener('click', (e) => {
        e.preventDefault();
        if (button.disabled || button.classList.contains('is-disabled')) return;
        
        const optionIndex = parseInt(button.dataset.optionIndex);
        const value = button.dataset.value;
        
        // Update active state for this option
        const optionEl = button.closest('.tz-variant-option');
        if (optionEl) {
          optionEl.querySelectorAll('[data-option-index]').forEach(el => {
            el.classList.remove('is-active');
          });
          button.classList.add('is-active');
          
          // Update selected value display
          const label = optionEl.querySelector('.tz-variant-selected');
          if (label) label.textContent = value;
        }
        
        // Find and update variant
        const selectedOptions = getSelectedOptions();
        const variant = findVariant(selectedOptions);
        if (variant) {
          updateVariant(variant);
        }
      });
    });
    
    // Quantity Selector
    const quantityField = productInfo.querySelector('.tz-quantity-field');
    const quantityMinus = productInfo.querySelector('.tz-quantity-minus');
    const quantityPlus = productInfo.querySelector('.tz-quantity-plus');
    
    if (quantityField && quantityMinus && quantityPlus) {
      // Prevent double-firing by checking if already initialized
      if (quantityField.dataset.initialized) return;
      quantityField.dataset.initialized = 'true';
      
      quantityMinus.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        const currentValue = parseInt(quantityField.value) || 1;
        if (currentValue > 1) {
          quantityField.value = currentValue - 1;
          quantityField.dispatchEvent(new Event('change', { bubbles: true }));
        }
      });
      
      quantityPlus.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        const currentValue = parseInt(quantityField.value) || 1;
        quantityField.value = currentValue + 1;
        quantityField.dispatchEvent(new Event('change', { bubbles: true }));
      });
      
      quantityField.addEventListener('change', () => {
        const value = parseInt(quantityField.value);
        if (isNaN(value) || value < 1) {
          quantityField.value = 1;
        }
      });
    }
  }

  // Product Accordion - Material Icons Toggle
  const accordions = document.querySelectorAll('.tz-accordion-item');
  accordions.forEach(details => {
    details.addEventListener('toggle', () => {
      const icon = details.querySelector('.tz-accordion-icon');
      if (icon) {
        // Icon rotation is handled by CSS, but we can add additional logic here if needed
      }
    });
  });

  // Wishlist Button (localStorage-based)
  const wishlistButtons = document.querySelectorAll('.tz-product-wishlist');
  wishlistButtons.forEach(button => {
    const productId = button.dataset.productId;
    if (!productId) return;

    let wishlist = JSON.parse(localStorage.getItem('tz-wishlist') || '[]');
    const icon = button.querySelector('.material-icons-outlined');
    
    if (wishlist.includes(productId)) {
      button.classList.add('is-active');
      if (icon) icon.textContent = 'favorite';
    }

    button.addEventListener('click', () => {
      wishlist = JSON.parse(localStorage.getItem('tz-wishlist') || '[]');
      
      if (wishlist.includes(productId)) {
        wishlist = wishlist.filter(id => id !== productId);
        button.classList.remove('is-active');
        if (icon) icon.textContent = 'favorite_border';
      } else {
        wishlist.push(productId);
        button.classList.add('is-active');
        if (icon) icon.textContent = 'favorite';
      }
      
      localStorage.setItem('tz-wishlist', JSON.stringify(wishlist));
    });
  });

  // Service Icons - Keyboard Navigation (RTL-aware)
  const serviceIcons = document.querySelectorAll('.tz-product-service-icon');
  serviceIcons.forEach((icon, index) => {
    icon.setAttribute('tabindex', '0');
    icon.setAttribute('role', 'button');
    
    icon.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        icon.click();
      } else if (e.key === 'ArrowRight') {
        e.preventDefault();
        const nextIndex = (index + 1) % serviceIcons.length;
        serviceIcons[nextIndex].focus();
      } else if (e.key === 'ArrowLeft') {
        e.preventDefault();
        const prevIndex = (index - 1 + serviceIcons.length) % serviceIcons.length;
        serviceIcons[prevIndex].focus();
      }
    });
  });

  // Gallery Zoom & Share Buttons
  const zoomButton = document.querySelector('.tz-product-zoom-button');
  const shareButton = document.querySelector('.tz-product-share-button');
  
  if (zoomButton && mainImage) {
    zoomButton.addEventListener('click', () => {
      // Open lightbox or zoom functionality
      console.log('Zoom:', mainImage.src);
      // TODO: Implement lightbox functionality
      window.open(mainImage.src, '_blank');
    });
  }

  if (shareButton) {
    shareButton.addEventListener('click', () => {
      if (navigator.share) {
        navigator.share({
          title: document.title,
          text: 'Check out this product!',
          url: window.location.href,
        }).catch(console.error);
      } else {
        // Fallback: copy to clipboard
        if (navigator.clipboard) {
          navigator.clipboard.writeText(window.location.href).then(() => {
            console.log('Link copied to clipboard');
            // Show toast notification
            alert('Link copied to clipboard!');
          });
        }
      }
    });
  }
});
