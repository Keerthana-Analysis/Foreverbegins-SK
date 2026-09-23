document.addEventListener("DOMContentLoaded", () => {
  const music = document.getElementById('bg-music');
  const musicBtn = document.getElementById('music-btn');
  const waxSealBtn = document.getElementById('wax-seal-btn');
  const envelopeWrapper = document.getElementById('envelope-wrapper');
  const openingScreen = document.getElementById('opening-screen');
  const silLeft = document.getElementById('sil-left');
  const silRight = document.getElementById('sil-right');
  const chapterDate = document.getElementById('chapter-date');
  let isPlaying = false;

  function toggleAudio() {
    if (isPlaying) {
      music.pause();
      isPlaying = false;
      musicBtn.style.opacity = '0.5';
    } else {
      music.play().then(() => {
        isPlaying = true;
        musicBtn.style.opacity = '1';
      }).catch(e => console.log("Audio block:", e));
    }
  }

  musicBtn.addEventListener('click', toggleAudio);

  waxSealBtn.addEventListener('click', () => {
    toggleAudio();
    waxSealBtn.classList.add('glowing');
    setTimeout(() => envelopeWrapper.classList.add('open'), 300);
    setTimeout(() => {
      openingScreen.classList.add('zoom-fade-out');
      document.body.classList.remove('locked');
      createPetalShower();
    }, 800);
  });

  // SILHOUETTE: visible in Chapter 1, hidden in Chapter 2
const chapter1 = document.getElementById('chapter1');
const chapter2 = document.getElementById('chapter2');

if (chapter1 && chapter2) {
  const silhouetteObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.target === chapter1 && entry.isIntersecting) {
        if (silLeft) silLeft.classList.remove('silhouette-hidden');
        if (silRight) silRight.classList.remove('silhouette-hidden');
      }

      if (entry.target === chapter2 && entry.isIntersecting) {
        if (silLeft) silLeft.classList.add('silhouette-hidden');
        if (silRight) silRight.classList.add('silhouette-hidden');
      }
    });
  }, {
    root: null,
    threshold: 0.15
  });

  silhouetteObserver.observe(chapter1);
  silhouetteObserver.observe(chapter2);
}

  // FADE IN TEXT ELEMENTS ON SCROLL
  const dustObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('in-view');
      }
    });
  }, { threshold: 0.1 });

  document.querySelectorAll('.dust-text').forEach(el => dustObserver.observe(el));

  // SCRATCH CARD LOGIC
  const canvas = document.getElementById('scratch-canvas');
  const ctx = canvas.getContext('2d');
  let isScratching = false;

  function initScratchCard() {
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;
    
    ctx.fillStyle = '#b0c4de';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.font = '14px Montserrat';
    ctx.fillStyle = '#1b2631';
    ctx.textAlign = 'center';
    ctx.fillText('Scratch to reveal the date ✨', canvas.width / 2, canvas.height / 2 + 5);
  }

  function scratch(e) {
    if (!isScratching) return;
    const rect = canvas.getBoundingClientRect();
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const clientY = e.touches ? e.touches[0].clientY : e.clientY;
    
    const x = clientX - rect.left;
    const y = clientY - rect.top;

    ctx.globalCompositeOperation = 'destination-out';
    ctx.beginPath();
    ctx.arc(x, y, 22, 0, Math.PI * 2);
    ctx.fill();

    checkScratchPercentage();
  }

  function checkScratchPercentage() {
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    let cleared = 0;
    for (let i = 3; i < imageData.data.length; i += 4) {
      if (imageData.data[i] === 0) cleared++;
    }
    if (cleared / (imageData.data.length / 4) > 0.4) {
      canvas.style.display = 'none';
      document.getElementById('countdown-section').style.opacity = '1';
      triggerConfetti();
    }
  }

  canvas.addEventListener('mousedown', () => isScratching = true);
  canvas.addEventListener('mouseup', () => isScratching = false);
  canvas.addEventListener('mousemove', scratch);
  
  canvas.addEventListener('touchstart', () => isScratching = true);
  canvas.addEventListener('touchend', () => isScratching = false);
  canvas.addEventListener('touchmove', scratch);

  initScratchCard();

  // COUNTDOWN TIMER
  const weddingDate = new Date('November 13, 2026 06:30:00').getTime();

  function updateCountdown() {
    const now = new Date().getTime();
    const distance = weddingDate - now;

    if (distance > 0) {
      document.getElementById('days').innerText = Math.floor(distance / (1000 * 60 * 60 * 24));
      document.getElementById('hours').innerText = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      document.getElementById('mins').innerText = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
      document.getElementById('secs').innerText = Math.floor((distance % (1000 * 60)) / 1000);
    }
  }
  setInterval(updateCountdown, 1000);
  updateCountdown();

  // GALLERY SLIDER
