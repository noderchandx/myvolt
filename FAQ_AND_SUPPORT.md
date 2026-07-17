# My Vault - FAQ এবং Support গাইড

এখানে সাধারণ প্রশ্ন এবং সমাধান পাবেন।

---

## ❓ Frequently Asked Questions

### সেটআপ সম্পর্কিত

#### Q1: Firebase project তৈরি করা কেন এত জটিল?
**উত্তর:** প্রথমবার জটিল মনে হলেও, একবার setup করলে সবকিছু automatic হয়ে যায়। Step by step DEPLOYMENT_GUIDE অনুসরণ করুন।

#### Q2: আমি কি কোনো Backend server ছাড়াই চালাতে পারি?
**উত্তর:** হ্যাঁ, সম্পূর্ণভাবে। Firebase সব কিছু handle করে। শুধু Frontend code আছে।

#### Q3: আমার নিজের domain ব্যবহার করতে পারি?
**উত্তর:** হ্যাঁ, DEPLOYMENT_GUIDE এ "Custom Domain" সেকশন দেখুন।

#### Q4: প্রতিটি Firebase project এর cost কত?
**উত্তর:** Firebase বিনামূল্যে, কিন্তু usage এর ভিত্তিতে charge হয়। Free tier এ প্রচুর quota আছে।

#### Q5: আমি কি Firebase ছাড়া অন্য কিছু ব্যবহার করতে পারি?
**উত্তর:** হ্যাঁ, কিন্তু code modify করতে হবে। Supabase, Appwrite বা অন্য কোনো backend ব্যবহার করতে পারেন।

---

### ফিচার সম্পর্কিত

#### Q6: Maximum file size কত?
**উত্তর:** একটি file maximum 100MB পর্যন্ত হতে পারে। Total storage ১GB (free tier)।

#### Q7: আমি কি folder তৈরি করতে পারি?
**উত্তর:** হ্যাঁ, "New Folder" option দিয়ে folder তৈরি করতে পারেন।

#### Q8: ফাইল শেয়ারিং কিভাবে কাজ করে?
**উত্তর:** 
1. File select করুন
2. "Share" বাটন ক্লিক করুন
3. Public link generate হবে
4. Link কাউকে পাঠান, তারা দেখতে পাবে

#### Q9: আমার ফাইল কি permanent delete হবে?
**উত্তর:** হ্যাঁ, delete করলে permanent চলে যাবে। Undo নেই।

#### Q10: একই সাথে কয়টি ফাইল upload করতে পারি?
**উত্তর:** একটি করে upload করতে হয়। Multiple files একসাথে select করতে পারেন, সবাই queue এ যাবে।

---

### Account সম্পর্কিত

#### Q11: আমার password ভুলে গেছি, কি করব?
**উত্তর:** Login page এ "Forgot Password" link আছে। সেখানে email দিন, reset link পাবেন।

#### Q12: আমার account delete করলে ডেটা কি চলে যাবে?
**উত্তর:** হ্যাঁ, account delete করলে সব files এবং ডেটা permanently delete হয়ে যাবে। সাবধান!

#### Q13: আমি কি একই email দিয়ে দুটি account তৈরি করতে পারি?
**উত্তর:** না, একটি email শুধুমাত্র একটি account এর জন্য।

#### Q14: আমার profile picture change করতে পারি?
**উত্তর:** হ্যাঁ, Profile page এ "Change Photo" ক্লিক করে নতুন photo upload করুন।

#### Q15: আমার password কিভাবে secure থাকে?
**উত্তর:** Password Firebase দিয়ে encrypted থাকে। আমরা কখনো plain password রাখি না।

---

### পেমেন্ট সম্পর্কিত

#### Q16: কি আমি বিনামূল্যে 1GB এর বেশি storage পেতে পারি?
**উত্তর:** হ্যাঁ, Premium plan এ upgrade করলে 100GB পর্যন্ত পাবেন।

#### Q17: কোন payment methods supported?
**উত্তর:** বর্তমানে bKash, Nagad এবং Google Pay supported.

#### Q18: রিফান্ড policy কি?
**উত্তর:** Payment এর ৭ দিনের মধ্যে refund request করা যায়।

#### Q19: আমার subscription কখন renew হবে?
**উত্তর:** Premium plan প্রতি মাসের একই তারিখে auto renew হয়।

#### Q20: আমি কি anytime cancel করতে পারি?
**উত্তর:** হ্যাঁ, যেকোনো সময় subscription cancel করা যায়।

---

### প্রযুক্তিগত সমস্যা

#### Q21: File upload সময় "Permission denied" error পাচ্ছি
**উত্তর:** এর অর্থ Firebase Security Rules ভুল। Troubleshooting guide এ solution দেখুন।

#### Q22: "Firebase is not defined" error পাচ্ছি
**উত্তর:** HTML এ Firebase script tags check করুন। Script order গুরুত্বপূর্ণ।

