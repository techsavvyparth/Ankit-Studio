document.addEventListener('DOMContentLoaded', () => {

    // ==========================================
    // 1. FLOATING NAVBAR SCROLL EFFECTS
    // ==========================================
    const navbar = document.querySelector('.navbar');

    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });

    // Mobile Hamburger Menu Toggle Action
    const mobileMenuBtn = document.getElementById('mobile-menu');
    const navLinksList = document.querySelector('.nav-links');

    mobileMenuBtn.addEventListener('click', () => {
        mobileMenuBtn.classList.toggle('active');
        navLinksList.classList.toggle('active');
    });

    // Close mobile menu whenever clicking a nav link element
    document.querySelectorAll('.nav-item').forEach(item => {
        item.addEventListener('click', () => {
            mobileMenuBtn.classList.remove('active');
            navLinksList.classList.remove('active');
        });
    });


    // ==========================================
    // 2. FEATURED WORK CAROUSEL MOTOR LOGIC
    // ==========================================
    const track = document.querySelector('.carousel-track');
    const cards = Array.from(track.children);
    const nextBtn = document.querySelector('.next-btn');
    const prevBtn = document.querySelector('.prev-btn');
    const dotsContainer = document.querySelector('.carousel-dots');

    let currentIndex = 0;

    // Responsive setup logic for visible items count
    function getItemsPerView() {
        if (window.innerWidth <= 768) return 1;
        if (window.innerWidth <= 1024) return 2;
        return 3;
    }

    function initCarousel() {
        dotsContainer.innerHTML = '';
        const itemsPerView = getItemsPerView();
        const maxDots = cards.length - itemsPerView + 1;

        for (let i = 0; i < maxDots; i++) {
            const dot = document.createElement('div');
            dot.classList.add('dot');
            if (i === 0) dot.classList.add('active');
            dot.addEventListener('click', () => moveToSlide(i));
            dotsContainer.appendChild(dot);
        }
        updateCarouselSize();
    }

    function updateCarouselSize() {
        const itemsPerView = getItemsPerView();
        const cardGap = 30; // Matches standard CSS tracking gaps
        const totalGapWidth = cardGap * (itemsPerView - 1);
        const cardWidth = (track.parentElement.getBoundingClientRect().width - totalGapWidth) / itemsPerView;

        cards.forEach(card => {
            card.style.minWidth = `${cardWidth}px`;
        });

        moveToSlide(currentIndex);
    }

    function moveToSlide(index) {
        const itemsPerView = getItemsPerView();
        const maxIndex = cards.length - itemsPerView;

        if (index < 0) index = 0;
        if (index > maxIndex) index = maxIndex;

        currentIndex = index;
        const cardWidth = cards[0].getBoundingClientRect().width;
        const totalShift = currentIndex * (cardWidth + 30);

        track.style.transform = `translateX(-${totalShift}px)`;

        // Refresh pagination indicator dots
        const dots = Array.from(dotsContainer.children);
        if (dots.length > 0) {
            dots.forEach(dot => dot.classList.remove('active'));
            dots[currentIndex].classList.add('active');
        }
    }

    nextBtn.addEventListener('click', () => {
        const itemsPerView = getItemsPerView();
        if (currentIndex >= cards.length - itemsPerView) {
            moveToSlide(0); // Infinite loop wrap back to start
        } else {
            moveToSlide(currentIndex + 1);
        }
    });

    prevBtn.addEventListener('click', () => {
        const itemsPerView = getItemsPerView();
        if (currentIndex <= 0) {
            moveToSlide(cards.length - itemsPerView); // Infinite loop wrap back to end
        } else {
            moveToSlide(currentIndex - 1);
        }
    });

    // Touch Swipe Support for Mobile Devices
    let startX = 0;
    let endX = 0;

    track.addEventListener('touchstart', e => startX = e.touches[0].clientX, { passive: true });
    track.addEventListener('touchend', e => {
        endX = e.changedTouches[0].clientX;
        if (startX - endX > 50) nextBtn.click();
        if (endX - startX > 50) prevBtn.click();
    }, { passive: true });

    window.addEventListener('resize', () => {
        initCarousel();
    });

    initCarousel();

    // Auto-slide for Featured Work Carousel every 3 seconds
    setInterval(() => {
        nextBtn.click();
    }, 3000);


    // ==========================================
    // 3. MASONRY GALLERY LIGHTBOX LOGIC
    // ==========================================
    const lightbox = document.getElementById('lightbox');
    const lightboxImg = document.getElementById('lightbox-img');
    const lightboxClose = document.querySelector('.lightbox-close');
    const masonryItems = document.querySelectorAll('.masonry-item');

    masonryItems.forEach(item => {
        item.addEventListener('click', () => {
            const highResSrc = item.getAttribute('data-src');
            lightboxImg.setAttribute('src', highResSrc);
            lightbox.classList.add('active');
            document.body.style.overflow = 'hidden'; // Lock scrolling
        });
    });

    lightboxClose.addEventListener('click', () => {
        lightbox.classList.remove('active');
        document.body.style.overflow = 'auto'; // Unlock scrolling
    });

    lightbox.addEventListener('click', (e) => {
        if (e.target !== lightboxImg) {
            lightbox.classList.remove('active');
            document.body.style.overflow = 'auto';
        }
    });


    // ==========================================
    // 4. CLIENT TESTIMONIALS SLIDER MOTOR
    // ==========================================
    const tTrack = document.querySelector('.testimonials-track');
    const tSlides = Array.from(tTrack.children);
    const tDotsContainer = document.querySelector('.t-slider-dots');
    let tIndex = 0;

    function initTestimonials() {
        tSlides.forEach((_, idx) => {
            const dot = document.createElement('div');
            dot.classList.add('dot');
            if (idx === 0) dot.classList.add('active');
            dot.addEventListener('click', () => moveTestimonial(idx));
            tDotsContainer.appendChild(dot);
        });
    }

    function moveTestimonial(idx) {
        tIndex = idx;
        tTrack.style.transform = `translateX(-${tIndex * 100}%)`;
        Array.from(tDotsContainer.children).forEach((dot, dIdx) => {
            dot.classList.toggle('active', dIdx === tIndex);
        });
    }

    // Auto-rotation engine loop for Client Reviews
    setInterval(() => {
        let nextIndex = tIndex + 1;
        if (nextIndex >= tSlides.length) nextIndex = 0;
        moveTestimonial(nextIndex);
    }, 7000);

    initTestimonials();


    // ==========================================
    // 5. INTERSECTION OBSERVER SCROLL ANIMATIONS
    // ==========================================
    const revealElements = document.querySelectorAll('.scroll-reveal');

    const revealObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('revealed');

                // If it contains statistics inside, fire off counter counters animation
                if (entry.target.classList.contains('about-section')) {
                    animateStatsCounters();
                }
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.15 });

    revealElements.forEach(element => revealObserver.observe(element));


    // ==========================================
    // 6. ANIMATED STATISTICS COUNTING LOGIC
    // ==========================================
    let countersFired = false;

    function animateStatsCounters() {
        if (countersFired) return;
        countersFired = true;

        const statNumbers = document.querySelectorAll('.stat-number');

        statNumbers.forEach(counter => {
            const target = parseInt(counter.getAttribute('data-target'), 10);
            const speed = 2000; // Complete duration limits in milliseconds
            const increment = target / (speed / 16); // 16ms approximate window frames loop standard

            let currentCount = 0;

            const updateCounter = () => {
                currentCount += increment;
                if (currentCount < target) {
                    counter.innerText = Math.ceil(currentCount);
                    requestAnimationFrame(updateCounter);
                } else {
                    counter.innerText = target;
                }
            };
            updateCounter();
        });
    }


    // ==========================================
    // 7. CONTACT FORM SUBMISSION CONTROLLER
    // ==========================================
    const form = document.getElementById('contactForm');
    const statusBox = document.getElementById('formStatus');

    form.addEventListener('submit', (e) => {
        e.preventDefault();
        statusBox.className = 'form-status';
        statusBox.innerText = 'Transmitting message safely...';

        // Mock simulation of API transport connection response logic
        setTimeout(() => {
            statusBox.classList.add('success');
            statusBox.innerText = 'Thank you! Your creative vision has arrived smoothly at our desk. Our production crew will contact you soon.';
            form.reset();
        }, 1500);
    });
});