// ===== INFINITE 3D MEMORY GALLERY =====

let currentSlide = 0;

const track = document.getElementById('gallery-track');

const slides = Array.from(
  track.querySelectorAll('.gallery-slide')
);

const totalSlides = slides.length;

const currentCounter =
  document.getElementById('gallery-current');

const totalCounter =
  document.getElementById('gallery-total');

const prevButton =
  document.getElementById('gallery-prev');

const nextButton =
  document.getElementById('gallery-next');


totalCounter.textContent =
  String(totalSlides).padStart(2, '0');


function getCircularDistance(index, current, total) {

  let distance = index - current;

  if (distance > total / 2) {
    distance -= total;
  }

  if (distance < -total / 2) {
    distance += total;
  }

  return distance;
}


function updateGallery() {

  slides.forEach((slide, index) => {

    const distance =
      getCircularDistance(
        index,
        currentSlide,
        totalSlides
      );


    slide.classList.remove(
      'gallery-center',
      'gallery-left',
      'gallery-right',
      'gallery-far-left',
      'gallery-far-right',
      'gallery-hidden'
    );


    if (distance === 0) {

      slide.classList.add(
        'gallery-center'
      );

    } else if (distance === -1) {

      slide.classList.add(
        'gallery-left'
      );

    } else if (distance === 1) {

      slide.classList.add(
        'gallery-right'
      );

    } else if (distance === -2) {

      slide.classList.add(
        'gallery-far-left'
      );

    } else if (distance === 2) {

      slide.classList.add(
        'gallery-far-right'
      );

    } else {

      slide.classList.add(
        'gallery-hidden'
      );

    }

  });


  currentCounter.textContent =
    String(currentSlide + 1).padStart(2, '0');
}


window.goToSlide = function(index) {

  currentSlide =
    (index + totalSlides) % totalSlides;

  updateGallery();
};


function nextMemory() {

  currentSlide =
    (currentSlide + 1) % totalSlides;

  updateGallery();
}


function previousMemory() {

  currentSlide =
    (currentSlide - 1 + totalSlides)
    % totalSlides;

  updateGallery();
}


nextButton.addEventListener(
  'click',
  nextMemory
);

prevButton.addEventListener(
  'click',
  previousMemory
);


/* Touch swipe */

let touchStartX = 0;
let touchStartY = 0;


track.addEventListener(
  'touchstart',
  (e) => {

    touchStartX =
      e.touches[0].clientX;

    touchStartY =
      e.touches[0].clientY;

  },
  { passive: true }
);


track.addEventListener(
  'touchend',
  (e) => {

    const touchEndX =
      e.changedTouches[0].clientX;

    const touchEndY =
      e.changedTouches[0].clientY;

    const deltaX =
      touchEndX - touchStartX;

    const deltaY =
      touchEndY - touchStartY;


    /* Only react to a horizontal swipe */

    if (
      Math.abs(deltaX) > 40 &&
      Math.abs(deltaX) > Math.abs(deltaY)
    ) {

      if (deltaX < 0) {

        nextMemory();

      } else {

        previousMemory();

      }

    }

  },
  { passive: true }
);


/* Initial gallery state */

