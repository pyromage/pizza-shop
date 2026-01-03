// Pizza toppings data
const veggies = ['Black Olives', 'Green Olives', 'Green Peppers', 'Hot Peppers', 'Jalapeño Peppers', 'Mushrooms', 'Onions', 'Pineapple', 'Tomatoes'];
const protein = ['Anchovies', 'Bacon', 'Chicken', 'Ham', 'Pepperoni', 'Salami', 'Sausage'];
const maxToppings = veggies.length + protein.length;

// Pricing
const base = { s: 12.10, m: 15.25, l: 18.00, xl: 19.35 };
const perTopping = { s: 0.80, m: 1.50, l: 1.75, xl: 2.05 };

let toppings = 1;

function updatePrices() {
    document.getElementById('price-s').textContent = '$' + (base.s + perTopping.s * toppings).toFixed(2);
    document.getElementById('price-m').textContent = '$' + (base.m + perTopping.m * toppings).toFixed(2);
    document.getElementById('price-l').textContent = '$' + (base.l + perTopping.l * toppings).toFixed(2);
    document.getElementById('price-xl').textContent = '$' + (base.xl + perTopping.xl * toppings).toFixed(2);
    document.getElementById('topping-count').textContent = toppings;
}

function decrementToppings() {
    toppings = Math.max(1, toppings - 1);
    updatePrices();
}

function incrementToppings() {
    toppings = Math.min(maxToppings, toppings + 1);
    updatePrices();
}

// Highlight today's hours
function highlightToday() {
    const today = new Date().getDay();
    const hourLines = document.querySelectorAll('.hours-line');
    
    hourLines.forEach(line => {
        const dayMap = {
            'Mon': 1,
            'Tue': 2,
            'Wed-Sat': [3, 4, 5, 6],
            'Sun': 0
        };
        
        const text = line.textContent;
        for (const [key, days] of Object.entries(dayMap)) {
            if (text.startsWith(key)) {
                const isToday = Array.isArray(days) ? days.includes(today) : days === today;
                if (isToday) {
                    line.classList.add('today');
                }
                break;
            }
        }
    });
}

// Initialize on DOM ready
document.addEventListener('DOMContentLoaded', () => {
    // Set toppings display
    document.getElementById('veggies-list').textContent = veggies.join(', ');
    document.getElementById('protein-list').textContent = protein.join(', ');
    
    // Set up button handlers
    document.getElementById('decrement-btn').addEventListener('click', decrementToppings);
    document.getElementById('increment-btn').addEventListener('click', incrementToppings);
    
    // Initialize prices
    updatePrices();
    
    // Highlight today
    highlightToday();
});
