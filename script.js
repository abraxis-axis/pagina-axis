// ========================================
// AXIS — script.js
// ========================================

// ---- Services data ----
const services = [
    { t: "Páginas informativas", d: "Sitios claros y rápidos para que tus clientes conozcan tu empresa y confíen en ella.", tag: "WEB" },
    { t: "Apps con AppSheet", d: "Aplicaciones a la medida de tu operación: ventas, clientes, personal o lo que necesites.", tag: "APP" },
    { t: "Automatización de procesos", d: "Menos trabajo manual, menos errores: lo repetitivo se hace solo.", tag: "AUTO" },
    { t: "Agenda de citas", d: "Tus clientes reservan solos, tú recibes la confirmación al instante.", tag: "AGENDA" },
    { t: "Mejora de procesos", d: "Revisamos cómo trabaja tu negocio hoy y proponemos una forma más simple de hacerlo.", tag: "MEJORA" },
    { t: "Aplicaciones web", d: "Herramientas propias para tu equipo, accesibles desde cualquier dispositivo.", tag: "WEB APP" },
];

const grid = document.getElementById('services-grid');
services.forEach(s => {
    const el = document.createElement('div');
    el.className = 'service-card';
    el.innerHTML = `
        <div class="service-icon" aria-hidden="true">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path d="M8 1L15 14H1L8 1Z" stroke="white" stroke-width="1.4" stroke-linejoin="round"/>
            </svg>
        </div>
        <span class="service-tag">${s.tag}</span>
        <h3>${s.t}</h3>
        <p>${s.d}</p>`;
    grid.appendChild(el);
});

// ---- Mobile nav toggle ----
const navToggle = document.getElementById('nav-toggle');
const navMenu = document.getElementById('nav-menu');

navToggle.addEventListener('click', () => {
    const expanded = navToggle.getAttribute('aria-expanded') === 'true';
    navToggle.setAttribute('aria-expanded', String(!expanded));
    navMenu.classList.toggle('open');
});

// Cierra el menú al hacer clic en un enlace
navMenu.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
        navToggle.setAttribute('aria-expanded', 'false');
        navMenu.classList.remove('open');
    });
});

// ---- Demo tabs ----
const tabBtns = document.querySelectorAll('.tab-btn');
const panels = document.querySelectorAll('.demo-panel');
const urls = { d1: 'tallertorres.mx', d2: 'agenda.tuclinica.mx', d3: 'inventario.axis-ab.com' };
const viewToggle = document.getElementById('view-toggle');

tabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        tabBtns.forEach(b => {
            b.classList.remove('active');
            b.setAttribute('aria-selected', 'false');
        });
        btn.classList.add('active');
        btn.setAttribute('aria-selected', 'true');

        panels.forEach(p => p.classList.remove('active'));
        document.getElementById(btn.dataset.tab).classList.add('active');
        document.getElementById('demo-url').textContent = urls[btn.dataset.tab];

        // Oculta el toggle si no es Demo 1 (mantiene el espacio)
        if (btn.dataset.tab === 'd1') {
            viewToggle.classList.remove('hidden');
        } else {
            viewToggle.classList.add('hidden');
        }
    });
});

// ---- Demo 1: view toggle ----
viewToggle.addEventListener('click', (e) => {
    const b = e.target.closest('button');
    if (!b) return;
    viewToggle.querySelectorAll('button').forEach(x => {
        x.classList.remove('active');
        x.setAttribute('aria-pressed', 'false');
    });
    b.classList.add('active');
    b.setAttribute('aria-pressed', 'true');
    document.getElementById('d1-wrapper').classList.toggle('mobile', b.dataset.view === 'mobile');
});

// ---- Demo 2: agenda ----
const svcSelect = document.getElementById('svc-select');
const dateSelect = document.getElementById('date-select');
const slotsWrap = document.getElementById('slots');
const sumSvc = document.getElementById('sum-svc');
const sumDate = document.getElementById('sum-date');
const sumTime = document.getElementById('sum-time');
const confirmBox = document.getElementById('d2-confirm');
let selectedSlot = null;

svcSelect.addEventListener('change', () => sumSvc.textContent = svcSelect.value);

