// script2.js — UGM Shop Logic (index2.html)

// Init AOS if available
if (window.AOS) {
  AOS.init({ duration: 800, once: true });
}

// Helpers for cart
function getCart() {
  return JSON.parse(localStorage.getItem('ugmCart')) || [];
}
function setCart(cart) {
  localStorage.setItem('ugmCart', JSON.stringify(cart));
}
function updateCartCount() {
  const el = document.getElementById('cartCount');
  if (!el) return;
  const cart = getCart();
  el.textContent = cart.length;
}

// Notification bubble
const notification = document.getElementById('notification');
function showNotification(message, color = 'green') {
  if (!notification) return;
  notification.textContent = message;
  notification.style.backgroundColor = color === 'green' ? '#16a34a' : '#dc2626';
  notification.style.display = 'block';
  setTimeout(() => { notification.style.display = 'none'; }, 1800);
}

// Product modal logic
const items = document.querySelectorAll('.item');
const modal = document.getElementById('modal');
const modalTitle = document.getElementById('modalTitle');
const modalPrice = document.getElementById('modalPrice');
const modalImage = document.getElementById('modalImage');
const addToCartBtn = document.getElementById('addToCart');
const modalSize = document.getElementById('modalSize');
const closeModal = document.getElementById('closeModal');

let selectedItem = null;

// Open modal on product click
if (items && modal && modalTitle && modalPrice && modalImage && addToCartBtn && modalSize) {
  items.forEach(item => {
    item.addEventListener('click', () => {
      selectedItem = {
        name: item.dataset.name,
        price: parseFloat(item.dataset.price),
        image: item.dataset.image,
        category: item.dataset.category
      };
      modalTitle.textContent = selectedItem.name;
      modalPrice.textContent = `Price: ₦${selectedItem.price.toLocaleString()}`;
      modalImage.src = selectedItem.image;
      modal.style.display = 'block';
      modalSize.value = '';
    });
  });
}

// Close modal
if (closeModal && modal) {
  closeModal.onclick = () => { modal.style.display = 'none'; };
}
window.onclick = (e) => {
  if (e.target === modal) modal.style.display = 'none';
};

// Add to cart
if (addToCartBtn) {
  addToCartBtn.onclick = () => {
    if (!selectedItem) return;

    if (!modalSize.value) {
      alert('Please select a size');
      return;
    }

    selectedItem.size = modalSize.value;

    let cart = getCart();
    cart.push(selectedItem);
    setCart(cart);

    modal.style.display = 'none';
    updateCartCount();
    showNotification('Item added to cart', 'green');
  };
}

// FILTER SYSTEM (Option A)
// Buttons must have data-filter="category"
const filterButtons = document.querySelectorAll('.filter-btn');

if (filterButtons.length > 0 && items.length > 0) {
  filterButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const filter = btn.dataset.filter;

      filterButtons.forEach(b => b.classList.remove('bg-black', 'text-white'));
      btn.classList.add('bg-black', 'text-white');

      items.forEach(item => {
        const itemCat = item.dataset.category;

        if (filter === 'all' || itemCat === filter) {
          item.style.display = 'block';
          item.style.opacity = 1;
        } else {
          item.style.display = 'none';
          item.style.opacity = 0;
        }
      });
    });
  });
}

// Load cart count on page load
updateCartCount();
