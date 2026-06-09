// =====================================================
// KONFIGURASI
// =====================================================

const API_URL =
  "https://script.google.com/macros/s/AKfycbx3Xdy6aVWy-9AA-8XwaWDYNs0s1MzIANo5SYh0D0ODYv5q_8BVNyBtrUIMQjycP87i/exec";

const targetDate =
  new Date("2026-06-19T09:00:00");


// =====================================================
// NAMA TAMU DARI URL
// contoh:
// ?to=Rausan%20Yorisa
// =====================================================

const params =
  new URLSearchParams(
    window.location.search
  );

const guestName =
  params.get("to");

if (
  guestName &&
  document.getElementById("guestName")
) {
  document.getElementById(
    "guestName"
  ).textContent =
    decodeURIComponent(guestName);
}


// =====================================================
// ELEMENT
// =====================================================

const cover =
  document.getElementById("cover");

const openBtn =
  document.getElementById("openInvitation");

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

const guestbook =
  document.getElementById("guestbook");


// =====================================================
// BUKA UNDANGAN
// =====================================================

openBtn.addEventListener(
  "click",
  async () => {

    cover.style.display = "none";

    mainContent.classList.remove(
      "hidden"
    );

    try {

      music.volume = 0.5;

      await music.play();

      musicBtn.innerHTML = "🔊";

    } catch (err) {

      console.log(
        "Autoplay ditolak browser:",
        err
      );

    }

    setTimeout(() => {

      const ayat =
        document.getElementById(
          "ayatSection"
        );

      if (ayat) {

        ayat.scrollIntoView({
          behavior: "smooth",
          block: "start"
        });

      }

    }, 300);

  }
);


// =====================================================
// TOGGLE MUSIC
// =====================================================

musicBtn.addEventListener(
  "click",
  () => {

    if (music.paused) {

      music.play();

      musicBtn.innerHTML = "🔊";

    } else {

      music.pause();

      musicBtn.innerHTML = "🔇";

    }

  }
);


// =====================================================
// COUNTDOWN
// =====================================================

function updateCountdown() {

  if (!countdown) return;

  const now =
    new Date();

  const distance =
    targetDate - now;

  if (distance <= 0) {

    countdown.innerHTML = `
      <strong>
        Hari Bahagia Telah Tiba 🎉
      </strong>
    `;

    return;
  }

  const days =
    Math.floor(
      distance /
      (1000 * 60 * 60 * 24)
    );

  const hours =
    Math.floor(
      (
        distance %
        (1000 * 60 * 60 * 24)
      ) /
      (1000 * 60 * 60)
    );

  const minutes =
    Math.floor(
      (
        distance %
        (1000 * 60 * 60)
      ) /
      (1000 * 60)
    );

  const seconds =
    Math.floor(
      (
        distance %
        (1000 * 60)
      ) /
      1000
    );

  countdown.innerHTML = `
    <div class="count-item">
      <span>${days}</span>
      <small>Hari</small>
    </div>

    <div class="count-item">
      <span>${hours}</span>
      <small>Jam</small>
    </div>

    <div class="count-item">
      <span>${minutes}</span>
      <small>Menit</small>
    </div>

    <div class="count-item">
      <span>${seconds}</span>
      <small>Detik</small>
    </div>
  `;
}

updateCountdown();

setInterval(
  updateCountdown,
  1000
);


// =====================================================
// FORMAT TANGGAL
// =====================================================

function formatTanggal(
  waktu
) {

  if (
    String(waktu)
      .includes("/")
  ) {
    return waktu;
  }

  const date =
    new Date(waktu);

  return date.toLocaleString(
    "id-ID",
    {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit"
    }
  );

}


// =====================================================
// LOAD UCAPAN
// =====================================================

async function loadUcapan() {

  try {

    const res =
      await fetch(API_URL);

    const data =
      await res.json();

    guestbook.innerHTML = "";

    if (
      !data ||
      data.length === 0
    ) {

      guestbook.innerHTML = `
        <div class="empty-message">
          Belum ada ucapan & doa.
        </div>
      `;

      return;
    }

    data.forEach(item => {

      const card =
        document.createElement(
          "div"
        );

      card.className =
        "guest-card";

      card.innerHTML = `
        <h4 class="guest-header">
          ${item.nama}
        </h4>

        <p class="guest-message">
          ${item.ucapan}
        </p>

        <small class="guest-time">
          ${formatTanggal(
            item.waktu
          )}
        </small>
      `;

      guestbook.appendChild(
        card
      );

    });

  } catch (error) {

    console.error(error);

    guestbook.innerHTML = `
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

guestForm.addEventListener(
  "submit",
  async (e) => {

    e.preventDefault();

    submitBtn.disabled = true;

    submitBtn.innerText =
      "Mengirim...";

    const nama =
      document
        .getElementById(
          "nama"
        )
        .value.trim();

    const ucapan =
      document
        .getElementById(
          "ucapan"
        )
        .value.trim();

    try {

      const formData =
        new FormData();

      formData.append(
        "nama",
        nama
      );

      formData.append(
        "ucapan",
        ucapan
      );

      const response =
        await fetch(
          API_URL,
          {
            method: "POST",
            body: formData
          }
        );

      const result =
        await response.json();

      if (
        result.success
      ) {

        guestForm.reset();

        document
          .getElementById(
            "successMessage"
          )
          .classList.remove(
            "hidden"
          );

        loadUcapan();

        setTimeout(() => {

          document
            .getElementById(
              "successMessage"
            )
            .classList.add(
              "hidden"
            );

        }, 4000);

      }

    } catch (error) {

      console.error(
        error
      );

      alert(
        "Gagal mengirim ucapan."
      );

    } finally {

      submitBtn.disabled =
        false;

      submitBtn.innerText =
        "Kirim Ucapan & Do'a";

    }

  }
);


// =====================================================
// SCROLL ANIMATION
// =====================================================

const observer =
  new IntersectionObserver(
    entries => {

      entries.forEach(
        entry => {

          if (
            entry.isIntersecting
          ) {

            entry.target.classList.add(
              "show"
            );

          }

        }
      );

    },
    {
      threshold: 0.1
    }
  );

document
  .querySelectorAll(
    ".fade-section"
  )
  .forEach(section => {

    observer.observe(
      section
    );

  });