# My Vault 🔐 — ব্যক্তিগত ক্লাউড স্টোরেজ ওয়েব অ্যাপ

HTML5 + CSS3 + Vanilla JavaScript + Firebase (Auth + Firestore) + Cloudinary দিয়ে তৈরি একটি সম্পূর্ণ
Backend-less ক্লাউড স্টোরেজ অ্যাপ, যা GitHub Pages-এ ফ্রিতে হোস্ট করা যায়।

## ✨ ফিচার
- ইমেইল/পাসওয়ার্ড ও Google দিয়ে রেজিস্ট্রেশন/লগইন
- ফাইল/ছবি/PDF/ডকুমেন্ট আপলোড, প্রিভিউ, ডাউনলোড, রিনেম, ডিলিট, সার্চ
- ফোল্ডার তৈরি ও নেভিগেশন
- পাবলিক শেয়ার লিংক
- ১ জিবি ফ্রি স্টোরেজ + ব্যবহারের প্রোগ্রেস বার
- প্রোফাইল এডিট, পাসওয়ার্ড পরিবর্তন, অ্যাকাউন্ট ডিলিট
- অ্যাডমিন প্যানেল (ইউজার লিস্ট, ব্লক/আনব্লক, ফাইল মনিটরিং)
- লাইট/ডার্ক মোড + বাংলা/ইংরেজি ভাষা টগল
- সম্পূর্ণ মোবাইল রেসপন্সিভ

---

## ⚠️ গুরুত্বপূর্ণ নোট: ফাইল স্টোরেজ Cloudinary দিয়ে করা হয়েছে

Firebase Storage এখন ব্যবহার করতে হলে Google Cloud-এর **Blaze (Pay-as-you-go)** প্ল্যানে
আপগ্রেড করতে হয় (কার্ড লাগে), তাই এই প্রজেক্টে আসল ফাইল রাখার জন্য **Cloudinary**
(সম্পূর্ণ ফ্রি, কার্ড লাগে না) ব্যবহার করা হয়েছে। Firebase শুধু **Authentication** ও
**Firestore** (ইউজার/ফাইলের তথ্য রাখার ডাটাবেস) এর জন্য ব্যবহৃত হচ্ছে।

---

## 🚀 সেটআপ ধাপে ধাপে

### ধাপ ১: Firebase প্রজেক্ট তৈরি
1. https://console.firebase.google.com এ যান → **Add project** → নাম দিন (যেমন `my-vault`)
2. প্রজেক্ট তৈরি হয়ে গেলে বাম মেনু থেকে **Build > Authentication** এ যান
   - **Get started** ক্লিক করুন
   - **Sign-in method** ট্যাবে গিয়ে **Email/Password** enable করুন
   - **Google** প্রোভাইডার enable করুন (support email দিতে হবে)
3. বাম মেনু থেকে **Build > Firestore Database** এ যান
   - **Create database** ক্লিক করুন → **Start in production mode** সিলেক্ট করুন → একটি region বেছে নিন (যেমন `asia-south1`)
4. **Firestore Database > Rules** ট্যাবে গিয়ে এই রিপোর `firestore.rules` ফাইলের সম্পূর্ণ কনটেন্ট
   কপি-পেস্ট করে **Publish** করুন
5. **Project Settings (⚙️) > General** এ নিচের দিকে স্ক্রল করে **Your apps** সেকশনে
   **Web (</>)** আইকনে ক্লিক করে একটি ওয়েব অ্যাপ যোগ করুন → `firebaseConfig` অবজেক্টটি কপি করুন

### ধাপ ২: `js/firebase-config.js` ফাইল আপডেট করুন
কপি করা `firebaseConfig` দিয়ে ফাইলের শুরুর অংশ প্রতিস্থাপন করুন:
```js
const firebaseConfig = {
  apiKey: "...",
  authDomain: "...",
  projectId: "...",
  storageBucket: "...",
  messagingSenderId: "...",
  appId: "..."
};
```
নিচের দিকে `APP_CONFIG.ADMIN_EMAILS` তে আপনার অ্যাডমিন ইমেইল বসান:
```js
ADMIN_EMAILS: ["your-admin-email@gmail.com"]
```

### ধাপ ৩: Cloudinary সেটআপ (ফাইল স্টোরেজের জন্য)
1. https://cloudinary.com/users/register/free এ ফ্রি অ্যাকাউন্ট খুলুন (কার্ড লাগবে না)
2. Dashboard থেকে **Cloud Name** কপি করুন
3. **Settings ⚙️ → Upload → Upload presets → Add upload preset**
   - Signing Mode: **Unsigned**
   - প্রিসেট নাম দিন (যেমন `myvault_unsigned`) → Save
4. `js/firebase-config.js` ফাইলে `CLOUDINARY_CONFIG` আপডেট করুন:
```js
const CLOUDINARY_CONFIG = {
  CLOUD_NAME: "আপনার-cloud-name",
  UPLOAD_PRESET: "myvault_unsigned"
};
```

### ধাপ ৪: প্রথম অ্যাডমিন অ্যাকাউন্ট তৈরি
1. সাইটে গিয়ে সাধারণ ইউজার হিসেবে সেই অ্যাডমিন ইমেইল দিয়ে রেজিস্টার করুন
2. Firebase Console > Firestore Database > `users` কালেকশনে গিয়ে সেই ইউজারের ডকুমেন্টে
   `isAdmin: true` ফিল্ড ম্যানুয়ালি বসিয়ে দিন (অথবা `firebase-config.js`-এ ইমেইল আগে থেকে
   বসানো থাকলে পরবর্তী লগইনেই এটি স্বয়ংক্রিয়ভাবে সেট হয়ে যাবে নতুন সাইনআপে)
