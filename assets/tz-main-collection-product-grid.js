/**
 * TZ Main Collection Product Grid JavaScript
 * Handles collection page interactivity including filters, sorting, and pagination
 * RTL-first implementation
 */

class TzCollectionGrid {
  constructor(section) {
    this.section = section;
    this.sectionId = section.dataset.sectionId;

    // Cache DOM elements
    this.filterButtons = section.querySelectorAll('.tz-collection-filter-button');
    this.filterHeaders = section.querySelectorAll('.tz-collection-filter-header');
    this.colorSwatches = section.querySelectorAll('.tz-collection-color-swatch');
    this.checkboxes = section.querySelectorAll('.tz-collection-checkbox');
    this.priceInputs = section.querySelectorAll('.tz-collection-price-input');
    this.sortGroup = section.querySelector('.tz-collection-sort-group');
    this.sortForm = section.querySelector('.tz-collection-sort-form');
    this.sortSelect = section.querySelector('.tz-collection-sort-select');
    this.loadMoreButton = section.querySelector('.tz-collection-load-more-button');

    this.init();
  }

  init() {
    this.bindFilterButtons();
    this.bindFilterHeaders();
    this.bindColorSwatches();
    this.bindCheckboxes();
    this.bindPriceInputs();
    this.bindSortGroup();
    this.bindLoadMore();
    this.translateSortOptions();

    // Initialize filter states
    this.updateFilterStates();
  }

  // Filter button selection (categories)
  bindFilterButtons() {
    this.filterButtons.forEach(button => {
      button.addEventListener('click', (e) => {
        // Allow normal navigation for category buttons
        // They will redirect to the collection page
        // No need to prevent default or use AJAX for category navigation
        
        // The href on the button will handle navigation
        // Active state is managed by server-side rendering based on current URL
      });
    });
  }

  // Filter section expand/collapse
  bindFilterHeaders() {
    this.filterHeaders.forEach(header => {
      header.addEventListener('click', (e) => {
        e.preventDefault();

        const section = header.closest('.tz-collection-sidebar-section');
        const content = section.querySelector('.tz-collection-checkbox-group, .tz-collection-price-range, .tz-collection-color-grid');

        if (content) {
          const isExpanded = content.style.display !== 'none';
          content.style.display = isExpanded ? 'none' : 'block';

          const icon = header.querySelector('.tz-collection-filter-icon');
          if (icon) {
            icon.textContent = isExpanded ? 'add' : 'remove';
          }
        }
      });
    });
  }

  // Color swatch selection
  bindColorSwatches() {
    this.colorSwatches.forEach(swatch => {
      swatch.addEventListener('click', (e) => {
        e.preventDefault();

        // Toggle active state
        swatch.classList.toggle('is-active');

        // Update filters
        this.updateColorFilters();
      });

      // Keyboard accessibility
      swatch.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          swatch.click();
        }
      });

      // Add focus styles
      swatch.addEventListener('focus', () => {
        swatch.style.outline = '2px solid #F8E71C';
      });

