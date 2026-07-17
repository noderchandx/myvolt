# My Vault - Cloud Storage Web App 🔐

একটি সম্পূর্ণ Cloud Storage Web Application যা Firebase দিয়ে তৈরি এবং GitHub Pages এ হোস্ট করা যায়।

## 🎯 প্রধান বৈশিষ্ট্য

- ✅ User Authentication (Email/Password + Google Login)
- ✅ Secure File Storage (1GB Free)
- ✅ File Management (Upload, Download, Delete, Rename)
- ✅ File Sharing (Generate Public Links)
- ✅ Folder Management
- ✅ User Profile Management
- ✅ Storage Usage Tracking
- ✅ Dark/Light Mode
- ✅ বাংলা ও ইংরেজি Language Support
- ✅ Mobile Responsive Design
- ✅ Password Reset
- ✅ Account Security

## 🚀 দ্রুত শুরু

### পূর্বশর্ত
- Firebase Account (বিনামূল্যে তৈরি করুন: https://firebase.google.com)
- GitHub Account (বিনামূল্যে: https://github.com)
- কোনো Backend Server প্রয়োজন নেই

### ধাপ ১: Firebase Project সেটআপ

1. **Firebase Console এ যান**: https://console.firebase.google.com/

2. **নতুন Project তৈরি করুন**:
   - "Add project" বাটন ক্লিক করুন
   - Project Name লিখুন (যেমন: "my-vault")
   - Google Analytics ডিজেবল করুন
   - "Create project" ক্লিক করুন

3. **Authentication Enable করুন**:
   ```
   - Left menu থেকে "Authentication" খুলুন
   - "Get started" বাটন ক্লিক করুন
   - "Email/Password" provider এ ক্লিক করুন
   - Enable করুন
   - "Google" provider add করুন এবং enable করুন
   ```

4. **Cloud Firestore Setup**:
   ```
   - Left menu থেকে "Firestore Database" খুলুন
   - "Create database" বাটন ক্লিক করুন
   - Start in production mode নির্বাচন করুন
   - Region: nearest to you
   ```

5. **Cloud Storage Setup**:
   ```
   - Left menu থেকে "Storage" খুলুন
   - "Get started" বাটন ক্লিক করুন
   - Start in production mode
   ```

6. **Firebase Config পান**:
   ```
   - Project settings এ যান (⚙️ icon)
   - "Your apps" সেকশনে যান
   - "</>" (web) আইকনে ক্লিক করুন
   - App nickname দিন এবং register করুন
   - Config copy করুন (firebaseConfig object)
   ```

### ধাপ ২: Security Rules সেটআপ

#### Firestore Security Rules:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Users collection
    match /users/{userId} {
      allow read, write: if request.auth.uid == userId;
    }

    // Files collection
    match /files/{fileId} {
      allow read, write: if request.auth.uid == resource.data.userId;
      allow read: if resource.data.shared == true;
    }

    // Shared files (public access)
    match /shared/{fileId} {
      allow read: if true;
    }
  }
}
```

#### Storage Security Rules:

```
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    // User files
    match /files/{userId}/{allPaths=**} {
      allow read, write: if request.auth.uid == userId;
    }

    // Profile images
    match /profiles/{userId}/{allPaths=**} {
      allow read, write: if request.auth.uid == userId;
    }

    // Public shared files
    match /shared/{allPaths=**} {
      allow read: if true;
    }
  }
}
```

### ধাপ ৩: index.html এ Firebase Config যোগ করুন

`index.html` ফাইলে নিম্নলিখিত লাইন খুঁজুন:

```javascript
const firebaseConfig = {
    apiKey: "YOUR_API_KEY",
    authDomain: "your-project.firebaseapp.com",
    projectId: "your-project-id",
    storageBucket: "your-project.appspot.com",
    messagingSenderId: "YOUR_SENDER_ID",
    appId: "YOUR_APP_ID"
};
```

আপনার Firebase config দিয়ে প্রতিস্থাপন করুন।

### ধাপ ৪: GitHub এ Deploy করুন

#### বিকল্প A: GitHub Pages (সহজ)

1. **GitHub এ Repository তৈরি করুন**:
   - Repository name: `my-vault` (বা কোনো নাম)
   - Public repository বেছে নিন
   - `.gitignore` add করবেন না

2. **লোকাল Machine এ clone করুন**:
   ```bash
   git clone https://github.com/YOUR_USERNAME/my-vault.git
   cd my-vault
   ```

3. **index.html upload করুন**:
   - `index.html` ফাইল repository এ রাখুন
   - সব CSS এবং JavaScript একই ফাইলে আছে

4. **Push করুন GitHub এ**:
   ```bash
   git add .
   git commit -m "Initial commit"
   git push origin main
   ```

5. **GitHub Pages Enable করুন**:
   - Repository Settings এ যান
   - "Pages" সেকশনে যান
   - Source: "Deploy from a branch"
   - Branch: `main`, folder: `/ (root)`
   - Save করুন

6. **আপনার সাইট লাইভ**:
   ```
   https://YOUR_USERNAME.github.io/my-vault/
   ```

#### বিকল্প B: Custom Domain এ Host করুন

```bash
# Build করুন (যদি প্রয়োজন হয়)
# এই প্রকল্পের জন্য কোনো build প্রয়োজন নেই

