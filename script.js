// ===== SUGCON Deck — renders slides from content.json =====

var currentSlide = 0;
var totalSlides = 0;
var meta = {};

async function loadContent(){
  try {
    var res = await fetch('content.json?t=' + Date.now());
    if (!res.ok) throw new Error('Failed to load content.json');
    var data = await res.json();
    meta = data.meta || {};
    renderSlides(data.slides || []);
    document.getElementById('loading').classList.add('hidden');
    show(0);
  } catch (e) {
    document.getElementById('loading').innerHTML =
      '<div style="text-align:center;padding:20px">Failed to load content.json<br/><small style="color:#94a3b8">' + e.message + '</small></div>';
  }
}

function renderSlides(slides){
  var container = document.getElementById('slides-container');
  container.innerHTML = '';
  totalSlides = slides.length;
  slides.forEach(function(slide, idx){
    var el = document.createElement('section');
    el.className = 'slide';
    el.innerHTML = renderSlide(slide, idx);
    container.appendChild(el);
  });
}

function renderSlide(s, idx){
  var renderer = renderers[s.type] || renderers.default;
  var footerNum = (idx + 1) + ' / ' + totalSlides;
  var footer = s.footer ? '<div class="footer"><span>' + s.footer + '</span><span>' + footerNum + '</span></div>' : '';
  var hint = s.hint ? '<div class="hint">&#9201; ' + escapeHtml(s.hint) + '</div>' : '';
  var kicker = s.kicker ? '<div class="kicker ' + (s.kickerClass || '') + '">' + s.kicker + '</div>' : '';
  return kicker + renderer(s) + hint + footer;
}

