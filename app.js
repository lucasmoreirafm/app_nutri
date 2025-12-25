const $ = id => document.getElementById(id);

let tmb = 0;
let meta = 0;

/* ================= PERFIL ================= */
if ($('salvar-perfil')) {
  $('salvar-perfil').onclick = () => {
    const perfil = {
      sexo: $('sexo').value,
      idade: +$('idade').value,
      altura: +$('altura').value,
      peso: +$('peso').value,
      atividade: +$('atividade').value
    };

    tmb =
      perfil.sexo === 'homem'
        ? 66 + 13.7 * perfil.peso + 5 * perfil.altura - 6.8 * perfil.idade
        : 655 + 9.6 * perfil.peso + 1.8 * perfil.altura - 4.7 * perfil.idade;

    tmb *= perfil.atividade;

    $('tmb').textContent = Math.round(tmb);

    localStorage.setItem('perfil', JSON.stringify({ ...perfil, tmb }));
    alert('Perfil salvo');
  };
}

/* ================= METAS ================= */
const presets = {
  manter: { p: 30, c: 40, g: 30 },
  emagrecer: { p: 35, c: 35, g: 30 },
  hipertrofia: { p: 30, c: 50, g: 20 }
};

function recalcular() {
  const perfil = JSON.parse(localStorage.getItem('perfil'));
  if (!perfil) return alert('Cadastre o perfil primeiro');

  tmb = perfil.tmb;
  meta = Math.round(tmb + (+$('delta').value || 0));

  $('meta-calorias').textContent = meta;

  const p = +$('pct-proteina').value;
  const c = +$('pct-carbo').value;
  const g = +$('pct-gordura').value;

  $('g-proteina').textContent = Math.round((meta * p / 100) / 4);
  $('g-carbo').textContent = Math.round((meta * c / 100) / 4);
  $('g-gordura').textContent = Math.round((meta * g / 100) / 9);
}

if ($('objetivo')) {
  $('objetivo').onchange = e => {
    const preset = presets[e.target.value];
    $('pct-proteina').value = preset.p;
    $('pct-carbo').value = preset.c;
    $('pct-gordura').value = preset.g;
    recalcular();
  };

  $('delta').oninput = recalcular;
  $('pct-proteina').oninput = recalcular;
  $('pct-carbo').oninput = recalcular;
  $('pct-gordura').oninput = recalcular;

  $('salvar-meta').onclick = () => {
    localStorage.setItem(
      'meta',
      JSON.stringify({
        meta,
        macros: {
          p: $('pct-proteina').value,
          c: $('pct-carbo').value,
          g: $('pct-gordura').value
        }
      })
    );
    alert('Meta salva');
  };
}

/* ================= RESTAURAR ================= */
window.onload = () => {
  const perfil = JSON.parse(localStorage.getItem('perfil'));
  if (perfil && $('peso')) {
    $('sexo').value = perfil.sexo;
    $('idade').value = perfil.idade;
    $('altura').value = perfil.altura;
    $('peso').value = perfil.peso;
    $('atividade').value = perfil.atividade;
    $('tmb').textContent = Math.round(perfil.tmb);
  }

  const metaSalva = JSON.parse(localStorage.getItem('meta'));
  if (metaSalva && $('pct-proteina')) {
    $('meta-calorias').textContent = metaSalva.meta;
    $('pct-proteina').value = metaSalva.macros.p;
    $('pct-carbo').value = metaSalva.macros.c;
    $('pct-gordura').value = metaSalva.macros.g;
    recalcular();
  }
};


