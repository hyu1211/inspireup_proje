document.addEventListener('DOMContentLoaded', () => {

    // 各セクションのフェードインアニメーション
    const fadeInObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.2 });

    document.querySelectorAll('.fade-in-section').forEach(section => {
        fadeInObserver.observe(section);
    });

    // スクロール方向に応じてヘッダーを表示/非表示
    const header = document.querySelector('header');
    if (header) {
        let lastScrollY = window.scrollY;
        let ticking = false;

        const updateHeaderVisibility = () => {
            const currentScrollY = window.scrollY;
            const isScrollingDown = currentScrollY > lastScrollY;
            const isScrolledPastHeader = currentScrollY > header.clientHeight;

            if (isScrollingDown && isScrolledPastHeader) {
                header.classList.add('header-hidden');
            } else {
                header.classList.remove('header-hidden');
            }
            lastScrollY = currentScrollY;
            ticking = false;
        };

        window.addEventListener('scroll', () => {
            if (!ticking) {
                window.requestAnimationFrame(updateHeaderVisibility);
                ticking = true;
            }
        }, { passive: true });
    }

    // 【修正】スクロールに応じたナビゲーションの現在地ハイライト
    const sections = document.querySelectorAll('main section[id]');
    const navLinks = document.querySelectorAll('#quick-tabs-menu a[href^="#"]'); // 修正: 正しいメニューのリンクを参照
    
    if (sections.length && navLinks.length) {
        const setActiveLink = (id) => {
            navLinks.forEach(link => {
                const isActive = link.getAttribute('href') === `#${id}`;
                link.classList.toggle('active', isActive);
            });
        };

        const sectionObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    setActiveLink(entry.target.id);
                }
            });
        }, { 
            rootMargin: `-${header.clientHeight}px 0px -60% 0px` // ヘッダーの高さを考慮
        });

        sections.forEach(section => sectionObserver.observe(section));
    }


    // 右上のクイックタブメニュー（ドロップダウン）
    const quickTabsBtn = document.getElementById('quick-tabs');
    const quickTabsMenu = document.getElementById('quick-tabs-menu');
    if (quickTabsBtn && quickTabsMenu) {
        const openMenu = () => {
            quickTabsMenu.removeAttribute('hidden');
            quickTabsBtn.setAttribute('aria-expanded', 'true');
        };
        const closeMenu = () => {
            quickTabsMenu.setAttribute('hidden', '');
            quickTabsBtn.setAttribute('aria-expanded', 'false');
        };

        quickTabsBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            const isHidden = quickTabsMenu.hasAttribute('hidden');
            if (isHidden) openMenu(); else closeMenu();
        });

        // メニュー内のリンククリックで閉じる
        quickTabsMenu.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', closeMenu);
        });

        // ドキュメントのどこかをクリック、またはEscapeキーで閉じる
        document.addEventListener('click', (e) => {
            if (!quickTabsMenu.contains(e.target) && !quickTabsBtn.contains(e.target)) {
                closeMenu();
            }
        });
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                closeMenu();
            }
        });
    }

    // 【削除】HTMLに存在しない要素を参照していた不要なコードを削除しました。
});