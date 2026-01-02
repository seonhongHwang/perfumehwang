/**
 * MAISON VERGE 상세페이지 스크립트
 * 바닐라 JS로 구현
 */

(function() {
    'use strict';

    // ========================================
    // 메인 이미지 슬라이더
    // ========================================
    class HeroSlider {
        constructor() {
            this.track = document.getElementById('heroTrack');
            this.viewport = document.querySelector('.detail-hero__viewport');
            this.dots = document.querySelectorAll('.detail-hero__dot');
            
            if (!this.track || !this.viewport || this.dots.length === 0) return;
            
            this.currentIndex = 0;
            this.slideCount = this.dots.length;
            this.isDragging = false;
            this.startX = 0;
            this.currentTranslate = 0;
            this.prevTranslate = 0;
            
            this.init();
        }
        
        init() {
            // 터치 이벤트
            this.viewport.addEventListener('touchstart', this.handleTouchStart.bind(this), { passive: true });
            this.viewport.addEventListener('touchmove', this.handleTouchMove.bind(this), { passive: false });
            this.viewport.addEventListener('touchend', this.handleTouchEnd.bind(this));
            
            // 마우스 이벤트 (데스크톱)
            this.viewport.addEventListener('mousedown', this.handleMouseDown.bind(this));
            this.viewport.addEventListener('mousemove', this.handleMouseMove.bind(this));
            this.viewport.addEventListener('mouseup', this.handleMouseEnd.bind(this));
            this.viewport.addEventListener('mouseleave', this.handleMouseEnd.bind(this));
            
            // 인디케이터 클릭
            this.dots.forEach((dot, index) => {
                dot.addEventListener('click', () => this.goToSlide(index));
            });
        }
        
        getSlideWidth() {
            return this.viewport.offsetWidth;
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
            
            if (Math.abs(diff) > 10) {
                e.preventDefault();
            }
            
            this.currentTranslate = this.prevTranslate + diff;
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
            this.currentTranslate = this.prevTranslate + diff;
            this.setTrackPosition();
        }
        
        handleMouseEnd() {
            if (!this.isDragging) return;
            this.isDragging = false;
            this.finishDrag();
        }
        
        finishDrag() {
            const movedBy = this.currentTranslate - this.prevTranslate;
            const threshold = 50;
            
            if (Math.abs(movedBy) > threshold) {
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
                    dot.classList.add('detail-hero__dot--active');
                } else {
                    dot.classList.remove('detail-hero__dot--active');
                }
            });
        }
    }

    // ========================================
    // Size 버튼 토글
    // ========================================
    function initSizeButtons() {
        const buttons = document.querySelectorAll('.detail-size__btn');
        
        buttons.forEach(btn => {
            btn.addEventListener('click', () => {
                // 모든 버튼에서 active 제거
                buttons.forEach(b => b.classList.remove('detail-size__btn--active'));
                // 클릭한 버튼에 active 추가
                btn.classList.add('detail-size__btn--active');
            });
        });
    }

    // ========================================
    // 탭 전환
    // ========================================
    function initTabs() {
        const tabButtons = document.querySelectorAll('.detail-tabs__btn');
        const tabPanels = document.querySelectorAll('.detail-tab-panel');
        
        tabButtons.forEach(btn => {
            btn.addEventListener('click', () => {
                const targetTab = btn.dataset.tab;
                
                // 모든 탭 버튼에서 active 제거
                tabButtons.forEach(b => b.classList.remove('detail-tabs__btn--active'));
                // 클릭한 탭 버튼에 active 추가
                btn.classList.add('detail-tabs__btn--active');
                
                // 모든 탭 패널 숨기기
                tabPanels.forEach(panel => panel.classList.remove('detail-tab-panel--active'));
                // 해당 탭 패널 보이기
                const targetPanel = document.getElementById(`tab-${targetTab}`);
                if (targetPanel) {
                    targetPanel.classList.add('detail-tab-panel--active');
                }
            });
        });
    }

    // ========================================
    // 찜하기 버튼 토글
    // ========================================
    function initWishlist() {
        const wishlistBtns = document.querySelectorAll('.detail-cta__wishlist, .detail-header__icon[aria-label="찜하기"]');
        
        wishlistBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                btn.classList.toggle('active');
                const svg = btn.querySelector('svg path');
                if (svg) {
                    if (btn.classList.contains('active')) {
                        svg.setAttribute('fill', '#E53935');
                        svg.setAttribute('stroke', '#E53935');
                    } else {
                        svg.setAttribute('fill', 'none');
                        svg.setAttribute('stroke', 'currentColor');
                    }
                }
            });
        });
    }

    // ========================================
    // 뒤로가기 버튼
    // ========================================
    function initBackButton() {
        const backBtn = document.querySelector('.detail-header__back');
        if (backBtn) {
            backBtn.addEventListener('click', () => {
                if (window.history.length > 1) {
                    window.history.back();
                } else {
                    window.location.href = 'home.html';
                }
            });
        }
    }

    // ========================================
    // 초기화
    // ========================================
    function init() {
        new HeroSlider();
        initSizeButtons();
        initTabs();
        initWishlist();
        initBackButton();
    }

    // DOM 로드 완료 후 실행
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
