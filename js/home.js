/**
 * MAISON VERGE 홈 화면 슬라이더 스크립트
 * 바닐라 JS로 구현 (Swiper 등 라이브러리 미사용)
 */

(function() {
    'use strict';

    // ========================================
    // 히어로 슬라이더
    // ========================================
    class HeroSlider {
        constructor() {
            this.viewport = document.querySelector('.home-hero__viewport');
            this.track = document.querySelector('.home-hero__track');
            this.slides = document.querySelectorAll('.home-hero__slide');
            this.dots = document.querySelectorAll('.home-hero__dot');
            
            if (!this.viewport || !this.track || this.slides.length === 0) return;
            
            this.currentIndex = 0;
            this.slideCount = this.slides.length;
            this.isDragging = false;
            this.startX = 0;
            this.currentTranslate = 0;
            this.prevTranslate = 0;
            this.autoplayInterval = null;
            this.autoplayDelay = 4000;
            this.dragThreshold = 20;
            
            this.init();
        }
        
        init() {
            // 터치 이벤트
            this.viewport.addEventListener('touchstart', this.handleTouchStart.bind(this), { passive: true });
            this.viewport.addEventListener('touchmove', this.handleTouchMove.bind(this), { passive: false });
            this.viewport.addEventListener('touchend', this.handleTouchEnd.bind(this));
            
            // 마우스 이벤트
            this.viewport.addEventListener('mousedown', this.handleMouseDown.bind(this));
            this.viewport.addEventListener('mousemove', this.handleMouseMove.bind(this));
            this.viewport.addEventListener('mouseup', this.handleMouseEnd.bind(this));
            this.viewport.addEventListener('mouseleave', this.handleMouseEnd.bind(this));
            
            // 인디케이터 클릭
            this.dots.forEach((dot, index) => {
                dot.addEventListener('click', () => this.goToSlide(index));
            });
            
            // 자동재생 시작
            this.startAutoplay();
            
            // 뷰포트 진입/이탈 시 자동재생 제어
            this.viewport.addEventListener('mouseenter', () => this.stopAutoplay());
            this.viewport.addEventListener('mouseleave', () => this.startAutoplay());
        }
        
        getSlideWidth() {
            return this.viewport.offsetWidth;
        }
        
        handleTouchStart(e) {
            this.isDragging = true;
            this.startX = e.touches[0].clientX;
            this.stopAutoplay();
            this.track.style.transition = 'none';
        }
        
        handleTouchMove(e) {
            if (!this.isDragging) return;
            
            const currentX = e.touches[0].clientX;
            const diff = currentX - this.startX;
            
            if (Math.abs(diff) > this.dragThreshold) {
                e.preventDefault();
            }
            
            this.currentTranslate = this.prevTranslate + diff;
            this.setTrackPosition();
        }
        
        handleTouchEnd() {
            this.isDragging = false;
            this.finishDrag();
            this.startAutoplay();
        }
        
        handleMouseDown(e) {
            this.isDragging = true;
            this.startX = e.clientX;
            this.stopAutoplay();
            this.track.style.transition = 'none';
            e.preventDefault();
        }
        
        handleMouseMove(e) {
            if (!this.isDragging) return;
            
            const currentX = e.clientX;
            const diff = currentX - this.startX;
            this.currentTranslate = this.prevTranslate + diff;
            this.setTrackPosition();
        }
        
        handleMouseEnd() {
            if (!this.isDragging) return;
            this.isDragging = false;
            this.finishDrag();
            this.startAutoplay();
        }
        
        finishDrag() {
            const movedBy = this.currentTranslate - this.prevTranslate;
            
            if (Math.abs(movedBy) > this.dragThreshold) {
                if (movedBy < 0 && this.currentIndex < this.slideCount - 1) {
                    this.currentIndex++;
                } else if (movedBy > 0 && this.currentIndex > 0) {
                    this.currentIndex--;
                }
            }
            
            this.goToSlide(this.currentIndex);
        }
        
        setTrackPosition() {
            this.track.style.transform = `translateX(${this.currentTranslate}px)`;
        }
        
        goToSlide(index) {
            this.currentIndex = index;
            const slideWidth = this.getSlideWidth();
            this.currentTranslate = -index * slideWidth;
            this.prevTranslate = this.currentTranslate;
            
            this.track.style.transition = 'transform 0.4s ease';
            this.setTrackPosition();
            
            this.updateIndicators();
        }
        
        updateIndicators() {
            this.dots.forEach((dot, index) => {
                if (index === this.currentIndex) {
                    dot.classList.add('home-hero__dot--active');
                } else {
                    dot.classList.remove('home-hero__dot--active');
                }
            });
        }
        
        startAutoplay() {
            this.stopAutoplay();
            this.autoplayInterval = setInterval(() => {
                const nextIndex = (this.currentIndex + 1) % this.slideCount;
                this.goToSlide(nextIndex);
            }, this.autoplayDelay);
        }
        
        stopAutoplay() {
            if (this.autoplayInterval) {
                clearInterval(this.autoplayInterval);
                this.autoplayInterval = null;
            }
        }
    }

    // ========================================
    // 제품 슬라이더 (공통)
    // ========================================
    class ProductSlider {
        constructor(trackElement) {
            this.track = trackElement;
            this.viewport = this.track.closest('.home-products__viewport');
            this.slides = this.track.querySelectorAll('.home-products__slide');
            
            if (!this.viewport || !this.track || this.slides.length === 0) return;
            
            this.isDragging = false;
            this.startX = 0;
            this.currentTranslate = 0;
            this.prevTranslate = 0;
            this.dragThreshold = 10;
            this.maxTranslate = 0;
            this.minTranslate = 0;
            
            this.init();
        }
        
        init() {
            this.calculateBounds();
            
            // 터치 이벤트
            this.viewport.addEventListener('touchstart', this.handleTouchStart.bind(this), { passive: true });
            this.viewport.addEventListener('touchmove', this.handleTouchMove.bind(this), { passive: false });
            this.viewport.addEventListener('touchend', this.handleTouchEnd.bind(this));
            
            // 마우스 이벤트
            this.viewport.addEventListener('mousedown', this.handleMouseDown.bind(this));
            this.viewport.addEventListener('mousemove', this.handleMouseMove.bind(this));
            this.viewport.addEventListener('mouseup', this.handleMouseEnd.bind(this));
            this.viewport.addEventListener('mouseleave', this.handleMouseEnd.bind(this));
            
            // 윈도우 리사이즈 시 재계산
            window.addEventListener('resize', () => this.calculateBounds());
        }
        
        calculateBounds() {
            const trackWidth = this.track.scrollWidth;
            const viewportWidth = this.viewport.offsetWidth;
            this.maxTranslate = 0;
            this.minTranslate = -(trackWidth - viewportWidth + 16); // 16px 패딩 고려
        }
        
        handleTouchStart(e) {
            this.isDragging = true;
            this.startX = e.touches[0].clientX;
            this.track.style.transition = 'none';
        }
        
        handleTouchMove(e) {
            if (!this.isDragging) return;
            
            const currentX = e.touches[0].clientX;
            const diff = currentX - this.startX;
            
            if (Math.abs(diff) > this.dragThreshold) {
                e.preventDefault();
            }
            
            let newTranslate = this.prevTranslate + diff;
            
            // 경계 처리 (탄성 효과)
            if (newTranslate > this.maxTranslate) {
                newTranslate = this.maxTranslate + (newTranslate - this.maxTranslate) * 0.3;
            } else if (newTranslate < this.minTranslate) {
                newTranslate = this.minTranslate + (newTranslate - this.minTranslate) * 0.3;
            }
            
            this.currentTranslate = newTranslate;
            this.setTrackPosition();
        }
        
        handleTouchEnd() {
            this.isDragging = false;
            this.finishDrag();
        }
        
        handleMouseDown(e) {
            this.isDragging = true;
            this.startX = e.clientX;
            this.track.style.transition = 'none';
            e.preventDefault();
        }
        
        handleMouseMove(e) {
            if (!this.isDragging) return;
            
            const currentX = e.clientX;
            const diff = currentX - this.startX;
            
            let newTranslate = this.prevTranslate + diff;
            
            // 경계 처리
            if (newTranslate > this.maxTranslate) {
                newTranslate = this.maxTranslate + (newTranslate - this.maxTranslate) * 0.3;
            } else if (newTranslate < this.minTranslate) {
                newTranslate = this.minTranslate + (newTranslate - this.minTranslate) * 0.3;
            }
            
            this.currentTranslate = newTranslate;
            this.setTrackPosition();
        }
        
        handleMouseEnd() {
            if (!this.isDragging) return;
            this.isDragging = false;
            this.finishDrag();
        }
        
        finishDrag() {
            // 경계 내로 스냅
            if (this.currentTranslate > this.maxTranslate) {
                this.currentTranslate = this.maxTranslate;
            } else if (this.currentTranslate < this.minTranslate) {
                this.currentTranslate = this.minTranslate;
            }
            
            this.prevTranslate = this.currentTranslate;
            this.track.style.transition = 'transform 0.3s ease';
            this.setTrackPosition();
        }
        
        setTrackPosition() {
            this.track.style.transform = `translateX(${this.currentTranslate}px)`;
        }
    }

    // ========================================
    // 카테고리 버튼 토글
    // ========================================
    function initCategoryButtons() {
        const buttons = document.querySelectorAll('.home-category__btn');
        
        buttons.forEach(btn => {
            btn.addEventListener('click', () => {
                buttons.forEach(b => b.classList.remove('home-category__btn--active'));
                btn.classList.add('home-category__btn--active');
            });
        });
    }

    // ========================================
    // 초기화
    // ========================================
    function init() {
        // 히어로 슬라이더 초기화
        new HeroSlider();
        
        // 제품 슬라이더 초기화
        const productTracks = document.querySelectorAll('.home-products__track');
        productTracks.forEach(track => {
            new ProductSlider(track);
        });
        
        // 카테고리 버튼 초기화
        initCategoryButtons();
    }

    // DOM 로드 완료 후 초기화
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();

(function() {
    'use strict';

    // 히어로 슬라이더
    class HeroSlider {
        constructor() {
            this.viewport = document.querySelector('.home-hero__viewport');
            this.track = document.querySelector('.home-hero__track');
            this.slides = document.querySelectorAll('.home-hero__slide');
            this.dots = document.querySelectorAll('.home-hero__dot');
            
            if (!this.viewport || !this.track || this.slides.length === 0) return;
            
            this.currentIndex = 0;
            this.slideCount = this.slides.length;
            this.isDragging = false;
            this.startX = 0;
            this.currentTranslate = 0;
            this.prevTranslate = 0;
            this.autoplayInterval = null;
            
            this.init();
        }
        
        init() {
            // 터치 이벤트
            this.viewport.addEventListener('touchstart', e => {
                this.isDragging = true;
                this.startX = e.touches[0].clientX;
                this.stopAutoplay();
                this.track.style.transition = 'none';
            }, { passive: true });
            
            this.viewport.addEventListener('touchmove', e => {
                if (!this.isDragging) return;
                const diff = e.touches[0].clientX - this.startX;
                if (Math.abs(diff) > 20) e.preventDefault();
                this.currentTranslate = this.prevTranslate + diff;
                this.track.style.transform = `translateX(${this.currentTranslate}px)`;
            }, { passive: false });
            
            this.viewport.addEventListener('touchend', () => {
                this.isDragging = false;
                this.finishDrag();
                this.startAutoplay();
            });
            
            // 마우스 이벤트
            this.viewport.addEventListener('mousedown', e => {
                this.isDragging = true;
                this.startX = e.clientX;
                this.stopAutoplay();
                this.track.style.transition = 'none';
                e.preventDefault();
            });
            
            this.viewport.addEventListener('mousemove', e => {
                if (!this.isDragging) return;
                this.currentTranslate = this.prevTranslate + (e.clientX - this.startX);
                this.track.style.transform = `translateX(${this.currentTranslate}px)`;
            });
            
            this.viewport.addEventListener('mouseup', () => {
                if (!this.isDragging) return;
                this.isDragging = false;
                this.finishDrag();
                this.startAutoplay();
            });
            
            this.viewport.addEventListener('mouseleave', () => {
                if (!this.isDragging) return;
                this.isDragging = false;
                this.finishDrag();
                this.startAutoplay();
            });
            
            // 인디케이터 클릭
            this.dots.forEach((dot, i) => dot.addEventListener('click', () => this.goToSlide(i)));
            
            this.startAutoplay();
        }
        
        finishDrag() {
            const movedBy = this.currentTranslate - this.prevTranslate;
            if (Math.abs(movedBy) > 20) {
                if (movedBy < 0 && this.currentIndex < this.slideCount - 1) this.currentIndex++;
                else if (movedBy > 0 && this.currentIndex > 0) this.currentIndex--;
            }
            this.goToSlide(this.currentIndex);
        }
        
        goToSlide(index) {
            this.currentIndex = index;
            this.currentTranslate = -index * this.viewport.offsetWidth;
            this.prevTranslate = this.currentTranslate;
            this.track.style.transition = 'transform 0.4s ease';
            this.track.style.transform = `translateX(${this.currentTranslate}px)`;
            this.dots.forEach((dot, i) => dot.classList.toggle('home-hero__dot--active', i === index));
        }
        
        startAutoplay() {
            this.stopAutoplay();
            this.autoplayInterval = setInterval(() => {
                this.goToSlide((this.currentIndex + 1) % this.slideCount);
            }, 4000);
        }
        
        stopAutoplay() {
            if (this.autoplayInterval) {
                clearInterval(this.autoplayInterval);
                this.autoplayInterval = null;
            }
        }
    }

    // 제품 슬라이더
    class ProductSlider {
        constructor(track) {
            this.track = track;
            this.viewport = track.closest('.home-products__viewport');
            if (!this.viewport || !this.track) return;
            
            this.isDragging = false;
            this.startX = 0;
            this.currentTranslate = 0;
            this.prevTranslate = 0;
            
            this.init();
        }
        
        init() {
            this.viewport.addEventListener('touchstart', e => {
                this.isDragging = true;
                this.startX = e.touches[0].clientX;
                this.track.style.transition = 'none';
            }, { passive: true });
            
            this.viewport.addEventListener('touchmove', e => {
                if (!this.isDragging) return;
                const diff = e.touches[0].clientX - this.startX;
                if (Math.abs(diff) > 10) e.preventDefault();
                this.currentTranslate = this.clamp(this.prevTranslate + diff);
                this.track.style.transform = `translateX(${this.currentTranslate}px)`;
            }, { passive: false });
            
            this.viewport.addEventListener('touchend', () => {
                this.isDragging = false;
                this.snap();
            });
            
            this.viewport.addEventListener('mousedown', e => {
                this.isDragging = true;
                this.startX = e.clientX;
                this.track.style.transition = 'none';
                e.preventDefault();
            });
            
            this.viewport.addEventListener('mousemove', e => {
                if (!this.isDragging) return;
                this.currentTranslate = this.clamp(this.prevTranslate + (e.clientX - this.startX));
                this.track.style.transform = `translateX(${this.currentTranslate}px)`;
            });
            
            this.viewport.addEventListener('mouseup', () => {
                if (this.isDragging) {
                    this.isDragging = false;
                    this.snap();
                }
            });
            
            this.viewport.addEventListener('mouseleave', () => {
                if (this.isDragging) {
                    this.isDragging = false;
                    this.snap();
                }
            });
        }
        
        clamp(val) {
            const min = -(this.track.scrollWidth - this.viewport.offsetWidth + 16);
            return Math.max(min, Math.min(0, val));
        }
        
        snap() {
            this.currentTranslate = this.clamp(this.currentTranslate);
            this.prevTranslate = this.currentTranslate;
            this.track.style.transition = 'transform 0.3s ease';
            this.track.style.transform = `translateX(${this.currentTranslate}px)`;
        }
    }

    // 카테고리 버튼
    function initCategoryButtons() {
        const buttons = document.querySelectorAll('.home-category__btn');
        buttons.forEach(btn => btn.addEventListener('click', () => {
            buttons.forEach(b => b.classList.remove('home-category__btn--active'));
            btn.classList.add('home-category__btn--active');
        }));
    }

    // 탭바
    function initTabbar() {
        const items = document.querySelectorAll('.home-tabbar__item');
        items.forEach(item => item.addEventListener('click', e => {
            e.preventDefault();
            items.forEach(i => i.classList.remove('home-tabbar__item--active'));
            item.classList.add('home-tabbar__item--active');
        }));
    }

    // 햄버거 메뉴 토글
    function initSideMenu() {
        const menuOpen = document.getElementById('menuOpen');
        const menuClose = document.getElementById('menuClose');
        const sideMenu = document.getElementById('sideMenu');
        const overlay = document.getElementById('menuOverlay');
        
        if (!menuOpen || !sideMenu || !overlay) return;

        function openMenu() {
            sideMenu.classList.add('home-menu--active');
            overlay.classList.add('home-menu-overlay--active');
            sideMenu.setAttribute('aria-hidden', 'false');
            overlay.setAttribute('aria-hidden', 'false');
            menuOpen.setAttribute('aria-expanded', 'true');
            document.body.classList.add('menu-open');
            // 포커스를 닫기 버튼으로 이동
            if (menuClose) menuClose.focus();
        }

        function closeMenu() {
            sideMenu.classList.remove('home-menu--active');
            overlay.classList.remove('home-menu-overlay--active');
            sideMenu.setAttribute('aria-hidden', 'true');
            overlay.setAttribute('aria-hidden', 'true');
            menuOpen.setAttribute('aria-expanded', 'false');
            document.body.classList.remove('menu-open');
            menuOpen.focus();
        }

        menuOpen.addEventListener('click', openMenu);
        if (menuClose) menuClose.addEventListener('click', closeMenu);
        overlay.addEventListener('click', closeMenu);

        // ESC 키로 닫기
        document.addEventListener('keydown', e => {
            if (e.key === 'Escape' && sideMenu.classList.contains('home-menu--active')) {
                closeMenu();
            }
        });
    }

    // 초기화
    function init() {
        new HeroSlider();
        document.querySelectorAll('.home-products__track').forEach(track => new ProductSlider(track));
        initCategoryButtons();
        initTabbar();
        initSideMenu();
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();