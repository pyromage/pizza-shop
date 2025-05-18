// Pizza menu data
const menuItems = [
    {
        id: 1,
        name: "Classic Margherita",
        description: "Fresh mozzarella, tomato sauce, fresh basil",
        price: 12.99,
        image: "images/margherita.jpg",
        category: "Classic Pizzas"
    },
    {
        id: 2,
        name: "Pepperoni",
        description: "Pepperoni, mozzarella, tomato sauce",
        price: 14.99,
        image: "images/pepperoni.jpg",
        category: "Classic Pizzas"
    },
    {
        id: 3,
        name: "Meat Lovers",
        description: "Pepperoni, sausage, bacon, ham, mozzarella, tomato sauce",
        price: 16.99,
        image: "images/meat-lovers.jpg",
        category: "Specialty Pizzas"
    },
    {
        id: 4,
        name: "Veggie Supreme",
        description: "Bell peppers, onions, mushrooms, olives, tomatoes, mozzarella, tomato sauce",
        price: 15.99,
        image: "images/veggie.jpg",
        category: "Specialty Pizzas"
    },
    {
        id: 5,
        name: "BBQ Chicken",
        description: "Grilled chicken, red onions, cilantro, BBQ sauce, mozzarella",
        price: 16.99,
        image: "images/bbq-chicken.jpg",
        category: "Specialty Pizzas"
    },
    {
        id: 6,
        name: "Hawaiian",
        description: "Ham, pineapple, mozzarella, tomato sauce",
        price: 14.99,
        image: "images/hawaiian.jpg",
        category: "Classic Pizzas"
    },
    {
        id: 7,
        name: "Buffalo Chicken",
        description: "Buffalo chicken, blue cheese, mozzarella, buffalo sauce drizzle",
        price: 16.99,
        image: "images/buffalo-chicken.jpg",
        category: "Specialty Pizzas"
    },
    {
        id: 8,
        name: "Spinach & Feta",
        description: "Fresh spinach, feta cheese, garlic, olive oil, mozzarella",
        price: 15.99,
        image: "images/spinach-feta.jpg",
        category: "Specialty Pizzas"
    }
];

// Sides menu data
const sideItems = [
    {
        id: 101,
        name: "Garlic Knots",
        description: "6 knots with garlic butter and parmesan",
        price: 5.99,
        image: "images/garlic-knots.jpg",
        category: "Sides"
    },
    {
        id: 102,
        name: "Mozzarella Sticks",
        description: "6 sticks with marinara sauce",
        price: 6.99,
        image: "images/mozzarella-sticks.jpg",
        category: "Sides"
    },
    {
        id: 103,
        name: "Caesar Salad",
        description: "Romaine, croutons, parmesan, caesar dressing",
        price: 7.99,
        image: "images/caesar-salad.jpg",
        category: "Sides"
    },
    {
        id: 104,
        name: "Buffalo Wings",
        description: "8 wings with blue cheese dressing",
        price: 9.99,
        image: "images/buffalo-wings.jpg",
        category: "Sides"
    }
];

// Drinks menu data
const drinkItems = [
    {
        id: 201,
        name: "Soda",
        description: "Coke, Diet Coke, Sprite, Root Beer (20oz)",
        price: 2.49,
        image: "images/soda.jpg",
        category: "Drinks"
    },
    {
        id: 202,
        name: "Bottled Water",
        description: "16oz bottled water",
        price: 1.99,
        image: "images/water.jpg",
        category: "Drinks"
    },
    {
        id: 203,
        name: "Iced Tea",
        description: "Sweet or unsweet (20oz)",
        price: 2.49,
        image: "images/iced-tea.jpg",
        category: "Drinks"
    }
];

// Combine all items
const allItems = [...menuItems, ...sideItems, ...drinkItems];

// DOM elements
const menuSection = document.querySelector('.menu-items');
const menuSelection = document.querySelector('.menu-selection');
const checkoutBtn = document.getElementById('checkout-btn');
const checkoutSection = document.getElementById('checkout');
const orderSection = document.getElementById('order');
const checkoutForm = document.getElementById('checkout-form');
const orderConfirmation = document.getElementById('order-confirmation');
const closeModal = document.querySelector('.close');
const orderNumber = document.getElementById('order-number');
const confirmationPickupTime = document.getElementById('confirmation-pickup-time');
const confirmationEmail = document.getElementById('confirmation-email');