#### Q23: Page load হচ্ছে না, blank দেখাচ্ছে
**উত্তর:** 
1. Browser console খুলুন (F12)
2. Error message check করুন
3. Firebase config verify করুন

#### Q24: Dark mode toggle কাজ করছে না
**উত্তর:** Browser localStorage problem থাকতে পারে। Incognito mode এ চেষ্টা করুন।

#### Q25: Mobile এ responsive নয়
**উত্তর:** HTML তে meta viewport tag আছে। Cache clear করুন (Ctrl+Shift+Delete).

---

### নিরাপত্তা সম্পর্কিত

#### Q26: আমার files কি safe?
**উত্তর:** হ্যাঁ, সব files encrypted থাকে এবং শুধু আপনি access পেতে পারেন।

#### Q27: তৃতীয় পক্ষ কি আমার data access করতে পারে?
**উত্তর:** না, Firebase Security Rules এটি prevent করে।

#### Q28: আমার email কি বিক্রি করা হবে?
**উত্তর:** না, কখনো না। আমাদের Privacy Policy তে লেখা আছে।

#### Q29: আমি কি Two-Factor Authentication চালু করতে পারি?
**উত্তর:** আগামী version এ আসবে। এখন শুধু password login।

#### Q30: আমার IP address track করা হয়?
**উত্তর:** Google Analytics যা limited tracking করে। Personal data না।

---

## 🐛 Troubleshooting Guide

### সমস্যা 1: Registration সময় error

**Error Message**: "Cannot read property 'uid' of undefined"

**সমাধান**:
```javascript
// index.html এ Firebase config verify করুন
// সব API keys সঠিক কিনা চেক করুন
// Internet connection check করুন
// Firebase project actual activate আছে কিনা চেক করুন
```

**পদক্ষেপ**:
1. Browser console খুলুন (F12)
2. "Application" tab ক্লিক করুন
3. "Local Storage" check করুন
4. কি আপনার firebase config সেভ হয়েছে?

---

### সমস্যা 2: File upload fail হচ্ছে

**Error**: "Permission denied" বা "Storage limit exceeded"

**সমাধান**:

```javascript
// Storage.rules verify করুন:
match /files/{userId}/{allPaths=**} {
  allow write: if request.auth.uid == userId && 
                  request.resource.size <= 104857600;
}

// File size check করুন:
- Maximum 100MB per file
- Current storage 1GB limit

// Storage quota check করুন:
- Firebase Console > Storage > Usage
```

**পদক্ষেপ**:
1. File size কত? 100MB এর কম?
2. Current storage কত ব্যবহার করেছেন?
3. কি authentication working?

---

### সমস্যা 3: Login এ "CORS" error

**Error**: "CORS policy: Request from origin ... has been blocked"

**সমাধান**:

```
1. Firebase Console যান
2. Settings > Authorized domains
3. নিম্নলিখিত domains add করুন:
   - localhost:8000 (local testing)
   - localhost:3000
   - YOUR_USERNAME.github.io
   - your-custom-domain.com
```

---

### সমস্যা 4: Dashboard data load না হওয়া

**অনুসন্ধান প্রক্রিয়া**:

```javascript
// Browser console এ run করুন:

// 1. Check auth
firebase.auth().currentUser;
// Output: User object থাকা উচিত

// 2. Check Firestore access
firebase.firestore().collection('users').get();
// Output: Documents পাওয়া উচিত

// 3. Check permissions
// Firestore Rules:
match /users/{userId} {
  allow read, write: if request.auth.uid == userId;
}
```

**সাধারণ কারণ**:
- Firestore Rules ভুল
- Network issue
- User properly authenticated না হওয়া

---

### সমস্যা 5: GitHub Pages এ blank page

**কারণ**: index.html সঠিকভাবে serve না হওয়া

**সমাধান**:

```
1. GitHub Repository settings খুলুন
2. Pages section এ যান
3. Deploy from a branch: main
4. Folder: / (root)
5. Save করুন
6. 5-10 minutes অপেক্ষা করুন
7. Refresh করুন: Ctrl+Shift+Delete (cache clear)
```

**Verify**:
```
GitHub Actions > Deploy থেকে status চেক করুন
সবুজ checkmark থাকা উচিত
```

---

### সমস্যা 6: Images upload না হওয়া

**সাধারণ কারণ**:
1. Image format supported না (শুধু JPG, PNG, GIF, WebP)
2. Image size খুব বড় (profile: 5MB max)
3. MIME type issue

**সমাধান**:

```javascript
// Storage.rules check করুন:
match /profiles/{userId}/{allPaths=**} {
  allow write: if request.resource.contentType.matches('image/.*') &&
                  request.resource.size <= 5242880; // 5MB
}
```

**Fix**:
- Image compress করুন
- Format verify করুন (JPG/PNG)
- File size check করুন

---

### সমস্যা 7: Password reset link কাজ করছে না

**কারণ**: Email template বা SMTP configuration issue

**সমাধান**:

