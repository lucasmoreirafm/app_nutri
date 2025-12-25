let alimentos = [];
let resumo = { calorias:0, proteina:0, carboidrato:0, gordura:0 };
let tmb = 0;
let meta = 0;

/* ======================
   UTIL
====================== */
function $(id) {
  return document.getElementById(id);
}

/* ======================
   MENU HAMBURGER
====================== */
document.addEventListener('DOMContentLoaded', () => {
  const btn = $('menu-btn');
  const links = $('menu-links');
  if (btn && links) {
    btn.addEventListener('click', () => {
      links.classList.toggle('hidden');
    });
  }
});

/* ======================
   CARREGAR ALIMENTOS
====================== */
fetch('taco.json')
  .then(r => r.json())
  .then(data => {
    alimentos = data;
    const select = $('alimento-select');
    if (!select) return;

    data.forEach(a => {
      const opt = document.createElement('option');
      opt.value = a.alimento;
      opt.textContent = `${a.alimento} - ${a.calorias} kcal`;
      select.appendChild(opt);
    });
  });

/* ======================
   RESUMO
====================== */
function atualizarResumo() {
  if (!$('calorias')) return;

  let texto = resumo.calorias.toFixed(1);
  if (meta > 0) {
    const dif = resumo.calorias - meta;
    if (dif < 0) texto += ` | faltam ${Math.abs(dif).toFixed(1)} kcal`;
    else if (dif > 0) texto += ` | ultrapassou ${dif.toFixed(1)} kcal`;
    else texto += ' | meta atingida!';
  }

  $('calorias').textContent = texto;
  $('proteina').textContent = resumo.proteina.toFixed(1);
  $('carboidrato').textContent = resumo.carboidrato.toFixed(1);
  $('gordura').textContent = resumo.gordura.toFixed(1);
}

/* ======================
   PERFIL
====================== */
const btnSalvarPerfil = $('salvar-perfil');
if (btnSalvarPerfil) {
  btnSalvarPerfil.addEventListener('click', () => {
    const sexo = $('sexo').value;
    const idade = Number($('idade').value);
    const altura = Number($('altura').value);
    const atividade = Number($('atividade').value);

    // ⚠️ Peso ainda fixo (corrigimos depois)
    tmb = sexo === 'homem'
      ? 66 + (13.7 * 70) + (5 * altura) - (6.8 * idade)
      : 655 + (9.6 * 60) + (1.8 * altura) - (4.7 * idade);

    tmb *= atividade;

    $('tmb').textContent = tmb.toFixed(1);

    localStorage.setItem('perfil', JSON.stringify({
      sexo, idade, altura, atividade, tmb
    }));
  });
}

/* ======================
   META
====================== */
const btnSalvarMeta = $('salvar-meta');
if (btnSalvarMeta) {
  btnSalvarMeta.addEventListener('click', () => {
    const objetivo = $('objetivo').value;
    const delta = Number($('delta').value);

    meta = tmb;
    if (objetivo === 'ganhar') meta += delta;
    if (objetivo === 'perder') meta -= delta;

    $('meta-calorias').textContent = meta.toFixed(1);
    localStorage.setItem('meta', meta);
  });
}

/* ======================
   ALIMENTOS
====================== */
const btnAdicionar = $('adicionar');
if (btnAdicionar) {
  btnAdicionar.addEventListener('click', () => {
    const item = alimentos.find(a => a.alimento === $('alimento-select').value);
    if (!item) return;

    const qtd = Number($('quantidade').value) || 100;
    const f = qtd / 100;

    resumo.calorias += item.calorias * f;
    resumo.proteina += item.proteina * f;
    resumo.carboidrato += item.carboidrato * f;
    resumo.gordura += item.gordura * f;

    atualizarResumo();
  });
}

const btnZerar = $('zerar');
if (btnZerar) {
  btnZerar.addEventListener('click', () => {
    resumo = { calorias:0, proteina:0, carboidrato:0, gordura:0 };
    atualizarResumo();
  });
}

/* ======================
   RESTAURAR DADOS
====================== */
window.addEventListener('load', () => {
  const perfil = JSON.parse(localStorage.getItem('perfil'));
  if (perfil) {
    tmb = perfil.tmb || 0;

    if ($('sexo')) {
      $('sexo').value = perfil.sexo;
      $('idade').value = perfil.idade;
      $('altura').value = perfil.altura;
      $('atividade').value = perfil.atividade;
      $('tmb').textContent = tmb.toFixed(1);
    }
  }

  const metaSalva = localStorage.getItem('meta');
  if (metaSalva) {
    meta = Number(metaSalva);
    if ($('meta-calorias')) {
      $('meta-calorias').textContent = meta.toFixed(1);
    }
  }

  atualizarResumo();
});

