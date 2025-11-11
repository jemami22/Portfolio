const menuIcon = document.querySelector('#menu-icon i');
const navbar = document.querySelector('.navbar');

menuIcon.addEventListener('click', () => {
  navbar.classList.toggle('active');
  menuIcon.classList.toggle('bx-x');
  menuIcon.classList.toggle('bx-menu');
});


document.addEventListener("DOMContentLoaded", function() {
    new Typed(".auto-type", {
    strings: ["BSCS Student", "BSCS Student", "BSCS Student"],
    typeSpeed: 120,
    backSpeed: 60,
    backDelay: 1500,
    loop: true,
    showCursor: true,
    cursorChar: "|"
});
});






const carousel = document.querySelector('.carousel');
const cards = document.querySelectorAll('.card');
const prevBtn = document.querySelector('.prev-btn');
const nextBtn = document.querySelector('.next-btn');

let currentIndex = 1; // middle card active

function updateCarousel() {
  cards.forEach((card, index) => {
    card.classList.remove('active');
    if(index === currentIndex) card.classList.add('active');
  });
}

prevBtn.addEventListener('click', () => {
  currentIndex = (currentIndex - 1 + cards.length) % cards.length;
  updateCarousel();
});

nextBtn.addEventListener('click', () => {
  currentIndex = (currentIndex + 1) % cards.length;
  updateCarousel();
});

updateCarousel();

//EDUCATION

// Keep your existing top-of-file code (menu, typed.js, carousel...) above this block.
// Replace or append this block to the bottom of your script.js file.

/*
  Education "focus" behavior:
  - Click "Educational Attainment" -> add body.edu-only and section.focused (header stays visible)
  - On the first user interaction (wheel/touch/keydown/click) -> remove edu-only/focused and restore normal page
*/

(function() {
  const header = document.querySelector('.header');
  const eduNavLink = document.querySelector('a[href="#education"]');
  const educationSection = document.getElementById('education');

  if (!header || !eduNavLink || !educationSection) return;

  // keep header height in sync for CSS calculations
  function setHeaderHeightCSSVar() {
    const h = header.offsetHeight || 72;
    document.documentElement.style.setProperty('--header-height', h + 'px');
  }
  setHeaderHeightCSSVar();
  window.addEventListener('resize', setHeaderHeightCSSVar);

  // one-time listeners array so we can remove them after first interaction
  let oneTimeHandlers = [];

  function addOneTimeUnfocusListeners() {
    // we consider these user interactions as the signal to exit the "edu-only" mode
    const events = ['wheel', 'touchstart', 'touchmove', 'keydown', 'mousedown'];
    const handler = function (e) {
      // ignore tiny mouse wheel events that might be accidental? (optional)
      // simply unfocus for any of these events
      unfocusEducation();
    };
    events.forEach(evt => {
      window.addEventListener(evt, handler, { passive: true });
      oneTimeHandlers.push({ evt, handler });
    });
  }

  function removeOneTimeUnfocusListeners() {
    oneTimeHandlers.forEach(({evt, handler}) => {
      window.removeEventListener(evt, handler);
    });
    oneTimeHandlers = [];
  }

  function focusEducation(options = { behavior: 'smooth' }) {
    setHeaderHeightCSSVar();
    // visually hide other page content while keeping DOM intact
    document.body.classList.add('edu-only');
    // style education to occupy the available viewport under header
    educationSection.classList.add('focused');

    // scroll so education top aligns directly under the header
    const headerHeight = parseInt(getComputedStyle(document.documentElement).getPropertyValue('--header-height'), 10) || header.offsetHeight;
    const top = educationSection.getBoundingClientRect().top + window.scrollY - headerHeight;
    window.scrollTo({ top, behavior: options.behavior });

    // set hash without forcing a jump
    history.replaceState(null, '', '#education');

    // attach one-time listeners to exit "edu-only" on the first real user interaction
    // (so a deliberate scroll or touch will reveal the rest of page)
    removeOneTimeUnfocusListeners();
    addOneTimeUnfocusListeners();
  }

  function unfocusEducation() {
    // remove one-time handlers immediately
    removeOneTimeUnfocusListeners();
    // remove the temporary visual-only mode
    document.body.classList.remove('edu-only');
    educationSection.classList.remove('focused');

    // clean up hash if present
    if (location.hash === '#education') {
      history.replaceState(null, '', ' ');
    }
  }

  // Click handler for the nav link
  eduNavLink.addEventListener('click', function(e) {
    e.preventDefault();
    focusEducation({ behavior: 'smooth' });
  });

  // Clicking any other nav item should also exit edu-only so normal navigation can continue
  document.querySelectorAll('.navbar a:not([href="#education"])').forEach(anchor => {
    anchor.addEventListener('click', function() {
      unfocusEducation();
      // let native anchor behavior happen after this handler
    });
  });

  // If the page is loaded directly with #education, open in focus mode
  if (location.hash === '#education') {
    setTimeout(() => focusEducation({ behavior: 'auto' }), 60);
  }
})();