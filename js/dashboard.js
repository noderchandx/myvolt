import { db, storage, auth } from './app.js';
import { ref, uploadBytesResumable, getDownloadURL, deleteObject } from "https://www.gstatic.com/firebasejs/10.0.0/firebase-storage.js";
import { collection, addDoc, doc, updateDoc, getDoc, query, where, getDocs } from "https://www.gstatic.com/firebasejs/10.0.0/firebase-firestore.js";

const STORAGE_LIMIT = 1 * 1024 * 1024 * 1024; // 1 GB in Bytes

// ফাইল আপলোড ফাংশন
async function uploadFile(file, currentFolderId = "root") {
    const user = auth.currentUser;
    if (!user) return alert("অনুগ্রহ করে লগইন করুন");

    // ১. ইউজারের বর্তমান স্টোরেজ ব্যবহার চেক করা
    const userRef = doc(db, "users", user.uid);
    const userSnap = await getDoc(userRef);
    const currentStorageUsed = userSnap.data().storageUsed || 0;

    if (currentStorageUsed + file.size > STORAGE_LIMIT) {
        alert("আপনার ১জিবি স্টোরেজ লিমিট শেষ! দয়া করে কিছু ফাইল ডিলিট করুন।");
        return;
    }

    // ২. ফায়ারবেস স্টোরেজে ফাইল আপলোড
    const storageRef = ref(storage, `users/${user.uid}/${Date.now()}_${file.name}`);
    const uploadTask = uploadBytesResumable(storageRef, file);

    uploadTask.on('state_changed', 
        (snapshot) => {
            // প্রোগ্রেস বার আপডেট করার লজিক
            const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
            document.getElementById('upload-progress').style.width = progress + '%';
        }, 
        (error) => { console.error("Upload failed:", error); }, 
        async () => {
            const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
            
            // ৩. ফায়ারস্টোরে ফাইলের মেটাডেটা সেভ করা
            await addDoc(collection(db, "files"), {
                userId: user.uid,
                fileName: file.name,
                fileType: file.type,
                fileSize: file.size,
                fileURL: downloadURL,
                folderId: currentFolderId, // ফোল্ডার সিস্টেমের জন্য
                uploadDate: new Date().toISOString()
            });

            // ৪. ইউজারের মোট স্টোরেজ সাইজ আপডেট করা
            await updateDoc(userRef, {
                storageUsed: currentStorageUsed + file.size
            });

            alert("ফাইল সফলভাবে আপলোড হয়েছে!");
            loadDashboardData(); // ড্যাশবোর্ড রিফ্রেশ
        }
    );
}

// ফাইল শেয়ারিং লিঙ্ক তৈরি (Public Link)
function generateShareLink(fileURL) {
    // shared.html পেজে ফাইলের URL প্যারামিটার হিসেবে পাস করা
    const shareableLink = `${window.location.origin}/shared.html?file=${encodeURIComponent(fileURL)}`;
    navigator.clipboard.writeText(shareableLink);
    alert("শেয়ার লিঙ্ক কপি করা হয়েছে!");
}