// Display menu items in the menu section
function displayMenu() {
    try {
        // Check if menu section exists
        if (!menuSection) {
            console.error('Menu section element not found');
            return;
        }

        // Group items by category
        const itemsByCategory = allItems.reduce((acc, item) => {
            if (!acc[item.category]) {
                acc[item.category] = [];
            }
            acc[item.category].push(item);
            return acc;
        }, {});

        // Clear the menu section only once
        menuSection.innerHTML = '';

        // Create a section for each category
        Object.keys(itemsByCategory).forEach(category => {
            const categorySection = document.createElement('div');
            categorySection.className = 'category-section';
            
            const categoryTitle = document.createElement('h3');
            categoryTitle.textContent = category;
            categorySection.appendChild(categoryTitle);
            
            const categoryItems = document.createElement('div');
            categoryItems.className = 'menu-items-grid';
            
            // Add items for this category
            itemsByCategory[category].forEach(item => {
                const menuItem = createMenuItemElement(item, false);
                if (menuItem) { // Only append if we got a valid menu item
                    categoryItems.appendChild(menuItem);
                }
            });
            
            categorySection.appendChild(categoryItems);
            menuSection.appendChild(categorySection);
        });
    } catch (error) {
        console.error('Error displaying menu:', error);
    }
}

// Display menu items in the order section
function displayOrderMenu() {
    try {
        // Check if menu selection section exists
        if (!menuSelection) {
            console.error('Menu selection element not found');
            return;
        }

        // Group items by category
        const itemsByCategory = allItems.reduce((acc, item) => {
            if (!acc[item.category]) {
                acc[item.category] = [];
            }
            acc[item.category].push(item);
            return acc;
        }, {});

        // Clear the menu selection section
        menuSelection.innerHTML = '';

        // Create a section for each category
        Object.keys(itemsByCategory).forEach(category => {
            const categorySection = document.createElement('div');
            categorySection.className = 'category-section';
            
            const categoryTitle = document.createElement('h3');
            categoryTitle.textContent = category;
            categorySection.appendChild(categoryTitle);
            
            const categoryItems = document.createElement('div');
            categoryItems.className = 'menu-items-grid';
            
            // Add items for this category
            itemsByCategory[category].forEach(item => {
                const menuItem = createMenuItemElement(item, true);
                if (menuItem) { // Only append if we got a valid menu item
                    categoryItems.appendChild(menuItem);
                }
            });
            
            categorySection.appendChild(categoryItems);
            menuSelection.appendChild(categorySection);
        });
    } catch (error) {
        console.error('Error displaying order menu:', error);
    }
}

// Create a menu item element
function createMenuItemElement(item, withAddButton) {
    try {
        // Validate item object
        if (!item || typeof item !== 'object') {
            console.error('Invalid menu item:', item);
            return null;
        }
        
        // Create element
        const menuItem = document.createElement('div');
        menuItem.className = 'menu-item';
        
        // Create a placeholder - use data URI instead of a file to prevent loading issues
        const placeholderImage = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgZmlsbD0iI2VlZSIvPjx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBmb250LWZhbWlseT0iQXJpYWwiIGZvbnQtc2l6ZT0iMjAiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGZpbGw9IiM5OTkiPk5vIEltYWdlPC90ZXh0Pjwvc3ZnPg==';
        const imageUrl = item.image || placeholderImage;
        const name = item.name || 'Unknown Item';
        const description = item.description || 'No description available';
        let price = 0;
        
        try {
            price = parseFloat(item.price) || 0;
        } catch (e) {
            console.warn('Invalid price for item:', item.name);
        }
        
        // Create HTML content safely
        menuItem.innerHTML = `
            <div class="menu-item-content">
                <h3>${name}</h3>
                <p>${description}</p>
                <p class="price">$${price.toFixed(2)}</p>
                ${withAddButton ? `<button class="btn add-to-cart" data-id="${item.id}">Add to Cart</button>` : ''}
            </div>
        `;
        
        // Create image element manually instead of using innerHTML
        const imgElement = document.createElement('img');
        imgElement.alt = name;
        
        // Only set up error handler for actual image URLs (not data URIs)
        if (!imageUrl.startsWith('data:')) {
            imgElement.onerror = function() {
                console.log('Image failed to load, using placeholder');
                this.onerror = null; // Remove handler to prevent loops
                this.src = placeholderImage;
            };
        }
        
        // Set the src - either URL or placeholder
        imgElement.src = imageUrl;
        
        // Add to the beginning of the menuItem
        menuItem.insertBefore(imgElement, menuItem.firstChild);
        
        // Add event listener if needed
        if (withAddButton) {
            const addButton = menuItem.querySelector('.add-to-cart');
            if (addButton) {
                // Use a one-time event listener to prevent memory leaks
                addButton.addEventListener('click', function onAddToCart() {
                    addToCart(item);
                    // Clean up the event listener to prevent potential memory leaks
                    // from duplicate initialization
                    this.removeEventListener('click', onAddToCart);
                });
            }
        }
        
        return menuItem;
    } catch (error) {
        console.error('Error creating menu item element:', error);
        return null;
    }
}

