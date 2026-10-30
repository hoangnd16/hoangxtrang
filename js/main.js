(function () {
  const W = window.WEDDING;
  const $ = (sel, root = document) => root.querySelector(sel);
  const $$ = (sel, root = document) => [...root.querySelectorAll(sel)];
  const pad = (n) => String(n).padStart(2, "0");
  const esc = (s) =>
    String(s ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]);

  const WEEKDAYS = ["Chủ nhật", "Thứ hai", "Thứ ba", "Thứ tư", "Thứ năm", "Thứ sáu", "Thứ bảy"];

  // Ngày giờ của sự kiện, tính theo giờ Việt Nam bất kể máy khách ở múi giờ nào
  function vnParts(iso) {
    const d = new Date(iso);
    const vn = new Date(d.getTime() + 7 * 3600 * 1000);
    return {
      date: d,
      day: vn.getUTCDate(),
      month: vn.getUTCMonth() + 1,
      year: vn.getUTCFullYear(),
      weekday: vn.getUTCDay(),
      time: `${pad(vn.getUTCHours())}:${pad(vn.getUTCMinutes())}`,
    };
  }

  function lunarText(p) {
    const l = Lunar.solarToLunar(p.day, p.month, p.year);
    return `Tức ngày ${pad(l.day)} tháng ${pad(l.month)}${l.leap ? " (nhuận)" : ""} năm ${Lunar.yearName(l.year)}`;
  }

  const main = vnParts(W.events[W.mainEventIndex].datetime);

  /* ---------- Text bindings ---------- */
  const bindings = {
    "groom.shortName": W.groom.shortName,
    "bride.shortName": W.bride.shortName,
    mainDateDots: `${pad(main.day)} . ${pad(main.month)} . ${main.year}`,
  };
  $$("[data-bind]").forEach((el) => (el.textContent = bindings[el.dataset.bind] ?? ""));
  document.title = `${W.groom.shortName} & ${W.bride.shortName} · Thiệp cưới`;

  /* ---------- Families ---------- */
  $("#families").innerHTML = ["groom", "bride"]
    .map((k) => {
      const f = W.families[k];
      return `<div class="family">
        <h3>${esc(f.label)}</h3>
        <p>${esc(f.father)}</p>
        <p>${esc(f.mother)}</p>
        <small>${esc(f.address)}</small>
      </div>`;
    })
    .join('<div class="families__divider" aria-hidden="true">囍</div>');

  /* ---------- Couple ---------- */
  const person = (p, role) => `
    <article class="person reveal">
      <figure class="person__photo"><img src="${esc(p.photo)}" alt="${esc(role)} ${esc(p.fullName)}" loading="lazy"></figure>
      <p class="eyebrow">${esc(role)}</p>
      <h3 class="script person__name">${esc(p.fullName)}</h3>
      <p class="person__intro">${esc(p.intro)}</p>
    </article>`;
  $("#couple").innerHTML =
    person(W.groom, "Chú rể") + '<div class="couple__and script reveal">&amp;</div>' + person(W.bride, "Cô dâu");

  /* ---------- Quote & story ---------- */
  $("#quoteText").textContent = `“${W.quote.text}”`;
  $("#quoteAuthor").textContent = W.quote.author;
  $("#storyText").textContent = W.story;

  /* ---------- Events ---------- */
  function gcalLink(ev) {
    const start = new Date(ev.datetime);
    const end = new Date(start.getTime() + 3 * 3600 * 1000);
    const fmt = (d) => d.toISOString().replace(/[-:]/g, "").replace(/\.\d{3}/, "");
    const params = new URLSearchParams({
      action: "TEMPLATE",
      text: `${ev.title} ${W.groom.shortName} & ${W.bride.shortName}`,
      dates: `${fmt(start)}/${fmt(end)}`,
      location: `${ev.venue}, ${ev.address.replace(/\s*\n\s*/g, ", ")}`,
    });
    return `https://calendar.google.com/calendar/render?${params}`;
  }

  $("#events").innerHTML = W.events
    .map((ev) => {
      const p = vnParts(ev.datetime);
      return `<article class="event reveal">
        <svg class="event__flower" aria-hidden="true"><use href="#flower"/></svg>
        <p class="eyebrow">${esc(ev.host)}</p>
        <h3 class="event__title">${esc(ev.title)}</h3>
        <div class="event__when">
          <span>${esc(WEEKDAYS[p.weekday])}</span>
          <strong>${pad(p.day)}</strong>
          <span>Tháng ${pad(p.month)}<br>${p.year}</span>
        </div>
        <p class="event__time">Vào lúc ${p.time}</p>
        <p class="event__lunar">${esc(lunarText(p))}</p>
        <p class="event__venue">${esc(ev.venue)}</p>
        <p class="event__address">${esc(ev.address)}</p>
        ${ev.mapEmbed ? `<iframe class="event__map" src="${esc(ev.mapEmbed)}" loading="lazy" referrerpolicy="no-referrer-when-downgrade" title="Bản đồ ${esc(ev.venue)}"></iframe>` : ""}
        <div class="event__actions">
          <a class="btn btn--small" href="${esc(ev.mapUrl)}" target="_blank" rel="noopener">Chỉ đường</a>
          <a class="btn btn--small btn--ghost" href="${gcalLink(ev)}" target="_blank" rel="noopener">Lưu vào lịch</a>
        </div>
      </article>`;
    })
    .join("");

  /* ---------- Calendar ---------- */
  (function renderCalendar() {
    const first = new Date(Date.UTC(main.year, main.month - 1, 1));
    const daysInMonth = new Date(Date.UTC(main.year, main.month, 0)).getUTCDate();
    const offset = (first.getUTCDay() + 6) % 7; // tuần bắt đầu từ thứ hai
    let cells = "";
    for (let i = 0; i < offset; i++) cells += "<span></span>";
    for (let d = 1; d <= daysInMonth; d++) {
      cells += d === main.day ? `<span class="is-day"><b>${d}</b></span>` : `<span>${d}</span>`;
    }
    $("#calendar").innerHTML = `
      <p class="eyebrow">Tháng ${pad(main.month)} · ${main.year}</p>
      <div class="calendar__grid calendar__head">${["T2", "T3", "T4", "T5", "T6", "T7", "CN"].map((d) => `<span>${d}</span>`).join("")}</div>
      <div class="calendar__grid">${cells}</div>
      <p class="calendar__lunar">${esc(lunarText(main))}</p>`;
  })();

  /* ---------- Timeline ---------- */
  $("#timeline").innerHTML = W.timeline
    .map((t) => `<li class="reveal"><time>${esc(t.time)}</time><div><h3>${esc(t.title)}</h3><p>${esc(t.note)}</p></div></li>`)
    .join("");

  /* ---------- Countdown ---------- */
  (function countdown() {
    const target = main.date.getTime();
    const units = Object.fromEntries($$("#timer [data-unit]").map((el) => [el.dataset.unit, el]));
    function tick() {
      let s = Math.max(0, Math.floor((target - Date.now()) / 1000));
      const d = Math.floor(s / 86400);
      s %= 86400;
      units.d.textContent = pad(d);
      units.h.textContent = pad(Math.floor(s / 3600));
      units.m.textContent = pad(Math.floor((s % 3600) / 60));
      units.s.textContent = pad(s % 60);
    }
    tick();
    setInterval(tick, 1000);
  })();

  /* ---------- Gallery + lightbox ---------- */
  $("#gallery").innerHTML = W.gallery
    .map((src, i) => `<button class="gallery__item reveal" type="button" data-index="${i}"><img src="${esc(src)}" alt="Ảnh cưới ${i + 1}" loading="lazy"></button>`)
    .join("");

  (function lightbox() {
    const box = $("#lightbox");
    const img = $("img", box);
    let index = 0;
    const show = (i) => {
      index = (i + W.gallery.length) % W.gallery.length;
      img.src = W.gallery[index];
    };
    const close = () => {
      box.hidden = true;
      document.body.classList.remove("locked");
    };
    $("#gallery").addEventListener("click", (e) => {
      const item = e.target.closest(".gallery__item");
      if (!item) return;
      show(+item.dataset.index);
      box.hidden = false;
      document.body.classList.add("locked");
    });
    $(".lightbox__close", box).onclick = close;
    $(".lightbox__prev", box).onclick = () => show(index - 1);
    $(".lightbox__next", box).onclick = () => show(index + 1);
    box.addEventListener("click", (e) => e.target === box && close());
    document.addEventListener("keydown", (e) => {
      if (box.hidden) return;
      if (e.key === "Escape") close();
      if (e.key === "ArrowLeft") show(index - 1);
      if (e.key === "ArrowRight") show(index + 1);
    });
    let startX = null;
    box.addEventListener("touchstart", (e) => (startX = e.touches[0].clientX), { passive: true });
    box.addEventListener("touchend", (e) => {
      if (startX === null) return;
      const dx = e.changedTouches[0].clientX - startX;
      if (Math.abs(dx) > 40) show(index + (dx < 0 ? 1 : -1));
      startX = null;
    });
  })();

  /* ---------- Gifts ---------- */
  (function gifts() {
    const boxes = $("#giftBoxes");
    const modal = $("#giftModal");
    const card = $("#giftCard");
    const giftIcon = `<svg viewBox="0 0 64 64" aria-hidden="true">
      <rect x="8" y="26" width="48" height="32" rx="3" fill="currentColor"/>
      <rect x="4" y="16" width="56" height="12" rx="3" fill="currentColor" opacity=".85"/>
      <rect x="28" y="16" width="8" height="42" fill="#f1dfbf"/>
      <path d="M32 16c-4-9-15-11-15-4 0 5 9 4 15 4zm0 0c4-9 15-11 15-4 0 5-9 4-15 4z" fill="none" stroke="#f1dfbf" stroke-width="3" stroke-linejoin="round"/>
    </svg>`;

    function open(i) {
      const g = W.gifts[i];
      const qr = `https://img.vietqr.io/image/${encodeURIComponent(g.bankId)}-${encodeURIComponent(g.accountNo)}-compact2.png?accountName=${encodeURIComponent(g.accountName)}&addInfo=${encodeURIComponent("Mung cuoi " + W.groom.shortName + " " + W.bride.shortName)}`;
      card.innerHTML = `
        <p class="eyebrow">Hộp mừng cưới</p>
        <h3 class="gift-card__title" id="giftModalTitle">${esc(g.label)}</h3>
        <img class="gift-card__qr" src="${qr}" alt="Mã QR chuyển khoản ${esc(g.bankName)}">
        <dl>
          <div><dt>Ngân hàng</dt><dd>${esc(g.bankName)}</dd></div>
          <div><dt>Chủ tài khoản</dt><dd>${esc(g.accountName)}</dd></div>
          <div><dt>Số tài khoản</dt><dd>${esc(g.accountNo)}</dd></div>
        </dl>
        <button class="btn btn--small" type="button" data-copy="${esc(g.accountNo)}">Sao chép số tài khoản</button>`;
      modal.showModal();
      document.body.classList.add("locked");
    }

    boxes.innerHTML = W.gifts
      .map(
        (g, i) => `<button class="gift-box reveal" type="button" data-i="${i}">
          <span class="gift-box__icon">${giftIcon}</span>
          <strong>${esc(g.label)}</strong>
          <small>Nhấn để mở</small>
        </button>`
      )
      .join("");
    boxes.addEventListener("click", (e) => {
      const b = e.target.closest(".gift-box");
      if (b) open(+b.dataset.i);
    });

    $(".modal__close", modal).onclick = () => modal.close();
    // Nhấn ra ngoài khung để đóng
    modal.addEventListener("click", (e) => e.target === modal && modal.close());
    modal.addEventListener("close", () => document.body.classList.remove("locked"));

    card.addEventListener("click", async (e) => {
      const b = e.target.closest("[data-copy]");
      if (!b) return;
      // Modal nằm trên toast, nên báo kết quả ngay trên nút
      try {
        await navigator.clipboard.writeText(b.dataset.copy);
        b.textContent = "Đã sao chép ✓";
      } catch {
        b.textContent = "Không sao chép được, bạn ghi lại giúp nhé";
      }
      setTimeout(() => (b.textContent = "Sao chép số tài khoản"), 2000);
    });
  })();

  /* ---------- Toast ---------- */
  let toastTimer;
  function toast(msg) {
    const t = $("#toast");
    t.textContent = msg;
    t.classList.add("is-on");
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => t.classList.remove("is-on"), 2600);
  }

  /* ---------- RSVP & wishes ---------- */
  const LOCAL_KEY = "wedding-wishes";
  const readLocal = () => {
    try {
      return JSON.parse(localStorage.getItem(LOCAL_KEY)) || [];
    } catch {
      return [];
    }
  };
  const writeLocal = (list) => {
    try {
      localStorage.setItem(LOCAL_KEY, JSON.stringify(list));
    } catch {}
  };

  function renderWishes(list) {
    const items = list.filter((w) => w.message && w.message.trim());
    $("#wishList").innerHTML = items.length
      ? items
          .map(
            (w) => `<article class="wish">
              <p>${esc(w.message)}</p>
              <footer><strong>${esc(w.name)}</strong>${w.side ? ` · Khách mời ${w.side === "bride" ? "cô dâu" : "chú rể"}` : ""}</footer>
            </article>`
          )
          .join("")
      : '<p class="muted">Hãy là người đầu tiên gửi lời chúc nhé!</p>';
  }

  async function loadWishes() {
    let remote = [];
    if (W.rsvpEndpoint) {
      try {
        const res = await fetch(W.rsvpEndpoint);
        remote = await res.json();
      } catch {}
    }
    // Lời chúc vừa gửi có thể chưa xuất hiện ngay trên Sheets, nên ghép thêm bản lưu trên máy
    const seen = new Set(remote.map((w) => `${w.name}|${w.message}`));
    const local = readLocal().filter((w) => !seen.has(`${w.name}|${w.message}`));
    renderWishes([...local, ...remote].sort((a, b) => (b.time || 0) - (a.time || 0)));
  }

  const form = $("#rsvpForm");
  form.addEventListener("change", (e) => {
    if (e.target.name === "attend") $("#guestsField").hidden = e.target.value !== "yes";
  });
  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    const data = Object.fromEntries(new FormData(form));
    data.name = data.name.trim();
    data.message = data.message.trim();
    if (!data.name) {
      form.name.focus();
      $("#formStatus").textContent = "Bạn cho chúng mình biết tên nhé.";
      return;
    }
    if (data.attend !== "yes") data.guests = "0";
    data.time = Date.now();

    const btn = $("button[type=submit]", form);
    btn.disabled = true;
    $("#formStatus").textContent = "Đang gửi...";
    try {
      if (W.rsvpEndpoint) {
        await fetch(W.rsvpEndpoint, { method: "POST", mode: "no-cors", body: new URLSearchParams(data) });
      }
      writeLocal([data, ...readLocal()]);
      form.reset();
      $("#guestsField").hidden = false;
      $("#formStatus").textContent =
        data.attend === "yes" ? "Cảm ơn bạn! Hẹn gặp bạn trong ngày vui nhé." : "Cảm ơn lời chúc của bạn, chúng mình rất trân trọng!";
      loadWishes();
    } catch {
      $("#formStatus").textContent = "Gửi chưa thành công, bạn thử lại giúp chúng mình nhé.";
    } finally {
      btn.disabled = false;
    }
  });

  loadWishes();

  /* ---------- Music ---------- */
  const audio = $("#bgm");
  const musicBtn = $("#musicBtn");
  if (W.music) {
    audio.src = W.music;
    musicBtn.hidden = false;
    musicBtn.onclick = () => (audio.paused ? audio.play() : audio.pause());
    audio.addEventListener("play", () => musicBtn.classList.add("is-playing"));
    audio.addEventListener("pause", () => musicBtn.classList.remove("is-playing"));
  }

  /* ---------- Decorations ---------- */
  const reduceMotion = matchMedia("(prefers-reduced-motion: reduce)").matches;

  $$(".title").forEach((t) =>
    t.insertAdjacentHTML("afterend", '<svg class="flourish reveal" aria-hidden="true"><use href="#flourish"/></svg>')
  );
  $$("[data-deco=corners]").forEach((s) =>
    s.insertAdjacentHTML(
      "afterbegin",
      '<svg class="deco deco--tl" aria-hidden="true"><use href="#sprig"/></svg><svg class="deco deco--tr" aria-hidden="true"><use href="#sprig"/></svg>'
    )
  );

  function startPetals() {
    if (reduceMotion) return;
    const layer = document.createElement("div");
    layer.className = "petals";
    layer.setAttribute("aria-hidden", "true");
    const rand = (min, max) => min + Math.random() * (max - min);
    for (let i = 0; i < 16; i++) {
      const p = document.createElement("span");
      p.className = "petal";
      p.style.cssText = `--x:${rand(0, 100)}%;--d:${rand(9, 16)}s;--delay:${rand(-16, 0)}s;--s:${rand(0.6, 1.2)};--sway:${rand(-60, 60)}px`;
      layer.appendChild(p);
    }
    document.body.appendChild(layer);
  }

  /* ---------- Envelope ---------- */
  $("#openInvite").addEventListener("click", () => {
    $("#envelope").classList.add("is-open");
    document.body.classList.remove("locked");
    document.body.classList.add("is-opened");
    if (W.music) audio.play().catch(() => {});
    startPetals();
    setTimeout(() => $("#envelope").remove(), 1200);
  });

  /* ---------- Reveal on scroll ---------- */
  const io = new IntersectionObserver(
    (entries) =>
      entries.forEach((en) => {
        if (en.isIntersecting) {
          en.target.classList.add("is-visible");
          io.unobserve(en.target);
        }
      }),
    { threshold: 0.15 }
  );
  $$(".reveal").forEach((el) => io.observe(el));
})();
