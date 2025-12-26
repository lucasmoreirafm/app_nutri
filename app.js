/* ========= HELPERS ========= */
const $ = id => document.getElementById(id);

/* ========= MENU ========= */
document.addEventListener('DOMContentLoaded', () => {
  const btn = $('menuBtn');
  const menu = $('menu');
  if (btn && menu) btn.onclick = () => menu.classList.toggle('show');
});

/* ========= STORAGE ========= */
const salvar = (k, v) => localStorage.setItem(k, JSON.stringify(v));
const carregar = (k, p) => JSON.parse(localStorage.getItem(k)) || p;

/* ========= PERFIL ========= */
function salvarPerfil() {
  const sexo = $('sexo').value;
  const peso = Number($('peso').value);
  const idade = Number($('idade').value);
  const altura = Number($('altura').value);
  const atividade = Number($('atividade').value);

  if (!peso || !idade || !altura) return;

  const tmb =
    sexo === 'homem'
      ? 10 * peso + 6.25 * altura - 5 * idade + 5
      : 10 * peso + 6.25 * altura - 5 * idade - 161;

  const gasto = tmb * atividade;

  $('tmbResultado').textContent = gasto.toFixed(0);
  salvar('perfil', { sexo, peso, idade, altura, atividade, gasto });
}

(function carregarPerfil() {
  if (!$('peso')) return;
  const p = carregar('perfil', null);
  if (!p) return;

  $('sexo').value = p.sexo;
  $('peso').value = p.peso;
  $('idade').value = p.idade;
  $('altura').value = p.altura;
  $('atividade').value = p.atividade;
  $('tmbResultado').textContent = p.gasto.toFixed(0);
})();

/* ========= RESUMO ========= */
let resumo = carregar('resumo', { cal: 0, p: 0, c: 0, g: 0 });
let metas = carregar('metas', {});
let alimentoSelecionado = null;

function atualizarBarra(id, valor, meta) {
  const barra = $(id);
  if (!barra) return;

  if (!meta || meta <= 0) {
    barra.style.width = '0%';
    return;
  }

  const pct = Math.min(valor / meta, 1);
  barra.style.width = pct * 100 + '%';
}


function textoStatus(valor, meta, unidade) {
  if (!meta) return '';
  const diff = meta - valor;
  return diff >= 0
    ? ` — faltam ${diff.toFixed(0)} ${unidade}`
    : ` — ultrapassou ${Math.abs(diff).toFixed(0)} ${unidade}`;
}

function renderResumo() {
  if (!$('cal')) return;

  const metaCal = metas.cal || 0
    
    $('metaCal').textContent = metaCal;
atualizarBarra('barraCal', resumo.cal, metaCal);;

  // Valores consumidos
  $('cal').textContent = resumo.cal.toFixed(0);
  $('p').textContent = resumo.p.toFixed(0);
  $('c').textContent = resumo.c.toFixed(0);
  $('g').textContent = resumo.g.toFixed(0);

  // Metas
  $('metaCal').textContent = metaCal;
  $('metaP').textContent = metas.p || 0;
  $('metaC').textContent = metas.c || 0;
  $('metaG').textContent = metas.g || 0;

  // Barras
  atualizarBarra('barraCal', resumo.cal, metaCal);
  atualizarBarra('barraP', resumo.p, metas.p);
  atualizarBarra('barraC', resumo.c, metas.c);
  atualizarBarra('barraG', resumo.g, metas.g);

  // Status calorias
  if (metaCal) {
    const diff = metaCal - resumo.cal;
    $('statusCal').textContent =
      diff >= 0
        ? ` — faltam ${diff.toFixed(0)} kcal`
        : ` — ultrapassou ${Math.abs(diff).toFixed(0)} kcal`;
  } else {
    $('statusCal').textContent = '';
  }
}

/* ========= ALIMENTOS ========= */
function renderLista(nome) {
  let lista = $('listaAlimentos');
  if (!lista) {
    lista = document.createElement('div');
    lista.id = 'listaAlimentos';
    $('buscaAlimento').after(lista);
  }

  lista.innerHTML = '';
  if (!nome || !window.taco) return;

  window.taco
    .filter(a => a.alimento.toLowerCase().includes(nome))
    .slice(0, 8)
    .forEach(item => {
      const div = document.createElement('div');
      div.textContent = item.alimento;
      div.onclick = () => {
        alimentoSelecionado = item;
        lista.innerHTML = `<small>${item.alimento} selecionado</small>`;
      };
      lista.appendChild(div);
    });
}

function adicionarAlimento() {
  if (!alimentoSelecionado) return;

  const qtd = Number($('quantidade').value) || 100;
  const f = qtd / 100;

  resumo.cal += alimentoSelecionado.calorias * f;
  resumo.p += alimentoSelecionado.proteina * f;
  resumo.c += alimentoSelecionado.carboidrato * f;
  resumo.g += alimentoSelecionado.gordura * f;

  salvar('resumo', resumo);
  alimentoSelecionado = null;
  renderResumo();
}

$('buscaAlimento') &&
  $('buscaAlimento').addEventListener('input', e =>
    renderLista(e.target.value.toLowerCase())
  );

/* ========= ZERAR ========= */
if ($('zerarResumo')) {
  $('zerarResumo').onclick = () => {
    resumo = { cal: 0, p: 0, c: 0, g: 0 };
    salvar('resumo', resumo);
    renderResumo();
  };
}

/* ========= TACO ========= */
fetch('taco.json')
  .then(r => r.json())
  .then(d => (window.taco = d));

renderResumo();




