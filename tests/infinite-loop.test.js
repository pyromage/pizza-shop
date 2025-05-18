/**
 * Specific test for identifying infinite loop issues in MillBrook Pizza website
 */

const puppeteer = require('puppeteer');
const path = require('path');

// Helper function to get the file URL
const getFileUrl = (relativePath) => {
  return `file://${path.resolve(process.cwd(), relativePath)}`;
};

// Configuration
const config = {
  headless: false,
  slowMo: 50,
  timeout: 30000, // Longer timeout to observe issues
  observationTime: 10000 // Time to observe potential infinite loops
};

describe('Infinite Loop Detection Tests', () => {
  let browser;
  let page;
  
  beforeAll(async () => {
    browser = await puppeteer.launch({
      headless: config.headless,
      slowMo: config.slowMo,
      devtools: true // Open DevTools for debugging
    });
    
    page = await browser.newPage();
    
    // Enable precise error and console logging
    page.on('console', msg => console.log('PAGE LOG:', msg.text()));
    page.on('pageerror', err => console.error('PAGE ERROR:', err.message));
    
    // Set default timeout
    jest.setTimeout(config.timeout);
  });
  
  afterAll(async () => {
    await browser.close();
  });
  
  test('should not have infinite DOM mutations or loops', async () => {
    // Navigate to the page
    await page.goto(getFileUrl('index.html'));
    
    // First, check if we can identify any problematic code execution
    await page.evaluate(() => {
      // Create a mutation counter
      window.__mutationCount = 0;
      window.__lastMutationTime = Date.now();
      
      // Create a mutation observer to monitor rapid DOM changes
      const observer = new MutationObserver(mutations => {
        window.__mutationCount += mutations.length;
        window.__lastMutationTime = Date.now();
        
        // Log if we see a high rate of mutations
        if (mutations.length > 10) {
          console.warn('High mutation rate detected:', mutations.length, 'mutations');
          console.warn('Affected elements:', mutations.map(m => m.target.tagName || 'unknown').join(', '));
        }
      });
      
      // Observe the entire document for changes
      observer.observe(document.body, {
        attributes: true,
        childList: true,
        subtree: true,
        characterData: true
      });
      
      // Store the observer for later access
      window.__mutationObserver = observer;
    });
    
    // Let the page run for a while to detect issues
    console.log('Observing page for potential infinite loops...');
    await new Promise(resolve => setTimeout(resolve, config.observationTime));
    
    // Check the mutation count and time
    const mutationData = await page.evaluate(() => {
      // Disconnect the observer
      if (window.__mutationObserver) {
        window.__mutationObserver.disconnect();
      }
      
      return {
        count: window.__mutationCount,
        timeSinceLastMutation: Date.now() - window.__lastMutationTime
      };
    });
    
    console.log(`Detected ${mutationData.count} DOM mutations`);
    console.log(`Time since last mutation: ${mutationData.timeSinceLastMutation}ms`);
    
    // Flag excessive mutations as potential infinite loops
    // Note: The threshold needs adjustment based on normal page behavior
    const excessiveMutationThreshold = 1000; // Example threshold
    
    // If we're seeing mutations right up until the end of our observation window
    // and the count is high, we might have an infinite loop
    const potentialInfiniteLoop = mutationData.count > excessiveMutationThreshold && 
                                  mutationData.timeSinceLastMutation < 200;
    
    if (potentialInfiniteLoop) {
      console.error('Potential infinite loop detected!');
      
      // Try to identify the problem by injecting performance marks
      await page.evaluate(() => {
        // Monitor for recursive function calls
        const originalSetTimeout = window.setTimeout;
        let timeoutCount = 0;
        
        window.setTimeout = function(callback, delay) {
          timeoutCount++;
          if (timeoutCount > 100 && delay < 50) {
            console.warn('Excessive setTimeout calls detected', {timeoutCount, delay});
            console.trace('setTimeout stack trace');
          }
          return originalSetTimeout(callback, delay);
        };
        
        // Log component rendering if using a framework
        console.log('Potential components or functions causing issues:');
        console.log('Active intervals:', window.setInterval);
        console.log('Script elements:', document.querySelectorAll('script').length);
      });
      
      // Take a screenshot for visual evidence
      await page.screenshot({path: 'infinite-loop-evidence.png'});
      
      // Wait a bit longer to gather more data if needed
      await new Promise(resolve => setTimeout(resolve, 2000));
    }
    
    // This assertion will fail if we detect an infinite loop
    expect(potentialInfiniteLoop).toBe(false);
  });

  test('should monitor for memory leaks or excessive resource usage', async () => {
    // Navigate to the page
    await page.goto(getFileUrl('index.html'));
    
    // Take initial memory snapshot
    const initialMemory = await page.evaluate(() => performance.memory ? performance.memory.usedJSHeapSize : 0);
    
    // Let the page run for a while
    await new Promise(resolve => setTimeout(resolve, config.observationTime / 2));
    
    // Interact with the page to trigger potential issues
    await page.click('nav a[href="#menu"]');
    await page.click('nav a[href="#order"]');
    await page.click('nav a[href="#contact"]');
    await page.click('nav a[href="#home"]');
    
    // Wait for more potential issues
    await new Promise(resolve => setTimeout(resolve, config.observationTime / 2));
    
    // Take final memory snapshot
    const finalMemory = await page.evaluate(() => performance.memory ? performance.memory.usedJSHeapSize : 0);
    
    // Calculate memory increase
    const memoryIncrease = finalMemory - initialMemory;
    const memoryIncreaseMB = memoryIncrease / (1024 * 1024);
    
    console.log(`Memory usage increased by ${memoryIncreaseMB.toFixed(2)} MB`);
    
    // Flag excessive memory growth
    const excessiveMemoryGrowth = memoryIncreaseMB > 20; // Example threshold: 20MB
    
    // Only apply this test if we can measure memory
    if (initialMemory > 0) {
      expect(excessiveMemoryGrowth).toBe(false);
    }
  });
  
  test('should check for JavaScript execution time issues', async () => {
    // Navigate to the page
    await page.goto(getFileUrl('index.html'));
    
    // Add performance tracking to detect long-running JavaScript
    await page.evaluate(() => {
      window.longTaskCount = 0;
      
      // Use PerformanceObserver to track long-running tasks
      const observer = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          window.longTaskCount++;
          console.warn('Long task detected:', entry.duration, 'ms');
        }
      });
      
      try {
        observer.observe({ entryTypes: ['longtask'] });
        window.performanceObserver = observer;
      } catch (e) {
        console.log('PerformanceObserver not supported');
      }
    });
    
    // Interact with the page to trigger potential issues
    await page.click('nav a[href="#menu"]');
    await page.waitForTimeout(500);
    await page.click('nav a[href="#order"]');
    await page.waitForTimeout(500);
    await page.click('nav a[href="#contact"]');
    await page.waitForTimeout(500);
    await page.click('nav a[href="#home"]');
    
    // Let the page run for a while
    await new Promise(resolve => setTimeout(resolve, config.observationTime / 2));
    
    // Check how many long tasks were detected
    const longTaskCount = await page.evaluate(() => {
      if (window.performanceObserver) {
        window.performanceObserver.disconnect();
      }
      return window.longTaskCount || 0;
    });
    
    console.log(`Detected ${longTaskCount} long-running JavaScript tasks`);
    
    // More than a certain number of long tasks could indicate problems
    const excessiveLongTasks = longTaskCount > 5; // Example threshold
    
    // This won't fail the test but will provide information
    if (excessiveLongTasks) {
      console.warn('Excessive long-running JavaScript detected');
    }
  });
});