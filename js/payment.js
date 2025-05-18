// Simplified payment integration with no Stripe dependency
// This removes the external dependency which may be causing issues

console.log('Simple payment module loaded');

// Mock payment processing
function processPayment(orderDetails, callback) {
    console.log('Processing payment for order:', orderDetails);
    
    // Simulate processing time
    setTimeout(() => {
        // Always succeed in this demo
        const result = {
            success: true,
            transactionId: 'DEMO-' + Math.floor(Math.random() * 1000000),
            message: 'Payment processed successfully'
        };
        
        if (callback && typeof callback === 'function') {
            callback(null, result);
        }
        
    }, 1500); // 1.5 second delay to simulate processing
}

// Export function to global scope for use in main.js
window.processPayment = processPayment;