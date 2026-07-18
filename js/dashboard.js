/* =========================================================
   ড্যাশবোর্ড লজিক — dashboard.html
   ফায়ারস্টোর কালেকশন:
     users/{uid}        -> ইউজারের প্রোফাইল ও স্টোরেজ তথ্য
     files/{id}          -> {ownerId, name, type:'file'|'folder',
                             parentId, fileType, size, url,
                             publicId, createdAt}
     shares/{shareId}    -> {fileId, ownerId, fileName, createdAt}
   ========================================================= */

let currentUser = null;
let userData = null;
let currentFolderId = null;       // null = root
let breadcrumbStack = [{ id: null, name: "My Vault" }];
let allFilesCache = [];           // সার্চের জন্য পুরো ফাইল লিস্ট cache
let pendingDeleteAction = null;

const filesCol = () => db.collection("files");
const sharesCol = () => db.collection("shares");

/* ---------------------------------------------------------
   পেজ শুরু — অথেনটিকেশন যাচাই
   --------------------------------------------------------- */
requireAuth(async (user)=>{
  currentUser = user;
  let snap = await db.collection("users").doc(user.uid).get();
  if(!snap.exists){
    // Google দিয়ে প্রথমবার এলে ডকুমেন্ট না থাকলে তৈরি
    await db.collection("users").doc(user.uid).set({
      uid: user.uid, name: user.displayName || "User", email: user.email || "",
      mobile: "", photoURL: user.photoURL || defaultAvatar(user.displayName),
      storageUsed: 0, storageLimit: APP_CONFIG.FREE_STORAGE_LIMIT_BYTES,
      status: "active", isAdmin: isAdminEmail(user.email || ""),
      createdAt: firebase.firestore.FieldValue.serverTimestamp()
    });
    snap = await db.collection("users").doc(user.uid).get();
  }
  userData = snap.data();

  if(userData.status === "blocked"){
    await auth.signOut();
    window.location.href = "login.html";
    return;
  }

  renderSidebarProfile();
  if(userData.isAdmin) document.getElementById("adminLink").style.display = "flex";

  document.getElementById("pageLoader").style.display = "none";
  document.getElementById("appShell").style.display = "grid";

  loadCurrentFolder();
});

/* ---------------------------------------------------------
   সাইডবার প্রোফাইল ও স্টোরেজ বার
   --------------------------------------------------------- */
function renderSidebarProfile(){
  document.getElementById("chipAvatar").src = userData.photoURL || defaultAvatar(userData.name);
  document.getElementById("chipName").textContent = userData.name;

  const used = userData.storageUsed || 0;
  const limit = userData.storageLimit || APP_CONFIG.FREE_STORAGE_LIMIT_BYTES;
  const pct = Math.min(100, Math.round((used / limit) * 100));

  document.getElementById("storageText").textContent = `${formatBytes(used)} / ${formatBytes(limit)}`;
  document.getElementById("storageBar").style.width = pct + "%";
  document.getElementById("storagePercent").textContent = pct;

  document.getElementById("statUsed").textContent = formatBytes(used);
  document.getElementById("statAvailable").textContent = formatBytes(Math.max(0, limit - used));
}

/* ---------------------------------------------------------
   ফোল্ডার/ফাইল লোড করা
   --------------------------------------------------------- */
async function loadCurrentFolder(){
  document.getElementById("searchInput").value = "";
  renderBreadcrumb();

  const snap = await filesCol()
    .where("ownerId", "==", currentUser.uid)
    .where("parentId", "==", currentFolderId)
    .get();

  const items = [];
  snap.forEach(doc=> items.push({ id: doc.id, ...doc.data() }));
  items.sort((a,b)=>{
    if(a.type !== b.type) return a.type === "folder" ? -1 : 1;
    return (a.name || "").localeCompare(b.name || "");
  });

  renderGrid(items);
  updateFolderFileStats();
}

async function updateFolderFileStats(){
  const snap = await filesCol().where("ownerId","==",currentUser.uid).get();
  let fileCount = 0, folderCount = 0;
  allFilesCache = [];
  snap.forEach(doc=>{
    const d = doc.data();
    if(d.type === "folder") folderCount++; else fileCount++;
    allFilesCache.push({ id: doc.id, ...d });
  });
  document.getElementById("statFiles").textContent = fileCount;
  document.getElementById("statFolders").textContent = folderCount;
}

