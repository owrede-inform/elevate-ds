// SSR polyfills for ELEVATE Core UI components
if (typeof global !== 'undefined' && typeof window === 'undefined') {
  global.self = global;
  global.window = global;
  
  // Mock document with essential methods
  global.document = {
    createElement: () => ({
      setAttribute: () => {},
      getAttribute: () => null,
      appendChild: () => {},
      removeChild: () => {},
      style: {},
      classList: {
        add: () => {},
        remove: () => {},
        contains: () => false
      },
      offsetHeight: 0,
      dispatchEvent: () => {}
    }),
    createTreeWalker: () => ({
      nextNode: () => null
    }),
    createTextNode: (text) => ({
      nodeType: 3,
      nodeValue: text || '',
      textContent: text || ''
    }),
    addEventListener: () => {},
    removeEventListener: () => {},
    querySelector: () => null,
    querySelectorAll: () => [],
    body: {
      appendChild: () => {},
      removeChild: () => {},
      style: {},
      classList: {
        add: () => {},
        remove: () => {},
        contains: () => false
      },
      offsetHeight: 0
    },
    head: {
      appendChild: () => {},
      removeChild: () => {},
    },
    documentElement: {
      setAttribute: () => {},
      getAttribute: () => null,
      classList: {
        add: () => {},
        remove: () => {},
        contains: () => false
      }
    }
  };

  // Mock CustomEvent
  global.CustomEvent = function(type, options) {
    return {
      type: type,
      detail: options ? options.detail : undefined
    };
  };

  // Mock MutationObserver
  global.MutationObserver = function(callback) {
    return {
      observe: () => {},
      disconnect: () => {}
    };
  };
  
  // Mock navigator
  global.navigator = {
    userAgent: 'Node.js'
  };
  
  // Mock location
  global.location = {
    href: '',
    protocol: 'https:',
    host: 'localhost',
    pathname: '/'
  };
}