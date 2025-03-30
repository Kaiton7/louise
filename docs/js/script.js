// Constants for DOM elements and configuration
const DOM_SELECTORS = {
    headerPlaceholder: '#header-placeholder',
    footerPlaceholder: '#footer-placeholder',
    burgerMenu: '.burger',
    navLinks: '.nav-links',
    navLinksItems: '.nav-links li',
    header: 'header',
    smoothScrollLinks: 'a[href^="#"]'
  };
  
  const PAGE_NAV_MAPPING = {
    'index.html': 'nav-home',
    '': 'nav-home',
    'company.html': 'nav-company',
    'price.html': 'nav-work',
    'contact.html': 'nav-contact'
  };
  
  // Main initialization function
  document.addEventListener('DOMContentLoaded', () => {
    initBurgerMenu();
    initSmoothScroll();
    initHeaderScroll();
  });
  
  /**
   * Loads component HTML (header/footer) from external files
   * @param {string} componentName - Name of the component to load (header/footer)
   */
  function loadComponent(componentName) {
    const placeholder = document.querySelector(`#${componentName}-placeholder`);
    if (!placeholder) return;
  
    fetch(`${componentName}.html`)
      .then(response => {
        if (!response.ok) {
          throw new Error(`Failed to load ${componentName}: ${response.status}`);
        }
        return response.text();
      })
      .then(data => {
        placeholder.innerHTML = data;
        
        if (componentName === 'header') {
          highlightCurrentNavItem();
          
        }
      })
      .catch(error => console.error(`Failed to import ${componentName}:`, error));
  }
  
  /**
   * Highlights the current page in the navigation menu
   */
  function highlightCurrentNavItem() {
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    const navId = PAGE_NAV_MAPPING[currentPage];
    
    if (navId) {
      const activeNavLink = document.getElementById(navId);
      if (activeNavLink) {
        activeNavLink.classList.add('active');
      }
    }
  }
  
  /**
   * Initializes the burger menu functionality for mobile
   */
  function initBurgerMenu() {
    const burger = document.querySelector(DOM_SELECTORS.burgerMenu);
    const nav = document.querySelector(DOM_SELECTORS.navLinks);
    const navLinks = document.querySelectorAll(DOM_SELECTORS.navLinksItems);
    
    if (!burger || !nav) return;
    
    burger.addEventListener('click', () => {
      // Toggle navigation menu
      nav.classList.toggle('nav-active');
      burger.classList.toggle('toggle');
      
      // Animate links
      navLinks.forEach((link, index) => {
        const animationDelay = `${index / 7 + 0.3}s`;
        
        if (link.style.animation) {
          link.style.animation = '';
        } else {
          link.style.animation = `navLinkFade 0.5s ease forwards ${animationDelay}`;
        }
      });
    });
  }
  
  /**
   * Initializes the header scroll behavior
   */
  function initHeaderScroll() {
    let lastScrollTop = 0;
    
    window.addEventListener('scroll', () => {
      const header = document.querySelector(DOM_SELECTORS.header);
      if (!header) return;
      
      const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
      
      // Hide header on scroll down, show on scroll up
      header.style.transform = scrollTop > lastScrollTop 
        ? 'translateY(-100%)' 
        : 'translateY(0)';
      
      lastScrollTop = scrollTop <= 0 ? 0 : scrollTop;
    }, { passive: true });
  }
  
  /**
   * Initializes smooth scrolling for anchor links
   */
  function initSmoothScroll() {
    document.querySelectorAll(DOM_SELECTORS.smoothScrollLinks).forEach(anchor => {
      anchor.addEventListener('click', function(e) {
        e.preventDefault();
        
        const targetId = this.getAttribute('href');
        if (targetId === '#') return;
        
        const targetElement = document.querySelector(targetId);
        if (targetElement) {
          targetElement.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
          });
        }
      });
    });
  }