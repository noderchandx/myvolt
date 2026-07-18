/* =========================================================
   সাধারণ হেল্পার ফাংশনসমূহ — সব পেজে ব্যবহৃত হয়
   ========================================================= */

// টোস্ট নোটিফিকেশন দেখানো
function showToast(message, type = "info"){
  let wrap = document.querySelector(".toast-wrap");
  if(!wrap){
    wrap = document.createElement("div");
    wrap.className = "toast-wrap";
    document.body.appendChild(wrap);
  }
  const el = document.createElement("div");
  el.className = `toast ${type}`;
  el.textContent = message;
  wrap.appendChild(el);
  setTimeout(()=> el.remove(), 3500);
}

// বাইট থেকে পাঠযোগ্য ফাইল সাইজ (যেমন 2.4 MB)
function formatBytes(bytes){
  if(!bytes || bytes === 0) return "0 B";
  const units = ["B","KB","MB","GB","TB"];
  const i = Math.floor(Math.log(bytes) / Math.log(1024));
  return `${(bytes / Math.pow(1024, i)).toFixed(i === 0 ? 0 : 1)} ${units[i]}`;
}

// ফাইল টাইপ অনুযায়ী আইকন/ইমোজি রিটার্ন করা
function fileIcon(type = "", name = ""){
  const ext = (name.split(".").pop() || "").toLowerCase();
  if(type.startsWith("image/")) return "🖼️";
  if(ext === "pdf" || type === "application/pdf") return "📕";
  if(["doc","docx"].includes(ext)) return "📄";
  if(["xls","xlsx","csv"].includes(ext)) return "📊";
  if(["ppt","pptx"].includes(ext)) return "📽️";
  if(["zip","rar","7z"].includes(ext)) return "🗜️";
  if(["mp4","mov","avi","mkv"].includes(ext)) return "🎬";
  if(["mp3","wav","m4a"].includes(ext)) return "🎵";
  return "📁";
}

// তারিখ ফরম্যাট
function formatDate(ts){
  if(!ts) return "-";
  const d = ts.toDate ? ts.toDate() : new Date(ts);
  return d.toLocaleDateString(getLang() === "bn" ? "bn-BD" : "en-US", { year:"numeric", month:"short", day:"numeric" });
}

// র‍্যান্ডম শেয়ার আইডি তৈরি
function genShareId(){
  return "shr_" + Math.random().toString(36).slice(2, 10) + Date.now().toString(36);
}

// Firebase error কোড থেকে বাংলা/ইংরেজি বার্তা
function friendlyAuthError(err){
  const lang = getLang();
  const map = {
    "auth/email-already-in-use": { bn:"এই ইমেইল দিয়ে আগেই অ্যাকাউন্ট আছে।", en:"An account already exists with this email." },
    "auth/invalid-email": { bn:"সঠিক ইমেইল দিন।", en:"Please enter a valid email." },
    "auth/weak-password": { bn:"পাসওয়ার্ড কমপক্ষে ৬ অক্ষরের হতে হবে।", en:"Password must be at least 6 characters." },
    "auth/user-not-found": { bn:"এই ইমেইলে কোনো অ্যাকাউন্ট পাওয়া যায়নি।", en:"No account found with this email." },
    "auth/wrong-password": { bn:"পাসওয়ার্ড সঠিক নয়।", en:"Incorrect password." },
    "auth/invalid-credential": { bn:"ইমেইল অথবা পাসওয়ার্ড সঠিক নয়।", en:"Invalid email or password." },
    "auth/too-many-requests": { bn:"অনেকবার চেষ্টা করা হয়েছে, একটু পরে চেষ্টা করুন।", en:"Too many attempts. Try again later." },
  };
  const entry = map[err.code];
  if(entry) return entry[lang] || entry.bn;
  return err.message || (lang === "bn" ? "একটি সমস্যা হয়েছে।" : "Something went wrong.");
}

// প্রোফাইল ছবির ডিফল্ট (initial letter অ্যাভাটার)
function defaultAvatar(name = "U"){
  const letter = (name || "U").trim().charAt(0).toUpperCase();
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="80" height="80"><rect width="80" height="80" rx="40" fill="#16233F"/><text x="50%" y="55%" font-size="34" fill="#D4A537" text-anchor="middle" font-family="sans-serif">${letter}</text></svg>`;
  return "data:image/svg+xml;base64," + btoa(svg);
}

// শুধু login করা user এর জন্য পেজ প্রোটেক্ট করা — না থাকলে login.html এ পাঠানো
function requireAuth(callback){
  auth.onAuthStateChanged(user=>{
    if(!user){
      window.location.href = "login.html";
    } else {
      callback(user);
    }
  });
}

// অ্যাডমিন কিনা যাচাই
function isAdminEmail(email){
  return APP_CONFIG.ADMIN_EMAILS.includes(email);
}
// লগআউট (dashboard.html সহ সব পেজ থেকে ব্যবহারযোগ্য)
function logout(){
  auth.signOut().then(()=> window.location.href = "login.html");
}
