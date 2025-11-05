// القائمة المتنقلة
const hamburger = document.querySelector('.hamburger');
const navLinks = document.querySelector('.nav-links');
const navItems = document.querySelectorAll('.nav-links li a');

// فتح/إغلاق القائمة
hamburger.addEventListener('click', () => {
    navLinks.classList.toggle('open');
    hamburger.classList.toggle('active');
});

// إغلاق القائمة عند النقر على رابط
navItems.forEach(item => {
    item.addEventListener('click', () => {
        navLinks.classList.remove('open');
        hamburger.classList.remove('active');
    });
});

// إخفاء وإظهار شريط التنقل عند التمرير
let lastScroll = 0;
const navbar = document.querySelector('.navbar');
window.addEventListener('scroll', () => {
    const currentScroll = window.pageYOffset;
    
    if (currentScroll <= 0) {
        navbar.classList.remove('hide');
        return;
    }
    
    if (currentScroll > lastScroll && !navbar.classList.contains('hide')) {
        // التمرير لأسفل
        navbar.classList.add('hide');
    } else if (currentScroll < lastScroll && navbar.classList.contains('hide')) {
        // التمرير لأعلى
        navbar.classList.remove('hide');
    }
    
    lastScroll = currentScroll;
    
    // إضافة تأثير عند التمرير
    if (window.scrollY > 50) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }
});

// التمرير السلس
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        e.preventDefault();
        
        const target = this.getAttribute('href');
        const targetElement = document.querySelector(target);
        
        if (targetElement) {
            window.scrollTo({
                top: targetElement.offsetTop - 80,
                behavior: 'smooth'
            });
        }
    });
});

// تأثيرات الظهور عند التمرير
const animateOnScroll = () => {
    const elements = document.querySelectorAll('.wow');
    const windowHeight = window.innerHeight;
    
    elements.forEach(element => {
        const elementPosition = element.getBoundingClientRect().top;
        const elementVisible = 150;
        
        if (elementPosition < windowHeight - elementVisible) {
            element.style.opacity = '1';
            element.style.visibility = 'visible';
            element.style.animationName = element.getAttribute('data-wow-animation');
        }
    });
};

// تنفيذ عند التحميل وعند التمرير
window.addEventListener('load', animateOnScroll);
window.addEventListener('scroll', animateOnScroll);

// تأثير العدادات في صفحة من نحن
if (document.querySelector('.stat-number')) {
    const animateCounter = () => {
        const counters = document.querySelectorAll('.stat-number');
        const speed = 200;
        
        counters.forEach(counter => {
            const target = +counter.getAttribute('data-count');
            const count = +counter.innerText;
            const increment = target / speed;
            
            if (count < target) {
                counter.innerText = Math.ceil(count + increment);
                setTimeout(animateCounter, 1);
            } else {
                counter.innerText = target;
            }
        });
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animateCounter();
                observer.unobserve(entry.target);
            }
        });
    }, {threshold: 0.5});
    
    document.querySelectorAll('.stat-item').forEach(item => {
        observer.observe(item);
    });
}

// تهيئة Wow.js
document.addEventListener('DOMContentLoaded', () => {
    new WOW({
        boxClass: 'wow',
        animateClass: 'animated',
        offset: 100,
        mobile: true,
        live: true
    }).init();
});