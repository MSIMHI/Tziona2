/**
 * Snippet: assets/tz-announcement-bar.js
 * Handles any custom functionality for the TZ Announcement Bar.
 */

if (!customElements.get('tz-announcement-bar')) {
  class TZAnnouncementBar extends HTMLElement {
    constructor() {
      super();
    }

    connectedCallback() {
      this.initDropdowns();
    }

    initDropdowns() {
      const dropdowns = this.querySelectorAll('.tz-dropdown');

      dropdowns.forEach(dropdown => {
        const toggle = dropdown.querySelector('.tz-dropdown__toggle');
        const links = dropdown.querySelectorAll('.tz-dropdown__item a');
        
        // Find the form related to this dropdown
        const form = dropdown.querySelector('form') || dropdown.parentElement.querySelector(`#${dropdown.getAttribute('data-tz-dropdown') === 'country' ? 'AnnouncementCountryForm' : 'AnnouncementLanguageForm'}`);

        if (!toggle) return;

        toggle.addEventListener('click', (e) => {
          e.stopPropagation();
          const isActive = dropdown.classList.contains('is-active');
          
          // Close other dropdowns in this bar
          this.querySelectorAll('.tz-dropdown.is-active').forEach(d => {
            if (d !== dropdown) d.classList.remove('is-active');
          });

          dropdown.classList.toggle('is-active', !isActive);
        });

        links.forEach(link => {
          link.addEventListener('click', (e) => {
            e.preventDefault();
            const value = link.getAttribute('data-value');
            if (!form) return;
            const input = form.querySelector('input[name="country_code"], input[name="language_code"]');
            
            if (input) {
              input.value = value;
              form.submit();
            }
          });
        });
      });

      // Close dropdowns when clicking outside
      document.addEventListener('click', () => {
        document.querySelectorAll('.tz-dropdown.is-active').forEach(d => {
          d.classList.remove('is-active');
        });
      });
    }
  }

  customElements.define('tz-announcement-bar', TZAnnouncementBar);
}
