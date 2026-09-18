(function () {
  const session = JSON.parse(localStorage.getItem("spv_session") || "null");
  const pageRole = document.body.getAttribute("data-role");
  if (!session) {
    location.href = "login.html";
    return;
  }
  if (pageRole && session.role !== pageRole) {
    location.href = session.role === "admin" ? "admin-dashboard.html" : "client-dashboard.html";
    return;
  }

  const tidyName = (raw, email) => {
    let name = String(raw || "").trim().replace(/\s+/g, " ");
    if (!name || name.includes("@")) name = String(email || "").split("@")[0].replace(/[._-]+/g, " ");
    name = name.replace(/[\p{L}\p{M}]+/gu, (word) => word.charAt(0).toLocaleUpperCase("en-IN") + word.slice(1).toLocaleLowerCase("en-IN"));
    return name || "Client";
  };
  const initialsFor = (name) => {
    const parts = name.split(" ").filter(Boolean);
    const letters = (parts[0]?.[0] || "S") + (parts[1]?.[0] || parts[0]?.[1] || "V");
    return letters.toUpperCase();
  };
  const displayName = tidyName(session.name, session.email);
  const mail = String(session.email || "").trim().toLowerCase();
  const whoName = document.querySelector("[data-who-name]");
  const whoMail = document.querySelector("[data-who-mail]");
  const whoMark = document.querySelector("[data-who-initials]");
  const who = document.querySelector("[data-who]");
  if (whoName) whoName.textContent = displayName;
  if (whoMail) whoMail.textContent = mail;
  if (whoMark) whoMark.textContent = initialsFor(displayName);
  if (who) who.setAttribute("title", displayName + " · " + mail);

  document.querySelectorAll("[data-logout]").forEach((btn) => {
    btn.addEventListener("click", () => {
      localStorage.removeItem("spv_session");
      location.href = "login.html";
    });
  });

  const toast = (msg) => {
    let el = document.querySelector(".toast");
    if (!el) {
      el = document.createElement("div");
      el.className = "toast";
      document.body.appendChild(el);
    }
    el.textContent = msg;
    el.classList.add("is-on");
    clearTimeout(toast._t);
    toast._t = setTimeout(() => el.classList.remove("is-on"), 2800);
  };

  const buttons = document.querySelectorAll(".side-nav [data-panel]");
  const panels = document.querySelectorAll(".panel");
  const title = document.querySelector("[data-panel-title]");
  const activate = (id) => {
    buttons.forEach((b) => b.classList.toggle("is-on", b.dataset.panel === id));
    panels.forEach((p) => p.classList.toggle("is-on", p.id === "panel-" + id));
    if (title) title.textContent = document.querySelector('.side-nav [data-panel="' + id + '"]')?.textContent || "Overview";
    document.querySelector(".dash-main")?.scrollTo(0, 0);
    closeSide();
  };
  buttons.forEach((b) => b.addEventListener("click", () => activate(b.dataset.panel)));

  const side = document.querySelector(".dash-side");
  const scrim = document.querySelector(".dash-scrim");
  const burger = document.querySelector(".dash-burger");
  const closeSide = () => {
    side?.classList.remove("is-open");
    scrim?.classList.remove("is-on");
  };
  burger?.addEventListener("click", () => {
    side?.classList.add("is-open");
    scrim?.classList.add("is-on");
  });
  scrim?.addEventListener("click", closeSide);
  document.querySelector("[data-side-close]")?.addEventListener("click", closeSide);

  document.querySelectorAll("[data-compose]").forEach((form) => {
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      form.reset();
      location.href = "404.html";
    });
  });
  document.querySelectorAll("[data-save]").forEach((form) => {
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      location.href = "404.html";
    });
  });
  document.querySelectorAll("[data-demo-toast]").forEach((btn) => {
    btn.addEventListener("click", () => toast(btn.getAttribute("data-demo-toast")));
  });
  document.querySelectorAll("[data-go-404]").forEach((btn) => {
    btn.addEventListener("click", () => {
      location.href = "404.html";
    });
  });
})();
