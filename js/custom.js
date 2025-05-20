// main variables that used in code
const slideContainer = document.querySelector('.slide__container')
const rotateBlock = document.querySelector('.rotate__block');
const agreementButton = document.querySelector('.agree');
const nextSlideButton = document.querySelector('.arrow--next');
const prevSlideButton = document.querySelector('.arrow--prev');

// additional variables for timeout Ids
let nextButtonTimeout;
let prevButtonTimeout;
let lastSlideActionTimeout;

// additional variables for arrows
const hiddenArrowClass = 'hidden';
let nextArrowDelay = 2.5;

// additional varibles for slides
const totalSlideAmount = 23;
const pathNames = Array.from(
  { length: totalSlideAmount }, (_, i) => ({ count: i + 1, pathName:`./slides/slide--${i + 1}.html` })
);

// additional function for detecting correct font-size
function heightDetect(percent) {
  const height = Math.max(document.documentElement.clientHeight, window.innerHeight || 0);

  return (percent * (height - 6)) / 100;
}
function widthDetect(percent) {
  const width = Math.max(document.documentElement.clientWidth, window.innerWidth || 0);

  return (percent * width) / 100;
}
function setResponsiveFontSize() {
  $('.slide__container').css({
    'font-size': `clamp(1px, ${heightDetect(0.925925)}px,${widthDetect(0.520833)}px)`
  });
  $('.arrows').css({
    'font-size': `clamp(1px, ${heightDetect(0.925925)}px,${widthDetect(0.520833)}px)`
  });
}

// function for action after last slide
function lastSlideAction() {
  let id = $('#presentation', window.parent.document).attr('data-id');
  let $url = $('#presentation', window.parent.document).attr('data-request-url');
  let href = $('#presentation', window.parent.document).attr('data-href');
  let $token = $('meta[name="csrf-token"]', window.parent.document).attr('content');
  $.ajaxSetup({
    headers: {
      'X-CSRF-TOKEN': $token
    }
  });
  $.ajax({
    type: "POST",
    url: $url,
    data: {"id": id},
    success: function (data) {
      if (data !== false) {
        parent.location.href = href;
      }
    },
    error: function (data) {
      console.log(data);
    }
  });
}

// function that animate number from 0 to correct num
function animateNumber(delay, className) {
  const allElements = document.querySelectorAll(`${className}[data-number]`);

  allElements.forEach(el => {
    const targetNumber = Number(el.getAttribute('data-number'));

    gsap.to(el, {
      duration: 2.5,
      innerHTML: targetNumber,
      delay,
      onUpdate: () => {
        el.innerHTML = Math.round(el.innerHTML);
      },
      onComplete: () => {
        el.innerHTML = targetNumber;
      }
    });
  });
}

// function that type text from scretch
function typewriterEffect(selector, duration, delay) {
  const el = document.querySelector(selector);
  const innerText = el.getAttribute('data-text');

  gsap.to(el, {
    duration: duration,
    text: innerText,
    ease: 'none',
    delay,
  });
}

