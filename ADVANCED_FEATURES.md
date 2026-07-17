# My Vault - Advanced Features এবং Extension Guide

এই গাইডটি আপনাকে My Vault এ advanced features যোগ করতে সাহায্য করবে।

---

## 📊 Admin Dashboard Implementation

### Admin Dashboard এর বৈশিষ্ট্য

```javascript
Admin Features:
✓ Total Users count
✓ Total Storage used
✓ Total Files count
✓ User management (block/active)
✓ File monitoring
✓ System statistics
✓ Revenue tracking (যদি paid features থাকে)
✓ User reports
✓ System settings
```

### Admin Panel HTML (index.html এ যোগ করুন)

```html
<!-- Admin Panel -->
<section class="admin-panel" id="adminPanel">
    <div class="container">
        <h1 id="adminTitle">Admin Dashboard</h1>

        <div class="admin-grid">
            <!-- Statistics -->
            <div class="stat-card">
                <div class="stat-label">Total Users</div>
                <div class="stat-value" id="adminTotalUsers">0</div>
            </div>

            <div class="stat-card">
                <div class="stat-label">Total Files</div>
                <div class="stat-value" id="adminTotalFiles">0</div>
            </div>

            <div class="stat-card">
                <div class="stat-label">Total Storage Used</div>
                <div class="stat-value" id="adminTotalStorage">0 GB</div>
            </div>

            <div class="stat-card">
                <div class="stat-label">Active Users</div>
                <div class="stat-value" id="adminActiveUsers">0</div>
            </div>
        </div>

        <!-- Users Management -->
        <div class="card" style="margin-top: 30px;">
            <h2>User Management</h2>
            <div class="table-responsive">
                <table id="usersTable">
                    <thead>
                        <tr>
                            <th>Name</th>
                            <th>Email</th>
                            <th>Storage Used</th>
                            <th>Files</th>
                            <th>Joined</th>
                            <th>Status</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody id="usersTableBody">
                    </tbody>
                </table>
            </div>
        </div>

        <!-- System Settings -->
        <div class="card" style="margin-top: 30px;">
            <h2>System Settings</h2>
            <div class="input-group">
                <label>Default Storage Limit (GB)</label>
                <input type="number" id="defaultStorageLimit" value="1" min="1" max="100">
            </div>
            <div class="input-group">
                <label>Max File Size (MB)</label>
                <input type="number" id="maxFileSize" value="100" min="1" max="1000">
            </div>
            <button class="btn btn-primary" onclick="app.saveAdminSettings()">Save Settings</button>
        </div>
    </div>
</section>
```

### Admin Panel CSS (style tag এ যোগ করুন)

```css
/* Admin Panel */
.admin-panel {
    display: none;
    padding: 30px 20px;
}

.admin-panel.active {
    display: block;
}

.admin-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    gap: 20px;
    margin-bottom: 30px;
}
```

### Admin Panel JavaScript

```javascript
// Add এই functions app object এ:

checkAdminAccess() {
    if (!this.currentUser) {
        this.showLanding();
        return false;
    }
    
    db.collection('users').doc(this.currentUser.uid).get()
        .then(doc => {
            if (doc.data().isAdmin) {
                this.loadAdminPanel();
            } else {
                this.showNotification('Admin access required', 'error');
                this.showDashboard();
            }
        });
},

async loadAdminPanel() {
    try {
        // Load all users
        const usersSnapshot = await db.collection('users').get();
        const filesSnapshot = await db.collection('files').get();
        
        let totalStorage = 0;
        let totalFiles = 0;
        let activeUsers = 0;

        // Process users data
        let usersHtml = '';
        usersSnapshot.forEach(doc => {
            const user = doc.data();
            totalStorage += user.storageUsed;
            activeUsers += user.isActive ? 1 : 0;

            usersHtml += `
                <tr>
                    <td>${user.name}</td>
                    <td>${user.email}</td>
                    <td>${(user.storageUsed / (1024*1024*1024)).toFixed(2)} GB</td>
                    <td id="fileCount-${doc.id}">0</td>
                    <td>${new Date(user.createdAt.toDate()).toLocaleDateString()}</td>
                    <td>
                        <span class="status ${user.isActive ? 'active' : 'inactive'}">
                            ${user.isActive ? 'Active' : 'Inactive'}
                        </span>
                    </td>
                    <td>
                        <button class="btn btn-small" onclick="app.toggleUserStatus('${doc.id}')">
                            ${user.isActive ? 'Block' : 'Activate'}
                        </button>
                    </td>
                </tr>
            `;
        });

        // Update statistics
        document.getElementById('adminTotalUsers').textContent = usersSnapshot.size;
        document.getElementById('adminTotalFiles').textContent = filesSnapshot.size;
        document.getElementById('adminTotalStorage').textContent = 
            (totalStorage / (1024*1024*1024)).toFixed(2) + ' GB';
        document.getElementById('adminActiveUsers').textContent = activeUsers;
        
        // Update table
        document.getElementById('usersTableBody').innerHTML = usersHtml;

        // Count files per user
        filesSnapshot.forEach(doc => {
            const file = doc.data();
            const fileCountEl = document.getElementById(`fileCount-${file.userId}`);
            if (fileCountEl) {
                fileCountEl.textContent = parseInt(fileCountEl.textContent) + 1;
            }
        });

    } catch (error) {
        console.error('Error loading admin panel:', error);
    }
},

async toggleUserStatus(userId) {
    try {
        const userDoc = await db.collection('users').doc(userId).get();
        const currentStatus = userDoc.data().isActive;
        
        await db.collection('users').doc(userId).update({
            isActive: !currentStatus
        });
        
        this.showNotification(
            `User ${currentStatus ? 'blocked' : 'activated'} successfully`,
            'success'
        );
        this.loadAdminPanel();
    } catch (error) {
        this.showNotification('Error updating user status', 'error');
    }
},

async saveAdminSettings() {
    const settings = {
        defaultStorageLimit: parseInt(document.getElementById('defaultStorageLimit').value) * 1024 * 1024 * 1024,
        maxFileSize: parseInt(document.getElementById('maxFileSize').value) * 1024 * 1024,
        updatedAt: new Date()
    };
    
    try {
        await db.collection('settings').doc('global').set(settings, { merge: true });
        this.showNotification('Settings saved successfully', 'success');
    } catch (error) {
        this.showNotification('Error saving settings', 'error');
    }
}
```

