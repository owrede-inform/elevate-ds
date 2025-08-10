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
      }
    }),
    createTreeWalker: () => ({
      nextNode: () => null
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
      }
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