# Local testing এ যান
python -m http.server 8000
# Visit: http://localhost:8000/index.html
```

### ধাপ ৫: Testing

1. **Local এ Test করুন**:
   ```bash
   # Python 3
   python -m http.server 8000
   
   # OR Python 2
   python -m SimpleHTTPServer 8000
   ```
   - Browser এ: `http://localhost:8000`

2. **Sign Up করুন**:
   - নাম, ইমেইল, ফোন, পাসওয়ার্ড দিয়ে রেজিস্টার করুন
   - Profile picture select করুন

3. **Files Upload করুন**:
   - ইমেজ, PDF, Word ডক upload করুন
   - Storage usage track করুন

4. **Features Test করুন**:
   - File download
   - File delete
   - File sharing
   - Profile update
   - Password change

## 📁 ফাইল স্ট্রাকচার

```
my-vault/
├── index.html          # সব কিছু এক ফাইলে
├── README.md          # এই documentation
└── .gitignore         # Git ignore rules
```

## 🛠️ কাস্টমাইজেশন

### Storage Limit পরিবর্তন করুন

`index.html` এ এই লাইন খুঁজুন:

```javascript
maxStorage: 1000 * 1024 * 1024, // 1GB in bytes
```

পরিবর্তন করুন:

```javascript
maxStorage: 5000 * 1024 * 1024, // 5GB এর জন্য
```

### রঙ পরিবর্তন করুন

CSS variables modify করুন:

```css
:root {
    --primary: #4F46E5;      /* নীল */
    --secondary: #7C3AED;    /* বেগুনী */
    --success: #10B981;      /* সবুজ */
    --danger: #EF4444;       /* লাল */
}
```

### ভাষা যোগ করুন

`translations` object এ নতুন ভাষা যোগ করুন:

```javascript
translations.es = {
    heroTitle: "Almacenamiento en la nube seguro",
    // ... more translations
};
```

## 🔒 নিরাপত্তা বিষয়

### সর্বোত্তম অনুশীলন

1. **Never commit Firebase keys** - `.gitignore` এ রাখুন
2. **Security Rules**: সবসময় production এ স্ট্রিক্ট rules ব্যবহার করুন
3. **SSL/HTTPS**: GitHub Pages স্বয়ংক্রিয়ভাবে HTTPS enable করে
4. **Rate Limiting**: Firebase authentication limits enforce করে
5. **File Validation**: Server-side এবং client-side validation

### Privacy Policy

আপনার Privacy Policy তে নিম্নলিখিত যোগ করুন:

```
- আমরা শুধুমাত্র encrypted files store করি
- User data শেয়ার করি না
- Firebase authentication ব্যবহার করি
- 30 দিন inactive data delete করি (optional)
```

