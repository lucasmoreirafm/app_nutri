const $ = id => document.getElementById(id);

/* MENU */
if ($('menu-btn')) {
  $('menu-btn').onclick = () => {
    $('menu').style.display =
      $('menu').style.display === 'block' ? 'none' : 'block';
  };
}

/* ================= PERFIL ================= */
let perfil = JSON.parse(localStorage.getItem('perfil')) || null;
let tmb = perfil?.tmb || 0;

if ($('salvar-perfil')) {
  if (perfil) {
    $('sexo').value = perfil.sexo;
    $('idade').value = perfil.idade;
    $('altura').value = perfil.altura;
    $('peso').value = perfil.peso;
    $('atividade').value = perfil.atividade;
    $('tmb').textContent = Math.round(tmb);
  }

  $('salvar-perfil').onclick = () => {
    perfil = {
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
    perfil.tmb = tmb;

    $('tmb').textContent = Math.round(tmb);
    localStorage.setItem('perfil', JSON.stringify(perfil));
  };
}

/* ================= METAS ================= */
const presets = {
  manter: { p: 30, c: 40, g: 30 },
  emagrecer: { p: 35, c: 35, g: 30 },
  hipertrofia: { p: 30, c: 50, g: 20 }
};

let metaData = JSON.parse(localStorage.getItem('meta')) || null;

function calcularMeta() {
  if (!perfil) return;

  const delta = +$('delta').value || 0;
  const meta = Math.round(perfil.tmb + delta);
  $('meta-calorias').textContent = meta;

  const p = +$('pct-proteina').value;
  const c = +$('pct-carbo').value;
  const g = +$('pct-gordura').value;

  $('g-proteina').textContent = Math.round((meta * p / 100) / 4);
  $('g-carbo').textContent = Math.round((meta * c / 100) / 4);
  $('g-gordura').textContent = Math.round((meta * g / 100) / 9);

  metaData = { meta, delta, macros: { p, c, g }, objetivo: $('objetivo').value };
}

if ($('objetivo')) {
  if (metaData) {
    $('delta').value = metaData.delta;
    $('objetivo').value = metaData.objetivo;
    $('pct-proteina').value = metaData.macros.p;
    $('pct-carbo').value = metaData.macros.c;
    $('pct-gordura').value = metaData.macros.g;
    calcularMeta();
  }

  $('objetivo').onchange = e => {
    const p = presets[e.target.value];
    $('pct-proteina').value = p.p;
    $('pct-carbo').value = p.c;
    $('pct-gordura').value = p.g;
    calcularMeta();
  };

  ['delta','pct-proteina','pct-carbo','pct-gordura']
    .forEach(id => $(id).oninput = calcularMeta);

  $('salvar-meta').onclick = () => {
    localStorage.setItem('meta', JSON.stringify(metaData));
  };
}

/* ================= ALIMENTOS ================= */
let alimentos = [];
let resumo = { calorias:0, proteina:0, carboidrato:0, gordura:0 };

fetch('taco.json')
  .then(r => r.json())
  .then(data => {
    alimentos = data;
    atualizarLista(data);
  });

function atualizarLista(lista) {
  if (!$('alimento-select')) return;
  $('alimento-select').innerHTML = '';
  lista.forEach(a => {
    const o = document.createElement('option');
    o.value = a.alimento;
    o.textContent = `${a.alimento} (${a.calorias} kcal)`;
    $('alimento-select').appendChild(o);
  });
}

if ($('busca-alimento')) {
  $('busca-alimento').oninput = e => {
    atualizarLista(
      alimentos.filter(a =>
        a.alimento.toLowerCase().includes(e.target.value.toLowerCase())
      )
    );
  };
}

if ($('adicionar')) {
  $('adicionar').onclick = () => {
    const item = alimentos.find(a => a.alimento === $('alimento-select').value);
    const q = +$('quantidade').value || 100;
    const f = q / 100;

    resumo.calorias += item.calorias * f;
    resumo.proteina += item.proteina * f;
    resumo.carboidrato += item.carboidrato * f;
    resumo.gordura += item.gordura * f;

    $('calorias').textContent = resumo.calorias.toFixed(1);
    $('proteina').textContent = resumo.proteina.toFixed(1);
    $('carboidrato').textContent = resumo.carboidrato.toFixed(1);
    $('gordura').textContent = resumo.gordura.toFixed(1);
  };
}

if ($('zerar')) {
  $('zerar').onclick = () => {
    resumo = { calorias:0, proteina:0, carboidrato:0, gordura:0 };
    $('calorias').textContent = 0;
    $('proteina').textContent = 0;
    $('carboidrato').textContent = 0;
    $('gordura').textContent = 0;
  };
}


