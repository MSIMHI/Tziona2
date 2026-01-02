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