---

## 💳 Payment Integration (bKash/Nagad)

### bKash Payment Integration

```javascript
// bKash Configuration
const bKashConfig = {
    bkashURL: 'https://checkout.bkash.com', // Production URL
    // bkashURL: 'https://checkout.sandbox.bkash.com', // Sandbox for testing
    apiKey: 'YOUR_BKASH_API_KEY',
    appKey: 'YOUR_BKASH_APP_KEY',
    username: 'YOUR_BKASH_USERNAME',
    password: 'YOUR_BKASH_PASSWORD'
};

// Payment plans
const paymentPlans = [
    {
        name: 'Free',
        storage: 1, // GB
        price: 0,
        features: ['Basic file storage', 'Email support']
    },
    {
        name: 'Pro',
        storage: 100,
        price: 499, // BDT
        features: ['100GB storage', 'Priority support', 'Advanced sharing']
    },
    {
        name: 'Premium',
        storage: 500,
        price: 999,
        features: ['500GB storage', '24/7 support', 'File versioning', 'Collaboration tools']
    }
];

// Payment Handler
async function initiateBKashPayment(planId) {
    const plan = paymentPlans[planId];
    
    if (plan.price === 0) {
        app.showNotification('Already using free plan', 'info');
        return;
    }

    const paymentData = {
        amount: plan.price,
        userId: app.currentUser.uid,
        planId: planId,
        planName: plan.name,
        storage: plan.storage * 1024 * 1024 * 1024,
        timestamp: new Date()
    };

    try {
        // Save pending payment in Firestore
        const paymentDoc = await db.collection('payments').add(paymentData);
        
        // Call bKash API
        const response = await fetch(`${bKashConfig.bkashURL}/payment/create`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': bKashConfig.apiKey
            },
            body: JSON.stringify({
                amount: plan.price,
                currency: 'BDT',
                intent: 'sale',
                merchantInvoiceNumber: paymentDoc.id,
                payerReference: app.currentUser.uid,
                callbackURL: `${window.location.origin}/callback?paymentId=${paymentDoc.id}`
            })
        });

        const data = await response.json();
        
        if (data.statusCode === '0000') {
            // Redirect to bKash payment page
            window.location.href = data.bkashURL;
        } else {
            app.showNotification('Payment initiation failed', 'error');
        }
    } catch (error) {
        console.error('Payment error:', error);
        app.showNotification('Error initiating payment', 'error');
    }
}

// Payment Verification (callback handler)
async function verifyPayment(paymentId) {
    try {
        const paymentDoc = await db.collection('payments').doc(paymentId).get();
        const payment = paymentDoc.data();
        
        // Verify with bKash
        const response = await fetch(`${bKashConfig.bkashURL}/payment/query`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': bKashConfig.apiKey
            },
            body: JSON.stringify({
                paymentId: paymentId
            })
        });

        const data = await response.json();
        
        if (data.transactionStatus === 'Completed') {
            // Update user's storage plan
            await db.collection('users').doc(payment.userId).update({
                maxStorage: payment.storage,
                plan: payment.planName,
                paidUntil: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) // 30 days
            });

            // Save successful payment
            await db.collection('payments').doc(paymentId).update({
                status: 'completed',
                completedAt: new Date()
            });

            app.showNotification('Payment successful! Plan upgraded.', 'success');
        } else {
            app.showNotification('Payment failed', 'error');
        }
    } catch (error) {
        console.error('Verification error:', error);
        app.showNotification('Error verifying payment', 'error');
    }
}
```