// object that store manipulations with slides
const slideActions = {
  1: () => {
    $('.arrow--next, .arrow--prev').addClass('arrow--white');
    gsap.from('.slide--1__right-block.first', { opacity: 0, duration: 0.75, delay: 1, y: '35%' });
    gsap.from('.slide--1__right-block.second', { opacity: 0, duration: 0.75, delay: 1.4, y: '-35%' });
    gsap.from('.slide--1__right-block.third', { opacity: 0, duration: 0.75, delay: 1.8, y: '35%' });
    nextArrowDelay = 2.5;
  },
  2: () => {
    $('.arrow--next').removeClass('arrow--white');

    $('.slide--2__left img.hand').on('click', function() {
      $(this).addClass('active');
      let targetLine = '';
      let targetCircle = '';
      let targetParagraph = '';

      if ($(this).hasClass('first')) {
        targetLine = '.slide--2__left .line.first';
        targetCircle = '.slide--2__left .circle.first';
        targetParagraph = '.slide--2__left p.third';
      } else if ($(this).hasClass('second')) {
        targetLine = '.slide--2__left .line.second';
        targetCircle = '.slide--2__left .circle.second';
        targetParagraph = '.slide--2__left p.fourth';
      } else if ($(this).hasClass('third')) {
        targetLine = '.slide--2__left .line.third';
        targetCircle = '.slide--2__left .circle.third';
        targetParagraph = '.slide--2__left p.fifth';
      }

      gsap.to($(targetLine), { opacity: 1, duration: 0.5, delay: 0.75, scaleX: 1});
      gsap.to($(targetCircle), { opacity: 1, duration: 0.5, delay: 1.25, scale: 1 });
      gsap.to($(targetParagraph), { opacity: 1, duration: 0.5, delay: 1.5, opacity: 1 });

      if ($('.slide--2__left img.hand.active').length === 3) {
        nextButtonTimeout = setTimeout(() => {
          $(nextSlideButton).removeClass(hiddenArrowClass);
          $(prevSlideButton).removeClass(hiddenArrowClass);
        }, 2.5 * 1000);
      }
    });
  },
  3: () => {
     $('.arrow--next').addClass('arrow--white');

    $('.slide--3__block .animation-plus').on('click', function() {
      $(this).addClass('active');
      
      $(this).fadeOut(350, function () {
        $(this).parent().find('img').fadeIn(500)
        $(this).parent().find('p').fadeIn(500);
      });

      if ($('.slide--3__block .animation-plus.active').length === 3) {
        nextButtonTimeout = setTimeout(() => {
          $(nextSlideButton).removeClass(hiddenArrowClass);
          $(prevSlideButton).removeClass(hiddenArrowClass);
        }, 1.5 * 1000);
      }
    });
  },
  4: () => {
    gsap.from('.slide--4__left h2', { opacity: 0, duration: 0.75, delay: 1, y: '35%', });
    gsap.from('.slide--4__left h3', { opacity: 0, duration: 0.75, delay: 1.4, y: '35%', });
    gsap.from('.slide--4__left-block', { opacity: 0, duration: 0.75, delay: 1.8, y: '35%', });
    gsap.from('.slide--4__right p', { opacity: 0, duration: 0.75, delay: 2.3, y: '-35%', });
    gsap.from('.slide--4__right h3', { opacity: 0, duration: 0.75, delay: 2.7, y: '-35%', });
    nextArrowDelay = 3.75;
  },
  5: () => {
    $('.slide--5 img.molecule').on('click', function() {
      $(this).addClass('active');

      $('.slide--5 img.hand').fadeOut(350);
      gsap.to('.slide--5__text h2', { opacity: 1, duration: 0.75, delay: 0.75, x: '0' });
      gsap.to('.slide--5__text h3', { opacity: 1, duration: 0.75, delay: 1.25, x: '0' });

      if ($('.slide--5 img.molecule').hasClass('active')) {
        nextButtonTimeout = setTimeout(() => {
          $(nextSlideButton).removeClass(hiddenArrowClass);
          $(prevSlideButton).removeClass(hiddenArrowClass);
        }, 2.25 * 1000);
      }
    });
  },
  6: () => {
    $('.arrow--next').removeClass('arrow--white');
    $('.slide--6__left img.molecule').on('click', function () {
      $(this).parent().addClass('active');

      gsap.to('.slide--6__left h3', { opacity: 1, duration: 0.75, delay: 0.75, y: '0' });
      gsap.to('.slide--6__left h4', { opacity: 1, duration: 0.75, delay: 1.15, y: '0' });
      gsap.to('.slide--6__left .line.vertical', { opacity: 1, duration: 0.5, delay: 1.55, scaleY: 1 });
      gsap.to('.slide--6__left .line.horizontal.first', { opacity: 1, duration: 0.5, delay: 1.95, scaleX: 1 });
      gsap.to('.slide--6__left .line.horizontal.second', { opacity: 1, duration: 0.5, delay: 2.35, scaleX: 1 });
      gsap.to('.slide--6__block.second', { opacity: 1, duration: 0.75, delay: 2.75, x: '0' });
      gsap.to('.slide--6__block.first', { opacity: 1, duration: 0.75, delay: 3.15, x: '0' });
      gsap.to('.slide--6__right-block h4', { opacity: 1, duration: 0.75, delay: 3.65, y: '0' });
      gsap.to('.slide--6__right-subblock.first', { opacity: 1, duration: 0.75, delay: 4.05, y: '0' });
      gsap.to('.slide--6__right-subblock.second', { opacity: 1, duration: 0.75, delay: 4.45, y: '0' });
      gsap.to('.slide--6__right-subblock.third', { opacity: 1, duration: 0.75, delay: 4.85, y: '0' });

      if ($('.slide--6__left-content').hasClass('active')) {
        nextButtonTimeout = setTimeout(() => {
          $(nextSlideButton).removeClass(hiddenArrowClass);
          $(prevSlideButton).removeClass(hiddenArrowClass);
        }, 5.85 * 1000);
      }
    })
  },
  7: () => {
    $('.arrow--next').addClass('arrow--white');

    $('.slide--7__bottle-block .animation-plus').on('click', function() {
      $(this).parent().addClass('active');

      $(this).fadeOut(350, function () {
        $(this).parent().find('img').fadeIn(500, function() {
          $(this).parent().find('.text').fadeIn(500);
        });
      });

      if ($('.slide--7__bottle-block.active').length === 2) {
        nextButtonTimeout = setTimeout(() => {
          $(nextSlideButton).removeClass(hiddenArrowClass);
          $(prevSlideButton).removeClass(hiddenArrowClass);
        }, 2 * 1000);
      }
    })
  },
  8: () => {
    $('.slide--8__left ul li .animation-plus').on('click', function () {
      $(this).parent().addClass('active');

      $(this).fadeOut(350, function () {
         $(this).parent().find('strong').animate({
          opacity: 1,
          left: 0
        }, 500);
      });

      if ($('.slide--8__left ul li.active').length === 3 && $('.slide--8__bottle.active').length === 2) {
        nextButtonTimeout = setTimeout(() => {
          $(nextSlideButton).removeClass(hiddenArrowClass);
          $(prevSlideButton).removeClass(hiddenArrowClass);
        }, 1 * 1000);
      }
    });

    $('.slide--8__bottle img.bottle').on('click', function () {
      $(this).parent().addClass('active');

      gsap.to($(this).parent().find('.slide--8__bottle-text'), { opacity: 1, duration: 0.5, delay: 0.75, x: '0'});

      if ($('.slide--8__left ul li.active').length === 3 && $('.slide--8__bottle.active').length === 2) {
        nextButtonTimeout = setTimeout(() => {
          $(nextSlideButton).removeClass(hiddenArrowClass);
          $(prevSlideButton).removeClass(hiddenArrowClass);
        }, 1 * 1000);
      }
    })
  },
  9: () => {
    gsap.from('.slide--9__left h2', { opacity: 0, duration: 0.75, delay: 1, y: '35%', });
    gsap.from('.slide--9__left h3', { opacity: 0, duration: 0.75, delay: 1.4, y: '35%', });
    gsap.from('.slide--9__left h4', { opacity: 0, duration: 0.75, delay: 1.8, y: '35%', });
    gsap.from('.slide--9__left-block', { opacity: 0, duration: 0.75, delay: 2.2, y: '35%', });
    gsap.from('.slide--9__left p', { opacity: 0, duration: 0.75, delay: 2.6, y: '35%', });
    gsap.from('.slide--9__right ul li.first', { opacity: 0, duration: 0.75, delay: 3.1, y: '35%', });
    gsap.from('.slide--9__right ul li.second', { opacity: 0, duration: 0.75, delay: 3.45, y: '35%', });
    gsap.from('.slide--9__right ul li.third', { opacity: 0, duration: 0.75, delay: 3.8, y: '35%', });
    gsap.from('.slide--9__right-block', { opacity: 0, duration: 0.75, delay: 4.2, y: '35%', });
    nextArrowDelay = 5.2;
  },
  10: () => {
    $('.slide--10__bottle-block .animation-plus').on('click', function() {
      $(this).parent().addClass('active');

      $(this).fadeOut(350, function () {
        $(this).parent().find('img').fadeIn(500)
        $(this).parent().find('.text').fadeIn(500);

        if($(this).parent().hasClass('second') && $('.slide--10__bottle-block.second p').length === 1) {
          $('.slide--10__bottle-block.second p').fadeIn(500);
        }
      });

      if ($('.slide--10__bottle-block.active').length === 2) {
        $('.slide--10__bottles').addClass('visible');
        nextButtonTimeout = setTimeout(() => {
          $(nextSlideButton).removeClass(hiddenArrowClass);
          $(prevSlideButton).removeClass(hiddenArrowClass);
        }, 2 * 1000);
      }
    })
  },
  11: () => {
    $('.slide--11__bottle img.bottle').on('click', function() {
      $(this).parent().addClass('active');

      if($(this).parent().hasClass('first')) {
        gsap.to('.slide--11__bottle.first .slide--11__bottle-text .line', {
          opacity: 1, duration: 0.5, delay: 0.75, scaleX: 1,
          onComplete: function() {
            $('.slide--11__bottle.first .slide--11__bottle-text').addClass('with-border')
          }
        });
        gsap.to('.slide--11__bottle.first .slide--11__bottle-text p', { opacity: 1, duration: 0.75, delay: 1.15 });
        gsap.to('.slide--11__bottle.first .slide--11__bottle-text img.cream', { opacity: 1, duration: 0.75, delay: 1.15 });
        gsap.to('.slide--11 ul.left li.first', { opacity: 1, duration: 0.75, delay: 1.55, y: '0'});
        gsap.to('.slide--11 ul.left li.second', { opacity: 1, duration: 0.75, delay: 1.85, y: '0'});
        gsap.to('.slide--11 ul.left li.third', { opacity: 1, duration: 0.75, delay: 2.2, y: '0'});
      } else {
        gsap.to('.slide--11__bottle.second .slide--11__bottle-text .line', {
          opacity: 1, duration: 0.5, delay: 0.75, scaleX: 1,
          onComplete: function() {
            $('.slide--11__bottle.second .slide--11__bottle-text').addClass('with-border')
          }
        });
        gsap.to('.slide--11__bottle.second .slide--11__bottle-text p', { opacity: 1, duration: 0.75, delay: 1.15 });
        gsap.to('.slide--11__bottle.second .slide--11__bottle-text img.cream', { opacity: 1, duration: 0.75, delay: 1.15 });
        gsap.to('.slide--11 ul.right li.first', { opacity: 1, duration: 0.75, delay: 1.55 });
        gsap.to('.slide--11 ul.right li.second', { opacity: 1, duration: 0.75, delay: 1.85 });
        gsap.to('.slide--11 ul.right li.third', { opacity: 1, duration: 0.75, delay: 2.2 });
        gsap.to('.slide--11 ul.right li.fourth', { opacity: 1, duration: 0.75, delay: 2.5 });
        gsap.to('.slide--11 ul.right li.fifth', { opacity: 1, duration: 0.75, delay: 2.8 });
      }

      if ($('.slide--11__bottle.active').length === 2) {
        $('.slide--11__bottles').css('z-index', 1);
        nextButtonTimeout = setTimeout(() => {
          $(nextSlideButton).removeClass(hiddenArrowClass);
          $(prevSlideButton).removeClass(hiddenArrowClass);
        }, 3.55 * 1000);
      }
    })
  },
  12: () => {
    $('.arrow--next').removeClass('arrow--white');
    gsap.from('.slide--12__left h2', { opacity: 0, duration: 0.75, delay: 1, y: '35%', });
    gsap.from('.slide--12__left h3', { opacity: 0, duration: 0.75, delay: 1.3, y: '35%', });
    gsap.from('.slide--12__left h4, .slide--12__left p', { opacity: 0, duration: 0.75, delay: 1.6, y: '35%', });

    $('.slide--12__block .animation-plus').on('click', function() {
      $(this).parent().addClass('active');

      $(this).fadeOut(350, function() {
        $(this).parent().find('img').fadeIn(500)
        $(this).parent().find('p').fadeIn(500);
      });

      if ($('.slide--12__block.active').length === 2) {
        nextButtonTimeout = setTimeout(() => {
          $(nextSlideButton).removeClass(hiddenArrowClass);
          $(prevSlideButton).removeClass(hiddenArrowClass);
        }, 2 * 1000);
      }
    });
  },
  13: () => {
    $('.arrow--next').addClass('arrow--white');
    $('.slide--13__plus').on('click', function() {
      $(this).addClass('active');
      gsap.to('.slide--13__bottle img', { opacity: 1, duration: 0.75, delay: 0.75, y: '0' });
      gsap.to('.slide--13__bottle p', { opacity: 1, duration: 0.75, delay: 1.25, y: '0' });
      gsap.to('.slide--13__bottle .line.vertical', { opacity: 1, duration: 0.5, delay: 1.75, scaleY: 1 });
      gsap.to('.slide--13__bottle .line.horizontal', { opacity: 1, duration: 0.5, delay: 2.25, scaleX: 1 });

      if ($('.slide--13__plus').hasClass('active')) {
        nextButtonTimeout = setTimeout(() => {
          $(nextSlideButton).removeClass(hiddenArrowClass);
          $(prevSlideButton).removeClass(hiddenArrowClass);
        }, 3.25 * 1000);
      }
    });
  },
  14: () => {
    $('.arrow--next').removeClass('arrow--white');
    gsap.from('.slide--14__block p.first', { opacity: 0, duration: 0.75, delay: 1, x: '15%' });
    gsap.from('.slide--14__block p.second', { opacity: 0, duration: 0.75, delay: 1.4, x: '15%' });
    gsap.from('.slide--14__right h4', { opacity: 0, duration: 0.75, delay: 1.9 });
    gsap.from('.slide--14__right ul li.first', { opacity: 0, duration: 0.75, delay: 2.3, y: '25%' });
    gsap.from('.slide--14__right ul li.second', { opacity: 0, duration: 0.75, delay: 2.5, y: '25%' });
    gsap.from('.slide--14__right ul li.third', { opacity: 0, duration: 0.75, delay: 2.7, y: '25%' });
    nextArrowDelay = 3.7;
  },
  15: () => {
    $('.arrow--next').removeClass('arrow--white');
    $('.slide--15__list-block img').on('click', function() {
      $(this).parent().addClass('active');

      gsap.to($(this).parent().find('p'), { opacity: 1, duration: 0.75, delay: 0.75 });

      if ($('.slide--15__list-block.active').length === 3) {
        nextButtonTimeout = setTimeout(() => {
          $(nextSlideButton).removeClass(hiddenArrowClass);
          $(prevSlideButton).removeClass(hiddenArrowClass);
        }, 1.75 * 1000);
      }
    })
  },
  16: () => {
    $('.arrow--next').addClass('arrow--white');
    
    $('.slide--16__bottle').on('click', function() {
      $(this).addClass('active');

      gsap.to('.slide--16__text', { opacity: 1, duration: 0.75, delay: 0.75, x: '0' });
      gsap.to('.slide--16__list', { opacity: 1, duration: 0.75, delay: 1.15, y: '0' });

      if ($('.slide--16__bottle').hasClass('active')) {
        nextButtonTimeout = setTimeout(() => {
          $(nextSlideButton).removeClass(hiddenArrowClass);
          $(prevSlideButton).removeClass(hiddenArrowClass);
        }, 2.15 * 1000);
      }
    })
  },
  17: () => {
    gsap.from('.slide--17__left', { opacity: 0, duration: 0.75, delay: 1 });
    gsap.from('.slide--17__bottle', { opacity: 0, duration: 0.75, delay: 1.5, y: '-30%' });
    gsap.from('.slide--17__bottle p', { opacity: 0, duration: 1, delay: 2, x: '-45%' });
    gsap.from('.slide--17__right ul li.first', { opacity: 0, duration: 0.75, delay: 2.75, y: '30%' });
    gsap.from('.slide--17__right ul li.second', { opacity: 0, duration: 0.75, delay: 3.15, y: '30%' });
    gsap.from('.slide--17__right ul li.third', { opacity: 0, duration: 0.75, delay: 3.55, y: '30%' });
    gsap.from('.slide--17__right ul li.fourth', { opacity: 0, duration: 0.75, delay: 3.95, y: '30%' });
    gsap.from('.slide--17__right ul li.fifth', { opacity: 0, duration: 0.75, delay: 4.35, y: '30%' });
    nextArrowDelay = 4.35;
  },
  18: () => {
    $('.arrow--next').addClass('arrow--white');
    gsap.from('.slide--18__left, .slide--18__bottle-left', { opacity: 0, duration: 0.75, delay: 1, y: '30%' });
    gsap.from('.slide--18__right, .slide--18__bottle-right', { opacity: 0, duration: 0.75, delay: 1.5, y: '-30%' });
    gsap.from('.slide--18__blocks h4', { opacity: 0, duration: 0.75, delay: 2, y: '25%' });
    gsap.from('.slide--18__block.first', { opacity: 0, duration: 0.75, delay: 2.5, y: '25%' });
    gsap.from('.slide--18__block.second', { opacity: 0, duration: 0.75, delay: 2.9, y: '25%' });
    gsap.from('.slide--18__block.third', { opacity: 0, duration: 0.75, delay: 3.3, y: '25%' });
    gsap.from('.slide--18__block.fourth', { opacity: 0, duration: 0.75, delay: 3.7, y: '25%' });
    gsap.from('.slide--18__block.fifth', { opacity: 0, duration: 0.75, delay: 4.1, y: '25%' });
    nextArrowDelay = 5.1;
  },
  19: () => {
    $('.arrow--next').removeClass('arrow--white');
    $('.slide--19__block .animation-plus').on('click', function() {
      $(this).addClass('active');
      
      $(this).fadeOut(350, function () {
        $(this).parent().find('img').fadeIn(500, function () {
           $(this).parent().find('p').fadeIn(500);
        })
      });

      if ($('.slide--19__block .animation-plus.active').length === 3) {
        nextButtonTimeout = setTimeout(() => {
          $(nextSlideButton).removeClass(hiddenArrowClass);
          $(prevSlideButton).removeClass(hiddenArrowClass);
        }, 1.5 * 1000);
      }
    });
  },
  20: () => {
    $('.arrow--next').addClass('arrow--white');
    $('.slide--20__bottle').on('click', function() {
      $(this).addClass('active');

      gsap.to('.slide--20__left h2', { opacity: 1, duration: 0.5, delay: 0.75, y: '0' });
      gsap.to('.slide--20__left h3', { opacity: 1, duration: 0.5, delay: 1.15, y: '0' });
      gsap.to('.slide--20__left-block', { opacity: 1, duration: 0.5, delay: 1.55, y: '0' });
      gsap.to('.slide--20__list-block', { opacity: 1, duration: 0.5, delay: 2.05, x: '-1em', xPercent: '-50' });
      gsap.to('.slide--20__list ul li.first', { opacity: 1, duration: 0.5, delay: 2.45, y: '0' });
      gsap.to('.slide--20__list ul li.second', { opacity: 1, duration: 0.5, delay: 2.8, y: '0' });
      gsap.to('.slide--20__list ul li.third', { opacity: 1, duration: 0.5, delay: 3.15, y: '0' });
      gsap.to('.slide--20__list ul li.fourth', { opacity: 1, duration: 0.5, delay: 3.5, y: '0' });
      gsap.to('.slide--20__list ul li.fifth', { opacity: 1, duration: 0.5, delay: 3.85, y: '0' });

      if ($('.slide--20__bottle').hasClass('active')) {
        nextButtonTimeout = setTimeout(() => {
          $(nextSlideButton).removeClass(hiddenArrowClass);
          $(prevSlideButton).removeClass(hiddenArrowClass);
        }, 4.85 * 1000);
      }
    })
  },
  21: () => {
    gsap.from('.slide--21__left-content', { opacity: 0, duration: 0.75, delay: 1, x: '-35%' });
    gsap.from('.slide--21__right ul', { opacity: 0, duration: 0.75, delay: 1.4, x: '35%' });
    gsap.from('.slide--21__icon.first', { opacity: 0, duration: 0.75, delay: 1.8, x: '25%', y: '25%' });
    gsap.from('.slide--21__icon.second', { opacity: 0, duration: 0.75, delay: 2.1, x: '25%', y: '25%' });
    gsap.from('.slide--21__icon.third', { opacity: 0, duration: 0.75, delay: 2.4, x: '25%', y: '25%' });
    nextArrowDelay = 3.4;
  },
  22: () => {
    clearTimeout(lastSlideActionTimeout);
    $('.slide--22__right-block').on('click', function() {
      $(this).addClass('active');

      gsap.to($(this).find('h5'), { opacity: 1, duration: 0.75, delay: 0.75 });
      gsap.to($(this).find('p'), { opacity: 1, duration: 0.75, delay: 1.15 });

      if ($('.slide--22__right-block.active').length === 2) {
        nextButtonTimeout = setTimeout(() => {
          $(nextSlideButton).removeClass(hiddenArrowClass);
          $(prevSlideButton).removeClass(hiddenArrowClass);
        }, 2.15 * 1000);
      }
    })
  },
  23: () => {
    $('.slide--23__bottle-left').on('click', function() {
      $(this).addClass('active');
      gsap.to('.slide--23__left h3', { opacity: 1, duration: 0.75, delay: 0.75, y: '0' });
      gsap.to('.slide--23__left-block-orange', { opacity: 1, duration: 0.75, delay: 1.15, y: '0' });
      gsap.to('.slide--23__left-block-white', { opacity: 1, duration: 0.75, delay: 1.55, y: '0' });

      if ($('.slide--23__bottle-left').hasClass('active') && $('.slide--23__bottle-right').hasClass('active')) {
        lastSlideActionTimeout = setTimeout(() => {
          lastSlideAction();
        }, 7.5 * 1000);
      }
    })

    $('.slide--23__bottle-right').on('click', function() {
      $(this).addClass('active');
      gsap.to('.slide--23__bottle-right p', { opacity: 1, duration: 0.75, delay: 0.75, y: '0' });
      gsap.to('.slide--23__right ul li.first', { opacity: 1, duration: 0.75, delay: 1.15, y: '0' });
      gsap.to('.slide--23__right ul li.second', { opacity: 1, duration: 0.75, delay: 1.35, y: '0' });
      gsap.to('.slide--23__right ul li.third', { opacity: 1, duration: 0.75, delay: 1.55, y: '0' });
      gsap.to('.slide--23__right ul li.fourth', { opacity: 1, duration: 0.75, delay: 1.75, y: '0' });
      gsap.to('.slide--23__right ul li.fifth', { opacity: 1, duration: 0.75, delay: 1.95, y: '0' });

      if ($('.slide--23__bottle-left').hasClass('active') && $('.slide--23__bottle-right').hasClass('active')) {
        lastSlideActionTimeout = setTimeout(() => {
          lastSlideAction();
        }, 7.5 * 1000);
      }
    })
  },
}
// function that add animation for element
function animateSlide(slideNum = 1) {
  gsap.from('.slide', { opacity: 0, duration: 0.75 });

  slideActions[slideNum]();
}
// function that detect oriental of device
function updateRotateBlockVisibility() {
  const isPortrait = window.matchMedia('(orientation: portrait)').matches;

  $(rotateBlock).toggleClass('visible', isPortrait);
}
// function that load slide without reloading page
async function loadComponent(componentPathName, slideNum) {
  const response = await fetch(componentPathName);
  const data = await response.text();

  slideContainer.innerHTML = data;
  animateSlide(slideNum);
}
// function that update info about prev/next button
function updateNavigationButtons(currentSlide) {
  clearTimeout(nextButtonTimeout);
  clearTimeout(prevButtonTimeout);

  $(nextSlideButton).addClass(hiddenArrowClass);
  $(prevSlideButton).addClass(hiddenArrowClass);

  switch (currentSlide) {
    case 0:
      break;
    case 1:
      nextButtonTimeout = setTimeout(() => {
        $(nextSlideButton).removeClass(hiddenArrowClass);
      }, nextArrowDelay * 1000);
      break;
    case 2:
    case 3:
    case 5:
    case 6:
    case 7:
    case 8:
    case 10:
    case 11:
    case 12:
    case 13:
    case 15:
    case 16:
    case 19:
    case 20:
    case 22:
      break;
    case totalSlideAmount:
      $(prevSlideButton).removeClass(hiddenArrowClass);
      break;
    default:
      nextButtonTimeout = setTimeout(() => {
        $(nextSlideButton).removeClass(hiddenArrowClass);
        $(prevSlideButton).removeClass(hiddenArrowClass);
      }, nextArrowDelay * 1000);
  }
}
// function that change slide on the screen
async function changeSlide(direction) {
  const currentSlideNum = slideContainer.getAttribute('data-current-slide');

  let newSlideNum;

  if (direction === 'next') {
    newSlideNum = Number(currentSlideNum) + 1;
  } else if (direction === 'prev') {
    newSlideNum = Number(currentSlideNum) - 1;
  }

  const { pathName } = pathNames.find(pathNameInfo => pathNameInfo.count === +newSlideNum);

  await loadComponent(pathName, newSlideNum);

  slideContainer.setAttribute('data-current-slide', newSlideNum);
  updateNavigationButtons(newSlideNum);
}

//window and document listeners
$(document).ready(function () {
  setResponsiveFontSize();
  updateRotateBlockVisibility();
});
$(window).on('resize', function () {
  setResponsiveFontSize();
  updateRotateBlockVisibility();
});
$(window).on('orientationchange', function () {
  updateRotateBlockVisibility();
});

// button listeners
$(agreementButton).on('click', () => {
  loadComponent(pathNames[0].pathName);
  slideContainer.setAttribute('data-current-slide', 1);
  updateNavigationButtons(1);
});
$(nextSlideButton).on('click', () => {
  changeSlide('next')
})
$(prevSlideButton).on('click', () => {
  changeSlide('prev')
});
