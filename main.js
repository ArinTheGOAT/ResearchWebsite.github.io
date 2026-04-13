(function () {
  function initNav() {
    var toggle = document.querySelector("[data-nav-toggle]");
    var nav = document.querySelector("[data-nav-panel]");
    if (!toggle || !nav) return;

    function setOpen(open) {
      toggle.setAttribute("aria-expanded", open ? "true" : "false");
      nav.classList.toggle("nav--open", open);
      document.body.classList.toggle("nav-locked", open);
    }

    toggle.addEventListener("click", function () {
      var open = toggle.getAttribute("aria-expanded") === "true";
      setOpen(!open);
    });

    nav.querySelectorAll("a").forEach(function (link) {
      link.addEventListener("click", function () {
        setOpen(false);
      });
    });

    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape") setOpen(false);
    });
  }

  function formatDate(iso) {
    try {
      return new Intl.DateTimeFormat("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      }).format(new Date(iso));
    } catch (e) {
      return iso;
    }
  }

  function renderPaperList(el, papers, limit) {
    if (!el) return;
    var sorted = papers.slice().sort(function (a, b) {
      return new Date(b.date) - new Date(a.date);
    });
    var slice = typeof limit === "number" ? sorted.slice(0, limit) : sorted;
    el.innerHTML = "";
    if (slice.length === 0) {
      el.innerHTML =
        '<li class="empty-state">No papers yet. Edit <code>js/papers-data.js</code> and add a page under <code>articles/</code>.</li>';
      return;
    }
    slice.forEach(function (p) {
      var li = document.createElement("li");
      var a = document.createElement("a");
      a.className = "paper-card";
      a.href = p.href;
      var d = document.createElement("span");
      d.className = "paper-card-date";
      d.textContent = formatDate(p.date);
      var t = document.createElement("span");
      t.className = "paper-card-title";
      t.textContent = p.title;
      a.appendChild(d);
      a.appendChild(t);
      if (p.abstract) {
        var abs = document.createElement("span");
        abs.className = "paper-card-abs";
        abs.textContent = p.abstract;
        a.appendChild(abs);
      }
      if (p.author) {
        var au = document.createElement("span");
        au.className = "paper-card-author";
        au.textContent = p.author;
        a.appendChild(au);
      }
      li.appendChild(a);
      el.appendChild(li);
    });
  }

  document.addEventListener("DOMContentLoaded", function () {
    initNav();
    var papers = window.PAPERS || [];
    renderPaperList(document.getElementById("paper-list-latest"), papers, 4);
    renderPaperList(document.getElementById("paper-list-all"), papers, null);
  });
})();
