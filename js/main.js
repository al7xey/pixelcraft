document.addEventListener('DOMContentLoaded', () => {
  initMobileMenu();
  initModals();
  initFormValidation();
  initPortfolioFilter();
  initTabs();
  initAccordion();
});

// ===========================================
// 1. NAVIGATION AND UTILITIES
// ===========================================
function initMobileMenu() {
  const toggleBtn = document.getElementById('js-menu-toggle');
  const navList = document.getElementById('js-nav-list');

  if (toggleBtn && navList) {
    toggleBtn.addEventListener('click', () => {
      const isOpen = navList.classList.toggle('main-navigation__list--active');
      toggleBtn.setAttribute('aria-expanded', isOpen);
      
      const icon = toggleBtn.querySelector('i');
      if (icon) {
         icon.classList.toggle('bi-list', !isOpen);
         icon.classList.toggle('bi-x-lg', isOpen);
      }
    });
  }
}

// ===========================================
// 2. MODAL SYSTEM
// ===========================================
function initModals() {
  const openButtons = document.querySelectorAll('[data-modal-target]');
  const closeButtons = document.querySelectorAll('[data-modal-close]');
  const overlays = document.querySelectorAll('.modal-overlay');

  openButtons.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const modalId = btn.getAttribute('data-modal-target');
      const modal = document.getElementById(modalId);
      if (modal) openModal(modal, btn);
    });
  });

  closeButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const modal = btn.closest('.modal-overlay');
      closeModal(modal);
    });
  });

  overlays.forEach(overlay => {
    overlay.addEventListener('click', (e) => {
      if (e.target === overlay) {
        closeModal(overlay);
      }
    });
  });
  
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      const openModal = document.querySelector('.modal-overlay--is-open');
      if (openModal) {
        closeModal(openModal);
      }
    }
  });
}

function openModal(modal, triggerButton = null) {
  if (!modal) return;
  modal.classList.add('modal-overlay--is-open');
  modal.setAttribute('aria-hidden', 'false');
  document.body.style.overflow = 'hidden'; 
  
  // Динамическое заполнение контента для портфолио
  if (triggerButton && modal.id === 'projectModal') {
      const title = triggerButton.getAttribute('data-title');
      const desc = triggerButton.getAttribute('data-desc');
      const imageSrc = triggerButton.getAttribute('data-image');
      
      const modalTitleEl = modal.querySelector('#projectModalTitle');
      const modalDescEl = modal.querySelector('#projectModalDesc');
      const modalImageEl = modal.querySelector('#projectModalImage');

      if (modalTitleEl) modalTitleEl.textContent = title;
      if (modalDescEl) modalDescEl.textContent = desc;
      if (modalImageEl && imageSrc) modalImageEl.src = imageSrc;
  }
  
  const focusableElements = modal.querySelectorAll('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])');
  if (focusableElements.length > 0) {
      focusableElements[0].focus();
  }
}

function closeModal(modal) {
  if (!modal) return;
  modal.classList.remove('modal-overlay--is-open');
  modal.setAttribute('aria-hidden', 'true');
  document.body.style.overflow = ''; 
}

// ===========================================
// 3. FORM VALIDATION
// ===========================================
function initFormValidation() {
  const forms = document.querySelectorAll('.validation-form');
  
  forms.forEach(form => {
    form.addEventListener('submit', (event) => {
      event.preventDefault();
      
      let allValid = true;
      const inputs = form.querySelectorAll('[required]');
      
      inputs.forEach(input => {
        if (!validateInput(input)) {
          allValid = false;
        }
      });
      
      if (allValid) {
        handleFormSubmission(form);
      }
    });
    
    form.querySelectorAll('[required]').forEach(input => {
        input.addEventListener('input', () => validateInput(input));
        input.addEventListener('blur', () => validateInput(input));
    });
  });
}

function validateInput(input) {
    if (input.checkValidity()) {
        input.classList.remove('is-invalid');
        return true;
    } else {
        input.classList.add('is-invalid');
        return false;
    }
}

function handleFormSubmission(form) {
  const formData = new FormData(form);
  console.log('Form submitted:', Object.fromEntries(formData));
  
  const modal = form.closest('.modal-overlay');
  if (modal) {
    closeModal(modal);
  }
  
  form.reset();
  form.querySelectorAll('.is-invalid').forEach(el => el.classList.remove('is-invalid'));
  alert('Сообщение успешно отправлено!');
}