var renderers = {
  title: function(s){
    var spk = meta.speaker || {};
    var pills = (s.pills || []).map(function(p){
      return '<span class="pill ' + (p.class || '') + '">' + p.text + '</span>';
    }).join('');
    return '<h1>' + s.title + '</h1>' +
      '<p class="big" style="margin-top:12px;max-width:1100px">' + s.subtitle + '</p>' +
      '<div class="title-meta">' +
        '<div>' +
          '<div class="speaker-label">Speaker</div>' +
          '<div class="speaker-name">' + (spk.name || '') + '</div>' +
          '<div class="speaker-title">' + (spk.title || '') + '</div>' +
        '</div>' +
        '<div style="display:flex;gap:12px;flex-wrap:wrap">' + pills + '</div>' +
      '</div>';
  },

  split: function(s){
    function renderHalf(h){
      if (!h) return '';
      var inner = '<h4>' + h.heading + '</h4>';
      if (h.items) {
        var items = h.items.map(function(i){
          return '<li class="' + (h.nobullet ? 'nobullet' : '') + '">' + i + '</li>';
        }).join('');
        inner += '<ul>' + items + '</ul>';
      }
      if (h.quote) inner += '<div class="quote">' + h.quote + '</div>';
      if (h.pills) {
        var pills = h.pills.map(function(p){
          return '<span class="pill ' + (p.class || '') + '">' + p.text + '</span>';
        }).join('');
        inner += '<div class="pills">' + pills + '</div>';
      }
      if (h.footnote) inner += '<p class="footnote">' + h.footnote + '</p>';
      return '<div class="half ' + (h.variant || '') + '">' + inner + '</div>';
    }
    var bigNote = s.bigNote ? '<p class="big-note center">' + s.bigNote + '</p>' : '';
    return '<h2>' + s.heading + '</h2>' +
      '<div class="split">' + renderHalf(s.left) + renderHalf(s.right) + '</div>' +
      bigNote;
  },

  chat: function(s){
    var messages = (s.messages || []).map(function(m){
      return '<div class="' + m.role + '">' + m.text + '</div>';
    }).join('');
    var lead = s.lead ? '<p class="big" style="margin-top:18px">' + s.lead + '</p>' : '';
    var bigNote = s.bigNote ? '<p class="big-note">' + s.bigNote + '</p>' : '';
    return '<h2>' + s.heading + '</h2>' +
      lead +
      '<div class="chat">' + messages + '</div>' +
      bigNote;
  },

  diagram: function(s){
    var nodes = (s.nodes || []).map(function(n, i){
      var arrow = i < s.nodes.length - 1 ? '<div class="arrow">&rarr;</div>' : '';
      return '<div class="node ' + (n.primary ? 'primary' : '') + '">' +
        '<div class="icon">' + n.icon + '</div>' +
        '<div class="label">' + n.label + '</div>' +
        '<div class="sub">' + n.sub + '</div>' +
        '</div>' + arrow;
    }).join('');
    var cards = (s.cards || []).map(function(c){
      return '<div class="card"><h4>' + c.title + '</h4><p>' + c.body + '</p></div>';
    }).join('');
    var pull = s.pull ? '<p class="pull">' + s.pull + '</p>' : '';
    return '<h2>' + s.heading + '</h2>' +
      pull +
      '<div class="diagram">' + nodes + '</div>' +
      '<div class="row">' + cards + '</div>';
  },

  architecture: function(s){
    var steps = (s.steps || []).map(function(st){
      return '<div class="ts"><span class="t">' + st.n + '</span> ' + st.text + '</div>';
    }).join('');
    var cards = (s.cards || []).map(function(c){
      return '<div class="card"><h4>' + c.title + '</h4><p>' + c.body + '</p></div>';
    }).join('');
    return '<h2>' + s.heading + '</h2>' +
      '<div class="timeline">' + steps + '</div>' +
      '<div class="row" style="margin-top:40px">' + cards + '</div>';
  },

  tools: function(s){
    var tools = (s.tools || []).map(function(t){
      return '<div class="tool-item"><div class="name">' + t.name + '</div><div class="desc">' + t.desc + '</div></div>';
    }).join('');
    var note = s.note ? '<p style="margin-top:20px;color:var(--muted);font-size:16px">' + s.note + '</p>' : '';
    return '<h2>' + s.heading + '</h2>' +
      '<div class="tools-grid">' + tools + '</div>' +
      note;
  },

  cards: function(s){
    var cards = (s.cards || []).map(function(c){
      return '<div class="card"><h4 class="' + (c.titleColor || '') + '">' + c.title + '</h4><p>' + c.body + '</p></div>';
    }).join('');
    var bigNote = s.bigNote ? '<p class="big-note ' + (s.bigNoteColor || '') + '" style="margin-top:40px">' + s.bigNote + '</p>' : '';
    return '<h2>' + s.heading + '</h2>' +
      '<div class="row">' + cards + '</div>' +
      bigNote;
  },

  challenge: function(s){
    var steps = (s.steps || []).map(function(st){
      return '<div class="ts ' + (st.highlight ? 'highlight' : '') + '"><span class="t">' + st.time + '</span> &middot; ' + st.text + '</div>';
    }).join('');
    var bigNote = s.bigNote ? '<p class="big-note" style="margin-top:30px">' + s.bigNote + '</p>' : '';
    return '<h2>' + s.heading + '</h2>' +
      '<div class="challenge-list">' + steps + '</div>' +
      bigNote;
  },

  closing: function(s){
    var columns = (s.columns || []).map(function(col){
      var items = (col.items || []).map(function(it){
        if (it.strong) return '<div class="col-name">' + it.strong + '</div>';
        if (it.small) return '<div class="col-item small">' + it.text + '</div>';
        return '<div class="col-item">' + it.text + '</div>';
      }).join('');
      return '<div class="closing-col"><div class="col-label">' + col.label + '</div>' + items + '</div>';
    }).join('');
    return '<h1 style="font-size:92px">' + s.heading + '</h1>' +
      '<div class="closing-grid">' +
        '<div class="qr-placeholder">' + s.qrText + '</div>' +
        columns +
      '</div>';
  },

  default: function(s){
    return '<h2>' + (s.heading || 'Untitled') + '</h2>';
  }
};

function escapeHtml(str){
  return String(str)
    .replace(/&/g,'&amp;')
    .replace(/</g,'&lt;')
    .replace(/>/g,'&gt;');
}

function show(n){
  var slides = document.querySelectorAll('.slide');
  slides.forEach(function(s){ s.classList.remove('active'); });
  currentSlide = Math.max(0, Math.min(slides.length - 1, n));
  if (slides[currentSlide]) slides[currentSlide].classList.add('active');
  document.getElementById('slidenum').textContent = (currentSlide + 1) + ' / ' + slides.length;
  document.getElementById('progress').style.width = ((currentSlide + 1) / slides.length * 100) + '%';
}
function next(){ show(currentSlide + 1); }
function prev(){ show(currentSlide - 1); }
function toggleFS(){
  if (!document.fullscreenElement) document.documentElement.requestFullscreen();
  else document.exitFullscreen();
}

document.addEventListener('keydown', function(e){
  if (e.key === 'ArrowRight' || e.key === ' ' || e.key === 'PageDown') next();
  if (e.key === 'ArrowLeft' || e.key === 'PageUp') prev();
  if (e.key === 'Home') show(0);
  if (e.key === 'End') show(totalSlides - 1);
  if (e.key && e.key.toLowerCase && e.key.toLowerCase() === 'f') toggleFS();
});

loadContent();