### Nagad Payment Integration

```javascript
// Nagad Configuration
const nagadConfig = {
    nagadURL: 'https://api.nagad.com.bd',
    merchantId: 'YOUR_NAGAD_MERCHANT_ID',
    merchantKey: 'YOUR_NAGAD_MERCHANT_KEY',
    publicKey: 'YOUR_NAGAD_PUBLIC_KEY'
};

async function initiateNagadPayment(planId) {
    const plan = paymentPlans[planId];
    
    const paymentData = {
        orderId: `ORDER_${app.currentUser.uid}_${Date.now()}`,
        amount: plan.price * 100, // Nagad expects amount in paise
        userId: app.currentUser.uid,
        planId: planId,
        planName: plan.name
    };

    try {
        const response = await fetch(`${nagadConfig.nagadURL}/api/v1/merchant/initiate`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-Merchant-Key': nagadConfig.merchantKey
            },
            body: JSON.stringify({
                merchant_id: nagadConfig.merchantId,
                order_id: paymentData.orderId,
                amount: paymentData.amount,
                callback_url: `${window.location.origin}/nagad-callback`,
                customer_mobile: app.currentUser.phone || ''
            })
        });

        const data = await response.json();
        
        if (data.status === 'success') {
            // Save payment request
            await db.collection('payments').add({
                ...paymentData,
                provider: 'nagad',
                redirectUrl: data.payment_url,
                createdAt: new Date()
            });

            // Redirect to Nagad
            window.location.href = data.payment_url;
        }
    } catch (error) {
        app.showNotification('Error initiating Nagad payment', 'error');
    }
}
```

---

## 📱 Mobile App Development (React Native)

### React Native Setup

```bash
# Install React Native CLI
npm install -g expo-cli

# Create new project
expo init MyVault
cd MyVault

# Install Firebase
npm install @react-native-firebase/app
npm install @react-native-firebase/auth
npm install @react-native-firebase/firestore
npm install @react-native-firebase/storage
```

### Basic App Structure (App.js)

```javascript
import React, { useState, useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import auth from '@react-native-firebase/auth';

const Stack = createNativeStackNavigator();

export default function App() {
    const [user, setUser] = useState(null);
    const [initializing, setInitializing] = useState(true);

    useEffect(() => {
        const subscriber = auth().onAuthStateChanged(setUser);
        setInitializing(false);
        return subscriber;
    }, []);

    if (initializing) return null;

    return (
        <NavigationContainer>
            <Stack.Navigator>
                {user ? (
                    <>
                        <Stack.Screen 
                            name="Dashboard" 
                            component={DashboardScreen} 
                        />
                        <Stack.Screen 
                            name="FileManager" 
                            component={FileManagerScreen} 
                        />
                        <Stack.Screen 
                            name="Profile" 
                            component={ProfileScreen} 
                        />
                    </>
                ) : (
                    <>
                        <Stack.Screen 
                            name="Login" 
                            component={LoginScreen} 
                        />
                        <Stack.Screen 
                            name="Register" 
                            component={RegisterScreen} 
                        />
                    </>
                )}
            </Stack.Navigator>
        </NavigationContainer>
    );
}
```

---

## 🔄 Referral System

### Referral Program Structure

```javascript
const referralConfig = {
    storageReward: 100 * 1024 * 1024, // 100MB per referral
    maxReferrals: 20,
    maxExtraStorage: 2 * 1024 * 1024 * 1024 // 2GB max
};

// Generate Referral Link
function generateReferralLink() {
    const referralCode = `${app.currentUser.uid.substring(0, 8)}_${Date.now()}`;
    const referralLink = `${window.location.origin}?ref=${referralCode}`;
    
    db.collection('referrals').add({
        referrerId: app.currentUser.uid,
        code: referralCode,
        link: referralLink,
        createdAt: new Date(),
        count: 0
    });
    
    return referralLink;
}

// Track Referral
async function trackReferral(referralCode) {
    const refDoc = await db.collection('referrals')
        .where('code', '==', referralCode)
        .limit(1)
        .get();

    if (refDoc.empty) return;

    const referrerId = refDoc.docs[0].data().referrerId;
    
    // Give reward to referrer
    const referrerDoc = await db.collection('users').doc(referrerId).get();
    const currentBonus = referrerDoc.data().bonusStorage || 0;
    
    await db.collection('users').doc(referrerId).update({
        bonusStorage: Math.min(
            currentBonus + referralConfig.storageReward,
            referralConfig.maxExtraStorage
        )
    });

    // Update referral count
    await refDoc.docs[0].ref.update({
        count: firebase.firestore.FieldValue.increment(1)
    });
}
```

