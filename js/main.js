document.addEventListener('DOMContentLoaded', () => {
    // Custom Cursor (Only on Desktop)
    const cursor = document.querySelector('.custom-cursor');
    const follower = document.querySelector('.cursor-follower');

    if (window.innerWidth > 991 && cursor && follower) {
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
    }

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
    // Filter out .reveal elements that are children of staggered grids to prevent double-animation conflicts
    const reveals = Array.from(document.querySelectorAll('.reveal')).filter(el => {
        return !el.closest('.property-grid') && 
               !el.closest('.property-grid-alt') && 
               !el.closest('.stats-grid') && 
               !el.closest('.team-grid') && 
               !el.closest('.testimonials-grid');
    });
    
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

    // ==========================================================================
    // Calendar Modal Injection and Generation Engine
    // ==========================================================================

    let currentDate = new Date(2026, 4, 19); // Today simulated: May 19, 2026
    let displayedMonth = 4; // May
    let displayedYear = 2026;

    const monthNames = [
        "January", "February", "March", "April", "May", "June",
        "July", "August", "September", "October", "November", "December"
    ];

    // Global click listener for delegation
    document.addEventListener('click', (e) => {
        const btn = e.target.closest('.btn-premium, .btn-solid, button, a');
        if (btn && (btn.textContent.trim().toLowerCase() === 'book consultation' || btn.textContent.trim().toLowerCase() === 'book inspection')) {
            e.preventDefault();
            openCalendarModal();
        }
    });

    function openCalendarModal() {
        let modal = document.getElementById('calendarModal');
        if (!modal) {
            modal = document.createElement('div');
            modal.id = 'calendarModal';
            modal.className = 'calendar-modal';
            modal.innerHTML = `
                <div class="calendar-modal-content glass-card">
                    <button class="calendar-close" id="closeCalendarBtn"><i class="fas fa-times"></i></button>
                    <h2 class="calendar-modal-title">Select Inspection Date</h2>
                    <div class="calendar-header">
                        <button class="calendar-btn" id="prevMonthBtn"><i class="fas fa-chevron-left"></i></button>
                        <h3 id="currentMonthYear">May 2026</h3>
                        <button class="calendar-btn" id="nextMonthBtn"><i class="fas fa-chevron-right"></i></button>
                    </div>
                    <div class="calendar-grid" id="calendarDaysGrid">
                        <div class="calendar-day-name">Sun</div>
                        <div class="calendar-day-name">Mon</div>
                        <div class="calendar-day-name">Tue</div>
                        <div class="calendar-day-name">Wed</div>
                        <div class="calendar-day-name">Thu</div>
                        <div class="calendar-day-name">Fri</div>
                        <div class="calendar-day-name">Sat</div>
                    </div>
                </div>
            `;
            document.body.appendChild(modal);

            // Bind inner click events
            document.getElementById('closeCalendarBtn').addEventListener('click', closeCalendarModal);
            document.getElementById('prevMonthBtn').addEventListener('click', () => changeMonth(-1));
            document.getElementById('nextMonthBtn').addEventListener('click', () => changeMonth(1));
            
            // Close on clicking backdrop
            modal.addEventListener('click', (e) => {
                if (e.target === modal) {
                    closeCalendarModal();
                }
            });
        }

        // Reset to default starting month/year
        displayedMonth = 4;
        displayedYear = 2026;
        renderCalendar();

        // Show modal with transition
        setTimeout(() => {
            modal.classList.add('active');
            document.body.style.overflow = 'hidden';
        }, 10);
    }

    function closeCalendarModal() {
        const modal = document.getElementById('calendarModal');
        if (modal) {
            modal.classList.remove('active');
            document.body.style.overflow = '';
        }
    }

    function changeMonth(direction) {
        displayedMonth += direction;
        if (displayedMonth < 0) {
            displayedMonth = 11;
            displayedYear--;
        } else if (displayedMonth > 11) {
            displayedMonth = 0;
            displayedYear++;
        }
        renderCalendar();
    }

    function renderCalendar() {
        const monthYearLabel = document.getElementById('currentMonthYear');
        const grid = document.getElementById('calendarDaysGrid');
        
        if (!monthYearLabel || !grid) return;

        monthYearLabel.textContent = `${monthNames[displayedMonth]} ${displayedYear}`;

        // Clear existing day numbers
        const dayNames = grid.querySelectorAll('.calendar-day-name');
        grid.innerHTML = '';
        dayNames.forEach(dn => grid.appendChild(dn));

        // Start index and total days of the month
        const firstDayIndex = new Date(displayedYear, displayedMonth, 1).getDay();
        const totalDays = new Date(displayedYear, displayedMonth + 1, 0).getDate();

        // Spacers for first week padding
        for (let i = 0; i < firstDayIndex; i++) {
            const emptyCell = document.createElement('div');
            emptyCell.className = 'calendar-day disabled';
            grid.appendChild(emptyCell);
        }

        // Generate day numbers
        const today = new Date(2026, 4, 19); // Static system date

        for (let day = 1; day <= totalDays; day++) {
            const dayCell = document.createElement('div');
            dayCell.className = 'calendar-day';
            dayCell.textContent = day;

            const thisDate = new Date(displayedYear, displayedMonth, day);
            
            // Check if thisDate is in the past
            if (thisDate < today && !(thisDate.getFullYear() === today.getFullYear() && thisDate.getMonth() === today.getMonth() && thisDate.getDate() === today.getDate())) {
                dayCell.classList.add('disabled');
            } else {
                // Highlight today
                if (displayedYear === today.getFullYear() && displayedMonth === today.getMonth() && day === today.getDate()) {
                    dayCell.classList.add('active');
                }
                
                // Clicking selects date and redirects
                dayCell.addEventListener('click', () => {
                    const formattedDate = `${displayedYear}-${String(displayedMonth + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
                    closeCalendarModal();
                    
                    setTimeout(() => {
                        window.location.href = `booking.html?date=${formattedDate}`;
                    }, 200);
                });
            }
            grid.appendChild(dayCell);
        }
    }

    // ==========================================================================
    // FAQ Accordion Interactivity
    // ==========================================================================
    const faqQuestions = document.querySelectorAll('.faq-question');
    faqQuestions.forEach(q => {
        q.addEventListener('click', () => {
            const item = q.parentElement;
            const answer = item.querySelector('.faq-answer');
            const isActive = item.classList.contains('active');
            
            // Close all other FAQs for clean single-accordion behavior
            document.querySelectorAll('.faq-item').forEach(el => {
                el.classList.remove('active');
                const ans = el.querySelector('.faq-answer');
                if (ans) ans.style.maxHeight = null;
            });

            if (!isActive) {
                item.classList.add('active');
                answer.style.maxHeight = answer.scrollHeight + 'px';
            }
        });
    });
});

