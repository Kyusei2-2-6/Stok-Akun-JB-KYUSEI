/* =========================================================
   Kyusei - music.js (GLOBAL + PERSIST)
   Requirement:
   - Music terus jalan selama user masih di web (SPA hash routing)
   - Bisa Play/Pause lewat "musicDisc" yang ada di tiap halaman
   - Simpan state (playing/volume/currentTime) di localStorage
   Notes:
   - Browser butuh user gesture utk play pertama kali.
   ========================================================= */

(function () {
  "use strict";

  var STORAGE = {
    playing: "bgm_playing",
    volume: "bgm_volume",
    time: "bgm_time"
  };

  var bgm = document.getElementById("bgm");
  if (!bgm) return;

  // defaults
  var savedVol = Number(localStorage.getItem(STORAGE.volume));
  if (!isNaN(savedVol)) bgm.volume = Math.min(1, Math.max(0, savedVol));
  else bgm.volume = 0.2;

  // restore time (best effort)
  var savedTime = Number(localStorage.getItem(STORAGE.time));
  if (!isNaN(savedTime) && savedTime > 0) {
    try { bgm.currentTime = savedTime; } catch (e) {}
  }

  function setDiscState(disc, isPlaying) {
    if (!disc) return;
    if (isPlaying) disc.classList.add("playing");
    else disc.classList.remove("playing");
  }

  function bindDisc(disc) {
    if (!disc || disc.__bgmBound) return;
    disc.__bgmBound = true;

    // sync state now
    setDiscState(disc, !bgm.paused);

    disc.addEventListener("click", async function () {
      try {
        if (bgm.paused) {
          await bgm.play();
        } else {
          bgm.pause();
        }
      } catch (e) {
        alert("Audio tidak bisa diputar. Pastikan file ada di ./assets/bgm.mp3");
        console.log(e);
      }
    });
  }

  // save state
  bgm.addEventListener("play", function () {
    try { localStorage.setItem(STORAGE.playing, "1"); } catch (e) {}
    // update all discs currently on page
    var discs = document.querySelectorAll("#musicDisc");
    for (var i = 0; i < discs.length; i++) setDiscState(discs[i], true);
  });

  bgm.addEventListener("pause", function () {
    try { localStorage.setItem(STORAGE.playing, "0"); } catch (e) {}
    var discs = document.querySelectorAll("#musicDisc");
    for (var i = 0; i < discs.length; i++) setDiscState(discs[i], false);
  });

  bgm.addEventListener("volumechange", function () {
    try { localStorage.setItem(STORAGE.volume, String(bgm.volume)); } catch (e) {}
  });

  // checkpoint time every 2s (avoid heavy write)
  var lastWrite = 0;
  bgm.addEventListener("timeupdate", function () {
    var now = Date.now();
    if (now - lastWrite < 2000) return;
    lastWrite = now;
    try { localStorage.setItem(STORAGE.time, String(Math.floor(bgm.currentTime || 0))); } catch (e) {}
  });

  // When leaving site, no special action needed.
  // But keep last time for resume.

  // Try resume if previously playing (best-effort; may be blocked until user gesture)
  if (localStorage.getItem(STORAGE.playing) === "1") {
    bgm.play().catch(function () {
      // blocked: user must click disc or welcome button
    });
  }

  // expose a small API for router to rebind after page swap
  window.__kyuseiMusic = {
    rebind: function () {
      var disc = document.getElementById("musicDisc");
      if (disc) bindDisc(disc);
      setDiscState(disc, !bgm.paused);
    },
    play: function () { return bgm.play(); },
    pause: function () { bgm.pause(); },
    el: bgm
  };

  // initial bind (for first render)
  document.addEventListener("DOMContentLoaded", function () {
    window.__kyuseiMusic.rebind();
  });
})();