```
1. Firebase Console > Authentication
2. Templates tab যান
3. Password reset template check করুন
4. Custom domain set করা আছে কিনা check করুন
```

**বিকল্প**:
- প্রথমে password reset অপশন এখনো development এ আছে
- Account delete করে নতুন account তৈরি করুন

---

### সমস্যা 8: Files search কাজ করছে না

**সমাধান**:

```javascript
// index.html এ searchFiles function check করুন
// File list properly load হয়েছে কিনা verify করুন

app.filesList.length > 0 // true হওয়া উচিত
```

**Debug**:
```javascript
// Browser console এ:
app.filesList
// Array দেখা উচিত সব files সহ
```

---

### সমস্যা 9: Mobile এ layout broken

**কারণ**: CSS media queries সম্ভবত overridden হয়েছে

**সমাধান**:

```css
/* HTML head এ viewport meta tag check করুন: */
<meta name="viewport" content="width=device-width, initial-scale=1.0">

/* Mobile styles আছে কিনা check করুন: */
@media (max-width: 768px) {
  /* mobile styles */
}
```

**Fix**:
- Browser refresh করুন (Ctrl+Shift+R for hard refresh)
- Incognito mode এ চেষ্টা করুন
- Different browser এ চেষ্টা করুন

---

### সমস্যা 10: Dark mode না চলা

**সমাধান**:

```javascript
// localStorage check করুন:
localStorage.getItem('darkMode')
// 'true' বা 'false' পাওয়া উচিত

// CSS class check করুন:
document.body.classList.contains('dark-mode')
// true থাকা উচিত যখন dark mode on
```

**Fix**:
```javascript
// Browser console এ clear করুন:
localStorage.clear()
// Page refresh করুন
```

---

## 📞 সাপোর্ট পেতে

### আগে চেক করুন

```
✓ ইন্টারনেট connection আছে?
✓ Browser updated?
✓ Firefox/Chrome/Safari এ চেষ্টা করেছেন?
✓ Cache clear করেছেন?
✓ Firestore rules check করেছেন?
✓ Firebase config সঠিক?
✓ Console error message কি?
```

### তারপর যোগাযোগ করুন

1. **GitHub Issues**: Project এ issue report করুন
   - Screenshots attach করুন
   - Error message exact paste করুন
   - Steps to reproduce দিন

2. **Email Support**: support@myvault.com
   - Subject line clear লিখুন
   - Problem describe করুন
   - Browser/device specify করুন

3. **Stack Overflow**
   - firebase tag add করুন
   - Minimal code example দিন
   - Error message paste করুন

---

## 🔍 Debugging Tips

### Browser Console এ check করুন

```javascript
// 1. Firebase loaded?
typeof firebase !== 'undefined'

// 2. Auth state?
firebase.auth().currentUser

// 3. Firestore access?
firebase.firestore().collection('users').get()

// 4. Storage access?
firebase.storage().ref('test').listAll()

// 5. App state?
console.log(app.currentUser)
console.log(app.filesList)
```

### Network Tab check করুন (F12)

```
1. F12 খুলুন
2. Network tab যান
3. Page refresh করুন
4. Request গুলো check করুন:
   - JavaScript files load হয়েছে?
   - Firebase requests successful?
   - Any 403/404 errors?
```

### Performance চেক করুন

```javascript
// Console এ:
performance.getEntriesByType('navigation')[0].loadEventEnd -
performance.getEntriesByType('navigation')[0].loadEventStart
// milliseconds এ page load time
```

---

## 💡 Best Practices

### ব্যবহারকারী হিসেবে

```
✓ Strong password ব্যবহার করুন
✓ Regular backup নিন (export করুন)
✓ Public links carefully share করুন
✓ Suspicious emails এ click করবেন না
✓ Password কাউকে শেয়ার করবেন না
✓ বড় files compress করে আপলোড করুন
✓ Old files delete করুন space বাঁচাতে
```

### ডেভেলপার হিসেবে

```
✓ Firebase config secret রাখুন
✓ Security rules strictly implement করুন
✓ Regular security audit করুন
✓ Error logging implement করুন
✓ Performance monitoring করুন
✓ User feedback listen করুন
✓ Regular updates push করুন
```

---

## 📊 Performance Optimization

### Load time improve করতে

```javascript
// 1. Lazy load images
<img src="..." loading="lazy">

// 2. Compress files
// Before uploading

// 3. Use CDN
// Firebase Hosting use করুন

// 4. Minify code
// Production এ .min.js ব্যবহার করুন

// 5. Enable caching
// Service Worker implement করুন
```

---

## ✨ Success Stories

### Common Success Scenarios

```
✓ Personal cloud storage: কাজ করছে!
✓ Family photo backup: Perfect!
✓ Business document storage: Great!
✓ School project sharing: আচ্ছা!
✓ Portfolio showcase: Excellent!
```

---

**Last Updated**: January 2024  
**Version**: 1.0.0  
**Support Level**: Community & Email ✅