---

## 🤖 Automated Features

### Auto Cleanup Inactive Files

```javascript
// Cloud Function (Firebase)
const functions = require('firebase-functions');
const admin = require('firebase-admin');

exports.cleanupInactiveFiles = functions.pubsub
    .schedule('every day 02:00')
    .timeZone('Asia/Dhaka')
    .onRun(async (context) => {
        const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
        
        const snapshot = await admin.firestore()
            .collection('files')
            .where('uploadedAt', '<', thirtyDaysAgo)
            .where('permanent', '==', false)
            .get();

        const batch = admin.firestore().batch();
        
        snapshot.forEach(doc => {
            batch.delete(doc.ref);
        });

        return batch.commit();
    });
```

### Send Email Notifications

```javascript
// Email notification service
const nodemailer = require('nodemailer');

async function sendNotification(email, type, data) {
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASSWORD
        }
    });

    const templates = {
        welcome: {
            subject: 'Welcome to My Vault!',
            template: 'Welcome to My Vault. You have 1GB free storage.'
        },
        storageWarning: {
            subject: 'Storage Almost Full',
            template: `Your storage is ${data.percent}% full. Upgrade to get more space.`
        },
        fileShared: {
            subject: 'File Shared with You',
            template: `${data.userName} shared ${data.fileName} with you.`
        }
    };

    const template = templates[type];
    
    return transporter.sendMail({
        from: process.env.EMAIL_USER,
        to: email,
        subject: template.subject,
        html: template.template
    });
}
```

---

## 📊 Analytics Integration

### Google Analytics Setup

```javascript
// Add in HTML head:
<script async src="https://www.googletagmanager.com/gtag/js?id=GA_ID"></script>
<script>
    window.dataLayer = window.dataLayer || [];
    function gtag(){dataLayer.push(arguments);}
    gtag('js', new Date());
    gtag('config', 'GA_ID');
</script>

// Track events
function trackEvent(eventName, eventData) {
    gtag('event', eventName, eventData);
}

// Usage
trackEvent('file_upload', { fileName: 'document.pdf', size: 1024 });
trackEvent('user_signup', { plan: 'free' });
```

---

## 🔐 Two-Factor Authentication

```javascript
// Enable 2FA
async function enable2FA() {
    const qrCode = speakeasy.totp.qrcode({
        secret: speakeasy.generateSecret().base32,
        issuer: 'My Vault',
        label: app.currentUser.email
    });

    return qrCode;
}

// Verify 2FA
async function verify2FA(token, secret) {
    const verified = speakeasy.totp.verify({
        secret: secret,
        encoding: 'base32',
        token: token,
        window: 2
    });

    return verified;
}
```

---

## 🎯 Feature Roadmap

### Q1 2024
- [ ] Admin dashboard
- [ ] Payment integration
- [ ] Referral system
- [ ] Email notifications

### Q2 2024
- [ ] Mobile app (iOS)
- [ ] Mobile app (Android)
- [ ] Two-factor authentication
- [ ] File versioning

### Q3 2024
- [ ] Collaboration features
- [ ] Advanced sharing
- [ ] File encryption
- [ ] API for developers

### Q4 2024
- [ ] Desktop app (Windows/Mac)
- [ ] Machine learning features
- [ ] Advanced analytics
- [ ] Enterprise features

---

## 💡 Best Practices

### Security
```
✓ Never store API keys in code
✓ Use environment variables
✓ Implement rate limiting
✓ Use HTTPS everywhere
✓ Validate all inputs
✓ Sanitize outputs
✓ Regular security audits
```

### Performance
```
✓ Lazy load images
✓ Compress files
✓ Use CDN for assets
✓ Optimize database queries
✓ Implement caching
✓ Monitor performance
```

### Scalability
```
✓ Use Firebase auto-scaling
✓ Implement pagination
✓ Use indexes in Firestore
✓ Archive old data
✓ Monitor quota usage
✓ Plan capacity
```

---

## 📚 Resources

- Firebase Documentation: https://firebase.google.com/docs
- React Native: https://reactnative.dev
- bKash API: https://developer.bkash.com
- Nagad API: https://developer.nagad.com.bd
- Web Security: https://owasp.org

---

**Version**: 1.0.0  
**Last Updated**: January 2024  
**Status**: In Development ✨
