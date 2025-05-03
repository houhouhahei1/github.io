// 主题管理器
const ThemeManager = {
    // 主题列表
    themes: {
        default: {
            name: '默认主题',
            primaryGradient: 'linear-gradient(135deg, #1EB980, #0EA5E9)',
            cardBg: '#ffffff',
            textColor: '#333333',
            bgColor: '#f8f9fa'
        },
        dark: {
            name: '夜间模式',
            primaryGradient: 'linear-gradient(135deg, #2c2c2c, #1a1a1a)',
            cardBg: '#2c2c2c',
            textColor: '#ffffff',
            bgColor: '#1a1a1a'
        },
        purple: {
            name: '紫粉主题',
            primaryGradient: 'linear-gradient(135deg, #9c27b0, #e91e63)',
            cardBg: '#ffffff',
            textColor: '#333333',
            bgColor: '#f8f9fa'
        },
        orange: {
            name: '橙黄主题',
            primaryGradient: 'linear-gradient(135deg, #ff9800, #ff5722)',
            cardBg: '#ffffff',
            textColor: '#333333',
            bgColor: '#f8f9fa'
        },
        blue: {
            name: '蓝紫主题',
            primaryGradient: 'linear-gradient(135deg, #3f51b5, #2196f3)',
            cardBg: '#ffffff',
            textColor: '#333333',
            bgColor: '#f8f9fa'
        }
    },
    
    // 获取当前主题
    getCurrentTheme() {
        return localStorage.getItem('current-theme') || 'default';
    },
    
    // 应用主题
    applyTheme(themeName) {
        // 保存主题设置到本地存储
        localStorage.setItem('current-theme', themeName);
        
        const theme = this.themes[themeName] || this.themes.default;
        
        // 设置CSS变量
        document.documentElement.style.setProperty('--primary-gradient', theme.primaryGradient);
        document.documentElement.style.setProperty('--card-bg', theme.cardBg);
        document.documentElement.style.setProperty('--text-color', theme.textColor);
        document.documentElement.style.setProperty('--bg-color', theme.bgColor);
        
        // 添加主题类名到body
        document.body.className = '';
        document.body.classList.add(`theme-${themeName}`);
        
        // 触发主题变更事件
        const event = new CustomEvent('themeChanged', { detail: { theme: themeName } });
        document.dispatchEvent(event);
    },
    
    // 初始化主题
    init() {
        // 应用保存的主题或默认主题
        this.applyTheme(this.getCurrentTheme());
        
        // 监听存储变化，实现跨页面同步
        window.addEventListener('storage', (event) => {
            if (event.key === 'current-theme') {
                this.applyTheme(event.newValue);
            }
        });
    }
};

// 页面加载时初始化主题
document.addEventListener('DOMContentLoaded', () => {
    ThemeManager.init();
});