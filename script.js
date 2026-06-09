// =========================
// OPEN INVITATION
// =========================
const openBtn = document.getElementById("openInvitation");
const welcomeScreen = document.getElementById("welcomeScreen");
const musicBtn = document.getElementById("musicToggle");
const bgMusic = document.getElementById("bgMusic");

if (openBtn) {
    openBtn.addEventListener("click", () => {
        welcomeScreen.style.opacity = "0";
        welcomeScreen.style.transform = "scale(1.02)";
        welcomeScreen.style.pointerEvents = "none";

        document.body.style.overflow = "auto";
        document.documentElement.style.overflow = "auto";

        setTimeout(() => {
            welcomeScreen.style.display = "none";
        }, 900);

        if (bgMusic) {
            bgMusic.play().then(() => {
                if (musicBtn) {
                    musicBtn.innerHTML = "🎵";
                    musicBtn.classList.add("playing");
                }
            }).catch(() => {});
        }
    });
}

// =========================
// COUNTDOWN
// =========================
const targetDate = new Date("July 29, 2026 15:00:00");

function updateCountdown() {
    const timer = document.getElementById("timer");
    if (!timer) return;

    const now = new Date();
    const diff = targetDate - now;

    if (diff <= 0) {
        timer.innerHTML = `
            <div class="glass-card" style="width:100%; text-align:center;">
                💖 ՀԱՐՍԱՆԻՔԸ ՍԿՍՎԵԼ Է 💖
            </div>
        `;
        return;
    }

    const days = Math.floor(diff / 86400000);
    const hours = Math.floor((diff % 86400000) / 3600000);
    const minutes = Math.floor((diff % 3600000) / 60000);
    const seconds = Math.floor((diff % 60000) / 1000);

    timer.innerHTML = `
        <div class="time-box"><span>${days}</span><small>Օր</small></div>
        <div class="time-box"><span>${hours}</span><small>Ժամ</small></div>
        <div class="time-box"><span>${minutes}</span><small>Րոպե</small></div>
        <div class="time-box"><span>${seconds}</span><small>Վայրկյան</small></div>
    `;
}
updateCountdown();
setInterval(updateCountdown, 1000);

// =========================
// CALENDAR
// =========================
const calendarDays = document.getElementById("calendarDays");
if (calendarDays) {
    calendarDays.innerHTML = "";
    const firstDayOffset = 2; // Չորեքշաբթի

    for (let i = 0; i < firstDayOffset; i++) {
        const empty = document.createElement("div");
        empty.className = "day empty";
        calendarDays.appendChild(empty);
    }

    for (let i = 1; i <= 31; i++) {
        const day = document.createElement("div");
        day.className = "day";

        if (i === 29) {
            day.innerHTML = `<div class="wedding-day">${i}</div>`;
        } else {
            day.textContent = i;
        }
        calendarDays.appendChild(day);
    }
}

// =========================
// RSVP MODAL
// =========================
const modal = document.getElementById("rsvpModal");
const showModalBtn = document.getElementById("showModalBtn");
const closeModalBtn = document.getElementById("closeModalBtn");

if (showModalBtn) {
    showModalBtn.onclick = () => { modal.style.display = "flex"; };
}
if (closeModalBtn) {
    closeModalBtn.onclick = () => { modal.style.display = "none"; };
}
window.addEventListener("click", (e) => {
    if (e.target === modal) { modal.style.display = "none"; }
});

// =========================
// RSVP OPTIONS
// =========================
let currentStatus = "Այո";
document.querySelectorAll(".option").forEach(btn => {
    btn.addEventListener("click", () => {
        document.querySelectorAll(".option").forEach(x => x.classList.remove("active"));
        btn.classList.add("active");

        currentStatus = btn.dataset.val;
        const countBox = document.getElementById("countBox");

        if (currentStatus === "Այո") {
            countBox.style.display = "block";
        } else {
            countBox.style.display = "none";
        }
    });
});

// =========================
// RSVP SEND
// =========================
const sendBtn = document.getElementById("sendBtn");
if (sendBtn) {
    sendBtn.onclick = async () => {
        const nameInput = document.getElementById("guestName");
        const name = nameInput ? nameInput.value.trim() : "";
        const guestCount = currentStatus === "Այո" ? document.getElementById("guestCount").value : 0;
        const guestWish = document.getElementById("guestWish").value;

        if (!name) {
            alert("Խնդրում ենք գրել Ձեր անունը");
            return;
        }

        const nameRegex = /^[a-zA-Zа-яА-ЯԱ-Ֆա-ֆև\s]+$/;
        if (!nameRegex.test(name)) {
            alert("Անունը կարող է պարունակել միայն տառեր");
            return;
        }

        sendBtn.disabled = true;
        sendBtn.innerHTML = "Ուղարկվում է...";

        try {
            const response = await fetch(
                "https://styop-wedding.arman-gomcyan21.workers.dev/",
                {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        name,
                        status: currentStatus,
                        count: guestCount,
                        wish: guestWish
                    })
                }
            );

            const data = await response.json();
            if (data.ok) {
                const popup = document.getElementById("successPopup");
                if (popup) {
                    popup.style.display = "block";
                    setTimeout(() => { popup.style.display = "none"; }, 4000);
                }
                modal.style.display = "none";
                if (nameInput) nameInput.value = "";
                document.getElementById("guestWish").value = "";
            } else {
                alert("Սխալ տեղի ունեցավ, նորից փորձեք։");
            }
        } catch (error) {
            console.error(error);
            alert("Կապի սխալ։");
        } finally {
            sendBtn.disabled = false;
            sendBtn.innerHTML = "Հաստատել";
        }
    };
}

// =========================
// MUSIC TOGGLE BUTTON
// =========================
if (musicBtn && bgMusic) {
    musicBtn.addEventListener("click", () => {
        if (bgMusic.paused) {
            bgMusic.play();
            musicBtn.innerHTML = "🎵";
            musicBtn.classList.add("playing");
        } else {
            bgMusic.pause();
            musicBtn.innerHTML = "🔇";
            musicBtn.classList.remove("playing");
        }
    });
}
