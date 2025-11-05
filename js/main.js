document.addEventListener('DOMContentLoaded', function () {
  initializePortfolioFilter();
  initializeFormHandlers();
  initializeProjectModal();
});

function initializePortfolioFilter() {
  const filterButtons = document.querySelectorAll('.portfolio-filter .btn');
  const portfolioItems = document.querySelectorAll('.portfolio-item');
  
  if (filterButtons.length) {
    filterButtons.forEach(btn => {
      btn.addEventListener('click', function () {
        filterButtons.forEach(b => b.classList.remove('active'));
        this.classList.add('active');
        
        const filter = this.getAttribute('data-filter');
        
        portfolioItems.forEach(item => {
          if (filter === 'all' || item.classList.contains(filter)) {
            item.style.display = 'block';
          } else {
            item.style.display = 'none';
          }
        });
      });
    });
  }
}

function initializeFormHandlers() {
  const forms = document.querySelectorAll('.needs-validation');
  
  forms.forEach(form => {
    form.addEventListener('submit', function (event) {
      if (!form.checkValidity()) {
        event.preventDefault();
        event.stopPropagation();
      } else {
        event.preventDefault();
        handleFormSubmission(form);
      }
      form.classList.add('was-validated');
    });
  });
}

function handleFormSubmission(form) {
  const formData = new FormData(form);
  console.log('Form submitted:', Object.fromEntries(formData));
  
  const modal = form.closest('.modal');
  if (modal) {
    const modalInstance = bootstrap.Modal.getInstance(modal);
    if (modalInstance) modalInstance.hide();
  }
  
  form.classList.remove('was-validated');
  form.reset();
  
  showToast('Сообщение успешно отправлено!');
}

function initializeProjectModal() {
  const projectModal = document.getElementById('projectModal');
  if (projectModal) {
    projectModal.addEventListener('show.bs.modal', function (event) {
      const button = event.relatedTarget;
      const title = button.getAttribute('data-title');
      const desc = button.getAttribute('data-desc');
      
      projectModal.querySelector('#projectModalTitle').textContent = title;
      projectModal.querySelector('#projectModalDesc').textContent = desc;
    });
  }
}

function showToast(message) {
  const toastEl = document.getElementById('liveToast');
  if (!toastEl) return;
  
  const toastBody = toastEl.querySelector('.toast-body');
  if (toastBody) toastBody.textContent = message;
  
  const toast = new bootstrap.Toast(toastEl);
  toast.show();
}