// 主题预加载脚本 - 在页面渲染前应用主题
(function() {
    // 立即应用保存的主题，防止闪烁
    function applyThemeImmediately() {
        const savedTheme = localStorage.getItem('selectedTheme');
        const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
        // 使用默认主题或系统偏好
        const initialTheme = savedTheme ? savedTheme : (prefersDark ? 'dark' : 'default');
        
        // 立即应用主题到文档根元素
        document.documentElement.setAttribute('data-theme', initialTheme);
        
        // 添加一个类来控制过渡效果
        // 初始加载时禁用过渡效果，防止闪烁
        document.documentElement.classList.add('theme-transition-disabled');
        
        // 页面加载后启用过渡效果
        window.addEventListener('load', function() {
            setTimeout(function() {
                document.documentElement.classList.remove('theme-transition-disabled');
            }, 100);
        });
    }
    
    // 立即执行
    applyThemeImmediately();
})();
