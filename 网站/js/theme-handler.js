// 主题处理器脚本
(function() {
    // 初始化主题
    function initTheme() {
        const savedTheme = localStorage.getItem('selectedTheme');
        const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
        // 使用默认主题或系统偏好
        const initialTheme = savedTheme ? savedTheme : (prefersDark ? 'dark' : 'default');

        // 检查是否已经由theme-preload.js设置了主题
        const currentTheme = document.documentElement.getAttribute('data-theme');
        if (!currentTheme) {
            document.documentElement.setAttribute('data-theme', initialTheme);
        }

        localStorage.setItem('selectedTheme', initialTheme);
        return initialTheme;
    }

    // 更新夜间模式按钮的UI
    function updateNightModeUI() {
        const nightModeToggle = document.getElementById('night-mode-toggle');
        if (!nightModeToggle) return;

        const nightModeIcon = nightModeToggle.querySelector('i');
        const nightModeText = nightModeToggle.querySelector('span');
        const currentTheme = document.documentElement.getAttribute('data-theme');

        if (currentTheme === 'dark') {
            nightModeIcon.classList.remove('fa-moon');
            nightModeIcon.classList.add('fa-sun');
            nightModeText.textContent = '日间';
        } else {
            nightModeIcon.classList.remove('fa-sun');
            nightModeIcon.classList.add('fa-moon');
            nightModeText.textContent = '夜间';
        }
    }

    // 切换主题
    function toggleTheme(theme) {
        document.documentElement.setAttribute('data-theme', theme);
        localStorage.setItem('selectedTheme', theme);
        updateNightModeUI();

        // 更新主题选项的激活状态
        const themeOptions = document.querySelectorAll('.theme-option');
        themeOptions.forEach(option => {
            option.classList.toggle('active', option.dataset.theme === theme);
        });
    }

    // 防止主题闪烁：为所有链接添加主题保存
    function addThemeToLinks() {
        // 处理所有页面链接
        document.querySelectorAll('a[href]').forEach(link => {
            // 跳过锚点链接和非相对/绝对路径
            if (link.getAttribute('href').startsWith('#') ||
                link.getAttribute('href').startsWith('javascript:')) {
                return;
            }

            // 避免重复添加事件监听器
            if (!link.hasThemeListener) {
                link.hasThemeListener = true;
                link.addEventListener('click', function() {
                    const currentTheme = document.documentElement.getAttribute('data-theme');
                    localStorage.setItem('selectedTheme', currentTheme);
                });
            }
        });

        // 处理所有功能卡片的链接
        document.querySelectorAll('.feature-card').forEach(card => {
            if (!card.hasThemeListener && card.dataset.href) {
                card.hasThemeListener = true;
                card.addEventListener('click', function() {
                    const currentTheme = document.documentElement.getAttribute('data-theme');
                    localStorage.setItem('selectedTheme', currentTheme);
                });
            }
        });
    }

    // 当DOM内容加载完成后初始化主题功能
    document.addEventListener('DOMContentLoaded', function() {
        // 初始化主题
        initTheme();

        // 更新夜间模式按钮UI
        updateNightModeUI();

        // 主题切换按钮点击处理
        const themeToggle = document.getElementById('theme-toggle');
        const themeDropdown = document.getElementById('theme-dropdown');

        if (themeToggle && themeDropdown) {
            themeToggle.addEventListener('click', function() {
                themeDropdown.classList.toggle('show');
            });

            // 点击其他区域关闭主题下拉框
            document.addEventListener('click', function(e) {
                if (!themeToggle.contains(e.target) && !themeDropdown.contains(e.target)) {
                    themeDropdown.classList.remove('show');
                }
            });
        }

        // 主题选项点击处理
        const themeOptions = document.querySelectorAll('.theme-option');
        themeOptions.forEach(option => {
            // 设置当前激活的主题选项
            if (option.dataset.theme === document.documentElement.getAttribute('data-theme')) {
                option.classList.add('active');
            }

            option.addEventListener('click', function() {
                toggleTheme(this.dataset.theme);

                // 关闭下拉菜单
                if (themeDropdown) {
                    themeDropdown.classList.remove('show');
                }
            });
        });

        // 夜间模式切换功能
        const nightModeToggle = document.getElementById('night-mode-toggle');
        if (nightModeToggle) {
            nightModeToggle.addEventListener('click', function(e) {
                e.preventDefault(); // 阻止默认行为

                const currentTheme = document.documentElement.getAttribute('data-theme');
                // 切换主题
                const newTheme = currentTheme === 'dark' ? 'default' : 'dark';
                toggleTheme(newTheme);
            });
        }

        // 为所有链接添加主题保存功能
        addThemeToLinks();

        // 每隔一段时间检查一次是否有新添加的链接需要处理
        setInterval(addThemeToLinks, 2000);
    });

    // 设置全局方法，使其他脚本可以访问