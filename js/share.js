/* =========================================================
   Public Share পেজের লজিক
   URL: share.html?id=SHARE_ID
   Firestore rules-এ shares ও files কালেকশনের রিড-এক্সেস
   পাবলিক করে দেওয়া হয়েছে (শুধু নির্দিষ্ট ডকুমেন্টের জন্য),
   যাতে লগইন ছাড়াই কেউ শেয়ার করা ফাইল দেখতে পারে।
   ========================================================= */

(async function(){
  const params = new URLSearchParams(location.search);
  const shareId = params.get("id");

  const loadingWrap = document.getElementById("loadingWrap");
  const notFoundWrap = document.getElementById("notFoundWrap");
  const fileWrap = document.getElementById("fileWrap");

  if(!shareId){
    loadingWrap.style.display = "none";
    notFoundWrap.style.display = "flex";
    return;
  }

  try{
    const shareDoc = await db.collection("shares").doc(shareId).get();
    if(!shareDoc.exists){
      loadingWrap.style.display = "none";
      notFoundWrap.style.display = "flex";
      return;
    }
    const shareData = shareDoc.data();
    const fileDoc = await db.collection("files").doc(shareData.fileId).get();
    if(!fileDoc.exists){
      loadingWrap.style.display = "none";
      notFoundWrap.style.display = "flex";
      return;
    }
    const file = fileDoc.data();

    document.getElementById("fileName").textContent = file.name;
    document.getElementById("fileMeta").textContent = `${formatBytes(file.size)} · ${formatDate(file.createdAt)}`;
    document.getElementById("downloadBtn").addEventListener("click", ()=>{
      triggerDownload(file.url, file.name);
    });

    const thumb = document.getElementById("fileThumb");
    if((file.fileType || "").startsWith("image/")){
      thumb.innerHTML = `<img src="${file.url}" alt="${file.name}">`;
    } else {
      thumb.textContent = fileIcon(file.fileType, file.name);
    }

    loadingWrap.style.display = "none";
    fileWrap.style.display = "flex";
  } catch(err){
    loadingWrap.style.display = "none";
    notFoundWrap.style.display = "flex";
  }
})();
