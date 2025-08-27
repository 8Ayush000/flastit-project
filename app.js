// js/app.js

class FlashItApp {
    constructor() {
        this.products = [
            { id: 1, name: 'Wireless Headphones', description: 'Premium wireless headphones with noise cancellation.', price: 2999.99, category: 'electronics', image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=300&fit=crop', featured: true, stock: 50, rating: 4.8, reviews: 256 },
            { id: 2, name: 'Smart Watch', description: 'Advanced smartwatch with health monitoring, GPS, and long battery life.', price: 3999.99, category: 'electronics', image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&h=300&fit=crop', featured: true, stock: 30, rating: 4.6, reviews: 189 },
            { id: 3, name: 'Gaming Laptop', description: 'High-performance gaming laptop with RTX graphics and 16GB RAM.', price: 12999.99, category: 'electronics', image: 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=400&h=300&fit=crop', featured: true, stock: 20, rating: 4.9, reviews: 98 },
            { id: 4, name: 'Smartphone Pro', description: 'Latest flagship smartphone with an advanced camera system.', price: 8999.99, category: 'electronics', image: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=400&h=300&fit=crop', featured: false, stock: 40, rating: 4.7, reviews: 342 },
            { id: 7, name: 'Designer Jacket', description: 'Stylish designer jacket for all seasons, made with premium materials.', price: 1499.99, category: 'fashion', image: 'https://images.unsplash.com/photo-1551698618-1dfe5d97d256?w=400&h=300&fit=crop', featured: true, stock: 60, rating: 4.4, reviews: 89 },
            { id: 8, name: 'Premium T-Shirt', description: 'Comfortable premium cotton t-shirt with a perfect fit.', price: 299.99, category: 'fashion', image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400&h=300&fit=crop', featured: false, stock: 100, rating: 4.3, reviews: 567 },
            { id: 11, name: 'Air Fryer Pro', description: 'Advanced air fryer with smart cooking technology for healthy meals.', price: 1999.99, category: 'home', image: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400&h=300&fit=crop', featured: true, stock: 45, rating: 4.7, reviews: 189 },
            { id: 12, name: 'Coffee Maker Deluxe', description: 'Premium coffee maker with a built-in grinder for the perfect cup.', price: 1599.99, category: 'home', image: 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=400&h=300&fit=crop', featured: false, stock: 55, rating: 4.6, reviews: 267 },
            { id: 15, name: 'Classic Literature Collection', description: 'A complete collection of timeless classic literature in hardcover.', price: 499.99, category: 'books', image: 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=400&h=300&fit=crop', featured: true, stock: 75, rating: 4.9, reviews: 456 },
            { id: 16, name: 'Programming Guide', description: 'A comprehensive guide to modern development practices.', price: 399.99, category: 'books', image: 'https://images.unsplash.com/photo-1532012197267-da84d127e765?w=400&h=300&fit=crop', featured: false, stock: 50, rating: 4.7, reviews: 289 },
        ];
        this.filteredProducts = [...this.products];
        this.init();
    }

    init() {
        this.loadFeaturedProducts();
        this.setupEventListeners();
    }

    setupEventListeners() {
        document.getElementById('search-input')?.addEventListener('keypress', (e) => e.key === 'Enter' && this.searchProducts());
    }

    loadFeaturedProducts() {
        const container = document.getElementById('featured-products');
        if (!container) return;
        container.innerHTML = this.products.filter(p => p.featured).map(p => this.createProductCard(p)).join('');
    }

    createProductCard(product) {
        return `
            <div class="bg-white rounded-lg shadow-md overflow-hidden flex flex-col hover:shadow-xl transition-shadow duration-300">
                <div class="relative">
                    <img src="${product.image}" alt="${product.name}" class="w-full h-48 object-cover">
                </div>
                <div class="p-4 flex flex-col flex-grow">
                    <h3 class="text-lg font-semibold mb-2 text-flashit-gray line-clamp-1">${product.name}</h3>
                    <p class="text-sm text-gray-600 mb-4 flex-grow line-clamp-1">${product.description}</p>
                    <div class="flex items-center justify-between mt-auto">
                        <span class="text-xl font-bold text-flashit-green">₹${product.price.toFixed(2)}</span>
                    </div>
                    <div class="flex space-x-2 mt-4">
                        <button onclick="addToCart(event, ${product.id}, '${product.name}', ${product.price}, '${product.image}')"
                                class="flex-1 bg-flashit-green hover:bg-flashit-green-dark text-white px-3 py-2 rounded text-sm ${product.stock === 0 ? 'opacity-50' : ''}"
                                ${product.stock === 0 ? 'disabled' : ''}>
                            <i class="fas fa-cart-plus mr-1"></i> Add to Cart
                        </button>
                        <button onclick="showProductDetail(${product.id})" class="bg-gray-200 hover:bg-gray-300 px-3 py-2 rounded text-sm">View</button>
                    </div>
                </div>
            </div>`;
    }

    searchProducts() {
        const term = document.getElementById('search-input').value.toLowerCase().trim();
        const results = this.products.filter(p => p.name.toLowerCase().includes(term));
        this.showProductsPage(results, `Search results for "${term}"`);
    }

    showProductsPage(products, title) {
        this.filteredProducts = [...products];
        document.getElementById('main-content').innerHTML = `
            <div class="container mx-auto px-4 py-8">
                <h1 class="text-3xl font-bold text-flashit-gray mb-8">${title}</h1>
                <div id="products-grid" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    ${products.length > 0 ? products.map(p => this.createProductCard(p)).join('') : '<p class="col-span-full text-center">No products found.</p>'}
                </div>
            </div>`;
        window.scrollTo(0, 0);
    }

    showProductDetail(productId) {
        const product = this.products.find(p => p.id === productId);
        if (!product) return;
        document.getElementById('main-content').innerHTML = `
            <div class="container mx-auto px-4 py-8">
                <div class="grid grid-cols-1 lg:grid-cols-2 gap-12">
                    <img src="${product.image}" alt="${product.name}" class="rounded-lg shadow-lg w-full">
                    <div>
                        <h1 class="text-4xl font-bold mb-4">${product.name}</h1>
                        <p class="text-gray-600 mb-6 text-lg">${product.description}</p>
                        <div class="text-3xl font-bold text-flashit-green mb-6">₹${product.price.toFixed(2)}</div>
                        <div class="flex items-center space-x-4">
                            <label for="quantity-${product.id}" class="font-semibold">Quantity:</label>
                            <select id="quantity-${product.id}" class="border rounded p-2">
                                ${Array.from({length: Math.min(10, product.stock)}, (_, i) => `<option value="${i + 1}">${i + 1}</option>`).join('')}
                            </select>
                            <button onclick="addToCartWithQuantity(event, ${product.id}, '${product.name}', ${product.price}, '${product.image}')"
                                    class="bg-flashit-green text-white px-6 py-3 rounded-lg font-semibold">
                                <i class="fas fa-cart-plus mr-2"></i>Add to Cart
                            </button>
                        </div>
                    </div>
                </div>
            </div>`;
        window.scrollTo(0, 0);
    }
}

// Initialize the main application
const app = new FlashItApp();

// --- Global Functions for HTML onclick Handlers ---
function showHome() { location.reload(); }
function showProducts(category) {
    const products = category === 'all' ? app.products : app.products.filter(p => p.category === category);
    const title = `${category.charAt(0).toUpperCase() + category.slice(1)} Products`;
    app.showProductsPage(products, title);
}
function showProductDetail(id) { app.showProductDetail(id); }
function searchProducts() { app.searchProducts(); }

function showCart() {
    document.getElementById('main-content').innerHTML = `
        <div class="container mx-auto px-4 py-8">
            <h1 class="text-3xl font-bold text-flashit-gray mb-8">Shopping Cart</h1>
            <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div class="lg:col-span-2 space-y-4" id="cart-items">
                    </div>
                <div id="empty-cart" class="hidden lg:col-span-2 text-center py-16 bg-white rounded-lg shadow">
                    <i class="fas fa-shopping-cart text-6xl text-gray-300 mb-4"></i>
                    <h3 class="text-xl font-semibold">Your cart is empty</h3>
                    <button onclick="showProducts('all')" class="mt-4 bg-flashit-green text-white px-6 py-2 rounded">Start Shopping</button>
                </div>
                <div class="lg:col-span-1">
                    <div class="cart-summary p-6">
                        <h2 class="text-xl font-semibold mb-4 cart-summary-header text-white p-4 -m-6 rounded-t-lg">Order Summary</h2>
                        <div class="space-y-2 mt-6">
                            <div class="flex justify-between"><span>Subtotal:</span><span id="subtotal">₹0.00</span></div>
                            <div class="flex justify-between"><span>Shipping:</span><span id="shipping">₹0.00</span></div>
                            <div class="flex justify-between"><span>Tax (8%):</span><span id="tax">₹0.00</span></div>
                            <hr class="my-2">
                            <div class="flex justify-between font-bold text-lg"><span>Total:</span><span id="total">₹0.00</span></div>
                        </div>
                        <div id="shipping-banner" class="mt-4 bg-green-50 p-3 rounded-lg"><div id="shipping-progress"></div></div>
                        <button onclick="checkout()" class="checkout-btn w-full mt-6"><span>Proceed to Checkout</span></button>
                    </div>
                </div>
            </div>
        </div>`;
    window.scrollTo(0, 0);
    cart.displayCartItems(); // Tell cart.js to render the items
}

function showLogin() {
    cart.showNotification('This is a demo. Login is not implemented.', 'info');
}
function showRegister() {
    cart.showNotification('This is a demo. Registration is not implemented.', 'info');
}