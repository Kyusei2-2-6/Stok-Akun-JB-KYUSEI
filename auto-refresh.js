// === AUTO REFRESH GITHUB PAGES ===
// Aman, tidak mengganggu code asli

const USER = "USERNAME_KAMU";
const REPO = "NAMA_REPO_KAMU";

let lastCommit = null;

async function checkUpdate() {
  try {
    const res = await fetch(
      `https://api.github.com/repos/${USER}/${REPO}/commits`
    );

    const data = await res.json();
    const newestCommit = data[0].sha;

    if (!lastCommit) {
      lastCommit = newestCommit;
      return;
    }

    if (lastCommit !== newestCommit) {
      console.log("Update detected → Refreshing...");
      location.reload(true);
    }
  } catch (e) {
    console.log("Auto refresh error", e);
  }
}

// cek tiap 20 detik
setInterval(checkUpdate, 20000);
