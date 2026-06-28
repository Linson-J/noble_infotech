/* ==========================================================================
   Noble Infotech - Main JS Script (GSAP, Lenis & Interactions)
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
    
    // --- 1. PRELOADER ANIMATION ---
    const loader = document.getElementById('loader');
    window.addEventListener('load', () => {
        setTimeout(() => {
            gsap.to(loader, {
                opacity: 0,
                duration: 0.8,
                ease: 'power3.inOut',
                onComplete: () => {
                    loader.style.display = 'none';
                    // Trigger hero reveal once loader is gone
                    triggerHeroAnimations();
                }
            });
        }, 1500); // 1.5s visual time for the loader
    });

    // --- 2. LENIS SMOOTH SCROLL ---
    const lenis = new Lenis({
        duration: 1.2,
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        orientation: 'vertical',
        gestureOrientation: 'vertical',
        smoothWheel: true,
        wheelMultiplier: 1,
        touchMultiplier: 2,
        infinite: false,
    });

    function raf(time) {
        lenis.raf(time);
        requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);

    // Integrate Lenis with GSAP ScrollTrigger
    lenis.on('scroll', ScrollTrigger.update);
    gsap.ticker.add((time) => {
        lenis.raf(time * 1000);
    });
    gsap.ticker.lagSmoothing(0);

    // --- 3. CURSOR GLOW EFFECT & MAGNETIC BUTTONS ---
    const cursorGlow = document.getElementById('cursorGlow');
    const cursorDot = document.getElementById('cursorDot');
    
    document.addEventListener('mousemove', (e) => {
        // Smooth cursor dot movement
        gsap.to(cursorDot, {
            x: e.clientX,
            y: e.clientY,
            duration: 0.08,
            ease: 'power2.out'
        });
        
        // Slightly delayed glow follower
        gsap.to(cursorGlow, {
            x: e.clientX,
            y: e.clientY,
            duration: 0.3,
            ease: 'power2.out'
        });
    });

    // Add hover states to interactable items
    const hoverables = document.querySelectorAll('a, button, input, textarea, select, .port-node, .service-card');
    hoverables.forEach(item => {
        item.addEventListener('mouseenter', () => {
            cursorDot.classList.add('hovered');
            gsap.to(cursorGlow, {
                scale: 1.3,
                duration: 0.3
            });
        });
        item.addEventListener('mouseleave', () => {
            cursorDot.classList.remove('hovered');
            gsap.to(cursorGlow, {
                scale: 1,
                duration: 0.3
            });
        });
    });

    // Magnetic Button Effect
    const magneticBtns = document.querySelectorAll('.magnetic');
    magneticBtns.forEach(btn => {
        btn.addEventListener('mousemove', (e) => {
            const bound = btn.getBoundingClientRect();
            const strength = btn.dataset.strength || 20;
            // Get mouse position relative to button
            const x = e.clientX - bound.left - (bound.width / 2);
            const y = e.clientY - bound.top - (bound.height / 2);
            
            // Move button text/content
            gsap.to(btn, {
                x: x * (strength / 100),
                y: y * (strength / 100),
                duration: 0.3,
                ease: 'power2.out'
            });
        });
        
        btn.addEventListener('mouseleave', () => {
            gsap.to(btn, {
                x: 0,
                y: 0,
                duration: 0.5,
                ease: 'elastic.out(1, 0.3)'
            });
        });
    });

    // --- 4. HEADER BACKGROUND ADJUSTMENT ---
    const header = document.querySelector('.header');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });

    // --- 5. MOBILE MENU NAV ---
    const mobileToggle = document.querySelector('.mobile-toggle');
    const mobileOverlay = document.querySelector('.mobile-menu-overlay');
    const mobileClose = document.querySelector('.mobile-close');
    const mobileLinks = document.querySelectorAll('.mobile-nav-link');

    mobileToggle.addEventListener('click', () => {
        mobileOverlay.classList.add('active');
        lenis.stop(); // Stop scroll while menu is open
    });

    const closeMobileMenu = () => {
        mobileOverlay.classList.remove('active');
        lenis.start();
    };

    mobileClose.addEventListener('click', closeMobileMenu);
    mobileLinks.forEach(link => link.addEventListener('click', closeMobileMenu));

    // --- 6. HERO SECTION ENTRANCE ANIMATIONS ---
    function triggerHeroAnimations() {
        // Text reveals line-by-line
        gsap.to('.text-reveal-line', {
            y: '0%',
            duration: 1.2,
            stagger: 0.15,
            ease: 'power4.out'
        });

        // Other elements fade up
        gsap.fromTo('.fade-up-anim', {
            opacity: 0,
            y: 40,
            filter: 'blur(5px)'
        }, {
            opacity: 1,
            y: 0,
            filter: 'blur(0px)',
            duration: 1.2,
            stagger: 0.2,
            ease: 'power3.out',
            delay: 0.3
        });
        
        // Animate floating visual devices
        gsap.from('.dashboard-mockup', {
            opacity: 0,
            scale: 0.85,
            rotationX: 30,
            rotationY: -45,
            duration: 1.8,
            ease: 'power4.out',
            delay: 0.5
        });
    }

    // --- 7. CARGO SHIP SCROLL-BOUND BUSINESS JOURNEY ---
    const ship = document.getElementById('cargoShip');
    const portNodes = document.querySelectorAll('.port-node');
    const progressLine = document.querySelector('.ports-line-progress');
    
    // Register GSAP ScrollTrigger plugin
    gsap.registerPlugin(ScrollTrigger);

    // Pin journey section while ship sails
    const journeyTl = gsap.timeline({
        scrollTrigger: {
            trigger: '.journey-track-wrapper',
            start: 'top top',
            end: 'bottom bottom',
            scrub: 1, // Smooth scrubbing
            pin: '.journey-sticky-content',
            pinSpacing: true,
            onUpdate: (self) => {
                const shipLeft = 5 + (self.progress * 90);
                let latestActiveNode = null;
                
                // Activate ports as ship sails past them
                portNodes.forEach((node) => {
                    const nodePercent = parseFloat(node.style.left);
                    // If ship has crossed or is very close to node
                    if (shipLeft >= nodePercent - 3) {
                        node.classList.add('active');
                        latestActiveNode = node;
                    } else {
                        node.classList.remove('active');
                    }
                    node.classList.remove('current-active');
                });
                
                // Set the current-active class on the latest node reached by the ship
                if (latestActiveNode) {
                    latestActiveNode.classList.add('current-active');
                } else if (portNodes.length > 0) {
                    // Fallback to Port 1 before voyage begins
                    portNodes[0].classList.add('current-active');
                }
            }
        }
    });

    // Clean, timeline-based horizontal ship translation
    journeyTl.to(ship, {
        left: '95%',
        ease: 'none',
        duration: 1
    }, 0);

    // Clean, timeline-based progress bar fill
    journeyTl.to(progressLine, {
        width: '100%',
        ease: 'none',
        duration: 1
    }, 0);

    // --- 8. SERVICES FILTER & STAGGER ---
    const filterBtns = document.querySelectorAll('.tab-btn');
    const serviceCards = document.querySelectorAll('.service-card');

    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            // Remove active class from all buttons
            filterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            
            const category = btn.dataset.category;
            
            // Temporary container height lock to avoid layout shift
            const grid = document.querySelector('.services-grid');
            grid.style.minHeight = `${grid.clientHeight}px`;
            
            // GSAP stagger out cards
            gsap.to(serviceCards, {
                scale: 0.8,
                opacity: 0,
                duration: 0.25,
                stagger: 0.05,
                onComplete: () => {
                    serviceCards.forEach(card => {
                        const cardCat = card.dataset.cat;
                        if (category === 'all' || cardCat === category) {
                            card.style.display = 'flex';
                        } else {
                            card.style.display = 'none';
                        }
                    });
                    
                    // GSAP stagger back in matching cards
                    gsap.fromTo(serviceCards, {
                        scale: 0.8,
                        opacity: 0
                    }, {
                        scale: 1,
                        opacity: 1,
                        duration: 0.45,
                        stagger: 0.05,
                        ease: 'power2.out',
                        onComplete: () => {
                            grid.style.minHeight = 'auto'; // Release height lock
                        }
                    });
                }
            });
        });
    });

    // Tilt Effect on Service Cards (Mouse-movement tilt)
    serviceCards.forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            // Normalized values between -1 and 1
            const xc = ((x - rect.width / 2) / (rect.width / 2)) * 10;
            const yc = ((y - rect.height / 2) / (rect.height / 2)) * -10;
            
            gsap.to(card, {
                rotateY: xc,
                rotateX: yc,
                transformPerspective: 800,
                duration: 0.3,
                ease: 'power2.out'
            });
        });
        
        card.addEventListener('mouseleave', () => {
            gsap.to(card, {
                rotateY: 0,
                rotateX: 0,
                duration: 0.5,
                ease: 'power2.out'
            });
        });
    });

    // --- 9. STATS COUNTERS SCROLL ANIMATION ---
    const counterNumbers = document.querySelectorAll('.counter-num');
    
    counterNumbers.forEach(num => {
        const target = parseInt(num.dataset.target);
        
        ScrollTrigger.create({
            trigger: '.results-section',
            start: 'top 80%',
            once: true,
            onEnter: () => {
                let currentVal = 0;
                const counterObj = { val: 0 };
                
                gsap.to(counterObj, {
                    val: target,
                    duration: 2.5,
                    ease: 'power3.out',
                    onUpdate: () => {
                        num.innerText = Math.floor(counterObj.val);
                    }
                });
            }
        });
    });

    // --- 10. LUXURY AJAX CONTACT FORM SUBMISSION ---
    const contactForm = document.getElementById('contactForm');
    const responseMsg = document.getElementById('formResponse');
    
    if (contactForm) {
        contactForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            // Add sending animation to submit button
            const submitBtn = contactForm.querySelector('.submit-btn');
            const originalBtnText = submitBtn.innerHTML;
            submitBtn.innerHTML = `<span>Sending...</span><i class="ri-loader-4-line ri-spin"></i>`;
            submitBtn.disabled = true;
            
            // Collect Form Data
            const formData = new FormData(contactForm);
            const dataObj = {};
            formData.forEach((value, key) => {
                dataObj[key] = value;
            });
            
            try {
                const response = await fetch('/api/contact/', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'X-CSRFToken': formData.get('csrfmiddlewaretoken')
                    },
                    body: JSON.stringify(dataObj)
                });
                
                const result = await response.json();
                
                // Clear any classes on response message
                responseMsg.className = 'form-response-msg';
                
                if (response.ok) {
                    responseMsg.classList.add('success');
                    responseMsg.innerText = result.message;
                    contactForm.reset();
                    
                    // Reset placeholders in custom input animations
                    const inputs = contactForm.querySelectorAll('input, textarea');
                    inputs.forEach(input => input.blur());
                } else {
                    responseMsg.classList.add('error');
                    responseMsg.innerText = result.message || 'An error occurred. Please try again.';
                }
            } catch (err) {
                responseMsg.className = 'form-response-msg error';
                responseMsg.innerText = 'Network error. Please check your connection.';
                console.error('Submit error:', err);
            } finally {
                // Restore button state
                submitBtn.innerHTML = originalBtnText;
                submitBtn.disabled = false;
            }
        });
    }

    // --- 11. GENERAL SCROLL FADE REVEALS ---
    const generalReveals = document.querySelectorAll('.service-card, .work-card, .contact-detail-item, .contact-form-panel, .map-wrapper');
    generalReveals.forEach(element => {
        gsap.from(element, {
            scrollTrigger: {
                trigger: element,
                start: 'top 90%',
                toggleActions: 'play none none none',
            },
            opacity: 0,
            y: 30,
            duration: 0.8,
            ease: 'power2.out'
        });
    });

    // --- 12. DUAL THEME & REAL-TIME SHIP VOYAGE CYCLE ---
    const themeToggleBtn = document.getElementById('themeToggle');
    const mobileThemeToggleBtn = document.getElementById('mobileThemeToggle');
    const timeBadge = document.getElementById('timeBadge');
    
    // Function to generate twinkling stars dynamically
    function generateStarfield() {
        const sky = document.querySelector('.journey-sky');
        if (!sky) return;
        
        // Clear any existing stars first
        const oldStars = sky.querySelectorAll('.star');
        oldStars.forEach(s => s.remove());
        
        for (let i = 0; i < 40; i++) {
            const star = document.createElement('div');
            star.className = 'star';
            star.style.left = `${Math.random() * 100}%`;
            star.style.top = `${Math.random() * 70}%`;
            star.style.animationDelay = `${Math.random() * 3}s`;
            star.style.transform = `scale(${Math.random() * 0.8 + 0.3})`;
            sky.appendChild(star);
        }
    }

    // Function to update the toggle buttons' icon to match theme state
    function updateThemeIcons(isLight) {
        const iconClass = isLight ? 'ri-moon-line' : 'ri-sun-line';
        
        if (themeToggleBtn) {
            themeToggleBtn.innerHTML = `<i class="${iconClass}"></i>`;
        }
        if (mobileThemeToggleBtn) {
            mobileThemeToggleBtn.innerHTML = `<i class="${iconClass}"></i>`;
        }
    }

    // Function to update the Journey status badge
    function updateVoyageBadge(isLight) {
        if (!timeBadge) return;
        if (isLight) {
            timeBadge.innerText = 'Daytime Voyage';
        } else {
            timeBadge.innerText = 'Night Cruise';
        }
    }

    // Master function to set theme state
    function setTheme(isLight, saveSetting = true) {
        if (isLight) {
            document.body.classList.add('light-theme');
            updateThemeIcons(true);
            updateVoyageBadge(true);
            if (saveSetting) localStorage.setItem('noble-theme', 'light');
        } else {
            document.body.classList.remove('light-theme');
            updateThemeIcons(false);
            updateVoyageBadge(false);
            generateStarfield();
            if (saveSetting) localStorage.setItem('noble-theme', 'dark');
        }
    }

    // Toggle theme state
    function toggleTheme() {
        const isCurrentLight = document.body.classList.contains('light-theme');
        setTheme(!isCurrentLight);
    }

    // Event listeners
    if (themeToggleBtn) themeToggleBtn.addEventListener('click', toggleTheme);
    if (mobileThemeToggleBtn) mobileThemeToggleBtn.addEventListener('click', toggleTheme);

    // Initial check: local storage setting OR fallback to current system/local hour
    const savedTheme = localStorage.getItem('noble-theme');
    if (savedTheme) {
        setTheme(savedTheme === 'light', false);
    } else {
        // Detect actual local hour (Daytime: 6 AM to 6 PM)
        const hour = new Date().getHours();
        const isDayTime = hour >= 6 && hour < 18;
        setTheme(isDayTime, false);
    }

});
