// =====================================================
// KONFIGURASI
// =====================================================

const API_URL =
  "https://script.google.com/macros/s/AKfycbw3rBBb40FKfKtkdNSfb6CHs30HbNJ4y-DSZX8wx3mj-IeDUESuR8ZXHvisaHHS4UiK/exec";

const targetDate = new Date("2026-06-19T09:00:00");


// =====================================================
// ELEMENT
// =====================================================

const cover = document.getElementById("cover");
const openBtn = document.getElementById("openInvitation");

const music = document.getElementById("bgMusic");
const musicBtn = document.getElementById("musicBtn");

const countdown = document.getElementById("countdown");

const guestForm = document.getElementById("guestForm");
const submitBtn = document.getElementById("submitBtn");

const guestList = document.getElementById("guestList");


// =====================================================
// BUKA UNDANGAN
// =====================================================

openBtn.addEventListener("click", async () => {

  cover.classList.add("hidden");

  try {

    music.volume = 0.5;

    await music.play();

    musicBtn.innerHTML = "🔊";

  } catch (err) {

    console.log("Autoplay ditolak browser:", err);

  }

  window.scrollTo({
    top: 0,
    behavior: "smooth"
  });

});


// =====================================================
// TOGGLE MUSIC
// =====================================================

let musicPlaying = true;

musicBtn.addEventListener("click", () => {

  if (music.paused) {

    music.play();

    musicBtn.innerHTML = "🔊";

    musicPlaying = true;

  } else {

    music.pause();

    musicBtn.innerHTML = "🔇";

    musicPlaying = false;

  }

});


// =====================================================
// COUNTDOWN
// =====================================================

function updateCountdown() {

  const now = new Date();

  const distance = targetDate - now;

  if (distance <= 0) {

    countdown.innerHTML =
      "<strong>Hari Bahagia Telah Tiba 🎉</strong>";

    return;
  }

  const days =
    Math.floor(distance / (1000 * 60 * 60 * 24));

  const hours =
    Math.floor(
      (distance % (1000 * 60 * 60 * 24))
      / (1000 * 60 * 60)
    );

  const minutes =
    Math.floor(
      (distance % (1000 * 60 * 60))
      / (1000 * 60)
    );

  const seconds =
    Math.floor(
      (distance % (1000 * 60))
      / 1000
    );

  countdown.innerHTML = `
    <div class="countdown-grid">
      <div>
        <span>${days}</span>
        <small>Hari</small>
      </div>

      <div>
        <span>${hours}</span>
        <small>Jam</small>
      </div>

      <div>
        <span>${minutes}</span>
        <small>Menit</small>
      </div>

      <div>
        <span>${seconds}</span>
        <small>Detik</small>
      </div>
    </div>
  `;
}

updateCountdown();

setInterval(updateCountdown, 1000);


// =====================================================
// LOAD UCAPAN
// =====================================================

async function loadUcapan() {

  try {

    const res = await fetch(API_URL);

    const data = await res.json();

    guestList.innerHTML = "";

    data.forEach(item => {

      const card = document.createElement("div");

      card.className = "guest-card";

      card.innerHTML = `
        <h4>${item.nama}</h4>

        <p>${item.ucapan}</p>

        <span>${item.waktu}</span>
      `;

      guestList.appendChild(card);

    });

  } catch (err) {

    console.error(err);

  }

}

loadUcapan();


// =====================================================
// SUBMIT UCAPAN
// =====================================================

guestForm.addEventListener("submit", async (e) => {

  e.preventDefault();

  submitBtn.disabled = true;

  submitBtn.innerText = "Mengirim...";

  const nama =
    document.getElementById("nama").value.trim();

  const ucapan =
    document.getElementById("ucapan").value.trim();

  try {

    const res = await fetch(API_URL, {

      method: "POST",

      headers: {
        "Content-Type": "application/json"
      },

      body: JSON.stringify({
        nama,
        ucapan
      })

    });

    const result = await res.json();

    if (result.success) {

      guestForm.reset();

      alert(
        "Terima kasih atas ucapan & doanya ❤️"
      );

      loadUcapan();

    }

  } catch (err) {

    console.error(err);

    alert(
      "Gagal mengirim ucapan. Silakan coba lagi."
    );

  }

  submitBtn.disabled = false;

  submitBtn.innerText = "Kirim Ucapan";

});