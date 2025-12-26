const $ = id => document.getElementById(id);

/* MENU */
document.addEventListener('click', e => {
  if (e.target.id === 'menuBtn') {
    $('menu').classList.toggle('show');
  }
});

/* PERFIL */
function salvarPerfil() {
  const perfil = {
    sexo: $('sexo').value,
    peso: +$('peso').value,
    idade: +$('idade').value,
    altura: +$('altura').value,
    atividade: +$('atividade').value
  };

  let tmb = perfil.sexo === 'homem'
    ? 66 + 13.7 * perfil.peso + 5 * perfil.altura - 6.8 * perfil.idade
    : 655 + 9.6 * perfil.peso + 1.8 * perfil.altura - 4.7 * perfil.idade;

  perfil.tmb = tmb * perfil.atividade;
  localStorage.setItem('perfil', JSON.stringify(perfil));

  if ($('tmbResultado')) $('tmbResultado').textContent = perfil.tmb.toFixed(0);
}

const perfilSalvo = JSON.parse(localStorage.getItem('perfil'));
if (perfilSalvo && $('sexo')) {
  $('sexo').value = perfilSalvo.sexo;
  $('peso').value = perfilSalvo.peso;
  $('idade').value = perfilSalvo.idade;
  $('altura').value = perfilSalvo.altura;
  $('atividade').value = perfilSalvo.atividade;
  $('tmbResultado').textContent = perfilSalvo.tmb.toFixed(0);
}

/* METAS */
function calcularMeta() {
  const perfil = JSON.parse(localStorage.getItem('perfil'));
  if (!perfil) return;

  const ajuste = +$('ajuste').value;
  const objetivo = $('objetivo').value;
  let calorias = perfil.tmb + ajuste;

  let pct = objetivo === 'emagrecimento'
    ? [0.3, 0.4, 0.3]
    : objetivo === 'hipertrofia'
    ? [0.25, 0.5, 0.25]
    : [0.25, 0.45, 0.3];

  const metas = {
    calorias,
    proteina: (calorias * pct[0]) / 4,
    carbo: (calorias * pct[1]) / 4,
    gordura: (calorias * pct[2]) / 9
  };

  localStorage.setItem('metas', JSON.stringify(metas));

  $('metaCalorias').textContent = calorias.toFixed(0);
  $('metaProteina').textContent = metas.proteina.toFixed(0);
  $('metaCarbo').textContent = metas.carbo.toFixed(0);
  $('metaGordura').textContent = metas.gordura.toFixed(0);
}

/* RESUMO + BARRAS */
let resumo = JSON.parse(localStorage.getItem('resumo')) || {
  calorias: 0, proteina: 0, carbo: 0, gordura: 0
};

function atualizarBarra(id, cons, meta) {
  const el = $(id);
  if (!el || !meta) return;
  const pct = cons / meta;
  el.style.width = Math.min(pct * 100, 100) + '%';
  el.className = pct < 0.8 ? 'pb-ok' : pct <= 1 ? 'pb-alerta' : 'pb-excedeu';
}

function atualizarResumo() {
  const metas = JSON.parse(localStorage.getItem('metas')) || {};

  $('caloriasConsumidas').textContent = resumo.calorias.toFixed(0);
  $('proteinaConsumida').textContent = resumo.proteina.toFixed(0);
  $('carboConsumido').textContent = resumo.carbo.toFixed(0);
  $('gorduraConsumida').textContent = resumo.gordura.toFixed(0);

  $('caloriasMeta').textContent = metas.calorias || 0;
  $('proteinaMeta').textContent = metas.proteina || 0;
  $('carboMeta').textContent = metas.carbo || 0;
  $('gorduraMeta').textContent = metas.gordura || 0;

  atualizarBarra('pb-calorias', resumo.calorias, metas.calorias);
  atualizarBarra('pb-proteina', resumo.proteina, metas.proteina);
  atualizarBarra('pb-carbo', resumo.carbo, metas.carbo);
  atualizarBarra('pb-gordura', resumo.gordura, metas.gordura);

  localStorage.setItem('resumo', JSON.stringify(resumo));
}

/* ALIMENTOS */
let alimentos = [];

fetch('taco.json').then(r => r.json()).then(d => {
  alimentos = d;
  filtrarAlimentos();
});

function filtrarAlimentos() {
  const texto = $('busca')?.value?.toLowerCase() || '';
  const lista = $('lista');
  if (!lista) return;

  lista.innerHTML = '';
  alimentos.filter(a => a.alimento.toLowerCase().includes(texto))
    .forEach(a => {
      const opt = document.createElement('option');
      opt.value = a.alimento;
      opt.textContent = a.alimento;
      lista.appendChild(opt);
    });
}

function adicionarAlimento() {
  const item = alimentos.find(a => a.alimento === $('lista').value);
  if (!item) return;

  const fator = (+$('quantidade').value || 100) / 100;

  resumo.calorias += item.calorias * fator;
  resumo.proteina += item.proteina * fator;
  resumo.carbo += item.carboidrato * fator;
  resumo.gordura += item.gordura * fator;

  atualizarResumo();
}

if ($('caloriasConsumidas')) atualizarResumo();
