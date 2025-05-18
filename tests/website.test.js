/**
 * MillBrook Pizza Shop Website Tests
 * 
 * These tests verify the core functionality of the MillBrook Pizza website
 * including navigation, menu loading, cart functionality, and checkout process.
 */

const puppeteer = require('puppeteer');
const path = require('path');

// Helper function to get the file URL
const getFileUrl = (relativePath) => {
  return `file://${path.resolve(process.cwd(), relativePath)}`;
};

// Test configuration
const config = {
  headless: false,
  slowMo: 50,
  timeout: 10000
};

describe('MillBrook Pizza Website Tests', () => {
  let browser;
  let page;
  
  // Setup before all tests
  beforeAll(async () => {
    browser = await puppeteer.launch({
      headless: config.headless,
      slowMo: config.slowMo
    });
    page = await browser.newPage();
    
    // Set default timeout
    jest.setTimeout(config.timeout);
  });
  
  // Cleanup after all tests
  afterAll(async () => {
    await browser.close();
  });
  
  // Test case 1: Basic page loading
  test('should load the homepage successfully', async () => {
    await page.goto(getFileUrl('index.html'));
    
    // Check if the page title is correct
    const title = await page.title();
    expect(title).toContain('MillBrook Pizza');
    
    // Check if the main heading is present
    const heading = await page.$eval('h1', el => el.textContent);
    expect(heading).toBe('MillBrook Pizza');
  });
  
  // Test case 2: Navigation menu works
  test('should navigate to different sections', async () => {
    await page.goto(getFileUrl('index.html'));
    
    // Click on Menu link
    await page.click('nav a[href="#menu"]');
    
    // Wait for scroll to complete and menu section to be visible
    await page.waitForFunction(() => {
      const menuSection = document.querySelector('#menu');
      const rect = menuSection.getBoundingClientRect();
      return rect.top >= 0 && rect.top <= window.innerHeight;
    });
    
    // Check if menu heading is visible
    const menuHeading = await page.$eval('#menu h2', el => el.textContent);
    expect(menuHeading).toBe('Our Menu');
  });
  
  // Test case 3: Menu items display correctly
  test('should display menu items', async () => {
    await page.goto(getFileUrl('index.html'));
    
    // Navigate to menu section
    await page.click('nav a[href="#menu"]');
    
    // Wait for menu items to load
    await page.waitForSelector('.menu-items');
    
    // Check if menu items are present
    const menuItemsExist = await page.evaluate(() => {
      // We'll check for any category sections
      const categories = document.querySelectorAll('.category-section');
      return categories.length > 0;
    });
    
    expect(menuItemsExist).toBe(true);
  });
  
  // Test case 4: Adding items to cart
  test('should add items to the cart', async () => {
    await page.goto(getFileUrl('index.html'));
    
    // Navigate to order section
    await page.click('nav a[href="#order"]');
    
    // Wait for order section to load
    await page.waitForSelector('.menu-selection');
    
    // Find the first Add to Cart button and click it
    await page.waitForSelector('.add-to-cart');
    await page.click('.add-to-cart');
    
    // Check that the cart total has been updated
    const cartTotal = await page.$eval('#cart-total', el => parseFloat(el.textContent));
    expect(cartTotal).toBeGreaterThan(0);
    
    // Check that cart item is displayed
    const cartItemExists = await page.evaluate(() => {
      return document.querySelector('.cart-item') !== null;
    });
    
    expect(cartItemExists).toBe(true);
  });
  
  // Test case 5: Cart functionality (increase/decrease/remove)
  test('should increase, decrease, and remove items from the cart', async () => {
    await page.goto(getFileUrl('index.html'));
    
    // Navigate to order section
    await page.click('nav a[href="#order"]');
    
    // Wait for order section to load
    await page.waitForSelector('.menu-selection');
    
    // Add an item to the cart
    await page.waitForSelector('.add-to-cart');
    await page.click('.add-to-cart');
    
    // Wait for cart item to appear
    await page.waitForSelector('.cart-item');
    
    // Get initial quantity and total
    const initialQuantity = await page.$eval('.quantity', el => parseInt(el.textContent));
    const initialTotal = await page.$eval('#cart-total', el => parseFloat(el.textContent));
    
    // Increase quantity
    await page.click('.btn-increase');
    
    // Wait for cart to update
    await page.waitForFunction(() => {
      const newQuantity = document.querySelector('.quantity').textContent;
      return parseInt(newQuantity) > 1;
    });
    
    // Check if quantity increased
    const increasedQuantity = await page.$eval('.quantity', el => parseInt(el.textContent));
    expect(increasedQuantity).toBe(initialQuantity + 1);
    
    // Check if total increased
    const increasedTotal = await page.$eval('#cart-total', el => parseFloat(el.textContent));
    expect(increasedTotal).toBeGreaterThan(initialTotal);
    
    // Decrease quantity
    await page.click('.btn-decrease');
    
    // Wait for cart to update
    await page.waitForFunction(() => {
      const newQuantity = document.querySelector('.quantity').textContent;
      return parseInt(newQuantity) === 1;
    });
    
    // Check if quantity decreased
    const decreasedQuantity = await page.$eval('.quantity', el => parseInt(el.textContent));
    expect(decreasedQuantity).toBe(initialQuantity);
    
    // Remove item from cart
    await page.click('.btn-remove');
    
    // Check if cart is empty
    const cartIsEmpty = await page.evaluate(() => {
      return document.querySelector('.cart-item') === null;
    });
    
    expect(cartIsEmpty).toBe(true);
  });
  
  // Test case 6: Checkout process
  test('should proceed to checkout with items in cart', async () => {
    await page.goto(getFileUrl('index.html'));
    
    // Navigate to order section
    await page.click('nav a[href="#order"]');
    
    // Wait for order section to load
    await page.waitForSelector('.menu-selection');
    
    // Add an item to the cart
    await page.waitForSelector('.add-to-cart');
    await page.click('.add-to-cart');
    
    // Wait for cart item to appear
    await page.waitForSelector('.cart-item');
    
    // Click checkout button
    await page.click('#checkout-btn');
    
    // Check if checkout section is visible
    const checkoutVisible = await page.evaluate(() => {
      return !document.querySelector('.checkout-section').classList.contains('hidden');
    });
    
    expect(checkoutVisible).toBe(true);
  });
  
  // Test case 7: Form validation
  test('should validate checkout form fields', async () => {
    await page.goto(getFileUrl('index.html'));
    
    // Navigate to order section
    await page.click('nav a[href="#order"]');
    
    // Add an item to the cart
    await page.waitForSelector('.add-to-cart');
    await page.click('.add-to-cart');
    
    // Go to checkout
    await page.click('#checkout-btn');
    
    // Try to submit form without filling required fields
    await page.click('#checkout-form button[type="submit"]');
    
    // Check if form validation prevents submission
    const checkoutSectionStillVisible = await page.evaluate(() => {
      return !document.querySelector('.checkout-section').classList.contains('hidden');
    });
    
    expect(checkoutSectionStillVisible).toBe(true);
  });
  
  // Test case 8: Contact information display
  test('should display contact information correctly', async () => {
    await page.goto(getFileUrl('index.html'));
    
    // Navigate to contact section
    await page.click('nav a[href="#contact"]');
    
    // Wait for contact section to be visible
    await page.waitForFunction(() => {
      const contactSection = document.querySelector('#contact');
      const rect = contactSection.getBoundingClientRect();
      return rect.top >= 0 && rect.top <= window.innerHeight;
    });
    
    // Check if phone number is displayed correctly
    const phoneNumber = await page.$eval('.contact-info p:nth-child(5)', el => el.textContent);
    expect(phoneNumber).toBe('(555) 123-4567');
    
    // Check if email is displayed correctly
    const email = await page.$eval('.contact-info p:nth-child(7)', el => el.textContent);
    expect(email).toBe('info@millbrookpizza.com');
  });
  
  // Test case 9: Testing for infinite loops or issues
  test('should not exhibit infinite loop behavior', async () => {
    await page.goto(getFileUrl('index.html'));
    
    // Wait for a moment to see if any erratic behavior occurs
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    // Check if the navigation works after waiting
    await page.click('nav a[href="#menu"]');
    
    // Verify we can still interact with the page
    const menuVisible = await page.evaluate(() => {
      const menuSection = document.querySelector('#menu');
      const rect = menuSection.getBoundingClientRect();
      return rect.top >= 0 && rect.top <= window.innerHeight;
    });
    
    expect(menuVisible).toBe(true);
  });
});