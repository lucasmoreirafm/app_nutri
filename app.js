const $ = id => document.getElementById(id);

/* MENU */
function toggleMenu() {
  const m = $('menu');
  if (m) m.style.display = m.style.display === 'block' ? 'none' : 'block';
}

/* PERFIL */
function salvarPerfil() {
  const perfil = {
    sexo: $('sexo').value,
    peso: +$('peso').value,
    idade: +$('idade').value,
    altura: +$('altura').value,
    atividade: +$('atividade').value
  };

  const tmb =
    perfil.sexo === 'homem'
      ? 66 + 13.7 * perfil.peso + 5 * perfil.altura - 6.8 * perfil.idade
      : 655 + 9.6 * perfil.peso + 1.8 * perfil.altura - 4.7 * perfil.idade;

  perfil.gasto = Math.round(tmb * perfil.atividade);

  localStorage.setItem('perfil', JSON.stringify(perfil));
  $('tmb').textContent = perfil.gasto;
}

/* METAS */
function salvarMetas() {
  const perfil = JSON.parse(localStorage.getItem('perfil'));
  if (!perfil) return alert('Crie o perfil primeiro');

  const ajuste = +$('ajuste').value || 0;
  const objetivo = $('objetivo').value;

  const base = perfil.gasto + ajuste;

  const pct = {
    emagrecimento: { p: .3, c: .4, g: .3 },
    manutencao: { p: .25, c: .5, g: .25 },
    hipertrofia: { p: .25, c: .55, g: .2 }
  }[objetivo];

  const metas = {
    cal: base,
    p: Math.round(base * pct.p / 4),
    c: Math.round(base * pct.c / 4),
    g: Math.round(base * pct.g / 9)
  };

  localStorage.setItem('metas', JSON.stringify(metas));

  $('metaCal').textContent = metas.cal;
  $('metaP').textContent = metas.p;
  $('metaC').textContent = metas.c;
  $('metaG').textContent = metas.g;
}

/* RESUMO */
let resumo = JSON.parse(localStorage.getItem('resumo')) || { cal:0,p:0,c:0,g:0 };
let alimentos = [];

fetch('taco.json').then(r=>r.json()).then(d=>{
  alimentos = d;
  atualizarLista('');
});

function atualizarLista(txt){
  const s = $('alimentos');
  s.innerHTML = '';
  alimentos.filter(a=>a.alimento.toLowerCase().includes(txt))
    .forEach(a=>{
      const o = document.createElement('option');
      o.value = a.alimento;
      o.textContent = a.alimento;
      s.appendChild(o);
    });
}

if ($('busca'))
  $('busca').addEventListener('input', e=>atualizarLista(e.target.value));

function adicionar(){
  const item = alimentos.find(a=>a.alimento===$('alimentos').value);
  const qtd = +$('qtd').value || 100;
  const f = qtd/100;

  resumo.cal += item.calorias*f;
  resumo.p += item.proteina*f;
  resumo.c += item.carboidrato*f;
  resumo.g += item.gordura*f;

  localStorage.setItem('resumo', JSON.stringify(resumo));
  renderResumo();
}

function renderResumo(){
  const metas = JSON.parse(localStorage.getItem('metas')) || {};
  $('cal').textContent = resumo.cal.toFixed(1);
  $('p').textContent = resumo.p.toFixed(1);
  $('c').textContent = resumo.c.toFixed(1);
  $('g').textContent = resumo.g.toFixed(1);

  $('metaCal2').textContent = metas.cal || 0;
  $('metaP2').textContent = metas.p || 0;
  $('metaC2').textContent = metas.c || 0;
  $('metaG2').textContent = metas.g || 0;
}

function zerar(){
  resumo = {cal:0,p:0,c:0,g:0};
  localStorage.removeItem('resumo');
  renderResumo();
}

document.addEventListener('DOMContentLoaded', renderResumo);
