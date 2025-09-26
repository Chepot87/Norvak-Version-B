// ===== Mobile drawer =====
const burger = document.getElementById('burger');
const drawer = document.getElementById('drawer');

burger?.addEventListener('click', () => {
  const open = drawer.classList.toggle('show');
  burger.setAttribute('aria-expanded', open ? 'true' : 'false');
});

drawer?.querySelectorAll('a').forEach(a => 
  a.addEventListener('click', () => drawer.classList.remove('show'))
);

// ===== Reveal on scroll =====
const io = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (e.isIntersecting) e.target.classList.add('show');
  });
}, { threshold: 0.12 });

document.querySelectorAll('.reveal').forEach(el => io.observe(el));

// ===== Back to top button =====
const toTop = document.getElementById('toTop') || document.querySelector('.totop');

window.addEventListener('scroll', () => {
  if (toTop) toTop.style.display = window.scrollY > 900 ? 'block' : 'none';
});

toTop?.addEventListener('click', () => 
  window.scrollTo({ top: 0, behavior: 'smooth' })
);

// ===== Dynamic year in footer =====
const yearEl = document.getElementById('year');
if (yearEl) yearEl.textContent = new Date().getFullYear();

// ===== Lightweight form success =====
// Works with Formspree or similar; replace action in index.html
const form = document.getElementById('contactForm');
const note = document.getElementById('formNote');

form?.addEventListener('submit', async (e) => {
  if (!form.action.includes('formspree')) return; // no-op until configured
  e.preventDefault();

  const res = await fetch(form.action, {
    method: 'POST',
    body: new FormData(form),
    headers: { 'Accept': 'application/json' }
  });

  if (res.ok) {
    form.reset();
    if (note) {
      note.style.display = 'block';
      setTimeout(() => note.style.display = 'none', 4000);
    }
  }
});


// ===== Calendly control (robusto) =====
(() => {
  const calendlyLinks = {
    web: "https://calendly.com/norvakweb/web-page-design",
    seo: "https://calendly.com/norvakweb/seo-optimization",
    support: "https://calendly.com/norvakweb/support-maintenance",
    consult: "https://calendly.com/norvakweb/consultation-call"
  };

  function onCalendlyReady(cb) {
    if (window.Calendly && typeof Calendly.initInlineWidgets === "function") {
      cb();
    } else {
      const t = setInterval(() => {
        if (window.Calendly && typeof Calendly.initInlineWidgets === "function") {
          clearInterval(t);
          cb();
        }
      }, 100);
    }
  }

  function mountCalendly(url) {
    const container = document.getElementById("calendlyContainer");
    if (!container) return;

    container.innerHTML = `
      <div class="calendly-inline-widget" data-url="${url}"
           style="min-width:320px;height:700px;"></div>
    `;

    // Inicializa Calendly cuando esté listo
    onCalendlyReady(() => {
      Calendly.initInlineWidgets();

      // fallback: si no aparece el iframe en 3s, mostramos mensaje + link
      setTimeout(() => {
        const iframe = container.querySelector("iframe");
        if (!iframe) {
          container.innerHTML = `
            <div style="padding:1rem; border:1px solid #16e078; border-radius:12px;">
              <p style="margin:0 0 .5rem 0">Couldn’t load Calendly embed.</p>
              <p style="margin:0">Check that this event exists and is public:</p>
              <p style="margin:.5rem 0 0 0">
                <a href="${url}" target="_blank" rel="noopener noreferrer">${url}</a>
              </p>
            </div>
          `;
          console.warn("Calendly iframe not found. Verify the event URL:", url);
        }
      }, 3000);
    });
  }

  function showCalendly(service, btnEl) {
    const url = calendlyLinks[service];
    if (!url) return;
    mountCalendly(url);

    // estado visual
    document.querySelectorAll(".service-buttons .svc-btn").forEach(b => {
      b.classList.remove("is-active");
      b.setAttribute("aria-selected", "false");
    });
    if (btnEl) {
      btnEl.classList.add("is-active");
      btnEl.setAttribute("aria-selected", "true");
    }
  }

  document.addEventListener("DOMContentLoaded", () => {
    mountCalendly(calendlyLinks.web);
    const firstTab = document.getElementById("tab-web") ||
                     document.querySelector(".service-buttons .svc-btn");
    if (firstTab) {
      firstTab.classList.add("is-active");
      firstTab.setAttribute("aria-selected", "true");
    }
  });

  // necesario porque usas onclick="showCalendly('...')"
  window.showCalendly = showCalendly;
})();






// ===== Matrix Background Effect =====
const canvas = document.getElementById('matrix');
const ctx = canvas.getContext('2d');

canvas.height = window.innerHeight;
canvas.width = window.innerWidth;

const letters = "01NORVAKWEBDEV01";
const fontSize = 16;
const columns = canvas.width / fontSize;
const drops = [];

// set initial y for each column
for (let x = 0; x < columns; x++) drops[x] = 1;

function draw() {
  // fade effect
  ctx.fillStyle = "rgba(13,13,13,0.15)";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  ctx.font = fontSize + "px monospace";

  for (let i = 0; i < drops.length; i++) {
    const text = letters[Math.floor(Math.random() * letters.length)];

    // randomize colors from Norvak palette
    const colors = ["#ff2f92", "#2fff6b", "#22b9ff"];
    ctx.fillStyle = colors[Math.floor(Math.random() * colors.length)];

    ctx.fillText(text, i * fontSize, drops[i] * fontSize);

    // reset randomly
    if (drops[i] * fontSize > canvas.height && Math.random() > 0.975) {
      drops[i] = 0;
    }

    drops[i]++;
  }
}

setInterval(draw, 33);

// responsive resize
window.addEventListener("resize", () => {
  canvas.height = window.innerHeight;
  canvas.width = window.innerWidth;
});



(function(){
  const KEY = 'norvak_intro_seen';
  const intro = document.querySelector('.intro-overlay');

  // Si ya se vio esta sesión, no mostrar
  if (sessionStorage.getItem(KEY)) {
    intro.remove();
    return;
  }

  // Mostrar
  document.body.classList.add('no-scroll');
  requestAnimationFrame(() => intro.classList.add('show'));

  // Duración total del intro (ajusta si quieres)
  const DURATION = 2000; // ms

  setTimeout(() => {
    intro.classList.add('hide');
    sessionStorage.setItem(KEY, '1');
    // limpiar al terminar la transición
    intro.addEventListener('transitionend', () => {
      intro.remove();
    }, { once:true });
    document.body.classList.remove('no-scroll');
  }, DURATION);
})();