dateSelect.addEventListener('change', () => {
    sumDate.textContent = dateSelect.value
        ? new Date(dateSelect.value + 'T00:00').toLocaleDateString('es-MX', { day: 'numeric', month: 'short' })
        : '—';
    confirmBox.classList.remove('show');
});

slotsWrap.addEventListener('click', (e) => {
    const s = e.target.closest('.slot');
    if (!s) return;
    slotsWrap.querySelectorAll('.slot').forEach(x => x.classList.remove('selected'));
    s.classList.add('selected');
    selectedSlot = s.textContent;
    sumTime.textContent = selectedSlot;
    confirmBox.classList.remove('show');
});

// Soporte de teclado para los slots
slotsWrap.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        e.target.click();
    }
});

document.getElementById('confirm-btn').addEventListener('click', () => {
    if (!dateSelect.value || !selectedSlot) {
        if (!dateSelect.value) sumDate.textContent = 'Elige una fecha';
        if (!selectedSlot) sumTime.textContent = 'Elige un horario';
        return;
    }
    confirmBox.classList.add('show');
});

// ---- Demo 3: inventario ----
const invBody = document.getElementById('inv-body');

invBody.addEventListener('click', (e) => {
    const b = e.target.closest('.del-btn');
    if (b) {
        const row = b.closest('tr');
        row.style.transition = 'opacity .2s';
        row.style.opacity = '0';
        setTimeout(() => row.remove(), 200);
    }
});

document.getElementById('add-btn').addEventListener('click', () => {
    const prod = document.getElementById('new-prod').value.trim();
    const qty = parseInt(document.getElementById('new-qty').value, 10);
    if (!prod || isNaN(qty) || qty < 0) return;
    const low = qty <= 5;
    const tr = document.createElement('tr');
    tr.innerHTML = `
        <td>${escapeHtml(prod)}</td>
        <td>${qty}</td>
        <td><span class="stock-pill ${low ? 'stock-low' : 'stock-ok'}">${low ? 'Bajo stock' : 'Suficiente'}</span></td>
        <td><button class="del-btn" aria-label="Eliminar ${escapeHtml(prod)}">✕</button></td>`;
    invBody.appendChild(tr);
    document.getElementById('new-prod').value = '';
    document.getElementById('new-qty').value = '';
    document.getElementById('new-prod').focus();
});

// Previene XSS en inputs del usuario
function escapeHtml(str) {
    return str
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#039;');
}

// ---- Formulario de contacto → WhatsApp ----
const contactForm = document.getElementById('contact-form');

contactForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const nombre = document.getElementById('contact-nombre').value.trim();
    const empresa = document.getElementById('contact-empresa').value.trim();
    const necesidad = document.getElementById('contact-necesidad').value;

    let mensaje = `Hola, me interesa conocer más sobre sus servicios.\n\n`;
    if (nombre)  mensaje += `*Nombre:* ${nombre}\n`;
    if (empresa) mensaje += `*Empresa:* ${empresa}\n`;
    mensaje += `*Necesito:* ${necesidad}`;

    const url = `https://wa.me/523112794209?text=${encodeURIComponent(mensaje)}`;
    window.open(url, '_blank', 'noopener,noreferrer');
});

// ---- Hero network canvas ----
const canvas = document.getElementById('network');
const ctx = canvas.getContext('2d');
const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

function resize() {
    canvas.width = canvas.clientWidth * devicePixelRatio;
    canvas.height = canvas.clientHeight * devicePixelRatio;
    ctx.setTransform(devicePixelRatio, 0, 0, devicePixelRatio, 0, 0);
}
window.addEventListener('resize', resize);
resize();

const W = () => canvas.clientWidth;
const H = () => canvas.clientHeight;
const vertex = () => ({ x: W() * 0.72, y: H() * 0.5 });
const labels = ['Ventas', 'Clientes', 'Inventario', 'Citas', 'Reportes', 'Soporte'];
let nodes = [];

