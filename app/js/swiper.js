const projectSwiper = new Swiper('.project__slider', {
  slidesPerView: 'auto',
  speed: 500,
  spaceBetween: 40,
  allowTouchMove: false,
  watchSlidesProgress: true,
  navigation: {
    prevEl: '.navigation__prev',
    nextEl: '.navigation__next',
  },
});

const mainSwiper = new Swiper('.main-page__slider', {
  slidesPerView: 'auto',
  speed: 500,
  spaceBetween: 40,
  allowTouchMove: false,
  watchSlidesProgress: true,
  navigation: {
    prevEl: '.navigation__prev',
    nextEl: '.navigation__next',
  },
});