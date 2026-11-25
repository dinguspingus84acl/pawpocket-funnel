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
      extraKit: 9.99,
      extraTag: 9.99,
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
      extraKit: 9.99,
      extraTag: 9.99,
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
    var renewal = money(version.renewal) + "/mo";
    var kit = money(version.vipToday);
    var before = "VIP Club is $0.00 today, then " + renewal + " beginning " + whenLabel + ", billed as " + DESCRIPTOR + ". The kit today is the VIP price of " + kit + ". Extra QR/NFC tags are optional. Cancel in 1 click any time before that date at ";
    if (version.id === "a") {
      return {
        before: before,
        link: version.cancelPath,
        after: ". Renewals ship no physical product. PawPocket Club is a wellness membership. It is not insurance and it does not pay claims."
      };
    }
    return {
      before: before,
      link: version.cancelPath,
        after: ". Renewals ship no physical product. PawPocket Digital Club is a wellness membership. It is not insurance and it does not pay claims. The helper is AI educational guidance only — not a licensed veterinarian, diagnosis, or emergency replacement."
    };
  }

  function formatMonthDay(d) {
    return d.toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" });
  }

  function addBusinessDays(start, days) {
    var d = new Date(start.getTime());
    var left = days;
    while (left > 0) {
      d.setDate(d.getDate() + 1);
      var dow = d.getDay();
      if (dow !== 0 && dow !== 6) left -= 1;
    }
    return d;
  }

  function fillMembershipDates() {
    var version = cfg();
    if (!version) return;
    var first = new Date(2026, 11, 24, 12, 0, 0, 0);
    var longLabel = formatLong(first);
    var shortLabel = formatMonthDay(first);
    document.querySelectorAll("[data-renewal-label]").forEach(function (el) {
      el.textContent = longLabel;
    });
    document.querySelectorAll("[data-renewal-short]").forEach(function (el) {
      el.textContent = shortLabel;
    });
    document.querySelectorAll("[data-renewal-price]").forEach(function (el) {
      el.textContent = money(version.renewal) + "/mo";
    });
  }

  function initDemoNotes() {
    if (new URLSearchParams(location.search).get("demo") !== "1") return;
    document.querySelectorAll(".demo-only").forEach(function (el) {
      el.hidden = false;
    });
  }

  function formatShort(d) {
    return d.toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" });
  }

  function initDelivery() {
    var el = document.getElementById("delivery-strip");
    if (!el) return;
    var today = new Date();
    today.setHours(12, 0, 0, 0);
    var start = addBusinessDays(today, 3);
    var end = addBusinessDays(today, 7);
    var warehouse = document.body.dataset.version === "b" ? " Ships from a U.S. warehouse." : "";
    el.textContent = "Ships in 1-2 business days. Arrives " + formatShort(start) + "–" + formatShort(end) + ". Delivered in 3-7 business days (US). Free US shipping." + warehouse;
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

    var termsEl = document.getElementById("vip-terms");
    var payBtn = document.getElementById("pay-btn");
    var stickyBtn = document.getElementById("sticky-btn");
    var error = document.getElementById("checkout-error");
    var dueToday = document.getElementById("due-today");
    var dueRenew = document.getElementById("due-renew");
    var sumKitLabel = document.getElementById("sum-kit-label");
    var sumKitPrice = document.getElementById("sum-kit-price");
    var sumExtra = document.getElementById("sum-extra");
    var sumExtraLabel = document.getElementById("sum-extra-label");
    var sumExtraPrice = document.getElementById("sum-extra-price");
    var sumVip = document.getElementById("sum-vip");
    var displayPrice = document.getElementById("display-price");
    var priceCaption = document.getElementById("price-caption");
    var vipPriceLine = document.getElementById("vip-price-line");
    var stickyPrice = document.getElementById("sticky-price");
    var first = new Date(2026, 11, 24, 12, 0, 0, 0);
    var whenLabel = formatLong(first);
    var parts = consentParts(version, whenLabel);

    function tagQty() {
      var el = document.getElementById("tag-qty-input");
      var n = el ? parseInt(el.value, 10) : 0;
      if (!n || n < 0) n = 0;
      if (n > 6) n = 6;
      return n;
    }

    function setTagQty(n) {
      if (n < 0) n = 0;
      if (n > 6) n = 6;
      var input = document.getElementById("tag-qty-input");
      var label = document.getElementById("tag-qty");
      if (input) input.value = String(n);
      if (label) label.textContent = String(n);
      refreshDue();
    }

    function selectedPurchase() {
      return form.querySelector('input[name="purchase"]:checked');
    }

    function vipOn() {
      var selected = selectedPurchase();
      return !!(selected && selected.value === "vip");
    }

    function offerDate() {
      return first.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
    }

    function extraAmount() {
      var unit = version.extraTag || 9.99;
      return Math.round(unit * tagQty() * 100) / 100;
    }

    function kitBase() {
      return vipOn() ? version.vipToday : version.guestToday;
    }

    function dueNow() {
      return Math.round((kitBase() + extraAmount()) * 100) / 100;
    }

    function renderTerms() {
      if (!termsEl) return;
      termsEl.textContent = "";
      termsEl.appendChild(document.createTextNode("$0 today for membership, then " + money(version.renewal) + "/mo starting " + offerDate() + " until you cancel. Billed as " + DESCRIPTOR + ". Cancel anytime in "));
      var a = document.createElement("a");
      a.href = parts.link;
      a.textContent = "1 click";
      termsEl.appendChild(a);
      termsEl.appendChild(document.createTextNode("."));
    }

    function exactConsentText() {
      return termsEl ? termsEl.innerText.replace(/\s+/g, " ").trim() : "";
    }

    function syncExpress() {
      form.querySelectorAll("[data-express]").forEach(function (btn) {
        btn.disabled = false;
      });
    }

    function refreshDue() {
      var qty = tagQty();
      var on = vipOn();
      var extra = extraAmount();
      if (sumKitLabel) sumKitLabel.textContent = on ? "Calm & Safe Kit (VIP price)" : "Calm & Safe Kit";
      if (sumKitPrice) sumKitPrice.textContent = money(kitBase());
      if (sumExtra) {
        sumExtra.hidden = qty < 1;
        if (sumExtraLabel) sumExtraLabel.textContent = qty + " extra QR/NFC tag" + (qty === 1 ? "" : "s");
        if (sumExtraPrice) sumExtraPrice.textContent = money(extra);
      }
      if (sumVip) sumVip.hidden = !on;
      if (dueToday) dueToday.textContent = money(dueNow());
      if (dueRenew) {
        dueRenew.textContent = on
          ? money(version.renewal) + "/mo starting " + offerDate()
          : "Nothing. One-time kit purchase.";
      }
      if (displayPrice) displayPrice.textContent = money(on ? version.vipToday : version.guestToday);
      if (priceCaption) priceCaption.textContent = on ? "VIP price" : "Kit price";
      if (vipPriceLine) vipPriceLine.hidden = !on;
      if (termsEl) termsEl.hidden = !on;
      var buttonLabel = (on ? "Buy VIP — " : "Buy once — ") + money(dueNow());
      if (payBtn) payBtn.textContent = buttonLabel;
      if (stickyBtn) stickyBtn.textContent = buttonLabel;
      if (stickyPrice) stickyPrice.textContent = on ? ("VIP price " + money(version.vipToday)) : money(version.guestToday);
      syncExpress();
    }

    renderTerms();
    refreshDue();
    window.addEventListener("pageshow", function (event) {
      if (event.persisted) refreshDue();
    });

    form.querySelectorAll('input[name="purchase"]').forEach(function (radio) {
      radio.addEventListener("change", function () {
        if (error) {
          error.hidden = true;
          error.textContent = "";
        }
        refreshDue();
      });
    });
    var tagMinus = document.getElementById("tag-minus");
    var tagPlus = document.getElementById("tag-plus");
    if (tagMinus) tagMinus.addEventListener("click", function () { setTagQty(tagQty() - 1); });
    if (tagPlus) tagPlus.addEventListener("click", function () { setTagQty(tagQty() + 1); });
    form.querySelectorAll("[data-express]").forEach(function (btn) {
      btn.addEventListener("click", function () {
        if (btn.disabled) return;
        if (typeof form.requestSubmit === "function") form.requestSubmit();
        else form.dispatchEvent(new Event("submit", { cancelable: true, bubbles: true }));
      });
    });

    form.addEventListener("submit", function (e) {
      e.preventDefault();
      var on = vipOn();
      if (on && (!termsEl || termsEl.hidden || !termsEl.innerText.trim())) {
        if (error) {
          error.hidden = false;
          error.textContent = "The VIP renewal line has to be visible before this order.";
        }
        return;
      }
      var now = new Date().toISOString();
      var emailInput = document.getElementById("order-email");
      var qtyNow = tagQty();
      var extra = extraAmount();
      var entry = on
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
            consentText: "One-time purchase selected. Kit only. No VIP membership and no recurring charge. The renewal line was not the selected option.",
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
        plan: on ? "vip" : "guest",
        kitName: "Calm & Safe Kit",
        kitPrice: on ? version.vipToday : version.guestToday,
        kitQty: 1,
        tagQty: qtyNow,
        extraKitPrice: extra,
        renewalAmount: on ? version.renewal : null,
        firstBillingDate: on ? isoDate(first) : null,
        firstBillingLabel: on ? whenLabel : null,
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
        value: dueNow(),
        content_ids: ["calm-safe-kit"],
        content_type: "product",
        content_name: "Calm & Safe Kit",
        contents: [{ id: "calm-safe-kit", quantity: 1 }]
      });
      trackMeta("InitiateCheckout", {
        currency: "USD",
        value: dueNow(),
        num_items: 1 + qtyNow,
        content_ids: ["calm-safe-kit"]
      });
      window.location.href = version.upsellPath;
    });
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
      summary.textContent = "Calm & Safe Kit " + money(order.kitPrice) + " is recorded. " + (order.plan === "vip" ? "You chose VIP price: the kit plus 30 days of VIP free, then the monthly club." : "You chose the one-time purchase. Nothing renews.") + " The offers below are optional.";
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

    var tags = Number(order.tagQty) || 0;
    if (tags > 0 && !order.upsellComplete && order.upsellStep !== 2) {
      order = Object.assign({}, order, { oto1: false, oto1Price: 0, upsellStep: 2 });
      saveOrder(order);
    }

    if (order.upsellComplete) show("done");
    else if (order.upsellStep === 2 || tags > 0) show(2);
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
      go(2, { oto1: true, oto1Price: version.extraTag || 9.99, upsellStep: 2 });
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
      phone: document.getElementById("pet-phone"),
      er: document.getElementById("pet-er")
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
      phone: fields.phone ? fields.phone.value.trim() : "",
      er: fields.er ? fields.er.value.trim() : ""
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
      wrapText(ctx, "Wellness membership card. It is not insurance and it does not pay claims.", 828, 400, 264, 26);
    }

    function drawFridge() {
      var fridge = document.getElementById("fridge-canvas");
      if (!fridge) return;
      var pet = raw();
      var name = pet.name || "Your dog";
      var phone = pet.phone || "Add a phone";
      var allergies = pet.allergies || "None listed";
      var meds = pet.meds || "None listed";
      var er = pet.er || "____";
      var w = 1000;
      var h = 1400;
      fridge.width = w;
      fridge.height = h;
      var ctx = fridge.getContext("2d");
      ctx.fillStyle = "#FAF7F2";
      ctx.fillRect(0, 0, w, h);
      ctx.fillStyle = "#1B4332";
      ctx.fillRect(0, 0, w, 200);
      ctx.fillStyle = "#FAF7F2";
      ctx.font = '700 34px "Plus Jakarta Sans", sans-serif';
      ctx.fillText("PAWPOCKET CLUB", 64, 84);
      ctx.font = '560 40px Fraunces, Georgia, serif';
      ctx.fillText("Fridge Emergency Card", 64, 146);
      ctx.fillStyle = "#1F2421";
      ctx.font = '680 72px Fraunces, Georgia, serif';
      ctx.fillText(clip(ctx, name, 870), 64, 320);
      var rows = [
        ["OWNER PHONE", phone],
        ["ALLERGIES", allergies],
        ["MEDS", meds],
        ["NEAREST 24H ER", er]
      ];
      var y = 400;
      rows.forEach(function (row) {
        ctx.fillStyle = "#5A635E";
        ctx.font = '700 22px "Plus Jakarta Sans", sans-serif';
        ctx.fillText(row[0], 64, y);
        ctx.fillStyle = "#1F2421";
        ctx.font = '650 40px "Plus Jakarta Sans", sans-serif';
        ctx.fillText(clip(ctx, row[1], 870), 64, y + 54);
        y += 150;
      });
      ctx.fillStyle = "#1B4332";
      ctx.font = '600 30px "Plus Jakarta Sans", sans-serif';
      var edition = cfg();
      var foot = edition && edition.id === "b"
        ? "AI educational helper. Not a vet."
        : "24/7 licensed veterinary guidance, triage, and second opinions.";
      wrapText(ctx, foot, 64, y + 10, 870, 42);
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
      drawFridge();
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
    var fridgeDownload = document.getElementById("fridge-download");
    if (fridgeDownload) {
      fridgeDownload.addEventListener("click", function () {
        drawFridge();
        var fridge = document.getElementById("fridge-canvas");
        var pet = shown();
        var a = document.createElement("a");
        a.href = fridge.toDataURL("image/png");
        var slug = pet.name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "") || "pet";
        a.download = "pawpocket-" + slug + "-fridge-card.png";
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
    var save = document.getElementById("save-renewal");
    var opted = !!(order && (order.plan === "vip" || order.oto2));
    var reminder = document.getElementById("save-reminder");
    if (save) {
      if (order && order.plan === "vip" && !order.oto2) {
        save.hidden = false;
        save.textContent = "📅 Your renewal date: " + order.firstBillingLabel + ". " + money(order.renewalAmount) + "/mo, billed as " + DESCRIPTOR + ".";
      } else if (order && order.oto2) {
        save.hidden = false;
        save.textContent = "📅 You added the optional annual VIP plan. Later yearly charges are billed as " + DESCRIPTOR + ".";
      } else if (order && order.plan === "guest") {
        save.hidden = false;
        save.textContent = "📅 One-time kit. Nothing renews.";
      } else {
        save.hidden = true;
      }
    }
    if (reminder) reminder.hidden = !opted;

    if (!order || !order.plan) {
      if (empty) empty.hidden = false;
      if (receipt) receipt.hidden = true;
    } else {
      if (!order.purchaseTracked) {
        var purchaseValue = Number(order.kitPrice) + Number(order.extraKitPrice || 0) + (order.oto1 ? Number(order.oto1Price) : 0) + (order.oto2 ? Number(order.annualPrice) : 0);
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
      var tagCount = Number(order.tagQty) || 0;
      var rows = [["Calm & Safe Kit" + (order.plan === "vip" ? " (VIP price)" : ""), order.kitPrice]];
      if (tagCount > 0 && order.extraKitPrice) rows.push([tagCount + " extra QR/NFC pet tag" + (tagCount === 1 ? "" : "s"), order.extraKitPrice]);
      if (order.plan === "vip") rows.push(["VIP Club (30 days free)", 0]);
      rows.push(["60-Day Happy Pet Guarantee", 0]);
      rows.push(["Fridge Emergency Card + Wallet Pet ID", 0]);
      if (order.oto1) rows.push(["Extra QR/NFC pet tag", order.oto1Price]);
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
          h.textContent = "Before the first renewal";
          p.textContent = "We email you a reminder 5 days before each renewal. The first " + money(version.renewal) + "/mo charge is " + order.firstBillingLabel + ", billed as " + DESCRIPTOR + ". Cancel in 1 click any time before then. VIP perks stay active until the end of your current paid period.";
        } else if (order.oto2) {
          h.textContent = "Annual plan, no monthly rebill";
          p.textContent = "The annual lock-in replaces the monthly renewal. We email you a reminder 5 days before each renewal. You can cancel in 1 click any time before the next yearly charge. VIP perks stay active until the end of your current paid period.";
        } else {
          h.textContent = "No renewal on a guest kit";
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
  // Replace YOUR_PIXEL_ID with the real Meta Pixel ID.
  var META = {
    pixelId: "YOUR_PIXEL_ID",
    capiEndpoint: "",
    testEventCode: ""
  };

  var HEADS = {
    "a:advertorial": {
      "1": {
        h1: "It's 11:40 PM. The Mess Is Still on the Floor.",
        lede: "Fur on the couch. A bath that turns into a fight. A collar that still cannot tell a stranger who to call. The Calm & Safe Kit is $49.99. This batch ships in 1-2 business days, and the fridge card plus wallet pet ID are included at $0."
      },
      "2": {
        h1: "Shedding, the Bath, and a Collar With No Way Home.",
        lede: "Three tools. One box. $49.99 one-time, or the highlighted VIP price."
      },
      "3": {
        h1: "Put the Kit Where Your Hand Already Goes.",
        lede: "Steam brush, suction lick mat, battery-free QR/NFC tag. No GPS. $49.99. Optional VIP perks at checkout."
      }
    },
    "b:advertorial": {
      "1": {
        h1: "It's 11 PM. The Wrapper Is on the Floor.",
        lede: "Fur, the bath, and a collar that still cannot tell a stranger who to call. The Calm & Safe Kit is $49.99 and this batch ships in 1-2 business days from a U.S. warehouse. Fridge card and wallet pet ID included at $0. AI educational guidance only if you add VIP."
      },
      "2": {
        h1: "The Gate Was Open for 30 Seconds.",
        lede: "A battery-free QR tag opens on any phone camera. No GPS radio and no tracking fee. The kit is $49.99."
      },
      "3": {
        h1: "Bath-Time Chaos Has a Mat. Shedding Has a Steam Brush.",
        lede: "The Calm & Safe Kit is $49.99 one-time, or the highlighted VIP price. AI educational guidance only if you add VIP."
      }
    },
    "a:product": {
      "1": {
        h1: "The Kit That Lives by the Front Door.",
        lede: "Steam brush, suction lick mat, battery-free QR/NFC tag. $49.99. Optional VIP perks at checkout."
      },
      "2": {
        h1: "Shedding, Bath Time, and a Tag Any Phone Can Scan.",
        lede: "Three tools in one box. $49.99 one-time, or the highlighted VIP price."
      },
      "3": {
        h1: "Stop Sweeping Fur. Stop Wrestling the Bath.",
        lede: "The Calm & Safe Kit is $49.99 one-time, or VIP price with the renewal line above the button. No GPS in the tag."
      }
    },
    "b:product": {
      "1": {
        h1: "Brush It. Bathe It. Tag It.",
        lede: "The Calm & Safe Kit is $49.99, shipped from a U.S. warehouse. Optional VIP perks at checkout. AI educational guidance only if you add them."
      },
      "2": {
        h1: "The Sofa Loses. The Bath Gets a Mat.",
        lede: "$49.99 one-time, or the highlighted VIP price. The renewal line sits above the button."
      },
      "3": {
        h1: "Three Tools for the Messy Week.",
        lede: "Steam brush, lick mat, battery-free tag. $49.99 one-time, or the highlighted VIP price. No GPS."
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
    if (window.fbq) return;
    !function(f,b,e,v,n,t,s){
      if(f.fbq)return;n=f.fbq=function(){n.callMethod?
      n.callMethod.apply(n,arguments):n.queue.push(arguments)};
      if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version="2.0";
      n.queue=[];t=b.createElement(e);t.async=!0;
      t.src=v;s=b.getElementsByTagName(e)[0];
      s.parentNode.insertBefore(t,s)
    }(window, document, "script", "https://connect.facebook.net/en_US/fbevents.js");
    window.fbq("init", META.pixelId);
    window.fbq("track", "PageView");
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
    if (page === "product") {
      var version = cfg();
      trackMeta("ViewContent", {
        content_name: "Calm & Safe Kit",
        content_type: "product",
        content_ids: ["calm-safe-kit"],
        currency: "USD",
        value: version ? version.guestToday : 49.99
      });
    }
  }

  document.addEventListener("DOMContentLoaded", function () {
    mountBar();
    applyHeadlines();
    fillMembershipDates();
    initDemoNotes();
    initDelivery();
    initMetaPage();
    initTabs();
    initGallery();
    initCheckout();
    initUpsell();
    initThanks();
    initCancel();
    initTag();
    initAI();
    initCart();
    initStickyCta();
  });

  function initStickyCta() {
    var bar = document.querySelector(".sticky-cta");
    if (!bar || !("IntersectionObserver" in window)) return;
    var watch = [document.getElementById("pay-btn"), document.querySelector(".tag-row")].filter(Boolean);
    if (!watch.length) return;
    var seen = new Map();
    var obs = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) { seen.set(entry.target, entry.isIntersecting); });
      var covered = false;
      seen.forEach(function (visible) { if (visible) covered = true; });
      bar.classList.toggle("is-docked-away", covered);
    }, { threshold: 0.5 });
    watch.forEach(function (el) {
      seen.set(el, false);
      obs.observe(el);
    });
  }

  function initCart() {
    var drawer = document.getElementById("cart-drawer");
    if (!drawer) return;
    function paintCart() {
      var lines = document.getElementById("cart-lines");
      var count = document.getElementById("cart-count");
      if (!lines) return;
      var version = cfg();
      var form = document.querySelector("[data-checkout]");
      lines.textContent = "";
      var items = [];
      if (form && version) {
        var selected = form.querySelector('input[name="purchase"]:checked');
        var vip = selected && selected.value === "vip";
        var tagInput = document.getElementById("tag-qty-input");
        var tags = tagInput ? parseInt(tagInput.value, 10) || 0 : 0;
        var kit = vip ? version.vipToday : version.guestToday;
        items.push([vip ? "Calm & Safe Kit (VIP price)" : "Calm & Safe Kit", money(kit)]);
        if (tags > 0) items.push([tags + " extra QR/NFC pet tag" + (tags === 1 ? "" : "s"), money((version.extraTag || 9.99) * tags)]);
        if (vip) items.push(["VIP Club (30 days free)", "$0.00"]);
        items.push(["60-Day Happy Pet Guarantee", "$0.00"]);
        items.push(["Fridge Emergency Card + Wallet Pet ID", "$0.00"]);
      }
      if (!items.length) {
        var empty = document.createElement("p");
        empty.textContent = "Your cart is empty. Choose VIP or one-time on the kit page.";
        lines.appendChild(empty);
      } else {
        items.forEach(function (row) {
          var p = document.createElement("p");
          p.className = "cart-line";
          var name = document.createElement("span");
          name.textContent = row[0];
          var price = document.createElement("strong");
          price.textContent = row[1];
          p.appendChild(name);
          p.appendChild(price);
          lines.appendChild(p);
        });
      }
      if (count) count.textContent = items.length ? String(items.filter(function (row) { return row[1] !== "$0.00"; }).length || 1) : "0";
    }
    document.querySelectorAll("[data-cart-open]").forEach(function (btn) {
      btn.addEventListener("click", function () {
        paintCart();
        drawer.hidden = false;
      });
    });
    drawer.querySelectorAll("[data-cart-close]").forEach(function (btn) {
      btn.addEventListener("click", function () { drawer.hidden = true; });
    });
    var checkout = document.getElementById("cart-checkout");
    if (checkout) {
      checkout.addEventListener("click", function () {
        var form = document.querySelector("[data-checkout]");
        drawer.hidden = true;
        if (form && typeof form.requestSubmit === "function") form.requestSubmit();
      });
    }
    drawer.addEventListener("click", function (e) {
      if (e.target === drawer) drawer.hidden = true;
    });
  }
})();
