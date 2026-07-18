/* =========================================================
   ভাষা সিস্টেম (বাংলা / ইংরেজি)
   data-i18n="key" অ্যাট্রিবিউটওয়ালা যেকোনো এলিমেন্টের টেক্সট
   এবং data-i18n-placeholder="key" ইনপুট প্লেসহোল্ডার পরিবর্তন করে।
   ========================================================= */

const translations = {
  bn: {
    nav_features: "সুবিধাসমূহ", nav_login: "লগইন", nav_register: "রেজিস্টার",
    hero_title_1: "আপনার ফাইল, নিরাপদে", hero_title_2: "সবসময়, সবখানে।",
    hero_desc: "My Vault হলো একটি ব্যক্তিগত ক্লাউড স্টোরেজ যেখানে আপনি ছবি, PDF, ডকুমেন্ট নিরাপদে সংরক্ষণ ও শেয়ার করতে পারবেন — কোনো ঝামেলা ছাড়াই।",
    hero_cta_start: "ফ্রি শুরু করুন", hero_cta_login: "লগইন করুন",
    feat_title: "কেন My Vault?", feat_sub: "আপনার প্রয়োজনীয় সব ফিচার এক জায়গায়",
    f1_t: "১ জিবি ফ্রি স্টোরেজ", f1_d: "প্রতিটি অ্যাকাউন্টে শুরুতেই ১ জিবি ফ্রি জায়গা।",
    f2_t: "ফোল্ডার সিস্টেম", f2_d: "ফাইল গুছিয়ে রাখুন ফোল্ডার তৈরি করে।",
    f3_t: "শেয়ার লিংক", f3_d: "যেকোনো ফাইলের পাবলিক লিংক তৈরি করে শেয়ার করুন।",
    f4_t: "সম্পূর্ণ নিরাপদ", f4_d: "শুধু আপনি দেখতে পারবেন আপনার ফাইল।",
    f5_t: "যেকোনো ডিভাইস", f5_d: "মোবাইল, ট্যাব বা কম্পিউটার — সব জায়গায় কাজ করে।",
    f6_t: "গুগল দিয়ে লগইন", f6_d: "এক ক্লিকে গুগল অ্যাকাউন্ট দিয়ে প্রবেশ করুন।",
    footer_rights: "সর্বস্বত্ব সংরক্ষিত।",
    reg_title: "নতুন অ্যাকাউন্ট তৈরি করুন", reg_sub: "শুরু করতে আপনার তথ্য দিন",
    lbl_name: "পূর্ণ নাম", lbl_mobile: "মোবাইল নম্বর", lbl_email: "ইমেইল",
    lbl_password: "পাসওয়ার্ড", lbl_photo: "প্রোফাইল ছবি (ঐচ্ছিক)",
    btn_register: "রেজিস্টার করুন", or_text: "অথবা",
    btn_google: "গুগল দিয়ে চালিয়ে যান",
    already_account: "আগে থেকে অ্যাকাউন্ট আছে?",
    login_title: "লগইন করুন", login_sub: "আপনার ভল্টে প্রবেশ করুন",
    forgot_pass: "পাসওয়ার্ড ভুলে গেছেন?", btn_login: "লগইন",
    no_account: "অ্যাকাউন্ট নেই?", create_one: "একটি তৈরি করুন",
    dash_recent: "সাম্প্রতিক ফাইল", dash_used: "ব্যবহৃত", dash_available: "উপলব্ধ",
    dash_total_files: "মোট ফাইল", dash_upload: "আপলোড করুন", dash_new_folder: "নতুন ফোল্ডার",
    search_ph: "ফাইল খুঁজুন...", nav_myfiles: "আমার ফাইল", nav_shared: "শেয়ারড লিংক",
    nav_profile: "প্রোফাইল", nav_logout: "লগআউট", nav_admin: "অ্যাডমিন প্যানেল",
    empty_files: "এখনো কোনো ফাইল নেই। আপলোড করে শুরু করুন!",
    menu_download: "ডাউনলোড", menu_share: "শেয়ার লিংক", menu_rename: "নাম পরিবর্তন",
    menu_delete: "ডিলিট", menu_open: "খুলুন",
  },
  en: {
    nav_features: "Features", nav_login: "Login", nav_register: "Register",
    hero_title_1: "Your files, safely", hero_title_2: "always, everywhere.",
    hero_desc: "My Vault is a personal cloud storage where you can securely save and share photos, PDFs and documents — hassle-free.",
    hero_cta_start: "Start Free", hero_cta_login: "Login",
    feat_title: "Why My Vault?", feat_sub: "All the features you need in one place",
    f1_t: "1 GB Free Storage", f1_d: "Every account starts with 1 GB of free space.",
    f2_t: "Folder System", f2_d: "Organize files by creating folders.",
    f3_t: "Share Links", f3_d: "Create a public share link for any file.",
    f4_t: "Fully Secure", f4_d: "Only you can see your own files.",
    f5_t: "Any Device", f5_d: "Works on mobile, tablet, or computer.",
    f6_t: "Sign in with Google", f6_d: "Get in with one click using Google.",
    footer_rights: "All rights reserved.",
    reg_title: "Create a new account", reg_sub: "Enter your details to get started",
    lbl_name: "Full Name", lbl_mobile: "Mobile Number", lbl_email: "Email",
    lbl_password: "Password", lbl_photo: "Profile Photo (optional)",
    btn_register: "Register", or_text: "or",
    btn_google: "Continue with Google",
    already_account: "Already have an account?",
    login_title: "Login", login_sub: "Access your vault",
    forgot_pass: "Forgot password?", btn_login: "Login",
    no_account: "Don't have an account?", create_one: "Create one",
    dash_recent: "Recent Files", dash_used: "Used", dash_available: "Available",
    dash_total_files: "Total Files", dash_upload: "Upload", dash_new_folder: "New Folder",
    search_ph: "Search files...", nav_myfiles: "My Files", nav_shared: "Shared Links",
    nav_profile: "Profile", nav_logout: "Logout", nav_admin: "Admin Panel",
    empty_files: "No files yet. Upload something to get started!",
    menu_download: "Download", menu_share: "Share Link", menu_rename: "Rename",
    menu_delete: "Delete", menu_open: "Open",
  }
};

