// src/utils.js
export function createPageUrl(pageName) {
    const routes = {
      'Dashboard': '/',
      'Transactions': '/transactions',
      'Goals': '/goals',
    };
    
    return routes[pageName] || '/';
  }
  
  export function cn(...classes) {
    return classes.filter(Boolean).join(' ');
  }