## 📊 Database Schema

### Users Collection

```json
{
  "uid": "user_id",
  "name": "User Name",
  "email": "user@email.com",
  "phone": "+880123456789",
  "profileImage": "https://...",
  "storageUsed": 5242880,
  "createdAt": "2024-01-01T00:00:00Z",
  "isActive": true
}
```

### Files Collection

```json
{
  "userId": "user_id",
  "name": "document.pdf",
  "type": "application/pdf",
  "size": 1048576,
  "url": "https://...",
  "uploadedAt": "2024-01-01T00:00:00Z",
  "shared": false,
  "shareLink": "https://..."
}
```

## 🐛 Troubleshooting

### Firebase Config Error
```
Error: Firebase configuration missing or invalid
```
**সমাধান**: `index.html` এ Firebase config সঠিকভাবে যোগ করেছেন কিনা চেক করুন।

### Storage Access Denied
```
Error: Permission denied for user
```
**সমাধান**: Firestore এবং Storage Security Rules সঠিক কিনা চেক করুন।

### Files Not Loading
```
Error: Failed to load files
```
**সমাধান**: 
- Firestore database rules check করুন
- User properly authenticated কিনা check করুন
- Browser console এ error see করুন

### CORS Error
```
Error: CORS policy
```
**সমাধান**: 
- Firebase project settings এ CORS configuration check করুন
- Custom domain ব্যবহার করলে Firebase settings update করুন

## 📈 Performance Tips

1. **Image Optimization**: আপলোড করার আগে images compress করুন
2. **File Size Limit**: প্রতিটি ফাইল ১০০MB এর নিচে রাখুন
3. **Lazy Loading**: বড় file lists এ pagination ব্যবহার করুন
4. **Cache**: Browser cache enable করুন

## 🚀 Future Improvements

### Short Term
- [ ] Folder management implementation
- [ ] File versioning
- [ ] File collaboration
- [ ] Email notifications
- [ ] API integration

### Medium Term
- [ ] Mobile app (React Native)
- [ ] Desktop app (Electron)
- [ ] Payment system integration
- [ ] Advanced sharing (permissions)
- [ ] File encryption

### Long Term
- [ ] Referral system
- [ ] Admin dashboard
- [ ] Analytics
- [ ] Backup features
- [ ] Integration with cloud services

## 💰 Monetization Options

### বিনামূল্যে Tier
- 1GB storage
- Basic file sharing
- Email/Password login

### প্রিমিয়াম Tier
- 100GB storage
- Advanced sharing
- Priority support
- File versioning

### Implementation
```javascript
// bKash/Nagad payment integration example
const paymentConfig = {
    apiKey: "YOUR_BKASH_KEY",
    amount: 500, // BDT
    plan: "premium_monthly"
};
```

## 📞 Support & Contact

- 📧 Email: support@myvault.com
- 🐛 Issues: Report on GitHub
- 💬 Feedback: Use contact form
- 📚 Docs: https://myvault.com/docs

## 📄 License

MIT License - বাণিজ্যিক এবং ব্যক্তিগত ব্যবহারের জন্য বিনামূল্যে

## 🙏 Acknowledgments

- Firebase for backend services
- GitHub Pages for hosting
- Font Awesome for icons
- Contributors and testers

---

**আমাদের সাথে যুক্ত থাকুন এবং My Vault কে আরও ভালো করতে সাহায্য করুন!** 

---

### Quick Links

- 🔗 [Firebase Console](https://console.firebase.google.com)
- 🔗 [GitHub Pages Docs](https://pages.github.com)
- 🔗 [Firebase Security Rules](https://firebase.google.com/docs/rules)
- 🔗 [Web Security Guide](https://owasp.org/www-community/)

## Version

**v1.0.0** - Initial Release (2024)

---

**Last Updated**: January 2024  
**Maintained By**: My Vault Team  
**Status**: ✅ Production Ready
