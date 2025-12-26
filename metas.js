const $ = id => document.getElementById(id);

/* MENU */
$('menuBtn').onclick = () => $('menu').classList.toggle('show');

const perfil = JSON.parse(localStorage.getItem('perfil'));
let metas = JSON.parse(localStorage.getItem('metas')) || {};

function calcularMetas() {
  if (!perfil) return;

  const objetivo = $('objetivo').value;
  const ajuste = Number($('ajuste').value || 0);

  let fator = 0;
  let perc = {};

  if (objetivo === 'emagrecimento') {
    fator = -500;
    perc = { p: 0.35, c: 0.40, g: 0.25 };
  }
  if (objetivo === 'manutencao') {
    fator = 0;
    perc = { p: 0.30, c: 0.45, g: 0.25 };
  }
  if (objetivo === 'hipertrofia') {
    fator = 500;
    perc = { p: 0.30, c: 0.50, g: 0.20 };
  }

  const calorias = Math.round(perfil.gasto + fator + ajuste);

  metas = {
    objetivo,
    cal: calorias,
    p: Math.round((calorias * perc.p) / 4),
    c: Math.round((calorias * perc.c) / 4),
    g: Math.round((calorias * perc.g) / 9)
  };

  $('calorias').textContent = `Meta diária: ${metas.cal} kcal`;
  $('p').textContent = metas.p;
  $('c').textContent = metas.c;
  $('g').textContent = metas.g;
}

$('objetivo').onchange = calcularMetas;
$('ajuste').oninput = calcularMetas;

$('salvarMetas').onclick = () => {
  localStorage.setItem('metas', JSON.stringify(metas));
  alert('Metas salvas com sucesso!');
};

/* CARREGAR */
if (metas.cal) {
  $('objetivo').value = metas.objetivo;
  calcularMetas();
}