function renderBreadcrumb(){
  const bc = document.getElementById("breadcrumb");
  bc.innerHTML = breadcrumbStack.map((b,i)=>
    `<span data-idx="${i}">${i===0 ? "🏠 " : "› "}${escapeHtml(b.name)}</span>`
  ).join("");
  bc.querySelectorAll("span").forEach(span=>{
    span.addEventListener("click", ()=>{
      const idx = parseInt(span.dataset.idx);
      breadcrumbStack = breadcrumbStack.slice(0, idx+1);
      currentFolderId = breadcrumbStack[breadcrumbStack.length-1].id;
      loadCurrentFolder();
    });
  });
}

/* ---------------------------------------------------------
   গ্রিড রেন্ডার করা
   --------------------------------------------------------- */
function renderGrid(items){
  const grid = document.getElementById("fileGrid");
  const empty = document.getElementById("emptyState");
  grid.innerHTML = "";

  if(items.length === 0){
    empty.style.display = "block";
    return;
  }
  empty.style.display = "none";

  items.forEach(item=>{
    const card = document.createElement("div");
    card.className = "file-card" + (item.type === "folder" ? " folder-card" : "");

    let thumb = `<div class="thumb">${item.type === "folder" ? "📁" : fileIcon(item.fileType, item.name)}</div>`;
    if(item.type === "file" && (item.fileType || "").startsWith("image/")){
      thumb = `<div class="thumb"><img src="${item.url}" loading="lazy" alt=""></div>`;
    }

    card.innerHTML = `
      ${thumb}
      <div class="name">${escapeHtml(item.name)}</div>
      <div class="meta">${item.type === "folder" ? "ফোল্ডার" : formatBytes(item.size)}</div>
      <div class="menu-btn" data-id="${item.id}">⋮</div>
      <div class="dropdown" data-menu="${item.id}">
        ${item.type === "folder" ? `<button data-act="open">📂 ${t("menu_open")}</button>` : `
          <button data-act="download">⬇️ ${t("menu_download")}</button>
          <button data-act="share">🔗 ${t("menu_share")}</button>`}
        <button data-act="rename">✏️ ${t("menu_rename")}</button>
        <button data-act="delete" class="danger">🗑️ ${t("menu_delete")}</button>
      </div>
    `;

    card.addEventListener("click", (e)=>{
      if(e.target.closest(".menu-btn") || e.target.closest(".dropdown")) return;
      if(item.type === "folder") openFolder(item);
      else window.open(item.url, "_blank");
    });

    const menuBtn = card.querySelector(".menu-btn");
    const dropdown = card.querySelector(".dropdown");
    menuBtn.addEventListener("click", (e)=>{
      e.stopPropagation();
      document.querySelectorAll(".dropdown.show").forEach(d=>{ if(d!==dropdown) d.classList.remove("show"); });
      dropdown.classList.toggle("show");
    });

    dropdown.querySelectorAll("button").forEach(btn=>{
      btn.addEventListener("click", (e)=>{
        e.stopPropagation();
        dropdown.classList.remove("show");
        handleItemAction(btn.dataset.act, item);
      });
    });

    grid.appendChild(card);
  });
}

document.addEventListener("click", ()=> document.querySelectorAll(".dropdown.show").forEach(d=>d.classList.remove("show")));

