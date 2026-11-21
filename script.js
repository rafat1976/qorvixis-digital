/* ============================================================
   QORVIXIS DIGITAL — Main JavaScript
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {
  // Initialize Lucide Icons
  if (typeof lucide !== 'undefined') {
    lucide.createIcons();
  }

  // ---- Elements ----
  const navbar = document.getElementById('navbar');
  const mobileMenuBtn = document.getElementById('mobile-menu-btn');
  const mobileMenu = document.getElementById('mobile-menu');
  const mobileNavLinks = document.querySelectorAll('.mobile-nav-link, #mobile-menu .gradient-btn');
  const filterBtns = document.querySelectorAll('.portfolio-filter-btn');
  const portfolioItems = document.querySelectorAll('.portfolio-item');
  const modalTriggers = document.querySelectorAll('.modal-trigger');
  const projectModal = document.getElementById('project-modal');
  const modalClose = document.getElementById('modal-close');
  const modalBackdrop = document.getElementById('modal-backdrop');
  const contactForm = document.getElementById('contact-form');
  const fadeElements = document.querySelectorAll('.fade-up');

  // ============================================================
  // NAVBAR SCROLL EFFECT
  // ============================================================
  let lastScroll = 0;

  function handleNavbarScroll() {
    const scrollY = window.scrollY;

    if (scrollY > 50) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }

    lastScroll = scrollY;
  }

  window.addEventListener('scroll', handleNavbarScroll, { passive: true });
  handleNavbarScroll(); // Run on load

  // ============================================================
  // MOBILE MENU TOGGLE
  // ============================================================
  if (mobileMenuBtn && mobileMenu) {
    mobileMenuBtn.addEventListener('click', () => {
      const isOpen = mobileMenuBtn.classList.contains('open');

      if (isOpen) {
        mobileMenuBtn.classList.remove('open');
        mobileMenu.classList.remove('active');
        document.body.style.overflow = '';
      } else {
        mobileMenuBtn.classList.add('open');
        mobileMenu.classList.add('active');
        document.body.style.overflow = 'hidden';
      }
    });

    // Close on mobile nav link click
    mobileNavLinks.forEach(link => {
      link.addEventListener('click', () => {
        mobileMenuBtn.classList.remove('open');
        mobileMenu.classList.remove('active');
        document.body.style.overflow = '';
      });
    });
  }

  // ============================================================
  // SCROLL ANIMATIONS (Intersection Observer)
  // ============================================================
  const observerOptions = {
    root: null,
    rootMargin: '0px 0px -60px 0px',
    threshold: 0.1,
  };

  const scrollObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        // Apply delay from inline style if present
        const delay = entry.target.style.animationDelay || '0s';
        entry.target.style.transitionDelay = delay;
        entry.target.classList.add('visible');
        scrollObserver.unobserve(entry.target);
      }
    });
  }, observerOptions);

  fadeElements.forEach(el => scrollObserver.observe(el));

  // ============================================================
  // PORTFOLIO FILTER
  // ============================================================
  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      // Update active button
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filter = btn.dataset.filter;

      portfolioItems.forEach(item => {
        const category = item.dataset.category;

        if (filter === 'all' || category === filter) {
          item.classList.remove('hidden-item');
        } else {
          item.classList.add('hidden-item');
        }
      });
    });
  });

  // ============================================================
  // PROJECT MODAL
  // ============================================================
  function openModal(trigger) {
    const title = trigger.dataset.title;
    const category = trigger.dataset.category;
    const stack = trigger.dataset.stack;
    const description = trigger.dataset.description;
    const github = trigger.dataset.github;

    // Populate modal
    document.getElementById('modal-title').textContent = title;
    document.getElementById('modal-category').textContent = category;
    document.getElementById('modal-description').textContent = description;
    document.getElementById('modal-github').href = github;

    // Tech stack badges
    const stackContainer = document.getElementById('modal-stack');
    stackContainer.innerHTML = '';
    stack.split(',').forEach(tech => {
      const badge = document.createElement('span');
      badge.className = 'tech-pill';
      badge.textContent = tech.trim();
      stackContainer.appendChild(badge);
    });

    // Show modal
    projectModal.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  function closeModal() {
    projectModal.classList.remove('active');
    document.body.style.overflow = '';
  }

  modalTriggers.forEach(trigger => {
    trigger.addEventListener('click', () => openModal(trigger));
  });

  if (modalClose) {
    modalClose.addEventListener('click', closeModal);
  }

  if (modalBackdrop) {
    modalBackdrop.addEventListener('click', closeModal);
  }

  // Close on Escape
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && projectModal.classList.contains('active')) {
      closeModal();
    }
  });

  // ============================================================
  // CONTACT FORM SUBMISSION
  // ============================================================
  if (contactForm) {
    contactForm.addEventListener('submit', async (e) => {
      e.preventDefault();

      const submitBtn = document.getElementById('submit-btn');
      const submitText = document.getElementById('submit-text');
      const originalText = submitText.textContent;

      // Loading state
      submitBtn.disabled = true;
      submitText.textContent = 'Sending...';
      submitBtn.classList.add('opacity-70');

      try {
        const formData = new FormData(contactForm);

        const response = await fetch('/', {
          method: 'POST',
          headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
          body: new URLSearchParams(formData).toString(),
        });

        if (response.ok) {
          // Success state
          submitText.textContent = '✓ Inquiry Sent Successfully!';
          submitBtn.classList.remove('opacity-70');
          submitBtn.classList.add('submit-success');
          contactForm.reset();

          // Reset after 4 seconds
          setTimeout(() => {
            submitText.textContent = originalText;
            submitBtn.classList.remove('submit-success');
            submitBtn.disabled = false;
          }, 4000);
        } else {
          throw new Error('Form submission failed');
        }
      } catch (error) {
        // Error state
        submitText.textContent = 'Something went wrong. Please try again.';
        submitBtn.classList.remove('opacity-70');

        setTimeout(() => {
          submitText.textContent = originalText;
          submitBtn.disabled = false;
        }, 3000);
      }
    });
  }

  // ============================================================
  // SMOOTH SCROLL FOR ANCHOR LINKS
  // ============================================================
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const href = this.getAttribute('href');
      if (href === '#') return;

      const target = document.querySelector(href);
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });

  // ============================================================
  // ACTIVE NAV LINK HIGHLIGHTING
  // ============================================================
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-link');

  function highlightNavLink() {
    const scrollY = window.scrollY + 100;

    sections.forEach(section => {
      const sectionTop = section.offsetTop;
      const sectionHeight = section.offsetHeight;
      const sectionId = section.getAttribute('id');

      if (scrollY >= sectionTop && scrollY < sectionTop + sectionHeight) {
        navLinks.forEach(link => {
          link.classList.remove('text-cyan');
          link.classList.add('text-gray-400');
          if (link.getAttribute('href') === `#${sectionId}`) {
            link.classList.add('text-cyan');
            link.classList.remove('text-gray-400');
          }
        });
      }
    });
  }

  window.addEventListener('scroll', highlightNavLink, { passive: true });
});
