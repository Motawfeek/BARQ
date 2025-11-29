

const GEMINI_API_KEY = 'AIzaSyByAnd5HXjGgR0i1oPGpjSJcJaFQ74-fzg';
const GEMINI_MODEL = 'gemini-2.5-flash';
const GEMINI_API_URL = `https://generativelanguage.googleapis.com/v1/models/${GEMINI_MODEL}:generateContent`;

// تخزين المحادثة
let conversationHistory = [];
const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);

// ===================================
// 🧠 الذكاء الاصطناعي - زي Copilot
// ===================================
async function getSmartResponse(userMessage) {
    const isArabic = /[\u0600-\u06FF]/.test(userMessage);
    const lang = isArabic ? 'Arabic' : 'English';
    const recentContext = conversationHistory
        .slice(-8)
        .map(msg => `${msg.role === 'user' ? 'User' : 'Assistant'}: ${msg.text}`)
        .join('\n');
    
    // Prompt مختصر وذكي
        const systemPrompt = `You are BARQ AI - friendly assistant for BARQ Digital Marketing.

Reply in ${lang}. Be natural, warm, use Egyptian dialect for Arabic. Use emojis 😊💪✨

RULES:
- Answer ANY topic (marketing, tech, life, casual talk)
- Be conversational, joke when appropriate
- NEVER mention specific prices
- Be helpful and positive
- If the user asks multiple questions, answer each one clearly
- Suggest BARQ solutions when relevant
- Always keep discussions collaborative. Share insights, brainstorm، ووضح خطوات عامة فقط. لا تقدّم خطة جاهزة أو استراتيجية تفصيلية أو منتج جاهز. شجّع العميل على التواصل مع فريق برق لاستلام التنفيذ الاحترافي.
- When referencing BARQ services or website sections, insert clickable HTML links. Examples:
    • <a href="pages/services.html#branding">Branding</a>
    • <a href="pages/services.html#web-mobile">Web & Mobile Development</a>
    • <a href="pages/services.html#media-buying">Media Buying</a>
    • <a href="pages/services.html#social-media">Social Media Management</a>
    • <a href="pages/services.html#business-dev">Business Development</a>
    • <a href="pages/services.html#media-production">Media Production</a>
    Use the same pattern for other site pages like <a href="pages/projects.html">أعمالنا</a> أو <a href="pages/contact.html">اتصل بنا</a>.
    - حافظ على الإملاء الصحيح خاصةً لاسم الشركة: BARQ بالإنجليزي، «برق» بالعربي. صحّح أي أخطاء كتابية ظاهرة قبل الإرسال.
- If topic is outside marketing, still answer helpfully then bridge back to BARQ

COMPANY: BARQ Digital Marketing | Since 2020 | Egypt
Services: Branding, Web/Mobile, Media Buying, Social Media, Business Dev, Production
Contact: +20 101 143 4111 | barqwork@gmail.com

Recent conversation:
${recentContext || 'Assistant: مرحباً! كيف أقدر أساعدك؟'}

User: ${userMessage}
You:`;

    try {
        console.log('🚀 Calling Gemini AI...');
        
    const response = await fetch(`${GEMINI_API_URL}?key=${GEMINI_API_KEY}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                contents: [{
                    parts: [{ text: systemPrompt }]
                }],
                generationConfig: {
                    temperature: 0.9,
                    maxOutputTokens: 1200,
                    topP: 0.95
                }
            })
        });

        if (!response.ok) {
            const errorText = await response.text();
            console.error('❌ API Error:', response.status);
            console.error('📄 Error Details:', errorText);
            return null;
        }

        const data = await response.json();
        const aiText = data.candidates?.[0]?.content?.parts?.[0]?.text;
        
        if (aiText) {
            console.log('✅ AI Response received!');
            
            // حفظ في المحادثة
            conversationHistory.push({ role: 'user', text: userMessage });
            conversationHistory.push({ role: 'assistant', text: aiText });
            
            // الاحتفاظ بآخر 12 رسالة فقط
            if (conversationHistory.length > 18) {
                conversationHistory = conversationHistory.slice(-18);
            }
            
            return aiText;
        }
        
        return null;
        
    } catch (error) {
        console.error('❌ Error:', error);
        return null;
    }
}

// ===================================
// 💬 إدارة الشات
// ===================================

const chatToggle = document.querySelector(".chat-toggle");
const chatBot = document.querySelector(".chat-bot");
const closeChat = document.querySelector(".close-chat");
const chatInput = document.querySelector(".chat-input input");
const chatSendBtn = document.querySelector(".chat-input button");
const chatMessages = document.querySelector(".chat-messages");
const clearChatBtn = document.querySelector(".clear-chat");

async function sendMessage() {
    const input = chatInput.value.trim();
    if (!input) return;
    
    // عرض رسالة المستخدم
    addMessage(input, "user");
    chatInput.value = "";
    
    // iOS fix
    if (isIOS) {
        chatInput.blur();
        setTimeout(() => chatInput.focus(), 300);
    }
    
    // عرض typing indicator
    showTypingIndicator();
    
    // الحصول على الرد الذكي
    const response = await getSmartResponse(input);
    
    hideTypingIndicator();
    
    if (response) {
        addMessage(response, "bot");
    } else {
        addMessage('عذراً، حصلت مشكلة مؤقتة 😔\n\nتواصل معنا مباشرة:\n📱 +20 101 143 4111\n📧 barqwork@gmail.com', "bot");
    }
    
    // iOS scroll fix
    if (isIOS) {
        setTimeout(() => {
            chatMessages.scrollTop = chatMessages.scrollHeight;
        }, 100);
    }
}

function showTypingIndicator() {
    let typing = document.createElement("div");
    typing.className = "message bot typing-indicator";
    typing.id = "typing";
    typing.innerHTML = `<p><span></span><span></span><span></span></p>`;
    chatMessages.appendChild(typing);
    chatMessages.scrollTop = chatMessages.scrollHeight;
}

function hideTypingIndicator() {
    const typing = document.getElementById("typing");
    if (typing) typing.remove();
}

function addMessage(text, sender) {
    const message = document.createElement("div");
    message.className = `message ${sender}`;
    
    const formattedText = text.replace(/\n/g, '<br>');
    message.innerHTML = `<p>${formattedText}</p>`;
    
    chatMessages.appendChild(message);
    chatMessages.scrollTop = chatMessages.scrollHeight;
    
    setTimeout(() => {
        message.style.opacity = '1';
        message.style.transform = 'translateY(0)';
    }, 10);
    
    saveMessage(text, sender);
}

// حفظ واسترجاع المحادثة
function saveMessage(text, sender) {
    let messages = JSON.parse(localStorage.getItem('chatMessages') || '[]');
    messages.push({ text, sender, timestamp: Date.now() });
    
    if (messages.length > 80) {
        messages = messages.slice(-80);
    }
    
    localStorage.setItem('chatMessages', JSON.stringify(messages));
}

function loadMessages() {
    let messages = JSON.parse(localStorage.getItem('chatMessages') || '[]');
    
    // حذف الرسائل أقدم من 24 ساعة
    const oneDayAgo = Date.now() - (24 * 60 * 60 * 1000);
    messages = messages.filter(msg => msg.timestamp > oneDayAgo);
    localStorage.setItem('chatMessages', JSON.stringify(messages));
    
    // عرض آخر 10 رسائل
    messages.slice(-10).forEach(msg => {
        const message = document.createElement("div");
        message.className = `message ${msg.sender}`;
        const formattedText = msg.text.replace(/\n/g, '<br>');
        message.innerHTML = `<p>${formattedText}</p>`;
        message.style.opacity = '1';
        message.style.transform = 'translateY(0)';
        chatMessages.appendChild(message);
    });
    
    // تحميل سياق المحادثة
    conversationHistory = messages.slice(-10).map(msg => ({
        role: msg.sender === 'user' ? 'user' : 'assistant',
        text: msg.text
    }));
    
    chatMessages.scrollTop = chatMessages.scrollHeight;
}

function clearChat() {
    if (confirm("هل تريد مسح المحادثة والبدء من جديد؟")) {
        chatMessages.innerHTML = '';
        localStorage.removeItem('chatMessages');
        conversationHistory = [];
        
        // رسالة ترحيب جديدة
        setTimeout(() => {
            addMessage("مرحباً بيك من جديد! 👋😊\nأنا هنا لمساعدتك. إزيك؟ عايز تعرف إيه عن برق؟", "bot");
        }, 300);
    }
}

// Event Listeners
chatToggle.addEventListener("click", () => {
    chatBot.style.display = "flex";
    chatToggle.style.display = "none";
    chatInput.focus();
    
    if (isIOS) {
        document.body.style.overflow = 'hidden';
    }
});

closeChat.addEventListener("click", () => {
    chatBot.style.display = "none";
    chatToggle.style.display = "flex";
    document.body.style.overflow = '';
});

if (clearChatBtn) {
    clearChatBtn.addEventListener("click", clearChat);
}

chatSendBtn.addEventListener("click", sendMessage);

chatInput.addEventListener("keypress", e => {
    if (e.key === "Enter") sendMessage();
});

// iOS fixes
if (isIOS) {
    chatInput.addEventListener('focus', function() {
        setTimeout(() => {
            chatMessages.scrollTop = chatMessages.scrollHeight;
        }, 300);
    });
}

// تحميل عند بدء الصفحة
window.addEventListener("load", () => {
    setTimeout(() => {
        let savedMessages = JSON.parse(localStorage.getItem('chatMessages') || '[]');
        
        if (savedMessages.length === 0) {
            // رسالة ترحيب للمستخدمين الجدد
            addMessage("أهلاً بيك في برق! ⚡✨\n\nأنا هنا عشان أساعدك في أي حاجة - سواء عن خدماتنا، السوشيال ميديا، البرمجة، أو حتى لو عايز تهزر! 😄\n\nإزيك؟ عايز تعرف إيه؟", "bot");
        } else {
            // تحميل المحادثة السابقة
            loadMessages();
        }
    }, 1000);
});

console.log('✅ BARQ Smart AI Chat Ready! 🚀');

// Debug: log available models once
(async function logAvailableModels() {
    try {
        const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models?key=${GEMINI_API_KEY}`);
        if (!res.ok) {
            console.error('❌ ListModels error:', res.status);
            return;
        }
        const data = await res.json();
        console.log('📄 Available models:', data.models?.map(m => m.name));
    } catch (err) {
        console.error('❌ list models exception:', err);
    }
})();
