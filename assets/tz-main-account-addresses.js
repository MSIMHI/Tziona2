/**
 * TZ Customer Addresses
 * Handles address form toggling and country/province selection
 */
class TzCustomerAddresses {
  constructor() {
    this.init();
  }

  init() {
    this.container = document.querySelector('[data-customer-addresses]');
    if (!this.container) return;

    this.setupCountries();
    this.setupEventListeners();
  }

  setupCountries() {
    if (Shopify && Shopify.CountryProvinceSelector) {
      // New Address form
      const newCountrySelect = document.getElementById('AddressCountryNew');
      if (newCountrySelect) {
        new Shopify.CountryProvinceSelector('AddressCountryNew', 'AddressProvinceNew', {
          hideElement: 'AddressProvinceContainerNew',
        });
      }

      // Edit Address forms
      const editCountrySelects = this.container.querySelectorAll('[data-address-country-select]');
      editCountrySelects.forEach((select) => {
        const formId = select.dataset.formId;
        new Shopify.CountryProvinceSelector(`AddressCountry_${formId}`, `AddressProvince_${formId}`, {
          hideElement: `AddressProvinceContainer_${formId}`,
        });
      });
    }
  }

  setupEventListeners() {
    // Toggle form buttons
    const toggleButtons = document.querySelectorAll('[data-toggle-address-form]');
    toggleButtons.forEach((btn) => {
      btn.addEventListener('click', (e) => {
        const targetId = btn.getAttribute('aria-controls');
        const targetForm = document.getElementById(targetId);
        if (targetForm) {
          const isExpanded = btn.getAttribute('aria-expanded') === 'true';
          btn.setAttribute('aria-expanded', !isExpanded);
          targetForm.classList.toggle('is-open', !isExpanded);
          
          // Scroll to form if opening
          if (!isExpanded) {
             targetForm.scrollIntoView({ behavior: 'smooth', block: 'start' });
          }
        }
      });
    });

    // Cancel buttons
    const cancelButtons = this.container.querySelectorAll('button[type="reset"]');
    cancelButtons.forEach((btn) => {
      btn.addEventListener('click', (e) => {
        const formContainer = btn.closest('.tz-address-form-container');
        if (formContainer) {
          formContainer.classList.remove('is-open');
          const toggleBtn = document.querySelector(`button[aria-controls="${formContainer.id}"]`);
          if (toggleBtn) {
            toggleBtn.setAttribute('aria-expanded', 'false');
          }
        }
      });
    });

    // Delete buttons
    const deleteButtons = this.container.querySelectorAll('[data-confirm-message]');
    deleteButtons.forEach((btn) => {
      btn.addEventListener('click', (e) => {
        const confirmMessage = btn.getAttribute('data-confirm-message');
        if (confirm(confirmMessage || 'Are you sure you want to delete this address?')) {
          Shopify.postLink(btn.dataset.target, {
            parameters: { _method: 'delete' },
          });
        }
      });
    });
  }
}

document.addEventListener('DOMContentLoaded', () => {
  new TzCustomerAddresses();
});
