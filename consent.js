/* consent.js: cookie consent for linleyb.com
   - Google Analytics is NOT loaded until the visitor clicks Accept.
   - The choice is remembered in the browser (localStorage key: cookie-consent).
   - Visitors can change their mind with the "Cookie settings" link in the footer.
   Link it on every page as: <script src="/consent.js?v=1" defer></script> */
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
            ".cc-banner{position:fixed;left:0;right:0;bottom:0;z-index:1000;background:var(--card-bg,#fff);color:var(--text,#1a1a1a);border-top:4px solid var(--accent,#d10500);box-shadow:0 -8px 20px rgba(0,0,0,.18);padding:1rem 1.25rem;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;}" +
            ".cc-banner[hidden]{display:none}" +
            ".cc-inner{max-width:1100px;margin:0 auto;display:flex;flex-wrap:wrap;align-items:center;gap:1rem 1.5rem;justify-content:space-between}" +
            ".cc-text{margin:0;flex:1 1 380px;font-size:1rem;line-height:1.5}" +
            ".cc-text a{color:inherit;font-weight:700;text-decoration:underline}" +
            ".cc-actions{display:flex;gap:.75rem;flex:0 0 auto}" +
            ".cc-btn{font:inherit;font-weight:800;font-size:1rem;padding:.7rem 1.6rem;min-width:7.5rem;border-radius:10px;border:2px solid var(--primary,#0a0a0a);cursor:pointer;background:transparent;color:var(--primary,#0a0a0a)}" +
            ".cc-btn:hover{background:var(--primary,#0a0a0a);color:var(--bg,#fff)}" +
            ".cc-accept{background:#d10500;border-color:#d10500;color:#fff}" +
            ".cc-accept:hover{background:#b30000;border-color:#b30000;color:#fff}" +
            ".cc-btn:focus-visible{outline:3px solid var(--accent,#d10500);outline-offset:3px}" +
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
            banner.hidden = true;
        });
        banner.querySelector(".cc-decline").addEventListener("click", function () {
            setChoice("denied");
            gtag("consent", "update", { analytics_storage: "denied" });
            removeAnalyticsCookies();
            banner.hidden = true;
        });
        return banner;
    }

    function showBanner(moveFocus) {
        var b = buildBanner();
        b.hidden = false;
        if (moveFocus) b.querySelector(".cc-accept").focus();
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
            showBanner(true);
        }
    });

    function init() {
        addSettingsLink();
        var choice = getChoice();
        if (choice === "granted") loadAnalytics();
        else if (choice !== "denied") showBanner(false);
    }

    if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init);
    else init();
})();
