/* consent.js: cookie consent for linleyb.com
   - Google Analytics is NOT loaded until the visitor clicks Accept.
   - The choice is remembered in the browser (localStorage key: cookie-consent).
   - Visitors can change their mind with the "Cookie settings" link in the footer.
   - Colours follow the site's theme variables (royal blue and yellow), with fallbacks for pages without them.
   Link it on every page as: <script src="/consent.js?v=2" defer></script> */
(function () {
    "use strict";

    var GA_ID = "G-E37T8FJ661";
    var KEY = "cookie-consent";
    var analyticsLoaded = false;
    var banner = null;

    // Google Consent Mode: everything starts denied
    window.dataLayer = window.dataLayer || [];
    function gtag() {
        window.dataLayer.push(arguments);
    }
    window.gtag = window.gtag || gtag;
    gtag("consent", "default", {
        analytics_storage: "denied",
        ad_storage: "denied",
        ad_user_data: "denied",
        ad_personalization: "denied",
    });

    function getChoice() {
        try {
            return localStorage.getItem(KEY);
        } catch (e) {
            return null;
        }
    }

    function setChoice(value) {
        try {
            localStorage.setItem(KEY, value);
        } catch (e) {}
    }

    function loadAnalytics() {
        if (analyticsLoaded) return;
        analyticsLoaded = true;
        gtag("consent", "update", { analytics_storage: "granted" });
        var s = document.createElement("script");
        s.async = true;
        s.src = "https://www.googletagmanager.com/gtag/js?id=" + GA_ID;
        document.head.appendChild(s);
        gtag("js", new Date());
        gtag("config", GA_ID);
    }

    function removeAnalyticsCookies() {
        var host = location.hostname;
        var parts = host.split(".");
        var domains = [host, "." + host];
        if (parts.length > 2) domains.push("." + parts.slice(-2).join("."));
        document.cookie.split(";").forEach(function (c) {
            var name = c.split("=")[0].trim();
            if (name.indexOf("_ga") === 0) {
                domains.forEach(function (d) {
                    document.cookie = name + "=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/; domain=" + d;
                });
                document.cookie = name + "=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/";
            }
        });
    }

    function buildBanner() {
        if (banner) return banner;

        var style = document.createElement("style");
        style.textContent =
            ".cc-banner{position:fixed;left:0;right:0;bottom:0;z-index:1000;transform:translateY(105%);transition:transform .8s cubic-bezier(.22,.61,.36,1);background:var(--card-bg,#fff);color:var(--text,#0b1f3a);border-top:4px solid var(--accent,#014aae);box-shadow:0 -8px 20px rgba(0,0,0,.18);padding:1rem 1.25rem;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;}" +
            ".cc-banner[hidden]{display:none}" +
            ".cc-banner.cc-visible{transform:translateY(0)}" +
            "@media (prefers-reduced-motion:reduce){.cc-banner{transition:none}}" +
            ".cc-inner{max-width:1100px;margin:0 auto;display:flex;flex-wrap:wrap;align-items:center;gap:1rem 1.5rem;justify-content:space-between}" +
            ".cc-text{margin:0;flex:1 1 380px;font-size:1rem;line-height:1.5}" +
            ".cc-text a{color:inherit;font-weight:700;text-decoration:underline}" +
            ".cc-actions{display:flex;gap:.75rem;flex:0 0 auto}" +
            ".cc-btn{font:inherit;font-weight:800;font-size:1rem;padding:.7rem 1.6rem;min-width:7.5rem;border-radius:10px;border:2px solid var(--primary,#014aae);cursor:pointer;background:transparent;color:var(--primary,#014aae)}" +
            ".cc-btn:hover{background:var(--primary,#014aae);color:var(--bg,#fff)}" +
            ".cc-accept{background:#ffff00;border-color:var(--btn-border,#014aae);color:#014aae}" +
            ".cc-accept:hover{background:#fedd59;border-color:var(--btn-border,#014aae);color:#014aae}" +
            ".cc-btn:focus-visible{outline:3px solid var(--accent,#014aae);outline-offset:3px}" +
            "@media (max-width:600px){.cc-actions{width:100%}.cc-btn{flex:1}}";
        document.head.appendChild(style);

        banner = document.createElement("div");
        banner.className = "cc-banner";
        banner.setAttribute("role", "dialog");
        banner.setAttribute("aria-label", "Cookie consent");
        banner.hidden = true;
        banner.innerHTML =
            '<div class="cc-inner">' +
            '<p class="cc-text">This site uses Google Analytics cookies to count visits. They are only set if you accept. <a href="/privacy.html">Privacy Policy</a></p>' +
            '<div class="cc-actions">' +
            '<button type="button" class="cc-btn cc-decline">Decline</button>' +
            '<button type="button" class="cc-btn cc-accept">Accept</button>' +
            "</div></div>";
        document.body.appendChild(banner);

        banner.querySelector(".cc-accept").addEventListener("click", function () {
            setChoice("granted");
            loadAnalytics();
            hideBanner();
        });
        banner.querySelector(".cc-decline").addEventListener("click", function () {
            setChoice("denied");
            gtag("consent", "update", { analytics_storage: "denied" });
            removeAnalyticsCookies();
            hideBanner();
        });
        return banner;
    }

    var SHOW_DELAY = 1200; // how long after the page opens the banner starts to slide up (milliseconds)
    var SLIDE_TIME = 800; // how long the slide takes, the same as in the style above

    function reducedMotion() {
        return window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    }

    // Slide the banner up from the bottom of the screen. "delay" waits first, so it does not just appear with the page.
    function showBanner(moveFocus, delay) {
        var b = buildBanner();
        setTimeout(function () {
            b.hidden = false;
            // wait for two frames, so the browser draws it below the screen first and then slides it up
            requestAnimationFrame(function () {
                requestAnimationFrame(function () {
                    b.classList.add("cc-visible");
                });
            });
            if (moveFocus) b.querySelector(".cc-accept").focus();
        }, reducedMotion() ? 0 : delay || 0);
    }

    // Slide the banner back down, then hide it
    function hideBanner() {
        banner.classList.remove("cc-visible");
        setTimeout(function () {
            if (!banner.classList.contains("cc-visible")) banner.hidden = true;
        }, reducedMotion() ? 0 : SLIDE_TIME);
    }

    function addSettingsLink() {
        var p = document.querySelector(".footer-copyright");
        if (!p || p.querySelector("[data-cookie-settings]")) return;
        p.appendChild(document.createTextNode(" | "));
        var a = document.createElement("a");
        a.href = "#";
        a.setAttribute("data-cookie-settings", "");
        a.style.cssText = "color: inherit; text-decoration: none";
        a.textContent = "Cookie settings";
        p.appendChild(a);
    }

    document.addEventListener("click", function (e) {
        var t = e.target.closest ? e.target.closest("[data-cookie-settings]") : null;
        if (t) {
            e.preventDefault();
            showBanner(true, 0);
        }
    });

    function init() {
        addSettingsLink();
        var choice = getChoice();
        if (choice === "granted") loadAnalytics();
        else if (choice !== "denied") showBanner(false, SHOW_DELAY);
    }

    if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init);
    else init();
})();
