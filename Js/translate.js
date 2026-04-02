function googleTranslateElementInit() {
  new google.translate.TranslateElement({
    pageLanguage: 'pt',
    includedLanguages: 'en,pt'
  }, 'google_translate_element');
}

function changeLanguage(lang) {
  var select = document.querySelector("select.goog-te-combo");

  if (select) {
    select.value = lang;
    select.dispatchEvent(new Event("change"));
  }

  updateActiveLang(lang);
}

function updateActiveLang(lang) {
  const ptBtn = document.getElementById("translate-pt");
  const enBtn = document.getElementById("translate-en");

  ptBtn.classList.remove("active");
  enBtn.classList.remove("active");

  if (lang === "pt") {
    ptBtn.classList.add("active");
  } else if (lang === "en") {
    enBtn.classList.add("active");
  }
}

document.addEventListener("DOMContentLoaded", () => {
  const ptBtn = document.getElementById("translate-pt");
  const enBtn = document.getElementById("translate-en");

  if (ptBtn) ptBtn.addEventListener("click", () => changeLanguage("pt"));
  if (enBtn) enBtn.addEventListener("click", () => changeLanguage("en"));

  // idioma padrão
  updateActiveLang("pt");
});