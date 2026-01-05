document.addEventListener('DOMContentLoaded', () => {
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
        // Basic formatting - Shopify theme should have a money formatter
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
