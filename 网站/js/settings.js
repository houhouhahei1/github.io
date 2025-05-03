// 设置页面交互功能

document.addEventListener('DOMContentLoaded', function() {
    // 主题切换功能
    const themeCards = document.querySelectorAll('.theme-card');
    themeCards.forEach(card => {
        card.addEventListener('click', function() {
            // 移除所有卡片的active类
            themeCards.forEach(c => c.classList.remove('active'));
            // 为当前卡片添加active类
            this.classList.add('active');
            
            // 获取主题名称
            const themeName = this.querySelector('.theme-name').textContent;
            console.log('切换主题为:', themeName);
            
            // 这里可以添加实际的主题切换逻辑
            // 例如修改body的class或者存储用户偏好
            if (themeName === '深色主题') {
                document.body.classList.add('dark-mode');
                localStorage.setItem('theme', 'dark');
            } else if (themeName === '浅色主题') {
                document.body.classList.remove('dark-mode');
                localStorage.setItem('theme', 'light');
            } else {
                // 跟随系统
                if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
                    document.body.classList.add('dark-mode');
                } else {
                    document.body.classList.remove('dark-mode');
                }
                localStorage.setItem('theme', 'system');
            }
        });
    });
    
    // 范围滑块值显示
    const rangeSliders = document.querySelectorAll('.range-slider input[type="range"]');
    rangeSliders.forEach(slider => {
        const valueDisplay = slider.nextElementSibling;
        
        // 初始化显示值
        updateRangeValue(slider, valueDisplay);
        
        // 监听滑块变化
        slider.addEventListener('input', function() {
            updateRangeValue(this, valueDisplay);
        });
    });
    
    // 保存设置按钮
    const saveButtons = document.querySelectorAll('.settings-actions .btn-primary');
    saveButtons.forEach(button => {
        button.addEventListener('click', function() {
            // 获取当前活动的设置面板
            const activePane = document.querySelector('.tab-pane.active');
            const settingType = activePane.id;
            
            // 收集当前面板中的设置值
            const settings = collectSettings(activePane);
            
            // 模拟保存设置
            console.log(`保存${settingType}设置:`, settings);
            
            // 显示保存成功提示
            showToast('设置已保存');
            
            // 这里可以添加实际的API调用来保存设置
            // saveSettingsToServer(settingType, settings);
        });
    });
    
    // 恢复默认按钮
    const resetButtons = document.querySelectorAll('.settings-actions .btn-outline-secondary');
    resetButtons.forEach(button => {
        button.addEventListener('click', function() {
            if (confirm('确定要恢复默认设置吗？这将覆盖您的所有自定义设置。')) {
                const activePane = document.querySelector('.tab-pane.active');
                console.log(`恢复${activePane.id}默认设置`);
                
                // 这里可以添加恢复默认设置的逻辑
                // resetSettings(activePane.id);
                
                // 刷新页面显示默认设置
                // location.reload();
                
                showToast('已恢复默认设置');
            }
        });
    });
    
    // 初始化设置值（从本地存储或服务器获取）
    initializeSettings();
});

// 更新范围滑块的显示值
function updateRangeValue(slider, valueDisplay) {
    const value = slider.value;
    const id = slider.id;
    
    // 根据不同的滑块添加适当的单位
    if (id === 'fontSizeRange' || id === 'editorFontSizeRange') {
        valueDisplay.textContent = `${value}px`;
    } else if (id === 'lineHeightRange') {
        valueDisplay.textContent = value;
    } else {
        valueDisplay.textContent = value;
    }
}

// 收集设置面板中的设置值
function collectSettings(pane) {
    const settings = {};
    
    // 收集选择框的值
    pane.querySelectorAll('select').forEach(select => {
        settings[select.id || select.name] = select.value;
    });
    
    // 收集复选框的值
    pane.querySelectorAll('input[type="checkbox"]').forEach(checkbox => {
        settings[checkbox.id] = checkbox.checked;
    });
    
    // 收集范围滑块的值
    pane.querySelectorAll('input[type="range"]').forEach(range => {
        settings[range.id] = range.value;
    });
    
    return settings;
}

// 显示提示消息
function showToast(message) {
    // 创建toast元素
    const toast = document.createElement('div');
    toast.className = 'toast-message';
    toast.textContent = message;
    
    // 添加到页面
    document.body.appendChild(toast);
    
    // 显示动画
    setTimeout(() => {
        toast.classList.add('show');
    }, 10);
    
    // 自动隐藏
    setTimeout(() => {
        toast.classList.remove('show');
        setTimeout(() => {
            document.body.removeChild(toast);
        }, 300);
    }, 3000);
}

// 初始化设置值
function initializeSettings() {
    // 从本地存储加载主题设置
    const savedTheme = localStorage.getItem('theme') || 'light';
    
    // 应用主题设置
    if (savedTheme === 'dark') {
        document.body.classList.add('dark-mode');
        document.querySelector('.theme-card:nth-child(2)').classList.add('active');
        document.querySelector('.theme-card:nth-child(1)').classList.remove('active');
    } else if (savedTheme === 'system') {
        document.querySelector('.theme-card:nth-child(3)').classList.add('active');
        document.querySelector('.theme-card:nth-child(1)').classList.remove('active');
        
        // 检测系统主题
        if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
            document.body.classList.add('dark-mode');
        }
    }
    
    // 这里可以添加从服务器加载其他设置的逻辑
    // loadSettingsFromServer().then(settings => {
    //     applySettings(settings);
    // });
}

// 保存设置到服务器
function saveSettingsToServer(settingType, settings) {
    // 这里需要实现API调用来保存设置
    // 例如使用fetch发送POST请求
    fetch('/api/settings/' + settingType, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(settings)
    })
    .then(response => response.json())
    .then(data => {
        console.log('设置保存成功:', data);
    })
    .catch(error => {
        console.error('设置保存失败:', error);
        showToast('设置保存失败，请重试');
    });
}