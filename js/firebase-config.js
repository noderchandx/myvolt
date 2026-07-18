/* =========================================================
   Firebase কনফিগারেশন
   ---------------------------------------------------------
   Firebase Console (https://console.firebase.google.com) থেকে
   আপনার প্রজেক্ট তৈরি করে নিচের মানগুলো বসান।
   Project Settings > General > Your apps > SDK setup and configuration
   ========================================================= */

const firebaseConfig = {
  apiKey: "AIzaSyD08a5mv8LYakFOFKPKR2Ne00beiDh5_lY",
  authDomain: "myvolt-4b93d.firebaseapp.com",
  projectId: "myvolt-4b93d",
  storageBucket: "myvolt-4b93d.firebasestorage.app",
  messagingSenderId: "776336942648",
  appId: "1:776336942648:web:ee10e07b53169023f668cd",
  measurementId: "G-75Q7JJG48S"
};

// Firebase App ইনিশিয়ালাইজ করা (compat SDK — GitHub Pages এ কোনো build tool ছাড়াই কাজ করে)
firebase.initializeApp(firebaseConfig);

// প্রয়োজনীয় সার্ভিসগুলো এক্সপোর্ট করা (গ্লোবাল ভ্যারিয়েবল হিসেবে ব্যবহারযোগ্য)
// নোট: Firebase Storage ব্যবহার করা হচ্ছে না (Blaze প্ল্যান/কার্ড লাগে বলে)।
// এর বদলে ফাইল আপলোডের জন্য Cloudinary (ফ্রি, কার্ড লাগে না) ব্যবহার করা হয়েছে।
const auth = firebase.auth();
const db = firebase.firestore();

/* ---------------------------------------------------------
   Cloudinary কনফিগারেশন
   ---------------------------------------------------------
   https://cloudinary.com এ ফ্রি অ্যাকাউন্ট খুলে:
   1) Dashboard থেকে Cloud Name কপি করুন
   2) Settings > Upload > Upload presets > Add upload preset
      Signing Mode = Unsigned করে Save করুন, প্রিসেট নামটি বসান
   --------------------------------------------------------- */
const CLOUDINARY_CONFIG = {
  CLOUD_NAME: "YOUR_CLOUD_NAME",          // যেমন: "dxxxxxx"
  UPLOAD_PRESET: "myvault_unsigned"       // আপনার unsigned upload preset নাম
};

/* ---------------------------------------------------------
   অ্যাপ কনফিগারেশন কনস্ট্যান্ট
   --------------------------------------------------------- */
const APP_CONFIG = {
  FREE_STORAGE_LIMIT_BYTES: 1 * 1024 * 1024 * 1024, // 1 GB ফ্রি স্টোরেজ (হিসাব রাখা হয় Firestore-এ)
  MAX_FILE_SIZE_BYTES: 25 * 1024 * 1024, // Cloudinary ফ্রি টায়ারে একক ফাইলের সর্বোচ্চ সীমা (~25MB, রেসোর্স টাইপ ভেদে পরিবর্তনযোগ্য)
  ADMIN_EMAILS: [
    "admin@myvault.com" // এখানে অ্যাডমিন ইমেইল যোগ করুন
  ],
  // পাসওয়ার্ড রিকভারি ফি (ভবিষ্যতে বিকাশ পেমেন্ট গেটওয়ে যুক্ত হবে)
  PASSWORD_RECOVERY_FEE_BDT: 20,
  BKASH_MERCHANT_LINK: "https://bkash.com/YOUR_MERCHANT_LINK" // বিকাশ মার্চেন্ট লিংক বসান
};