updateGallery();

  function createPetalShower() {
    for (let i = 0; i < 20; i++) {
      const petal = document.createElement('div');
      petal.className = 'particle petal';
      petal.style.left = Math.random() * 100 + 'vw';
      petal.style.animationDuration = (Math.random() * 5 + 5) + 's';
      petal.style.animationDelay = (Math.random() * 3) + 's';
      document.body.appendChild(petal);
    }
  }

  function triggerConfetti() {
  const cCanvas = document.getElementById('confetti-canvas');
  const cCtx = cCanvas.getContext('2d');

  cCanvas.width = window.innerWidth;
  cCanvas.height = window.innerHeight;

  let particles = Array.from({ length: 45 }, () => ({
    x: cCanvas.width / 2,
    y: cCanvas.height / 2,
    vx: (Math.random() - 0.5) * 10,
    vy: (Math.random() - 0.5) * 10 - 4,
    size: Math.random() * 5 + 5,
    life: 100,
    color: ['#d4af37', '#5dade2', '#ff6f91', '#e63956'][
      Math.floor(Math.random() * 4)
    ],
    rotation: Math.random() * Math.PI * 2,
    rotationSpeed: (Math.random() - 0.5) * 0.08
  }));

  function drawHeart(x, y, size, rotation, color, alpha) {
    cCtx.save();

    cCtx.translate(x, y);
    cCtx.rotate(rotation);
    cCtx.scale(size / 10, size / 10);

    cCtx.beginPath();
    cCtx.moveTo(0, 4);
    cCtx.bezierCurveTo(-8, -4, -10, -10, -5, -12);
    cCtx.bezierCurveTo(-2, -14, 0, -10, 0, -7);
    cCtx.bezierCurveTo(0, -10, 2, -14, 5, -12);
    cCtx.bezierCurveTo(10, -10, 8, -4, 0, 4);
    cCtx.closePath();

    cCtx.fillStyle = color;
    cCtx.globalAlpha = alpha;
    cCtx.fill();

    cCtx.restore();
  }

  function render() {
    cCtx.clearRect(0, 0, cCanvas.width, cCanvas.height);

    particles.forEach((p) => {
      p.x += p.vx;
      p.y += p.vy;
      p.vy += 0.18;
      p.rotation += p.rotationSpeed;
      p.life--;

      drawHeart(
        p.x,
        p.y,
        p.size,
        p.rotation,
        p.color,
        p.life / 100
      );
    });

    particles = particles.filter(p => p.life > 0);

    if (particles.length > 0) {
      requestAnimationFrame(render);
    } else {
      cCtx.clearRect(0, 0, cCanvas.width, cCanvas.height);
    }
  }

  render();
}
});

/* ===== CHAPTER 3 - LITTLE MOMENTS FADE ===== */

const chapter3Cards = document.querySelector('.chapter3-memory-cards');

if (chapter3Cards) {
  const chapter3Observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          chapter3Cards.classList.add('chapter3-visible');
          chapter3Observer.unobserve(entry.target);
        }
      });
    },
    {
      threshold: 0.25
    }
  );

  chapter3Observer.observe(chapter3Cards);
}

/* ===== CHAPTER 2 - GOLD DUST NAME REVEAL ===== */

const chapter2 = document.getElementById('chapter2');

