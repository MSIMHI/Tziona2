/**
 * TZ Blog JavaScript
 * Handles tag filtering for blog listing page
 */

document.addEventListener('DOMContentLoaded', () => {
  const initBlogTagFilter = () => {
    const tagButtons = document.querySelectorAll('.tz-blog-tag');
    const blogCards = document.querySelectorAll('.tz-blog-card');

    if (tagButtons.length === 0 || blogCards.length === 0) {
      return;
    }

    tagButtons.forEach(button => {
      button.addEventListener('click', (e) => {
        e.preventDefault();
        
        const selectedTag = button.getAttribute('data-tag');
        
        // Update active state
        tagButtons.forEach(btn => {
          btn.classList.remove('tz-blog-tag--active');
        });
        button.classList.add('tz-blog-tag--active');

        // Filter cards
        blogCards.forEach(card => {
          const cardTags = card.getAttribute('data-tags');
          
          if (selectedTag === 'all' || !selectedTag) {
            // Show all cards
            card.style.display = 'block';
          } else if (cardTags && cardTags.includes(selectedTag)) {
            // Show matching cards
            card.style.display = 'block';
          } else {
            // Hide non-matching cards
            card.style.display = 'none';
          }
        });
      });
    });
  };

  initBlogTagFilter();
});
