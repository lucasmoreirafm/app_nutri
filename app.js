let alimentos = [];
let resumo = { calorias:0, proteina:0, carboidrato:0, gordura:0 };
let tmb = 0;
let meta = 0;

const $ = id => document.getElementById(id);

/* MENU */
document.addEventListener('DOMContentLoaded', () => {
  if ($('menu-btn')) {
    $('menu-btn').onclick = () =>
      $('menu-links').classList.toggle('hidden');
  }
});

/* CARREGAR ALIMENTOS */
fetch('taco.json')
  .then(r => r.json())
  .then(data => {
    alimentos = data;
    atualizarSelect(data);
  });

function atualizarSelect(lista) {
  const select = $('alimento-select');
  if (!select) return;
  select.innerHTML = '';
  lista.forEach(a => {
    const opt = document.createElement('option');
    opt.value = a.alimento;
    opt.textContent = `${a.alimento} (${a.calorias} kcal)`;
    select.appendChild(opt);
  });
}

/* BUSCA */
if ($('busca-alimento')) {
  $('busca-alimento').addEventListener('input', e => {
    const termo = e.target.value.toLowerCase();
    const filtrados = alimentos.filter(a =>
      a.alimento.toLowerCase().includes(termo)
    );
    atualizarSelect(filtrados);
  });
}

/* RESUMO */
function atualizarResumo() {
  if (!$('calorias')) return;

  let texto = resumo.calorias.toFixed(1);
  if (meta > 0) {
    const d = resumo.calorias - meta;
    if (d < 0) texto += ` | faltam ${Math.abs(d).toFixed(1)} kcal`;
    else if (d > 0) texto += ` | ultrapassou ${d.toFixed(1)} kcal`;
    else texto += ' | meta atingida!';
  }

  $('calorias').textContent = texto;
  $('proteina').textContent = resumo.proteina.toFixed(1);
  $('carboidrato').textContent = resumo.carboidrato.toFixed(1);
  $('gordura').textContent = resumo.gordura.toFixed(1);
}

/* ADICIONAR ALIMENTO */
if ($('adicionar')) {
  $('adicionar').onclick = () => {
    const item = alimentos.find(a => a.alimento === $('alimento-select').value);
    if (!item) return;

    const qtd = Number($('quantidade').value) || 100;
    const f = qtd / 100;

    resumo.calorias += item.calorias * f;
    resumo.proteina += item.proteina * f;
    resumo.carboidrato += item.carboidrato * f;
    resumo.gordura += item.gordura * f;

    atualizarResumo();
  };
}

/* ZERAR */
if ($('zerar')) {
  $('zerar').onclick = () => {
    resumo = { calorias:0, proteina:0, carboidrato:0, gordura:0 };
    atualizarResumo();
  };
}

/* PERFIL */
if ($('salvar-perfil')) {
  $('salvar-perfil').onclick = () => {
    const sexo = $('sexo').value;
    const idade = +$('idade').value;
    const altura = +$('altura').value;
    const atividade = +$('atividade').value;

    tmb = sexo === 'homem'
      ? 66 + (13.7*70) + (5*altura) - (6.8*idade)
      : 655 + (9.6*60) + (1.8*altura) - (4.7*idade);

    tmb *= atividade;

    $('tmb').textContent = tmb.toFixed(1);
    localStorage.setItem('perfil', JSON.stringify({ sexo, idade, altura, atividade, tmb }));
  };
}

/* META */
if ($('salvar-meta')) {
  $('salvar-meta').onclick = () => {
    const objetivo = $('objetivo').value;
    const delta = +$('delta').value;

    meta = tmb;
    if (objetivo === 'ganhar') meta += delta;
    if (objetivo === 'perder') meta -= delta;

    $('meta-calorias').textContent = meta.toFixed(1);
    localStorage.setItem('meta', meta);
  };
}

/* RESTAURAR */
window.onload = () => {
  const perfil = JSON.parse(localStorage.getItem('perfil'));
  if (perfil) {
    tmb = perfil.tmb;
    if ($('sexo')) {
      $('sexo').value = perfil.sexo;
      $('idade').value = perfil.idade;
      $('altura').value = perfil.altura;
      $('atividade').value = perfil.atividade;
      $('tmb').textContent = tmb.toFixed(1);
    }
  }

  const m = localStorage.getItem('meta');
  if (m) {
    meta = +m;
    if ($('meta-calorias')) $('meta-calorias').textContent = meta.toFixed(1);
  }

  atualizarResumo();
};

