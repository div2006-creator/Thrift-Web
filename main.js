/**
 * Thrift Store By Nawab - Home Page Interactive Logic
 */

document.addEventListener('DOMContentLoaded', () => {
  // State Management
  let wishlistCount = 2;
  let cartState = [
    {
      id: 'default-1',
      title: 'Vintage Italian Wool Trench',
      price: 4499,
      code: 'Bettiah Archive #402'
    }
  ];

  // DOM Elements
  const toastContainer = document.getElementById('toast-container');
  const wishlistBadge = document.getElementById('wishlist-badge');
  const cartBadge = document.getElementById('cart-badge');
  
  // Search Modal Elements
  const searchModal = document.getElementById('search-modal');
  const openSearchBtn = document.getElementById('open-search-btn');
  const closeSearchBtn = document.getElementById('close-search-btn');
  const searchInput = document.getElementById('search-input');

  // Cart Drawer Elements
  const cartDrawer = document.getElementById('cart-drawer');
  const openCartBtn = document.getElementById('open-cart-btn');
  const closeCartBtn = document.getElementById('close-cart-btn');
  const cartItemsList = document.getElementById('cart-items-list');
  const cartSubtotal = document.getElementById('cart-subtotal');
  const cartDrawerCount = document.getElementById('cart-drawer-count');
  const checkoutBtn = document.getElementById('checkout-btn');

  // Wishlist Button Trigger
  const openWishlistBtn = document.getElementById('open-wishlist-btn');

  /**
   * Toast Notification Renderer
   */
  function showToast(message) {
    if (!toastContainer) return;

    const toast = document.createElement('div');
    toast.className = 'toast-item';
    toast.innerHTML = `
      <span class="material-symbols-outlined text-accent text-[20px]">verified</span>
      <p class="font-body-sm text-body-sm text-text-main">${message}</p>
    `;

    toastContainer.appendChild(toast);

    // Trigger animation
    requestAnimationFrame(() => {
      toast.classList.add('show');
    });

    // Auto-remove
    setTimeout(() => {
      toast.classList.remove('show');
      setTimeout(() => {
        toast.remove();
      }, 300);
    }, 3200);
  }

  /**
   * Update Cart UI & Calculations
   */
  function updateCartUI() {
    // Update Badges
    const totalCount = cartState.length;
    if (cartBadge) cartBadge.textContent = totalCount;
    if (cartDrawerCount) cartDrawerCount.textContent = `(${totalCount} Item${totalCount === 1 ? '' : 's'})`;

    // Calculate Subtotal
    const subtotal = cartState.reduce((sum, item) => sum + item.price, 0);
    if (cartSubtotal) {
      cartSubtotal.textContent = `₹${subtotal.toLocaleString('en-IN')}`;
    }

    // Render Cart Drawer List
    if (!cartItemsList) return;
    if (cartState.length === 0) {
      cartItemsList.innerHTML = `
        <div class="flex flex-col items-center justify-center py-space-3xl text-center">
          <span class="material-symbols-outlined text-text-secondary text-[48px] mb-space-sm">shopping_bag</span>
          <p class="font-title-editorial text-title-editorial text-text-main">Your archive bag is empty</p>
          <p class="font-body-sm text-body-sm text-text-secondary pt-space-3xs">Explore our latest drops and add your favourite pieces.</p>
        </div>
      `;
      return;
    }

    cartItemsList.innerHTML = cartState.map((item, index) => `
      <div class="flex gap-space-md items-center border-b border-border-soft/40 pb-space-md" data-index="${index}">
        <div class="w-20 h-24 bg-surface-sand border border-border-soft flex items-center justify-center overflow-hidden">
          <span class="material-symbols-outlined text-accent text-[28px]">checkroom</span>
        </div>
        <div class="flex-1">
          <p class="font-label-uppercase text-label-uppercase text-accent uppercase font-medium">${item.code || 'Bettiah Archive'}</p>
          <h4 class="font-title-editorial text-title-editorial text-text-main">${item.title}</h4>
          <p class="font-label-price text-label-price text-text-main pt-space-3xs font-semibold">₹${item.price.toLocaleString('en-IN')}</p>
        </div>
        <button class="remove-cart-item text-text-secondary hover:text-primary transition-colors cursor-pointer" data-index="${index}" type="button" aria-label="Remove item">
          <span class="material-symbols-outlined text-[20px]">delete</span>
        </button>
      </div>
    `).join('');

    // Attach remove event listeners
    cartItemsList.querySelectorAll('.remove-cart-item').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const itemIdx = parseInt(btn.getAttribute('data-index'), 10);
        if (!isNaN(itemIdx)) {
          const removed = cartState.splice(itemIdx, 1);
          updateCartUI();
          showToast(`Removed "${removed[0].title}" from bag.`);
        }
      });
    });
  }

  /**
   * Search Modal Handlers
   */
  function openSearch() {
    if (searchModal) {
      searchModal.classList.add('open');
      if (searchInput) searchInput.focus();
    }
  }

  function closeSearch() {
    if (searchModal) {
      searchModal.classList.remove('open');
    }
  }

  if (openSearchBtn) openSearchBtn.addEventListener('click', openSearch);
  if (closeSearchBtn) closeSearchBtn.addEventListener('click', closeSearch);

  if (searchModal) {
    searchModal.addEventListener('click', (e) => {
      if (e.target === searchModal) closeSearch();
    });
  }

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      closeSearch();
      closeCart();
    }
  });

  /**
   * Cart Drawer Handlers
   */
  function openCart() {
    if (cartDrawer) cartDrawer.classList.add('open');
  }

  function closeCart() {
    if (cartDrawer) cartDrawer.classList.remove('open');
  }

  if (openCartBtn) openCartBtn.addEventListener('click', openCart);
  if (closeCartBtn) closeCartBtn.addEventListener('click', closeCart);

  if (cartDrawer) {
    cartDrawer.addEventListener('click', (e) => {
      if (e.target === cartDrawer) closeCart();
    });
  }

  if (checkoutBtn) {
    checkoutBtn.addEventListener('click', () => {
      if (cartState.length === 0) {
        showToast('Your archive bag is empty.');
        return;
      }
      showToast('Proceeding to secure checkout...');
    });
  }

  if (openWishlistBtn) {
    openWishlistBtn.addEventListener('click', () => {
      showToast(`You have ${wishlistCount} saved item${wishlistCount === 1 ? '' : 's'} in your Bettiah wishlist.`);
    });
  }

  /**
   * Wishlist Buttons Toggle
   */
  document.querySelectorAll('.wishlist-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      
      const isActive = btn.classList.contains('active');
      const card = btn.closest('.product-card');
      const title = card ? card.getAttribute('data-title') || 'Item' : 'Item';

      if (isActive) {
        btn.classList.remove('active');
        wishlistCount = Math.max(0, wishlistCount - 1);
        if (wishlistBadge) wishlistBadge.textContent = wishlistCount;
        showToast(`Removed "${title}" from your wishlist.`);
      } else {
        btn.classList.add('active');
        wishlistCount += 1;
        if (wishlistBadge) wishlistBadge.textContent = wishlistCount;
        showToast(`Saved "${title}" to your Bettiah wishlist.`);
      }
    });
  });

  /**
   * Add to Bag Buttons
   */
  document.querySelectorAll('.add-to-bag-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      
      let title = btn.getAttribute('data-title');
      let price = parseInt(btn.getAttribute('data-price'), 10);
      let code = btn.getAttribute('data-code');

      if (!title) {
        const card = btn.closest('.product-card');
        if (card) {
          title = card.getAttribute('data-title') || 'Archival Garment';
          price = parseInt(card.getAttribute('data-price') || '599', 10);
          code = card.getAttribute('data-code') || 'Bettiah Archive';
        }
      }

      title = title || 'Archival Garment';
      price = price || 599;
      code = code || 'Bettiah Archive';

      // Push to cart state
      cartState.push({
        id: 'item-' + Date.now(),
        title: title,
        price: price,
        code: code
      });

      updateCartUI();
      showToast(`Added "${title}" to your archive bag.`);
      openCart();
    });
  });

  // Initial UI Render
  updateCartUI();
});
