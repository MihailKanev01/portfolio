/**
 * Mihail Kanev Portfolio Website
 * Main JavaScript File
 */

document.addEventListener('DOMContentLoaded', function() {
  
  // ===== Preloader =====
  const preloader = document.getElementById('preloader');
  
  if (preloader) {
    window.addEventListener('load', function() {
      setTimeout(function() {
        preloader.style.opacity = '0';
        preloader.style.visibility = 'hidden';
        
        checkScrollReveal();
      }, 800);
    });
  } else {
    checkScrollReveal();
  }
  
  // ===== Theme Toggle =====
  const savedTheme = localStorage.getItem('theme') || 'dark';
  document.documentElement.setAttribute('data-theme', savedTheme);

  

  
  const themeToggle = document.getElementById('theme-toggle');
  if (themeToggle) {
    themeToggle.setAttribute('aria-pressed', savedTheme === 'light' ? 'true' : 'false');
    themeToggle.setAttribute('aria-label', savedTheme === 'light' ? 'Switch to dark theme' : 'Switch to light theme');

    themeToggle.addEventListener('click', function(event) {
      const currentTheme = document.documentElement.getAttribute('data-theme');
      const themeTransition = document.querySelector('.theme-transition');
      
      if (themeTransition) {
        themeTransition.classList.add('active');
      }
      
      setTimeout(function() {
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
        localStorage.setItem('theme', newTheme);
        document.documentElement.setAttribute('data-theme', newTheme);
        themeToggle.setAttribute('aria-pressed', newTheme === 'light' ? 'true' : 'false');
        themeToggle.setAttribute('aria-label', newTheme === 'light' ? 'Switch to dark theme' : 'Switch to light theme');
        themeToggle.setAttribute('title', newTheme === 'light' ? 'Switch to dark theme' : 'Switch to light theme');
        
        setTimeout(function() {
          if (themeTransition) {
            themeTransition.classList.remove('active');
          }
        }, 300);
      }, 100);
      
      const ripple = document.createElement('span');
      ripple.className = 'ripple';
      
      const rect = themeToggle.getBoundingClientRect();
      const size = Math.max(rect.width, rect.height);
      
      ripple.style.width = ripple.style.height = `${size}px`;
      ripple.style.left = `${event.clientX - rect.left - size/2}px`;
      ripple.style.top = `${event.clientY - rect.top - size/2}px`;
      
      themeToggle.appendChild(ripple);
      
      setTimeout(() => {
        ripple.remove();
      }, 600);
    });
  }
  
  // ===== Smooth Scrolling =====
  const navLinks = document.querySelectorAll('a[href^="#"]');
  
  navLinks.forEach(link => {
    link.addEventListener('click', function(e) {
      e.preventDefault();
      const targetId = this.getAttribute('href');
      const targetSection = document.querySelector(targetId);
      
      if (targetSection) {
        const navbarToggler = document.querySelector('.navbar-toggler');
        const navbarCollapse = document.querySelector('.navbar-collapse');
        if (navbarCollapse.classList.contains('show')) {
          navbarToggler.click();
        }
        
        window.scrollTo({
          top: targetSection.offsetTop - 70, 
          behavior: 'smooth'
        });
        
        history.pushState(null, null, targetId);
      }
    });
  });
  
  window.addEventListener('scroll', function() {
    const scrollPosition = window.scrollY;
    
    const sections = document.querySelectorAll('section');
    
    sections.forEach(section => {
      const sectionTop = section.offsetTop - 100;
      const sectionBottom = sectionTop + section.offsetHeight;
      const sectionId = section.getAttribute('id');
      
      if (scrollPosition >= sectionTop && scrollPosition < sectionBottom) {
        navLinks.forEach(link => {
          link.classList.remove('active-link');
          link.removeAttribute('aria-current');
        });
        
        const currentLink = document.querySelector(`a[href="#${sectionId}"]`);
        if (currentLink) {
          currentLink.classList.add('active-link');
          currentLink.setAttribute('aria-current', 'page');
        }
      }
    });
  });
  
  // Close mobile navigation with Escape.
  document.addEventListener('keydown', function(event) {
    if (event.key === 'Escape') {
      const navbarCollapse = document.querySelector('.navbar-collapse.show');
      if (navbarCollapse) {
        const navbarToggler = document.querySelector('.navbar-toggler');
        navbarToggler?.click();
      }
    }
  });

  // ===== Scroll Reveal Animations =====
  const sections = document.querySelectorAll('section');
  sections.forEach(section => {
    section.classList.add('fade-in');
    
    const cards = section.querySelectorAll('.card, .project-card');
    cards.forEach((card, index) => {
      if (index === 0) card.classList.add('fade-in-delay-1');
      else if (index === 1) card.classList.add('fade-in-delay-2');
      else card.classList.add('fade-in-delay-3');
    });
  });
  
  function checkScrollReveal() {
    const triggerBottom = window.innerHeight * 0.85;
    
    const fadeElements = document.querySelectorAll('.fade-in');
    fadeElements.forEach(element => {
      const elementTop = element.getBoundingClientRect().top;
      
      if (elementTop < triggerBottom) {
        element.classList.add('appear');
      }
    });
  }
  
  window.addEventListener('scroll', checkScrollReveal);

  // ===== Contact Form with EmailJS =====
  const form = document.getElementById('contact-form');
  if (form) {
    const messageTextarea = document.getElementById('message');
    const messageCount = document.getElementById('message-count');
    const submitBtn = document.getElementById('submit-btn');
    const formStatusContainer = document.createElement('div');
    formStatusContainer.className = 'form-status-container mt-3';
    formStatusContainer.setAttribute('aria-live', 'polite');
    formStatusContainer.setAttribute('aria-atomic', 'true');
    form.appendChild(formStatusContainer);

    if (messageTextarea && messageCount) {
      messageTextarea.addEventListener('input', function() {
        const currentLength = this.value.length;
        messageCount.textContent = `${currentLength} / 500`;
        
        if (currentLength > 450) {
          messageCount.classList.add('text-danger');
        } else {
          messageCount.classList.remove('text-danger');
        }
      });
    }

    function showValidationMessage(input, isValid, message) {
      const field = input.closest('.contact-field');
      if (!field) return;
      
      const feedbackDiv = field.querySelector('.invalid-feedback');
      let statusIcon = field.querySelector('.validation-status-icon');
      
      if (!statusIcon) {
        statusIcon = document.createElement('i');
        statusIcon.className = 'fas validation-status-icon';
        statusIcon.setAttribute('aria-hidden', 'true');
        field.querySelector('.contact-input-wrap')?.appendChild(statusIcon);
      }
      
      if (feedbackDiv) {
        feedbackDiv.innerHTML = isValid
          ? `<i class="fas fa-check-circle me-1" aria-hidden="true"></i>${message}`
          : `<i class="fas fa-circle-exclamation me-1" aria-hidden="true"></i>${message}`;
        feedbackDiv.classList.toggle('validation-success', isValid);
        feedbackDiv.classList.toggle('validation-error', !isValid);
      }
      
      input.setAttribute('aria-invalid', isValid ? 'false' : 'true');
      
      if (isValid) {
        input.classList.remove('is-invalid');
        input.classList.add('is-valid');
        statusIcon.className = 'fas fa-check-circle validation-status-icon validation-status-success';
      } else {
        input.classList.remove('is-valid');
        input.classList.add('is-invalid');
        statusIcon.className = 'fas fa-circle-exclamation validation-status-icon validation-status-error';
      }
    }

    function clearValidationState(input) {
      const field = input.closest('.contact-field');
      if (!field) return;
      
      input.classList.remove('is-valid', 'is-invalid');
      input.setAttribute('aria-invalid', 'false');
      
      const feedbackDiv = field.querySelector('.invalid-feedback');
      if (feedbackDiv) {
        feedbackDiv.innerHTML = '';
        feedbackDiv.classList.remove('validation-success', 'validation-error');
      }
      
      const statusIcon = field.querySelector('.validation-status-icon');
      if (statusIcon) {
        statusIcon.className = 'fas validation-status-icon';
      }
    }

    function setValidationDescription(input, isValid, message) {
      const field = input.closest('.contact-field');
      const feedbackDiv = field?.querySelector('.invalid-feedback');
      if (!feedbackDiv) return;
      
      if (!feedbackDiv.id) {
        feedbackDiv.id = `${input.id}-validation-message`;
      }
      input.setAttribute('aria-describedby', feedbackDiv.id);
      showValidationMessage(input, isValid, message);
    }

    function validateContactForm() {
      const errors = [];
      const nameInput = document.getElementById('name');
      const emailInput = document.getElementById('email');
      const messageInput = document.getElementById('message');

      const namePattern = /^[\p{L}][\p{L}\s'’-]{1,49}$/u;
      const isNameValid = namePattern.test(nameInput.value.trim());
      const nameMessage = isNameValid
        ? 'Looks good!'
        : (nameInput.value.trim()
          ? 'Please use 2–50 letters, spaces, apostrophes or hyphens.'
          : 'Please enter your name.');
      setValidationDescription(nameInput, isNameValid, nameMessage);
      if (!isNameValid) errors.push({ field: nameInput, label: 'Name', message: nameMessage });

      const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
      const isEmailValid = emailPattern.test(emailInput.value.trim());
      const emailMessage = isEmailValid
        ? 'Looks good!'
        : (emailInput.value.trim()
          ? 'Please enter a valid email address, for example name@example.com.'
          : 'Please enter your email address.');
      setValidationDescription(emailInput, isEmailValid, emailMessage);
      if (!isEmailValid) errors.push({ field: emailInput, label: 'Email', message: emailMessage });

      const messageLength = messageInput.value.trim().length;
      const isMessageValid = messageLength >= 10 && messageLength <= 500;
      const messageMessage = isMessageValid
        ? 'Looks good!'
        : (messageLength === 0
          ? 'Please enter a message.'
          : messageLength < 10
            ? `Your message is too short. Add ${10 - messageLength} more character${10 - messageLength === 1 ? '' : 's'}.`
            : 'Your message is too long. Keep it under 500 characters.');
      setValidationDescription(messageInput, isMessageValid, messageMessage);
      if (!isMessageValid) errors.push({ field: messageInput, label: 'Message', message: messageMessage });

      return errors;
    }

    function showFormErrors(errors) {
      const errorItems = errors
        .map(error => `<li><strong>${error.label}:</strong> ${error.message}</li>`)
        .join('');

      formStatusContainer.innerHTML = `
        <div class="form-error-summary alert alert-danger" role="alert" tabindex="-1">
          <div class="form-error-summary-title">
            <i class="fas fa-circle-info" aria-hidden="true"></i>
            <span>Please check the highlighted fields.</span>
          </div>
          <ul class="form-error-summary-list">${errorItems}</ul>
        </div>
      `;
      
      formStatusContainer.querySelector('.form-error-summary')?.focus();
      errors[0]?.field?.focus();
      errors[0]?.field?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }

    form.addEventListener('submit', function(event) {
      event.preventDefault();
      
      formStatusContainer.innerHTML = '';
      const errors = validateContactForm();
      
      if (errors.length > 0) {
        showFormErrors(errors);
        return;
      }
      
      const nameInput = document.getElementById('name');
      const emailInput = document.getElementById('email');
      const messageInput = document.getElementById('message');
      const isFormValid = true;
      
      if (isFormValid) {
    submitBtn.disabled = true;
    submitBtn.innerHTML = `
      <span class="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
      Sending...
    `;
    
    const senderName = nameInput.value.trim();
    const senderEmail = emailInput.value.trim();
    const senderMessage = messageInput.value.trim();

    // Provide both common EmailJS variable naming conventions.
    // This keeps the form compatible with templates using either
    // name/email/message or from_name/reply_to/message.
    const templateParams = {
      name: senderName,
      email: senderEmail,
      from_name: senderName,
      reply_to: senderEmail,
      message: senderMessage
    };
    
    if (typeof emailjs === 'undefined') {

      formStatusContainer.innerHTML = `
        <div class="alert alert-danger alert-dismissible fade show" role="alert">
          <i class="fas fa-exclamation-circle me-2"></i>
          EmailJS is not properly loaded. Please refresh the page and try again.
          <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
        </div>
      `;
      
      submitBtn.disabled = false;
      submitBtn.innerHTML = `
        <i class="fas fa-paper-plane me-2"></i> 
        <span>Send Message</span>
      `;
      return;
    }
    
    emailjs.send(
      'service_za0kkku',
      'template_drq3v2w',
      templateParams
    )
      .then(function(response) {

        formStatusContainer.innerHTML = `
          <div class="alert alert-success alert-dismissible fade show" role="alert">
            <i class="fas fa-check-circle me-2"></i>
            Thank you for your message! I'll get back to you soon.
            <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
          </div>
        `;
        
        form.reset();
        inputs.forEach(input => {
          input.dataset.touched = 'false';
          clearValidationState(input);
        });
        messageCount.textContent = '0 / 500';
      })
      .catch(function(error) {

        formStatusContainer.innerHTML = `
          <div class="alert alert-danger alert-dismissible fade show" role="alert">
            <i class="fas fa-exclamation-circle me-2"></i>
            The message could not be sent right now. Please try again later.
            <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
          </div>
        `;
      })
      .finally(function() {
        submitBtn.disabled = false;
        submitBtn.innerHTML = `
          <i class="fas fa-paper-plane me-2"></i> 
          <span>Send Message</span>
        `;
      });
  } else {
    formStatusContainer.innerHTML = `
      <div class="alert alert-danger alert-dismissible fade show" role="alert">
        <i class="fas fa-exclamation-circle me-2"></i>
        Please correct the errors in the form before submitting.
        <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
      </div>
    `;
  }
});
    
    const inputs = form.querySelectorAll('input, textarea');
    inputs.forEach(input => {
      input.setAttribute('aria-invalid', 'false');
      
      input.addEventListener('input', function() {
        if (input.id === 'name') {
          input.value = input.value.replace(/[^\p{L}\s'’-]/gu, '');
        }
        
        if (input.dataset.touched === 'true') {
          validateContactForm();
        } else {
          clearValidationState(input);
        }
      });
      
      input.addEventListener('blur', function() {
        input.dataset.touched = 'true';
        validateContactForm();
      });
    });
  }

  // ===== Project Filters =====
  const filterButtons = document.querySelectorAll('.project-filter');
  const projectCards = document.querySelectorAll('#projects-grid .project-card');

  filterButtons.forEach(button => {
    button.addEventListener('click', function() {
      filterButtons.forEach(btn => {
        btn.classList.remove('active');
        btn.setAttribute('aria-pressed', 'false');
      });
      this.classList.add('active');
      this.setAttribute('aria-pressed', 'true');

      const filterValue = this.dataset.filter;

      projectCards.forEach(card => {
        const shouldShow = filterValue === 'all' || card.dataset.category === filterValue;

        if (shouldShow) {
          card.classList.remove('is-hidden');
        } else {
          card.classList.add('is-hidden');
        }
      });
    });
  });


  // ===== Update current year =====
  const currentYearElement = document.getElementById('current-year');
  if (currentYearElement) {
    currentYearElement.textContent = new Date().getFullYear();
  }
});