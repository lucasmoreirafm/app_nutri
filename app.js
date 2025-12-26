/* ========= HELPERS ========= */
const $ = id => document.getElementById(id);

/* ========= MENU ========= */
document.addEventListener('DOMContentLoaded', () => {
  const btn = $('menuBtn');
  const menu = $('menu');
  if (btn && menu) btn.onclick = () => menu.classList.toggle('show');
});

/* ========= STORAGE ========= */
const salvar = (k, v) => localStorage.setItem(k, JSON.stringify(v));
const carregar = (k, p) => JSON.parse(localStorage.getItem(k)) || p;

/* ========= PERFIL ========= */
function salvarPerfil() {
  const sexo = $('sexo').value;
  const peso = Number($('peso').value);
  const idade = Number($('idade').value);
  const altura = Number($('altura').value);
  const atividade = Number($('atividade').value);

  if (!peso || !idade || !altura) return;

  let tmb =
    sexo === 'homem'
      ? 10 * peso + 6.25 * altura - 5 * idade + 5
      : 10 * peso + 6.25 * altura - 5 * idade - 161;

  const gasto = tmb * atividade;

  $('tmbResultado').textContent = gasto.toFixed(0);

  salvar('perfil', { sexo, peso, idade, altura, atividade, gasto });
}

(function carregarPerfil() {
  if (!$('peso')) return;
  const p = carregar('perfil', null);
  if (!p) return;

  $('sexo').value = p.sexo;
  $('peso').value = p.peso;
  $('idade').value = p.idade;
  $('altura').value = p.altura;
  $('atividade').value = p.atividade;
  $('tmbResultado').textContent = p.gasto.toFixed(0);
})();

/* ========= RESUMO ========= */
let resumo = carregar('resumo', { cal: 0, p: 0, c: 0, g: 0 });
let metas = carregar('metas', {});

function atualizarBarra(id, valor, meta) {
  const barra = $(id);
  if (!barra || !meta) return;
  barra.style.width = Math.min(valor / meta, 1) * 100 + '%';
}

function renderResumo() {
  if (!$('cal')) return;

  const metaCalorias = metas.calorias ?? metas.cal ?? 0;

  $('cal').textContent = resumo.cal.toFixed(0);
  $('p').textContent = resumo.p.toFixed(0);
  $('c').textContent = resumo.c.toFixed(0);
  $('g').textContent = resumo.g.toFixed(0);

  $('metaCal').textContent = metaCalorias;
  $('metaP').textContent = metas.p || 0;
  $('metaC').textContent = metas.c || 0;
  $('metaG').textContent = metas.g || 0;

  atualizarBarra('barraCal', resumo.cal, metaCalorias);
  atualizarBarra('barraP', resumo.p, metas.p);
  atualizarBarra('barraC', resumo.c, metas.c);
  atualizarBarra('barraG', resumo.g, metas.g);
}

/* ========= ALIMENTOS ========= */
function adicionarAlimento() {
  if (!window.taco) return alert('Tabela TACO não carregada');

  const nome = $('buscaAlimento')?.value?.toLowerCase();
  const qtd = Number($('quantidade')?.value) || 100;

  if (!nome) return;

  const item = window.taco.find(a =>
    a.alimento.toLowerCase().includes(nome)
  );

  if (!item) return alert('Alimento não encontrado');

  const f = qtd / 100;

  resumo.cal += item.calorias * f;
  resumo.p += item.proteina * f;
  resumo.c += item.carboidrato * f;
  resumo.g += item.gordura * f;

  salvar('resumo', resumo);
  renderResumo();
}

/* ========= ZERAR ========= */
if ($('zerarResumo')) {
  $('zerarResumo').onclick = () => {
    resumo = { cal: 0, p: 0, c: 0, g: 0 };
    salvar('resumo', resumo);
    renderResumo();
  };
}

/* ========= TACO ========= */
fetch('taco.json')
  .then(r => r.json())
  .then(d => {
    window.taco = d;
    console.log('TACO carregado:', d.length, 'alimentos');
  });

renderResumo();
