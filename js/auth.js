/* =========================================================
   Authentication লজিক — register.html ও login.html এ ব্যবহৃত
   ========================================================= */

const googleProvider = new firebase.auth.GoogleAuthProvider();

function showMsg(text, type = "info"){
  const box = document.getElementById("msgBox");
  if(!box) return;
  box.textContent = text;
  box.className = `msg show msg-${type}`;
}

// লগইন করা থাকলে সরাসরি ড্যাশবোর্ডে পাঠানো (register/login পেজে)
auth.onAuthStateChanged(user=>{
  if(user && (location.pathname.endsWith("login.html") || location.pathname.endsWith("register.html"))){
    window.location.href = "dashboard.html";
  }
});

/* ---------- ইউজারের Firestore ডকুমেন্ট তৈরি (প্রথমবার সাইনআপে) ---------- */
async function createUserDoc(user, extra = {}){
  const ref = db.collection("users").doc(user.uid);
  const snap = await ref.get();
  if(!snap.exists){
    await ref.set({
      uid: user.uid,
      name: extra.name || user.displayName || "User",
      email: user.email || "",
      mobile: extra.mobile || "",
      photoURL: extra.photoURL || user.photoURL || defaultAvatar(extra.name || user.displayName),
      storageUsed: 0,
      storageLimit: APP_CONFIG.FREE_STORAGE_LIMIT_BYTES,
      status: "active", // active | blocked — অ্যাডমিন প্যানেল থেকে নিয়ন্ত্রিত
      isAdmin: isAdminEmail(user.email || ""),
      createdAt: firebase.firestore.FieldValue.serverTimestamp()
    });
  }
}

/* ========================================================
   REGISTER PAGE
   ======================================================== */
const registerForm = document.getElementById("registerForm");
if(registerForm){
  let selectedFile = null;
  const avatarPreview = document.getElementById("avatarPreview");
  avatarPreview.src = defaultAvatar("U");

  document.getElementById("photoInput").addEventListener("change", (e)=>{
    const file = e.target.files[0];
    if(file){
      selectedFile = file;
      avatarPreview.src = URL.createObjectURL(file);
    }
  });

  registerForm.addEventListener("submit", async (e)=>{
    e.preventDefault();
    const name = document.getElementById("regName").value.trim();
    const mobile = document.getElementById("regMobile").value.trim();
    const email = document.getElementById("regEmail").value.trim();
    const password = document.getElementById("regPassword").value;
    const btn = document.getElementById("registerBtn");

    btn.disabled = true;
    btn.innerHTML = '<span class="spinner"></span>';

    try{
      const cred = await auth.createUserWithEmailAndPassword(email, password);
      const user = cred.user;

      let photoURL = defaultAvatar(name);
      // প্রোফাইল ছবি থাকলে Cloudinary-তে আপলোড করা (Firebase Storage লাগছে না)
      if(selectedFile){
        try{
          const result = await uploadToCloudinary(selectedFile);
          photoURL = result.url;
        } catch(upErr){
          console.warn("Profile photo upload failed, using default avatar:", upErr.message);
        }
      }

      await user.updateProfile({ displayName: name, photoURL });
      await createUserDoc(user, { name, mobile, photoURL });

      showToast(t("btn_register") + " ✓", "success");
      window.location.href = "dashboard.html";
    } catch(err){
      showMsg(friendlyAuthError(err), "error");
      btn.disabled = false;
      btn.innerHTML = `<span data-i18n="btn_register">${t("btn_register")}</span>`;
    }
  });

  document.getElementById("googleBtn").addEventListener("click", async ()=>{
    try{
      const cred = await auth.signInWithPopup(googleProvider);
      await createUserDoc(cred.user);
      window.location.href = "dashboard.html";
    } catch(err){
      showMsg(friendlyAuthError(err), "error");
    }
  });
}

/* ========================================================
   LOGIN PAGE
   ======================================================== */
const loginForm = document.getElementById("loginForm");
if(loginForm){
  loginForm.addEventListener("submit", async (e)=>{
    e.preventDefault();
    const email = document.getElementById("loginEmail").value.trim();
    const password = document.getElementById("loginPassword").value;
    const btn = document.getElementById("loginBtn");
    btn.disabled = true;
    btn.innerHTML = '<span class="spinner"></span>';

    try{
      const cred = await auth.signInWithEmailAndPassword(email, password);
      // ইউজার ব্লকড কিনা যাচাই করা
      const userDoc = await db.collection("users").doc(cred.user.uid).get();
      if(userDoc.exists && userDoc.data().status === "blocked"){
        await auth.signOut();
        showMsg(getLang()==="bn" ? "আপনার অ্যাকাউন্ট ব্লক করা হয়েছে। অ্যাডমিনের সাথে যোগাযোগ করুন।" : "Your account is blocked. Please contact admin.", "error");
        btn.disabled = false;
        btn.innerHTML = `<span>${t("btn_login")}</span>`;
        return;
      }
      window.location.href = "dashboard.html";
    } catch(err){
      showMsg(friendlyAuthError(err), "error");
      btn.disabled = false;
      btn.innerHTML = `<span>${t("btn_login")}</span>`;
    }
  });

  document.getElementById("googleBtn").addEventListener("click", async ()=>{
    try{
      const cred = await auth.signInWithPopup(googleProvider);
      await createUserDoc(cred.user);
      window.location.href = "dashboard.html";
    } catch(err){
      showMsg(friendlyAuthError(err), "error");
    }
  });

  // ---- Forgot password মোডাল ----
  const forgotModal = document.getElementById("forgotModal");
  document.getElementById("forgotLink").addEventListener("click", (e)=>{
    e.preventDefault();
    document.getElementById("forgotEmail").value = document.getElementById("loginEmail").value;
    forgotModal.classList.add("show");
  });
  document.getElementById("closeForgot").addEventListener("click", ()=> forgotModal.classList.remove("show"));

  document.getElementById("sendResetBtn").addEventListener("click", async ()=>{
    const email = document.getElementById("forgotEmail").value.trim();
    if(!email){ showToast(getLang()==="bn"?"ইমেইল দিন":"Enter your email", "error"); return; }
    try{
      // নোট: Firebase-এর বিল্ট-ইন ইমেইল রিসেট সম্পূর্ণ ফ্রি ও কোনো সার্ভার ছাড়াই কাজ করে।
      // "ফি সহ রিকভারি" (বিকাশ পেমেন্ট) বাস্তবায়ন করতে ভবিষ্যতে একটি Cloud Function /
      // ছোট ব্যাকএন্ড প্রয়োজন হবে পেমেন্ট ভেরিফাই করার জন্য।
      await auth.sendPasswordResetEmail(email);
      showToast(getLang()==="bn" ? "রিসেট লিংক ইমেইলে পাঠানো হয়েছে" : "Reset link sent to your email", "success");
      forgotModal.classList.remove("show");
    } catch(err){
      showToast(friendlyAuthError(err), "error");
    }
  });
}

/* ========================================================
   LOGOUT (যেকোনো পেজ থেকে ব্যবহারযোগ্য)
   ======================================================== */
function logout(){
  auth.signOut().then(()=> window.location.href = "login.html");
}
