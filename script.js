/**
 * NEXORA INTERNATIONAL HOSPITAL
 * Parallax Engine, Scroll Reveals & Interactive Animations
 */

document.addEventListener('DOMContentLoaded', () => {
  initStickyHeader();
  initParallaxEngine();
  initScrollReveals();
  init3DCardTilt();
  initMobileDrawer();
  initSpecialtiesCarousel();
  initFacilitiesSwitcher();
  initTestimonialsSlider();
  initCounterAnimations();
  initSearchModal();
  initPillarsInteractivity();
});

/* ==========================================================================
   1. STICKY HEADER & SCROLL SHADOW
   ========================================================================== */
function initStickyHeader() {
  const header = document.getElementById('header');
  window.addEventListener('scroll', () => {
    if (window.scrollY > 40) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  }, { passive: true });
}

/* ==========================================================================
   2. SMOOTH PARALLAX SCROLLING ENGINE (High Performance via rAF)
   ========================================================================== */
function initParallaxEngine() {
  const heroParallaxImg = document.getElementById('hero-parallax-img');
  const heroSection = document.getElementById('home');
  const sectionParallaxImgs = document.querySelectorAll('.section-parallax-img, .parallax-item');

  let ticking = false;
  let mouseX = 0;
  let mouseY = 0;

  function updateParallax() {
    const scrollY = window.pageYOffset || document.documentElement.scrollTop;
    const windowHeight = window.innerHeight;

    // 1. Hero Parallax: image smoothly glides at 0.45 speed creating distinct depth
    if (heroParallaxImg) {
      const heroSpeed = parseFloat(heroParallaxImg.getAttribute('data-speed')) || 0.45;
      const heroOffset = scrollY * heroSpeed;
      heroParallaxImg.style.transform = `translate3d(${mouseX * -18}px, ${heroOffset + mouseY * -12}px, 0)`;
    }

    // 2. Section Parallax Backgrounds
    sectionParallaxImgs.forEach(img => {
      const parent = img.closest('section') || img.parentElement;
      if (!parent) return;

      const rect = parent.getBoundingClientRect();
      if (rect.top < windowHeight && rect.bottom > 0) {
        const speed = parseFloat(img.getAttribute('data-speed')) || 0.22;
        const centerOffset = (rect.top - windowHeight / 2) * speed;
        img.style.transform = `translate3d(0, ${centerOffset}px, 0)`;
      }
    });

    ticking = false;
  }

  window.addEventListener('scroll', () => {
    if (!ticking) {
      window.requestAnimationFrame(updateParallax);
      ticking = true;
    }
  }, { passive: true });

  // Mouse Parallax on Hero Section
  if (heroSection) {
    heroSection.addEventListener('mousemove', (e) => {
      const rect = heroSection.getBoundingClientRect();
      mouseX = (e.clientX - rect.left) / rect.width - 0.5;
      mouseY = (e.clientY - rect.top) / rect.height - 0.5;
      if (!ticking) {
        window.requestAnimationFrame(updateParallax);
        ticking = true;
      }
    });

    heroSection.addEventListener('mouseleave', () => {
      mouseX = 0;
      mouseY = 0;
      if (!ticking) {
        window.requestAnimationFrame(updateParallax);
        ticking = true;
      }
    });
  }

  // Initial render
  updateParallax();
}

/* ==========================================================================
   3. INTERSECTION OBSERVER SCROLL REVEALS
   ========================================================================== */
function initScrollReveals() {
  const revealElements = document.querySelectorAll('.reveal-on-scroll');

  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-revealed');
        observer.unobserve(entry.target);
      }
    });
  }, {
    root: null,
    rootMargin: '0px 0px -50px 0px',
    threshold: 0.1
  });

  revealElements.forEach(el => revealObserver.observe(el));
}

/* ==========================================================================
   4. 3D INTERACTIVE HERO CARD TILT ON MOUSEMOVE
   ========================================================================== */