// ===========================================
// 4. PORTFOLIO FILTER
// ===========================================
function initPortfolioFilter() {
  const filterButtons = document.querySelectorAll('.filter-group__button');
  const portfolioItems = document.querySelectorAll('.portfolio-item');
  
  if (filterButtons.length === 0) return;

  filterButtons.forEach(btn => {
    btn.addEventListener('click', function () {
      
      filterButtons.forEach(b => {
          b.classList.remove('filter-group__button--active');
          b.setAttribute('aria-pressed', 'false');
      });
      this.classList.add('filter-group__button--active');
      this.setAttribute('aria-pressed', 'true');
      
      const filter = this.getAttribute('data-filter');
      
      portfolioItems.forEach(item => {
        const category = item.getAttribute('data-category');
        // Используем CSS классы для скрытия, чтобы не ломать Grid
        if (filter === 'all' || category === filter) {
          item.style.display = ''; // Сброс инлайнового стиля
          item.classList.remove('visually-hidden');
        } else {
          item.style.display = 'none';
        }
      });
    });
  });
}

// ===========================================
// 5. TABS COMPONENT
// ===========================================
function initTabs() {
    const tabButtons = document.querySelectorAll('.tab-navigation__button');
    
    tabButtons.forEach(button => {
        button.addEventListener('click', () => {
            const targetId = button.getAttribute('data-tab-target');
            const targetPane = document.getElementById(targetId);
            const container = button.closest('section'); 
            
            if(!container || !targetPane) return;

            container.querySelectorAll('.tab-navigation__button').forEach(btn => {
                btn.classList.remove('tab-navigation__button--active');
                btn.setAttribute('aria-selected', 'false');
            });
            container.querySelectorAll('.tab-content-pane').forEach(pane => {
                pane.classList.remove('tab-content-pane--active');
            });
            
            button.classList.add('tab-navigation__button--active');
            button.setAttribute('aria-selected', 'true');
            targetPane.classList.add('tab-content-pane--active');
        });
    });
}

// ===========================================
// 6. ACCORDION COMPONENT
// ===========================================
function initAccordion() {
    const toggles = document.querySelectorAll('[data-accordion-toggle]');

    toggles.forEach(toggle => {
        const item = toggle.closest('.accordion-item');
        const contentWrapper = item.querySelector('.accordion-content-wrapper'); // Defines contentWrapper

        // Начальное состояние
        const isExpanded = toggle.getAttribute('aria-expanded') === 'true';
        if (isExpanded) {
            toggle.classList.add('accordion-button--is-open');
            contentWrapper.style.maxHeight = contentWrapper.scrollHeight + "px";
        } else {
            contentWrapper.style.maxHeight = '0';
        }
        
        toggle.addEventListener('click', () => {
            const groupName = item.getAttribute('data-accordion-group');
            const isOpen = toggle.classList.contains('accordion-button--is-open');

            if (isOpen) {
                // Закрыть
                toggle.classList.remove('accordion-button--is-open');
                toggle.setAttribute('aria-expanded', 'false');
                contentWrapper.style.maxHeight = '0'; // Fixed variable name
            } else {
                // Закрыть соседей
                if (groupName) {
                    document.querySelectorAll(`.accordion-item[data-accordion-group="${groupName}"]`).forEach(siblingItem => {
                        const siblingToggle = siblingItem.querySelector('[data-accordion-toggle]');
                        const siblingWrapper = siblingItem.querySelector('.accordion-content-wrapper');
                        
                        if (siblingToggle && siblingToggle !== toggle && siblingToggle.classList.contains('accordion-button--is-open')) {
                             siblingToggle.classList.remove('accordion-button--is-open');
                             siblingToggle.setAttribute('aria-expanded', 'false');
                             siblingWrapper.style.maxHeight = '0';
                        }
                    });
                }

                // Открыть текущий
                toggle.classList.add('accordion-button--is-open');
                toggle.setAttribute('aria-expanded', 'true');
                contentWrapper.style.maxHeight = contentWrapper.scrollHeight + "px"; // Fixed variable name
            }
        });
    });
}