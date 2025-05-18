// Cart functionality
const cart = {
    items: [],
    total: 0,
    
    // Add item to cart
    addItem: function(item) {
        // Check if item already exists in cart
        const existingItem = this.items.find(cartItem => cartItem.id === item.id);
        
        if (existingItem) {
            // Increment quantity if item already exists
            existingItem.quantity++;
            existingItem.subtotal = existingItem.price * existingItem.quantity;
        } else {
            // Add new item to cart
            this.items.push({
                id: item.id,
                name: item.name,
                price: item.price,
                quantity: 1,
                subtotal: item.price
            });
        }
        
        // Update total
        this.calculateTotal();
        
        // Update UI
        this.displayCart();
    },
    
    // Remove item from cart
    removeItem: function(id) {
        const index = this.items.findIndex(item => item.id === id);
        
        if (index !== -1) {
            this.items.splice(index, 1);
            
            // Update total
            this.calculateTotal();
            
            // Update UI
            this.displayCart();
        }
    },
    
    // Update item quantity
    updateQuantity: function(id, quantity) {
        const item = this.items.find(item => item.id === id);
        
        if (item) {
            if (quantity <= 0) {
                // Remove item if quantity is 0 or negative
                this.removeItem(id);
                return;
            }
            
            item.quantity = quantity;
            item.subtotal = item.price * item.quantity;
            
            // Update total
            this.calculateTotal();
            
            // Update UI
            this.displayCart();
        }
    },
    
    // Calculate total
    calculateTotal: function() {
        this.total = this.items.reduce((total, item) => total + item.subtotal, 0);
    },
    
    // Display cart
    displayCart: function() {
        try {
            const cartItems = document.getElementById('cart-items');
            const cartTotal = document.getElementById('cart-total');
            
            // Check if elements exist
            if (!cartItems || !cartTotal) {
                console.error('Cart elements not found');
                return;
            }
            
            // Clear cart items
            cartItems.innerHTML = '';
            
            // Safety check to make sure items is an array
            if (!Array.isArray(this.items)) {
                console.error('Cart items is not an array', this.items);
                this.items = [];
                return;
            }
            
            // Add each item to cart display
            this.items.forEach(item => {
                try {
                    if (!item || !item.id) {
                        console.warn('Invalid cart item:', item);
                        return;
                    }
                    
                    const cartItem = document.createElement('div');
                    cartItem.className = 'cart-item';
                    cartItem.dataset.itemId = item.id;
                    
                    // Ensure values are valid
                    const name = item.name || 'Unknown item';
                    const price = isNaN(item.price) ? 0 : item.price;
                    const quantity = isNaN(item.quantity) ? 1 : item.quantity;
                    const subtotal = isNaN(item.subtotal) ? price * quantity : item.subtotal;
                    
                    cartItem.innerHTML = `
                        <div class="cart-item-details">
                            <h4>${name}</h4>
                            <p>$${price.toFixed(2)} × ${quantity}</p>
                        </div>
                        <div class="cart-item-actions">
                            <span class="cart-item-subtotal">$${subtotal.toFixed(2)}</span>
                            <div class="quantity-controls">
                                <button class="btn-decrease" data-id="${item.id}">-</button>
                                <span class="quantity">${quantity}</span>
                                <button class="btn-increase" data-id="${item.id}">+</button>
                            </div>
                            <button class="btn-remove" data-id="${item.id}">×</button>
                        </div>
                    `;
                    
                    // Add event listeners for cart item controls using proper error handling
                    const decreaseBtn = cartItem.querySelector('.btn-decrease');
                    if (decreaseBtn) {
                        decreaseBtn.addEventListener('click', () => {
                            this.updateQuantity(item.id, quantity - 1);
                        });
                    }
                    
                    const increaseBtn = cartItem.querySelector('.btn-increase');
                    if (increaseBtn) {
                        increaseBtn.addEventListener('click', () => {
                            this.updateQuantity(item.id, quantity + 1);
                        });
                    }
                    
                    const removeBtn = cartItem.querySelector('.btn-remove');
                    if (removeBtn) {
                        removeBtn.addEventListener('click', () => {
                            this.removeItem(item.id);
                        });
                    }
                    
                    cartItems.appendChild(cartItem);
                } catch (itemError) {
                    console.error('Error adding item to cart display:', itemError);
                }
            });
            
            // Update total
            cartTotal.textContent = this.total.toFixed(2);
            
            // Update checkout button state
            const checkoutBtn = document.getElementById('checkout-btn');
            if (checkoutBtn) {
                checkoutBtn.disabled = this.items.length === 0;
            }
        } catch (error) {
            console.error('Error displaying cart:', error);
        }
    },
    
    // Clear cart
    clearCart: function() {
        this.items = [];
        this.total = 0;
        this.displayCart();
    }
};

// Function to add an item to the cart
function addToCart(item) {
    cart.addItem(item);
    
    // Animation to show item was added
    const addedAnimation = document.createElement('div');
    addedAnimation.className = 'added-to-cart';
    addedAnimation.textContent = 'Added to cart!';
    document.body.appendChild(addedAnimation);
    
    // Remove animation after a short time
    setTimeout(() => {
        addedAnimation.remove();
    }, 2000);
}