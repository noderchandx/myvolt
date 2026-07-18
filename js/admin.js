/* =========================================================
   অ্যাডমিন প্যানেল লজিক — admin.html
   শুধুমাত্র APP_CONFIG.ADMIN_EMAILS-এ থাকা ইমেইল দিয়ে লগইন করলেই
   এই পেজ দেখা যাবে (ক্লায়েন্ট-সাইড চেক + Firestore Rules উভয় দিয়ে সুরক্ষিত)
   ========================================================= */

requireAuth(async (user)=>{
  if(!isAdminEmail(user.email || "")){
    document.getElementById("pageLoader").style.display = "none";
    document.getElementById("deniedWrap").style.display = "flex";
    return;
  }

  document.getElementById("pageLoader").style.display = "none";
  document.getElementById("adminShell").style.display = "block";

  await loadStats();
  await loadUsersTable();
  await loadFilesTable();
});

async function loadStats(){
  const usersSnap = await db.collection("users").get();
  const filesSnap = await db.collection("files").where("type","==","file").get();

  let totalStorage = 0, blocked = 0;
  usersSnap.forEach(doc=>{
    const d = doc.data();
    totalStorage += (d.storageUsed || 0);
    if(d.status === "blocked") blocked++;
  });

  document.getElementById("statTotalUsers").textContent = usersSnap.size;
  document.getElementById("statTotalFiles").textContent = filesSnap.size;
  document.getElementById("statTotalStorage").textContent = formatBytes(totalStorage);
  document.getElementById("statBlockedUsers").textContent = blocked;
}

async function loadUsersTable(){
  const usersSnap = await db.collection("users").orderBy("createdAt","desc").get();
  const tbody = document.getElementById("usersTableBody");
  tbody.innerHTML = "";

  usersSnap.forEach(doc=>{
    const d = doc.data();
    const tr = document.createElement("tr");
    const isBlocked = d.status === "blocked";
    tr.innerHTML = `
      <td>${escapeHtml(d.name || "-")}</td>
      <td>${escapeHtml(d.email || "-")}</td>
      <td>${escapeHtml(d.mobile || "-")}</td>
      <td>${formatBytes(d.storageUsed || 0)}</td>
      <td><span class="badge ${isBlocked ? "badge-blocked" : "badge-active"}">${isBlocked ? "ব্লকড" : "সক্রিয়"}</span></td>
      <td><button class="btn btn-sm ${isBlocked ? "btn-primary" : "btn-danger"}" data-uid="${doc.id}" data-action="${isBlocked ? "unblock" : "block"}">
        ${isBlocked ? "আনব্লক" : "ব্লক"}
      </button></td>
    `;
    tbody.appendChild(tr);
  });

  tbody.querySelectorAll("button[data-uid]").forEach(btn=>{
    btn.addEventListener("click", async ()=>{
      const uid = btn.dataset.uid;
      const newStatus = btn.dataset.action === "block" ? "blocked" : "active";
      await db.collection("users").doc(uid).update({ status: newStatus });
      showToast(newStatus === "blocked" ? "ইউজার ব্লক করা হয়েছে" : "ইউজার আনব্লক করা হয়েছে", "success");
      loadUsersTable();
      loadStats();
    });
  });
}

async function loadFilesTable(){
  const filesSnap = await db.collection("files").where("type","==","file").orderBy("createdAt","desc").limit(30).get();
  const tbody = document.getElementById("filesTableBody");
  tbody.innerHTML = "";

  filesSnap.forEach(doc=>{
    const d = doc.data();
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td>${fileIcon(d.fileType, d.name)} ${escapeHtml(d.name)}</td>
      <td style="font-size:.75rem; color:var(--text-muted);">${d.ownerId}</td>
      <td>${escapeHtml(d.fileType || "-")}</td>
      <td>${formatBytes(d.size)}</td>
      <td>${formatDate(d.createdAt)}</td>
    `;
    tbody.appendChild(tr);
  });
}

function escapeHtml(str=""){
  return String(str).replace(/[&<>"']/g, m=>({ "&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;" }[m]));
}
