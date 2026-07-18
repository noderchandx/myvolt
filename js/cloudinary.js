/* =========================================================
   Cloudinary আপলোড হেল্পার
   ---------------------------------------------------------
   ব্রাউজার থেকে সরাসরি (কোনো ব্যাকএন্ড ছাড়াই) Cloudinary-তে
   ফাইল আপলোড করার জন্য "unsigned upload" ব্যবহার করা হয়েছে।
   XMLHttpRequest ব্যবহার করা হয়েছে যাতে আপলোড প্রোগ্রেস % দেখানো যায়।

   সীমাবদ্ধতা: unsigned আপলোডে ফাইল ডিলিট করা সম্ভব না (তার জন্য
   API Secret লাগে, যা ব্রাউজারে রাখা নিরাপদ না)। তাই "ডিলিট" করলে
   শুধু আমাদের Firestore রেকর্ড মুছে ফেলা হয় (অ্যাপ থেকে ফাইলটি
   সরে যায়) — Cloudinary-এর নিজস্ব স্টোরেজ থেকে পুরোপুরি মুছতে
   ভবিষ্যতে একটি ছোট সার্ভারলেস ফাংশন (Cloud Function) লাগবে।
   ========================================================= */

/**
 * ফাইল Cloudinary-তে আপলোড করে
 * @param {File} file - আপলোড করার ফাইল
 * @param {Function} onProgress - progress callback (0-100)
 * @returns {Promise<{url:string, publicId:string, bytes:number, format:string}>}
 */
function uploadToCloudinary(file, onProgress){
  return new Promise((resolve, reject)=>{
    if(CLOUDINARY_CONFIG.CLOUD_NAME === "YOUR_CLOUD_NAME"){
      reject(new Error(getLang()==="bn"
        ? "Cloudinary কনফিগার করা হয়নি। js/firebase-config.js ফাইলে CLOUD_NAME বসান।"
        : "Cloudinary is not configured. Set CLOUD_NAME in js/firebase-config.js"));
      return;
    }

    const url = `https://api.cloudinary.com/v1_1/${CLOUDINARY_CONFIG.CLOUD_NAME}/auto/upload`;
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", CLOUDINARY_CONFIG.UPLOAD_PRESET);
    // ফোল্ডার আলাদা রাখা যাতে Cloudinary ড্যাশবোর্ডেও গোছানো থাকে
    formData.append("folder", "myvault_uploads");

    const xhr = new XMLHttpRequest();
    xhr.open("POST", url, true);

    xhr.upload.onprogress = (e)=>{
      if(e.lengthComputable && onProgress){
        onProgress(Math.round((e.loaded / e.total) * 100));
      }
    };

    xhr.onload = ()=>{
      try{
        const res = JSON.parse(xhr.responseText);
        if(xhr.status >= 200 && xhr.status < 300){
          resolve({
            url: res.secure_url,
            publicId: res.public_id,
            bytes: res.bytes,
            format: res.format || "",
            resourceType: res.resource_type
          });
        } else {
          reject(new Error(res.error?.message || "Upload failed"));
        }
      } catch(err){
        reject(err);
      }
    };

    xhr.onerror = ()=> reject(new Error(getLang()==="bn" ? "নেটওয়ার্ক সমস্যা, আবার চেষ্টা করুন।" : "Network error, please try again."));
    xhr.send(formData);
  });
}
