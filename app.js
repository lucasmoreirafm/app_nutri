/* =====================================================
   VARIÁVEIS GLOBAIS
===================================================== */
let alimentos = [];
let resumo = { calorias: 0, proteina: 0, carboidrato: 0, gordura: 0 };

let perfil = null;
let tmb = 0;

let meta = 0;
let macros = { p: 0, c: 0, g: 0 };

/* =====================================================
   HELPERS
===================================================== */
const $ = id => document.getElementById(id);

/* =====================================================
   MENU HAMBURGER
===================================================== */
document.addEventListener('DOMContentLoaded', () => {
  if ($('menu-btn')) {
    $('menu-btn').addEventListener('click', () => {
      $('menu-links').classList.toggle('hidden');
    });
  }
});

/* =====================================================
   PERFIL
===================================================== */
if ($('salvar-perfil')) {
  $('salvar-perfil').addEventListener('click', () => {
    perfil = {
      sexo: $('sexo').value,
      idade: Number($('idade').value),
      altura: Number($('altura').value),
      peso: Number($('peso').value),
      atividade: Number($('atividade').value)
    };

    if (!perfil.peso || !perfil.altura || !perfil.idade) {
      alert('Preencha peso, altura e idade');
      return;
    }

    tmb =
      perfil.sexo === 'homem'
        ? 66 + (13.7 * perfil.peso) + (5 * perfil.altura) - (6.8 * perfil.idade)
        : 655 + (9.6 * perfil.peso) + (1.8 * perfil.altura) - (4.7 * perfil.idade);

    tmb *= perfil.atividade;

    $('tmb').textContent = Math.round(tmb);

    localStorage.setItem('perfil', JSON.stringify({ ...perfil, tmb }));
    alert('Perfil salvo!');
  });
}

/* =====================================================
   PRESETS DE MACROS
===================================================== */
const presets = {
  manter:       { p: 30, c: 40, g: 30 },
  emagrecer:   { p: 35, c: 35, g: 30 },
  hipertrofia: { p: 30, c: 50, g: 20 }
};

/* =====================================================
   META E MACROS
===================================================== */
function calcularMeta() {
  if (!tmb) return;

  const delta = Number($('delta')?.value || 0);
  meta = Math.round(tmb + delta);

  if ($('meta-calorias')) {
    $('meta-calorias').textContent = meta;
  }

  calcularMacros();
}

function calcularMacros() {
  if (!meta) return;

  macros = {
    p: Number($('pct-proteina').value),
    c: Number($('pct-carbo').value),
    g: Number($('pct-gordura').value)
  };

  $('g-proteina').textContent = Math.round((meta * macros.p / 100) / 4);
  $('g-carbo').textContent   = Math.round((meta * macros.c / 100) / 4);
  $('g-gordura').textContent = Math.round((meta * macros.g / 100) / 9);
}

/* Objetivo → presets automáticos */
if ($('objetivo')) {
  $('objetivo').addEventListener('change', e => {
    const preset = presets[e.target.value];
    $('pct-proteina').value = preset.p;
    $('pct-carbo').value   = preset.c;
    $('pct-gordura').value = preset.g;
    calcularMeta();
  });
}

/* Ajuste calórico em tempo real */
if ($('delta')) {
  $('delta').addEventListener('input', calcularMeta);
}

/* Alteração manual dos percentuais */
['pct-proteina', 'pct-carbo', 'pct-gordura'].forEach(id => {
  if ($(id)) $(id).addEventListener('input', calcularMacros);
});

/* Salvar meta */
if ($('salvar-meta')) {
  $('salvar-meta').addEventListener('click', () => {
    localStorage.setItem(
      'meta',
      JSON.stringify({
        meta,
        delta: Number($('delta').value),
        objetivo: $('objetivo').value,
        macros
      })
    );
    alert('Meta salva!');
  });
}

/* =====================================================
   ALIMENTOS
===================================================== */
fetch('taco.json')
  .then(r => r.json())
  .then(data => {
    alimentos = data;
    atualizarSelect(alimentos);
  });

function atualizarSelect(lista) {
  if (!$('alimento-select')) return;

  $('alimento-select').innerHTML = '';
  lista.forEach(a => {
    const opt = document.createElement('option');
    opt.value = a.alimento;
    opt.textContent = `${a.alimento} (${a.calorias} kcal)`;
    $('alimento-select').appendChild(opt);
  });
}

if ($('busca-alimento')) {
  $('busca-alimento').addEventListener('input', e => {
    const termo = e.target.value.toLowerCase();
    atualizarSelect(
      alimentos.filter(a =>
        a.alimento.toLowerCase().includes(termo)
      )
    );
  });
}

/* =====================================================
   RESUMO
===================================================== */
function atualizarResumo() {
  if (!$('calorias')) return;

  let texto = resumo.calorias.toFixed(1);

  if (meta > 0) {
    const diff = resumo.calorias - meta;
    if (diff < 0) texto += ` | faltam ${Math.abs(diff).toFixed(0)} kcal`;
    else if (diff > 0) texto += ` | ultrapassou ${diff.toFixed(0)} kcal`;
    else texto += ' | meta atingida!';
  }

  $('calorias').textContent = texto;
  $('proteina').textContent = resumo.proteina.toFixed(1);
  $('carboidrato').textContent = resumo.carboidrato.toFixed(1);
  $('gordura').textContent = resumo.gordura.toFixed(1);
}

/* =====================================================
   RESTAURAÇÃO AO ABRIR O APP
===================================================== */
window.addEventListener('load', () => {
  const p = JSON.parse(localStorage.getItem('perfil'));
  if (p) {
    perfil = p;
    tmb = p.tmb;

    if ($('peso')) {
      $('sexo').value = p.sexo;
      $('idade').value = p.idade;
      $('altura').value = p.altura;
      $('peso').value = p.peso;
      $('atividade').value = p.atividade;
      $('tmb').textContent = Math.round(tmb);
    }
  }

  const m = JSON.parse(localStorage.getItem('meta'));
  if (m) {
    meta = m.meta;
    macros = m.macros;

    if ($('delta')) $('delta').value = m.delta;
    if ($('objetivo')) $('objetivo').value = m.objetivo;

    if ($('pct-proteina')) {
      $('pct-proteina').value = macros.p;
      $('pct-carbo').value   = macros.c;
      $('pct-gordura').value = macros.g;
      $('meta-calorias').textContent = meta;
      calcularMacros();
    }
  }

  atualizarResumo();
});

