// js/cart.js

class FlashItCart {
    constructor() {
        this.cart = this.loadCart();
        this.taxRate = 0.08; // 8% tax rate
        this.freeShippingThreshold = 500;
        this.shippingCost = 99.99;

        this.updateCartDisplay();
        this.setupEventListeners();
    }

    setupEventListeners() {
        window.addEventListener('storage', (e) => {
            if (e.key === 'flashit_cart') {
                this.cart = this.loadCart();
                this.updateCartDisplay();
                if (document.getElementById('cart-items')) {
                    this.displayCartItems();
                }
            }
        });
    }

    loadCart() {
        try {
            const saved = localStorage.getItem('flashit_cart');
            return saved ? JSON.parse(saved) : [];
        } catch (error) {
            console.error('Error loading cart:', error);
            return [];
        }
    }

    saveCart() {
        try {
            localStorage.setItem('flashit_cart', JSON.stringify(this.cart));
            this.updateCartDisplay();
        } catch (error) {
            console.error('Error saving cart:', error);
            this.showNotification('Error saving cart. Please try again.', 'error');
        }
    }

    addItem(event, id, name, price, image, quantity = 1) {
        const existingItem = this.cart.find(item => item.id === parseInt(id));

        if (existingItem) {
            existingItem.quantity += quantity;
        } else {
            this.cart.push({
                id: parseInt(id),
                name: name,
                price: parseFloat(price),
                image: image,
                quantity: quantity,
                addedAt: new Date().toISOString()
            });
        }

        this.saveCart();
        this.showNotification(`${name} added to cart!`, 'success');

        const button = event?.target.closest('button');
        if (button) {
            this.animateButton(button);
        }
    }

    removeItem(id) {
        const item = this.cart.find(item => item.id === parseInt(id));
        if (item) {
            this.cart = this.cart.filter(item => item.id !== parseInt(id));
            this.saveCart();
            this.showNotification(`${item.name} removed from cart`, 'info');
            this.displayCartItems();
        }
    }

    updateQuantity(id, quantity) {
        const item = this.cart.find(item => item.id === parseInt(id));
        if (item) {
            if (quantity <= 0) {
                this.removeItem(id);
            } else {
                item.quantity = Math.max(1, Math.min(99, quantity));
                this.saveCart();
                this.displayCartItems();
            }
        }
    }

    clearCart() {
        if (this.cart.length === 0) return;
        if (confirm('Are you sure you want to clear your cart?')) {
            this.cart = [];
            this.saveCart();
            if (document.getElementById('cart-items')) {
                 this.displayCartItems();
            }
            this.showNotification('Cart cleared successfully', 'success');
        }
    }

    calculateTotals() {
        const subtotal = this.cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        const shipping = subtotal >= this.freeShippingThreshold || subtotal === 0 ? 0 : this.shippingCost;
        const tax = subtotal * this.taxRate;
        const total = subtotal + shipping + tax;
        const itemCount = this.cart.reduce((sum, item) => sum + item.quantity, 0);

        return { subtotal, shipping, tax, total, itemCount };
    }

    updateCartDisplay() {
        const { itemCount } = this.calculateTotals();
        const cartCountElement = document.getElementById('cart-count');

        if (cartCountElement) {
            cartCountElement.textContent = itemCount;
            cartCountElement.style.display = itemCount > 0 ? 'flex' : 'none';
        }
    }

    displayCartItems() {
        const container = document.getElementById('cart-items');
        const emptyMsg = document.getElementById('empty-cart');
        const summary = document.querySelector('.cart-summary');

        if (!container) return;

        if (this.cart.length === 0) {
            container.innerHTML = '';
            emptyMsg.style.display = 'block';
            summary.style.display = 'none';
        } else {
            emptyMsg.style.display = 'none';
            summary.style.display = 'block';

            container.innerHTML = this.cart.map(item => `
                <div class="cart-item">
                    <div class="flex flex-col md:flex-row items-center justify-between gap-4">
                        <div class="flex items-center space-x-4 flex-grow">
                            <img src="${item.image}" alt="${item.name}" class="w-20 h-20 object-cover rounded-lg">
                            <div>
                                <h4 class="font-semibold text-flashit-gray">${item.name}</h4>
                                <p class="text-sm text-gray-500">Price: ₹${item.price.toFixed(2)}</p>
                            </div>
                        </div>
                        <div class="flex items-center space-x-4 md:space-x-6">
                            <div class="quantity-controls">
                                <button onclick="cart.updateQuantity(${item.id}, ${item.quantity - 1})">-</button>
                                <input type="number" value="${item.quantity}" class="w-12 text-center" readonly onchange="cart.updateQuantity(${item.id}, parseInt(this.value) || 1)">
                                <button onclick="cart.updateQuantity(${item.id}, ${item.quantity + 1})">+</button>
                            </div>
                            <span class="font-bold text-lg text-flashit-green w-24 text-right">₹${(item.price * item.quantity).toFixed(2)}</span>
                            <button onclick="cart.removeItem(${item.id})" class="text-gray-400 hover:text-red-500 transition-colors" title="Remove item">
                                <i class="fas fa-trash-alt"></i>
                            </button>
                        </div>
                    </div>
                </div>
            `).join('');
        }
        this.updateCartSummary();
    }

