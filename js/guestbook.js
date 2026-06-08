// =====================================
// GUESTBOOK IKBAL & ANDINI
// =====================================

// GANTI DENGAN URL APPS SCRIPT KAMU
const API_URL =
  "https://script.google.com/macros/s/AKfycbw3rBBb40FKfKtkdNSfb6CHs30HbNJ4y-DSZX8wx3mj-IeDUESuR8ZXHvisaHHS4UiK/exec";

const form = document.getElementById("guestForm");
const submitBtn = document.getElementById("submitBtn");
const guestContainer = document.getElementById("guestContainer");

// =====================================
// LOAD UCAPAN
// =====================================

async function loadUcapan() {
  try {
    const res = await fetch(API_URL);
    const data = await res.json();

    guestContainer.innerHTML = "";

    if (!data.length) {
      guestContainer.innerHTML = `
        <div class="empty-message">
          Belum ada ucapan.
        </div>
      `;
      return;
    }

    data.forEach((item) => {
      const card = document.createElement("div");

      card.className = "guest-card";

      card.innerHTML = `
        <div class="guest-header">
          <strong>${escapeHtml(item.nama)}</strong>
        </div>

        <p class="guest-message">
          ${escapeHtml(item.ucapan)}
        </p>

        <small class="guest-time">
          ${item.waktu}
        </small>
      `;

      guestContainer.appendChild(card);
    });
  } catch (err) {
    console.error(err);

    guestContainer.innerHTML = `
      <div class="error-message">
        Gagal memuat ucapan.
      </div>
    `;
  }
}

// =====================================
// KIRIM UCAPAN
// =====================================

form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const nama = document
    .getElementById("nama")
    .value
    .trim();

  const ucapan = document
    .getElementById("ucapan")
    .value
    .trim();

  if (!nama || !ucapan) return;

  // Anti double submit
  submitBtn.disabled = true;
  submitBtn.textContent = "Mengirim...";

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

      form.reset();

      showSuccess();

      await loadUcapan();

    } else {
      alert("Gagal mengirim ucapan.");
    }

  } catch (err) {

    console.error(err);

    alert(
      "Terjadi kesalahan saat mengirim ucapan."
    );

  } finally {

    submitBtn.disabled = false;
    submitBtn.textContent = "Kirim Ucapan";

  }
});

// =====================================
// PESAN BERHASIL
// =====================================

function showSuccess() {

  let existing =
    document.getElementById("successMessage");

  if (existing) {
    existing.remove();
  }

  const msg =
    document.createElement("p");

  msg.id = "successMessage";

  msg.className =
    "success-message";

  msg.innerHTML =
    "Terima kasih atas ucapan &amp; doanya ❤️";

  form.appendChild(msg);

  setTimeout(() => {
    msg.remove();
  }, 5000);
}

// =====================================
// ESCAPE HTML
// =====================================

function escapeHtml(text) {

  const div =
    document.createElement("div");

  div.textContent = text;

  return div.innerHTML;
}

// =====================================
// INIT
// =====================================

loadUcapan();