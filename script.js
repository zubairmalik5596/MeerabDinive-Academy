/* ============================================================
   MEERAB DIVINE ACADEMY — SITE SCRIPT
   ============================================================ */
document.addEventListener('DOMContentLoaded', function () {

  /* ---------- PAGE TRANSITIONS ---------- */
  (function(){
    var overlay = document.querySelector('.page-transition-overlay');
    if(!overlay) return;

    var panels = overlay.querySelectorAll('.pt-panel');
    var leaveDuration = 750;
    var enterDuration = 550;

    // On page load: reveal page with panel exit animation
    overlay.classList.add('is-leaving');
    setTimeout(function(){
      overlay.style.display = 'none';
    }, leaveDuration);

    // Intercept all internal nav links (skip modal triggers)
    var internalLinks = document.querySelectorAll(
      '.nav-links a, .mobile-menu a, .mm-nav a, .mm-cta a, .hero-slider .btn, .site-footer .footer-links a, a.btn[href$=".html"]'
    );
    internalLinks.forEach(function(link){
      var href = link.getAttribute('href');
      if(!href || href.startsWith('#') || href.startsWith('http') || href.startsWith('mailto:') || href.startsWith('tel:')) return;
      // Skip links that open modals (Free Trial buttons)
      if(link.textContent.trim().indexOf('Free Trial') > -1) return;

      link.addEventListener('click', function(e){
        e.preventDefault();
        var target = href;

        // Skip if already on that page
        var current = window.location.pathname.split('/').pop() || 'index.html';
        if(target === current) return;

        // Show overlay with panel entrance animation
        overlay.style.display = '';
        overlay.classList.remove('is-leaving');
        overlay.classList.add('is-entering');

        // Navigate after panels finish closing
        setTimeout(function(){
          window.location.href = target;
        }, enterDuration);
      });
    });
  })();

  /* ---------- NAVBAR SCROLL STATE ---------- */
  var nav = document.querySelector('.site-nav');
  function handleNavScroll(){
    if(!nav) return;
    if(window.scrollY > 40){ nav.classList.add('is-scrolled'); }
    else { nav.classList.remove('is-scrolled'); }
  }
  handleNavScroll();
  window.addEventListener('scroll', handleNavScroll, { passive:true });

  /* ---------- MOBILE MENU ---------- */
  var hamburger = document.querySelector('.hamburger');
  var mobileMenu = document.querySelector('.mobile-menu');
  var overlay = document.querySelector('.mobile-overlay');
  var mmClose = document.querySelector('.mm-close');

  function openMenu(){
    hamburger.classList.add('is-open');
    mobileMenu.classList.add('is-open');
    overlay.classList.add('is-open');
    document.body.style.overflow = 'hidden';
  }
  function closeMenu(){
    hamburger.classList.remove('is-open');
    mobileMenu.classList.remove('is-open');
    overlay.classList.remove('is-open');
    document.body.style.overflow = '';
  }
  if(hamburger){
    hamburger.addEventListener('click', function(){
      mobileMenu.classList.contains('is-open') ? closeMenu() : openMenu();
    });
  }
  if(mmClose){ mmClose.addEventListener('click', closeMenu); }
  if(overlay){ overlay.addEventListener('click', closeMenu); }
  if(mobileMenu){
    mobileMenu.querySelectorAll('.mm-nav a, .mm-cta a').forEach(function(a){
      a.addEventListener('click', closeMenu);
    });
  }
  document.addEventListener('keydown', function(e){
    if(e.key === 'Escape') closeMenu();
  });

  /* ---------- SCROLL REVEAL ---------- */
  var revealEls = document.querySelectorAll('.reveal');
  if('IntersectionObserver' in window && revealEls.length){
    var io = new IntersectionObserver(function(entries){
      entries.forEach(function(entry){
        if(entry.isIntersecting){
          entry.target.classList.add('is-visible');
          io.unobserve(entry.target);
        }
      });
    }, { threshold: .15 });
    revealEls.forEach(function(el){ io.observe(el); });
  } else {
    revealEls.forEach(function(el){ el.classList.add('is-visible'); });
  }

  /* ---------- ANIMATED COUNTERS ---------- */
  var counters = document.querySelectorAll('[data-counter]');
  if(counters.length && 'IntersectionObserver' in window){
    var counterIO = new IntersectionObserver(function(entries){
      entries.forEach(function(entry){
        if(!entry.isIntersecting) return;
        var el = entry.target;
        var target = parseInt(el.getAttribute('data-counter'), 10);
        var duration = 1400;
        var start = null;
        function step(ts){
          if(!start) start = ts;
          var progress = Math.min((ts - start) / duration, 1);
          var eased = 1 - Math.pow(1 - progress, 3);
          el.textContent = Math.floor(eased * target).toLocaleString();
          if(progress < 1){ requestAnimationFrame(step); }
          else { el.textContent = target.toLocaleString() + (el.getAttribute('data-suffix') || ''); }
        }
        requestAnimationFrame(step);
        counterIO.unobserve(el);
      });
    }, { threshold: .5 });
    counters.forEach(function(el){ counterIO.observe(el); });
  }

  /* ---------- HERO SLIDER ---------- */
  var slider = document.querySelector('.hero-slider');
  if(slider){
    var slides = slider.querySelectorAll('.hero-slide');
    var dotsWrap = slider.querySelector('.hero-dots');
    var current = 0;
    var timer;

    slides.forEach(function(_, i){
      var dot = document.createElement('button');
      dot.setAttribute('aria-label', 'Go to slide ' + (i+1));
      if(i === 0) dot.classList.add('is-active');
      dot.addEventListener('click', function(){ goTo(i); resetTimer(); });
      dotsWrap.appendChild(dot);
    });
    var dots = dotsWrap.querySelectorAll('button');

    function goTo(i){
      slides[current].classList.remove('is-active');
      dots[current].classList.remove('is-active');
      current = (i + slides.length) % slides.length;
      slides[current].classList.add('is-active');
      dots[current].classList.add('is-active');
    }
    function next(){ goTo(current + 1); }
    function prev(){ goTo(current - 1); }
    function resetTimer(){
      clearInterval(timer);
      timer = setInterval(next, 6000);
    }

    var nextBtn = slider.querySelector('.hero-arrow.next');
    var prevBtn = slider.querySelector('.hero-arrow.prev');
    if(nextBtn) nextBtn.addEventListener('click', function(){ next(); resetTimer(); });
    if(prevBtn) prevBtn.addEventListener('click', function(){ prev(); resetTimer(); });

    resetTimer();
  }

  /* ---------- TESTIMONIAL SLIDER ---------- */
  var testiTrack = document.querySelector('.testi-track');
  if(testiTrack){
    var prevT = document.querySelector('.testi-btn.prev');
    var nextT = document.querySelector('.testi-btn.next');
    function scrollAmount(){
      var card = testiTrack.querySelector('.testi-card');
      return card ? card.offsetWidth + 26 : 300;
    }
    if(nextT) nextT.addEventListener('click', function(){
      testiTrack.scrollBy({ left: scrollAmount(), behavior:'smooth' });
    });
    if(prevT) prevT.addEventListener('click', function(){
      testiTrack.scrollBy({ left: -scrollAmount(), behavior:'smooth' });
    });
  }

  /* ---------- COURSE FILTER ---------- */
  var filterBtns = document.querySelectorAll('.filter-btn');
  var courseCards = document.querySelectorAll('[data-category]');
  if(filterBtns.length){
    filterBtns.forEach(function(btn){
      btn.addEventListener('click', function(){
        filterBtns.forEach(function(b){ b.classList.remove('is-active'); });
        btn.classList.add('is-active');
        var cat = btn.getAttribute('data-filter');
        courseCards.forEach(function(card){
          var show = cat === 'all' || card.getAttribute('data-category') === cat;
          card.style.display = show ? '' : 'none';
        });
      });
    });
  }

  /* ---------- ACTIVE NAV LINK BY CURRENT PAGE ---------- */
  var currentPage = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-links a, .mobile-menu a').forEach(function(link){
    var href = link.getAttribute('href');
    if(href === currentPage){ link.classList.add('active'); }
  });

  /* ---------- PRICING PLAN -> CONTACT REDIRECT ---------- */
  document.querySelectorAll('[data-plan]').forEach(function(btn){
    btn.addEventListener('click', function(){
      var plan = btn.getAttribute('data-plan');
      window.location.href = 'contact.html?plan=' + encodeURIComponent(plan);
    });
  });

  /* ---------- PRESELECT PLAN ON CONTACT FORM ---------- */
  var planSelect = document.getElementById('planSelect');
  if(planSelect){
    var params = new URLSearchParams(window.location.search);
    var plan = params.get('plan');
    if(plan){
      for(var i=0;i<planSelect.options.length;i++){
        if(planSelect.options[i].value.toLowerCase() === plan.toLowerCase()){
          planSelect.selectedIndex = i;
          break;
        }
      }
    }
  }

  /* ---------- REGISTRATION FORM VALIDATION ---------- */
  var form = document.getElementById('registrationForm');
  if(form){
    form.addEventListener('submit', function(e){
      e.preventDefault();
      var valid = true;
      var fields = form.querySelectorAll('[data-validate]');

      fields.forEach(function(field){
        var wrapper = field.closest('.form-field');
        var rule = field.getAttribute('data-validate');
        var value = field.value.trim();
        var ok = true;

        if(rule.indexOf('required') > -1 && value === ''){ ok = false; }
        if(ok && rule.indexOf('email') > -1 && value !== ''){
          ok = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
        }
        if(ok && rule.indexOf('phone') > -1 && value !== ''){
          ok = /^[0-9+\-\s()]{7,}$/.test(value);
        }
        if(ok && rule.indexOf('age') > -1 && value !== ''){
          var ageNum = parseInt(value, 10);
          ok = ageNum >= 3 && ageNum <= 80;
        }

        wrapper.classList.toggle('has-error', !ok);
        if(!ok) valid = false;
      });

      if(valid){
        form.style.display = 'none';
        document.getElementById('formSuccess').classList.add('is-visible');
        window.scrollTo({ top: document.getElementById('formSuccess').offsetTop - 140, behavior:'smooth' });
      } else {
        var firstError = form.querySelector('.has-error');
        if(firstError) firstError.scrollIntoView({ behavior:'smooth', block:'center' });
      }
    });

    form.querySelectorAll('[data-validate]').forEach(function(field){
      field.addEventListener('input', function(){
        field.closest('.form-field').classList.remove('has-error');
      });
    });
  }

  /* ---------- FREE TRIAL MODAL ---------- */
  (function(){
    var modal = document.getElementById('freeTrialModal');
    var form = document.getElementById('freeTrialForm');
    var closeBtn = document.getElementById('modalClose');
    if(!modal || !form) return;

    // Open modal on any 'Book 3-Day Free Trial' button click
    document.querySelectorAll('a.btn-gold[href="contact.html"]').forEach(function(btn){
      if(btn.textContent.trim().indexOf('Free Trial') > -1){
        btn.addEventListener('click', function(e){
          e.preventDefault();
          modal.classList.add('is-open');
          document.body.style.overflow = 'hidden';
        });
      }
    });

    // Close modal
    function closeModal(){
      modal.classList.remove('is-open');
      document.body.style.overflow = '';
    }
    if(closeBtn) closeBtn.addEventListener('click', closeModal);
    modal.addEventListener('click', function(e){
      if(e.target === modal) closeModal();
    });
    document.addEventListener('keydown', function(e){
      if(e.key === 'Escape') closeModal();
    });

    // Form submit -> WhatsApp redirect
    form.addEventListener('submit', function(e){
      e.preventDefault();
      var valid = true;

      // Validate required fields
      var name = document.getElementById('ftName');
      var phone = document.getElementById('ftPhone');
      var course = document.getElementById('ftCourse');

      [name, phone, course].forEach(function(field){
        var wrapper = field.closest('.form-field');
        if(!field.value.trim()){
          wrapper.classList.add('has-error');
          valid = false;
        } else {
          wrapper.classList.remove('has-error');
        }
      });

      // Validate phone format
      if(phone.value.trim() && !/^[0-9+\-\s()]{7,}$/.test(phone.value.trim())){
        phone.closest('.form-field').classList.add('has-error');
        valid = false;
      }

      // Validate email if provided
      var email = document.getElementById('ftEmail');
      if(email.value.trim() && !/[^\s@]+@[^\s@]+\.[^\s@]+/.test(email.value.trim())){
        email.closest('.form-field').classList.add('has-error');
        valid = false;
      }

      if(!valid){
        var firstErr = form.querySelector('.has-error');
        if(firstErr) firstErr.scrollIntoView({behavior:'smooth', block:'center'});
        return;
      }

      // Build WhatsApp message
      var nameVal = name.value.trim();
      var phoneVal = phone.value.trim();
      var emailVal = email.value.trim() || 'Not provided';
      var addressVal = document.getElementById('ftAddress').value.trim() || 'Not provided';
      var courseVal = course.value;

      var msg = '%F0%9F%8F%8B%20*MEERAB%20DIVINE%20ACADEMY*%0A%F0%9F%93%96%20Free%20Trial%20Registration%0A%0A' +
        '%E2%94%80%E2%94%80%E2%94%80%E2%94%80%E2%94%80%E2%94%80%E2%94%80%E2%94%80%E2%94%80%E2%94%80%E2%94%80%E2%94%80%E2%94%80%E2%94%80%E2%94%80%0A' +
        '%0A%F0%9F%91%A4%20*Name%3A*%20' + encodeURIComponent(nameVal) +
        '%0A%F0%9F%93%B1%20*Phone%3A*%20' + encodeURIComponent(phoneVal) +
        '%0A%F0%9F%93%A7%20*Email%3A*%20' + encodeURIComponent(emailVal) +
        '%0A%F0%9F%8F%A0%EF%B8%8F%20*Address%3A*%20' + encodeURIComponent(addressVal) +
        '%0A%F0%9F%93%9A%20*Course%3A*%20' + encodeURIComponent(courseVal) +
        '%0A%F0%9F%92%B5%20*Plan%3A*%20Free%203-Day%20Trial' +
        '%0A%0A%E2%94%80%E2%94%80%E2%94%80%E2%94%80%E2%94%80%E2%94%80%E2%94%80%E2%94%80%E2%94%80%E2%94%80%E2%94%80%E2%94%80%E2%94%80%E2%94%80%E2%94%80%0A' +
        '%0APlease%20confirm%20my%20free%20trial%20enrollment.%0A%0AJazakAllah%20Khair!%20%F0%9F%8C%9D';

      window.open('https://wa.me/923468177708?text=' + msg, '_blank');
      closeModal();
    });

    // Clear errors on input
    form.querySelectorAll('input, select').forEach(function(field){
      field.addEventListener('input', function(){
        field.closest('.form-field').classList.remove('has-error');
      });
    });
  })();


});
