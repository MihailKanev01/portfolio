/**
 * Mihail Kanev Portfolio Website
 * Main JavaScript File
 */

document.addEventListener('DOMContentLoaded', function() {
  
  // ===== Preloader =====
  const preloader = document.getElementById('preloader');
  
  // Hide preloader after page is fully loaded
  window.addEventListener('load', function() {
    setTimeout(function() {
      preloader.style.opacity = '0';
      preloader.style.visibility = 'hidden';
      
      // Trigger initial animations for visible elements
      checkScrollReveal();
    }, 800);
  });
  
  // ===== Theme Toggle =====
  // Apply saved theme
  const savedTheme = localStorage.getItem('theme') || 'dark';
  document.documentElement.setAttribute('data-theme', savedTheme);
  
  // Log theme on load to verify it's working
  console.log('Applied theme:', savedTheme);
  
  // Theme toggle handler
  const themeToggle = document.getElementById('theme-toggle');
  if (themeToggle) {
    themeToggle.addEventListener('click', function() {
      const currentTheme = document.documentElement.getAttribute('data-theme');
      const themeTransition = document.querySelector('.theme-transition');
      
      // Show transition overlay
      if (themeTransition) {
        themeTransition.classList.add('active');
      }
      
      // Change theme after delay
      setTimeout(function() {
        // Toggle theme
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
        localStorage.setItem('theme', newTheme);
        document.documentElement.setAttribute('data-theme', newTheme);
        
        console.log('Theme changed to:', newTheme);
        
        // Hide overlay after theme change
        setTimeout(function() {
          if (themeTransition) {
            themeTransition.classList.remove('active');
          }
        }, 300);
      }, 100);
      
      // Add ripple effect to theme toggle
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
  
  // Add click event listener to each link
  navLinks.forEach(link => {
    link.addEventListener('click', function(e) {
      // Prevent default anchor behavior
      e.preventDefault();
      
      // Get the target section from the href attribute
      const targetId = this.getAttribute('href');
      const targetSection = document.querySelector(targetId);
      
      if (targetSection) {
        // Close mobile navbar if open
        const navbarToggler = document.querySelector('.navbar-toggler');
        const navbarCollapse = document.querySelector('.navbar-collapse');
        if (navbarCollapse.classList.contains('show')) {
          navbarToggler.click();
        }
        
        // Scroll to target section with smooth behavior
        window.scrollTo({
          top: targetSection.offsetTop - 70, // Adjust for fixed navbar height
          behavior: 'smooth'
        });
        
        // Update URL without refreshing page
        history.pushState(null, null, targetId);
      }
    });
  });
  
  // Add active state to navigation based on scroll position
  window.addEventListener('scroll', function() {
    const scrollPosition = window.scrollY;
    
    // Get all sections
    const sections = document.querySelectorAll('section');
    
    sections.forEach(section => {
      const sectionTop = section.offsetTop - 100;
      const sectionBottom = sectionTop + section.offsetHeight;
      const sectionId = section.getAttribute('id');
      
      if (scrollPosition >= sectionTop && scrollPosition < sectionBottom) {
        // Remove active class from all links
        navLinks.forEach(link => {
          link.classList.remove('active-link');
        });
        
        // Add active class to current section link
        const currentLink = document.querySelector(`a[href="#${sectionId}"]`);
        if (currentLink) {
          currentLink.classList.add('active-link');
        }
      }
    });
  });
  
  // ===== Scroll Reveal Animations =====
  // Add fade-in class to section elements for animation
  const sections = document.querySelectorAll('section');
  sections.forEach(section => {
    section.classList.add('fade-in');
    
    // Add delay classes to card elements within sections
    const cards = section.querySelectorAll('.card, .project-card');
    cards.forEach((card, index) => {
      if (index === 0) card.classList.add('fade-in-delay-1');
      else if (index === 1) card.classList.add('fade-in-delay-2');
      else card.classList.add('fade-in-delay-3');
    });
  });
  
  // Scroll reveal function
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
  
  // Check for scroll reveal on scroll
  window.addEventListener('scroll', checkScrollReveal);

  // ===== Contact Form =====
  const form = document.getElementById('contact-form');
  if (form) {
    const messageTextarea = document.getElementById('message');
    const messageCount = document.getElementById('message-count');
    const submitBtn = document.getElementById('submit-btn');
    const formStatusContainer = document.createElement('div');
    formStatusContainer.className = 'form-status-container mt-3';
    form.appendChild(formStatusContainer);

    // Character count for message
    if (messageTextarea && messageCount) {
      messageTextarea.addEventListener('input', function() {
        const currentLength = this.value.length;
        messageCount.textContent = `${currentLength} / 500`;
        
        // Change color based on length
        if (currentLength > 450) {
          messageCount.classList.add('text-danger');
        } else {
          messageCount.classList.remove('text-danger');
        }
      });
    }

    // Custom validation feedback
    function showValidationMessage(input, isValid, message) {
      const feedbackDiv = input.parentElement.querySelector('.invalid-feedback') || 
        input.parentElement.querySelector('.valid-feedback');
      
      if (feedbackDiv) {
        feedbackDiv.textContent = message;
      }
      
      if (isValid) {
        input.classList.remove('is-invalid');
        input.classList.add('is-valid');
      } else {
        input.classList.remove('is-valid');
        input.classList.add('is-invalid');
      }
    }

    // Form validation
    form.addEventListener('submit', function(event) {
      // Prevent default form submission
      event.preventDefault();
      
      // Reset form status
      formStatusContainer.innerHTML = '';
      
      // Validate each field
      let isFormValid = true;
      
      // Name validation
      const nameInput = document.getElementById('name');
      const namePattern = /^[A-Za-z\s]{2,50}$/;
      const isNameValid = namePattern.test(nameInput.value);
      showValidationMessage(nameInput, isNameValid, isNameValid ? 'Looks good!' : 'Please enter a valid name (2-50 characters, letters only)');
      isFormValid = isFormValid && isNameValid;
      
      // Email validation
      const emailInput = document.getElementById('email');
      const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
      const isEmailValid = emailPattern.test(emailInput.value);
      showValidationMessage(emailInput, isEmailValid, isEmailValid ? 'Looks good!' : 'Please enter a valid email address');
      isFormValid = isFormValid && isEmailValid;
      
      // Message validation
      const messageInput = document.getElementById('message');
      const isMessageValid = messageInput.value.length >= 10 && messageInput.value.length <= 500;
      showValidationMessage(messageInput, isMessageValid, isMessageValid ? 'Looks good!' : 'Please enter a message (10-500 characters)');
      isFormValid = isFormValid && isMessageValid;
      
      if (isFormValid) {
        // Disable submit button and show loading state
        submitBtn.disabled = true;
        submitBtn.innerHTML = `
          <span class="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
          Sending...
        `;
        
        // Prepare form data for submission
        const formData = {
          name: nameInput.value,
          email: emailInput.value,
          message: messageInput.value
        };
        
        // OPTION 1: Use Email.js service (requires setup)
        // emailjs.send('YOUR_SERVICE_ID', 'YOUR_TEMPLATE_ID', formData, 'YOUR_USER_ID')
        
        // OPTION 2: Submit to a serverless function or API endpoint
        // fetch('https://api.yourwebsite.com/contact', {
        //   method: 'POST',
        //   headers: {
        //     'Content-Type': 'application/json',
        //   },
        //   body: JSON.stringify(formData),
        // })
        
        // For demo purposes, simulate a successful submission after delay
        setTimeout(() => {
          // Display success message
          formStatusContainer.innerHTML = `
            <div class="alert alert-success alert-dismissible fade show" role="alert">
              <i class="fas fa-check-circle me-2"></i>
              Thank you for your message! I'll get back to you soon.
              <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
            </div>
          `;
          
          // Reset form
          form.reset();
          nameInput.classList.remove('is-valid');
          emailInput.classList.remove('is-valid');
          messageInput.classList.remove('is-valid');
          messageCount.textContent = '0 / 500';
          
          // Reset button
          submitBtn.disabled = false;
          submitBtn.innerHTML = `
            <i class="fas fa-paper-plane me-2"></i> 
            <span>Send Message</span>
          `;
        }, 2000);
      } else {
        // Show error message
        formStatusContainer.innerHTML = `
          <div class="alert alert-danger alert-dismissible fade show" role="alert">
            <i class="fas fa-exclamation-circle me-2"></i>
            Please correct the errors in the form before submitting.
            <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
          </div>
        `;
      }
    });
    
    // Real-time validation
    const inputs = form.querySelectorAll('input, textarea');
    inputs.forEach(input => {
      input.addEventListener('input', function() {
        // Remove validation state when user starts typing
        this.classList.remove('is-valid', 'is-invalid');
        
        // Custom validation for name (letters only)
        if (input.id === 'name') {
          input.value = input.value.replace(/[^A-Za-z\s]/g, '');
        }
      });
      
      input.addEventListener('blur', function() {
        // Validate on blur
        if (input.id === 'name') {
          const namePattern = /^[A-Za-z\s]{2,50}$/;
          const isValid = namePattern.test(input.value);
          showValidationMessage(input, isValid, isValid ? 'Looks good!' : 'Please enter a valid name (2-50 characters, letters only)');
        } else if (input.id === 'email') {
          const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
          const isValid = emailPattern.test(input.value);
          showValidationMessage(input, isValid, isValid ? 'Looks good!' : 'Please enter a valid email address');
        } else if (input.id === 'message') {
          const isValid = input.value.length >= 10 && input.value.length <= 500;
          showValidationMessage(input, isValid, isValid ? 'Looks good!' : 'Please enter a message (10-500 characters)');
        }
      });
    });
  }

  // ===== Project Filters =====
  const filterButtons = document.querySelectorAll('#projects .btn-outline-light');
  const projectCards = document.querySelectorAll('.project-card');
  
  // Simple filtering system
  filterButtons.forEach(button => {
    button.addEventListener('click', function() {
      // Remove active class from all buttons
      filterButtons.forEach(btn => btn.classList.remove('active'));
      
      // Add active class to clicked button
      this.classList.add('active');
      
      // Get filter value
      const filterValue = this.textContent.trim().toLowerCase();
      
      // Filter projects
      projectCards.forEach(card => {
        const tags = card.querySelectorAll('.tag');
        const tagTexts = Array.from(tags).map(tag => tag.textContent.toLowerCase());
        
        if (filterValue === 'all' || tagTexts.includes(filterValue)) {
          card.style.display = 'block';
          setTimeout(() => {
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
          }, 10);
        } else {
          card.style.opacity = '0';
          card.style.transform = 'translateY(20px)';
          setTimeout(() => {
            card.style.display = 'none';
          }, 300);
        }
      });
    });
  });

  // ===== Scroll-Driven Animations =====
  // Use Intersection Observer to handle scroll-based animations
  const animateOnScroll = () => {
    const elements = document.querySelectorAll('.animate-on-scroll');
    
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        // Add or remove class based on visibility
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
        } else {
          entry.target.classList.remove('is-visible');
        }
        
        // Calculate how far the element is through the viewport
        const scrollProgress = calculateScrollProgress(entry);
        if (scrollProgress >= 0 && scrollProgress <= 1) {
          // Apply scroll-based animations
          applyScrollAnimations(entry.target, scrollProgress);
        }
      });
    }, {
      threshold: [0, 0.25, 0.5, 0.75, 1], // Multiple thresholds for smoother updates
      rootMargin: '-10px 0px -10px 0px' // Small margin to start/stop animations just before elements enter/exit viewport
    });
    
    elements.forEach(el => {
      observer.observe(el);
    });
  };
  
  // Calculate scroll progress (0 to 1) of an element through the viewport
  const calculateScrollProgress = (entry) => {
    // Get the distance from the top of the element to the top of the viewport
    const elementTop = entry.boundingClientRect.top;
    const elementHeight = entry.boundingClientRect.height;
    const windowHeight = window.innerHeight;
    
    // Calculate how far the element has scrolled through the viewport
    // 0 = just entered, 1 = just exited
    let progress = 1 - (elementTop + elementHeight) / (windowHeight + elementHeight);
    
    // Clamp between 0 and 1
    return Math.min(Math.max(progress, 0), 1);
  };
  
  // Apply animations based on scroll progress
  const applyScrollAnimations = (element, progress) => {
    // For skill bars, set the width based on scroll progress
    if (element.classList.contains('skill-bar')) {
      const targetWidth = element.getAttribute('data-width');
      const currentWidth = Math.floor(targetWidth * progress);
      element.style.width = `${currentWidth}%`;
    }
    
    // For slide animations, use transforms based on scroll progress
    if (element.classList.contains('slide-left')) {
      const startPosition = 100; // Start 100px to the right
      const currentPosition = startPosition * (1 - progress);
      element.style.transform = `translateX(${currentPosition}px)`;
      element.style.opacity = progress;
    }
    
    if (element.classList.contains('slide-right')) {
      const startPosition = -100; // Start 100px to the left
      const currentPosition = startPosition * (1 - progress);
      element.style.transform = `translateX(${currentPosition}px)`;
      element.style.opacity = progress;
    }
    
    if (element.classList.contains('slide-up')) {
      const startPosition = 50; // Start 50px below
      const currentPosition = startPosition * (1 - progress);
      element.style.transform = `translateY(${currentPosition}px)`;
      element.style.opacity = progress;
    }
    
    // For scale animations
    if (element.classList.contains('scale-in')) {
      const startScale = 0.8;
      const currentScale = startScale + (1 - startScale) * progress;
      element.style.transform = `scale(${currentScale})`;
      element.style.opacity = progress;
    }
  };
  
  // Initialize scroll-driven animations
  animateOnScroll();
  
  // Also initialize standard animations for older browsers
  function checkScrollReveal() {
    const triggerBottom = window.innerHeight * 0.85;
    
    const fadeElements = document.querySelectorAll('.fade-in');
    fadeElements.forEach(element => {
      const elementTop = element.getBoundingClientRect().top;
      
      if (elementTop < triggerBottom) {
        element.classList.add('appear');
      } else {
        element.classList.remove('appear');
      }
    });
  }

  // ===== Update current year =====
  const currentYearElement = document.getElementById('current-year');
  if (currentYearElement) {
    currentYearElement.textContent = new Date().getFullYear();
  }
});