// Initialize the application
function init() {
    displayMenu();
    displayOrderMenu();
    
    // Event listeners
    checkoutBtn.addEventListener('click', () => {
        // Only proceed to checkout if cart is not empty
        if (cart.items.length > 0) {
            orderSection.classList.add('hidden');
            checkoutSection.classList.remove('hidden');
            
            // Scroll to the checkout section
            window.scrollTo({
                top: document.querySelector('.checkout-section').offsetTop - 100,
                behavior: 'smooth'
            });
        } else {
            alert('Your cart is empty. Please add items to your order.');
        }
    });
    
    checkoutForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        // Here you would normally process payment
        // For now, we'll just show the confirmation
        window.processOrder();
    });
    
    // Make sure the close button exists before adding an event listener
    if (closeModal) {
        closeModal.addEventListener('click', () => {
            // Hide the confirmation modal
            if (orderConfirmation) {
                orderConfirmation.classList.add('hidden');
                orderConfirmation.style.display = 'none';
            }
            
            // Reset the form and cart
            if (checkoutForm) {
                checkoutForm.reset();
            }
            
            if (typeof cart !== 'undefined' && cart.clearCart) {
                cart.clearCart();
            }
            
            // Go back to the home page
            window.location.href = '#home';
            
            // Show the order section and hide the checkout section
            if (orderSection) {
                orderSection.classList.remove('hidden');
            }
            
            if (checkoutSection) {
                checkoutSection.classList.add('hidden');
            }
        });
    }
    
    // Smooth scrolling for navigation
    document.querySelectorAll('nav a').forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            
            window.scrollTo({
                top: targetSection.offsetTop - 100,
                behavior: 'smooth'
            });
        });
    });
}

// Process the order - made global for payment.js to access
window.processOrder = function() {
    // Generate a random order number
    const orderNum = Math.floor(Math.random() * 1000000).toString().padStart(6, '0');
    
    // Get form data (check if elements exist to avoid errors)
    const nameEl = document.getElementById('name');
    const emailEl = document.getElementById('email');
    const pickupTimeEl = document.getElementById('pickup-time');
    const phoneEl = document.getElementById('phone');
    
    if (!nameEl || !emailEl || !pickupTimeEl) {
        console.error('Form elements not found');
        return;
    }
    
    const name = nameEl.value;
    const email = emailEl.value;
    const pickupTime = pickupTimeEl.value;
    
    // Check that we have valid data
    if (!name || !email || !pickupTime) {
        alert('Please fill in all required fields.');
        return;
    }
    
    // Update the confirmation modal
    orderNumber.textContent = orderNum;
    confirmationEmail.textContent = email;
    
    // Format pickup time
    const timeArray = pickupTime.split(':');
    const hours = parseInt(timeArray[0]);
    const minutes = timeArray[1];
    const ampm = hours >= 12 ? 'PM' : 'AM';
    const formattedHours = hours % 12 || 12;
    confirmationPickupTime.textContent = `${formattedHours}:${minutes} ${ampm}`;
    
    // Show the confirmation modal
    if (orderConfirmation) {
        orderConfirmation.classList.remove('hidden');
        orderConfirmation.style.display = 'flex';
    }
    
    // In a real application, you would send the order details to a serverless function
    // For example, using AWS Lambda via API Gateway
    const orderDetails = {
        orderNumber: orderNum,
        customer: {
            name,
            email,
            phone: phoneEl ? phoneEl.value : ''
        },
        pickupTime,
        items: cart.items,
        total: cart.total
    };
    
    console.log('Order details:', orderDetails);
    
    // This would normally be sent to a serverless function
    // sendOrderToServer(orderDetails);
}

// Completely new initialization approach
// Use a flag on the window object to ensure we only initialize once
if (!window.millbrookInitialized) {
    window.millbrookInitialized = true;
    
    // Only initialize when DOM is fully loaded
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initializeOnce);
    } else {
        // DOM already loaded, initialize immediately
        setTimeout(initializeOnce, 0);
    }
}

// Initialize only once with all error handling
function initializeOnce() {
    try {
        console.log('Initializing MillBrook Pizza app...');
        init();
        console.log('Initialization complete.');
    } catch (error) {
        console.error('Error during initialization:', error);
    }
}