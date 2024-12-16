// Ekran, geçmiş ve butonları seçiyoruz
const display = document.getElementById('display');
const historyDiv = document.getElementById('history');
const clearHistoryBtn = document.getElementById('clear-history');

// Değişkenler
let currentOperand = '';
let previousOperand = '';
let operation = undefined;

// Geçmişi localStorage'dan yüklüyoruz
let history = JSON.parse(localStorage.getItem('history')) || [];

// Butonlar için olay dinleyicisi (Event Delegation)
const buttonsContainer = document.querySelector('.buttons');
buttonsContainer.addEventListener('click', (event) => {
    const target = event.target;
    if (target.matches('button')) {
        if (target.hasAttribute('data-number')) {
            appendNumber(target.getAttribute('data-number'));
            updateDisplay();
        } else if (target.hasAttribute('data-operation')) {
            chooseOperation(target.getAttribute('data-operation'));
            updateDisplay();
        }
    }
});

// Bilimsel butonlar için olay dinleyicisi
const scientificButtonsContainer = document.querySelector('.scientific-buttons');
scientificButtonsContainer.addEventListener('click', (event) => {
    const target = event.target;
    if (target.matches('button')) {
        chooseOperation(target.getAttribute('data-operation'));
        updateDisplay();
    }
});

// Klavye olaylarını dinleme
document.addEventListener('keydown', (event) => {
    const key = event.key;

    if ((key >= '0' && key <= '9') || key === '.') {
        appendNumber(key);
        updateDisplay();
    }

    if (key === '+' || key === '-' || key === '*' || key === '/' || key === '%') {
        chooseOperation(key);
        updateDisplay();
    }

    if (key === '=' || key === 'Enter') {
        compute();
        updateDisplay();
    }

    if (key === 'Backspace') {
        deleteNumber();
        updateDisplay();
    }

    if (key === 'Escape') {
        clear();
        updateDisplay();
    }
});

// Sayı ekleme fonksiyonu
function appendNumber(number) {
    if (number === '.' && currentOperand.includes('.')) return;
    currentOperand = currentOperand.toString() + number.toString();
}

// İşlem seçme fonksiyonu
function chooseOperation(op) {
    if (op === 'clear') {
        clear();
        return;
    }

    if (op === 'delete') {
        deleteNumber();
        return;
    }

    if (op === 'sqrt' || op === 'square' || op === 'factorial' || op === 'exp' || op === 'ln' || op === 'log' || op === 'sin' || op === 'cos' || op === 'tan') {
        operation = op;
        compute();
        updateDisplay();
        return;
    }

    if (currentOperand === '') return;

    if (previousOperand !== '') {
        compute();
    }

    operation = op;
    previousOperand = currentOperand;
    currentOperand = '';
}

// Hesaplama fonksiyonu
function compute() {
    let computation;
    const prev = parseFloat(previousOperand);
    const current = parseFloat(currentOperand);

    if (isNaN(prev) && isNaN(current)) return;

    switch (operation) {
        case '+':
            computation = prev + current;
            break;
        case '-':
            computation = prev - current;
            break;
        case '*':
        case '×':
            computation = prev * current;
            break;
        case '/':
        case '÷':
            if (current === 0) {
                alert('Hata: Sıfıra bölme yapılamaz!');
                clear();
                return;
            }
            computation = prev / current;
            break;
        case '%':
            computation = prev % current;
            break;
        case 'power':
            computation = Math.pow(prev, current);
            break;
        case 'sqrt':
            computation = Math.sqrt(currentOperand || previousOperand);
            break;
        case 'square':
            computation = Math.pow(currentOperand || previousOperand, 2);
            break;
        case 'factorial':
            computation = factorial(currentOperand || previousOperand);
            break;
        case 'exp':
            computation = Math.exp(currentOperand || previousOperand);
            break;
        case 'ln':
            computation = Math.log(currentOperand || previousOperand);
            break;
        case 'log':
            computation = Math.log10(currentOperand || previousOperand);
            break;
        case 'sin':
            computation = Math.sin((currentOperand || previousOperand) * Math.PI / 180);
            break;
        case 'cos':
            computation = Math.cos((currentOperand || previousOperand) * Math.PI / 180);
            break;
        case 'tan':
            computation = Math.tan((currentOperand || previousOperand) * Math.PI / 180);
            break;
        default:
            alert('Hata: Geçersiz işlem!');
            clear();
            return;
    }

    // Hataları kontrol edelim
    if (isNaN(computation) || !isFinite(computation)) {
        alert('Hata: Geçersiz matematiksel işlem!');
        clear();
        return;
    }

    currentOperand = computation;
    operation = undefined;
    previousOperand = '';
    appendHistory(`${prev !== undefined ? prev : ''} ${operationSymbol(operation)} ${current !== undefined ? current : ''} = ${computation}`);
}

// İşlem sembolünü döndüren fonksiyon
function operationSymbol(op) {
    const symbols = {
        '+': '+',
        '-': '−',
        '*': '×',
        '/': '÷',
        '%': '%',
        'power': '^',
        'sqrt': '√',
        'square': 'x²',
        'factorial': '!',
        'exp': 'eˣ',
        'ln': 'ln',
        'log': 'log',
        'sin': 'sin',
        'cos': 'cos',
        'tan': 'tan'
    };
    return symbols[op] || '';
}

