// Puts email links together in the browser, so the address is not written in the page source for spam bots to harvest.
// A link needs data-u (the part before the @) and data-d (the domain).
// Add data-show to a link to also show the address as its text.
(function () {
    document.querySelectorAll("a[data-u][data-d]").forEach(function (a) {
        var address = a.dataset.u + "@" + a.dataset.d;
        a.href = "mailto:" + address;
        if (a.hasAttribute("data-show")) a.textContent = address;
    });
})();