      swatch.addEventListener('blur', () => {
        swatch.style.outline = 'none';
      });
    });
  }

  // Checkbox filters (availability, product type)
  bindCheckboxes() {
    this.checkboxes.forEach(checkbox => {
      checkbox.addEventListener('change', () => {
        this.updateFilters({ checkbox: true });
      });
    });
  }

  // Price range inputs
  bindPriceInputs() {
    this.priceInputs.forEach(input => {
      input.addEventListener('input', debounce(() => {
        this.updatePriceFilters();
      }, 300));

      input.addEventListener('blur', () => {
        this.validatePriceInputs();
      });
    });
  }

  // Sort functionality
  bindSortGroup() {
    const sortSelect = this.section.querySelector('.tz-collection-sort-select');
    
    if (sortSelect) {
      sortSelect.addEventListener('change', () => {
        this.updateFilters({ sort: sortSelect.value });
      });
    }
  }

  // Translate sort option labels
  translateSortOptions() {
    const sortSelect = this.section.querySelector('.tz-collection-sort-select');
    if (!sortSelect) return;

    const translations = {
      'manual': 'מומלץ',
      'best-selling': 'הכי נמכר',
      'title-ascending': 'אלפביתי, א-ת',
      'title-descending': 'אלפביתי, ת-א',
      'price-ascending': 'מחיר, נמוך לגבוה',
      'price-descending': 'מחיר, גבוה לנמוך',
      'created-ascending': 'תאריך, ישן לחדש',
      'created-descending': 'תאריך, חדש לישן'
    };

    Array.from(sortSelect.options).forEach(option => {
      const value = option.value;
      if (translations[value]) {
        option.textContent = translations[value];
      }
    });
  }

  // Load more functionality
  bindLoadMore() {
    if (this.loadMoreButton) {
      this.loadMoreButton.addEventListener('click', (e) => {
        e.preventDefault();
        this.loadMoreProducts();
      });
    }
  }

  // Update filter states based on URL or current selection
  updateFilterStates() {
    // Get current URL parameters
    const urlParams = new URLSearchParams(window.location.search);

    // Update category filters
    const category = urlParams.get('category');
    if (category) {
      this.filterButtons.forEach(button => {
        if (button.dataset.filter === category) {
          button.classList.add('is-active');
        } else {
          button.classList.remove('is-active');
        }
      });
    }

    // Update color filters
    const colors = urlParams.getAll('color');
    if (colors.length > 0) {
      this.colorSwatches.forEach(swatch => {
        if (colors.includes(swatch.dataset.color)) {
          swatch.classList.add('is-active');
        }
      });
    }

    // Update checkbox filters
    const availability = urlParams.get('availability');
    const productType = urlParams.get('product_type');

    this.checkboxes.forEach(checkbox => {
      if ((checkbox.name === 'availability' && checkbox.value === availability) ||
          (checkbox.name === 'product_type' && checkbox.value === productType)) {
        checkbox.checked = true;
      }
    });

    // Update price inputs
    const minPrice = urlParams.get('min_price');
    const maxPrice = urlParams.get('max_price');

    if (minPrice) {
      const minInput = this.section.querySelector('.tz-collection-price-input[data-type="min"]');
      if (minInput) minInput.value = minPrice;
    }

    if (maxPrice) {
      const maxInput = this.section.querySelector('.tz-collection-price-input[data-type="max"]');
      if (maxInput) maxInput.value = maxPrice;
    }
  }

  // Update filters using AJAX
  updateFilters(options = {}) {
    this.showLoadingState();

    // Build filter parameters
    const params = new URLSearchParams();
    
    // Sort
    if (options.sort) {
      params.set('sort_by', options.sort);
    } else {
      const sortSelect = this.section.querySelector('.tz-collection-sort-select');
      if (sortSelect && sortSelect.value) {
        params.set('sort_by', sortSelect.value);
      }
    }

    // Get collection URL (category is handled via URL path)
    const activeCategory = this.getActiveCategory();
    const collectionUrl = this.getCollectionUrl(activeCategory);

    // Build filter tags/constraints (Shopify uses constraints for filtering)
    const constraints = [];

    // Colors - using tags or meta fields
    const colors = this.getActiveColors();
    if (colors.length > 0) {
      colors.forEach(color => constraints.push(`color:${color}`));
    }

    // Availability - using tags
    const availability = this.getActiveCheckboxes('availability');
    if (availability.includes('in_stock')) {
      constraints.push('available');
    } else if (availability.includes('out_of_stock')) {
      constraints.push('unavailable');
    }

    // Product type - using tags
    const productTypes = this.getActiveCheckboxes('product_type');
    if (productTypes.length > 0) {
      productTypes.forEach(type => constraints.push(`type:${type}`));
    }

    // Price range - using filter parameters
    const minPrice = this.getPriceValue('min');
    const maxPrice = this.getPriceValue('max');
    if (minPrice) params.set('filter.v.price.gte', minPrice);
    if (maxPrice) params.set('filter.v.price.lte', maxPrice);

    // Add constraints as filter parameter
    if (constraints.length > 0) {
      params.set('constraint', constraints.join(' OR '));
    }

    const fullUrl = `${collectionUrl}${params.toString() ? '?' + params.toString() : ''}`;

    // Fetch filtered products via AJAX
    this.fetchFilteredProducts(fullUrl);
  }

  // Update color filters specifically
  updateColorFilters() {
    this.updateFilters();
  }

  // Update price filters specifically
  updatePriceFilters() {
    this.validatePriceInputs();
    this.updateFilters();
  }

  // Validate price input ranges
  validatePriceInputs() {
    const minInput = this.section.querySelector('.tz-collection-price-input[data-type="min"]');
    const maxInput = this.section.querySelector('.tz-collection-price-input[data-type="max"]');

    if (minInput && maxInput) {
      const minValue = parseFloat(minInput.value) || 0;
      const maxValue = parseFloat(maxInput.value) || 0;

      if (maxValue > 0 && minValue > maxValue) {
        minInput.setCustomValidity('מחיר מינימום לא יכול להיות גבוה ממחיר מקסימום');
        maxInput.setCustomValidity('מחיר מקסימום לא יכול להיות נמוך ממחיר מינימום');
      } else {
        minInput.setCustomValidity('');
        maxInput.setCustomValidity('');
      }
    }
  }

  // Get active category filter
  getActiveCategory() {
    const activeButton = this.section.querySelector('.tz-collection-filter-button.is-active');
    return activeButton ? activeButton.dataset.filter : null;
  }

  // Get active color filters
  getActiveColors() {
    return Array.from(this.section.querySelectorAll('.tz-collection-color-swatch.is-active'))
      .map(swatch => swatch.dataset.color);
  }

  // Get active checkbox filters
  getActiveCheckboxes(name) {
    const checkedBoxes = this.section.querySelectorAll(`.tz-collection-checkbox[name="${name}"]:checked`);
    return Array.from(checkedBoxes).map(box => box.value);
  }

  // Get price input values
  getPriceValue(type) {
    const input = this.section.querySelector(`.tz-collection-price-input[data-type="${type}"]`);
    return input && input.value ? input.value : null;
  }

  // Toggle sort dropdown
  toggleSortDropdown() {
    // Implementation for sort dropdown toggle
    // This would show/hide sort options
    console.log('Sort dropdown toggle');
  }

  // Close sort dropdown
  closeSortDropdown() {
    // Implementation to close sort dropdown
    console.log('Sort dropdown close');
  }

  // Get collection URL based on active category
  getCollectionUrl(categoryFilter) {
    if (categoryFilter && categoryFilter !== 'all') {
      const activeButton = this.section.querySelector(`.tz-collection-filter-button[data-filter="${categoryFilter}"]`);
      if (activeButton && activeButton.href) {
        try {
          return new URL(activeButton.href).pathname;
        } catch (e) {
          return window.location.pathname;
        }
      }
    }
    return window.location.pathname;
  }

  // Fetch filtered products via AJAX
  async fetchFilteredProducts(url) {
    try {
      const response = await fetch(url, {
        headers: {
          'X-Requested-With': 'XMLHttpRequest',
        },
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const html = await response.text();
      const parser = new DOMParser();
      const doc = parser.parseFromString(html, 'text/html');

      // Extract product grid from response
      const newProductGrid = doc.querySelector('.tz-collection-product-grid');
      const newProductCount = doc.querySelector('.tz-collection-product-count');
      const newLoadMore = doc.querySelector('.tz-collection-load-more');

      // Update product grid
      const currentGrid = this.section.querySelector('.tz-collection-product-grid');
      if (currentGrid && newProductGrid) {
        currentGrid.innerHTML = newProductGrid.innerHTML;
      }

      // Update product count
      if (newProductCount) {
        const currentCount = this.section.querySelector('.tz-collection-product-count');
        if (currentCount) {
          currentCount.innerHTML = newProductCount.innerHTML;
        }
      }

      // Update load more button
      const currentLoadMore = this.section.querySelector('.tz-collection-load-more');
      if (newLoadMore && currentLoadMore) {
        currentLoadMore.innerHTML = newLoadMore.innerHTML;
        this.loadMoreButton = this.section.querySelector('.tz-collection-load-more-button');
        if (this.loadMoreButton) {
          this.bindLoadMore();
        }
      } else if (!newLoadMore && currentLoadMore) {
        currentLoadMore.remove();
      }

      // Update URL without reload
      window.history.pushState({}, '', url);

      // Reinitialize product links
      this.initializeProductLinks();

      // Hide loading state
      this.hideLoadingState();

      // Scroll to top of product grid
      const productGrid = this.section.querySelector('.tz-collection-product-grid');
      if (productGrid) {
        productGrid.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    } catch (error) {
      console.error('Error fetching filtered products:', error);
      this.hideLoadingState();
      // Fallback to page reload on error
      window.location.href = url;
    }
  }

  // Show loading state
  showLoadingState() {
    const productGrid = this.section.querySelector('.tz-collection-product-grid');
    if (productGrid) {
      productGrid.style.opacity = '0.5';
      productGrid.style.pointerEvents = 'none';
    }

    // Create or show loading indicator
    let loadingIndicator = this.section.querySelector('.tz-collection-loading');
    if (!loadingIndicator) {
      loadingIndicator = document.createElement('div');
      loadingIndicator.className = 'tz-collection-loading';
      loadingIndicator.innerHTML = '<div style="text-align: center; padding: 2rem;">טוען...</div>';
      const mainContent = this.section.querySelector('.tz-collection-main');
      if (mainContent) {
        mainContent.appendChild(loadingIndicator);
      }
    } else {
      loadingIndicator.style.display = 'block';
    }
  }

  // Hide loading state
  hideLoadingState() {
    const productGrid = this.section.querySelector('.tz-collection-product-grid');
    if (productGrid) {
      productGrid.style.opacity = '1';
      productGrid.style.pointerEvents = 'auto';
    }

    const loadingIndicator = this.section.querySelector('.tz-collection-loading');
    if (loadingIndicator) {
      loadingIndicator.style.display = 'none';
    }
  }

  // Initialize product links after AJAX update
  initializeProductLinks() {
    const productLinks = this.section.querySelectorAll('.tz-collection-product-item');
    productLinks.forEach(link => {
      // Links are already working, but we can add analytics or other handlers here if needed
    });
  }

  // Load more products
  loadMoreProducts() {
    if (!this.loadMoreButton) return;

    // Show loading state
    const originalText = this.loadMoreButton.textContent;
    this.loadMoreButton.disabled = true;
    this.loadMoreButton.textContent = 'טוען...';

    // Get current URL and add page parameter
    const currentUrl = new URL(window.location.href);
    const currentPage = parseInt(currentUrl.searchParams.get('page')) || 1;
    currentUrl.searchParams.set('page', currentPage + 1);

    // Fetch next page
    this.fetchMoreProducts(currentUrl.toString())
      .then(() => {
        this.loadMoreButton.disabled = false;
        this.loadMoreButton.textContent = originalText;
      })
      .catch(() => {
        this.loadMoreButton.disabled = false;
        this.loadMoreButton.textContent = originalText;
      });
  }

  // Fetch more products (pagination)
  async fetchMoreProducts(url) {
    try {
      const response = await fetch(url, {
        headers: {
          'X-Requested-With': 'XMLHttpRequest',
        },
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const html = await response.text();
      const parser = new DOMParser();
      const doc = parser.parseFromString(html, 'text/html');

      // Extract product grid from response
      const newProductGrid = doc.querySelector('.tz-collection-product-grid');
      const currentGrid = this.section.querySelector('.tz-collection-product-grid');

      if (currentGrid && newProductGrid) {
        // Append new products to existing grid
        const newProducts = newProductGrid.querySelectorAll('.tz-collection-product-item');
        newProducts.forEach(product => {
          currentGrid.appendChild(product);
        });

        // Update load more button visibility
        const newLoadMore = doc.querySelector('.tz-collection-load-more');
        if (!newLoadMore) {
          const loadMoreContainer = this.section.querySelector('.tz-collection-load-more');
          if (loadMoreContainer) {
            loadMoreContainer.remove();
          }
        }

        // Reinitialize product links
        this.initializeProductLinks();
      }

      // Update URL
      window.history.pushState({}, '', url);
    } catch (error) {
      console.error('Error loading more products:', error);
      throw error;
    }
  }

  // RTL-specific helpers
  isRTL() {
    return document.documentElement.dir === 'rtl' ||
           document.documentElement.getAttribute('dir') === 'rtl';
  }

  // Utility function for debouncing
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
}

// Debounce utility function
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

// Initialize collection grids when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  const collectionSections = document.querySelectorAll('[data-section-type="tz-collection-grid"]');

  collectionSections.forEach(section => {
    new TzCollectionGrid(section);
  });
});

// Shopify section events
document.addEventListener('shopify:section:load', (event) => {
  if (event.target.querySelector('[data-section-type="tz-collection-grid"]')) {
    const section = event.target.querySelector('[data-section-type="tz-collection-grid"]');
    new TzCollectionGrid(section);
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