let currentLang = 'pt';

function updateLanguage(lang) {
  currentLang = lang;
  const t = translations[lang];
  if (!t) return;

  document.querySelectorAll('[data-i18n]').forEach(el => {
    const key = el.dataset.i18n;
    if (t[key] !== undefined) {
      el.textContent = t[key];
    }
  });

  document.querySelectorAll('[data-i18n-html]').forEach(el => {
    const key = el.dataset.i18nHtml;
    if (t[key] !== undefined) {
      el.innerHTML = t[key].replace(/\n/g, '<br>');
    }
  });

  document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
    const key = el.dataset.i18nPlaceholder;
    if (t[key] !== undefined) {
      el.placeholder = t[key];
    }
  });

  document.getElementById('translate-pt').classList.toggle('active', lang === 'pt');
  document.getElementById('translate-en').classList.toggle('active', lang === 'en');

  localStorage.setItem('lang', lang);
}

document.addEventListener("DOMContentLoaded", () => {
  const saved = localStorage.getItem('lang') || 'pt';
  updateLanguage(saved);

  document.getElementById('translate-pt').addEventListener('click', () => updateLanguage('pt'));
  document.getElementById('translate-en').addEventListener('click', () => updateLanguage('en'));
});