if (chapter2) {
  const intro = chapter2.querySelector('.chapter2-intro');
  const firstName = document.querySelector('.name-reveal-wrap:nth-child(1)');
  const amp = chapter2.querySelector('.chapter2-amp');
  const secondName = document.querySelector('.name-reveal-wrap:nth-child(3)');
  const story = chapter2.querySelector('.chapter2-story');

  let chapter2Started = false;

  const startNameReveal = () => {
    if (chapter2Started) return;
    chapter2Started = true;

    /* Intro appears first */
    intro.style.opacity = '1';

    /* First name */
    setTimeout(() => {
      revealName(firstName, 'sivaraman-dust', 0);
    }, 700);

    /* Ampersand */
    setTimeout(() => {
      amp.classList.add('amp-visible');
    }, 2700);

    /* Second name */
    setTimeout(() => {
      revealName(secondName, 'keerthana-dust', 0);
    }, 3200);

    /* Bottom story appears last */
    setTimeout(() => {
      story.classList.add('story-visible');
    }, 5200);
  };

  function revealName(wrapper, canvasId, delay) {
  if (!wrapper) return;

  const canvas = document.getElementById(canvasId);
  const text = wrapper.querySelector('.reveal-name');

  if (!canvas || !text) return;

  const ctx = canvas.getContext('2d');

  canvas.width = wrapper.offsetWidth;
  canvas.height = wrapper.offsetHeight;

  const computedStyle = getComputedStyle(text);
  const font = computedStyle.font;
  const fullText = text.textContent.trim();

  /*
   * Create one gold-dust formation for each letter.
   * Each letter starts only after the previous one begins settling.
   */
  const letters = [];

  const measureCanvas = document.createElement('canvas');
  const measureCtx = measureCanvas.getContext('2d');
  measureCtx.font = font;

  let totalWidth = 0;

  for (const char of fullText) {
    totalWidth += measureCtx.measureText(char).width;
  }

  let currentX = (canvas.width - totalWidth) / 2;

  for (const char of fullText) {

    const letterWidth = measureCtx.measureText(char).width;

    if (char.trim() !== '') {

      const mask = document.createElement('canvas');
      mask.width = Math.ceil(letterWidth + 20);
      mask.height = canvas.height;

      const maskCtx = mask.getContext('2d');

      maskCtx.font = font;
      maskCtx.textAlign = 'left';
      maskCtx.textBaseline = 'middle';
      maskCtx.fillStyle = '#000';

      maskCtx.fillText(
        char,
        10,
        canvas.height / 2
      );

      const imageData = maskCtx.getImageData(
        0,
        0,
        mask.width,
        mask.height
      );

      const points = [];

      /*
       * Pick only a small number of points.
       * This keeps the effect elegant instead of glitter-heavy.
       */
      for (let y = 0; y < mask.height; y += 3) {
        for (let x = 0; x < mask.width; x += 3) {

          const alpha =
            imageData.data[
              (y * mask.width + x) * 4 + 3
            ];

          if (alpha > 100) {
            points.push({
              x: currentX + x - 10,
              y: y
            });
          }
        }
      }

      /*
       * Shuffle the points so the letter forms naturally.
       */
      for (let i = points.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [points[i], points[j]] = [points[j], points[i]];
      }

      /*
       * Only 35–50 particles per letter.
       */
      const particleCount = Math.min(
        48,
        Math.max(30, points.length)
      );

      const particles = [];

      for (let i = 0; i < particleCount; i++) {

        const target =
          points[i % points.length];

        particles.push({
          targetX: target.x,
          targetY: target.y,

          /*
           * Dust begins close to the letter,
           * rather than flying across the whole screen.
           */
          startX:
            target.x +
            (Math.random() - 0.5) * 90,

          startY:
            target.y +
            (Math.random() - 0.5) * 70,

          size:
            Math.random() * 1.2 + 0.6,

          alpha:
            Math.random() * 0.35 + 0.55,

          sparkle:
            Math.random() > 0.94
        });
      }

      letters.push({
        particles,
        x: currentX,
        width: letterWidth
      });
    }

    currentX += letterWidth;
  }

  let startTime = null;

  /*
   * Each letter gets its own moment.
   */
  const letterDuration = 360;
  const letterGap = 170;

  const totalDuration =
    (letters.length - 1) * letterGap +
    letterDuration;

  function animate(time) {

    if (!startTime) {
      startTime = time;
    }

    const elapsed = time - startTime;

    ctx.clearRect(
      0,
      0,
      canvas.width,
      canvas.height
    );

    letters.forEach((letter, index) => {

      const letterStart =
        index * letterGap;

      const rawProgress =
        (elapsed - letterStart) /
        letterDuration;

      if (rawProgress <= 0) return;

      const progress =
        Math.min(rawProgress, 1);

      /*
       * Smooth "dust settling into the letter".
       */
      const eased =
        1 - Math.pow(1 - progress, 3);

      letter.particles.forEach(p => {

        const x =
          p.startX +
          (p.targetX - p.startX) * eased;

        const y =
          p.startY +
          (p.targetY - p.startY) * eased;

        ctx.beginPath();

        /*
         * Very occasional tiny sparkle —
         * not a glitter explosion.
         */
        if (
          p.sparkle &&
          progress > 0.75 &&
          progress < 1
        ) {

          ctx.fillStyle =
            `rgba(255, 215, 0, ${p.alpha})`;

          ctx.arc(
            x,
            y,
            p.size * 1.8,
            0,
            Math.PI * 2
          );

        } else {

          ctx.fillStyle =
            `rgba(184, 134, 11, ${p.alpha})`;

          ctx.arc(
            x,
            y,
            p.size,
            0,
            Math.PI * 2
          );
        }

        ctx.fill();
      });
    });

    /*
     * Once every letter has formed,
     * give the dust a tiny final shimmer.
     */
    if (elapsed < totalDuration + 250) {

      requestAnimationFrame(animate);

    } else {

      setTimeout(() => {

        canvas.style.transition =
          'opacity 0.7s ease';

        canvas.style.opacity = '0';

        /*
         * Now reveal the clean final name.
         */
        wrapper.classList.add('name-formed');

      }, 120);
    }
  }

  setTimeout(() => {
    requestAnimationFrame(animate);
  }, delay);
}

  const chapter2Observer = new IntersectionObserver(
    entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          startNameReveal();
          chapter2Observer.unobserve(entry.target);
        }
      });
    },
    {
      threshold: 0.35
    }
  );

  chapter2Observer.observe(chapter2);
}