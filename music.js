/* =========================================================
   Kyusei - music.js (AUTO START ON FIRST GESTURE - FIX v2)

   Fixes:
   - Sebelumnya: auto-start cuma jalan kalau localStorage bgm_playing == "1".
   - Sekarang: auto-start akan coba PLAY pada TAP pertama,
     KECUALI kalau user pernah pause (bgm_playing == "0").

   Result:
   - Pengunjung baru: tap pertama di layar -> musik langsung jalan.
   - Kalau user pause: tidak dipaksa nyala lagi sampai user klik disc.
   ========================================================= */

(function () {
  "use strict";

  var STORAGE = {
    playing: "bgm_playing",
    volume: "bgm_volume",
    time: "bgm_time"
  };

  var bgm = document.getElementById("bgm");
  if (!bgm) {
    console.warn("[music.js] <audio id='bgm'> tidak ditemukan.");
    return;
  }

  function safeGet(key) {
    try { return localStorage.getItem(key); } catch (e) { return null; }
  }
  function safeSet(key, val) {
    try { localStorage.setItem(key, val); } catch (e) {}
  }

  // Restore volume
  var savedVol = Number(safeGet(STORAGE.volume));
  if (!isNaN(savedVol)) bgm.volume = Math.min(1, Math.max(0, savedVol));
  else bgm.volume = 0.2;

  // Restore time (best effort)
  var savedTime = Number(safeGet(STORAGE.time));
  if (!isNaN(savedTime) && savedTime > 0) {
    try { bgm.currentTime = savedTime; } catch (e) {}
  }

  function setDiscState(isPlaying) {
    var discs = document.querySelectorAll("#musicDisc");
    for (var i = 0; i < discs.length; i++) {
      if (isPlaying) discs[i].classList.add("playing");
      else discs[i].classList.remove("playing");
    }
  }

  function bindDisc(disc) {
    if (!disc || disc.__bgmBound) return;
    disc.__bgmBound = true;

    // initial state
    setDiscState(!bgm.paused);

    disc.addEventListener("click", function () {
      togglePlay();
    });
  }

  function rebind() {
    var disc = document.getElementById("musicDisc");
    if (disc) bindDisc(disc);
    setDiscState(!bgm.paused);
  }

  function togglePlay() {
    if (bgm.paused) {
      bgm.play().then(function () {
        safeSet(STORAGE.playing, "1");
      }).catch(function (e) {
        alert("Music gagal diputar. Pastikan file ada di assets/bgm.mp3 (nama/path harus sama persis).");
        console.warn(e);
      });
    } else {
      bgm.pause();
      safeSet(STORAGE.playing, "0");
    }
  }

  // Save state
  bgm.addEventListener("play", function () {
    safeSet(STORAGE.playing, "1");
    setDiscState(true);
  });
  bgm.addEventListener("pause", function () {
    safeSet(STORAGE.playing, "0");
    setDiscState(false);
  });
  bgm.addEventListener("volumechange", function () {
    safeSet(STORAGE.volume, String(bgm.volume));
  });

  // checkpoint time every ~2s
  var lastWrite = 0;
  bgm.addEventListener("timeupdate", function () {
    var now = Date.now();
    if (now - lastWrite < 2000) return;
    lastWrite = now;
    safeSet(STORAGE.time, String(Math.floor(bgm.currentTime || 0)));
  });

  // === AUTO START ON FIRST USER INTERACTION (mobile unlock) ===
  var armed = true;

  function shouldAutoStart() {
    // If user explicitly paused before, do not force autoplay.
    // If null (never set) -> allow autoplay after first gesture.
    return safeGet(STORAGE.playing) !== "0";
  }

  function onFirstGesture() {
    if (!armed) return;
    armed = false;

    if (shouldAutoStart()) {
      bgm.play().then(function () {
        safeSet(STORAGE.playing, "1");
      }).catch(function (e) {
        // Still blocked (rare). User can press disc.
        console.warn("[music.js] play() blocked:", e);
      });
    }

    // remove listeners
    window.removeEventListener("pointerdown", onFirstGesture, true);
    window.removeEventListener("touchstart", onFirstGesture, true);
    window.removeEventListener("click", onFirstGesture, true);
    window.removeEventListener("keydown", onFirstGesture, true);
  }

  window.addEventListener("pointerdown", onFirstGesture, true);
  window.addEventListener("touchstart", onFirstGesture, true);
  window.addEventListener("click", onFirstGesture, true);
  window.addEventListener("keydown", onFirstGesture, true);

  // Try resume if previously playing
  if (safeGet(STORAGE.playing) === "1") {
    bgm.play().catch(function () {});
  }

  // expose for router
  window.__kyuseiMusic = {
    rebind: rebind,
    play: function () { return bgm.play(); },
    pause: function () { bgm.pause(); },
    toggle: togglePlay,
    el: bgm
  };

  document.addEventListener("DOMContentLoaded", function () {
    rebind();
  });
})();
