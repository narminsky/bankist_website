'use strict';

///////////////////////////////////////
// Modal window

const modal = document.querySelector('.modal');
const overlay = document.querySelector('.overlay');
const btnCloseModal = document.querySelector('.btn--close-modal');
const btnsOpenModal = document.querySelectorAll('.btn--show-modal');
const navLinks = document.querySelector('.nav__links');
const nav = document.querySelector('.nav');
const navLink = document.querySelectorAll('.nav__link');
const operationsBtnContainer = document.querySelector('.operations__tab-container');
const operationsBtns = document.querySelectorAll('.operations__tab');
const operationsContents = document.querySelectorAll('.operations__content');

const openModal = function (e) {
  e.preventDefault();
  modal.classList.remove('hidden');
  overlay.classList.remove('hidden');
};

const closeModal = function () {
  modal.classList.add('hidden');
  overlay.classList.add('hidden');
};

btnsOpenModal.forEach(btn => btn.addEventListener('click', openModal));

btnCloseModal.addEventListener('click', closeModal);
overlay.addEventListener('click', closeModal);

document.addEventListener('keydown', function (e) {
  if (e.key === 'Escape' && !modal.classList.contains('hidden')) {
    closeModal();
  }
});

// learn more - btn scroll to section 1
const btnScrollTo = document.querySelector('.btn--scroll-to');
const section1 = document.querySelector('#section--1');

btnScrollTo.addEventListener('click', function () {
  // const sec1coords = section1.getBoundingClientRect();

  // scroll smoothly old school way
  // window.scrollTo({
  //   left: sec1coords.left + window.pageXOffset,
  //   top: sec1coords.top + window.pageYOffset,
  //   behavior: 'smooth'
  // });

  // modern way
  section1.scrollIntoView({ behavior: 'smooth' });
});

// random numbers func
const randomNum = (min, max) => {
  return Math.trunc(Math.random() * (max - min) + min);
}
// random color func
const randomColor = () => {
  return `rgb(${randomNum(0, 255)},${randomNum(0, 255)},${randomNum(0, 255)})`;
}

// capture and event bubbling
// document.querySelector('.nav__link').addEventListener('click', function (e) {
//   this.style.backgroundColor = randomColor();
//   console.log(e.target, e.currentTarget);
// });

// nav links scrolling
navLinks.addEventListener('click', function (e) {
  e.preventDefault();
  if (!e.target.classList.contains('nav__link--btn')) {
    const scrollTarget = e.target.getAttribute('href');
    document.querySelector(scrollTarget).scrollIntoView({ behavior: 'smooth' });
  }
});

// nav links hover effect
const navLinkHover = function (e) {
  if (e.target.classList.contains('nav__link')) {
    const currentLink = e.target;
    const siblings = currentLink.closest('.nav').querySelectorAll('.nav__link');
    const logo = currentLink.closest('.nav').querySelector('img');

    siblings.forEach((el) => {
      if (el != currentLink)
        el.style.opacity = this;
    });
    logo.style.opacity = this;
  }
};

nav.addEventListener('mouseover', navLinkHover.bind(0.5));
nav.addEventListener('mouseout', navLinkHover.bind(1));

// operations  section tabbed components
operationsBtnContainer.addEventListener('click', function (e) {
  const clickedBtn = e.target.closest('.operations__tab');

  if (clickedBtn.classList.contains('operations__tab')) {
    // activate clicked btn
    operationsBtns.forEach((el) => {
      el.classList.remove('operations__tab--active');
    });
    clickedBtn.classList.add('operations__tab--active');
    // activate clicked tab
    operationsContents.forEach((el) => {
      el.classList.remove('operations__content--active');
    });
    document.querySelector(`.operations__content--${clickedBtn.dataset.tab}`).classList.add('operations__content--active');
  }
});

// Sticky navigation
const sectionCoords = section1.getBoundingClientRect();
// console.log(sectionCoords);

// simple way
// window.addEventListener('scroll', function () {
//   // console.log(this.window.scrollY);
//   if (this.window.scrollY > sectionCoords.top) {
//     nav.classList.add('sticky')
//   } else {
//     nav.classList.remove('sticky')
//   }
// });