3. এরপর `admin.html` এ গিয়ে অ্যাডমিন প্যানেল দেখতে পারবেন

### ধাপ ৫: GitHub Pages-এ ডিপ্লয়
1. GitHub-এ একটি নতুন রিপোজিটরি তৈরি করুন (যেমন `myvault`)
2. এই সব ফাইল রিপোতে আপলোড/পুশ করুন (root এ `index.html` থাকা আবশ্যক)
3. রিপোর **Settings > Pages** এ যান → **Source: Deploy from a branch** → Branch: `main`, folder: `/root` → Save
4. কিছুক্ষণ পর `https://your-username.github.io/myvault/` এ সাইট লাইভ হয়ে যাবে
5. Firebase Console > Authentication > Settings > **Authorized domains** এ আপনার
   `your-username.github.io` ডোমেইনটি যোগ করুন (নাহলে লগইন কাজ করবে না)

---

## 📁 প্রজেক্ট স্ট্রাকচার
```
myvault/
├── index.html          # ল্যান্ডিং পেজ
├── register.html        # রেজিস্ট্রেশন
├── login.html            # লগইন
├── dashboard.html        # মূল অ্যাপ (ফাইল/ফোল্ডার/প্রোফাইল)
├── share.html            # পাবলিক শেয়ার ভিউ
├── admin.html             # অ্যাডমিন প্যানেল
├── firestore.rules        # Firestore Security Rules
├── css/style.css          # সব স্টাইল (লাইট/ডার্ক মোড সহ)
└── js/
    ├── firebase-config.js # Firebase + Cloudinary কনফিগ
    ├── i18n.js             # বাংলা/ইংরেজি ভাষা সিস্টেম
    ├── utils.js            # হেল্পার ফাংশন
    ├── cloudinary.js       # ফাইল আপলোড হেল্পার
    ├── auth.js             # রেজিস্টার/লগইন/লগআউট/ফরগট পাসওয়ার্ড
    ├── dashboard.js        # ফাইল ম্যানেজমেন্ট মূল লজিক
    ├── share.js            # শেয়ার পেজ লজিক
    └── admin.js            # অ্যাডমিন প্যানেল লজিক
```

## 🗄️ Firestore ডাটা স্ট্রাকচার
```
users/{uid}
  name, email, mobile, photoURL, storageUsed, storageLimit,
  status ("active"|"blocked"), isAdmin, createdAt

files/{fileId}
  ownerId, name, type ("file"|"folder"), parentId (null=root),
  fileType, size, url, publicId, createdAt

shares/{shareId}
  fileId, ownerId, fileName, createdAt
```

## ⚠️ পরিচিত সীমাবদ্ধতা (ব্যাকএন্ড-ছাড়া আর্কিটেকচারের কারণে)
- **পাসওয়ার্ড রিকভারি**: Firebase-এর বিল্ট-ইন ইমেইল রিসেট লিংক সম্পূর্ণ ফ্রি ও কাজ করে।
  "ফি দিয়ে রিকভারি" (বিকাশ পেমেন্ট) বাস্তবায়ন করতে ভবিষ্যতে একটি Cloud Function বা ছোট
  সার্ভারলেস ব্যাকএন্ড লাগবে পেমেন্ট ভেরিফাই করার জন্য (`BKASH_MERCHANT_LINK` কনফিগে
  প্লেসহোল্ডার রাখা আছে)।
- **ফাইল ডিলিট**: Cloudinary-এর "unsigned" আপলোডে ফাইল ডিলিট করা যায় না (API Secret লাগে,
  যা ব্রাউজারে নিরাপদে রাখা যায় না)। তাই "ডিলিট" করলে অ্যাপ থেকে ফাইলটি সরে যায় (Firestore
  রেকর্ড মুছে যায়), কিন্তু Cloudinary-এর স্টোরেজে ফাইলটি থেকে যায়। সম্পূর্ণ ডিলিট করতে
  ভবিষ্যতে একটি Cloud Function যোগ করা যাবে।
- **ফাইল সাইজ লিমিট**: Cloudinary ফ্রি টায়ারে একক ফাইল সর্বোচ্চ ~25MB পর্যন্ত সাপোর্ট করে।
- **অ্যাডমিন প্যানেলের "সাম্প্রতিক ফাইল" টেবিল**: প্রথমবার লোড হওয়ার সময় Firestore হয়তো
  একটি "composite index তৈরি করুন" লিংক দেখাবে কনসোলে — সেই লিংকে ক্লিক করলেই ইনডেক্স
  স্বয়ংক্রিয়ভাবে তৈরি হয়ে যাবে (কয়েক মিনিট সময় লাগে)।

## 🔭 ভবিষ্যতের জন্য প্রস্তুত (Future Ready)
- **Android App**: এই কোড WebView-ভিত্তিক Android অ্যাপে সহজে wrap করা যাবে (Capacitor/Cordova দিয়ে)
- **API Structure**: `js/` ফোল্ডারের প্রতিটি ফাইল মডিউলার — সহজেই একটি REST/Cloud Function API-তে রূপান্তরযোগ্য
- **Payment System**: `APP_CONFIG.BKASH_MERCHANT_LINK` প্লেসহোল্ডার রাখা আছে; বিকাশ চেকআউট
  ইন্টিগ্রেশন করতে একটি ছোট সার্ভারলেস ফাংশন (payment verify) যোগ করলেই হবে
- **Referral Storage**: `users/{uid}` ডকুমেন্টে `referralCode` ও `referredBy` ফিল্ড যোগ করে
  প্রতিটি সফল রেফারেলে `storageLimit` বাড়িয়ে দেওয়া যাবে (Cloud Function দিয়ে)

---
Made with 🔐 for secure, simple, backend-less cloud storage.
