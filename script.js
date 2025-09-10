document.addEventListener('DOMContentLoaded', () => {
    // フェードイン
    document.querySelectorAll('.fade-in-section').forEach(section => {
        new IntersectionObserver((entries, obs) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                    obs.unobserve(entry.target);
                }
            });
        }, { threshold: 0.2 }).observe(section);
    });

    // メニュー開閉（モバイル時）
    const menuBtn = document.getElementById('menu-toggle');
    const nav = document.getElementById('main-nav');
    if (menuBtn && nav) {
        const closeNav = () => {
            nav.classList.remove('open');
            menuBtn.setAttribute('aria-expanded', 'false');
        };
        const openNav = () => {
            nav.classList.add('open');
            menuBtn.setAttribute('aria-expanded', 'true');
        };
        const toggleNav = () => {
            const willOpen = !nav.classList.contains('open');
            if (willOpen) openNav(); else closeNav();
        };

        menuBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            toggleNav();
        });

        // メニュー領域内のクリックはバブリング停止（外側クリック閉じと干渉しないように）
        nav.addEventListener('click', (e) => e.stopPropagation());

        // メニューリンククリックで自動的に閉じる（スマホ時のみ）
        nav.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                if (window.matchMedia('(max-width: 768px)').matches) {
                    closeNav();
                }
            });
        });

        // 外側クリック・Escapeで閉じる（モバイル時のみ）
        document.addEventListener('click', () => {
            if (window.matchMedia('(max-width: 768px)').matches) {
                closeNav();
            }
        });
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && window.matchMedia('(max-width: 768px)').matches) {
                closeNav();
            }
        });

        // 画面サイズが変わったら状態をリセット（デスクトップ復帰時に必ず開いた状態を解除）
        window.addEventListener('resize', () => {
            if (!window.matchMedia('(max-width: 768px)').matches) {
                nav.classList.remove('open');
                menuBtn.setAttribute('aria-expanded', 'false');
            }
        });
    }

    // スクロール方向でヘッダーをフェードイン/アウト
    const headerEl = document.querySelector('header');
    if (headerEl) {
        let lastY = window.scrollY;
        let ticking = false;
        const handleScroll = () => {
            const currentY = window.scrollY;
            const goingDown = currentY > lastY;
            const beyond = currentY > 10; // 少しスクロールしたら適用
            if (goingDown && beyond) {
                headerEl.classList.add('header-hidden');
            } else {
                headerEl.classList.remove('header-hidden');
            }
            lastY = currentY;
            ticking = false;
        };
        window.addEventListener('scroll', () => {
            if (!ticking) {
                window.requestAnimationFrame(handleScroll);
                ticking = true;
            }
        }, { passive: true });
    }

    // 現在地ハイライト
    const sections = document.querySelectorAll('main section[id]');
    const navLinks = document.querySelectorAll('#main-nav a[href^="#"]');
    if (sections.length && navLinks.length) {
        const linkMap = new Map(
            Array.from(navLinks).map(a => [a.getAttribute('href').slice(1), a])
        );
        const setActive = (id) => {
            navLinks.forEach(a => a.classList.toggle('active', a.getAttribute('href') === `#${id}`));
        };
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    setActive(entry.target.id);
                }
            });
        }, { rootMargin: '-40% 0px -50% 0px', threshold: 0.01 });
        sections.forEach(sec => observer.observe(sec));
    }

    // （タブ機能は撤去）

    // 左上クイックタブ（ドロップダウン）
    const quickTabsBtn = document.getElementById('quick-tabs');
    const quickTabsMenu = document.getElementById('quick-tabs-menu');
    if (quickTabsBtn && quickTabsMenu) {
        const openQuickTabs = () => {
            quickTabsMenu.removeAttribute('hidden');
            quickTabsBtn.setAttribute('aria-expanded', 'true');
        };
        const closeQuickTabs = () => {
            quickTabsMenu.setAttribute('hidden', '');
            quickTabsBtn.setAttribute('aria-expanded', 'false');
        };
        const toggleQuickTabs = () => {
            const isHidden = quickTabsMenu.hasAttribute('hidden');
            if (isHidden) openQuickTabs(); else closeQuickTabs();
        };

        quickTabsBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            toggleQuickTabs();
        });
        quickTabsMenu.addEventListener('click', (e) => e.stopPropagation());
        document.addEventListener('click', () => closeQuickTabs());
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') closeQuickTabs();
        });
        quickTabsMenu.querySelectorAll('a').forEach(a => {
            a.addEventListener('click', () => closeQuickTabs());
        });
    }
});