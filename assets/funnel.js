(function () {
  "use strict";

  var DESCRIPTOR = "PAWPOCKETCLUB*MEMBER";

  var VERSIONS = {
    a: {
      id: "a",
      vipToday: 29.99,
      guestToday: 49.99,
      renewal: 29.99,
      annual: 149,
      annualSave: 210.88,
      extraKit: 19.99,
      downgrade: 9.99,
      downgradeName: "QR-Tag & Med-Card Vault",
      clubName: "PawPocket Club",
      cancelPath: "cancel.html",
      upsellPath: "upsell.html",
      thanksPath: "thank-you.html",
      storageKey: "pawpocket.a",
      logKey: "pawpocket.consentLog.a"
    },
    b: {
      id: "b",
      vipToday: 29.99,
      guestToday: 49.99,
      renewal: 19.99,
      annual: 99,
      annualSave: 140.88,
      extraKit: 19.99,
      downgrade: 7.99,
      downgradeName: "QR-Tag & Wallet-ID Vault",
      clubName: "PawPocket Digital Club",
      cancelPath: "cancel.html",
      upsellPath: "upsell.html",
      thanksPath: "thank-you.html",
      storageKey: "pawpocket.b",
      logKey: "pawpocket.consentLog.b"
    }
  };

  function cfg() {
    return VERSIONS[document.body.dataset.version] || null;
  }

  function money(n) {
    return "$" + (Math.round(Number(n) * 100) / 100).toFixed(2);
  }

  function cents(n) {
    return Math.round(Number(n) * 100);
  }

  function addDays(days) {
    var d = new Date();
    d.setHours(12, 0, 0, 0);
    d.setDate(d.getDate() + days);
    return d;
  }

  function formatLong(d) {
    return d.toLocaleDateString("en-US", {
      weekday: "long",
      month: "long",
      day: "numeric",
      year: "numeric"
    });
  }

  function isoDate(d) {
    var y = d.getFullYear();
    var m = String(d.getMonth() + 1).padStart(2, "0");
    var day = String(d.getDate()).padStart(2, "0");
    return y + "-" + m + "-" + day;
  }

  function makeId(prefix) {
    var alphabet = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
    var bytes = new Uint8Array(8);
    if (window.crypto && crypto.getRandomValues) crypto.getRandomValues(bytes);
    else for (var i = 0; i < bytes.length; i++) bytes[i] = Math.floor(Math.random() * 256);
    var s = "";
    for (var j = 0; j < bytes.length; j++) s += alphabet[bytes[j] % alphabet.length];
    return prefix + "-" + s;
  }

  function readJSON(key) {
    try {
      return JSON.parse(sessionStorage.getItem(key) || "null");
    } catch (e) {
      return null;
    }
  }

  function writeJSON(key, value) {
    sessionStorage.setItem(key, JSON.stringify(value));
  }

  function rootPrefix() {
    return document.body.dataset.root || "";
  }

  function mountBar() {
    var params = new URLSearchParams(location.search);
    if (params.get("bar") === "1") sessionStorage.setItem("pawpocket.bar", "1");
    if (params.get("clean") === "1") sessionStorage.removeItem("pawpocket.bar");
    if (sessionStorage.getItem("pawpocket.bar") !== "1") return;

    var root = rootPrefix();
    var bar = document.createElement("div");
    bar.className = "preview-bar";
    bar.setAttribute("role", "region");
    bar.setAttribute("aria-label", "Funnel switcher");
    bar.innerHTML =
      '<p class="preview-line">' +
      '<span class="preview-kicker">Funnel Switcher:</span> ' +
      '<a href="' + root + 'index.html">Hub</a>' +
      ' <span class="preview-sep" aria-hidden="true">|</span> ' +
      '<a href="' + root + 'advertorial.html">Version A Full Vet ($29.99/mo)</a>' +
      ' <span class="preview-sep" aria-hidden="true">|</span> ' +
      '<a href="' + root + 'lite/advertorial.html">Version B Fast-Launch ($19.99/mo)</a>' +
      ' <span class="preview-sep" aria-hidden="true">|</span> ' +
      '<a href="' + root + 'tag.html">Live QR Tag</a>' +
      '<button type="button" class="preview-x" data-dismiss aria-label="Dismiss funnel switcher">×</button>' +
      "</p>";
    document.body.insertBefore(bar, document.body.firstChild);
    bar.querySelector("[data-dismiss]").addEventListener("click", function () {
      sessionStorage.removeItem("pawpocket.bar");
      bar.remove();
    });
  }

  function initTabs() {
    document.querySelectorAll("[data-tabs]").forEach(function (wrap) {
      var tabs = Array.prototype.slice.call(wrap.querySelectorAll('[role="tab"]'));
      var panels = Array.prototype.slice.call(wrap.querySelectorAll('[role="tabpanel"]'));
      function select(id) {
        tabs.forEach(function (tab) {
          var on = tab.getAttribute("aria-controls") === id;
          tab.setAttribute("aria-selected", on ? "true" : "false");
          tab.tabIndex = on ? 0 : -1;
        });
        panels.forEach(function (panel) {
          panel.hidden = panel.id !== id;
        });
      }
      tabs.forEach(function (tab, index) {
        tab.addEventListener("click", function () {
          select(tab.getAttribute("aria-controls"));
        });
        tab.addEventListener("keydown", function (e) {
          if (e.key !== "ArrowRight" && e.key !== "ArrowLeft") return;
          e.preventDefault();
          var next = e.key === "ArrowRight" ? (index + 1) % tabs.length : (index - 1 + tabs.length) % tabs.length;
          tabs[next].focus();
          select(tabs[next].getAttribute("aria-controls"));
        });
      });
    });
  }

  function initGallery() {
    var gallery = document.querySelector("[data-gallery]");
    if (!gallery) return;
    var main = gallery.querySelector("[data-gallery-main]");
    gallery.querySelectorAll("[data-full]").forEach(function (btn) {
      btn.addEventListener("click", function () {
        var full = btn.getAttribute("data-full");
        var fallback = btn.getAttribute("data-fallback");
        main.src = fallback || full;
        var picture = main.closest("picture");
        if (picture) {
          var source = picture.querySelector("source");
          if (source && full) source.srcset = full;
        }
        main.alt = btn.getAttribute("data-alt") || "";
        gallery.querySelectorAll("[data-full]").forEach(function (b) {
          b.classList.toggle("is-active", b === btn);
        });
      });
    });
  }

  function consentParts(version, whenLabel) {
    if (version.id === "a") {
      return {
        before: "I agree that today's $29.99 charge is for the Calm & Safe Kit and includes 30 days of PawPocket Club. The membership then renews at $29.99/mo beginning " + whenLabel + ". Recurring charges appear on my statement as " + DESCRIPTOR + ". I can cancel in one click any time before that date at ",
        link: version.cancelPath,
        after: ". PawPocket Club is a wellness membership, not pet insurance."
      };
    }
    return {
      before: "I agree that today's $29.99 charge is for the Calm & Safe Kit and includes 30 days of PawPocket Digital Club on Whop. The membership then renews at $19.99/mo beginning " + whenLabel + ". Recurring charges appear on my statement as " + DESCRIPTOR + ". I can cancel in one click any time before that date at ",
      link: version.cancelPath,
      after: ". PawPocket Club is a wellness membership, not pet insurance. The helper inside this club is AI educational guidance only — not a licensed veterinarian, diagnosis, or emergency replacement."
    };
  }

  function renderLogEntry(entry) {
    var art = document.createElement("article");
    art.className = "log-entry";
    var rows = [
      ["Plan", entry.plan],
      ["Receipt ID", entry.receiptId],
      ["Accepted at (ISO)", entry.acceptedAt],
      ["Recurring box accepted", entry.checkboxAccepted ? "Yes" : "No"],
      ["Renewal amount", entry.renewalDisplay || "None"],
      ["First billing date", entry.firstBillingLabel || "None"],
      ["Statement descriptor", entry.descriptor || "None"],
      ["Cancel link", entry.cancelUrl || "None"],
      ["Exact consent text accepted", entry.consentText]
    ];
    var dl = document.createElement("dl");
    rows.forEach(function (row) {
      var dt = document.createElement("dt");
      dt.textContent = row[0];
      var dd = document.createElement("dd");
      dd.textContent = String(row[1]);
      dl.appendChild(dt);
      dl.appendChild(dd);
    });
    art.appendChild(dl);
    return art;
  }

  function initCheckout() {
    var form = document.querySelector("[data-checkout]");
    var version = cfg();
    if (!form || !version) return;

    var radios = Array.prototype.slice.call(form.querySelectorAll('input[name="plan"]'));
    var consent = document.getElementById("consent-check");
    var panel = document.getElementById("consent-panel");
    var copy = document.getElementById("consent-copy");
    var error = document.getElementById("checkout-error");
    var duePlan = document.getElementById("due-plan");
    var dueToday = document.getElementById("due-today");
    var dueRenew = document.getElementById("due-renew");
    var first = addDays(30);
    var whenLabel = formatLong(first);
    var parts = consentParts(version, whenLabel);

    function renderConsent() {
      copy.textContent = "";
      copy.appendChild(document.createTextNode(parts.before));
      var a = document.createElement("a");
      a.href = parts.link;
      a.textContent = parts.link;
      copy.appendChild(a);
      copy.appendChild(document.createTextNode(parts.after));
    }

    function exactConsentText() {
      return copy.innerText.replace(/\s+/g, " ").trim();
    }

    function clearError() {
      error.hidden = true;
      error.textContent = "";
    }

    function showError(msg) {
      error.hidden = false;
      error.textContent = msg;
    }

    function resetPlans() {
      radios.forEach(function (r) { r.checked = false; });
      if (consent) consent.checked = false;
      if (panel) panel.hidden = true;
      clearError();
      if (duePlan) duePlan.textContent = "None yet";
      if (dueToday) dueToday.textContent = "—";
      if (dueRenew) dueRenew.textContent = "Choose VIP or Guest";
      syncExpress();
    }

    renderConsent();
    resetPlans();
    window.addEventListener("pageshow", function (event) {
      if (event.persisted) resetPlans();
    });

    function openLog(forceContinue) {
      var drawer = document.getElementById("log-drawer");
      var body = document.getElementById("log-body");
      var cont = document.getElementById("log-continue");
      var log = readJSON(version.logKey) || [];
      body.textContent = "";
      if (!log.length) {
        var p = document.createElement("p");
        p.textContent = "No consent captured yet. Complete a VIP or Guest order on this page. The exact text, ISO timestamp, and receipt ID will land here.";
        body.appendChild(p);
      } else {
        log.slice().reverse().forEach(function (entry) {
          body.appendChild(renderLogEntry(entry));
        });
      }
      if (cont) {
        cont.hidden = !(forceContinue || log.length);
        cont.onclick = function () { window.location.href = version.upsellPath; };
      }
      drawer.hidden = false;
      var heading = document.getElementById("log-title");
      if (heading) heading.focus();
    }

    radios.forEach(function (radio) {
      radio.addEventListener("change", function () {
        clearError();
        var vip = radio.value === "vip" && radio.checked;
        panel.hidden = !vip;
        if (!vip && consent) consent.checked = false;
        if (radio.value === "vip") {
          duePlan.textContent = "VIP";
          dueToday.textContent = money(version.vipToday);
          dueRenew.textContent = money(version.renewal) + "/mo starting " + whenLabel;
        } else {
          duePlan.textContent = "Guest";
          dueToday.textContent = money(version.guestToday);
          dueRenew.textContent = "No renewal. One-time kit purchase.";
        }
        syncExpress();
      });
    });
    if (consent) consent.addEventListener("change", syncExpress);
    form.querySelectorAll("[data-express]").forEach(function (btn) {
      btn.addEventListener("click", function () {
        if (btn.disabled) return;
        if (typeof form.requestSubmit === "function") form.requestSubmit();
        else form.dispatchEvent(new Event("submit", { cancelable: true, bubbles: true }));
      });
    });
    function syncExpress() {
      var selected = form.querySelector('input[name="plan"]:checked');
      var ready = !!(selected && (selected.value === "guest" || (consent && consent.checked)));
      form.querySelectorAll("[data-express]").forEach(function (btn) {
        btn.disabled = !ready;
      });
    }
    syncExpress();

    form.addEventListener("submit", function (e) {
      e.preventDefault();
      var selected = form.querySelector('input[name="plan"]:checked');
      if (!selected) {
        showError("Choose VIP or Guest before checkout.");
        if (radios[0]) radios[0].focus();
        return;
      }
      if (selected.value === "vip" && !consent.checked) {
        showError("VIP renews automatically. Check the separate recurring-billing box — it starts unchecked — or choose Guest for a one-time kit.");
        consent.focus();
        return;
      }

      var now = new Date().toISOString();
      var emailInput = document.getElementById("order-email");
      var entry = selected.value === "vip"
        ? {
            plan: "vip",
            consentText: exactConsentText(),
            acceptedAt: now,
            receiptId: makeId("PPC-CONSENT"),
            descriptor: DESCRIPTOR,
            renewalAmount: version.renewal,
            renewalDisplay: money(version.renewal) + "/mo",
            firstBillingDate: isoDate(first),
            firstBillingLabel: whenLabel,
            cancelUrl: version.cancelPath,
            checkboxAccepted: true
          }
        : {
            plan: "guest",
            consentText: "Guest checkout selected. One-time Calm & Safe Kit purchase. No recurring membership and no recurring-billing consent was requested or accepted.",
            acceptedAt: now,
            receiptId: makeId("PPC-GUEST"),
            descriptor: null,
            renewalAmount: null,
            renewalDisplay: null,
            firstBillingDate: null,
            firstBillingLabel: null,
            cancelUrl: null,
            checkboxAccepted: false
          };

      var order = {
        version: version.id,
        plan: selected.value,
        kitName: "Calm & Safe Kit",
        kitPrice: selected.value === "vip" ? version.vipToday : version.guestToday,
        renewalAmount: selected.value === "vip" ? version.renewal : null,
        firstBillingDate: selected.value === "vip" ? isoDate(first) : null,
        firstBillingLabel: selected.value === "vip" ? whenLabel : null,
        orderedAt: now,
        email: emailInput ? emailInput.value.trim() : "",
        oto1: false,
        oto1Price: 0,
        oto2: false,
        annualPrice: 0,
        upsellStep: 1,
        upsellComplete: false,
        consent: entry,
        petPass: null,
        membershipAction: null
      };
      writeJSON(version.storageKey, order);
      var log = readJSON(version.logKey) || [];
      log.push(entry);
      writeJSON(version.logKey, log);
      trackMeta("AddToCart", {
        currency: "USD",
        value: order.kitPrice,
        content_ids: ["calm-safe-kit"],
        content_type: "product",
        content_name: "Calm & Safe Kit",
        contents: [{ id: "calm-safe-kit", quantity: 1 }]
      });
      trackMeta("InitiateCheckout", {
        currency: "USD",
        value: order.kitPrice,
        num_items: 1,
        content_ids: ["calm-safe-kit"]
      });
      openLog(true);
    });

    var openBtn = document.getElementById("open-log");
    if (openBtn) openBtn.addEventListener("click", function () { openLog(false); });

    var drawer = document.getElementById("log-drawer");
    if (drawer) {
      drawer.addEventListener("click", function (e) {
        if (e.target === drawer) drawer.hidden = true;
      });
      drawer.querySelectorAll("[data-close-log]").forEach(function (btn) {
        btn.addEventListener("click", function () { drawer.hidden = true; });
      });
      document.addEventListener("keydown", function (e) {
        if (e.key === "Escape" && !drawer.hidden) drawer.hidden = true;
      });
    }
  }

  function loadOrder() {
    var version = cfg();
    if (!version) return null;
    return readJSON(version.storageKey);
  }

  function saveOrder(order) {
    writeJSON(cfg().storageKey, order);
  }

  function initUpsell() {
    var root = document.querySelector("[data-upsell]");
    var version = cfg();
    if (!root || !version) return;
    var order = loadOrder();
    var missing = document.getElementById("upsell-missing");
    var flow = document.getElementById("upsell-flow");
    if (!order || !order.plan) {
      if (missing) missing.hidden = false;
      if (flow) flow.hidden = true;
      return;
    }
    if (missing) missing.hidden = true;
    if (flow) flow.hidden = false;

    var summary = document.getElementById("upsell-summary");
    if (summary) {
      summary.textContent = (order.plan === "vip" ? "VIP" : "Guest") + " · Calm & Safe Kit " + money(order.kitPrice) + " is already recorded in this browser. These two offers are optional.";
    }

    var step1 = document.getElementById("upsell-step-1");
    var step2 = document.getElementById("upsell-step-2");
    var done = document.getElementById("upsell-done");

    function show(step) {
      step1.hidden = step !== 1;
      step2.hidden = step !== 2;
      done.hidden = step !== "done";
      document.querySelectorAll("[data-pip]").forEach(function (pip) {
        var n = Number(pip.getAttribute("data-pip"));
        pip.classList.toggle("is-current", step === n);
        pip.classList.toggle("is-done", step === "done" || (typeof step === "number" && n < step));
      });
    }

    if (order.upsellComplete) show("done");
    else if (order.upsellStep === 2) show(2);
    else show(1);

    function go(step, patch) {
      order = Object.assign({}, order, patch);
      saveOrder(order);
      if (step === "thanks") {
        window.location.href = version.thanksPath;
        return;
      }
      show(step);
    }

    document.getElementById("accept-oto1").addEventListener("click", function () {
      go(2, { oto1: true, oto1Price: version.extraKit, upsellStep: 2 });
    });
    document.getElementById("decline-oto1").addEventListener("click", function () {
      go(2, { oto1: false, oto1Price: 0, upsellStep: 2 });
    });
    document.getElementById("accept-oto2").addEventListener("click", function () {
      go("thanks", { oto2: true, annualPrice: version.annual, upsellStep: 2, upsellComplete: true });
    });
    document.getElementById("decline-oto2").addEventListener("click", function () {
      go("thanks", { oto2: false, annualPrice: 0, upsellStep: 2, upsellComplete: true });
    });
  }

  function roundRect(ctx, x, y, w, h, r) {
    var radius = Math.min(r, w / 2, h / 2);
    ctx.beginPath();
    ctx.moveTo(x + radius, y);
    ctx.arcTo(x + w, y, x + w, y + h, radius);
    ctx.arcTo(x + w, y + h, x, y + h, radius);
    ctx.arcTo(x, y + h, x, y, radius);
    ctx.arcTo(x, y, x + w, y, radius);
    ctx.closePath();
  }

  function initPass(order) {
    var canvas = document.getElementById("pass-canvas");
    if (!canvas) return;
    var fields = {
      name: document.getElementById("pet-name"),
      breed: document.getElementById("pet-breed"),
      allergies: document.getElementById("pet-allergies"),
      meds: document.getElementById("pet-meds"),
      phone: document.getElementById("pet-phone")
    };
    var saved = (order && order.petPass) || {};
    Object.keys(fields).forEach(function (key) {
      if (fields[key] && saved[key]) fields[key].value = saved[key];
    });

    function raw() {
      return {
        name: fields.name ? fields.name.value.trim() : "",
        breed: fields.breed ? fields.breed.value.trim() : "",
        allergies: fields.allergies ? fields.allergies.value.trim() : "",
        meds: fields.meds ? fields.meds.value.trim() : "",
        phone: fields.phone ? fields.phone.value.trim() : ""
      };
    }

    function shown() {
      var pet = raw();
      return {
        name: pet.name || "Your dog",
        breed: pet.breed || "Breed",
        allergies: pet.allergies || "None listed",
        meds: pet.meds || "None listed",
        phone: pet.phone || "Add a phone"
      };
    }

    function clip(ctx, text, max) {
      var t = text || "";
      if (ctx.measureText(t).width <= max) return t;
      while (t.length > 1 && ctx.measureText(t + "…").width > max) t = t.slice(0, -1);
      return t + "…";
    }

    function wrapText(ctx, text, x, y, max, lh) {
      var words = String(text).split(" ");
      var line = "";
      var yy = y;
      words.forEach(function (word) {
        var test = line ? line + " " + word : word;
        if (ctx.measureText(test).width > max && line) {
          ctx.fillText(line, x, yy);
          line = word;
          yy += lh;
        } else line = test;
      });
      if (line) ctx.fillText(line, x, yy);
    }

    function draw() {
      var pet = shown();
      var w = 1200;
      var h = 720;
      canvas.width = w;
      canvas.height = h;
      var ctx = canvas.getContext("2d");
      ctx.clearRect(0, 0, w, h);
      roundRect(ctx, 0, 0, w, h, 48);
      ctx.fillStyle = "#1B4332";
      ctx.fill();
      roundRect(ctx, 28, 28, w - 56, h - 56, 36);
      ctx.fillStyle = "#FAF7F2";
      ctx.fill();

      ctx.fillStyle = "#1B4332";
      ctx.beginPath();
      ctx.arc(96, 118, 16, 0, Math.PI * 2);
      ctx.arc(132, 108, 13, 0, Math.PI * 2);
      ctx.arc(68, 112, 11, 0, Math.PI * 2);
      ctx.arc(150, 140, 11, 0, Math.PI * 2);
      ctx.fill();
      ctx.beginPath();
      ctx.ellipse(108, 160, 26, 20, 0, 0, Math.PI * 2);
      ctx.fill();

      ctx.fillStyle = "#1B4332";
      ctx.font = '700 22px "Plus Jakarta Sans", sans-serif';
      ctx.fillText("PAWPOCKET CLUB", 190, 118);
      ctx.fillStyle = "#5A635E";
      ctx.font = '500 20px "Plus Jakarta Sans", sans-serif';
      ctx.fillText("PET ID  ·  MINUTE-1 WALLET PASS", 190, 152);

      ctx.fillStyle = "#1F2421";
      ctx.font = '680 76px Fraunces, Georgia, serif';
      ctx.fillText(clip(ctx, pet.name, 700), 72, 280);
      ctx.fillStyle = "#1B4332";
      ctx.font = '560 32px Fraunces, Georgia, serif';
      ctx.fillText(clip(ctx, pet.breed, 700), 72, 330);

      roundRect(ctx, 72, 370, 680, 156, 22);
      ctx.fillStyle = "#F8E7DF";
      ctx.fill();
      ctx.fillStyle = "#9C3B2E";
      ctx.font = '700 18px "Plus Jakarta Sans", sans-serif';
      ctx.fillText("ALLERGIES", 96, 412);
      ctx.fillStyle = "#1F2421";
      ctx.font = '650 28px "Plus Jakarta Sans", sans-serif';
      ctx.fillText(clip(ctx, pet.allergies, 620), 96, 454);
      ctx.fillStyle = "#5A635E";
      ctx.font = '500 22px "Plus Jakarta Sans", sans-serif';
      ctx.fillText(clip(ctx, "Meds: " + pet.meds, 620), 96, 494);

      ctx.fillStyle = "#1F2421";
      ctx.font = '700 18px "Plus Jakarta Sans", sans-serif';
      ctx.fillText("OWNER PHONE", 72, 582);
      ctx.font = '700 32px "Plus Jakarta Sans", sans-serif';
      ctx.fillText(clip(ctx, pet.phone, 620), 72, 624);

      ctx.fillStyle = "#1B4332";
      roundRect(ctx, 800, 80, 320, 530, 28);
      ctx.fill();
      ctx.fillStyle = "#FAF7F2";
      ctx.font = '600 22px "Plus Jakarta Sans", sans-serif';
      wrapText(ctx, "Show this pass to any finder or clinic front desk.", 828, 150, 264, 30);
      ctx.fillStyle = "#74A57F";
      ctx.font = '500 18px "Plus Jakarta Sans", sans-serif';
      wrapText(ctx, "Battery-free QR/NFC tag. No GPS radio in the collar tag.", 828, 300, 264, 26);
      ctx.fillStyle = "#FAF7F2";
      wrapText(ctx, "Wellness membership card. Not pet insurance and not a clinic chart.", 828, 430, 264, 26);
    }

    function persist() {
      var pet = raw();
      if (order) {
        order.petPass = pet;
        saveOrder(order);
      }
      var link = document.getElementById("pass-tag-link");
      if (link) {
        var q = new URLSearchParams();
        if (pet.name) q.set("pet", pet.name);
        if (pet.breed) q.set("breed", pet.breed);
        if (pet.allergies) q.set("allergies", pet.allergies);
        if (pet.meds) q.set("meds", pet.meds);
        if (pet.phone) q.set("phone", pet.phone);
        var qs = q.toString();
        link.href = rootPrefix() + "tag.html" + (qs ? "?" + qs : "");
      }
    }

    Object.keys(fields).forEach(function (key) {
      if (!fields[key]) return;
      fields[key].addEventListener("input", function () {
        draw();
        persist();
      });
    });

    function paint() {
      draw();
      persist();
    }
    paint();
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(paint).catch(function () {});

    var download = document.getElementById("pass-download");
    if (download) {
      download.addEventListener("click", function () {
        draw();
        var pet = shown();
        var a = document.createElement("a");
        a.href = canvas.toDataURL("image/png");
        var slug = pet.name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "") || "pet";
        a.download = "pawpocket-" + slug + "-pet-id.png";
        document.body.appendChild(a);
        a.click();
        a.remove();
      });
    }
  }

  function initThanks() {
    var root = document.querySelector("[data-thanks]");
    var version = cfg();
    if (!root || !version) return;
    var order = loadOrder();
    var empty = document.getElementById("receipt-empty");
    var receipt = document.getElementById("receipt-body");
    var lines = document.getElementById("receipt-lines");
    var totalEl = document.getElementById("receipt-total");
    var meta = document.getElementById("receipt-meta");
    var rebill = document.getElementById("rebill-note");

    if (!order || !order.plan) {
      if (empty) empty.hidden = false;
      if (receipt) receipt.hidden = true;
    } else {
      if (!order.purchaseTracked) {
        var purchaseValue = Number(order.kitPrice) + (order.oto1 ? Number(order.oto1Price) : 0) + (order.oto2 ? Number(order.annualPrice) : 0);
        trackMeta("Purchase", {
          currency: "USD",
          value: Math.round(purchaseValue * 100) / 100,
          content_ids: ["calm-safe-kit"],
          content_type: "product",
          content_name: "Calm & Safe Kit",
          num_items: 1 + (order.oto1 ? 1 : 0)
        });
        order.purchaseTracked = true;
        saveOrder(order);
      }
      if (empty) empty.hidden = true;
      if (receipt) receipt.hidden = false;
      var rows = [["Calm & Safe Kit (" + (order.plan === "vip" ? "VIP" : "Guest") + ")", order.kitPrice]];
      if (order.oto1) rows.push(["Extra Calm & Safe Kit — same box, up to 3 pets on one membership", order.oto1Price]);
      if (order.oto2) rows.push(["Annual " + version.clubName, order.annualPrice]);
      lines.textContent = "";
      var total = 0;
      rows.forEach(function (row) {
        total += cents(row[1]);
        var tr = document.createElement("tr");
        var td1 = document.createElement("td");
        td1.textContent = row[0];
        var td2 = document.createElement("td");
        td2.textContent = money(row[1]);
        tr.appendChild(td1);
        tr.appendChild(td2);
        lines.appendChild(tr);
      });
      totalEl.textContent = "$" + (total / 100).toFixed(2);

      meta.textContent = "";
      var bits = [["Ordered (ISO)", order.orderedAt]];
      if (order.email) bits.push(["Email on the receipt", order.email]);
      if (order.consent) bits.push(["Consent receipt", order.consent.receiptId]);
      if (order.plan === "vip" && !order.oto2) {
        bits.push(["Next membership charge", money(order.renewalAmount) + " on " + order.firstBillingLabel]);
        bits.push(["Statement descriptor", DESCRIPTOR]);
      }
      if (order.oto2) bits.push(["Annual plan", money(version.annual) + "/yr replaces the monthly renewal"]);
      if (order.plan === "guest" && !order.oto2) bits.push(["Renewal", "None. Guest kit orders do not renew."]);
      bits.forEach(function (b) {
        var p = document.createElement("p");
        var s = document.createElement("strong");
        s.textContent = b[0] + ": ";
        p.appendChild(s);
        p.appendChild(document.createTextNode(b[1]));
        meta.appendChild(p);
      });

      if (rebill) {
        rebill.hidden = false;
        rebill.textContent = "";
        var h = document.createElement("h3");
        var p = document.createElement("p");
        if (order.plan === "vip" && !order.oto2) {
          h.textContent = "Day-25 pre-rebill reminder";
          p.textContent = "On " + formatLong(addDays(25)) + " — day 25 of the 30 days included today — a live membership sends a plain-language reminder before the first " + money(version.renewal) + "/mo charge posts on " + order.firstBillingLabel + ". The note names the amount, the date, the descriptor " + DESCRIPTOR + ", and a direct link to the one-click cancellation page. This static demo does not send email.";
        } else if (order.oto2) {
          h.textContent = "Annual plan, no monthly rebill";
          p.textContent = "The annual lock-in replaces the monthly renewal. A live club would still send a plain reminder before the next yearly charge. You can cancel in one click any time before then. This demo does not send email.";
        } else {
          h.textContent = "No pre-rebill on a guest kit";
          p.textContent = "A Guest order is one-time. Nothing renews, so there is no day-25 reminder unless a membership is added later.";
        }
        rebill.appendChild(h);
        rebill.appendChild(p);
      }
    }

    initPass(order);
  }

  function initCancel() {
    var root = document.querySelector("[data-cancel]");
    var version = cfg();
    if (!root || !version) return;
    var stage = document.getElementById("cancel-stage");
    var button = document.getElementById("cancel-now");
    var amount = money(version.renewal);

    function receipt(action) {
      stage.textContent = "";
      var box = document.createElement("div");
      box.className = "cancel-receipt";
      var h = document.createElement("h2");
      h.textContent = action.type === "cancelled" ? "Membership cancelled" : "Change saved — you can still cancel";
      var p = document.createElement("p");
      p.textContent = action.detail;
      var dl = document.createElement("dl");
      dl.className = "log-entry";
      [["Reference", action.reference], ["Timestamp (ISO)", action.at], ["Plan referenced", amount + "/mo " + version.clubName]].forEach(function (row) {
        var dt = document.createElement("dt");
        dt.textContent = row[0];
        var dd = document.createElement("dd");
        dd.textContent = row[1];
        dl.appendChild(dt);
        dl.appendChild(dd);
      });
      box.appendChild(h);
      box.appendChild(p);
      box.appendChild(dl);
      stage.appendChild(box);
    }

    function remember(type, detail) {
      var existing = loadOrder();
      if (existing && existing.membershipAction && existing.membershipAction.type === "cancelled") {
        receipt(existing.membershipAction);
        return;
      }
      var action = {
        type: type,
        at: new Date().toISOString(),
        reference: makeId(type === "cancelled" ? "PPC-CXL" : "PPC-SAVE"),
        detail: detail
      };
      var next = Object.assign({}, existing || { version: version.id, plan: "vip", renewalAmount: version.renewal }, { membershipAction: action });
      writeJSON(version.storageKey, next);
      receipt(action);
    }

    button.addEventListener("click", function () {
      remember("cancelled", "Cancelled in one click. No further " + amount + "/mo renewal will be requested from this browser session. This demo does not contact a payment processor. The reference below is your client-side confirmation.");
    });
    document.getElementById("save-pause").addEventListener("click", function () {
      remember("pause", "Pause 1 month is noted. The next " + amount + " charge would be skipped once. The membership is not cancelled. The button above still cancels it immediately.");
    });
    document.getElementById("save-down").addEventListener("click", function () {
      remember("downgrade", "Downgrade noted: " + money(version.downgrade) + "/mo " + version.downgradeName + ". This smaller plan keeps the tag profile and wallet card. It does not cancel the membership. You can still cancel immediately with the button above.");
    });
    document.getElementById("save-annual").addEventListener("click", function () {
      remember("annual", "Annual lock-in noted at " + money(version.annual) + "/yr, which is " + money(version.annualSave) + " less than twelve months at " + amount + ". This does not cancel the membership. You can still cancel immediately with the button above.");
    });

    var existing = loadOrder();
    if (existing && existing.membershipAction && existing.membershipAction.type === "cancelled") {
      receipt(existing.membershipAction);
    }
  }

  function digits(phone) {
    return String(phone || "").replace(/[^\d+]/g, "");
  }

  function initTag() {
    var card = document.querySelector("[data-tag]");
    if (!card) return;
    var params = new URLSearchParams(location.search);
    var demo = {
      pet: "Milo",
      breed: "Golden Retriever",
      allergies: "Chicken (demo profile)",
      meds: "Daily allergy tablet, as prescribed (demo profile)",
      phone: "(555) 014-0192"
    };
    var fromLink = ["pet", "breed", "allergies", "meds", "phone"].some(function (k) { return params.has(k); });
    var state = {
      pet: params.get("pet") || demo.pet,
      breed: params.get("breed") || demo.breed,
      allergies: params.get("allergies") || demo.allergies,
      meds: params.get("meds") || demo.meds,
      phone: params.get("phone") || demo.phone
    };
    var mode = document.getElementById("tag-mode");
    if (mode) mode.textContent = fromLink ? "Profile loaded from this tag link" : "Demo profile — not a real lost-pet report";

    var inputs = {
      pet: document.getElementById("edit-pet"),
      breed: document.getElementById("edit-breed"),
      allergies: document.getElementById("edit-allergies"),
      meds: document.getElementById("edit-meds"),
      phone: document.getElementById("edit-phone")
    };

    function paint() {
      document.getElementById("tag-pet").textContent = state.pet || "Unnamed pet";
      document.getElementById("tag-breed").textContent = state.breed || "Breed not listed";
      document.getElementById("tag-allergies").textContent = state.allergies || "None listed";
      document.getElementById("tag-meds").textContent = state.meds || "None listed";
      var phoneLabel = document.getElementById("tag-phone-label");
      if (phoneLabel) phoneLabel.textContent = state.phone || "No phone listed";
      var tel = digits(state.phone);
      var call = document.getElementById("tag-call");
      var sms = document.getElementById("tag-sms");
      if (tel) {
        call.href = "tel:" + tel;
        var body = encodeURIComponent("Regarding " + (state.pet || "your dog") + ": I scanned the PawPocket collar tag.");
        sms.href = "sms:" + tel + "?body=" + body;
      }
    }

    Object.keys(inputs).forEach(function (key) {
      if (!inputs[key]) return;
      inputs[key].value = state[key];
      inputs[key].addEventListener("input", function () {
        state[key] = inputs[key].value;
        paint();
      });
    });
    paint();

    var toggle = document.getElementById("tag-edit-toggle");
    var form = document.getElementById("tag-edit");
    if (toggle && form) {
      toggle.addEventListener("click", function () {
        var open = form.hidden;
        form.hidden = !open;
        toggle.setAttribute("aria-pressed", open ? "true" : "false");
        toggle.textContent = open ? "Close editor" : "Edit demo profile";
        if (open && inputs.pet) inputs.pet.focus();
      });
    }

    var notify = document.getElementById("tag-notify");
    var alertBox = document.getElementById("tag-alert");
    if (notify && alertBox) {
      notify.addEventListener("click", function () {
        var stamp = new Date();
        alertBox.hidden = false;
        alertBox.textContent = "";
        var h = document.createElement("h2");
        h.textContent = "Scan alert demo";
        var p = document.createElement("p");
        p.textContent = (state.pet || "This pet") + "'s tag page was opened at " + stamp.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" }) + " (" + stamp.toISOString() + "). The owner alert fires because this page loaded. The collar tag has no battery and no GPS radio.";
        var fine = document.createElement("p");
        fine.className = "fine";
        fine.textContent = "Demo only. This browser did not send a real text or push notification.";
        alertBox.appendChild(h);
        alertBox.appendChild(p);
        alertBox.appendChild(fine);
      });
    }
  }

  var LIBRARY = [
    { keys: ["xylitol", "birch sugar"], name: "Xylitol", level: "high", label: "High educational risk",
      summary: "Xylitol is widely published as highly toxic to dogs. Modest amounts have been linked to a sudden drop in blood sugar and to liver injury.",
      steps: ["Keep the package and note how much xylitol the label lists, if you can.", "Call your veterinarian, an emergency clinic, or ASPCA Animal Poison Control at 888-426-4435 now.", "Do not wait to see if your dog seems fine."] },
    { keys: ["dark chocolate", "chocolate", "cocoa", "cacao"], name: "Chocolate", level: "high", label: "High educational risk",
      summary: "Chocolate contains theobromine, which dogs handle poorly. Darker chocolate and baking cocoa are the bigger concern in published veterinary notes. This tool cannot tell you whether the amount your dog ate is an emergency.",
      steps: ["Note the type — dark, milk, baking, or cocoa — and about how much is missing.", "Call your veterinarian or ASPCA Animal Poison Control at 888-426-4435.", "Bring the wrapper if you go to a clinic."] },
    { keys: ["grapes", "grape", "raisins", "raisin"], name: "Grapes and raisins", level: "high", label: "High educational risk",
      summary: "Grapes and raisins are widely listed as toxic to dogs and have been associated with kidney injury. A small bite is not a clearance.",
      steps: ["Take away any remaining fruit, including trail mix and baked goods that hide raisins.", "Note the time and roughly how many.", "Call your veterinarian or ASPCA Animal Poison Control at 888-426-4435 now."] },
    { keys: ["onions", "onion", "garlic", "chives", "chive", "leeks", "leek"], name: "Onion, garlic, chives, and leeks", level: "high", label: "High educational risk",
      summary: "Onions, garlic, chives, and leeks are widely listed as harmful to dogs, including powdered forms in cooked food. They can damage red blood cells. Signs are not always immediate.",
      steps: ["Note whether it was raw, cooked, or powdered, and about how much.", "Call your veterinarian rather than waiting on a normal-looking hour.", "Skip home remedies from social feeds."] },
    { keys: ["peanut butter"], name: "Peanut butter", level: "caution", label: "Check the label",
      summary: "Plain unsweetened peanut butter is often used as a lick-mat smear. Some jars, especially sugar-free ones, use xylitol. The ingredient list decides.",
      steps: ["Read the label for xylitol or birch sugar.", "If xylitol is listed, treat it as an emergency and call a veterinarian or ASPCA Animal Poison Control now.", "If the jar is xylitol-free, a small smear is generally discussed as an occasional treat. Your own vet knows your dog's diet."] },
    { keys: ["apple slices", "apple slice", "apples", "apple"], name: "Apple slices", level: "lower", label: "Lower educational risk — seeds and core off",
      summary: "Apple flesh is widely listed as an acceptable occasional snack for many dogs. Seeds and the core are not. Apple seeds contain compounds that can release cyanide.",
      steps: ["Offer flesh only. Remove seeds, core, and stem.", "Skip it if your dog already has an upset stomach or a known fruit sensitivity.", "This is not a clearance for every dog. Ask your veterinarian if you are unsure."] },
    { keys: ["seizure", "seizures", "collapse", "collapsed", "unresponsive"], name: "Seizure or collapse", level: "high", label: "Emergency — call a clinic now",
      summary: "Seizures and collapse are emergencies. An educational helper cannot treat them and cannot tell you the cause.",
      steps: ["Move objects away so your dog is not hurt. Do not put your hands in the mouth.", "Contact an emergency veterinarian now.", "Note how long it lasted and whether they ate something first."] },
    { keys: ["vomiting", "vomit", "threw up"], name: "Vomiting", level: "caution", label: "A veterinarian has to sort the cause",
      summary: "Vomiting has many causes, from a mild stomach upset to an obstruction or something poisonous. This preview cannot tell which one this is.",
      steps: ["Note the time, how many times, and whether you saw blood, toys, or a specific food.", "If it repeats, the belly looks swollen, or your dog seems painful or flat, contact a veterinarian or emergency clinic now.", "If you know what they ate, tell the clinic the item and the amount."] },
    { keys: ["lethargy", "lethargic", "not eating", "won't eat"], name: "Low energy or not eating", level: "caution", label: "Watch closely and call if it continues",
      summary: "A skipped meal is sometimes nothing. It is also how many real problems start. This note cannot tell the difference.",
      steps: ["Look at energy, breathing, and whether the belly seems painful.", "If your dog is weak, vomiting, or still refusing food, call your veterinarian.", "Mention any food, plant, or medicine they may have reached."] }
  ];

  function hasTerm(query, term) {
    var escaped = term.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    return new RegExp("(?:^|[^a-z])" + escaped + "(?:[^a-z]|$)", "i").test(query);
  }

  function lookupItem(query) {
    var q = String(query || "").toLowerCase().trim();
    if (!q) return null;
    var hits = LIBRARY.filter(function (item) {
      return item.keys.some(function (key) { return hasTerm(q, key); });
    });
    var rank = { high: 3, caution: 2, lower: 1 };
    hits.sort(function (a, b) {
      return (rank[b.level] - rank[a.level]) || (b.keys[0].length - a.keys[0].length);
    });
    return hits[0] || null;
  }

  function initAI() {
    var root = document.querySelector("[data-ai-check]");
    if (!root) return;
    var input = document.getElementById("ai-input");
    var result = document.getElementById("ai-result");
    var form = document.getElementById("ai-form");

    function show(query) {
      result.hidden = false;
      result.textContent = "";
      var banner = document.createElement("p");
      banner.className = "disclaimer-banner";
      banner.textContent = "AI educational guidance only — not a licensed veterinarian, diagnosis, or emergency replacement. If your dog is vomiting repeatedly, collapsing, having a seizure, or you think this is an emergency, contact a veterinarian or an emergency clinic now.";
      var item = lookupItem(query);
      var h = document.createElement("h3");
      if (!item) {
        h.textContent = "No educational note on file";
        var p = document.createElement("p");
        p.textContent = "Nothing in this preview matches “" + query + "”. That is not a safety clearance. Call your veterinarian before you assume an item or a symptom is fine.";
        result.appendChild(h);
        result.appendChild(p);
        result.appendChild(banner);
        return;
      }
      h.textContent = item.name;
      var level = document.createElement("p");
      level.className = "risk risk-" + item.level;
      level.textContent = item.label;
      var summary = document.createElement("p");
      summary.textContent = item.summary;
      var list = document.createElement("ol");
      item.steps.forEach(function (step) {
        var li = document.createElement("li");
        li.textContent = step;
        list.appendChild(li);
      });
      result.appendChild(h);
      result.appendChild(level);
      result.appendChild(summary);
      result.appendChild(list);
      result.appendChild(banner);
    }

    root.querySelectorAll("[data-food]").forEach(function (btn) {
      btn.addEventListener("click", function () {
        var food = btn.getAttribute("data-food");
        if (input) input.value = food;
        show(food);
      });
    });
    if (form) {
      form.addEventListener("submit", function (e) {
        e.preventDefault();
        show((input && input.value.trim()) || "");
      });
    }
  }

  // Paste a real Pixel ID to load fbevents.js. Leave it blank in this repo.
  // capiEndpoint: your server that hashes user data and POSTs to
  // https://graph.facebook.com/v21.0/{PIXEL_ID}/events
  // Send the same eventId as event_id so Pixel and CAPI dedupe.
  var META = {
    pixelId: "",
    capiEndpoint: "",
    testEventCode: ""
  };

  var HEADS = {
    "a:advertorial": {
      "1": {
        h1: "It's 11:40 PM and Your Dog Just Ate Something Off the Floor",
        lede: "Chocolate, grapes, or a sock. The group chat is guessing. This $29.99 kit stays by the door, and the club behind it is 24/7 licensed veterinary guidance, triage, and second opinions — then $29.99/mo if you keep it."
      },
      "2": {
        h1: "Stop Googling \"Can Dogs Eat This\" at Midnight",
        lede: "Fourteen tabs will not know your dog. VIP is $29.99 today for the Calm & Safe Kit and 30 days of PawPocket Club, then $29.99/mo. Guest is $49.99 once. You pick. Nothing is pre-checked."
      },
      "3": {
        h1: "Your Dog Ate Something. Here Is the $29.99 Next Move.",
        lede: "A USB-C steam brush, a suction lick mat, and a battery-free QR tag. Plus licensed veterinary guidance, triage, and a second opinion — not a prescription, and not pet insurance."
      }
    },
    "b:advertorial": {
      "1": {
        h1: "It's 11 PM. Your Dog Just Inhaled Something Off the Floor.",
        lede: "Chocolate? Grapes? A sugar-free wrapper? The Digital Club's AI helper gives an educational checklist. The kit ships with it. AI guidance only — not a veterinarian. VIP is $29.99 today, then $19.99/mo."
      },
      "2": {
        h1: "The Gate Was Open for 30 Seconds.",
        lede: "A stranger finds your dog and scans a battery-free QR tag with the camera already in their pocket. You get the alert. The tag has no GPS radio and no tracking fee."
      },
      "3": {
        h1: "Bath-Time Chaos Has a Mat. Shedding Has a Steam Brush.",
        lede: "Same dog, better tools. $29.99 VIP includes the kit and 30 days of the Whop club, then $19.99/mo. Or $49.99 once, no membership. Neither box starts checked."
      }
    },
    "a:product": {
      "1": {
        h1: "The kit on the counter. The club on your phone.",
        lede: "VIP is $29.99 today for the kit and 30 days of PawPocket Club, then $29.99/mo. Guest is $49.99 once. Neither choice is selected."
      },
      "2": {
        h1: "Same Kit. $20 Less Today If You Take the Club.",
        lede: "Guest pays $49.99 for the kit alone. VIP pays $29.99 today and the club continues at $29.99/mo after 30 days unless you cancel. You still have to choose."
      },
      "3": {
        h1: "Three Tools. One Box. Two Ways to Pay.",
        lede: "USB-C steam brush, suction lick mat, battery-free QR/NFC tag. The renewal terms sit next to VIP, unchecked, before any charge."
      }
    },
    "b:product": {
      "1": {
        h1: "The kit on the counter. The club on your phone.",
        lede: "VIP is $29.99 today for the kit and 30 days on Whop, then $19.99/mo. Guest is $49.99 once. Nothing is pre-selected."
      },
      "2": {
        h1: "Same Kit. $20 Less Today. Then $19.99/mo If You Stay.",
        lede: "The $20 gap is the Digital Club, not a made-up retail price. Cancel in one click before the renewal date. The checkbox starts empty."
      },
      "3": {
        h1: "Can They Eat That? The Kit, Plus an AI Helper.",
        lede: "Educational guidance only — not a veterinarian, not a diagnosis, not an emergency replacement. The physical kit still ships to your door."
      }
    }
  };

  function trackMeta(eventName, custom) {
    var eventId = makeId("PPC-EVT");
    var payload = {
      eventName: eventName,
      eventId: eventId,
      custom: custom || {},
      at: new Date().toISOString(),
      sourceUrl: location.href
    };
    var events = readJSON("pawpocket.events") || [];
    events.push(payload);
    writeJSON("pawpocket.events", events.slice(-30));
    if (META.pixelId && window.fbq) {
      window.fbq("track", eventName, custom || {}, { eventID: eventId });
    }
    if (META.pixelId && META.capiEndpoint && window.fetch) {
      // Server must hash email/phone and attach fbp/fbc. Do not put the access token in this file.
      window.fetch(META.capiEndpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          event_name: eventName,
          event_id: eventId,
          event_time: Math.floor(Date.now() / 1000),
          action_source: "website",
          event_source_url: location.href,
          custom_data: custom || {},
          test_event_code: META.testEventCode || undefined
        })
      }).catch(function () {});
    }
  }

  function loadPixel() {
    if (!META.pixelId || window.fbq) return;
    var script = document.createElement("script");
    script.async = true;
    script.src = "https://connect.facebook.net/en_US/fbevents.js";
    document.head.appendChild(script);
    window.fbq = window.fbq || function () {
      (window.fbq.queue = window.fbq.queue || []).push(arguments);
    };
    window.fbq("init", META.pixelId);
  }

  function applyHeadlines() {
    var params = new URLSearchParams(location.search);
    var which = params.get("h") || "1";
    if (which !== "1" && which !== "2" && which !== "3") which = "1";
    var key = (document.body.dataset.version || "") + ":" + (document.body.dataset.page || "");
    var set = HEADS[key] && HEADS[key][which];
    if (!set) return;
    var h1 = document.querySelector("[data-headline]");
    var lede = document.querySelector("[data-subhead]");
    if (h1) h1.textContent = set.h1;
    if (lede) lede.textContent = set.lede;
  }

  function initMetaPage() {
    loadPixel();
    var page = document.body.dataset.page || "";
    trackMeta("PageView", { page: page });
    if (page === "product" || page === "advertorial" || page === "listicle") {
      var version = cfg();
      trackMeta("ViewContent", {
        content_name: "Calm & Safe Kit",
        content_type: "product",
        content_ids: ["calm-safe-kit"],
        currency: "USD",
        value: version ? version.vipToday : 29.99
      });
    }
  }

  document.addEventListener("DOMContentLoaded", function () {
    mountBar();
    applyHeadlines();
    initMetaPage();
    initTabs();
    initGallery();
    initCheckout();
    initUpsell();
    initThanks();
    initCancel();
    initTag();
    initAI();
  });
})();