    updateCartSummary() {
        const totals = this.calculateTotals();
        document.getElementById('subtotal').textContent = `₹${totals.subtotal.toFixed(2)}`;
        document.getElementById('shipping').textContent = totals.shipping === 0 ? 'FREE' : `₹${totals.shipping.toFixed(2)}`;
        document.getElementById('tax').textContent = `₹${totals.tax.toFixed(2)}`;
        document.getElementById('total').textContent = `₹${totals.total.toFixed(2)}`;
        this.updateShippingProgress(totals.subtotal);
        this.updateCheckoutButton(totals);
    }

    updateShippingProgress(subtotal) {
        const progressContainer = document.getElementById('shipping-progress');
        if (!progressContainer) return;

        if (subtotal >= this.freeShippingThreshold) {
            progressContainer.innerHTML = `<p class="text-sm text-green-700 font-medium">🎉 You've qualified for free shipping!</p>`;
        } else if (subtotal > 0) {
            const remaining = this.freeShippingThreshold - subtotal;
            const progress = (subtotal / this.freeShippingThreshold) * 100;
            progressContainer.innerHTML = `
                <p class="text-sm text-gray-600 mb-1">Add ₹${remaining.toFixed(2)} more for free shipping.</p>
                <div class="progress-bar"><div class="progress-bar-fill" style="width: ${progress}%;"></div></div>
            `;
        } else {
             progressContainer.innerHTML = `
                <p class="text-sm text-gray-600 mb-1">Free shipping on orders over ₹${this.freeShippingThreshold}.</p>
                <div class="progress-bar"><div class="progress-bar-fill" style="width: 0%;"></div></div>
            `;
        }
    }

    updateCheckoutButton(totals) {
        const checkoutButton = document.querySelector('.checkout-btn');
        if (!checkoutButton) return;
        checkoutButton.disabled = totals.itemCount === 0;
        checkoutButton.innerHTML = `<span>Proceed to Checkout</span>`;
    }

    showNotification(message, type = 'success') {
        const existing = document.querySelector('.notification');
        if (existing) existing.remove();
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        const icon = type === 'success' ? 'fa-check-circle' : type === 'error' ? 'fa-times-circle' : 'fa-info-circle';
        notification.innerHTML = `<div class="flex items-center"><i class="fas ${icon} mr-3"></i><p>${message}</p></div>`;
        document.body.appendChild(notification);
        setTimeout(() => notification.classList.add('show'), 10);
        setTimeout(() => {
            notification.classList.remove('show');
            setTimeout(() => notification.remove(), 500);
        }, 3000);
    }

    animateButton(button) {
        const originalText = button.innerHTML;
        button.innerHTML = '<i class="fas fa-check"></i> Added';
        button.classList.add('btn-success-animation');
        button.disabled = true;
        setTimeout(() => {
            button.innerHTML = originalText;
            button.classList.remove('btn-success-animation');
            button.disabled = false;
        }, 2000);
    }
}

const cart = new FlashItCart();

function addToCart(event, id, name, price, image) {
    cart.addItem(event, id, name, price, image, 1);
}

function addToCartWithQuantity(event, id, name, price, image) {
    const qty = document.getElementById(`quantity-${id}`);
    cart.addItem(event, id, name, price, image, parseInt(qty.value));
}

function clearCart() {
    cart.clearCart();
}

function checkout() {
    if (cart.cart.length === 0) {
        cart.showNotification('Your cart is empty!', 'error');
        return;
    }
    alert(`This is a demo checkout for ${cart.calculateTotals().itemCount} items totaling ₹${cart.calculateTotals().total.toFixed(2)}.`);
}