// API way
// Sticky navigation: Intersection Observer API

// example part
// options
// const obsCallBack = function (entries, observer) {
//   entries.forEach(function (entry) {
//     console.log(entry);
//   })
// };

// const obsOptions = {
//   root: null, //target intersected element or viewport
//   threshold: 0.1, //percentage of intersection that observer will be called
// };

// const observer = new IntersectionObserver(obsCallBack, obsOptions);
// observer.observe(section1);

// sticky nav part
const header = document.querySelector('.header');
const navHeight = nav.getBoundingClientRect().height;

const stickyNav = (entries) => {
  const [entry] = entries; //first element of entries

  if (!entry.isIntersecting)
    nav.classList.add('sticky')
  else nav.classList.remove('sticky');
}

const headerObserver = new IntersectionObserver(stickyNav, {
  root: null,
  threshold: 0,
  rootMargin: -navHeight + 'px'
});

headerObserver.observe(header);

// Reveal sections
const allSections = document.querySelectorAll('.section');

const revealSection = (entries, observer) => {
  const [entry] = entries;

  if (!entry.isIntersecting) return;
  entry.target.classList.remove('section--hidden');
  observer.unobserve(entry.target);
};

const sectionObserver = new IntersectionObserver(revealSection, {
  root: null,
  threshold: 0.25,
});

allSections.forEach((section) => {
  sectionObserver.observe(section);
  section.classList.add('section--hidden');
});

// Lazy loading images
const imgTargets = document.querySelectorAll('img[data-src]');

const loadImg = (entries, observer) => {
  const [entry] = entries;

  if (!entry.isIntersecting) return;
  // Replace src with data-src
  entry.target.src = entry.target.dataset.src;

  entry.target.addEventListener('load', function () {
    entry.target.classList.remove('lazy-img');
  });
  observer.unobserve(entry.target);
};

const imgObserver = new IntersectionObserver(loadImg, {
  root: null,
  threshold: 0,
  // rootMargin: '-200px'
});

imgTargets.forEach(img => {
  imgObserver.observe(img);
});

// Sliding Carousel
const slides = document.querySelectorAll('.slide');
const btnLeft = document.querySelector('.slider__btn--left');
const btnRight = document.querySelector('.slider__btn--right');
const dotContainer = document.querySelector('.dots');

let currentSlide = 0;

const slider = document.querySelector('.slider');

const orderSlides = function (curr) {
  slides.forEach((slide, i) => {
    slide.style.transform = `translateX(${100 * (i - curr)}%)`;
  });
};
orderSlides(currentSlide);
// 0% 100% 200% 300%

// active dot
const activateDot = function (currDot) {
  document.querySelectorAll('.dots__dot').forEach(dot => dot.classList.remove('dots__dot--active'));

  document.querySelector(`.dots__dot[data-slide='${currDot}']`).classList.add('dots__dot--active');
  console.log('active dot: ' + currDot);
};

// Next slide
const nextSlide = function () {
  if (currentSlide == slides.length - 1) {
    currentSlide = 0;
  } else
    currentSlide++;
  console.log('next button: ' + currentSlide);
  orderSlides(currentSlide);
  activateDot(currentSlide);
}
btnRight.addEventListener('click', nextSlide);
// -100% 0% 100% 200%

// Prev slide
const prevSlide = function () {
  if (currentSlide == 0) {
    currentSlide = slides.length - 1;
  } else
    currentSlide--;
  orderSlides(currentSlide);
  activateDot(currentSlide);
};
btnLeft.addEventListener('click', prevSlide);
// -300% -200% -100% 0%

// left-right arrow keys
document.addEventListener('keydown', function (e) {
  if (e.key == 'ArrowRight') nextSlide()
  if (e.key == 'ArrowLeft') prevSlide()
});

// dots
// create dots 
const createDots = function () {
  slides.forEach(function (_, i) {
    dotContainer.innerHTML += `<button class='dots__dot' data-slide='${i}'></button>`;
  });
}
createDots();

activateDot(currentSlide);

dotContainer.addEventListener('click', function (e) {
  if (e.target.classList.contains('dots__dot')) {
    const { slide } = e.target.dataset;
    orderSlides(slide);
    activateDot(slide);
  }
});