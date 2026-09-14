/**
 * Thrift Store By Nawab - Interactive Logic & Cart Persistence
 */

document.addEventListener('DOMContentLoaded', () => {
  // State Management with LocalStorage persistence
  let wishlistCount = parseInt(localStorage.getItem('nawab_wishlist_count') || '2', 10);
  
  let savedCart = localStorage.getItem('nawab_cart_state');
  let cartState = savedCart ? JSON.parse(savedCart) : [
    {
      id: 'default-1',
      title: 'Vintage Italian Wool Trench',
      price: 4499,
      code: 'Bettiah Archive #402',
      image: 'images/item_linen_shirt.png'
    }
  ];

  // Backwards compatibility migration: ensure all existing cart items have a valid image URL
  cartState = cartState.map(item => {
    if (!item.image || item.image.includes('unsplash') || item.image.trim() === '') {
      const lower = (item.title || '').toLowerCase();
      if (lower.includes('linen') || lower.includes('cotton') || lower.includes('shirt')) {
        item.image = 'images/item_linen_shirt.png';
      } else if (lower.includes('flannel') || lower.includes('casual')) {
        item.image = 'images/item_flannel_shirt.png';
      } else if (lower.includes('carpenter')) {
        item.image = 'images/item_carpenter_jeans.png';
      } else if (lower.includes('jean') || lower.includes('denim')) {
        item.image = 'images/item_straight_blue_jeans.png';
      } else if (lower.includes('tee') || lower.includes('t-shirt') || lower.includes('graphic')) {
        item.image = 'images/item_vintage_band_tee.png';
      } else if (lower.includes('trucker') || lower.includes('jacket')) {
        item.image = 'images/item_denim_trucker_jacket.png';
      } else if (lower.includes('track') || lower.includes('retro')) {
        item.image = 'images/item_track_jacket.png';
      } else {
        item.image = 'images/item_linen_shirt.png';
      }
    }
    return item;
  });

  function saveCart() {
    localStorage.setItem('nawab_cart_state', JSON.stringify(cartState));
    localStorage.setItem('nawab_wishlist_count', wishlistCount.toString());
  }

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

    requestAnimationFrame(() => {
      toast.classList.add('show');
    });

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
    const totalCount = cartState.length;
    if (cartBadge) cartBadge.textContent = totalCount;
    if (wishlistBadge) wishlistBadge.textContent = wishlistCount;
    if (cartDrawerCount) cartDrawerCount.textContent = `(${totalCount} Item${totalCount === 1 ? '' : 's'})`;

    const subtotal = cartState.reduce((sum, item) => sum + item.price, 0);
    if (cartSubtotal) {
      cartSubtotal.textContent = `₹${subtotal.toLocaleString('en-IN')}`;
    }

    // Also update checkout page if present
    const summarySubtotal = document.getElementById('summary-subtotal');
    const summaryTotal = document.getElementById('summary-total');
    const cartItemCount = document.getElementById('cart-item-count');
    const checkoutCartList = document.getElementById('checkout-cart-list');

    if (summarySubtotal) summarySubtotal.textContent = `₹${subtotal.toLocaleString('en-IN')}`;
    if (summaryTotal) summaryTotal.textContent = `₹${subtotal.toLocaleString('en-IN')}`;
    if (cartItemCount) cartItemCount.textContent = totalCount;

    if (checkoutCartList) {
      if (cartState.length === 0) {
        checkoutCartList.innerHTML = `
          <div class="py-6 text-center text-text-secondary">
            Your archive bag is empty. <a href="shop.html" class="text-primary font-semibold underline">Shop items</a>
          </div>
        `;
      } else {
        checkoutCartList.innerHTML = cartState.map((item, index) => {
          const imgSrc = item.image || 'images/item_linen_shirt.png';
          return `
            <div class="flex items-center justify-between border-b border-border-soft/40 pb-space-md" data-index="${index}">
              <div class="flex items-center gap-space-md">
                <div class="w-16 h-20 bg-surface-sand border border-border-soft overflow-hidden shrink-0 flex items-center justify-center">
                  <img src="${imgSrc}" alt="${item.title}" class="w-full h-full object-cover"/>
                </div>
                <div class="flex flex-col">
                  <span class="font-label-uppercase text-accent text-[10px]">${item.code || 'Bettiah Archive'}</span>
                  <h3 class="font-title-editorial text-text-main font-semibold">${item.title}</h3>
                  <span class="font-label-price text-text-main font-bold pt-1">₹${item.price.toLocaleString('en-IN')}</span>
                </div>
              </div>
              <button class="remove-cart-item text-text-secondary hover:text-primary p-2 cursor-pointer" data-index="${index}" type="button" aria-label="Remove item">
                <span class="material-symbols-outlined text-[20px]">delete</span>
              </button>
            </div>
          `;
        }).join('');
      }
    }

    saveCart();

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

    cartItemsList.innerHTML = cartState.map((item, index) => {
      const imgSrc = item.image || 'images/item_linen_shirt.png';
      return `
        <div class="flex gap-space-md items-center border-b border-border-soft/40 pb-space-md" data-index="${index}">
          <div class="w-20 h-24 bg-surface-sand border border-border-soft shrink-0 overflow-hidden flex items-center justify-center">
            <img src="${imgSrc}" alt="${item.title}" class="w-full h-full object-cover"/>
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
      `;
    }).join('');

    document.querySelectorAll('.remove-cart-item').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const targetBtn = e.currentTarget;
        const itemIdx = parseInt(targetBtn.getAttribute('data-index'), 10);
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
    checkoutBtn.addEventListener('click', (e) => {
      if (cartState.length === 0) {
        e.preventDefault();
        showToast('Your archive bag is empty.');
      }
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
      saveCart();
    });
  });

  /**
   * Add to Bag Buttons Logic
   */
  document.querySelectorAll('.add-to-bag-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      
      let title = btn.getAttribute('data-title');
      let price = parseInt(btn.getAttribute('data-price'), 10);
      let code = btn.getAttribute('data-code');
      let image = btn.getAttribute('data-image');

      const card = btn.closest('.product-card');
      if (card) {
        if (!title) title = card.getAttribute('data-title') || 'Archival Garment';
        if (!price || isNaN(price)) price = parseInt(card.getAttribute('data-price') || '599', 10);
        if (!code) code = card.getAttribute('data-code') || 'Bettiah Archive';
        if (!image) image = card.getAttribute('data-image');
        if (!image) {
          const imgEl = card.querySelector('img');
          if (imgEl) image = imgEl.getAttribute('src');
        }
      }

      title = title || 'Archival Garment';
      price = price || 599;
      code = code || 'Bettiah Archive';
      
      if (!image || image.trim() === '') {
        const lower = title.toLowerCase();
        if (lower.includes('linen') || lower.includes('cotton') || lower.includes('shirt')) image = 'images/item_linen_shirt.png';
        else if (lower.includes('flannel') || lower.includes('casual')) image = 'images/item_flannel_shirt.png';
        else if (lower.includes('carpenter')) image = 'images/item_carpenter_jeans.png';
        else if (lower.includes('jean') || lower.includes('denim')) image = 'images/item_straight_blue_jeans.png';
        else if (lower.includes('tee') || lower.includes('t-shirt') || lower.includes('graphic')) image = 'images/item_vintage_band_tee.png';
        else if (lower.includes('trucker') || lower.includes('jacket')) image = 'images/item_denim_trucker_jacket.png';
        else if (lower.includes('track') || lower.includes('retro')) image = 'images/item_track_jacket.png';
        else image = 'images/item_linen_shirt.png';
      }

      cartState.push({
        id: 'item-' + Date.now(),
        title: title,
        price: price,
        code: code,
        image: image
      });

      updateCartUI();
      showToast(`Added "${title}" to your archive bag.`);
      openCart();
    });
  });

  // Search Filter Input Listener
  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      const term = e.target.value.toLowerCase().trim();
      const productCards = document.querySelectorAll('.product-card');
      productCards.forEach(card => {
        const text = card.textContent.toLowerCase();
        if (text.includes(term)) {
          card.style.display = 'flex';
        } else {
          card.style.display = 'none';
        }
      });
    });
  }

  // Initial UI Render
  updateCartUI();
});
