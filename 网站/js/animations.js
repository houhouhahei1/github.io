/**
 * 笔尖传奇 - 高级动画和交互效果
 */

document.addEventListener('DOMContentLoaded', function() {
    // 初始化所有动画效果
    initAnimations();
    
    // 初始化滚动效果
    initScrollEffects();
    
    // 初始化悬停效果
    initHoverEffects();
    
    // 初始化打字效果
    initTypingEffects();
});

/**
 * 初始化基本动画效果
 */
function initAnimations() {
    // 为所有带有 data-animate 属性的元素添加动画
    const animatedElements = document.querySelectorAll('[data-animate]');
    
    animatedElements.forEach(element => {
        const animationType = element.getAttribute('data-animate');
        const delay = element.getAttribute('data-delay') || 0;
        
        // 设置初始状态
        element.style.opacity = '0';
        element.style.transition = `all 0.5s ease-out ${delay}s`;
        
        // 根据动画类型设置不同的初始状态
        switch(animationType) {
            case 'fade-up':
                element.style.transform = 'translateY(20px)';
                break;
            case 'fade-down':
                element.style.transform = 'translateY(-20px)';
                break;
            case 'fade-left':
                element.style.transform = 'translateX(20px)';
                break;
            case 'fade-right':
                element.style.transform = 'translateX(-20px)';
                break;
            case 'zoom-in':
                element.style.transform = 'scale(0.9)';
                break;
            case 'zoom-out':
                element.style.transform = 'scale(1.1)';
                break;
        }
        
        // 使用 Intersection Observer 检测元素是否进入视口
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    // 元素进入视口，触发动画
                    element.style.opacity = '1';
                    element.style.transform = 'translate(0) scale(1)';
                    
                    // 动画完成后取消观察
                    observer.unobserve(element);
                }
            });
        }, { threshold: 0.1 });
        
        observer.observe(element);
    });
}

/**
 * 初始化滚动效果
 */
function initScrollEffects() {
    // 为导航栏添加滚动效果
    const navbar = document.querySelector('.navbar');
    if (navbar) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 50) {
                navbar.classList.add('navbar-scrolled');
            } else {
                navbar.classList.remove('navbar-scrolled');
            }
        });
    }
    
    // 平滑滚动到锚点
    const smoothScrollLinks = document.querySelectorAll('a[href^="#"]:not([href="#"])');
    smoothScrollLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                const offsetTop = targetElement.getBoundingClientRect().top + window.pageYOffset;
                
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
            }
        });
    });
}

/**
 * 初始化悬停效果
 */
function initHoverEffects() {
    // 为卡片添加悬停效果
    const cards = document.querySelectorAll('.feature-card, .plan-card, .work-card');
    
    cards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-10px)';
            this.style.boxShadow = '0 15px 30px rgba(0, 0, 0, 0.1)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0)';
            this.style.boxShadow = '0 5px 15px rgba(0, 0, 0, 0.05)';
        });
    });
    
    // 为按钮添加悬停效果
    const buttons = document.querySelectorAll('.btn-primary, .btn-outline-primary');
    
    buttons.forEach(button => {
        button.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-3px)';
        });
        
        button.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0)';
        });
        
        button.addEventListener('mousedown', function() {
            this.style.transform = 'translateY(1px)';
        });
        
        button.addEventListener('mouseup', function() {
            this.style.transform = 'translateY(-3px)';
        });
    });
}

/**
 * 初始化打字效果
 */
function initTypingEffects() {
    const typingElements = document.querySelectorAll('[data-typing]');
    
    typingElements.forEach(element => {
        const text = element.textContent;
        const speed = parseInt(element.getAttribute('data-typing-speed')) || 50;
        
        // 清空元素内容
        element.textContent = '';
        
        // 创建打字光标
        const cursor = document.createElement('span');
        cursor.className = 'typing-cursor';
        cursor.textContent = '|';
        cursor.style.animation = 'blink 1s infinite';
        element.appendChild(cursor);
        
        // 添加CSS动画
        const style = document.createElement('style');
        style.textContent = `
            @keyframes blink {
                0%, 100% { opacity: 1; }
                50% { opacity: 0; }
            }
        `;
        document.head.appendChild(style);
        
        // 执行打字效果
        let i = 0;
        const typeWriter = () => {
            if (i < text.length) {
                const char = document.createTextNode(text.charAt(i));
                element.insertBefore(char, cursor);
                i++;
                setTimeout(typeWriter, speed);
            }
        };
        
        // 延迟开始打字效果
        setTimeout(typeWriter, 500);
    });
}

/**
 * 添加视差滚动效果
 * @param {string} selector - 要添加视差效果的元素选择器
 * @param {number} speed - 视差速度，默认为0.5
 */
function addParallaxEffect(selector, speed = 0.5) {
    const elements = document.querySelectorAll(selector);
    
    if (elements.length === 0) return;
    
    window.addEventListener('scroll', () => {
        const scrollY = window.pageYOffset;
        
        elements.forEach(element => {
            const offsetTop = element.getBoundingClientRect().top + scrollY;
            const elementVisible = offsetTop - window.innerHeight;
            
            if (scrollY > elementVisible) {
                const yPos = (scrollY - offsetTop) * speed;
                element.style.transform = `translateY(${yPos}px)`;
            }
        });
    });
}

/**
 * 添加图片懒加载
 */
function initLazyLoading() {
    const lazyImages = document.querySelectorAll('img[data-src]');
    
    if ('IntersectionObserver' in window) {
        const imageObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.getAttribute('data-src');
                    img.removeAttribute('data-src');
                    imageObserver.unobserve(img);
                }
            });
        });
        
        lazyImages.forEach(img => {
            imageObserver.observe(img);
        });
    } else {
        // 回退方案：简单的滚动事件监听
        let lazyLoadThrottleTimeout;
        
        function lazyLoad() {
            if (lazyLoadThrottleTimeout) {
                clearTimeout(lazyLoadThrottleTimeout);
            }
            
            lazyLoadThrottleTimeout = setTimeout(() => {
                const scrollTop = window.pageYOffset;
                
                lazyImages.forEach(img => {
                    if (img.offsetTop < window.innerHeight + scrollTop) {
                        img.src = img.getAttribute('data-src');
                        img.removeAttribute('data-src');
                    }
                });
                
                if (lazyImages.length === 0) {
                    document.removeEventListener('scroll', lazyLoad);
                    window.removeEventListener('resize', lazyLoad);
                    window.removeEventListener('orientationChange', lazyLoad);
                }
            }, 20);
        }
        
        document.addEventListener('scroll', lazyLoad);
        window.addEventListener('resize', lazyLoad);
        window.addEventListener('orientationChange', lazyLoad);
    }
}

// 导出公共函数
window.bjcqAnimations = {
    addParallaxEffect,
    initLazyLoading
};
