document.addEventListener('DOMContentLoaded', () => {
  // Mobile Menu Toggle logic
  const initMobileMenu = () => {
    const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
    const mobileMenuDrawer = document.getElementById('mobile-menu-drawer');
    const mobileMenuOverlay = document.querySelector('.mobile-menu-overlay');
    const mobileMenuClose = document.querySelector('.mobile-menu-close');
    
    if (mobileMenuToggle && mobileMenuDrawer) {
      const toggleMenu = (forceClose = false) => {
        const isOpen = forceClose ? true : mobileMenuToggle.getAttribute('aria-expanded') === 'true';
        const newState = !isOpen;
        
        mobileMenuToggle.setAttribute('aria-expanded', newState ? 'true' : 'false');
        mobileMenuDrawer.classList.toggle('is-open', newState);
        if (mobileMenuOverlay) {
          mobileMenuOverlay.classList.toggle('is-visible', newState);
        }
        document.body.style.overflow = newState ? 'hidden' : '';
      };

      mobileMenuToggle.addEventListener('click', (e) => {
        e.preventDefault();
        toggleMenu();
      });
      
      if (mobileMenuClose) {
        mobileMenuClose.addEventListener('click', (e) => {
          e.preventDefault();
          toggleMenu(true);
        });
      }
      
      if (mobileMenuOverlay) {
        mobileMenuOverlay.addEventListener('click', () => {
          toggleMenu(true);
        });
      }
    }
  };

  initMobileMenu();

  // Dark Mode Dropdown
  const initDarkMode = () => {
    const dropdownTrigger = document.querySelector('.dark-mode-dropdown-trigger');
    const dropdownMenu = document.querySelector('.dark-mode-dropdown-menu');
    const themeOptions = document.querySelectorAll('.dark-mode-option');
    const htmlElement = document.documentElement;

    if (dropdownTrigger && dropdownMenu) {
      // Toggle dropdown menu
      dropdownTrigger.addEventListener('click', (e) => {
        e.preventDefault();
        const isExpanded = dropdownTrigger.getAttribute('aria-expanded') === 'true';
        dropdownTrigger.setAttribute('aria-expanded', !isExpanded);
        dropdownMenu.hidden = isExpanded;

        // Update arrow rotation
        const arrow = dropdownTrigger.querySelector('.dropdown-arrow');
        if (arrow) {
          arrow.style.transform = isExpanded ? 'rotate(0deg)' : 'rotate(180deg)';
        }
      });

      // Close dropdown when clicking outside
      document.addEventListener('click', (e) => {
        if (!dropdownTrigger.contains(e.target) && !dropdownMenu.contains(e.target)) {
          dropdownTrigger.setAttribute('aria-expanded', 'false');
          dropdownMenu.hidden = true;
          const arrow = dropdownTrigger.querySelector('.dropdown-arrow');
          if (arrow) {
            arrow.style.transform = 'rotate(0deg)';
          }
        }
      });

      // Handle theme option clicks
      themeOptions.forEach(option => {
        option.addEventListener('click', (e) => {
          e.preventDefault();
          const theme = option.dataset.theme;

          // Remove active class from all options
          themeOptions.forEach(opt => opt.classList.remove('active'));
          // Add active class to clicked option
          option.classList.add('active');

          // Apply theme
          applyTheme(theme);

          // Close dropdown
          dropdownTrigger.setAttribute('aria-expanded', 'false');
          dropdownMenu.hidden = true;
          const arrow = dropdownTrigger.querySelector('.dropdown-arrow');
          if (arrow) {
            arrow.style.transform = 'rotate(0deg)';
          }
        });
      });
    }

    // Apply theme function
    const applyTheme = (theme) => {
      // Remove existing theme classes
      document.body.classList.remove('dark', 'light');
      htmlElement.classList.remove('dark', 'light');

      // Remove any existing inline styles
      const existingStyle = document.getElementById('theme-inline-styles');
      if (existingStyle) {
        existingStyle.remove();
      }

      if (theme === 'dark') {
        document.body.classList.add('dark');
        htmlElement.classList.add('dark');
        localStorage.setItem('darkMode', 'dark');

        // Add inline styles to ensure dark mode takes effect
        const style = document.createElement('style');
        style.id = 'theme-inline-styles';
        style.textContent = `
          body, html { background-color: #121212 !important; color: #EDEDED !important; }
          h1, h2, h3, h4, h5, h6, p, span, div, li, td, th, a, label {
            color: #EDEDED !important;
          }
          /* Don't override button colors, badges, dropdown elements, and white text elements */
          button, .tz-btn, .tz-btn * {
            color: inherit !important;
          }
          .tz-submit-btn {
            color: #ffffff !important;
          }
          .tz-address-default-badge {
            color: #ffffff !important;
          }
          .cart-promo {
            color: var(--color-white, #ffffff) !important;
          }
          .sale-badge {
            color: white !important;
          }
          .tz-cart-toast--success,
          .tz-cart-toast--error,
          .tz-cart-toast--info {
            color: white !important;
          }
          .dark-mode-dropdown-trigger, .dark-mode-dropdown-menu, .dark-mode-option {
            color: inherit !important;
          }
          a { color: #CCCCCC !important; }
          a:hover { color: #EDEDED !important; }
          /* Form inputs need dark backgrounds in dark mode */
          input, textarea, select,
          .tz-form-input, .tz-form-textarea, .tz-form-select {
            background-color: #1e1e1e !important;
            border-color: #333333 !important;
            color: #EDEDED !important;
          }
          input:focus, textarea:focus, select:focus,
          .tz-form-input:focus, .tz-form-textarea:focus, .tz-form-select:focus {
            border-color: #555555 !important;
          }
          /* Labels and form text */
          label, .tz-form-label {
            color: #EDEDED !important;
          }
        `;
        document.head.appendChild(style);
      } else if (theme === 'light') {
        document.body.classList.add('light');
        htmlElement.classList.add('light');
        localStorage.setItem('darkMode', 'light');

        // Add inline styles to ensure light mode takes effect
        const style = document.createElement('style');
        style.id = 'theme-inline-styles';
        style.textContent = `
          body, html { background-color: #ffffff !important; color: #111111 !important; }
          h1, h2, h3, h4, h5, h6, p, span, div, li, td, th, a, label {
            color: #111111 !important;
          }
          /* Don't override button colors, badges, and dropdown elements */
          button, .tz-btn, .tz-btn * {
            color: inherit !important;
          }
          .tz-submit-btn {
            color: #ffffff !important;
          }
          .tz-address-default-badge {
            color: #ffffff !important;
          }
          .dark-mode-dropdown-trigger, .dark-mode-dropdown-menu, .dark-mode-option {
            color: inherit !important;
          }
          a { color: #333333 !important; }
          a:hover { color: #000000 !important; }
          /* Form inputs need light backgrounds in light mode */
          input, textarea, select,
          .tz-form-input, .tz-form-textarea, .tz-form-select {
            background-color: #ffffff !important;
            border-color: #cccccc !important;
            color: #111111 !important;
          }
          input:focus, textarea:focus, select:focus,
          .tz-form-input:focus, .tz-form-textarea:focus, .tz-form-select:focus {
            border-color: #999999 !important;
          }
          /* Labels and form text */
          label, .tz-form-label {
            color: #111111 !important;
          }
        `;
        document.head.appendChild(style);
      } else if (theme === 'auto') {
        // Auto mode - use system preference
        const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        document.body.classList.add(prefersDark ? 'dark' : 'light');
        htmlElement.classList.add(prefersDark ? 'dark' : 'light');
        localStorage.setItem('darkMode', 'auto');

        // Apply the appropriate inline styles
        if (prefersDark) {
          const style = document.createElement('style');
          style.id = 'theme-inline-styles';
          style.textContent = `
            body, html { background-color: #121212 !important; color: #EDEDED !important; }
            h1, h2, h3, h4, h5, h6, p, span, div, li, td, th, a, label {
              color: #EDEDED !important;
            }
          /* Don't override button colors, badges, dropdown elements, and white text elements */
          button, .tz-btn, .tz-btn * {
            color: inherit !important;
          }
          .tz-submit-btn {
            color: #ffffff !important;
          }
          .tz-address-default-badge {
            color: #ffffff !important;
          }
          .cart-promo {
            color: var(--color-white, #ffffff) !important;
          }
          .sale-badge {
            color: white !important;
          }
          .tz-cart-toast--success,
          .tz-cart-toast--error,
          .tz-cart-toast--info {
            color: white !important;
          }
          .dark-mode-dropdown-trigger, .dark-mode-dropdown-menu, .dark-mode-option {
            color: inherit !important;
          }
            a { color: #CCCCCC !important; }
            a:hover { color: #EDEDED !important; }
            /* Form inputs need dark backgrounds in dark mode */
            input, textarea, select,
            .tz-form-input, .tz-form-textarea, .tz-form-select {
              background-color: #1e1e1e !important;
              border-color: #333333 !important;
              color: #EDEDED !important;
            }
            input:focus, textarea:focus, select:focus,
            .tz-form-input:focus, .tz-form-textarea:focus, .tz-form-select:focus {
              border-color: #555555 !important;
            }
            /* Labels and form text */
            label, .tz-form-label {
              color: #EDEDED !important;
            }
          `;
          document.head.appendChild(style);
        } else {
          const style = document.createElement('style');
          style.id = 'theme-inline-styles';
          style.textContent = `
            body, html { background-color: #ffffff !important; color: #111111 !important; }
            h1, h2, h3, h4, h5, h6, p, span, div, li, td, th, a, label {
              color: #111111 !important;
            }
          /* Don't override button colors, badges, dropdown elements, and white text elements */
          button, .tz-btn, .tz-btn * {
            color: inherit !important;
          }
          .tz-submit-btn {
            color: #ffffff !important;
          }
          .tz-address-default-badge {
            color: #ffffff !important;
          }
          .cart-promo {
            color: var(--color-white, #ffffff) !important;
          }
          .sale-badge {
            color: white !important;
          }
          .tz-cart-toast--success,
          .tz-cart-toast--error,
          .tz-cart-toast--info {
            color: white !important;
          }
          .dark-mode-dropdown-trigger, .dark-mode-dropdown-menu, .dark-mode-option {
            color: inherit !important;
          }
            a { color: #333333 !important; }
            a:hover { color: #000000 !important; }
            /* Form inputs need light backgrounds in light mode */
            input, textarea, select,
            .tz-form-input, .tz-form-textarea, .tz-form-select {
              background-color: #ffffff !important;
              border-color: #cccccc !important;
              color: #111111 !important;
            }
            input:focus, textarea:focus, select:focus,
            .tz-form-input:focus, .tz-form-textarea:focus, .tz-form-select:focus {
              border-color: #999999 !important;
            }
            /* Labels and form text */
            label, .tz-form-label {
              color: #111111 !important;
            }
          `;
          document.head.appendChild(style);
        }
      }
    };

    // Initialize theme on page load
    const initializeTheme = () => {
      const savedMode = localStorage.getItem('darkMode') || 'light'; // Default to light
      let currentTheme = savedMode;

      if (savedMode === 'auto') {
        const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        currentTheme = prefersDark ? 'dark' : 'light';
      }

      applyTheme(savedMode);

      // Update active state in dropdown
      themeOptions.forEach(option => {
        option.classList.toggle('active', option.dataset.theme === savedMode);
      });

      // Listen for system theme changes when in auto mode
      if (savedMode === 'auto') {
        window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
          applyTheme('auto');
        });
      }
    };

    initializeTheme();
  };

  initDarkMode();

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
          // Clear the list and show empty message with translation if possible, 
          // but for now keeping it simple as JS doesn't have easy access to Liquid translations without help.
          // However, the issue mentioned cart-drawer, which usually refers to the Liquid file.
          // If this JS is used, we might need to handle it.
          cartItemsList.innerHTML = '<div style="padding: 30px; text-align:center;">' + (window.cartStrings ? window.cartStrings.empty : 'העגלה ריקה') + '</div>';
          
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

        // Update cart footer with view cart button
        const cartFooter = currentCartDrawer.querySelector('.cart-footer');
        if (cartFooter && cart.item_count > 0) {
          // Create or update view cart button
          let viewCartBtn = cartFooter.querySelector('.tz-cart-drawer-view-cart');
          if (!viewCartBtn) {
            viewCartBtn = document.createElement('a');
            viewCartBtn.className = 'tz-cart-drawer-view-cart';
            viewCartBtn.href = routes.cart_url;
            cartFooter.insertBefore(viewCartBtn, cartFooter.querySelector('.checkout-btn'));
          }
          // Update button text without count
          viewCartBtn.textContent = 'צפה בעגלה';
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

// Zoom Dialog Functionality
function openZoomDialog(imageSrc, imageAlt) {
  // Create zoom dialog if it doesn't exist
  let zoomDialog = document.getElementById('tz-zoom-dialog');
  if (!zoomDialog) {
    zoomDialog = document.createElement('div');
    zoomDialog.id = 'tz-zoom-dialog';
    zoomDialog.className = 'tz-zoom-dialog-overlay';
    zoomDialog.innerHTML = `
      <div class="tz-zoom-dialog">
        <button class="tz-zoom-dialog-close" aria-label="Close zoom">
          <span class="material-icons-outlined">close</span>
        </button>
        <div class="tz-zoom-dialog-content">
          <img src="" alt="" class="tz-zoom-dialog-image">
        </div>
      </div>
    `;
    document.body.appendChild(zoomDialog);

    // Close dialog when clicking overlay or close button
    zoomDialog.addEventListener('click', (e) => {
      if (e.target === zoomDialog || e.target.closest('.tz-zoom-dialog-close')) {
        closeZoomDialog();
      }
    });

    // Close on Escape key
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && zoomDialog.style.display === 'flex') {
        closeZoomDialog();
      }
    });
  }

  // Update image source and alt
  const dialogImage = zoomDialog.querySelector('.tz-zoom-dialog-image');
  dialogImage.src = imageSrc;
  dialogImage.alt = imageAlt;

  // Show dialog
  zoomDialog.style.display = 'flex';
  document.body.style.overflow = 'hidden';
}