// Faktöriyel fonksiyonu
function factorial(n) {
    n = parseInt(n);
    if (n < 0) return 'Tanımsız';
    if (n === 0 || n === 1) return 1;
    let result = 1;
    for (let i = n; i > 1; i--) {
        result *= i;
    }
    return result;
}

// Ekranı güncelleme fonksiyonu
function updateDisplay() {
    display.innerText = currentOperand || previousOperand || '0';
}

// Temizleme fonksiyonu
function clear() {
    currentOperand = '';
    previousOperand = '';
    operation = undefined;
    display.innerText = '0';
}

// Silme fonksiyonu
function deleteNumber() {
    currentOperand = currentOperand.toString().slice(0, -1);
}

// Tarihçe ekleme ve gösterme fonksiyonları
function appendHistory(expression) {
    history.unshift(expression);
    if (history.length > 10) {
        history.pop();
    }
    localStorage.setItem('history', JSON.stringify(history));
    renderHistory();
}

function renderHistory() {
    historyDiv.innerHTML = '';
    history.forEach(item => {
        const div = document.createElement('div');
        div.innerText = item;
        historyDiv.appendChild(div);
    });
}

// Geçmişi temizleme
clearHistoryBtn.addEventListener('click', () => {
    history = [];
    localStorage.removeItem('history');
    renderHistory();
});

// Tema değiştirme
const lightThemeBtn = document.getElementById('light-theme');
const darkThemeBtn = document.getElementById('dark-theme');
const colorfulThemeBtn = document.getElementById('colorful-theme');

lightThemeBtn.addEventListener('click', () => {
    document.body.classList.remove('dark-theme', 'colorful-theme');
    document.body.classList.add('light-theme');
});

darkThemeBtn.addEventListener('click', () => {
    document.body.classList.remove('light-theme', 'colorful-theme');
    document.body.classList.add('dark-theme');
});

colorfulThemeBtn.addEventListener('click', () => {
    document.body.classList.remove('light-theme', 'dark-theme');
    document.body.classList.add('colorful-theme');
});

// Sayfa yüklendiğinde
document.addEventListener('DOMContentLoaded', () => {
    updateDisplay();
    renderHistory();
});
// ... Önceki değişkenler ve fonksiyonlar ...

// Dil Seçimi
const langTrBtn = document.getElementById('lang-tr');
const langEnBtn = document.getElementById('lang-en');
let currentLanguage = 'tr';

// Metinleri içeren bir nesne
const translations = {
    tr: {
        clear: 'C',
        delete: '⌫',
        percent: '%',
        divide: '÷',
        multiply: '×',
        subtract: '−',
        add: '+',
        equals: '=',
        decimal: '.',
        themeButtons: ['Aydınlık Tema', 'Karanlık Tema', 'Renkli Tema'],
        clearHistory: 'Geçmişi Temizle',
        lang: 'Dil'
    },
    en: {
        clear: 'C',
        delete: '⌫',
        percent: '%',
        divide: '÷',
        multiply: '×',
        subtract: '−',
        add: '+',
        equals: '=',
        decimal: '.',
        themeButtons: ['Light Theme', 'Dark Theme', 'Colorful Theme'],
        clearHistory: 'Clear History',
        lang: 'Language'
    }
};

// Dil değiştirme fonksiyonu
function changeLanguage(lang) {
    currentLanguage = lang;

    // Dil seçici butonlarının aktiflik durumunu güncelle
    if (lang === 'tr') {
        langTrBtn.classList.add('active');
        langEnBtn.classList.remove('active');
    } else {
        langEnBtn.classList.add('active');
        langTrBtn.classList.remove('active');
    }

    // Buton metinlerini güncelle
    document.querySelector('[data-operation="clear"]').innerText = translations[lang].clear;
    document.querySelector('[data-operation="delete"]').innerText = translations[lang].delete;
    document.querySelector('[data-operation="%"]').innerText = translations[lang].percent;
    document.querySelector('[data-operation="/"]').innerText = translations[lang].divide;
    document.querySelector('[data-operation="*"]').innerText = translations[lang].multiply;
    document.querySelector('[data-operation="-"]').innerText = translations[lang].subtract;
    document.querySelector('[data-operation="+"]').innerText = translations[lang].add;
    document.querySelector('[data-operation="="]').innerText = translations[lang].equals;
    document.querySelector('[data-number="."]').innerText = translations[lang].decimal;
    document.getElementById('clear-history').innerText = translations[lang].clearHistory;

    // Tema butonlarının metinlerini güncelle
    const themeBtns = document.querySelectorAll('.theme-buttons button');
    themeBtns.forEach((btn, index) => {
        btn.innerText = translations[lang].themeButtons[index];
    });

    // İşlem sembollerini güncelle (eğer gerekiyor ise)
    updateDisplay();
}

// Dil seçici butonları için olay dinleyicileri
langTrBtn.addEventListener('click', () => {
    changeLanguage('tr');
});

langEnBtn.addEventListener('click', () => {
    changeLanguage('en');
});

// Sayfa yüklendiğinde
document.addEventListener('DOMContentLoaded', () => {
    updateDisplay();
    renderHistory();
    changeLanguage(currentLanguage); // Varsayılan dil Türkçe
});

