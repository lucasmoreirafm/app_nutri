/* =========================
   HELPERS
========================= */
const $ = id => document.getElementById(id);

/* =========================
   MENU HAMBURGER
========================= */
document.addEventListener('DOMContentLoaded', () => {
  const menuBtn = $('menuBtn');
  const menu = $('menu');

  if (menuBtn && menu) {
    menuBtn.onclick = () => {
      menu.classList.toggle('show');
    };
  }
});

/* =========================
   STORAGE HELPERS
========================= */
const salvar = (chave, valor) =>
  localStorage.setItem(chave, JSON.stringify(valor));

const carregar = (chave, padrao) =>
  JSON.parse(localStorage.getItem(chave)) || padrao;

/* =========================
   PERFIL
========================= */
if ($('salvarPerfil')) {
  const perfilSalvo = carregar('perfil', null);

  if (perfilSalvo) {
    $('sexo').value = perfilSalvo.sexo;
    $('peso').value = perfilSalvo.peso;
    $('idade').value = perfilSalvo.idade;
    $('altura').value = perfilSalvo.altura;
    $('atividade').value = perfilSalvo.atividade;
    $('tmbResultado').textContent = perfilSalvo.gasto.toFixed(0);
  }

  $('salvarPerfil').onclick = () => {
    const sexo = $('sexo').value;
    const peso = Number($('peso').value);
    const idade = Number($('idade').value);
    const altura = Number($('altura').value);
    const atividade = Number($('atividade').value);

    if (!peso || !idade || !altura) return;

    // Mifflin-St Jeor
    let tmb =
      sexo === 'homem'
        ? 10 * peso + 6.25 * altura - 5 * idade + 5
        : 10 * peso + 6.25 * altura - 5 * idade - 161;

    const gasto = tmb * atividade;

    $('tmbResultado').textContent = gasto.toFixed(0);

    salvar('perfil', {
      sexo,
      peso,
      idade,
      altura,
      atividade,
      gasto
    });
  };
}

/* =========================
   METAS + MACROS
========================= */
if ($('salvarMetas')) {
  const metasSalvas = carregar('metas', null);
  const perfil = carregar('perfil', null);

  if (metasSalvas) {
    $('objetivo').value = metasSalvas.objetivo;
    $('ajuste').value = metasSalvas.ajuste;
    $('metaCalorias').textContent = metasSalvas.calorias.toFixed(0);
    $('metaP').textContent = metasSalvas.p.toFixed(0);
    $('metaC').textContent = metasSalvas.c.toFixed(0);
    $('metaG').textContent = metasSalvas.g.toFixed(0);
  }

  $('salvarMetas').onclick = () => {
    if (!perfil) return;

    const objetivo = $('objetivo').value;
    const ajuste = Number($('ajuste').value) || 0;

    let calorias = perfil.gasto + ajuste;

    // Percentuais por objetivo
    let pct;
    if (objetivo === 'emagrecimento') {
      pct = { p: 0.30, c: 0.40, g: 0.30 };
    } else if (objetivo === 'hipertrofia') {
      pct = { p: 0.25, c: 0.50, g: 0.25 };
    } else {
      pct = { p: 0.20, c: 0.50, g: 0.30 };
    }

    const proteina = (calorias * pct.p) / 4;
    const carbo = (calorias * pct.c) / 4;
    const gordura = (calorias * pct.g) / 9;

    $('metaCalorias').textContent = calorias.toFixed(0);
    $('metaP').textContent = proteina.toFixed(0);
    $('metaC').textContent = carbo.toFixed(0);
    $('metaG').textContent = gordura.toFixed(0);

    salvar('metas', {
      objetivo,
      ajuste,
      calorias,
      p: proteina,
      c: carbo,
      g: gordura
    });
  };
}

/* =========================
   RESUMO + ALIMENTOS
========================= */
if ($('adicionarAlimento')) {
  let resumo = carregar('resumo', { cal: 0, p: 0, c: 0, g: 0 });
  const metas = carregar('metas', {});

  const renderResumo = () => {
    $('cal').textContent = resumo.cal.toFixed(0);
    $('p').textContent = resumo.p.toFixed(0);
    $('c').textContent = resumo.c.toFixed(0);
    $('g').textContent = resumo.g.toFixed(0);

    $('metaCal2').textContent = metas.calorias?.toFixed(0) || 0;
    $('metaP2').textContent = metas.p?.toFixed(0) || 0;
    $('metaC2').textContent = metas.c?.toFixed(0) || 0;
    $('metaG2').textContent = metas.g?.toFixed(0) || 0;

    atualizarBarra('barraCal', resumo.cal, metas.calorias);
    atualizarBarra('barraP', resumo.p, metas.p);
    atualizarBarra('barraC', resumo.c, metas.c);
    atualizarBarra('barraG', resumo.g, metas.g);
  };

  renderResumo();

  fetch('taco.json')
    .then(r => r.json())
    .then(data => {
      window.taco = data;
    });

  $('adicionarAlimento').onclick = () => {
    const nome = $('buscaAlimento').value.toLowerCase();
    const qtd = Number($('quantidade').value) || 100;

    const item = window.taco.find(a =>
      a.alimento.toLowerCase().includes(nome)
    );
    if (!item) return;

    const f = qtd / 100;
    resumo.cal += item.calorias * f;
    resumo.p += item.proteina * f;
    resumo.c += item.carboidrato * f;
    resumo.g += item.gordura * f;

    salvar('resumo', resumo);
    renderResumo();
  };

  $('zerarResumo').onclick = () => {
    resumo = { cal: 0, p: 0, c: 0, g: 0 };
    salvar('resumo', resumo);
    renderResumo();
  };
}

/* =========================
   BARRAS DE PROGRESSO
========================= */
function atualizarBarra(id, valor, meta) {
  const barra = $(id);
  if (!barra || !meta) return;

  const span = barra.querySelector('span');
  const pct = valor / meta;

  span.style.width = Math.min(pct * 100, 100) + '%';

  barra.classList.remove('verde', 'amarela', 'vermelha');
  if (pct <= 0.8) barra.classList.add('verde');
  else if (pct <= 1) barra.classList.add('amarela');
  else barra.classList.add('vermelha');
}
