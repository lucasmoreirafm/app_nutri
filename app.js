/* ================= MENU ================= */
function toggleMenu() {
  const menu = document.getElementById('menu');
  menu.style.display = menu.style.display === 'block' ? 'none' : 'block';
}

/* ================= PERFIL ================= */
function salvarPerfil() {
  const perfil = {
    sexo: sexo.value,
    idade: Number(idade.value),
    peso: Number(peso.value),
    altura: Number(altura.value),
    atividade: Number(atividade.value)
  };
  localStorage.setItem('perfil', JSON.stringify(perfil));
  alert('Perfil salvo!');
}

function carregarPerfil() {
  const perfil = JSON.parse(localStorage.getItem('perfil'));
  if (!perfil) return;

  sexo.value = perfil.sexo;
  idade.value = perfil.idade;
  peso.value = perfil.peso;
  altura.value = perfil.altura;
  atividade.value = perfil.atividade;
}

/* ================= METAS ================= */
function salvarMeta() {
  const perfil = JSON.parse(localStorage.getItem('perfil'));
  if (!perfil) return alert('Preencha o perfil primeiro');

  let tmb =
    perfil.sexo === 'homem'
      ? 66 + 13.7 * perfil.peso + 5 * perfil.altura - 6.8 * perfil.idade
      : 655 + 9.6 * perfil.peso + 1.8 * perfil.altura - 4.7 * perfil.idade;

  let meta = Math.round(tmb * perfil.atividade + Number(ajuste.value));

  const objetivo = document.getElementById('objetivo').value;

  const percentuais =
    objetivo === 'perder'
      ? { p: 0.3, c: 0.4, g: 0.3 }
      : objetivo === 'ganhar'
      ? { p: 0.25, c: 0.55, g: 0.2 }
      : { p: 0.25, c: 0.5, g: 0.25 };

  const macros = {
    proteina: Math.round((meta * percentuais.p) / 4),
    carboidrato: Math.round((meta * percentuais.c) / 4),
    gordura: Math.round((meta * percentuais.g) / 9)
  };

  localStorage.setItem('meta', JSON.stringify({ meta, macros }));

  metaCalorias.textContent = meta;
  metaP.textContent = macros.proteina;
  metaC.textContent = macros.carboidrato;
  metaG.textContent = macros.gordura;
}

function carregarMeta() {
  const meta = JSON.parse(localStorage.getItem('meta'));
  if (!meta) return;

  if (metaCalorias) metaCalorias.textContent = meta.meta;
  if (metaP) metaP.textContent = meta.macros.proteina;
  if (metaC) metaC.textContent = meta.macros.carboidrato;
  if (metaG) metaG.textContent = meta.macros.gordura;
}

/* ================= ALIMENTOS ================= */
let alimentos = [];
fetch('taco.json')
  .then(r => r.json())
  .then(data => alimentos = data);

let resumo = JSON.parse(localStorage.getItem('resumo')) || {
  calorias: 0,
  proteina: 0,
  carboidrato: 0,
  gordura: 0
};

function adicionarAlimento() {
  const nome = busca.value.toLowerCase();
  const qtd = Number(quantidade.value) || 100;

  const item = alimentos.find(a =>
    a.alimento.toLowerCase().includes(nome)
  );
  if (!item) return alert('Alimento não encontrado');

  const fator = qtd / 100;

  resumo.calorias += item.calorias * fator;
  resumo.proteina += item.proteina * fator;
  resumo.carboidrato += item.carboidrato * fator;
  resumo.gordura += item.gordura * fator;

  localStorage.setItem('resumo', JSON.stringify(resumo));
  atualizarResumo();
}

function atualizarResumo() {
  calorias.textContent = resumo.calorias.toFixed(1);
  proteina.textContent = resumo.proteina.toFixed(1);
  carboidrato.textContent = resumo.carboidrato.toFixed(1);
  gordura.textContent = resumo.gordura.toFixed(1);

  const meta = JSON.parse(localStorage.getItem('meta'));
  if (meta) {
    difMeta.textContent = (meta.meta - resumo.calorias).toFixed(1);
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
  carregarMeta();
  if (typeof atualizarResumo === 'function') atualizarResumo();
});
