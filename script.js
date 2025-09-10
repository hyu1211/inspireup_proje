// DOMContentLoadedイベントでスクリプト実行
document.addEventListener('DOMContentLoaded', function() {
    
    // ヘッダースクロール効果
    window.addEventListener('scroll', () => {
        const header = document.querySelector('header');
        if (window.scrollY > 100) {
            header.classList.add('header-scrolled');
        } else {
            header.classList.remove('header-scrolled');
        }
    });

    // モバイルナビゲーション
    const navToggle = document.querySelector('.nav-toggle');
    const navMenu = document.querySelector('.nav-menu');

    if (navToggle && navMenu) {
        navToggle.addEventListener('click', () => {
            navMenu.classList.toggle('active');
            const icon = navToggle.querySelector('i');
            if (navMenu.classList.contains('active')) {
                icon.classList.remove('fa-bars');
                icon.classList.add('fa-times');
                navToggle.setAttribute('aria-label', 'メニューを閉じる');
            } else {
                icon.classList.remove('fa-times');
                icon.classList.add('fa-bars');
                navToggle.setAttribute('aria-label', 'メニューを開く');
            }
        });

        // ナビゲーションリンククリック時にメニューを閉じる
        document.querySelectorAll('.nav-menu a').forEach(link => {
            link.addEventListener('click', () => {
                navMenu.classList.remove('active');
                const icon = navToggle.querySelector('i');
                icon.classList.remove('fa-times');
                icon.classList.add('fa-bars');
                navToggle.setAttribute('aria-label', 'メニューを開く');
            });
        });
    }

    // スクロールアニメーション
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, observerOptions);

    // フェードインアニメーションの対象要素を監視
    document.querySelectorAll('.fade-in').forEach(el => {
        observer.observe(el);
    });

    // アクティブナビゲーション
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-menu a[href^="#"]');

    if (sections.length > 0 && navLinks.length > 0) {
        window.addEventListener('scroll', () => {
            let current = '';
            const headerHeight = document.querySelector('header').offsetHeight;
            
            sections.forEach(section => {
                const sectionTop = section.getBoundingClientRect().top;
                const sectionHeight = section.offsetHeight;
                if (sectionTop <= headerHeight + 50 && sectionTop + sectionHeight > headerHeight + 50) {
                    current = section.getAttribute('id');
                }
            });

            navLinks.forEach(link => {
                link.classList.remove('active');
                if (link.getAttribute('href') === `#${current}`) {
                    link.classList.add('active');
                }
            });
        });
    }

    // スムーズスクロール
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                const headerHeight = document.querySelector('header').offsetHeight;
                const targetPosition = target.getBoundingClientRect().top + window.pageYOffset - headerHeight;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });

    // ESCキーでモバイルメニューを閉じる
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && navMenu && navMenu.classList.contains('active')) {
            navMenu.classList.remove('active');
            const icon = navToggle.querySelector('i');
            icon.classList.remove('fa-times');
            icon.classList.add('fa-bars');
            navToggle.setAttribute('aria-label', 'メニューを開く');
        }
    });

    // パーティクルのパフォーマンス最適化
    const particles = document.querySelectorAll('.particle');
    let isVisible = true;

    // ページが非表示になったときにアニメーションを停止
    document.addEventListener('visibilitychange', function() {
        if (document.hidden) {
            isVisible = false;
            particles.forEach(particle => {
                particle.style.animationPlayState = 'paused';
            });
        } else {
            isVisible = true;
            particles.forEach(particle => {
                particle.style.animationPlayState = 'running';
            });
        }
    });

    // スクロール位置の記憶（ページリロード時）
    if (window.location.hash) {
        setTimeout(() => {
            const target = document.querySelector(window.location.hash);
            if (target) {
                const headerHeight = document.querySelector('header').offsetHeight;
                const targetPosition = target.getBoundingClientRect().top + window.pageYOffset - headerHeight;
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        }, 100);
    }

    // プリローダー（もしプリローダーを後で追加する場合）
    window.addEventListener('load', function() {
        document.body.classList.add('loaded');
    });

    // 画像の遅延読み込み対応（ネイティブlazyloadingのフォールバック）
    if ('IntersectionObserver' in window) {
        const lazyImages = document.querySelectorAll('img[loading="lazy"]');
        const imageObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.classList.add('loaded');
                    imageObserver.unobserve(img);
                }
            });
        });

        lazyImages.forEach(img => imageObserver.observe(img));
    }

    // フォーカス管理（アクセシビリティ向上）
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Tab') {
            document.body.classList.add('keyboard-navigation');
        }
    });

    document.addEventListener('mousedown', function() {
        document.body.classList.remove('keyboard-navigation');
    });

    // コンソールにクレジット表示
    console.log('%c🚀 Inspire Up Website', 'color: #667eea; font-size: 16px; font-weight: bold;');
    console.log('%cDeveloped with ❤️ by Claude & Inspire Up Team', 'color: #A7BCCB; font-size: 12px;');

});