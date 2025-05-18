# Testing Instructions for MillBrook Pizza Website

This document provides instructions for testing the MillBrook Pizza website locally to identify and fix any issues.

## Manual Testing

### Basic Functionality Testing

1. **Open the website**
   ```
   open index.html
   ```

2. **Navigation Testing**
   - Click each navigation link (Home, Menu, Order Online, Contact)
   - Verify smooth scrolling to each section
   - Verify all sections load correctly

3. **Menu Display Testing**
   - Verify all menu categories display correctly
   - Verify all menu items have names, descriptions, and prices
   - Verify images load (or show placeholder)

4. **Ordering System Testing**
   - Add items to cart using "Add to Cart" buttons
   - Increase/decrease item quantities
   - Remove items from cart
   - Verify cart total updates correctly

5. **Checkout Process Testing**
   - Click "Checkout" button with items in cart
   - Fill out checkout form
   - Submit order
   - Verify confirmation modal appears
   - Verify modal can be closed and cart is cleared

### Debug Console

For detailed debugging, open the debug.html file:
```
open debug.html
```

Use the diagnostic tools:
- **Monitor DOM Changes**: Detects excessive or unusual DOM manipulations
- **Detect Loops**: Monitors for potential infinite loops
- **Check Timers**: Identifies active timers that might cause issues
- **Run All Tests**: Runs all diagnostic tests at once

## Automated Testing

### Setting Up Test Environment

1. Install dependencies:
   ```
   npm install
   ```

2. Run the tests:
   ```
   npm test
   ```

### Available Test Suites

1. **website.test.js**: Tests core website functionality
   - Page loading
   - Navigation
   - Menu display
   - Cart functionality
   - Checkout process
   - Form validation

2. **infinite-loop.test.js**: Specifically tests for infinite loop issues
   - DOM mutation monitoring
   - Memory leak detection
   - Long-running JavaScript detection

## Common Issues and Fixes

### Infinite Loop / Blinking Menu Items

This issue might be caused by:
1. Circular dependencies in JavaScript
2. Infinite recursion in display functions
3. Excessive DOM mutations
4. Unhandled errors causing repeated reinitialization

Fix strategies implemented:
1. Added error handling to all display functions
2. Fixed potential issues with Stripe payment integration
3. Prevented multiple initializations
4. Fixed event listeners to prevent memory leaks
5. Added validation for all data before DOM operations

### Browser Compatibility

The website has been tested with:
- Chrome (latest)
- Firefox (latest)
- Safari (latest)

For best results, use a modern browser with JavaScript enabled.

## Reporting Additional Issues

If you encounter any other issues while testing, please document:
1. The steps to reproduce the issue
2. Which browser and version you're using
3. Any error messages in the console (press F12 to open developer tools)
4. Screenshots if applicable