function closeZoomDialog() {
  const zoomDialog = document.getElementById('tz-zoom-dialog');
  if (zoomDialog) {
    zoomDialog.style.display = 'none';
    document.body.style.overflow = '';
  }
}

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

          // Small delay to ensure DOM is updated
          await new Promise(resolve => setTimeout(resolve, 100));

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
    
    // Color swatch/button selection
    const colorButtons = productInfo.querySelectorAll('.tz-color-swatch, .tz-color-button');
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
    zoomButton.addEventListener('click', (e) => {
      e.preventDefault();
      openZoomDialog(mainImage.src, mainImage.alt || productTitle);
    });
  }

  if (shareButton) {
    shareButton.addEventListener('click', (e) => {
      e.preventDefault();
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

/**
 * TZ Main Search Component
 * Custom search functionality with RTL/LTR support
 */
class TZMainSearch extends HTMLElement {
  constructor() {
    super();

    // Elements
    this.form = this.querySelector('form');
    this.input = this.querySelector('input[type="search"]');
    this.resetButton = this.querySelector('.tz-search-reset');
    this.submitButton = this.querySelector('.tz-search-submit');
    this.predictiveSearch = this.querySelector('.tz-predictive-search');

    // State
    this.isRTL = document.documentElement.getAttribute('dir') === 'rtl';
    this.searchPerformed = false;

    // Bind methods
    this.handleInput = this.handleInput.bind(this);
    this.handleFocus = this.handleFocus.bind(this);
    this.handleReset = this.handleReset.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleKeydown = this.handleKeydown.bind(this);
    this.syncInputs = this.syncInputs.bind(this);

    this.init();
  }

  init() {
    if (!this.input) return;

    this.setupEventListeners();
    this.updateRTLAttributes();
    this.updateResetButtonVisibility();
  }

  setupEventListeners() {
    // Input events
    this.input.addEventListener('input', this.handleInput);
    this.input.addEventListener('focus', this.handleFocus);
    this.input.addEventListener('keydown', this.handleKeydown);

    // Form events
    if (this.form) {
      this.form.addEventListener('submit', this.handleSubmit);
      this.form.addEventListener('reset', this.handleReset);
    }

    // Button events
    if (this.resetButton) {
      this.resetButton.addEventListener('click', this.handleReset);
    }

    // Predictive search events
    if (this.predictiveSearch) {
      this.setupPredictiveSearch();
    }

    // Sync with other search inputs
    this.setupInputSync();
  }

  handleInput(event) {
    const value = event.target.value;
    this.updateResetButtonVisibility();
    this.syncInputs(value, event.target);

    // Trigger predictive search if enabled
    if (this.predictiveSearch && value.length > 2) {
      this.showPredictiveSearch();
    } else {
      this.hidePredictiveSearch();
    }
  }

  handleFocus(event) {
    // Scroll into view on mobile
    if (window.innerWidth < 750) {
      setTimeout(() => {
        this.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }, 300);
    }

    // Show predictive search if input has value
    if (this.input.value.length > 0) {
      this.showPredictiveSearch();
    }
  }

  handleReset(event) {
    event.preventDefault();
    this.input.value = '';
    this.input.focus();
    this.updateResetButtonVisibility();
    this.hidePredictiveSearch();
    this.syncInputs('', this.input);
  }

  handleSubmit(event) {
    const query = this.input.value.trim();

    if (!query) {
      event.preventDefault();
      this.input.focus();
      return;
    }

    this.searchPerformed = true;
    this.updateUI();
  }

  handleKeydown(event) {
    // Escape key
    if (event.key === 'Escape') {
      this.hidePredictiveSearch();
      this.input.blur();
    }

    // Enter key
    if (event.key === 'Enter' && this.predictiveSearch && this.predictiveSearch.classList.contains('is-open')) {
      event.preventDefault();
      this.selectFirstResult();
    }

    // Arrow keys for predictive search navigation
    if (this.predictiveSearch && this.predictiveSearch.classList.contains('is-open')) {
      this.handlePredictiveNavigation(event);
    }
  }

  updateResetButtonVisibility() {
    if (!this.resetButton) return;

    const hasValue = this.input.value.length > 0;
    this.resetButton.classList.toggle('is-visible', hasValue);
  }

  updateRTLAttributes() {
    if (this.isRTL) {
      this.input.setAttribute('dir', 'rtl');
    }
  }

  setupInputSync() {
    // Find all search inputs on the page
    const allSearchInputs = document.querySelectorAll('input[type="search"]');

    if (allSearchInputs.length > 1) {
      allSearchInputs.forEach(input => {
        if (input !== this.input) {
          input.addEventListener('input', (event) => {
            this.syncInputs(event.target.value, event.target);
          });
        }
      });
    }
  }

  syncInputs(value, sourceInput) {
    const allSearchInputs = document.querySelectorAll('input[type="search"]');

    allSearchInputs.forEach(input => {
      if (input !== sourceInput) {
        input.value = value;
        // Trigger input event to update reset buttons
        input.dispatchEvent(new Event('input', { bubbles: true }));
      }
    });
  }

  setupPredictiveSearch() {
    // Close predictive search when clicking outside
    document.addEventListener('click', (event) => {
      if (!this.contains(event.target)) {
        this.hidePredictiveSearch();
      }
    });

    // Handle window resize
    window.addEventListener('resize', () => {
      if (this.predictiveSearch.classList.contains('is-open')) {
        this.updatePredictivePosition();
      }
    });
  }

  showPredictiveSearch() {
    if (!this.predictiveSearch) return;

    this.predictiveSearch.classList.add('is-open');
    this.updatePredictivePosition();
  }

  hidePredictiveSearch() {
    if (!this.predictiveSearch) return;

    this.predictiveSearch.classList.remove('is-open');
  }

  updatePredictivePosition() {
    if (!this.predictiveSearch) return;

    // Ensure predictive search doesn't go off-screen
    const rect = this.predictiveSearch.getBoundingClientRect();
    const viewportHeight = window.innerHeight;

    if (rect.bottom > viewportHeight) {
      this.predictiveSearch.style.maxHeight = `${viewportHeight - rect.top - 10}px`;
    }
  }

  selectFirstResult() {
    const firstResult = this.predictiveSearch.querySelector('a, button');
    if (firstResult) {
      firstResult.click();
    }
  }

  handlePredictiveNavigation(event) {
    const results = this.predictiveSearch.querySelectorAll('a, button');
    const currentFocus = document.activeElement;

    let currentIndex = -1;
    results.forEach((result, index) => {
      if (result === currentFocus) {
        currentIndex = index;
      }
    });

    if (event.key === 'ArrowDown') {
      event.preventDefault();
      const nextIndex = currentIndex < results.length - 1 ? currentIndex + 1 : 0;
      results[nextIndex].focus();
    } else if (event.key === 'ArrowUp') {
      event.preventDefault();
      const prevIndex = currentIndex > 0 ? currentIndex - 1 : results.length - 1;
      results[prevIndex].focus();
    }
  }

  updateUI() {
    // Update classes based on search state
    const container = this.closest('.tz-main-search');
    if (container) {
      container.classList.toggle('tz-main-search--empty', !this.searchPerformed);
    }
  }

  // Utility methods
  debounce(func, wait) {
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

  // Accessibility
  updateAriaAttributes() {
    if (this.predictiveSearch) {
      const isOpen = this.predictiveSearch.classList.contains('is-open');
      this.input.setAttribute('aria-expanded', isOpen);
      this.input.setAttribute('aria-controls', isOpen ? 'tz-predictive-search-results' : null);
    }
  }
}

// Register the custom element
if (!customElements.get('tz-main-search')) {
  customElements.define('tz-main-search', TZMainSearch);
}

// Export for potential use
window.TZMainSearch = TZMainSearch;

/**
 * TZ Header Search Dialog
 * Beautiful search modal with live search functionality
 */

class TZHeaderSearch {
  constructor() {
    this.searchButton = document.querySelector('.icon-btn[aria-label="Search"]');
    this.overlay = null;
    this.dialog = null;
    this.searchInput = null;
    this.resultsContainer = null;
    this.closeButton = null;
    this.currentQuery = '';
    this.searchTimeout = null;
    this.isRTL = document.documentElement.getAttribute('dir') === 'rtl';

    this.init();
  }

  init() {
    if (!this.searchButton) return;

    // Detect language from HTML lang attribute
    const htmlLang = document.documentElement.getAttribute('lang');

    // Set translations based on language
    if (htmlLang === 'he') {
      this.translations = {
        searching: 'מחפש...',
        noResults: 'לא נמצאו תוצאות',
        viewAll: 'צפה בכל התוצאות עבור',
        placeholder: 'חיפוש מוצרים...',
        emptyHint: 'התחל להקליד לחיפוש...',
        tryDifferentKeywords: 'נסה לחפש עם מילות מפתח שונות'
      };
    } else {
      this.translations = {
        searching: 'Searching...',
        noResults: 'No results found',
        viewAll: 'View all results for',
        placeholder: 'Search products...',
        emptyHint: 'Start typing to search...',
        tryDifferentKeywords: 'Try searching with different keywords'
      };
    }

    this.createDialog();
    this.bindEvents();
  }

  createDialog() {
    // Create overlay
    this.overlay = document.createElement('div');
    this.overlay.className = 'tz-search-dialog-overlay';
    this.overlay.innerHTML = `
      <div class="tz-search-dialog" role="dialog" aria-modal="true" aria-label="Search">
        <div class="tz-search-dialog-header">
          <form class="tz-search-form" role="search">
            <div class="tz-search-field">
              <input
                class="tz-search-input"
                type="search"
                placeholder="` + this.translations.placeholder + `"
                autocomplete="off"
                spellcheck="false"
              >
              <label class="tz-search-label">Search products</label>
              <button type="button" class="tz-search-reset hidden" aria-label="Clear search">
                <svg class="tz-search-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <line x1="18" y1="6" x2="6" y2="18"></line>
                  <line x1="6" y1="6" x2="18" y2="18"></line>
                </svg>
              </button>
              <button type="submit" class="tz-search-submit" aria-label="Search">
                <svg class="tz-search-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <circle cx="11" cy="11" r="8"></circle>
                  <path d="m21 21-4.35-4.35"></path>
                </svg>
              </button>
            </div>
          </form>
          <button class="tz-search-dialog-close" aria-label="Close search">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
        </div>
        <div class="tz-search-dialog-results"></div>
      </div>
    `;

    document.body.appendChild(this.overlay);

    // Get references to elements
    this.dialog = this.overlay.querySelector('.tz-search-dialog');
    this.searchInput = this.overlay.querySelector('.tz-search-input');
    this.resetButton = this.overlay.querySelector('.tz-search-reset');
    this.submitButton = this.overlay.querySelector('.tz-search-submit');
    this.closeButton = this.overlay.querySelector('.tz-search-dialog-close');
    this.resultsContainer = this.overlay.querySelector('.tz-search-dialog-results');
    this.form = this.overlay.querySelector('.tz-search-form');

    // Set translated empty state text
    this.resultsContainer.setAttribute('data-empty-hint', this.translations.emptyHint);

    // Set translated "try different keywords" text
    const emptyTextElement = this.resultsContainer.querySelector('.tz-search-result-empty-text');
    if (emptyTextElement) {
      emptyTextElement.setAttribute('data-try-different-keywords', this.translations.tryDifferentKeywords);
    }

    // Set RTL attributes if needed
    if (this.isRTL) {
      this.searchInput.setAttribute('dir', 'rtl');
      this.dialog.style.direction = 'rtl';
      this.resultsContainer.style.direction = 'rtl';
    }
  }

  bindEvents() {
    // Open dialog
    this.searchButton.addEventListener('click', (e) => {
      e.preventDefault();
      this.openDialog();
    });

    // Close dialog
    this.overlay.addEventListener('click', (e) => {
      if (e.target === this.overlay) {
        this.closeDialog();
      }
    });

    this.closeButton.addEventListener('click', () => {
      this.closeDialog();
    });

    // Keyboard events
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && this.overlay.classList.contains('is-open')) {
        this.closeDialog();
      }

      // Focus management
      if (e.key === '/' && !this.overlay.classList.contains('is-open') &&
          !['INPUT', 'TEXTAREA', 'SELECT'].includes(document.activeElement.tagName)) {
        e.preventDefault();
        this.openDialog();
      }
    });

    // Search input
    this.searchInput.addEventListener('input', this.debounce((e) => {
      this.handleSearch(e.target.value);
    }, 300));

    this.searchInput.addEventListener('focus', () => {
      this.updateResetButton();
    });

    // Reset button
    this.resetButton.addEventListener('click', () => {
      this.searchInput.value = '';
      this.searchInput.focus();
      this.clearResults();
      this.updateResetButton();
    });

    // Form submission
    this.form.addEventListener('submit', (e) => {
      e.preventDefault();
      const query = this.searchInput.value.trim();
      if (query) {
        this.performSearch(query);
      }
    });
  }

  openDialog() {
    this.overlay.classList.add('is-open');
    document.body.style.overflow = 'hidden';

    // Focus management
    setTimeout(() => {
      this.searchInput.focus();
    }, 100);
  }

  closeDialog() {
    this.overlay.classList.remove('is-open');
    document.body.style.overflow = '';

    // Clear search
    this.searchInput.value = '';
    this.clearResults();
    this.updateResetButton();
  }

  handleSearch(query) {
    this.currentQuery = query.trim();
    this.updateResetButton();

    if (this.currentQuery.length === 0) {
      this.clearResults();
      return;
    }

    if (this.currentQuery.length < 2) {
      this.showEmptyState();
      return;
    }

    this.showLoadingState();
    this.performSearch(this.currentQuery);
  }

  async performSearch(query) {
    try {
      // Use Shopify's search suggest API for predictive search
      const response = await fetch(`/search/suggest.json?q=${encodeURIComponent(query)}&resources[type]=product&resources[limit]=6&resources[options][unavailable_products]=hide`);
      const data = await response.json();

      if (data.resources && data.resources.results && data.resources.results.products && data.resources.results.products.length > 0) {
        this.displayResults(data.resources.results.products, query);
      } else {
        // Fallback to regular search if suggest doesn't return results
        await this.performFallbackSearch(query);
      }
    } catch (error) {
      console.error('Search error:', error);
      await this.performFallbackSearch(query);
    }
  }

  async performFallbackSearch(query) {
    try {
      // Fallback to regular search results
      const response = await fetch(`/search?view=json&q=${encodeURIComponent(query)}&type=product`);
      const data = await response.json();

      if (data.results && data.results.length > 0) {
        // Transform regular search results to match suggest format
        const products = data.results.slice(0, 6).map(item => ({
          title: item.title,
          url: item.url,
          featured_image: item.featured_image,
          price: item.price,
          compare_at_price: item.compare_at_price
        }));
        this.displayResults(products, query);
      } else {
        this.showNoResults();
      }
    } catch (error) {
      console.error('Fallback search error:', error);
      this.showNoResults();
    }
  }

  displayResults(products, query) {
    if (!products || products.length === 0) {
      this.showNoResults();
      return;
    }

    const resultsHtml = products.map(product => this.createProductHtml(product)).join('');

    const viewAllHtml = `
      <a href="/search?q=${encodeURIComponent(query)}" class="tz-search-view-all">
        ${this.translations.viewAll} "${query}"
      </a>
    `;

    this.resultsContainer.innerHTML = resultsHtml + viewAllHtml;
  }

  createProductHtml(product) {
    const imageUrl = product.featured_image ? product.featured_image.url : '';
    const title = product.title;
    const url = product.url;
    const price = product.price;
    const compareAtPrice = product.compare_at_price;
    const isOnSale = compareAtPrice && compareAtPrice > price;

    return `
      <a href="${url}" class="tz-search-result-item">
        ${imageUrl ? `<img src="${imageUrl}" alt="${title}" class="tz-search-result-image" loading="lazy">` : ''}
        <div class="tz-search-result-info">
          <h3 class="tz-search-result-title">${title}</h3>
          <div class="tz-search-result-price ${isOnSale ? 'tz-search-result-price--sale' : ''}">
            ${isOnSale ?
              `<span class="tz-search-result-price-current">${this.formatMoney(price)}</span>
               <span class="tz-search-result-price-original">${this.formatMoney(compareAtPrice)}</span>` :
              this.formatMoney(price)
            }
          </div>
        </div>
      </a>
    `;
  }

  formatMoney(amount) {
    // Handle both formatted strings and numeric amounts
    if (typeof amount === 'string') {
      return amount; // Already formatted
    }
    // For numeric amounts (cents), convert to dollars and format
    return `$${parseFloat(amount / 100).toFixed(2)}`;
  }

  showLoadingState() {
    this.resultsContainer.innerHTML = `
      <div class="tz-search-result-loading">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M21 12a9 9 0 1 1-6.219-8.56"/>
        </svg>
        ${this.translations.searching}
      </div>
    `;
  }

  showEmptyState() {
    this.resultsContainer.innerHTML = '';
  }

  showNoResults() {
    this.resultsContainer.innerHTML = `
      <div class="tz-search-result-empty">
        <h3 class="tz-search-result-empty-title">${this.translations.noResults}</h3>
        <p class="tz-search-result-empty-text" data-try-different-keywords></p>
      </div>
    `;
  }

  clearResults() {
    this.resultsContainer.innerHTML = '';
  }

  updateResetButton() {
    const hasValue = this.searchInput.value.length > 0;
    this.resetButton.classList.toggle('hidden', !hasValue);
  }

  debounce(func, wait) {
    return (...args) => {
      clearTimeout(this.searchTimeout);
      this.searchTimeout = setTimeout(() => func.apply(this, args), wait);
    };
  }
}

// Initialize header search when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  new TZHeaderSearch();
});

// Export for potential use
window.TZHeaderSearch = TZHeaderSearch;
