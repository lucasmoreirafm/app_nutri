const $ = id => document.getElementById(id);

/* ================= MENU ================= */
function toggleMenu() {
  const m = $('menu');
  if (m) m.style.display = m.style.display === 'block' ? 'none' : 'block';
}

/* ================= PERFIL ================= */
function salvarPerfil() {
  const perfil = {
    sexo: $('sexo').value,
    peso: +$('peso').value,
    idade: +$('idade').value,
    altura: +$('altura').value,
    atividade: +$('atividade').value
  };

  const tmb =
    perfil.sexo === 'homem'
      ? 66 + 13.7 * perfil.peso + 5 * perfil.altura - 6.8 * perfil.idade
      : 655 + 9.6 * perfil.peso + 1.8 * perfil.altura - 4.7 * perfil.idade;

  perfil.gasto = Math.round(tmb * perfil.atividade);

  localStorage.setItem('perfil', JSON.stringify(perfil));
  if ($('tmb')) $('tmb').textContent = perfil.gasto;
}

function carregarPerfil() {
  const perfil = JSON.parse(localStorage.getItem('perfil'));
  if (!perfil) return;

  if ($('sexo')) $('sexo').value = perfil.sexo;
  if ($('peso')) $('peso').value = perfil.peso;
  if ($('idade')) $('idade').value = perfil.idade;
  if ($('altura')) $('altura').value = perfil.altura;
  if ($('atividade')) $('atividade').value = perfil.atividade;
  if ($('tmb')) $('tmb').textContent = perfil.gasto;
}

/* ================= METAS ================= */
function salvarMetas() {
  const perfil = JSON.parse(localStorage.getItem('perfil'));
  if (!perfil) return alert('Crie o perfil primeiro');

  const ajuste = +$('ajuste').value || 0;
  const objetivo = $('objetivo').value;

  const base = perfil.gasto + ajuste;

  const perfis = {
    emagrecimento: { p: 0.3, c: 0.4, g: 0.3 },
    manutencao: { p: 0.25, c: 0.5, g: 0.25 },
    hipertrofia: { p: 0.25, c: 0.55, g: 0.2 }
  };

  const pct = perfis[objetivo];

  const metas = {
    objetivo,
    ajuste,
    cal: base,
    p: Math.round((base * pct.p) / 4),
    c: Math.round((base * pct.c) / 4),
    g: Math.round((base * pct.g) / 9)
  };

  localStorage.setItem('metas', JSON.stringify(metas));
  renderMetas();
}

function renderMetas() {
  const metas = JSON.parse(localStorage.getItem('metas'));
  if (!metas) return;

  if ($('objetivo')) $('objetivo').value = metas.objetivo;
  if ($('ajuste')) $('ajuste').value = metas.ajuste;

  if ($('metaCal')) $('metaCal').textContent = metas.cal;
  if ($('metaP')) $('metaP').textContent = metas.p;
  if ($('metaC')) $('metaC').textContent = metas.c;
  if ($('metaG')) $('metaG').textContent = metas.g;
}

/* ================= RESUMO ================= */
let resumo = JSON.parse(localStorage.getItem('resumo')) || {
  cal: 0,
  p: 0,
  c: 0,
  g: 0
};

let alimentos = [];

fetch('taco.json')
  .then(r => r.json())
  .then(d => {
    alimentos = d;
    atualizarLista('');
  });

function atualizarLista(txt) {
  const s = $('alimentos');
  if (!s) return;

  s.innerHTML = '';
  alimentos
    .filter(a => a.alimento.toLowerCase().includes(txt))
    .forEach(a => {
      const o = document.createElement('option');
      o.value = a.alimento;
      o.textContent = a.alimento;
      s.appendChild(o);
    });
}

if ($('busca')) {
  $('busca').addEventListener('input', e =>
    atualizarLista(e.target.value.toLowerCase())
  );
}

function adicionar() {
  const item = alimentos.find(a => a.alimento === $('alimentos').value);
  if (!item) return;

  const qtd = +$('qtd').value || 100;
  const f = qtd / 100;

  resumo.cal += item.calorias * f;
  resumo.p += item.proteina * f;
  resumo.c += item.carboidrato * f;
  resumo.g += item.gordura * f;

  localStorage.setItem('resumo', JSON.stringify(resumo));
  renderResumo();
}

function renderResumo() {
  const metas = JSON.parse(localStorage.getItem('metas')) || {};

  if ($('cal')) $('cal').textContent = resumo.cal.toFixed(1);
  if ($('p')) $('p').textContent = resumo.p.toFixed(1);
  if ($('c')) $('c').textContent = resumo.c.toFixed(1);
  if ($('g')) $('g').textContent = resumo.g.toFixed(1);

  if ($('metaCal2')) $('metaCal2').textContent = metas.cal || 0;
  if ($('metaP2')) $('metaP2').textContent = metas.p || 0;
  if ($('metaC2')) $('metaC2').textContent = metas.c || 0;
  if ($('metaG2')) $('metaG2').textContent = metas.g || 0;
}

function zerar() {
  resumo = { cal: 0, p: 0, c: 0, g: 0 };
  localStorage.removeItem('resumo');
  renderResumo();
}

/* ================= INIT ================= */
document.addEventListener('DOMContentLoaded', () => {
  carregarPerfil();
  renderMetas();
  renderResumo();
});
