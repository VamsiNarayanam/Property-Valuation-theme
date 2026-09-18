
(function () {
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const $ = (sel, root = document) => root.querySelector(sel);
  const $$ = (sel, root = document) => Array.from(root.querySelectorAll(sel));

  const pre = $("#preloader");
  if (pre) {
    const bar = pre.querySelector(".meter > span");
    const num = pre.querySelector("[data-meter]");
    const word = pre.querySelector("[data-pre-word]");
    const stage = pre.querySelector("[data-pre-stage]");
    const beats = [
      { word: "Measure", stage: "Opening desk" },
      { word: "Number", stage: "Filing jacket" },
      { word: "Sign", stage: "Signing cover" },
    ];
    let beat = 0;
    let p = 0;
    let wordTimer = 0;
    const setBeat = (i) => {
      const next = beats[i % beats.length];
      if (!next) return;
      if (word) {
        word.classList.add("is-swap");
        clearTimeout(wordTimer);
        wordTimer = setTimeout(() => {
          word.textContent = next.word;
          word.classList.remove("is-swap");
        }, reduce ? 0 : 180);
      }
      if (stage) stage.textContent = next.stage;
    };
    setBeat(0);
    const finish = () => {
      if (pre.classList.contains("is-done")) return;
      p = 100;
      if (bar) bar.style.width = "100%";
      if (num) num.textContent = "100";
      setBeat(2);
      pre.classList.add("is-done");
      pre.setAttribute("aria-hidden", "true");
      document.body.classList.remove("is-loading");
    };
    const tick = () => {
      if (reduce) {
        finish();
        return;
      }
      p = Math.min(100, p + 4.2 + Math.random() * 6.5);
      if (bar) bar.style.width = p + "%";
      if (num) num.textContent = String(Math.floor(p)).padStart(2, "0");
      const nextBeat = p < 34 ? 0 : p < 72 ? 1 : 2;
      if (nextBeat !== beat) {
        beat = nextBeat;
        setBeat(beat);
      }
      if (p >= 100) {
        setTimeout(finish, 220);
      } else {
        setTimeout(() => requestAnimationFrame(tick), 48);
      }
    };
    window.addEventListener("load", () => setTimeout(tick, reduce ? 0 : 160));
    setTimeout(() => {
      if (!pre.classList.contains("is-done")) finish();
    }, 3200);
  }

  /* Header shrink + drawer ---------------------------------------------- */
  const header = $("#site-header");
  if (header) {
    const onScroll = () => {
      const shrink = window.scrollY > 24;
      header.classList.toggle("is-shrink", shrink);
      document.body.classList.toggle("is-header-shrink", shrink);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
  }
  const drawer = $("#drawer");
  const toggle = $(".nav-toggle");
  const setDrawer = (open) => {
    if (!drawer) return;
    drawer.classList.toggle("is-open", open);
    drawer.setAttribute("aria-hidden", open ? "false" : "true");
    toggle && toggle.classList.toggle("is-active", open);
    toggle && toggle.setAttribute("aria-expanded", open ? "true" : "false");
    toggle && toggle.setAttribute("aria-label", open ? "Close menu" : "Open menu");
    document.body.style.overflow = open ? "hidden" : "";
    if (open) drawer.querySelector("nav a")?.focus();
  };
  toggle?.addEventListener("click", () => setDrawer(!drawer?.classList.contains("is-open")));
  drawer?.addEventListener("click", (e) => {
    if (e.target === drawer) setDrawer(false);
  });
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") setDrawer(false);
  });

  /* AOS ------------------------------------------------------------------ */
  if (window.AOS && !reduce) {
    AOS.init({
      duration: 800,
      easing: "ease-out-cubic",
      once: true,
      offset: 40,
    });
  }

  /* Optional Lenis ------------------------------------------------------- */
  if (window.Lenis && !reduce) {
    const lenis = new Lenis({ duration: 1.1 });
    const raf = (t) => {
      lenis.raf(t);
      requestAnimationFrame(raf);
    };

    /* Hero depth ----------------------------------------------------------- */
    $$(".hero, .inner-hero").forEach((hero) => {
      hero.classList.add("hero-enhanced");
      requestAnimationFrame(() => hero.classList.add("is-ready"));
      if (reduce) return;

      let frame = 0;
      hero.addEventListener("pointermove", (event) => {
        if (event.pointerType === "touch") return;
        cancelAnimationFrame(frame);
        frame = requestAnimationFrame(() => {
          const bounds = hero.getBoundingClientRect();
          const x = ((event.clientX - bounds.left) / bounds.width - 0.5) * 12;
          const y = ((event.clientY - bounds.top) / bounds.height - 0.5) * 8;
          hero.style.setProperty("--hero-x", `${x.toFixed(2)}px`);
          hero.style.setProperty("--hero-y", `${y.toFixed(2)}px`);
        });
      });
      hero.addEventListener("pointerleave", () => {
        hero.style.setProperty("--hero-x", "0px");
        hero.style.setProperty("--hero-y", "0px");
      });
    });
    requestAnimationFrame(raf);
  }

  /* Counters ------------------------------------------------------------- */
  const counters = $$("[data-count]");
  const runCount = (el) => {
    const end = Number(el.getAttribute("data-count"));
    if (reduce) {
      el.textContent = end.toLocaleString("en-IN");
      return;
    }
    const start = performance.now();
    const dur = 900;
    const step = (now) => {
      const t = Math.min(1, (now - start) / dur);
      el.textContent = Math.floor(end * t).toLocaleString("en-IN");
      if (t < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  };
  if (counters.length) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach((en) => {
        if (en.isIntersecting) {
          runCount(en.target);
          io.unobserve(en.target);
        }
      });
    }, { threshold: 0.4 });
    counters.forEach((el) => io.observe(el));
  }

  /* Ticker --------------------------------------------------------------- */
  const track = $("[data-ticker]");
  if (track && window.SPV) {
    const items = SPV.ticker.concat(SPV.ticker);
    track.innerHTML = items
      .map(
        ([id, type, city, status]) =>
          `<span class="ticker-item"><b>${id}</b><span class="sep">·</span>${type}<span class="sep">·</span>${city}<span class="sep">·</span>${status}</span>`
      )
      .join("");
  }

  /* Who commissions — expanding doors ----------------------------------- */
  const lantern = $("[data-lantern]");
  if (lantern && window.SPV) {
    const shell = $("[data-lantern-shell]") || lantern;
    const slides = SPV.lantern;
    const doors = $$(".door", lantern);
    const live = lantern.querySelector("[data-lantern-live]");
    const folio = shell.querySelector("[data-lantern-folio]");
    const prevBtn = shell.querySelector("[data-lantern-prev]");
    const nextBtn = shell.querySelector("[data-lantern-next]");
    let i = 0;
    let timer;

    const paint = () => {
      lantern.classList.remove("is-0", "is-1", "is-2", "is-3");
      lantern.classList.add("is-" + i);
      doors.forEach((d, n) => {
        d.classList.toggle("is-on", n === i);
        d.setAttribute("aria-pressed", n === i ? "true" : "false");
      });
      const s = slides[i];
      if (live) live.textContent = s.kicker + ", door " + (i + 1) + " of 4";
      if (folio) folio.textContent = String(i + 1).padStart(2, "0") + " / 04";
    };

    const go = (n) => {
      i = (n + doors.length) % doors.length;
      paint();
    };
    const stop = () => clearInterval(timer);
    const play = () => {
      stop();
      if (reduce) return;
      timer = setInterval(() => go(i + 1), 6000);
    };

    doors.forEach((d) => {
      const pic = d.querySelector("img");
      if (pic && pic.decode) pic.decode().catch(() => {});
      d.addEventListener("click", () => {
        go(Number(d.dataset.i));
        play();
      });
    });
    prevBtn?.addEventListener("click", () => {
      go(i - 1);
      play();
    });
    nextBtn?.addEventListener("click", () => {
      go(i + 1);
      play();
    });
    lantern.addEventListener("keydown", (e) => {
      if (e.key === "ArrowLeft") {
        go(i - 1);
        play();
      }
      if (e.key === "ArrowRight") {
        go(i + 1);
        play();
      }
    });
    shell.addEventListener("mouseenter", stop);
    shell.addEventListener("mouseleave", play);
    shell.addEventListener("focusin", stop);
    shell.addEventListener("focusout", (e) => {
      if (!shell.contains(e.relatedTarget)) play();
    });
    document.addEventListener("visibilitychange", () => {
      if (document.hidden) stop();
      else play();
    });
    paint();
    play();
  }

  /* Rail from data if empty ---------------------------------------------- */
  const rail = $("[data-rail]");
  if (rail && window.SPV && !rail.children.length) {
    rail.innerHTML = SPV.rail
      .map(
        (r) => `<article class="rail-card" data-aos="fade-up">
          <div class="media"><img src="${r.img}" alt="${r.title}" width="800" height="520" loading="lazy"></div>
          <div class="body">
            <p class="file-id">${r.id} · ${r.year}</p>
            <h3>${r.title}</h3>
            <p>${r.result}</p>
            <p class="scope">${r.scope}</p>
          </div>
        </article>`
      )
      .join("");
  }

  if (rail && rail.children.length) {
    const pin = rail.closest(".rail-pin") || rail;
    const bar = pin.querySelector("[data-rail-bar]");
    const thumb = pin.querySelector("[data-rail-thumb]");
    let railTimer;
    let railIndex = 0;
    let dragging = false;

    const maxScroll = () => Math.max(0, rail.scrollWidth - rail.clientWidth);
    const step = () => {
      const cards = Array.from(rail.children);
      if (!cards.length) return 1;
      return cards[0].getBoundingClientRect().width + (parseFloat(getComputedStyle(rail).gap) || 0);
    };
    const syncThumb = () => {
      if (!bar || !thumb) return;
      const max = maxScroll();
      const trackW = bar.clientWidth;
      const ratio = rail.scrollWidth > 0 ? rail.clientWidth / rail.scrollWidth : 1;
      const thumbW = Math.max(64, Math.min(trackW, trackW * ratio));
      const x = max > 0 ? (rail.scrollLeft / max) * (trackW - thumbW) : 0;
      thumb.style.width = thumbW + "px";
      thumb.style.transform = "translateX(" + x + "px)";
      bar.setAttribute("aria-valuenow", String(Math.round(max > 0 ? (rail.scrollLeft / max) * 100 : 0)));
    };
    const stopRail = () => clearInterval(railTimer);
    const moveRail = () => {
      const cards = Array.from(rail.children);
      if (!cards.length) return;
      railIndex = (railIndex + 1) % cards.length;
      rail.scrollTo({ left: railIndex * step(), behavior: "smooth" });
    };
    const playRail = () => {
      stopRail();
      if (reduce || dragging) return;
      railTimer = setInterval(moveRail, 5000);
    };
    const scrollFromClientX = (clientX) => {
      if (!bar || !thumb) return;
      const rect = bar.getBoundingClientRect();
      const max = maxScroll();
      const thumbW = thumb.getBoundingClientRect().width;
      const usable = Math.max(1, rect.width - thumbW);
      const x = Math.min(usable, Math.max(0, clientX - rect.left - thumbW / 2));
      rail.scrollTo({ left: (x / usable) * max, behavior: "auto" });
    };

    pin.addEventListener("pointerenter", stopRail);
    pin.addEventListener("pointerleave", playRail);
    pin.addEventListener("focusin", stopRail);
    pin.addEventListener("focusout", (e) => {
      if (!pin.contains(e.relatedTarget)) playRail();
    });
    rail.addEventListener("scroll", () => {
      railIndex = Math.round(rail.scrollLeft / step());
      syncThumb();
    }, { passive: true });
    window.addEventListener("resize", syncThumb);

    if (bar && thumb) {
      bar.addEventListener("pointerdown", (e) => {
        if (e.target === thumb) return;
        scrollFromClientX(e.clientX);
      });
      thumb.addEventListener("pointerdown", (e) => {
        dragging = true;
        stopRail();
        thumb.setPointerCapture(e.pointerId);
        scrollFromClientX(e.clientX);
      });
      thumb.addEventListener("pointermove", (e) => {
        if (!dragging) return;
        scrollFromClientX(e.clientX);
      });
      const endDrag = () => {
        if (!dragging) return;
        dragging = false;
        playRail();
      };
      thumb.addEventListener("pointerup", endDrag);
      thumb.addEventListener("pointercancel", endDrag);
      bar.addEventListener("keydown", (e) => {
        if (e.key !== "ArrowLeft" && e.key !== "ArrowRight") return;
        e.preventDefault();
        const dir = e.key === "ArrowRight" ? 1 : -1;
        rail.scrollTo({ left: rail.scrollLeft + dir * step(), behavior: "smooth" });
        playRail();
      });
    }

    document.addEventListener("visibilitychange", () => {
      if (document.hidden) stopRail();
      else playRail();
    });
    syncThumb();
    playRail();
  }

  const board = $("[data-process]");
  if (board && window.SPV) {
    const frames = $$(".traverse-spread img", board);
    const title = board.querySelector("[data-act-title]");
    const copy = board.querySelector("[data-act-copy]");
    const folio = board.querySelector("[data-act-folio]");
    const rows = $$(".traverse-rail button", board);
    let i = 0;
    let timer;
    frames.forEach((img) => {
      if (img.decode) img.decode().catch(() => {});
    });

    const show = (n) => {
      i = (n + rows.length) % rows.length;
      rows.forEach((r, k) => {
        r.classList.toggle("is-on", k === i);
        r.setAttribute("aria-pressed", k === i ? "true" : "false");
      });
      frames.forEach((img, k) => img.classList.toggle("is-show", k === i));
      const s = SPV.process[i];
      if (title) title.textContent = s.title;
      if (copy) copy.textContent = s.copy;
      if (folio) folio.textContent = "Act " + String(i + 1).padStart(2, "0") + " / 04";
    };

    const stop = () => clearInterval(timer);
    const play = () => {
      stop();
      if (reduce) return;
      timer = setInterval(() => show(i + 1), 5500);
    };

    rows.forEach((row, n) => {
      row.setAttribute("aria-pressed", n === 0 ? "true" : "false");
      row.addEventListener("click", () => {
        show(n);
        play();
      });
    });
    board.addEventListener("mouseenter", stop);
    board.addEventListener("mouseleave", play);
    board.addEventListener("focusin", stop);
    board.addEventListener("focusout", (e) => {
      if (!board.contains(e.relatedTarget)) play();
    });
    document.addEventListener("visibilitychange", () => {
      if (document.hidden) stop();
      else play();
    });
    play();
  }

  const years = $("[data-years]");
  if (years) {
    const yearBtns = $$("[data-year]", years);
    const yearFolio = years.closest(".year-folio");
    let yearTimer;
    const setYear = (btn) => {
      if (!btn) return;
      const year = btn.dataset.year;
      const idx = yearBtns.indexOf(btn);
      yearBtns.forEach((b) => {
        const on = b === btn;
        b.classList.toggle("is-on", on);
        b.setAttribute("aria-selected", on ? "true" : "false");
        b.tabIndex = on ? 0 : -1;
      });
      if (yearFolio && yearBtns.length > 1) {
        yearFolio.style.setProperty("--year-fill", String(Math.max(0, idx) / (yearBtns.length - 1)));
      }
      $$("[data-year-panel]").forEach((p) => {
        const on = p.getAttribute("data-year-panel") === year;
        p.classList.toggle("is-on", on);
        p.hidden = !on;
      });
    };
    const stopYear = () => clearInterval(yearTimer);
    const playYear = () => {
      stopYear();
      if (reduce || yearBtns.length < 2) return;
      yearTimer = setInterval(() => {
        const currentIndex = yearBtns.findIndex((btn) => btn.classList.contains("is-on"));
        setYear(yearBtns[(currentIndex + 1) % yearBtns.length]);
      }, 5000);
    };
    const current = yearBtns.find((b) => b.classList.contains("is-on")) || yearBtns[0];
    setYear(current);
    years.addEventListener("click", (e) => {
      const btn = e.target.closest("[data-year]");
      if (!btn) return;
      setYear(btn);
      playYear();
    });
    years.addEventListener("keydown", (e) => {
      const i = yearBtns.indexOf(document.activeElement);
      if (i < 0) return;
      let next = -1;
      if (e.key === "ArrowRight" || e.key === "ArrowDown") next = (i + 1) % yearBtns.length;
      else if (e.key === "ArrowLeft" || e.key === "ArrowUp") next = (i - 1 + yearBtns.length) % yearBtns.length;
      else if (e.key === "Home") next = 0;
      else if (e.key === "End") next = yearBtns.length - 1;
      if (next < 0) return;
      e.preventDefault();
      yearBtns[next].focus();
      setYear(yearBtns[next]);
      playYear();
    });
    years.addEventListener("mouseenter", stopYear);
    years.addEventListener("mouseleave", playYear);
    years.addEventListener("focusin", stopYear);
    years.addEventListener("focusout", (e) => {
      if (!years.contains(e.relatedTarget)) playYear();
    });
    document.addEventListener("visibilitychange", () => {
      if (document.hidden) stopYear();
      else playYear();
    });
    playYear();
  }

  const filters = $("[data-filter]");
  if (filters) {
    filters.addEventListener("click", (e) => {
      const btn = e.target.closest("[data-cat]");
      if (!btn) return;
      $$("[data-cat]", filters).forEach((b) => b.classList.remove("is-on"));
      btn.classList.add("is-on");
      const cat = btn.dataset.cat;
      $$("[data-article]").forEach((card) => {
        const show = cat === "all" || card.dataset.article === cat;
        card.style.display = show ? "" : "none";
        if (show) card.classList.add("aos-animate");
      });
    });
  }

  const toast = $("#toast");
  const showToast = (msg) => {
    if (!toast) return;
    toast.textContent = msg;
    toast.classList.add("is-on");
    setTimeout(() => toast.classList.remove("is-on"), 3200);
  };
  window.spvToast = showToast;

  $$(".faq-list").forEach((list) => {
    const items = $$("details.faq", list);
    items.forEach((item) => {
      item.addEventListener("toggle", () => {
        if (!item.open) return;
        items.forEach((other) => {
          if (other !== item) other.open = false;
        });
      });
    });
  });

  $("[data-news]")?.addEventListener("submit", (e) => {
    e.preventDefault();
    const email = e.target.querySelector('input[type="email"]');
    if (!email.value.trim() || !email.value.includes("@")) {
      showToast("Enter a valid email for the capacity list.");
      return;
    }
    e.target.reset();
    email.value = "";
     window.location.href = "404.html";
  });

  $("[data-contact]")?.addEventListener("submit", (e) => {
    e.preventDefault();
    const form = e.target;
    let ok = true;
    $$("[required]", form).forEach((field) => {
      const err = field.parentElement.querySelector(".field-error");
      const bad = !field.value.trim() || (field.type === "email" && !field.value.includes("@"));
      field.classList.toggle("input-err", bad);
      err?.classList.toggle("is-on", bad);
      if (bad) ok = false;
    });
    if (!ok) {
      showToast("Complete the marked fields before the instruction can be logged.");
      return;
    }
    form.reset();
    window.location.href = "404.html";
  });

  const saveSession = (user) => {
    localStorage.setItem("spv_session", JSON.stringify(user));
  };

  const fieldHost = (field) => field.closest("[data-field]") || field.parentElement;

  $$("[data-pass]").forEach((btn) => {
    btn.addEventListener("click", () => {
      const input = $(btn.getAttribute("data-pass"));
      if (!input) return;
      const show = input.type === "password";
      input.type = show ? "text" : "password";
      btn.textContent = show ? "Hide" : "Show";
    });
  });

  $("[data-forgot]")?.addEventListener("click", () => {
     window.location.href = "404.html";
  });

  $("[data-login]")?.addEventListener("submit", (e) => {
    e.preventDefault();
    const form = e.target;
    const name = form.name.value.trim();
    const email = form.email.value.trim();
    const pass = form.password.value;
    const role = form.role.value;
    let ok = true;
    $$("[required]", form).forEach((field) => {
      if (field.type === "radio") return;
      const err = fieldHost(field).querySelector(".field-error");
      const bad = !field.value.trim() || (field.type === "email" && !field.value.includes("@"));
      field.classList.toggle("input-err", bad);
      err?.classList.toggle("is-on", bad);
      if (bad) ok = false;
    });
    if (pass.length < 6) {
      showToast("Password must be at least 6 characters (demo).");
      ok = false;
    }
    if (!ok) {
      showToast("Complete the marked fields before the session can open.");
      return;
    }
    saveSession({ name: name || email.split("@")[0], email, role });
    location.href = role === "admin" ? "admin-dashboard.html" : "client-dashboard.html";
  });

  $("[data-register]")?.addEventListener("submit", (e) => {
    e.preventDefault();
    const form = e.target;
    const name = form.name.value.trim();
    const email = form.email.value.trim();
    const pass = form.password.value;
    const confirm = form.confirm.value;
    const role = form.role.value;
    const city = form.city?.value.trim() || "";
    const mobile = form.mobile?.value.trim() || "";
    const asset = form.asset?.value || "";
    const terms = form.terms.checked;
    let ok = true;
    $$("[required]", form).forEach((field) => {
      if (field.type === "radio") return;
      const err = fieldHost(field).querySelector(".field-error");
      const bad = field.type === "checkbox" ? !field.checked : !field.value.trim();
      if (field.type === "email") {
        const emailBad = !field.value.includes("@");
        field.classList.toggle("input-err", emailBad);
        err?.classList.toggle("is-on", emailBad);
        if (emailBad) ok = false;
        return;
      }
      field.classList.toggle("input-err", bad);
      err?.classList.toggle("is-on", bad);
      if (bad) ok = false;
    });
    if (pass !== confirm) {
      showToast("Password and confirm do not match.");
      ok = false;
    }
    if (pass.length < 6) {
      showToast("Password must be at least 6 characters.");
      ok = false;
    }
    if (!terms) {
      showToast("Accept the demo terms to open a file.");
      ok = false;
    }
    if (!ok) return;
    localStorage.setItem("spv_registered_user", JSON.stringify({ name, email, pass, role, city, mobile, asset }));
    location.href = "login.html";
  });

  /* Optional GSAP hero line ---------------------------------------------- */
  if (window.gsap && !reduce && $("[data-hero-line]")) {
    gsap.from("[data-hero-line]", { y: 24, opacity: 0, duration: 0.9, ease: "power2.out", delay: 0.15 });
  }

  document.getElementById("y") && (document.getElementById("y").textContent = String(new Date().getFullYear()));

  $("[data-back]")?.addEventListener("click", () => {
    if (window.history.length > 1) window.history.back();
    else location.href = "index.html";
  });
})();
