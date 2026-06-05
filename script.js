// =========================
// OPEN INVITATION
// =========================

const openBtn = document.getElementById("openInvitation");
const welcomeScreen = document.getElementById("welcomeScreen");
const bgMusic = document.getElementById("bgMusic");

if (openBtn) {

    openBtn.addEventListener("click", () => {

        welcomeScreen.style.opacity = "0";

        setTimeout(() => {
            welcomeScreen.style.display = "none";
        }, 900);

        if (bgMusic) {
            bgMusic.play().catch(() => {});
        }

    });
}

// =========================
// COUNTDOWN
// =========================

const targetDate = new Date("June 14, 2026 15:00:00");

function updateCountdown() {

    const timer = document.getElementById("timer");

    if (!timer) return;

    const now = new Date();
    const diff = targetDate - now;

    if (diff <= 0) {

        timer.innerHTML = `
            <div class="glass-card">
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
        <div class="time-box">
            <span>${days}</span>
            <small>Օր</small>
        </div>

        <div class="time-box">
            <span>${hours}</span>
            <small>Ժամ</small>
        </div>

        <div class="time-box">
            <span>${minutes}</span>
            <small>Րոպե</small>
        </div>

        <div class="time-box">
            <span>${seconds}</span>
            <small>Վայրկյան</small>
        </div>
    `;
}

updateCountdown();
setInterval(updateCountdown, 1000);

// =========================
// CALENDAR
// =========================

const calendarDays =
    document.getElementById("calendarDays");

if (calendarDays) {

    for (let i = 1; i <= 30; i++) {

        const day = document.createElement("div");

        day.className = "day";

        if (i === 14) {

            day.innerHTML = `
                <div class="wedding-day">
                    ❤️ ${i}
                </div>
            `;

        } else {

            day.textContent = i;
        }

        calendarDays.appendChild(day);
    }
}

// =========================
// REVEAL ANIMATION
// =========================

const reveals =
    document.querySelectorAll(".reveal");

const revealObserver =
    new IntersectionObserver(
        (entries) => {

            entries.forEach(entry => {

                if (entry.isIntersecting) {

                    entry.target.classList.add("active");
                }

            });

        },
        {
            threshold: 0.15
        });

reveals.forEach(el => {
    revealObserver.observe(el);
});

// =========================
// RSVP MODAL
// =========================

const modal =
    document.getElementById("rsvpModal");

const showModalBtn =
    document.getElementById("showModalBtn");

const closeModalBtn =
    document.getElementById("closeModalBtn");

if (showModalBtn) {

    showModalBtn.onclick = () => {
        modal.style.display = "flex";
    };
}

if (closeModalBtn) {

    closeModalBtn.onclick = () => {
        modal.style.display = "none";
    };
}

window.addEventListener("click", (e) => {

    if (e.target === modal) {
        modal.style.display = "none";
    }

});

// =========================
// RSVP OPTIONS
// =========================

let currentStatus = "Այո";

document
    .querySelectorAll(".option")
    .forEach(btn => {

        btn.addEventListener("click", () => {

            document
                .querySelectorAll(".option")
                .forEach(x => x.classList.remove("active"));

            btn.classList.add("active");

            currentStatus =
                btn.dataset.val;

            const countBox =
                document.getElementById("countBox");

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

        const name =
            document.getElementById("guestName")
                .value
                .trim();

        const guestCount =
            document.getElementById("guestCount")
                .value;

        const guestWish =
            document.getElementById("guestWish")
                .value;

        if (!name) {

            alert("Խնդրում ենք գրել Ձեր անունը");

            return;
        }

        sendBtn.disabled = true;
        sendBtn.innerHTML = "Ուղարկվում է...";

        const message = `
💍 Նոր հյուր

👤 Անուն: ${name}

✅ Պատասխան: ${currentStatus}

👥 Հյուրերի քանակ: ${guestCount}

💌 Մաղթանք:
${guestWish}
`;

        try {

            const response = await fetch(
                "https://wedding-rsvp-api.arman-gomcyan21.workers.dev/",
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({
                        name,
                        status: currentStatus,
                        count: guestCount,
                        wish: guestWish
                    })
                }
            );

            const data = await response.json();

            console.log(data);

            if (data.ok) {

                let saved = JSON.parse(localStorage.getItem("rsvps") || "[]");

                saved.push({
                    name,
                    status: currentStatus,
                    count: guestCount,
                    wish: guestWish,
                    time: new Date().toLocaleString()
                });

                localStorage.setItem("rsvps", JSON.stringify(saved));

                sendBtn.innerHTML = "Հաստատված է ✅";

                setTimeout(() => {

                    modal.style.display = "none";

                    document.getElementById("guestName").value = "";
                    document.getElementById("guestWish").value = "";
                    document.getElementById("guestCount").value = 1;

                    sendBtn.innerHTML = "Հաստատել";
                    sendBtn.disabled = false;

                }, 1500);

            } else {

                alert("Telegram Error");

                sendBtn.innerHTML = "Հաստատել";
                sendBtn.disabled = false;
            }

        } catch (error) {

            console.error(error);

            alert("Ուղարկումը ձախողվեց");

            sendBtn.innerHTML = "Հաստատել";
            sendBtn.disabled = false;
        }

    };

}
// =========================
// MUSIC BUTTON
// =========================

const musicBtn =
    document.getElementById("musicToggle");

if (musicBtn && bgMusic) {

    musicBtn.addEventListener(
        "click",
        () => {

            if (bgMusic.paused) {

                bgMusic.play();

                musicBtn.innerHTML =
                    "🎵";

            } else {

                bgMusic.pause();

                musicBtn.innerHTML =
                    "🔇";
            }

        });

}


const adminBtn = document.getElementById("adminBtn");
const adminPanel = document.getElementById("adminPanel");
const closeAdminBtn = document.getElementById("closeAdminBtn");
const adminContent = document.getElementById("adminContent");
const clearDataBtn = document.getElementById("clearDataBtn");

function loadAdminData() {
    let data = JSON.parse(localStorage.getItem("rsvps") || "[]");

    if (data.length === 0) {
        adminContent.innerHTML = "<p>Տվյալներ չկան</p>";
        return;
    }

    adminContent.innerHTML = data.map((g, i) => `
        <div class="admin-row">
            <b>#${i + 1} ${g.name}</b><br>
            Պատասխան: ${g.status}<br>
            Հյուրեր: ${g.count}<br>
            Մաղթանք: ${g.wish}<br>
            Ժամ: ${g.time}
        </div>
    `).join("");
}

// open admin (password protected)
adminBtn.addEventListener("click", () => {
    const pass = prompt("Enter admin password:");
    if (pass === "Arm_wedding1505") {
        loadAdminData();
        adminPanel.style.display = "flex";
    } else {
        alert("Wrong password");
    }
});

// close
closeAdminBtn.onclick = () => {
    adminPanel.style.display = "none";
};

// clear data
clearDataBtn.onclick = () => {
    if (confirm("Մաքրե՞լ բոլոր տվյալները")) {
        localStorage.removeItem("rsvps");
        loadAdminData();
    }
};

window.history.scrollRestoration = "manual";

window.onload = () => {
    window.scrollTo(0, 0);
};