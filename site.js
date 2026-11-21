/* site.js: menu, light/dark switch, email links, gallery filters, grid size and the photo viewer with slideshow.
   Link it on every page as: <script src="/site.js?v=7" defer></script> */
(function () {
    "use strict";
    var root = document.documentElement;

    // MOBILE MENU
    var menuBtn = document.getElementById("menuToggle");
    var navLinks = document.getElementById("navLinks");
    if (menuBtn && navLinks) {
        var setMenu = function (open) {
            navLinks.classList.toggle("active", open);
            menuBtn.setAttribute("aria-expanded", open);
            menuBtn.setAttribute("aria-label", open ? "Close menu" : "Open menu");
            menuBtn.querySelector("i").className = open ? "fas fa-times" : "fas fa-bars";
        };
        menuBtn.addEventListener("click", function () {
            setMenu(!navLinks.classList.contains("active"));
        });
        navLinks.querySelectorAll("a").forEach(function (a) {
            a.addEventListener("click", function () {
                setMenu(false);
            });
        });
        document.addEventListener("click", function (e) {
            if (!e.target.closest(".site-header")) setMenu(false);
        });
        document.addEventListener("keydown", function (e) {
            if (e.key === "Escape" && navLinks.classList.contains("active")) {
                setMenu(false);
                menuBtn.focus();
            }
        });
    }

    // LIGHT / DARK SWITCH (the choice is kept in the browser under "theme", as before)
    var themeBtn = document.getElementById("themeToggle");
    function currentTheme() {
        var set = root.getAttribute("data-theme");
        if (set) return set;
        return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
    }
    function showThemeIcon() {
        if (!themeBtn) return;
        var dark = currentTheme() === "dark";
        themeBtn.querySelector("i").className = dark ? "fas fa-sun" : "fas fa-moon";
        themeBtn.setAttribute("aria-label", dark ? "Switch to light mode" : "Switch to dark mode");
    }
    if (themeBtn) {
        showThemeIcon();
        themeBtn.addEventListener("click", function () {
            var next = currentTheme() === "dark" ? "light" : "dark";
            root.setAttribute("data-theme", next);
            try {
                localStorage.setItem("theme", next);
            } catch (e) {}
            showThemeIcon();
        });
    }

    // EMAIL LINKS: the address is put together here, so it is not in the page source for spam bots
    document.querySelectorAll("a[data-u][data-d]").forEach(function (a) {
        var address = a.dataset.u + "@" + a.dataset.d;
        a.href = "mailto:" + address;
        if (a.hasAttribute("data-show")) a.textContent = address;
    });

    // GALLERY FILTERS: the buttons show one category at a time; the address (#underwater and so on) keeps the choice
    var bar = document.querySelector(".filter-bar");
    var gallery = document.querySelector("[data-gallery]");
    if (bar && gallery) {
        var buttons = bar.querySelectorAll("[data-filter]");
        var items = gallery.querySelectorAll(".photo");
        var status = document.getElementById("filterStatus");
        var names = {};
        buttons.forEach(function (b) {
            names[b.dataset.filter] = b.textContent.trim();
        });
        var applyFilter = function (filter, updateAddress) {
            if (!names[filter]) filter = "all";
            var shown = 0;
            items.forEach(function (item) {
                var match = filter === "all" || item.dataset.cat.split(" ").indexOf(filter) !== -1;
                item.hidden = !match;
                if (match) shown++;
            });
            buttons.forEach(function (b) {
                b.setAttribute("aria-pressed", b.dataset.filter === filter ? "true" : "false");
            });
            if (status) {
                var label = filter === "all" ? "all categories" : names[filter];
                status.textContent = "Showing " + shown + (shown === 1 ? " photo" : " photos") + " from " + label + ".";
            }
            if (updateAddress) {
                history.replaceState(null, "", filter === "all" ? location.pathname : "#" + filter);
            }
        };
        buttons.forEach(function (b) {
            b.addEventListener("click", function () {
                applyFilter(b.dataset.filter, true);
            });
        });
        window.addEventListener("hashchange", function () {
            applyFilter(location.hash.slice(1), false);
        });
        applyFilter(location.hash.slice(1), false);
    }

    // GRID SIZE: large or small photos; the choice is kept in the browser
    var gridButtons = document.querySelectorAll("[data-grid]");
    if (gallery && gridButtons.length) {
        var setGrid = function (size) {
            gallery.classList.toggle("is-small", size === "small");
            gridButtons.forEach(function (b) {
                b.setAttribute("aria-pressed", b.dataset.grid === size ? "true" : "false");
            });
            try {
                localStorage.setItem("gallery-grid", size);
            } catch (e) {}
        };
        gridButtons.forEach(function (b) {
            b.addEventListener("click", function () {
                setGrid(b.dataset.grid);
            });
        });
        try {
            if (localStorage.getItem("gallery-grid") === "small") setGrid("small");
        } catch (e) {}
    }

    // PHOTO VIEWER: opens a photo full screen; arrows, swipe, Escape and a slideshow work
    var viewer = document.getElementById("lightbox");
    if (viewer && typeof viewer.showModal === "function") {
        var big = viewer.querySelector("img");
        var BLANK = big.getAttribute("src");
        var caption = viewer.querySelector(".lightbox-text");
        var count = viewer.querySelector(".lightbox-count");
        var list = [];
        var index = 0;
        var opener = null;

        var show = function (i) {
            index = (i + list.length) % list.length;
            var figure = list[index];
            var img = figure.querySelector("img");
            var cap = figure.querySelector("figcaption");
            big.src = img.currentSrc || img.src;
            big.alt = img.alt;
            var text = "";
            if (cap) {
                var cat = cap.querySelector(".photo-cat");
                var rest = cap.textContent.replace(cat ? cat.textContent : "", "").replace(/\s+/g, " ").trim();
                text = cat ? cat.textContent.trim() + ": " + rest : rest;
            }
            caption.textContent = text;
            count.textContent = "Photo " + (index + 1) + " of " + list.length;
        };

        // SLIDESHOW: moves to the next photo every 4 seconds until it is paused or the viewer closes
        var playBtn = viewer.querySelector(".lightbox-play");
        var timer = null;
        var setPlaying = function (on) {
            clearInterval(timer);
            timer = on ? setInterval(function () {
                show(index + 1);
            }, 4000) : null;
            playBtn.setAttribute("aria-pressed", on ? "true" : "false");
            playBtn.setAttribute("aria-label", on ? "Pause slideshow" : "Play slideshow");
            playBtn.querySelector("i").className = on ? "fas fa-pause" : "fas fa-play";
        };
        // moving by hand restarts the 4 seconds, so a photo is never skipped straight away
        var step = function (by) {
            show(index + by);
            if (timer) setPlaying(true);
        };

        var openViewer = function (figure, from, play) {
            list = Array.prototype.filter.call(document.querySelectorAll(".photo"), function (f) {
                return !f.hidden;
            });
            if (!list.length) return;
            opener = from;
            show(figure ? list.indexOf(figure) : 0);
            viewer.showModal();
            setPlaying(!!play);
            (play ? playBtn : viewer.querySelector(".lightbox-close")).focus();
        };
        document.addEventListener("click", function (e) {
            var btn = e.target.closest(".photo-open");
            if (btn) openViewer(btn.closest(".photo"), btn, false);
        });
        var startBtn = document.getElementById("slideshowStart");
        if (startBtn) {
            startBtn.addEventListener("click", function () {
                openViewer(null, startBtn, true);
            });
        }
        playBtn.addEventListener("click", function () {
            setPlaying(!timer);
        });
        viewer.querySelector(".lightbox-prev").addEventListener("click", function () {
            step(-1);
        });
        viewer.querySelector(".lightbox-next").addEventListener("click", function () {
            step(1);
        });
        viewer.querySelector(".lightbox-close").addEventListener("click", function () {
            viewer.close();
        });
        viewer.addEventListener("keydown", function (e) {
            if (e.key === "ArrowLeft") step(-1);
            if (e.key === "ArrowRight") step(1);
        });
        // a click on the dark area around the photo closes the viewer
        viewer.addEventListener("click", function (e) {
            if (e.target === viewer) viewer.close();
        });
        viewer.addEventListener("close", function () {
            setPlaying(false);
            big.src = BLANK;
            if (opener) opener.focus();
        });
        var startX = null;
        viewer.addEventListener("touchstart", function (e) {
            startX = e.touches[0].clientX;
        }, { passive: true });
        viewer.addEventListener("touchend", function (e) {
            if (startX === null) return;
            var dx = e.changedTouches[0].clientX - startX;
            if (Math.abs(dx) > 50) step(dx < 0 ? 1 : -1);
            startX = null;
        });
    }
})();
