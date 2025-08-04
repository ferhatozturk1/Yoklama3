// Debounce utility function
export const debounce = (func, delay) => {
  let timeoutId;
  
  return function (...args) {
    // Clear the previous timeout
    clearTimeout(timeoutId);
    
    // Set a new timeout
    timeoutId = setTimeout(() => {
      func.apply(this, args);
    }, delay);
  };
};

// Throttle utility function
export const throttle = (func, delay) => {
  let lastCall = 0;
  
  return function (...args) {
    const now = Date.now();
    
    if (now - lastCall >= delay) {
      lastCall = now;
      func.apply(this, args);
    }
  };
};

export default { debounce, throttle };