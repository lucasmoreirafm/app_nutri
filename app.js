function toggleMenu() {
  const menu = document.getElementById('menu');
  if (menu) {
    menu.style.display = menu.style.display === 'block' ? 'none' : 'block';
  }
}

/* PERFIL */
function salvarPerfil() {
  const perfil = {
    sexo: sexo.value,
    idade: +idade.value,
    peso: +peso.value,
    altura: +altura.value,
    atividade: +atividade.value
  };
  localStorage.setItem('perfil', JSON.stringify(perfil));
  alert('Perfil salvo');
}

/* METAS */
function calcularMetas() {
  const perfil = JSON.parse(localStorage.getItem('perfil'));
  if (!perfil) return alert('Preencha o perfil');

  let tmb =
    perfil.sexo === 'M'
      ? 66 + 13.7 * perfil.peso + 5 * perfil.altura - 6.8 * perfil.idade
      : 655 + 9.6 * perfil.peso + 1.8 * perfil.altura - 4.7 * perfil.idade;

  let meta = Math.round(tmb * perfil.atividade + Number(ajuste.value));

  const pct =
    objetivo.value === 'emagrecer'
      ? [0.3, 0.4, 0.3]
      : objetivo.value === 'hipertrofia'
      ? [0.3, 0.5, 0.2]
      : [0.25, 0.5, 0.25];

  const macros = {
    p: Math.round((meta * pct[0]) / 4),
    c: Math.round((meta * pct[1]) / 4),
    g: Math.round((meta * pct[2]) / 9)
  };

  localStorage.setItem('metas', JSON.stringify({ meta, macros }));

  metaCalorias.textContent = meta;
  metaP.textContent = macros.p;
  metaC.textContent = macros.c;
  metaG.textContent = macros.g;
}

/* RESUMO */
const alimentos = {
  arroz: { kcal: 130, p: 2.5, c: 28, g: 0.3 },
  frango: { kcal: 165, p: 31, c: 0, g: 3.6 }
};

let resumo = JSON.parse(localStorage.getItem('resumo')) || { kcal: 0, p: 0, c: 0, g: 0 };

function adicionar() {
  const a = alimentos[busca.value.toLowerCase()];
  if (!a) return alert('Alimento não encontrado');

  const q = quantidade.value / 100;
  resumo.kcal += a.kcal * q;
  resumo.p += a.p * q;
  resumo.c += a.c * q;
  resumo.g += a.g * q;

  localStorage.setItem('resumo', JSON.stringify(resumo));
  atualizarResumo();
}

function atualizarResumo() {
  const metas = JSON.parse(localStorage.getItem('metas'));
  if (!metas) return;

  calorias.textContent = resumo.kcal.toFixed(0);
  p.textContent = resumo.p.toFixed(1);
  c.textContent = resumo.c.toFixed(1);
  g.textContent = resumo.g.toFixed(1);

  metaCal.textContent = metas.meta;
  mp.textContent = metas.macros.p;
  mc.textContent = metas.macros.c;
  mg.textContent = metas.macros.g;
}

function zerar() {
  resumo = { kcal: 0, p: 0, c: 0, g: 0 };
  localStorage.removeItem('resumo');
  atualizarResumo();
}

document.addEventListener('DOMContentLoaded', atualizarResumo);
