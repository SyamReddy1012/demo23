const PAGES = [
  ["index.html", "Home"],
  ["learn.html", "Learn"],
  ["sectors.html", "Sectors"],
  ["getstarted.html", "Get Started"],
  ["members.html", "Members"],
  ["sessions.html", "Sessions"]
];
const esc = s => String(s).replace(/[&<>"]/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
const current = (location.pathname.split('/').pop() || 'index.html');

// Shared nav + footer
document.body.insertAdjacentHTML('afterbegin', `
<nav><div class="wrap">
  <a href="index.html" class="logo">~/foss-club</a>
  <button class="burger" id="burger" aria-label="Menu">&#9776;</button>
  <div class="links" id="links">
    ${PAGES.map(([h,t]) => `<a href="${h}" class="${h===current?'active':''}">${t}</a>`).join('')}
  </div>
</div></nav>`);
document.body.insertAdjacentHTML('beforeend',
  `<footer><div class="wrap">FOSS Club &middot; Built with free software, for free software.</div></footer>`);
document.getElementById('burger').onclick = () => document.getElementById('links').classList.toggle('open');

// Members (members.html, with role filter)
const memberGrid = document.getElementById('memberGrid');
if (memberGrid) {
  const draw = role => {
    memberGrid.innerHTML = MEMBERS.filter(m => !role || m.role === role).map(m => {
      const ini = m.name.replace(/\./g,' ').split(/\s+/).filter(Boolean).map(w => w[0]).slice(0,2).join('').toUpperCase();
      const av = m.photo ? `<img src="${esc(m.photo)}" alt="${esc(m.name)}">` : ini;
      return `<div class="member"><div class="avatar">${av}</div><h3>${esc(m.name)}</h3><p>${esc(m.role)}</p></div>`;
    }).join('');
  };
  const roles = [...new Set(MEMBERS.map(m => m.role))];
  const f = document.getElementById('filters');
  if (f) {
    f.innerHTML = ['All', ...roles].map((r,i) => `<button class="${i?'':'on'}" data-r="${i?esc(r):''}">${esc(r)}</button>`).join('');
    f.onclick = e => {
      const b = e.target.closest('button'); if (!b) return;
      f.querySelectorAll('button').forEach(x => x.classList.remove('on'));
      b.classList.add('on'); draw(b.dataset.r);
    };
  }
  draw('');
}

// Sessions slider (sessions.html)
const track = document.getElementById('track');
if (track) {
  const sorted = [...SESSIONS].sort((a,b) => (b.date||'').localeCompare(a.date||''));
  track.innerHTML = sorted.length ? sorted.map(s => {
    const d = s.date ? new Date(s.date).toLocaleDateString('en-IN',{day:'numeric',month:'short',year:'numeric'}) : 'SESSION';
    const pdf = s.pdf ? `<a class="btn pdf" href="${esc(s.pdf)}" target="_blank" rel="noopener">PDF</a>` : '';
    const ppt = s.ppt ? `<a class="btn ppt" href="${esc(s.ppt)}" download>PPT</a>` : '';
    return `<article class="slide"><div class="date">${d}</div><h3>${esc(s.title)}</h3>
      <div class="by">by ${esc(s.by)}</div><p class="desc">${esc(s.desc||'')}</p><div class="btns">${pdf}${ppt}</div></article>`;
  }).join('') : '<p class="empty">No sessions yet.</p>';
  const step = () => Math.min(340, track.clientWidth * 0.9);
  document.getElementById('prev').onclick = () => track.scrollBy({left:-step(),behavior:'smooth'});
  document.getElementById('next').onclick = () => track.scrollBy({left: step(),behavior:'smooth'});
}
