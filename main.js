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
    
    // ===== Theme Toggle - FIXED =====
    // Apply saved theme
    const savedTheme = localStorage.getItem('theme') || 'dark';
    document.documentElement.setAttribute('data-theme', savedTheme);
    
    // Theme toggle handler
    const themeToggle = document.getElementById('theme-toggle');
    if (themeToggle) {
      themeToggle.addEventListener('click', function() {
        const currentTheme = document.documentElement.getAttribute('data-theme');
        const themeTransition = document.querySelector('.theme-transition');
        
        // Show transition overlay
        if (themeTransition) {
          themeTransition.style.opacity = '0.9';
          themeTransition.style.pointerEvents = 'all';
        }
        
        // Change theme after delay
        setTimeout(function() {
          // Toggle theme
          const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
          localStorage.setItem('theme', newTheme);
          document.documentElement.setAttribute('data-theme', newTheme);
          
          // Hide overlay after theme change
          setTimeout(function() {
            if (themeTransition) {
              themeTransition.style.opacity = '0';
              themeTransition.style.pointerEvents = 'none';
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
  
    // ===== Skill Bars Animation =====
    // Animate skill bars on scroll
    const skillItems = document.querySelectorAll('.skill-item');
    let animated = false;
    
    function animateSkillBars() {
      if (animated) return;
      
      const skillsSection = document.getElementById('skills');
      if (!skillsSection) return;
      
      const skillBarContainer = skillsSection.querySelector('.mt-5');
      
      if (!skillBarContainer) return;
      
      const triggerPosition = window.scrollY + window.innerHeight * 0.8;
      const sectionPosition = skillBarContainer.getBoundingClientRect().top + window.scrollY;
      
      if (triggerPosition > sectionPosition) {
        // Animate all skill bars with a delay between each
        skillItems.forEach((item, index) => {
          setTimeout(() => {
            // Add animation class
            item.classList.add('animate');
            
            // Animate the skill bar width
            const skillBar = item.querySelector('.skill-bar');
            if (skillBar) {
              const targetWidth = skillBar.getAttribute('data-width') + '%';
              skillBar.style.width = targetWidth;
            }
          }, 200 * index);
        });
        
        animated = true;
        // Remove scroll listener once animation is triggered
        window.removeEventListener('scroll', animateSkillBars);
      }
    }
    
    // Add scroll event listener for skill bars
    if (skillItems.length > 0) {
      window.addEventListener('scroll', animateSkillBars);
      // Check on page load as well
      setTimeout(animateSkillBars, 500);
    }
  
    // ===== Update current year =====
    const currentYearElement = document.getElementById('current-year');
    if (currentYearElement) {
      currentYearElement.textContent = new Date().getFullYear();
    }
  });