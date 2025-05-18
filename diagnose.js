/**
 * MillBrook Pizza Site Diagnostics
 * 
 * This script helps diagnose issues with the website.
 * Add it to index.html as the first script to run.
 */

console.log('Starting MillBrook Pizza diagnostics...');

// Store original console methods
const originalConsole = {
    log: console.log,
    warn: console.warn,
    error: console.error
};

// Log counter to identify excessive logging
let logCounter = 0;
const MAX_LOGS = 1000;
const logsPerSource = {};

// Override console methods to count and detect excessive logging
console.log = function() {
    trackLog('log', arguments);
    return originalConsole.log.apply(console, arguments);
};

console.warn = function() {
    trackLog('warn', arguments);
    return originalConsole.warn.apply(console, arguments);
};

console.error = function() {
    trackLog('error', arguments);
    return originalConsole.error.apply(console, arguments);
};

function trackLog(type, args) {
    logCounter++;
    
    // Get stack trace to identify the source
    const stack = new Error().stack || '';
    const source = stack.split('\n')[2] || 'unknown';
    
    // Track logs per source
    if (!logsPerSource[source]) {
        logsPerSource[source] = { count: 0, types: {} };
    }
    
    logsPerSource[source].count++;
    
    if (!logsPerSource[source].types[type]) {
        logsPerSource[source].types[type] = 0;
    }
    
    logsPerSource[source].types[type]++;
    
    // Alert if exceeding the limit
    if (logCounter === MAX_LOGS) {
        originalConsole.warn('DIAGNOSTIC WARNING: Excessive logging detected!');
        originalConsole.warn('Top log sources:');
        
        Object.entries(logsPerSource)
            .sort((a, b) => b[1].count - a[1].count)
            .slice(0, 5)
            .forEach(([source, data]) => {
                originalConsole.warn(`- ${source}: ${data.count} logs (${Object.entries(data.types).map(([t, c]) => `${t}: ${c}`).join(', ')})`);
            });
    }
}

// Track script load order
const loadedScripts = [];
document.addEventListener('DOMContentLoaded', () => {
    originalConsole.log('Scripts loaded in this order:', loadedScripts);
});

// Monkey patch script loading to track the order
const originalCreateElement = document.createElement;
document.createElement = function(tagName) {
    const element = originalCreateElement.call(document, tagName);
    
    if (tagName.toLowerCase() === 'script') {
        // Track when the script loads
        element.addEventListener('load', function() {
            const scriptSrc = this.src || 'inline script';
            loadedScripts.push(scriptSrc);
        });
    }
    
    return element;
};

// Monitor for event loops
let lastEventLoopCheckTime = Date.now();
let eventLoopChecks = 0;
const checkEventLoop = () => {
    const now = Date.now();
    const elapsed = now - lastEventLoopCheckTime;
    lastEventLoopCheckTime = now;
    
    eventLoopChecks++;
    
    // If we're checking too frequently, that might indicate an issue
    if (elapsed < 10 && eventLoopChecks > 100) {
        originalConsole.warn('DIAGNOSTIC WARNING: Potential event loop congestion detected');
        originalConsole.warn(`Interval between checks: ${elapsed}ms after ${eventLoopChecks} checks`);
    }
    
    requestAnimationFrame(checkEventLoop);
};
requestAnimationFrame(checkEventLoop);

// Monitor DOM mutations
let mutationCount = 0;
const mutationObserver = new MutationObserver(mutations => {
    mutationCount += mutations.length;
    
    // Check for super high rate of mutations
    if (mutations.length > 50) {
        originalConsole.warn(`DIAGNOSTIC WARNING: High mutation batch: ${mutations.length} mutations`);
        originalConsole.warn('Affected elements:', mutations.map(m => m.target.nodeName).join(', '));
    }
    
    // Log every 1000 mutations
    if (mutationCount > 0 && mutationCount % 1000 === 0) {
        originalConsole.warn(`DIAGNOSTIC WARNING: High DOM mutation rate: ${mutationCount} total mutations`);
    }
});

// Start observing
mutationObserver.observe(document.documentElement, {
    childList: true,
    attributes: true,
    characterData: true,
    subtree: true
});

// Track timers
let timerCount = 0;
const timerTracker = {};

// Monkey patch setTimeout
const originalSetTimeout = window.setTimeout;
window.setTimeout = function(callback, delay) {
    const timerId = originalSetTimeout.apply(this, arguments);
    
    // Track the timer
    timerCount++;
    timerTracker[timerId] = {
        delay,
        stack: new Error().stack,
        created: Date.now()
    };
    
    // Track excessive timeouts with short delays
    if (delay < 50 && timerCount > 100) {
        originalConsole.warn(`DIAGNOSTIC WARNING: Many short timeouts detected (total: ${timerCount})`);
    }
    
    return timerId;
};

// Monkey patch clearTimeout to track proper cleanup
const originalClearTimeout = window.clearTimeout;
window.clearTimeout = function(id) {
    if (timerTracker[id]) {
        delete timerTracker[id];
    }
    return originalClearTimeout.apply(this, arguments);
};

// Check memory usage if available
if (window.performance && window.performance.memory) {
    setInterval(() => {
        const { usedJSHeapSize, totalJSHeapSize } = window.performance.memory;
        const usedMB = Math.round(usedJSHeapSize / (1024 * 1024));
        const totalMB = Math.round(totalJSHeapSize / (1024 * 1024));
        const usagePercent = Math.round((usedJSHeapSize / totalJSHeapSize) * 100);
        
        originalConsole.log(`Memory usage: ${usedMB}MB / ${totalMB}MB (${usagePercent}%)`);
        
        if (usagePercent > 90) {
            originalConsole.warn('DIAGNOSTIC WARNING: High memory usage detected');
        }
    }, 5000);
}

// Report diagnostics on window load
window.addEventListener('load', () => {
    originalConsole.log('Diagnostics: Page load complete');
    originalConsole.log(`Total console logs: ${logCounter}`);
    originalConsole.log(`Total DOM mutations: ${mutationCount}`);
    originalConsole.log(`Total timers created: ${timerCount}`);
    originalConsole.log(`Active timers: ${Object.keys(timerTracker).length}`);
    
    // Report long-running timers
    const now = Date.now();
    const longRunningTimers = Object.entries(timerTracker)
        .filter(([_, data]) => (now - data.created) > 10000);
    
    if (longRunningTimers.length > 0) {
        originalConsole.warn(`DIAGNOSTIC WARNING: ${longRunningTimers.length} long-running timers detected`);
    }
});

console.log('Diagnostics initialized. Open browser console to view results.');

// Export diagnostics
window.millbrookDiagnostics = {
    getLogSources: () => Object.entries(logsPerSource)
        .sort((a, b) => b[1].count - a[1].count),
    getTimers: () => timerTracker,
    getMutationCount: () => mutationCount,
    reset: () => {
        logCounter = 0;
        mutationCount = 0;
        Object.keys(logsPerSource).forEach(key => delete logsPerSource[key]);
    }
};