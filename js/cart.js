/**
 * MAISON VERGE 장바구니 페이지 스크립트
 * 바닐라 JS로 구현
 */

(function() {
    'use strict';

    // ========================================
    // 수량 조절
    // ========================================
    function initQuantityControls() {
        const cartList = document.getElementById('cartList');
        if (!cartList) return;

        cartList.addEventListener('click', (e) => {
            const minusBtn = e.target.closest('.cart-item__qty-btn--minus');
            const plusBtn = e.target.closest('.cart-item__qty-btn--plus');
            
            if (minusBtn || plusBtn) {
                const cartItem = e.target.closest('.cart-item');
                const qtyNum = cartItem.querySelector('.cart-item__qty-num');
                let currentQty = parseInt(qtyNum.textContent);
                
                if (minusBtn && currentQty > 1) {
                    currentQty--;
                } else if (plusBtn) {
                    currentQty++;
                }
                
                qtyNum.textContent = currentQty;
                updateTotalPrice();
            }
        });
    }

    // ========================================
    // 사이즈 선택
    // ========================================
    function initSizeSelection() {
        const cartList = document.getElementById('cartList');
        if (!cartList) return;

        cartList.addEventListener('click', (e) => {
            const sizeBtn = e.target.closest('.cart-item__size');
            if (!sizeBtn) return;
            
            const cartItem = e.target.closest('.cart-item');
            const allSizes = cartItem.querySelectorAll('.cart-item__size');
            
            // 모든 사이즈 버튼에서 active 제거
            allSizes.forEach(btn => btn.classList.remove('cart-item__size--active'));
            // 클릭한 버튼에 active 추가
            sizeBtn.classList.add('cart-item__size--active');
        });
    }

    // ========================================
    // 찜하기 토글
    // ========================================
    function initWishlistToggle() {
        const cartList = document.getElementById('cartList');
        if (!cartList) return;

        cartList.addEventListener('click', (e) => {
            const wishlistBtn = e.target.closest('.cart-item__wishlist');
            if (!wishlistBtn) return;
            
            wishlistBtn.classList.toggle('cart-item__wishlist--active');
            
            const svg = wishlistBtn.querySelector('svg');
            const path = svg.querySelector('path');
            
            if (wishlistBtn.classList.contains('cart-item__wishlist--active')) {
                svg.setAttribute('fill', 'currentColor');
            } else {
                svg.setAttribute('fill', 'none');
            }
        });
    }

    // ========================================
    // 상품 삭제
    // ========================================
    function initDeleteItem() {
        const cartList = document.getElementById('cartList');
        if (!cartList) return;

        cartList.addEventListener('click', (e) => {
            const deleteBtn = e.target.closest('.cart-item__delete');
            if (!deleteBtn) return;
            
            const cartItem = e.target.closest('.cart-item');
            
            // 애니메이션 효과
            cartItem.style.transition = 'all 0.3s ease';
            cartItem.style.opacity = '0';
            cartItem.style.transform = 'translateX(-100%)';
            
            setTimeout(() => {
                cartItem.remove();
                updateCartCount();
                updateTotalPrice();
            }, 300);
        });
    }

    // ========================================
    // 장바구니 개수 업데이트
    // ========================================
    function updateCartCount() {
        const cartList = document.getElementById('cartList');
        const cartCount = document.getElementById('cartCount');
        
        if (!cartList || !cartCount) return;
        
        const itemCount = cartList.querySelectorAll('.cart-item').length;
        cartCount.textContent = `(${itemCount})`;
    }

    // ========================================
    // 총 결제금액 업데이트
    // ========================================
    function updateTotalPrice() {
        const cartItems = document.querySelectorAll('.cart-item');
        let total = 0;
        
        cartItems.forEach(item => {
            const basePrice = parseInt(item.dataset.price) || 0;
            const qty = parseInt(item.querySelector('.cart-item__qty-num').textContent) || 1;
            total += basePrice * qty;
        });
        
        // 숫자 포맷팅 (천 단위 콤마)
        const formattedTotal = total.toLocaleString('ko-KR');
        
        // 각 영역 업데이트
        const productTotal = document.getElementById('productTotal');
        const grandTotal = document.getElementById('grandTotal');
        const ctaTotal = document.getElementById('ctaTotal');
        
        if (productTotal) productTotal.textContent = `${formattedTotal}원`;
        if (grandTotal) grandTotal.textContent = `${formattedTotal}원`;
        if (ctaTotal) ctaTotal.textContent = formattedTotal;
    }

    // ========================================
    // 뒤로가기 버튼
    // ========================================
    function initBackButton() {
        const backBtn = document.querySelector('.cart-header__back');
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
    // 구매하기 버튼
    // ========================================
    function initCheckoutButton() {
        const checkoutBtn = document.getElementById('checkoutBtn');
        if (checkoutBtn) {
            checkoutBtn.addEventListener('click', () => {
                const itemCount = document.querySelectorAll('.cart-item').length;
                if (itemCount === 0) {
                    alert('장바구니가 비어있습니다.');
                    return;
                }
                alert('결제 페이지로 이동합니다.');
                // window.location.href = 'checkout.html';
            });
        }
    }

    // ========================================
    // 초기화
    // ========================================
    function init() {
        initQuantityControls();
        initSizeSelection();
        initWishlistToggle();
        initDeleteItem();
        initBackButton();
        initCheckoutButton();
        
        // 초기 총액 계산
        updateTotalPrice();
    }

    // DOM 로드 완료 후 실행
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
