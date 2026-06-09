// =====================================================
// KONFIGURASI
// =====================================================

const API_URL =
  "https://script.google.com/macros/s/AKfycbx3Xdy6aVWy-9AA-8XwaWDYNs0s1MzIANo5SYh0D0ODYv5q_8BVNyBtrUIMQjycP87i/exec";

const targetDate = new Date("2026-06-19T09:00:00");


// =====================================================
// ELEMENT
// =====================================================

const cover = document.getElementById("cover");
const openBtn = document.getElementById("openInvitation");

const mainContent =
  document.getElementById("mainContent");

const music =
  document.getElementById("bgMusic");

const musicBtn =
  document.getElementById("musicBtn");

const countdown =
  document.getElementById("countdown");

const guestForm =
  document.getElementById("guestForm");

const submitBtn =
  document.getElementById("submitBtn");

const guestList =
  document.getElementById("guestbook");

// =====================================================
// BUKA UNDANGAN
// =====================================================

openBtn.addEventListener("click", async () => {

  cover.classList.add("hidden");

  mainContent.classList.remove("hidden");

  try {

    music.volume = 0.5;

    await music.play();

    musicBtn.innerHTML = "🔊";

  } catch (err) {

    console.log(err);

  }

  setTimeout(() => {

    document
      .getElementById("ayatSection")
      .scrollIntoView({
        behavior: "smooth",
        block: "start"
      });

  }, 500);

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
  coverCountdown.innerHTML = `
${days} Hari
${hours} Jam
${minutes} Menit
${seconds} Detik
`;
}

updateCountdown();

setInterval(updateCountdown, 1000);


// =====================================================
// LOAD UCAPAN
// =====================================================
function formatTanggal(waktu) {

  // Jika sudah format Indonesia
  if (String(waktu).includes("/")) {
    return waktu;
  }

  const date = new Date(waktu);

  return date.toLocaleString("id-ID", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit"
  });

}
async function loadUcapan() {

  try {

    const res = await fetch(API_URL);

    const data = await res.json();

    const guestbook =
      document.getElementById("guestbook");

    guestbook.innerHTML = "";

    if (!data.length) {

      guestbook.innerHTML = `
        <div class="empty-message">
          Belum ada ucapan & doa.
        </div>
      `;

      return;
    }

    data.forEach(item => {

      const card =
        document.createElement("div");

      card.className = "guest-card";

      card.innerHTML = `
        <h4 class="guest-header">
          ${item.nama}
        </h4>

        <p class="guest-message">
          ${item.ucapan}
        </p>

        <small class="guest-time">
  ${formatTanggal(item.waktu)}
</small>
      `;

      guestbook.appendChild(card);

    });

  } catch (error) {

    console.error(error);

    document.getElementById("guestbook").innerHTML = `
      <div class="error-message">
        Gagal memuat ucapan.
      </div>
    `;

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

   const formData = new FormData();

formData.append("nama", nama);
formData.append("ucapan", ucapan);

const response = await fetch(API_URL, {
  method: "POST",
  body: formData
});

    const result =
      await response.json();

    if (result.success) {

      guestForm.reset();

      document
        .getElementById("successMessage")
        .classList.remove("hidden");

      loadUcapan();

      setTimeout(() => {

        document
          .getElementById("successMessage")
          .classList.add("hidden");

      }, 4000);

    }

  } catch (error) {

    console.error(error);

    alert(
      "Gagal mengirim ucapan."
    );

  } finally {

    submitBtn.disabled = false;

    submitBtn.innerText =
      "Kirim Ucapan";

  }

});
// =====================================================
// SCROLL ANIMATION
// =====================================================

const observer = new IntersectionObserver(
  entries => {

    entries.forEach(entry => {

      if (entry.isIntersecting) {

        entry.target.classList.add("show");

      }

    });

  },
  {
    threshold: 0.1
  }
);

document
  .querySelectorAll(".fade-section")
  .forEach(section => {
    observer.observe(section);
  });