function buildNodes() {
    nodes = labels.map((label, i) => {
        const angle = (Math.PI * 1.15) * (i / (labels.length - 1)) - Math.PI * 0.575;
        const r = Math.min(W() * 0.42, H() * 0.42);
        return {
            label,
            x: vertex().x - Math.cos(angle) * r - W() * 0.08,
            y: vertex().y + Math.sin(angle) * r,
            phase: Math.random() * Math.PI * 2
        };
    });
}
buildNodes();
window.addEventListener('resize', buildNodes);

let animT = 0;
let animFrame;

function draw() {
    // Si el usuario prefiere reducir movimiento, dibuja una vez estático
    animT += reducedMotion ? 0 : 0.012;

    ctx.clearRect(0, 0, W(), H());
    const v = vertex();

    nodes.forEach((n) => {
        const pulse = reducedMotion ? 0.5 : (Math.sin(animT * 1.4 + n.phase) + 1) / 2;
        const grad = ctx.createLinearGradient(n.x, n.y, v.x, v.y);
        grad.addColorStop(0, 'rgba(111,200,242,0.15)');
        grad.addColorStop(1, 'rgba(46,125,209,0.55)');
        ctx.strokeStyle = grad;
        ctx.lineWidth = 1.2;
        ctx.beginPath();
        ctx.moveTo(n.x, n.y);
        ctx.lineTo(v.x, v.y);
        ctx.stroke();

        if (!reducedMotion) {
            // Dot viajero a lo largo de la línea
            const px = n.x + (v.x - n.x) * pulse;
            const py = n.y + (v.y - n.y) * pulse;
            ctx.beginPath();
            ctx.arc(px, py, 2, 0, Math.PI * 2);
            ctx.fillStyle = 'rgba(111,200,242,0.9)';
            ctx.fill();
        }

        // Nodo
        ctx.beginPath();
        ctx.arc(n.x, n.y, 4, 0, Math.PI * 2);
        ctx.fillStyle = '#0F2540';
        ctx.strokeStyle = 'rgba(111,200,242,0.7)';
        ctx.lineWidth = 1.5;
        ctx.fill();
        ctx.stroke();

        ctx.font = '11px IBM Plex Mono, monospace';
        ctx.fillStyle = 'rgba(183,194,208,0.85)';
        ctx.textAlign = 'right';
        ctx.fillText(n.label, n.x - 10, n.y + 4);
    });

    // Vértice central (Axis)
    const glow = ctx.createRadialGradient(v.x, v.y, 0, v.x, v.y, 26);
    glow.addColorStop(0, 'rgba(111,200,242,0.5)');
    glow.addColorStop(1, 'rgba(111,200,242,0)');
    ctx.beginPath();
    ctx.arc(v.x, v.y, 26, 0, Math.PI * 2);
    ctx.fillStyle = glow;
    ctx.fill();

    ctx.beginPath();
    ctx.arc(v.x, v.y, 7, 0, Math.PI * 2);
    ctx.fillStyle = '#6FC8F2';
    ctx.fill();

    ctx.font = '600 11px IBM Plex Mono, monospace';
    ctx.fillStyle = '#fff';
    ctx.textAlign = 'left';
    ctx.fillText('AXIS', v.x + 14, v.y + 4);

    if (reducedMotion) {
        // No se sigue animando
        return;
    }
    animFrame = requestAnimationFrame(draw);
}

draw();

// ========================================
// SCROLL REVEAL
// ========================================
(function () {
    const revealEls = document.querySelectorAll('.reveal');
    if (!revealEls.length) return;

    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReduced) {
        revealEls.forEach(el => el.classList.add('visible'));
        return;
    }

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

    revealEls.forEach(el => observer.observe(el));
})();

// ========================================
// WHATSAPP FLOAT BUTTON
// ========================================
(function () {
    const waBtn = document.getElementById('wa-float');
    if (!waBtn) return;

    let ticking = false;

    function onScroll() {
        if (!ticking) {
            requestAnimationFrame(() => {
                if (window.scrollY > 300) {
                    waBtn.classList.add('show');
                } else {
                    waBtn.classList.remove('show');
                }
                ticking = false;
            });
            ticking = true;
        }
    }

    window.addEventListener('scroll', onScroll, { passive: true });
})();