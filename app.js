let alimentos = [];
let resumo = { calorias:0, proteina:0, carboidrato:0, gordura:0 };
let tmb = 0;
let meta = 0;
let perfil = {};
let macros = { p:30, c:40, g:30 };

const $ = id => document.getElementById(id);

/* MENU */
document.addEventListener('DOMContentLoaded', () => {
  if ($('menu-btn')) {
    $('menu-btn').onclick = () =>
      $('menu-links').classList.toggle('hidden');
  }
});

/* PERFIL */
if ($('salvar-perfil')) {
  $('salvar-perfil').onclick = () => {
    perfil = {
      sexo: $('sexo').value,
      idade: +$('idade').value,
      altura: +$('altura').value,
      peso: +$('peso').value,
      atividade: +$('atividade').value
    };

    tmb = perfil.sexo === 'homem'
      ? 66 + (13.7*perfil.peso) + (5*perfil.altura) - (6.8*perfil.idade)
      : 655 + (9.6*perfil.peso) + (1.8*perfil.altura) - (4.7*perfil.idade);

    tmb *= perfil.atividade;

    $('tmb').textContent = tmb.toFixed(0);
    localStorage.setItem('perfil', JSON.stringify({ ...perfil, tmb }));
  };
}

/* META + OBJETIVO */
const presets = {
  manter: { p:30, c:40, g:30 },
  emagrecer: { p:35, c:35, g:30 },
  hipertrofia: { p:30, c:50, g:20 }
};

if ($('objetivo')) {
  $('objetivo').onchange = e => {
    macros = presets[e.target.value];
    $('pct-proteina').value = macros.p;
    $('pct-carbo').value = macros.c;
    $('pct-gordura').value = macros.g;
    calcularMacros();
  };
}

if ($('salvar-meta')) {
  $('salvar-meta').onclick = () => {
    const delta = +$('delta').value || 0;

    meta = tmb + delta;

    macros = {
      p: +$('pct-proteina').value,
      c: +$('pct-carbo').value,
      g: +$('pct-gordura').value
    };

    localStorage.setItem('meta', JSON.stringify({ meta, macros }));
    $('meta-calorias').textContent = meta.toFixed(0);
    calcularMacros();
  };
}

/* MACROS */
function calcularMacros() {
  if (!meta) return;

  $('g-proteina').textContent = ((meta * macros.p / 100) / 4).toFixed(0);
  $('g-carbo').textContent = ((meta * macros.c / 100) / 4).toFixed(0);
  $('g-gordura').textContent = ((meta * macros.g / 100) / 9).toFixed(0);
}

/* RESTAURAR */
window.onload = () => {
  const p = JSON.parse(localStorage.getItem('perfil'));
  if (p) {
    perfil = p;
    tmb = p.tmb;
    if ($('sexo')) {
      $('sexo').value = p.sexo;
      $('idade').value = p.idade;
      $('altura').value = p.altura;
      $('peso').value = p.peso;
      $('atividade').value = p.atividade;
      $('tmb').textContent = tmb.toFixed(0);
    }
  }

  const m = JSON.parse(localStorage.getItem('meta'));
  if (m) {
    meta = m.meta;
    macros = m.macros;
    if ($('meta-calorias')) $('meta-calorias').textContent = meta.toFixed(0);
    if ($('pct-proteina')) {
      $('pct-proteina').value = macros.p;
      $('pct-carbo').value = macros.c;
      $('pct-gordura').value = macros.g;
      calcularMacros();
    }
  }
};