function getLang(){ return localStorage.getItem("mv_lang") || "bn"; }

function applyLang(lang){
  localStorage.setItem("mv_lang", lang);
  document.documentElement.lang = lang;
  const dict = translations[lang] || translations.bn;
  document.querySelectorAll("[data-i18n]").forEach(el=>{
    const key = el.getAttribute("data-i18n");
    if(dict[key]) el.textContent = dict[key];
  });
  document.querySelectorAll("[data-i18n-placeholder]").forEach(el=>{
    const key = el.getAttribute("data-i18n-placeholder");
    if(dict[key]) el.placeholder = dict[key];
  });
  const langBtn = document.getElementById("langToggle");
  if(langBtn) langBtn.textContent = lang === "bn" ? "EN" : "বাং";
}

function t(key){
  const dict = translations[getLang()] || translations.bn;
  return dict[key] || key;
}

function initLangToggle(){
  applyLang(getLang());
  const btn = document.getElementById("langToggle");
  if(btn){
    btn.addEventListener("click", ()=>{
      const next = getLang() === "bn" ? "en" : "bn";
      applyLang(next);
    });
  }
}

/* ---------- থিম (লাইট/ডার্ক) ---------- */
function getTheme(){ return localStorage.getItem("mv_theme") || "light"; }
function applyTheme(theme){
  localStorage.setItem("mv_theme", theme);
  document.documentElement.setAttribute("data-theme", theme === "dark" ? "dark" : "light");
  const btn = document.getElementById("themeToggle");
  if(btn) btn.textContent = theme === "dark" ? "☀️" : "🌙";
}
function initThemeToggle(){
  applyTheme(getTheme());
  const btn = document.getElementById("themeToggle");
  if(btn){
    btn.addEventListener("click", ()=>{
      const next = getTheme() === "dark" ? "light" : "dark";
      applyTheme(next);
    });
  }
}

document.addEventListener("DOMContentLoaded", ()=>{
  initLangToggle();
  initThemeToggle();
});
