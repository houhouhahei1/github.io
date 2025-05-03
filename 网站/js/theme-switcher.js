// 星月写作主题管理器
document.addEventListener('DOMContentLoaded', function() {
    // 获取主题切换按钮和下拉菜单
    const themeToggle = document.getElementById('theme-toggle');
    const themeDropdown = document.getElementById('theme-dropdown');
    const themeOptions = document.querySelectorAll('.theme-option');

    // 从本地存储中获取保存的主题
    const savedTheme = localStorage.getItem('theme') || 'default';
    applyTheme(savedTheme);

    // 主题切换按钮点击事件
    if (themeToggle) {
        themeToggle.addEventListener('click', function() {
            themeDropdown.classList.toggle('show');
        });

        // 点击其他地方关闭下拉菜单
        document.addEventListener('click', function(event) {
            if (themeDropdown && !themeToggle.contains(event.target) && !themeDropdown.contains(event.target)) {
                themeDropdown.classList.remove('show');
            }
        });
    }

    // 主题选项点击事件
    if (themeOptions) {
        themeOptions.forEach(option => {
            option.addEventListener('click', function() {
                const theme = this.getAttribute('data-theme');
                applyTheme(theme);
                if (themeDropdown) {
                    themeDropdown.classList.remove('show');
                }
            });
        });
    }

    // 夜间模式切换
    const nightModeToggle = document.getElementById('night-mode-toggle');
    if (nightModeToggle) {
        nightModeToggle.addEventListener('click', function(e) {
            e.preventDefault();
            const currentTheme = document.body.getAttribute('data-theme');
            if (currentTheme === 'dark') {
                applyTheme('default');
            } else {
                applyTheme('dark');
            }
        });
    }

    // 应用主题函数
    function applyTheme(theme) {
        // 保存主题到本地存储
        localStorage.setItem('theme', theme);

        // 设置body的data-theme属性
        document.body.setAttribute('data-theme', theme);

        // 更新主题图标
        updateThemeIcon(theme);

        // 更新主题选项的激活状态
        if (themeOptions) {
            themeOptions.forEach(option => {
                if (option.getAttribute('data-theme') === theme) {
                    option.classList.add('active');
                } else {
                    option.classList.remove('active');
                }
            });
        }

        // 触发主题变更事件
        const event = new CustomEvent('themeChanged', { detail: { theme } });
        document.dispatchEvent(event);
    }

    // 更新主题图标
    function updateThemeIcon(theme) {
        const nightModeIcon = document.querySelector('#night-mode-toggle i');
        if (nightModeIcon) {
            if (theme === 'dark') {
                nightModeIcon.className = 'fas fa-sun sidebar-icon';
            } else {
                nightModeIcon.className = 'fas fa-moon sidebar-icon';
            }
        }
    }

    // 为所有功能卡片添加点击动效和页面过渡
    const interactiveElements = document.querySelectorAll('.feature-card, [data-href], .nav-action-btn[data-action="navigate"]');
    interactiveElements.forEach(element => {
        element.addEventListener('click', function(e) {
            // 如果元素有特定的操作，不执行页面跳转
            if (this.hasAttribute('data-action') && this.getAttribute('data-action') !== 'navigate') {
                return;
            }

            // 添加点击动效类
            this.classList.add('clicked');

            // 获取跳转链接
            const href = this.getAttribute('data-href') ||
                         this.getAttribute('href') ||
                         this.getAttribute('onclick')?.toString().match(/window\.location\.href='([^']+)'/)?.[1];

            if (href && !href.startsWith('#') && !e.ctrlKey) {
                e.preventDefault();

                // 创建页面过渡元素
                const transition = document.createElement('div');
                transition.className = 'page-transition';
                document.body.appendChild(transition);

                // 触发重绘以应用初始样式
                transition.offsetHeight;

                // 激活过渡效果
                transition.classList.add('active');

                // 延迟导航以等待动画完成
                setTimeout(() => {
                    window.location.href = href;
                }, 300);
            }
        });
    });

    // 页面加载动画
    const pageContent = document.querySelector('.main-container, .main-content');
    if (pageContent) {
        pageContent.classList.add('fade-in');
    }

    // 星空背景动画（如果存在）
    createStarsBackground();
});

// 创建星空背景
function createStarsBackground() {
    const starsContainer = document.getElementById('stars-bg');
    if (!starsContainer) return;

    const starsCount = 150;

    for (let i = 0; i < starsCount; i++) {
        const star = document.createElement('div');
        star.className = 'star';

        // 随机大小
        const size = Math.random() * 3;
        star.style.width = `${size}px`;
        star.style.height = `${size}px`;

        // 随机位置
        star.style.left = `${Math.random() * 100}%`;
        star.style.top = `${Math.random() * 100}%`;

        // 随机动画延迟
        star.style.animationDelay = `${Math.random() * 4}s`;

        starsContainer.appendChild(star);
    }
}