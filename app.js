/* ================= UTIL ================= */
function $(id) {
  return document.getElementById(id);
}

/* ================= MENU ================= */
function toggleMenu() {
  const menu = $('menu');
  if (!menu) return;
  menu.style.display = menu.style.display === 'block' ? 'none' : 'block';
}

/* ================= PERFIL ================= */
function salvarPerfil() {
  const perfil = {
    sexo: $('sexo')?.value,
    idade: Number($('idade')?.value),
    peso: Number($('peso')?.value),
    altura: Number($('altura')?.value),
    atividade: Number($('atividade')?.value)
  };

  localStorage.setItem('perfil', JSON.stringify(perfil));
  alert('Perfil salvo com sucesso');
}

function carregarPerfil() {
  const perfil = JSON.parse(localStorage.getItem('perfil'));
  if (!perfil) return;

  if ($('sexo')) $('sexo').value = perfil.sexo;
  if ($('idade')) $('idade').value = perfil.idade;
  if ($('peso')) $('peso').value = perfil.peso;
  if ($('altura')) $('altura').value = perfil.altura;
  if ($('atividade')) $('atividade').value = perfil.atividade;
}

/* ================= METAS ================= */
function calcularMetas() {
  const perfil = JSON.parse(localStorage.getItem('perfil'));
  if (!perfil) return null;

  const tmb =
    perfil.sexo === 'homem'
      ? 66 + 13.7 * perfil.peso + 5 * perfil.altura - 6.8 * perfil.idade
      : 655 + 9.6 * perfil.peso + 1.8 * perfil.altura - 4.7 * perfil.idade;

  const ajuste = Number($('ajuste')?.value || 0);
  const gasto = Math.round(tmb * perfil.atividade + ajuste);

  const objetivo = $('objetivo')?.value || 'manter';

  const perfis = {
    perder: { p: 0.3, c: 0.4, g: 0.3 },
    ganhar: { p: 0.25, c: 0.55, g: 0.2 },
    manter: { p: 0.25, c: 0.5, g: 0.25 }
  };

  const pct = perfis[objetivo];

  const macros = {
    proteina: Math.round((gasto * pct.p) / 4),
    carboidrato: Math.round((gasto * pct.c) / 4),
    gordura: Math.round((gasto * pct.g) / 9)
  };

  return { gasto, macros };
}

function salvarMetas() {
  const dados = calcularMetas();
  if (!dados) return alert('Preencha o perfil primeiro');

  localStorage.setItem('meta', JSON.stringify(dados));
  renderizarMetas(dados);
}

function renderizarMetas(dados) {
  if ($('meta-calorias')) $('meta-calorias').textContent = dados.gasto;
  if ($('meta-p')) $('meta-p').textContent = dados.macros.proteina;
  if ($('meta-c')) $('meta-c').textContent = dados.macros.carboidrato;
  if ($('meta-g')) $('meta-g').textContent = dados.macros.gordura;
}

function carregarMetas() {
  const meta = JSON.parse(localStorage.getItem('meta'));
  if (meta) renderizarMetas(meta);
}

/* ================= RESUMO ================= */
let resumo = JSON.parse(localStorage.getItem('resumo')) || {
  calorias: 0,
  proteina: 0,
  carboidrato: 0,
  gordura: 0
};

function atualizarResumo() {
  if ($('calorias')) $('calorias').textContent = resumo.calorias.toFixed(1);
  if ($('proteina')) $('proteina').textContent = resumo.proteina.toFixed(1);
  if ($('carboidrato')) $('carboidrato').textContent = resumo.carboidrato.toFixed(1);
  if ($('gordura')) $('gordura').textContent = resumo.gordura.toFixed(1);

  const meta = JSON.parse(localStorage.getItem('meta'));
  if (meta && $('dif-meta')) {
    $('dif-meta').textContent = (meta.gasto - resumo.calorias).toFixed(1);
  }

  if ($('meta-total')) {
    $('meta-total').textContent = meta ? meta.gasto : 0;
  }
}

function zerarResumo() {
  resumo = { calorias: 0, proteina: 0, carboidrato: 0, gordura: 0 };
  localStorage.removeItem('resumo');
  atualizarResumo();
}

/* ================= INIT ================= */
document.addEventListener('DOMContentLoaded', () => {
  carregarPerfil();
  carregarMetas();
  atualizarResumo();
});
