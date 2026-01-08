/**
 * TZ Main Cart - Fully Isolated Cart System
 * No dependencies on theme's default cart.js
 * Replicates all cart functionality using tz-* selectors
 */

(function() {
  'use strict';

  // Constants
  const ON_CHANGE_DEBOUNCE_TIMER = 300;
  const PUB_SUB_EVENTS = {
    cartUpdate: 'tz-cart-update',
    cartError: 'tz-cart-error',
  };

  // Utility: Debounce
  function debounce(fn, wait) {
    let t;
    return function(...args) {
      clearTimeout(t);
      t = setTimeout(() => fn.apply(this, args), wait);
    };
  }

  // Utility: Fetch Config
  function fetchConfig(type = 'json') {
    return {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Accept: `application/${type}` },
    };
  }

  // Utility: Pub/Sub System (isolated)
  const tzSubscribers = {};
  function subscribe(eventName, callback) {
    if (tzSubscribers[eventName] === undefined) {
      tzSubscribers[eventName] = [];
    }
    tzSubscribers[eventName] = [...tzSubscribers[eventName], callback];
    return function unsubscribe() {
      tzSubscribers[eventName] = tzSubscribers[eventName].filter((cb) => cb !== callback);
    };
  }
  function publish(eventName, data) {
    if (tzSubscribers[eventName]) {
      return Promise.all(tzSubscribers[eventName].map((callback) => callback(data)));
    }
    return Promise.resolve();
  }

  // Get routes (fallback to window.routes or construct from Shopify)
  const routes = window.routes || {
    cart_url: '/cart',
    cart_change_url: '/cart/change.js',
    cart_update_url: '/cart/update.js',
  };

  // Cart Remove Button Component
  class TZCartRemoveButton extends HTMLElement {
    constructor() {
      super();
      this.addEventListener('click', (event) => {
        event.preventDefault();
        const cartItems = this.closest('cart-items');
        if (cartItems && cartItems.updateQuantity) {
          cartItems.updateQuantity(this.dataset.index, 0, event);
        }
      });
    }
  }
  customElements.define('cart-remove-button', TZCartRemoveButton);

  // Main Cart Items Component
  class TZCartItems extends HTMLElement {
    constructor() {
      super();
      this.lineItemStatusElement = document.getElementById('shopping-cart-line-item-status');
      
      const debouncedOnChange = debounce((event) => {
        this.onChange(event);
      }, ON_CHANGE_DEBOUNCE_TIMER);

      this.addEventListener('change', debouncedOnChange.bind(this));
      this.addEventListener('click', this.onButtonClick.bind(this));
    }

    onButtonClick(event) {
      const button = event.target.closest('.tz-cart-quantity-button');
      if (!button) return;

      event.preventDefault();
      const inputWrapper = button.closest('.tz-cart-quantity-input-wrapper');
      if (!inputWrapper) return;

      const input = inputWrapper.querySelector('.tz-cart-quantity-input');
      if (!input || input.disabled) return;

      const previousValue = parseInt(input.value) || 0;
      const min = parseInt(input.dataset.min || input.min || 0);
      const max = input.max ? parseInt(input.max) : null;
      const step = parseInt(input.step || 1);

      if (button.name === 'plus' || button.classList.contains('tz-cart-quantity-button-plus')) {
        // Increment
        let newValue = previousValue + step;
        if (max !== null && newValue > max) {
          newValue = max;
        }
        input.value = newValue;
      } else if (button.name === 'minus' || button.classList.contains('tz-cart-quantity-button-minus')) {
        // Decrement
        let newValue = previousValue - step;
        if (newValue < min) {
          newValue = min;
        }
        input.value = newValue;
      }

      // Trigger change event to update cart
      if (previousValue !== parseInt(input.value)) {
        input.dispatchEvent(new Event('change', { bubbles: true }));
      }
    }

    cartUpdateUnsubscriber = undefined;

    connectedCallback() {
      // Hide all error elements on initialization
      this.querySelectorAll('.tz-cart-item-error').forEach((errorEl) => {
        const errorText = errorEl.querySelector('.tz-cart-item-error-text');
        if (errorText && !errorText.textContent.trim()) {
          errorEl.style.display = 'none';
          errorText.textContent = '';
        }
      });

      this.cartUpdateUnsubscriber = subscribe(PUB_SUB_EVENTS.cartUpdate, (event) => {
        if (event.source === 'tz-cart-items') {
          return;
        }
        return this.onCartUpdate();
      });
    }

    disconnectedCallback() {
      if (this.cartUpdateUnsubscriber) {
        this.cartUpdateUnsubscriber();
      }
    }

    resetQuantityInput(id) {
      const input = this.querySelector(`#Quantity-${id}`);
      if (input) {
        input.value = input.getAttribute('value') || input.value;
      }
      this.isEnterPressed = false;
    }

    setValidity(event, index, message) {
      if (event.target) {
        event.target.setCustomValidity(message);
        event.target.reportValidity();
        this.resetQuantityInput(index);
        event.target.select();
      }
    }

    validateQuantity(event) {
      const inputValue = parseInt(event.target.value);
      const index = event.target.dataset.index;
      let message = '';

      const min = parseInt(event.target.dataset.min || 0);
      const max = parseInt(event.target.max || 999999);
      const step = parseInt(event.target.step || 1);

      if (inputValue < min) {
        message = window.tzCartStrings?.min_error?.replace('[min]', min) || `Minimum quantity is ${min}`;
      } else if (inputValue > max) {
        message = window.tzCartStrings?.max_error?.replace('[max]', max) || `Maximum quantity is ${max}`;
      } else if (inputValue % step !== 0) {
        message = window.tzCartStrings?.step_error?.replace('[step]', step) || `Quantity must be in increments of ${step}`;
      }

      if (message) {
        this.setValidity(event, index, message);
      } else {
        event.target.setCustomValidity('');
        event.target.reportValidity();
        this.updateQuantity(
          index,
          inputValue,
          event,
          document.activeElement?.getAttribute('name') || 'updates[]',
          event.target.dataset.quantityVariantId
        );
      }
    }

    onChange(event) {
      if (event.target.classList.contains('tz-cart-quantity-input')) {
        this.validateQuantity(event);
      }
    }

    onCartUpdate() {
      return fetch(`${routes.cart_url}?section_id=main-cart-items`)
        .then((response) => response.text())
        .then((responseText) => {
          const html = new DOMParser().parseFromString(responseText, 'text/html');
          const sourceQty = html.querySelector('cart-items');
          if (sourceQty) {
            this.innerHTML = sourceQty.innerHTML;
            // Hide all error elements after update (they should only show when there's an actual error)
            this.querySelectorAll('.tz-cart-item-error').forEach((errorEl) => {
              const errorText = errorEl.querySelector('.tz-cart-item-error-text');
              if (errorText && !errorText.textContent.trim()) {
                errorEl.style.display = 'none';
              }
            });
          }
        })
        .catch((e) => {
          console.error('TZ Cart: Update error', e);
        });
    }

    getSectionsToRender() {
      const mainCartItems = document.getElementById('main-cart-items');
      const mainCartFooter = document.getElementById('main-cart-footer');
      
      const sections = [
        {
          id: 'main-cart-items',
          section: mainCartItems?.dataset?.id || 'main-cart-items',
          selector: '.tz-cart-js-contents',
        },
        {
          id: 'cart-live-region-text',
          section: 'cart-live-region-text',
          selector: '#cart-live-region-text',
        },
      ];

      if (mainCartFooter) {
        sections.push({
          id: 'main-cart-footer',
          section: mainCartFooter.dataset.id || 'main-cart-footer',
          selector: '.tz-cart-js-contents',
        });
      }

      return sections;
    }

    updateQuantity(line, quantity, event, name, variantId) {
      const eventTarget = event.currentTarget instanceof TZCartRemoveButton ? 'clear' : 'change';
      
      this.enableLoading(line);

      const body = JSON.stringify({
        line,
        quantity,
        sections: this.getSectionsToRender().map((section) => section.section),
        sections_url: window.location.pathname,
      });

      fetch(`${routes.cart_change_url}`, { ...fetchConfig(), ...{ body } })
        .then((response) => response.text())
        .then((state) => {
          const parsedState = JSON.parse(state);

          const quantityElement = document.getElementById(`Quantity-${line}`);
          const items = this.querySelectorAll('.tz-cart-item');

          if (parsedState.errors) {
            if (quantityElement) {
              quantityElement.value = quantityElement.getAttribute('value') || quantityElement.value;
            }
            // Show error message
            this.updateLiveRegions(line, parsedState.errors);
            return;
          } else {
            // Clear any previous errors on success
            this.updateLiveRegions(line, '');
          }

          this.classList.toggle('tz-cart-is-empty', parsedState.item_count === 0);
          const cartFooter = document.getElementById('main-cart-footer');
          if (cartFooter) {
            cartFooter.classList.toggle('tz-cart-is-empty', parsedState.item_count === 0);
          }

          this.getSectionsToRender().forEach((section) => {
            // For footer, preserve complementary products section
            if (section.id === 'main-cart-footer') {
              const footerElement = document.getElementById(section.id);
              if (footerElement) {
                // Store complementary products HTML before update
                const complementaryProducts = footerElement.querySelector('.tz-cart-complementary-products');
                const complementaryHTML = complementaryProducts ? complementaryProducts.outerHTML : null;
                
                // Update only the js-contents part
                const elementToReplace = footerElement.querySelector(section.selector);
                if (elementToReplace) {
                  elementToReplace.innerHTML = this.getSectionInnerHTML(
                    parsedState.sections[section.section],
                    section.selector
                  );
                  
                  // Restore complementary products if it was there
                  if (complementaryHTML && !footerElement.querySelector('.tz-cart-complementary-products')) {
                    // Insert after js-contents, before order notes
                    const jsContents = footerElement.querySelector('.tz-cart-js-contents');
                    const orderNotes = footerElement.querySelector('.tz-cart-note');
                    const insertPoint = orderNotes || jsContents?.nextSibling;
                    if (insertPoint && insertPoint.parentNode) {
                      const tempDiv = document.createElement('div');
                      tempDiv.innerHTML = complementaryHTML;
                      const complementarySection = tempDiv.firstElementChild;
                      if (complementarySection) {
                        insertPoint.parentNode.insertBefore(complementarySection, insertPoint);
                      }
                    }
                  }
                }
              }
            } else {
              // For other sections, update normally
              const elementToReplace = document.getElementById(section.id)?.querySelector(section.selector) || document.getElementById(section.id);
              if (elementToReplace) {
                elementToReplace.innerHTML = this.getSectionInnerHTML(
                  parsedState.sections[section.section],
                  section.selector
                );
              }
            }
          });

          const updatedValue = parsedState.items[line - 1] ? parsedState.items[line - 1].quantity : undefined;
          let message = '';
          if (items.length === parsedState.items.length && quantityElement && updatedValue !== parseInt(quantityElement.value)) {
            if (typeof updatedValue === 'undefined') {
              message = window.tzCartStrings?.error || window.cartStrings?.error || 'Error updating cart';
            } else {
              message = (window.tzCartStrings?.quantityError || window.cartStrings?.quantityError || 'Quantity updated to [quantity]').replace('[quantity]', updatedValue);
            }
          }
          this.updateLiveRegions(line, message || ''); // Clear error on success

          const lineItem = document.getElementById(`CartItem-${line}`);
          if (lineItem && name) {
            const focusElement = lineItem.querySelector(`[name="${name}"]`);
            if (focusElement) {
              focusElement.focus();
            }
          }
        })
        .catch(() => {
          this.querySelectorAll('.tz-cart-loading-spinner').forEach((overlay) => {
            overlay.classList.add('tz-cart-hidden');
          });
          const errors = document.getElementById('cart-errors');
          if (errors) {
            errors.textContent = window.tzCartStrings?.error || window.cartStrings?.error || 'Error updating cart';
          }
        })
        .finally(() => {
          this.disableLoading(line);
        });
    }

    updateLiveRegions(line, message) {
      const lineItemError = document.getElementById(`Line-item-error-${line}`);
      if (lineItemError) {
        const errorText = lineItemError.querySelector('.tz-cart-item-error-text');
        if (errorText) {
          if (message) {
            errorText.textContent = message;
            lineItemError.style.display = 'flex';
          } else {
            errorText.textContent = '';
            lineItemError.style.display = 'none';
          }
        }
      }

      if (this.lineItemStatusElement) {
        this.lineItemStatusElement.setAttribute('aria-hidden', 'true');
      }

      const cartStatus = document.getElementById('cart-live-region-text');
      if (cartStatus) {
        cartStatus.setAttribute('aria-hidden', 'false');
        setTimeout(() => {
          cartStatus.setAttribute('aria-hidden', 'true');
        }, 1000);
      }
    }

    getSectionInnerHTML(html, selector) {
      const parsed = new DOMParser().parseFromString(html, 'text/html');
      const element = parsed.querySelector(selector);
      return element ? element.innerHTML : '';
    }

    enableLoading(line) {
      const mainCartItems = document.getElementById('main-cart-items');
      if (mainCartItems) {
        mainCartItems.classList.add('tz-cart-items-disabled');
      }

      const cartItemElements = this.querySelectorAll(`#CartItem-${line} .tz-cart-loading-spinner`);
      cartItemElements.forEach((overlay) => overlay.classList.remove('tz-cart-hidden'));

      if (document.activeElement) {
        document.activeElement.blur();
      }
      if (this.lineItemStatusElement) {
        this.lineItemStatusElement.setAttribute('aria-hidden', 'false');
      }
    }

    disableLoading(line) {
      const mainCartItems = document.getElementById('main-cart-items');
      if (mainCartItems) {
        mainCartItems.classList.remove('tz-cart-items-disabled');
      }

      const cartItemElements = this.querySelectorAll(`#CartItem-${line} .tz-cart-loading-spinner`);
      cartItemElements.forEach((overlay) => overlay.classList.add('tz-cart-hidden'));
    }
  }

  // Register cart-items custom element
  if (!customElements.get('cart-items')) {
    customElements.define('cart-items', TZCartItems);
  }

  // Cart Note Component
  if (!customElements.get('cart-note')) {
    customElements.define(
      'cart-note',
      class TZCartNote extends HTMLElement {
        constructor() {
          super();
          this.addEventListener(
            'input',
            debounce((event) => {
              const body = JSON.stringify({ note: event.target.value });
              fetch(`${routes.cart_update_url}`, { ...fetchConfig(), ...{ body } }).catch((e) => {
                console.error('TZ Cart: Note update error', e);
              });
            }, ON_CHANGE_DEBOUNCE_TIMER)
          );
        }
      }
    );
  }

  // Initialize cart note toggle
  function initCartNoteToggle() {
    // Find all note buttons (could be in main cart or drawer)
    const noteButtons = document.querySelectorAll('.tz-cart-note-button');
    
    noteButtons.forEach(noteButton => {
      // Find the cart-note container (could be cart-note element itself or a div with tz-cart-note class)
      const noteContainer = noteButton.closest('.tz-cart-note') || noteButton.closest('cart-note');
      
      if (!noteContainer) return;
      
      // Check if noteContainer is a cart-note element itself (cart footer structure)
      const isCartNoteElement = noteContainer.tagName === 'CART-NOTE';
      
      // Find nested cart-note element (drawer structure) or use the textarea directly (cart footer structure)
      const nestedNoteElement = isCartNoteElement ? null : noteContainer.querySelector('cart-note');
      const noteTextarea = noteContainer.querySelector('.tz-cart-note-textarea');
      const iconElement = noteButton.querySelector('.material-icons-outlined');
      
      if (!noteTextarea) return;
      
      // Determine which element to toggle:
      // - If there's a nested cart-note element (drawer), toggle that
      // - Otherwise, toggle the textarea directly (cart footer)
      const elementToToggle = nestedNoteElement || noteTextarea;
      
      // Helper function to check if element is visible
      const isElementVisible = (el) => {
        if (!el) return false;
        const style = window.getComputedStyle(el);
        return style.display !== 'none' && style.visibility !== 'hidden';
      };
      
      // Check initial state
      const isInitiallyVisible = isElementVisible(elementToToggle);
      
      // Set initial icon state
      if (iconElement) {
        iconElement.textContent = isInitiallyVisible ? 'remove' : 'add';
        noteButton.setAttribute('aria-expanded', isInitiallyVisible ? 'true' : 'false');
      }
      
      noteButton.addEventListener('click', function(e) {
        e.preventDefault();
        
        // Determine current visibility state using computed styles
        const isCurrentlyVisible = isElementVisible(elementToToggle);
        
        // Toggle visibility
        if (nestedNoteElement) {
          // Drawer structure: toggle the nested cart-note element
          nestedNoteElement.style.display = isCurrentlyVisible ? 'none' : 'block';
        } else {
          // Cart footer structure: toggle the textarea directly
          noteTextarea.style.display = isCurrentlyVisible ? 'none' : 'block';
        }
        
        const newState = !isCurrentlyVisible;
        noteButton.setAttribute('aria-expanded', newState ? 'true' : 'false');
        
        // Toggle icon between add (+) and remove (-)
        if (iconElement) {
          iconElement.textContent = newState ? 'remove' : 'add';
        }
        
        if (newState) {
          // Focus textarea when opening
          setTimeout(() => noteTextarea.focus(), 100);
        }
      });
    });
  }

  // Initialize cart two-column layout wrapper
  function initCartLayout() {
    const cartItems = document.querySelector('cart-items.tz-cart-items');
    const cartFooter = document.querySelector('.tz-cart-footer-section');
    
    if (cartItems && cartFooter && !document.querySelector('.tz-cart-sections-wrapper')) {
      // Find the Shopify section wrappers
      const cartItemsSection = cartItems.closest('.shopify-section');
      const cartFooterSection = cartFooter.closest('.shopify-section');
      
      if (cartItemsSection && cartFooterSection) {
        // Find common parent (usually main)
        const parent = cartItemsSection.parentElement;
        
        if (parent && parent.contains(cartFooterSection)) {
          // Check if they're siblings
          if (cartItemsSection.nextElementSibling === cartFooterSection || 
              cartFooterSection.nextElementSibling === cartItemsSection) {
            
            // Create wrapper
            const wrapper = document.createElement('div');
            wrapper.className = 'tz-cart-sections-wrapper';
            
            // Insert wrapper before first section
            const firstSection = cartItemsSection.compareDocumentPosition(cartFooterSection) & Node.DOCUMENT_POSITION_FOLLOWING 
              ? cartItemsSection 
              : cartFooterSection;
            
            parent.insertBefore(wrapper, firstSection);
            
            // Move both sections into wrapper (maintain order)
            if (cartItemsSection.compareDocumentPosition(cartFooterSection) & Node.DOCUMENT_POSITION_FOLLOWING) {
              wrapper.appendChild(cartItemsSection);
              wrapper.appendChild(cartFooterSection);
            } else {
              wrapper.appendChild(cartFooterSection);
              wrapper.appendChild(cartItemsSection);
            }
          }
        }
      }
    }
  }

  // Toast notification system for cart
  function showCartToast(message, type = 'info') {
    // Remove existing toast
    const existingToast = document.querySelector('.tz-cart-toast');
    if (existingToast) {
      existingToast.remove();
    }
    
    // Create new toast
    const toast = document.createElement('div');
    toast.className = `tz-cart-toast tz-cart-toast--${type}`;
    toast.textContent = message;
    toast.setAttribute('role', 'alert');
    toast.setAttribute('aria-live', 'polite');
    
    document.body.appendChild(toast);
    
    // Show toast
    setTimeout(() => toast.classList.add('is-visible'), 100);
    
    // Hide toast after 3 seconds
    setTimeout(() => {
      toast.classList.remove('is-visible');
      setTimeout(() => toast.remove(), 300);
    }, 3000);
  }

  // Check if variant is already in cart
  function isVariantInCart(variantId) {
    const cartItems = document.querySelectorAll('.tz-cart-item');
    for (const item of cartItems) {
      const quantityInput = item.querySelector('.tz-cart-quantity-input');
      if (quantityInput && quantityInput.dataset.quantityVariantId === variantId) {
        return true;
      }
    }
    return false;
  }

  // Initialize complementary products quick add buttons
  function initComplementaryQuickAdd() {
    const quickAddButtons = document.querySelectorAll('.tz-cart-complementary-add');
    
    quickAddButtons.forEach(button => {
      // Remove existing listeners by cloning
      const newButton = button.cloneNode(true);
      button.parentNode.replaceChild(newButton, button);
      
      newButton.addEventListener('click', async (e) => {
        e.preventDefault();
        e.stopPropagation();
        
        const variantId = newButton.dataset.variantId;
        if (!variantId) {
          console.error('TZ Cart: No variant ID found for quick add');
          showCartToast('שגיאה: לא ניתן להוסיף למלאי', 'error');
          return;
        }
        
        // Check if variant is already in cart
        if (isVariantInCart(variantId)) {
          showCartToast('המוצר כבר נמצא בעגלה', 'info');
          return;
        }
        
        // Show loading state
        const originalText = newButton.textContent;
        newButton.textContent = 'מוסיף...';
        newButton.disabled = true;
        
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
          
          // Check for errors in response - Shopify returns status: 422 or errors field
          if (!response.ok || data.status === 422 || data.errors) {
            let errorMessage = 'שגיאה בהוספה לסל';
            if (data.message) {
              errorMessage = data.message;
            } else if (data.description) {
              errorMessage = data.description;
            } else if (data.errors) {
              errorMessage = typeof data.errors === 'string' ? data.errors : Object.values(data.errors).join(', ');
            }
            throw new Error(errorMessage);
          }
          
          // Success - update cart
          showCartToast('נוסף לסל הקניות!', 'success');
          
          // Get updated cart data
          fetch(`${routes.cart_url}.js`)
            .then(response => response.json())
            .then(cartData => {
              // Update cart items section
              const cartItems = document.querySelector('cart-items');
              if (cartItems && cartItems.onCartUpdate) {
                cartItems.onCartUpdate();
              }
              
              // Update only totals and discounts in footer, preserve complementary products
              const cartFooter = document.getElementById('main-cart-footer');
              if (cartFooter) {
                // Update totals value
                const totalsValue = cartFooter.querySelector('.tz-cart-totals-value');
                if (totalsValue) {
                  // Format money - simple version
                  const formattedPrice = new Intl.NumberFormat('he-IL', {
                    style: 'currency',
                    currency: cartData.currency || 'ILS',
                    minimumFractionDigits: 0,
                    maximumFractionDigits: 0
                  }).format(cartData.total_price / 100);
                  totalsValue.textContent = formattedPrice;
                }
                
                // Update discounts if any
                const discountsList = cartFooter.querySelector('.tz-cart-discounts');
                if (cartData.cart_level_discount_applications && cartData.cart_level_discount_applications.length > 0) {
                  // Update or create discounts list
                  if (!discountsList) {
                    // Create discounts list if it doesn't exist
                    const totalsDiv = cartFooter.querySelector('.tz-cart-totals');
                    if (totalsDiv && totalsDiv.parentNode) {
                      const newDiscountsList = document.createElement('ul');
                      newDiscountsList.className = 'tz-cart-discounts';
                      newDiscountsList.setAttribute('role', 'list');
                      totalsDiv.parentNode.insertBefore(newDiscountsList, totalsDiv.nextSibling);
                    }
                  }
                }
                
                // Re-initialize quick add buttons (they should still be there)
                initComplementaryQuickAdd();
              }
              
              // Trigger cart update event
              publish(PUB_SUB_EVENTS.cartUpdate, {
                source: 'tz-cart-complementary',
                cartData: cartData
              });
            })
            .catch(err => {
              console.error('TZ Cart: Cart fetch error', err);
              // Fallback: just update cart items
              const cartItems = document.querySelector('cart-items');
              if (cartItems && cartItems.onCartUpdate) {
                cartItems.onCartUpdate();
              }
            });
        } catch (error) {
          console.error('TZ Cart: Quick add error', error);
          alert(error.message || 'שגיאה בהוספה לסל');
        } finally {
          // Reset button state
          newButton.textContent = originalText;
          newButton.disabled = false;
        }
      });
    });
  }

  // Initialize when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function() {
      initCartNoteToggle();
      initCartLayout();
      initComplementaryQuickAdd();
    });
  } else {
    initCartNoteToggle();
    initCartLayout();
    initComplementaryQuickAdd();
  }

  // Export for external use if needed
  window.TZCart = {
    subscribe,
    publish,
    PUB_SUB_EVENTS,
  };

})();