function init3DCardTilt() {
  const heroCard = document.querySelector('.hero-content');
  if (!heroCard) return;

  const maxTilt = 4; // subtle, elegant tilt

  heroCard.addEventListener('mousemove', (e) => {
    const rect = heroCard.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const xPercent = (x / rect.width - 0.5) * 2;
    const yPercent = (y / rect.height - 0.5) * 2;

    const rotateX = -yPercent * maxTilt;
    const rotateY = xPercent * maxTilt;

    heroCard.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-2px)`;
  });

  heroCard.addEventListener('mouseleave', () => {
    heroCard.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) translateY(0)';
  });
}

/* ==========================================================================
   5. MOBILE DRAWER NAVIGATION
   ========================================================================== */
function initMobileDrawer() {
  const toggleBtn = document.getElementById('mobile-menu-toggle');
  const closeBtn = document.getElementById('drawer-close');
  const drawer = document.getElementById('mobile-drawer');
  const drawerLinks = document.querySelectorAll('.drawer-link');

  if (toggleBtn && drawer) {
    toggleBtn.addEventListener('click', () => {
      drawer.classList.add('open');
    });
  }

  if (closeBtn && drawer) {
    closeBtn.addEventListener('click', () => {
      drawer.classList.remove('open');
    });
  }

  drawerLinks.forEach(link => {
    link.addEventListener('click', () => {
      drawer.classList.remove('open');
    });
  });
}

/* ==========================================================================
   6. SPECIALTIES CAROUSEL (Auto-Sliding Engine with Drag & Hover Pause)
   ========================================================================== */
function initSpecialtiesCarousel() {
  const slider = document.getElementById('specialties-slider');
  const prevBtn = document.getElementById('specialties-prev');
  const nextBtn = document.getElementById('specialties-next');
  const autoToggle = document.getElementById('auto-play-toggle');
  const autoDot = document.getElementById('auto-dot');
  const autoStatusText = document.getElementById('auto-status-text');

  if (!slider) return;

  const AUTO_INTERVAL_MS = 2900;
  let autoTimer = null;
  let isAutoEnabled = true;
  let isHovered = false;
  let hasDragged = false;
  let isDown = false;
  let startX = 0;
  let scrollLeftStart = 0;

  function getStepSize() {
    const card = slider.querySelector('.specialty-card');
    return card ? card.offsetWidth + 26 : 326;
  }

  function updateStatusUI(status, isPaused) {
    if (autoDot) {
      if (isPaused) {
        autoDot.classList.add('paused');
      } else {
        autoDot.classList.remove('paused');
      }
    }
    if (autoStatusText) {
      autoStatusText.textContent = status;
    }
  }

  function slideNext() {
    const step = getStepSize();
    const maxScroll = slider.scrollWidth - slider.clientWidth;
    if (slider.scrollLeft >= maxScroll - 16) {
      slider.scrollTo({ left: 0, behavior: 'smooth' });
    } else {
      slider.scrollBy({ left: step, behavior: 'smooth' });
    }
  }

  function slidePrev() {
    const step = getStepSize();
    if (slider.scrollLeft <= 16) {
      const maxScroll = slider.scrollWidth - slider.clientWidth;
      slider.scrollTo({ left: maxScroll, behavior: 'smooth' });
    } else {
      slider.scrollBy({ left: -step, behavior: 'smooth' });
    }
  }

  function startAutoSlide() {
    stopAutoSlide();
    if (!isAutoEnabled || isHovered) return;
    autoTimer = setInterval(() => {
      slideNext();
    }, AUTO_INTERVAL_MS);
    updateStatusUI('Auto-Sliding', false);
  }

  function stopAutoSlide() {
    if (autoTimer) {
      clearInterval(autoTimer);
      autoTimer = null;
    }
  }

  function pauseAutoSlide(reasonText = 'Paused') {
    stopAutoSlide();
    if (isAutoEnabled) {
      updateStatusUI(reasonText, true);
    }
  }

  function resumeAutoSlide() {
    if (isAutoEnabled && !isHovered) {
      startAutoSlide();
    }
  }

  // Prev / Next button actions
  if (prevBtn) {
    prevBtn.addEventListener('click', () => {
      slidePrev();
      if (isAutoEnabled) {
        stopAutoSlide();
        setTimeout(startAutoSlide, 3500);
      }
    });
  }

  if (nextBtn) {
    nextBtn.addEventListener('click', () => {
      slideNext();
      if (isAutoEnabled) {
        stopAutoSlide();
        setTimeout(startAutoSlide, 3500);
      }
    });
  }

  // Toggle Auto-sliding button
  if (autoToggle) {
    autoToggle.addEventListener('click', () => {
      isAutoEnabled = !isAutoEnabled;
      if (isAutoEnabled) {
        startAutoSlide();
      } else {
        stopAutoSlide();
        updateStatusUI('Manual Only', true);
      }
    });
  }

  // Hover detection to pause on mouse-over
  const pauseTriggers = [slider, prevBtn, nextBtn, autoToggle].filter(Boolean);
  pauseTriggers.forEach(el => {
    el.addEventListener('mouseenter', () => {
      isHovered = true;
      pauseAutoSlide('Paused (Hover)');
    });
    el.addEventListener('mouseleave', () => {
      isHovered = false;
      resumeAutoSlide();
    });
  });

  // Touch Support
  slider.addEventListener('touchstart', () => {
    pauseAutoSlide('Browsing');
  }, { passive: true });

  slider.addEventListener('touchend', () => {
    setTimeout(resumeAutoSlide, 2000);
  }, { passive: true });

  // Mouse Drag to Scroll (Desktop)
  slider.addEventListener('mousedown', (e) => {
    isDown = true;
    hasDragged = false;
    slider.classList.add('is-dragging');
    startX = e.pageX - slider.offsetLeft;
    scrollLeftStart = slider.scrollLeft;
    pauseAutoSlide('Dragging');
  });

  slider.addEventListener('mousemove', (e) => {
    if (!isDown) return;
    e.preventDefault();
    const x = e.pageX - slider.offsetLeft;
    const walk = (x - startX) * 1.4;
    if (Math.abs(walk) > 7) {
      hasDragged = true;
    }
    slider.scrollLeft = scrollLeftStart - walk;
  });

  window.addEventListener('mouseup', () => {
    if (isDown) {
      isDown = false;
      slider.classList.remove('is-dragging');
      resumeAutoSlide();
      setTimeout(() => {
        hasDragged = false;
      }, 100);
    }
  });

  // Prevent card click if dragged
  slider.addEventListener('click', (e) => {
    if (hasDragged) {
      e.preventDefault();
      e.stopPropagation();
    }
  }, true);

  // Initial kickoff
  startAutoSlide();
}

/* ==========================================================================
   7. HEALING ARCHITECTURE & FACILITIES SWITCHER
   ========================================================================== */
function initFacilitiesSwitcher() {
  const facilityItems = document.querySelectorAll('.fac-item');
  const activeImg = document.getElementById('facility-active-img');
  const activeName = document.getElementById('facility-active-name');

  facilityItems.forEach(item => {
    item.addEventListener('click', () => {
      facilityItems.forEach(i => i.classList.remove('active'));
      item.classList.add('active');

      const newImg = item.getAttribute('data-img');
      const newName = item.getAttribute('data-name');

      if (activeImg && newImg) {
        activeImg.style.opacity = '0.3';
        activeImg.style.transform = 'scale(0.98)';
        setTimeout(() => {
          activeImg.src = newImg;
          activeImg.style.opacity = '1';
          activeImg.style.transform = 'scale(1)';
        }, 200);
      }

      if (activeName && newName) {
        activeName.textContent = newName;
      }
    });
  });
}

/* ==========================================================================
   8. TESTIMONIALS SLIDER
   ========================================================================== */
function initTestimonialsSlider() {
  const reviewsGrid = document.getElementById('reviews-grid');
  const prevBtn = document.getElementById('reviews-prev');
  const nextBtn = document.getElementById('reviews-next');

  if (!reviewsGrid || !prevBtn || !nextBtn) return;

  prevBtn.addEventListener('click', () => {
    reviewsGrid.scrollBy({ left: -340, behavior: 'smooth' });
  });

  nextBtn.addEventListener('click', () => {
    reviewsGrid.scrollBy({ left: 340, behavior: 'smooth' });
  });
}

/* ==========================================================================
   9. ANIMATED NUMBER COUNTERS
   ========================================================================== */
function initCounterAnimations() {
  function animateElements(elements) {
    elements.forEach(el => {
      const targetStr = el.getAttribute('data-count');
      if (!targetStr) return;
      const target = parseFloat(targetStr);
      let current = 0;
      const steps = 35;
      const increment = target / steps;
      const timer = setInterval(() => {
        current += increment;
        if (current >= target) {
          current = target;
          clearInterval(timer);
          if (targetStr.includes('.')) {
            el.textContent = target.toFixed(1) + '%';
          } else if (el.textContent.includes('M')) {
            el.textContent = target + 'M+';
          } else if (el.textContent.includes('%')) {
            el.textContent = target + '%';
          } else {
            el.textContent = target + '+';
          }
        } else {
          if (targetStr.includes('.')) {
            el.textContent = current.toFixed(1) + '%';
          } else if (el.textContent.includes('M')) {
            el.textContent = Math.floor(current) + 'M+';
          } else if (el.textContent.includes('%')) {
            el.textContent = Math.floor(current) + '%';
          } else {
            el.textContent = Math.floor(current) + '+';
          }
        }
      }, 35);
    });
  }

  const sectionsToWatch = document.querySelectorAll('.hero-metrics-strip, .about-highlights-row, .impact-section');
  sectionsToWatch.forEach(section => {
    let sectionAnimated = false;
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting && !sectionAnimated) {
          sectionAnimated = true;
          const nums = entry.target.querySelectorAll('.metric-num[data-count], .ab-num[data-count], .i-val[data-count]');
          animateElements(nums);
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.35 });
    observer.observe(section);
  });
}

/* ==========================================================================
   10. ABOUT PILLARS INTERACTIVE TOGGLE
   ========================================================================== */
function initPillarsInteractivity() {
  const pillars = document.querySelectorAll('.pillar-item');
  pillars.forEach(item => {
    item.addEventListener('mouseenter', () => {
      pillars.forEach(p => p.classList.remove('active'));
      item.classList.add('active');
    });
  });
}

function activatePillar(index) {
  const pillars = document.querySelectorAll('.pillar-item');
  if (pillars && pillars[index]) {
    pillars.forEach(p => p.classList.remove('active'));
    pillars[index].classList.add('active');
  }
}

function openStoryVideo() {
  openBookingModal();
}

/* ==========================================================================
   11. APPOINTMENT MODAL FUNCTIONS
   ========================================================================== */
function openBookingModal() {
  const modal = document.getElementById('appointment-modal');
  if (modal) {
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';

    // Set minimum date to today
    const dateInput = document.getElementById('modal-date');
    if (dateInput) {
      const today = new Date().toISOString().split('T')[0];
      dateInput.min = today;
      dateInput.value = today;
    }
  }
}

function closeBookingModal() {
  const modal = document.getElementById('appointment-modal');
  if (modal) {
    modal.classList.remove('active');
    document.body.style.overflow = '';
  }

  // Reset form after close animation
  setTimeout(() => {
    const form = document.getElementById('booking-form');
    const successBox = document.getElementById('booking-success');
    if (form) form.style.display = 'block';
    if (successBox) successBox.style.display = 'none';
  }, 300);
}

function selectSpecialtyAndBook(specialty) {
  openBookingModal();
  const select = document.getElementById('modal-specialty');
  if (select) {
    for (let i = 0; i < select.options.length; i++) {
      if (select.options[i].text.toLowerCase().includes(specialty.toLowerCase())) {
        select.selectedIndex = i;
        break;
      }
    }
  }
}

function handleAppointmentSubmit(event) {
  event.preventDefault();
  const name = document.getElementById('modal-name').value;
  const specialty = document.getElementById('modal-specialty').value;
  const doctor = document.getElementById('modal-doctor').value;
  const date = document.getElementById('modal-date').value;
  const time = document.getElementById('modal-time').value;

  const form = document.getElementById('booking-form');
  const successBox = document.getElementById('booking-success');
  const summary = document.getElementById('success-summary');

  if (summary) {
    summary.innerHTML = `Dear <strong>${name}</strong>, your priority consultation in <strong>${specialty}</strong> with <strong>${doctor}</strong> has been registered for <strong>${date} (${time})</strong>. Our patient concierge will contact you shortly with check-in instructions.`;
  }

  if (form && successBox) {
    form.style.display = 'none';
    successBox.style.display = 'block';
  }
}

/* ==========================================================================
   12. SEARCH MODAL FUNCTIONS
   ========================================================================== */
const searchableItems = [
  { title: 'Cardiology & Heart Center', category: 'Specialty', url: '#specialties' },
  { title: 'Neurology & Brain Institute', category: 'Specialty', url: '#specialties' },
  { title: 'Orthopedics & Joint Replacement', category: 'Specialty', url: '#specialties' },
  { title: 'Oncology & Targeted Therapeutics', category: 'Specialty', url: '#specialties' },
  { title: 'Robotic Surgery (Da Vinci Suite)', category: 'Technology', url: '#innovation' },
  { title: 'AI Diagnostics & Deep Imaging', category: 'Technology', url: '#innovation' },
  { title: 'Presidential Private Suites', category: 'Facilities', url: '#comfort' },
  { title: 'Healing Botanical Gardens', category: 'Facilities', url: '#facilities' },
  { title: '24/7 Level 1 Emergency & Trauma', category: 'Emergency', url: '#home' },
  { title: 'Executive Family Lounges', category: 'Facilities', url: '#facilities' }
];

function initSearchModal() {
  const trigger = document.getElementById('search-trigger');
  const modal = document.getElementById('search-modal');
  const closeBtn = document.getElementById('search-close-btn');
  const input = document.getElementById('site-search-input');
  const resultsBox = document.getElementById('search-results');

  if (trigger && modal) {
    trigger.addEventListener('click', () => {
      modal.classList.add('active');
      input.focus();
      renderSearchResults(searchableItems);
    });
  }

  if (closeBtn && modal) {
    closeBtn.addEventListener('click', () => {
      modal.classList.remove('active');
    });
  }

  if (input) {
    input.addEventListener('input', (e) => {
      const query = e.target.value.toLowerCase().trim();
      if (!query) {
        renderSearchResults(searchableItems);
        return;
      }
      const filtered = searchableItems.filter(item => 
        item.title.toLowerCase().includes(query) || 
        item.category.toLowerCase().includes(query)
      );
      renderSearchResults(filtered);
    });
  }
}

function renderSearchResults(items) {
  const resultsBox = document.getElementById('search-results');
  if (!resultsBox) return;

  if (items.length === 0) {
    resultsBox.innerHTML = '<div style="padding: 1rem; color: #848D9E; text-align: center;">No matching departments or services found.</div>';
    return;
  }

  resultsBox.innerHTML = items.map(item => `
    <div class="search-result-item" onclick="navigateTo('${item.url}')">
      <span>${item.title}</span>
      <span style="font-size: 0.72rem; color: #9E7145; background: rgba(158, 113, 69, 0.1); padding: 3px 8px; border-radius: 4px;">${item.category}</span>
    </div>
  `).join('');
}

function quickSearch(tag) {
  const input = document.getElementById('site-search-input');
  if (input) {
    input.value = tag;
    input.dispatchEvent(new Event('input'));
  }
}

function navigateTo(url) {
  const modal = document.getElementById('search-modal');
  if (modal) modal.classList.remove('active');
  window.location.hash = url;
}

/* ==========================================================================
   13. NEWSLETTER FORM
   ========================================================================== */
function handleNewsletter(e) {
  e.preventDefault();
  const input = e.target.querySelector('input');
  const msg = document.getElementById('news-msg');
  if (input && msg) {
    input.value = '';
    msg.style.display = 'block';
    setTimeout(() => {
      msg.style.display = 'none';
    }, 4000);
  }
}

// Global hook for escape key to close modals
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') {
    closeBookingModal();
    const searchModal = document.getElementById('search-modal');
    if (searchModal) searchModal.classList.remove('active');
  }
});
