document.addEventListener('DOMContentLoaded', () => {
    // Custom Cursor
    const cursor = document.querySelector('.custom-cursor');
    const follower = document.querySelector('.cursor-follower');

    document.addEventListener('mousemove', (e) => {
        gsap.to(cursor, {
            x: e.clientX,
            y: e.clientY,
            duration: 0.1
        });
        gsap.to(follower, {
            x: e.clientX - 10,
            y: e.clientY - 10,
            duration: 0.3
        });
    });

    // Navbar Scroll Effect
    const nav = document.querySelector('nav');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            nav.classList.add('scrolled');
        } else {
            nav.classList.remove('scrolled');
        }
    });

    // Mobile Menu Toggle
    const menuToggle = document.getElementById('menuToggle');
    const closeMenu = document.getElementById('closeMenu');
    const mobileMenu = document.getElementById('mobileMenu');
    const mobileLinks = document.querySelectorAll('.mobile-link');

    if (menuToggle) {
        menuToggle.addEventListener('click', () => {
            mobileMenu.style.right = '0';
        });
    }

    if (closeMenu) {
        closeMenu.addEventListener('click', () => {
            mobileMenu.style.right = '-100%';
        });
    }

    mobileLinks.forEach(link => {
        link.addEventListener('click', () => {
            mobileMenu.style.right = '-100%';
        });
    });

    // GSAP ScrollTrigger Animations
    gsap.registerPlugin(ScrollTrigger);

    // Preloader Animation
    const preloaderTl = gsap.timeline();

    preloaderTl.to('.preloader-progress', {
        left: '0%',
        duration: 1.5,
        ease: 'power4.inOut'
    })
    .to('.preloader-logo', {
        y: -50,
        opacity: 0,
        duration: 0.8,
        ease: 'power2.in'
    }, '+=0.2')
    .to('#preloader', {
        y: '-100%',
        duration: 1,
        ease: 'power4.inOut',
        onComplete: () => {
            document.getElementById('preloader').style.display = 'none';
        }
    }, '-=0.4');

    // Hero Animations
    const tl = gsap.timeline({ delay: 2.8 });
    tl.from('.hero-content h1', {
        y: 100,
        opacity: 0,
        duration: 1.2,
        ease: 'power4.out'
    })
    .from('.hero-content p', {
        y: 50,
        opacity: 0,
        duration: 1,
        ease: 'power3.out'
    }, '-=0.8')
    .from('.hero-btns', {
        y: 50,
        opacity: 0,
        duration: 1,
        ease: 'power3.out'
    }, '-=0.8');

    // Section Reveal Animations (Enhanced)
    const reveals = document.querySelectorAll('.reveal');
    
    // Set initial state
    gsap.set(reveals, { opacity: 0, y: 60 });

    reveals.forEach(el => {
        gsap.to(el, {
            scrollTrigger: {
                trigger: el,
                start: 'top 85%',
                toggleActions: 'play none none none'
            },
            y: 0,
            opacity: 1,
            duration: 1.2,
            ease: 'power3.out'
        });
    });

    // Staggered reveals for grids
    const grids = ['.property-grid', '.property-grid-alt', '.stats-grid', '.team-grid', '.testimonials-grid'];
    grids.forEach(grid => {
        const items = document.querySelectorAll(`${grid} > *`);
        if (items.length > 0) {
            gsap.set(items, { opacity: 0, y: 50 });
            gsap.to(items, {
                scrollTrigger: {
                    trigger: grid,
                    start: 'top 85%',
                },
                y: 0,
                opacity: 1,
                duration: 1,
                stagger: 0.2,
                ease: 'power2.out'
            });
        }
    });

    // Stats Counter Animation
    const stats = document.querySelectorAll('.stat-number');
    stats.forEach(stat => {
        const target = parseInt(stat.getAttribute('data-target'));
        ScrollTrigger.create({
            trigger: stat,
            start: 'top 90%',
            onEnter: () => {
                let count = 0;
                const duration = 2000; // 2 seconds
                const startTime = performance.now();

                const updateCount = (currentTime) => {
                    const elapsed = currentTime - startTime;
                    const progress = Math.min(elapsed / duration, 1);
                    // Power 2 out ease
                    const easedProgress = 1 - Math.pow(1 - progress, 2);
                    
                    count = Math.floor(easedProgress * target);
                    stat.innerText = count;

                    if (progress < 1) {
                        requestAnimationFrame(updateCount);
                    } else {
                        stat.innerText = target;
                    }
                };
                requestAnimationFrame(updateCount);
            }
        });
    });
    // Hero Slider Animation
    const slides = document.querySelectorAll('.hero-slide');
    if (slides.length > 0) {
        let currentSlide = 0;
        const slideInterval = 6000; // 6 seconds

        const nextSlide = () => {
            slides[currentSlide].classList.remove('active');
            currentSlide = (currentSlide + 1) % slides.length;
            slides[currentSlide].classList.add('active');
        };

        setInterval(nextSlide, slideInterval);
    }
});