function escapeHtml(str=""){
  return String(str).replace(/[&<>"']/g, m=>({ "&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;" }[m]));
}

function openFolder(item){
  breadcrumbStack.push({ id: item.id, name: item.name });
  currentFolderId = item.id;
  loadCurrentFolder();
}

/* ---------------------------------------------------------
   ফাইল/ফোল্ডার অ্যাকশন হ্যান্ডলার
   --------------------------------------------------------- */
function handleItemAction(action, item){
  if(action === "open") openFolder(item);
  if(action === "download") window.open(item.url, "_blank");
  if(action === "share") openShareModal(item);
  if(action === "rename") openRenameModal(item);
  if(action === "delete") openDeleteConfirm(item);
}

/* ---- Rename ---- */
let renameTarget = null;
function openRenameModal(item){
  renameTarget = item;
  document.getElementById("renameInput").value = item.name;
  document.getElementById("renameModal").classList.add("show");
}
document.getElementById("confirmRenameBtn").addEventListener("click", async ()=>{
  const newName = document.getElementById("renameInput").value.trim();
  if(!newName || !renameTarget) return;
  await filesCol().doc(renameTarget.id).update({ name: newName });
  closeModal("renameModal");
  showToast(getLang()==="bn" ? "নাম পরিবর্তন হয়েছে" : "Renamed successfully", "success");
  loadCurrentFolder();
});

/* ---- Delete ---- */
function openDeleteConfirm(item){
  document.getElementById("deleteConfirmText").textContent = getLang()==="bn"
    ? `আপনি কি "${item.name}" ডিলিট করতে চান?`
    : `Delete "${item.name}"?`;
  pendingDeleteAction = async ()=>{
    if(item.type === "folder"){
      const childSnap = await filesCol().where("ownerId","==",currentUser.uid).where("parentId","==",item.id).limit(1).get();
      if(!childSnap.empty){
        showToast(getLang()==="bn" ? "ফোল্ডার খালি নয়, আগে ভেতরের ফাইল মুছুন" : "Folder is not empty", "error");
        return;
      }
      await filesCol().doc(item.id).delete();
    } else {
      await filesCol().doc(item.id).delete();
      await db.collection("users").doc(currentUser.uid).update({
        storageUsed: firebase.firestore.FieldValue.increment(-1 * (item.size || 0))
      });
      userData.storageUsed = Math.max(0, (userData.storageUsed||0) - (item.size||0));
      renderSidebarProfile();
    }
    showToast(getLang()==="bn" ? "ডিলিট হয়েছে" : "Deleted", "success");
    loadCurrentFolder();
  };
  document.getElementById("deleteConfirmModal").classList.add("show");
}
document.getElementById("confirmDeleteBtn").addEventListener("click", async ()=>{
  if(pendingDeleteAction) await pendingDeleteAction();
  closeModal("deleteConfirmModal");
});

/* ---- Share ---- */
async function openShareModal(item){
  const existing = await sharesCol().where("fileId","==",item.id).limit(1).get();
  let shareId;
  if(!existing.empty){
    shareId = existing.docs[0].id;
  } else {
    shareId = genShareId();
    await sharesCol().doc(shareId).set({
      fileId: item.id, ownerId: currentUser.uid, fileName: item.name,
      createdAt: firebase.firestore.FieldValue.serverTimestamp()
    });
  }
  const link = `${location.origin}${location.pathname.replace("dashboard.html","")}share.html?id=${shareId}`;
  document.getElementById("shareLinkInput").value = link;
  document.getElementById("shareModal").classList.add("show");
}
document.getElementById("copyShareBtn").addEventListener("click", ()=>{
  const input = document.getElementById("shareLinkInput");
  input.select();
  navigator.clipboard.writeText(input.value).then(()=> showToast(getLang()==="bn" ? "লিংক কপি হয়েছে" : "Link copied", "success"));
});

/* ---------------------------------------------------------
   নতুন ফোল্ডার তৈরি
   --------------------------------------------------------- */
document.getElementById("newFolderBtn").addEventListener("click", ()=>{
  document.getElementById("folderNameInput").value = "";
  document.getElementById("folderModal").classList.add("show");
});
document.getElementById("createFolderBtn").addEventListener("click", async ()=>{
  const name = document.getElementById("folderNameInput").value.trim();
  if(!name) return;
  await filesCol().add({
    ownerId: currentUser.uid, name, type: "folder", parentId: currentFolderId,
    createdAt: firebase.firestore.FieldValue.serverTimestamp()
  });
  closeModal("folderModal");
  showToast(getLang()==="bn" ? "ফোল্ডার তৈরি হয়েছে" : "Folder created", "success");
  loadCurrentFolder();
});

/* ---------------------------------------------------------
   ফাইল আপলোড (Cloudinary)
   --------------------------------------------------------- */
document.getElementById("uploadBtn").addEventListener("click", ()=> document.getElementById("fileInput").click());
document.getElementById("fileInput").addEventListener("change", async (e)=>{
  const files = Array.from(e.target.files);
  e.target.value = "";
  for(const file of files) await handleSingleUpload(file);
});

async function handleSingleUpload(file){
  const limit = userData.storageLimit || APP_CONFIG.FREE_STORAGE_LIMIT_BYTES;
  const used = userData.storageUsed || 0;

  if(used + file.size > limit){
    showToast(getLang()==="bn" ? "স্টোরেজ পূর্ণ! আরও জায়গা দরকার।" : "Storage full!", "error");
    return;
  }
  if(file.size > APP_CONFIG.MAX_FILE_SIZE_BYTES){
    showToast(getLang()==="bn" ? "ফাইলটি অনেক বড় (সর্বোচ্চ 25MB)" : "File too large (max 25MB)", "error");
    return;
  }

  const uploadArea = document.getElementById("uploadArea");
  const row = document.createElement("div");
  row.className = "upload-item";
  row.innerHTML = `<span>${fileIcon(file.type,file.name)}</span><span style="min-width:120px; overflow:hidden; text-overflow:ellipsis; white-space:nowrap;">${escapeHtml(file.name)}</span><div class="bar"><div class="bar-fill"></div></div><span class="pct">0%</span>`;
  uploadArea.appendChild(row);
  const barFill = row.querySelector(".bar-fill");
  const pctLabel = row.querySelector(".pct");

  try{
    const result = await uploadToCloudinary(file, (pct)=>{
      barFill.style.width = pct + "%";
      pctLabel.textContent = pct + "%";
    });

    await filesCol().add({
      ownerId: currentUser.uid, name: file.name, type: "file",
      parentId: currentFolderId, fileType: file.type, size: file.size,
      url: result.url, publicId: result.publicId,
      createdAt: firebase.firestore.FieldValue.serverTimestamp()
    });

    await db.collection("users").doc(currentUser.uid).update({
      storageUsed: firebase.firestore.FieldValue.increment(file.size)
    });
    userData.storageUsed = (userData.storageUsed||0) + file.size;
    renderSidebarProfile();

    row.remove();
    showToast(`${file.name} ${getLang()==="bn" ? "আপলোড হয়েছে" : "uploaded"}`, "success");
    loadCurrentFolder();
  } catch(err){
    barFill.style.background = "var(--danger)";
    pctLabel.textContent = "❌";
    showToast(err.message, "error");
  }
}

/* ---------------------------------------------------------
   সার্চ
   --------------------------------------------------------- */
let searchTimer;
document.getElementById("searchInput").addEventListener("input", (e)=>{
  clearTimeout(searchTimer);
  const query = e.target.value.trim().toLowerCase();
  searchTimer = setTimeout(()=>{
    if(!query){ loadCurrentFolder(); return; }
    const results = allFilesCache.filter(f => (f.name||"").toLowerCase().includes(query));
    renderGrid(results);
  }, 250);
});

/* ---------------------------------------------------------
   ভিউ পরিবর্তন (ফাইল / শেয়ারড / প্রোফাইল)
   --------------------------------------------------------- */
document.querySelectorAll(".sidebar-nav a[data-view]").forEach(link=>{
  link.addEventListener("click", ()=>{
    document.querySelectorAll(".sidebar-nav a[data-view]").forEach(a=>a.classList.remove("active"));
    link.classList.add("active");
    const view = link.dataset.view;
    ["files","shared","profile"].forEach(v=>{
      document.getElementById(`view-${v}`).style.display = v === view ? "block" : "none";
    });
    if(view === "shared") loadSharedLinks();
    if(view === "profile") loadProfileView();
    document.getElementById("sidebar").classList.remove("open");
  });
});

document.getElementById("logoutLink").addEventListener("click", logout);
document.getElementById("menuToggle").addEventListener("click", ()=> document.getElementById("sidebar").classList.toggle("open"));

/* ---- Shared links view ---- */
async function loadSharedLinks(){
  const snap = await sharesCol().where("ownerId","==",currentUser.uid).get();
  const grid = document.getElementById("sharedGrid");
  const empty = document.getElementById("sharedEmpty");
  grid.innerHTML = "";
  if(snap.empty){ empty.style.display = "block"; return; }
  empty.style.display = "none";

  snap.forEach(doc=>{
    const d = doc.data();
    const link = `${location.origin}${location.pathname.replace("dashboard.html","")}share.html?id=${doc.id}`;
    const card = document.createElement("div");
    card.className = "file-card";
    card.innerHTML = `<div class="thumb">🔗</div><div class="name">${escapeHtml(d.fileName)}</div><div class="meta">${formatDate(d.createdAt)}</div>`;
    card.addEventListener("click", ()=>{
      navigator.clipboard.writeText(link).then(()=> showToast(getLang()==="bn" ? "লিংক কপি হয়েছে" : "Link copied", "success"));
    });
    grid.appendChild(card);
  });
}

/* ---- Profile view ---- */
function loadProfileView(){
  document.getElementById("profileAvatar").src = userData.photoURL || defaultAvatar(userData.name);
  document.getElementById("profileName").value = userData.name || "";
  document.getElementById("profileMobile").value = userData.mobile || "";
  document.getElementById("profileEmail").value = userData.email || "";
}

let newProfilePhotoFile = null;
document.getElementById("profilePhotoInput").addEventListener("change", (e)=>{
  const file = e.target.files[0];
  if(file){
    newProfilePhotoFile = file;
    document.getElementById("profileAvatar").src = URL.createObjectURL(file);
  }
});

document.getElementById("saveProfileBtn").addEventListener("click", async ()=>{
  const name = document.getElementById("profileName").value.trim();
  const mobile = document.getElementById("profileMobile").value.trim();
  const update = { name, mobile };

  if(newProfilePhotoFile){
    try{
      const result = await uploadToCloudinary(newProfilePhotoFile);
      update.photoURL = result.url;
    } catch(err){ showToast(err.message, "error"); }
  }

  await db.collection("users").doc(currentUser.uid).update(update);
  await currentUser.updateProfile({ displayName: name, photoURL: update.photoURL || userData.photoURL });

  userData = { ...userData, ...update };
  renderSidebarProfile();
  showToast(getLang()==="bn" ? "প্রোফাইল সংরক্ষিত হয়েছে" : "Profile saved", "success");
});

document.getElementById("changePasswordBtn").addEventListener("click", async ()=>{
  const pass = document.getElementById("newPassword").value;
  if(pass.length < 6){ showToast(getLang()==="bn"?"কমপক্ষে ৬ অক্ষর দিন":"Minimum 6 characters", "error"); return; }
  try{
    await currentUser.updatePassword(pass);
    showToast(getLang()==="bn" ? "পাসওয়ার্ড পরিবর্তন হয়েছে" : "Password changed", "success");
    document.getElementById("newPassword").value = "";
  } catch(err){
    showToast(getLang()==="bn" ? "নিরাপত্তার জন্য পুনরায় লগইন করে আবার চেষ্টা করুন" : "Please re-login and try again", "error");
  }
});

document.getElementById("deleteAccountBtn").addEventListener("click", async ()=>{
  const confirmText = getLang()==="bn" ? "আপনি কি নিশ্চিত? এই কাজটি ফিরিয়ে আনা যাবে না।" : "Are you sure? This cannot be undone.";
  if(!confirm(confirmText)) return;
  try{
    const snap = await filesCol().where("ownerId","==",currentUser.uid).get();
    const batch = db.batch();
    snap.forEach(doc=> batch.delete(doc.ref));
    batch.delete(db.collection("users").doc(currentUser.uid));
    await batch.commit();
    await currentUser.delete();
    window.location.href = "index.html";
  } catch(err){
    showToast(getLang()==="bn" ? "নিরাপত্তার জন্য পুনরায় লগইন করে আবার চেষ্টা করুন" : "Please re-login and try again", "error");
  }
});

/* ---------------------------------------------------------
   মোডাল হেল্পার
   --------------------------------------------------------- */
function closeModal(id){ document.getElementById(id).classList.remove("show"); }
document.querySelectorAll("[data-close]").forEach(btn=>{
  btn.addEventListener("click", ()=> closeModal(btn.dataset.close));
});
document.querySelectorAll(".modal-overlay").forEach(overlay=>{
  overlay.addEventListener("click", (e)=>{ if(e.target === overlay) overlay.classList.remove("show"); });
});
