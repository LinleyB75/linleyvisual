# Linley Bignoux | Email Developer Portfolio

**Email Developer**: transactional email, API and data design, and the systems behind it. HTML, CSS, MJML, Handlebars, Liquid, JavaScript and Node.js

The source of my portfolio site, [linleyb.com](https://linleyb.com/). I'm a freelance **Email Developer** in Mauritius, working with clients locally and worldwide.

I design, develop, program and test emails end to end, in HTML, CSS and MJML, with dynamic content in Handlebars and Liquid. I work out exactly what data your application needs to send, and I write my side of the API: a tested request and a Node.js reference for the send step, ready for your developer. I also look at the whole system behind an email, from your application's data through the email and your platform to the inbox, so I can find where it breaks. Your developer connects it. I test in major email clients, including older desktop Outlook versions, with accessibility and deliverability in mind.

---

## 🛠️ How the Site Is Built

The site is built by hand to be light and accessible, with no frontend framework:
* **HTML5 & CSS3:** semantic markup, custom properties, CSS Grid, Flexbox and layouts that adapt to the screen. Light and dark themes follow the device setting, with a toggle to override it.
* **Vanilla JavaScript:** mobile navigation, dark/light mode, an image lightbox for certificates, the hero's drawn red system line (redrawn whenever the layout changes), and a rotating case study button that pauses on hover and focus and respects reduced motion. Contact forms have spam checks, and email links are put together in the browser so the address is not written in the page source. A consent banner sets Google Analytics cookies only if accepted. Font Awesome supplies the icons.
* **SEO & Metadata:** JSON-LD structured data for the business, the person, the website, the FAQs and the blog posts, Open Graph and Twitter tags, canonical URLs and a sitemap.
* **Accessibility:** checked with axe-core in light and dark mode at three screen widths, with text contrast measured against the real background in both themes.
* **Hosting:** GitHub Pages, at [linleyb.com](https://linleyb.com/).

---

## 📧 What I Work With

* **HTML, CSS and MJML:** emails I design and build, with inline styles, VML and ghost tables for Outlook, dark mode support, and MJML for component-based emails.
* **Handlebars and Liquid:** dynamic content and fallbacks for data-rich emails.
* **JavaScript and Node.js:** JSON params, ESP API requests and the tests behind them, including a Node.js reference for the send step with input checks, a secret check, error handling and a dry-run mode.
* **API & data design:** defining what data your application sends to your email platform: the JSON fields, their names and types, which are required, the fallbacks, and the checks.
* **Troubleshooting the whole system:** tracing a problem from your application's data to the email, the platform and the inbox.
* **ESP setup:** Brevo, Mailchimp, Klaviyo, MailerLite and Kit. The email is set up in your platform and tested in a non-production environment.
* **Domain authentication:** SPF, DKIM and DMARC set up and checked, with access to your domain's DNS.
* **Developer handoff:** the email's ID or event name, a table of the fields it needs (name, format, required or optional), and where the platform uses an API, a tested request.
* **QA & testing:** major clients including Outlook, Apple Mail, Gmail and dark mode, plus test sends with unusual data such as missing or very long names, fixed before delivery.

**What I don't do:** connect your website, shop or application to your email platform. Your developer does that, using what I hand over.

---

## 📝 Blog, Case Studies & Examples

* **Blog:** [Email Dev Notes](https://linleyb.com/blog/): rendering bugs and fixes, transactional email, and the systems behind it.

**Case studies and guides**
* [Building a Payment Failure Email, Step by Step: MJML, HTML, CSS, Node.js and Brevo](https://linleyb.com/blog/payment-failure-email-step-by-step.html)
* [Where Transactional Email Fails: Seven Places Between Your Application and the Inbox](https://linleyb.com/blog/where-transactional-email-fails.html)
* [Brevo 2FA Setup Email: A Development Pipeline from MJML to Tested Send](https://linleyb.com/blog/2fa-setup-notification-email-brevo.html)
* [Receipt Email Rebuilt as a System: JSON Data, Testing and Troubleshooting](https://linleyb.com/blog/payment-receipt-email-from-json.html)
* [Systems Thinking in Email Development: Why Isolated Code Fixes Fail Without Ecosystem Awareness](https://linleyb.com/blog/systems-thinking-email-development.html)

**Rendering fixes**
* [Building a dark promo email: what broke, what fixed it, and what to watch for](https://linleyb.com/blog/dark-promo-email-fundamentals.html)
* [What dark mode inversion did to my newsletter, and the fixes](https://linleyb.com/blog/dark-mode-inversion-fixes.html)
* [Footer text turning black in macOS dark mode: the fix](https://linleyb.com/blog/footer-text-macos-dark-mode.html)
* [MJML images shrinking and spacing apart in columns: the padding fix](https://linleyb.com/blog/mj-group-padding.html)

**Email builds:** [Email-Dev repository](https://github.com/LinleyB75/Email-Dev). Client builds stay private, and the case studies describe them.

---

## 📁 What Is in This Repository

| Path | What it is |
| --- | --- |
| `index.html` | The homepage |
| `portfolio.html`, `certifications.html` | The portfolio and the certifications |
| `privacy.html`, `thanks.html`, `404.html` | The privacy policy, the thank-you page after the contact form, and the not-found page |
| `blog/` | The blog index, its stylesheet, the posts and their images |
| `consent.js`, `mail-link.js` | The consent banner, and the script that puts email links together in the browser |
| `sitemap.xml` | The sitemap |

---

## 📬 Let's Connect

Need a transactional email set up properly, from your application to the inbox? Let's talk.
* **Live Site:** [linleyb.com](https://linleyb.com/)
* **Email:** contact@linleyb.com
* **Contra:** [Linley Bignoux Profile](https://linleybignouxzqme9nmu.contra.com/)
* **GitHub:** [LinleyB75](https://github.com/LinleyB75)
