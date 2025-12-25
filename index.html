/* MENU */
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
    idade: Number(idade.value),
    peso: Number(peso.value),
    altura: Number(altura.value),
    atividade: Number(atividade.value)
  };
  localStorage.setItem('perfil', JSON.stringify(perfil));
  alert('Perfil salvo');
}

function carregarPerfil() {
  const perfil = JSON.parse(localStorage.getItem('perfil'));
  if (!perfil) return;

  sexo.value = perfil.sexo;
  idade.value = perfil.idade;
  peso.value = perfil.peso;
  altura.value = perfil.altura;
  atividade.value = perfil.atividade;
}

/* META */
function salvarMeta() {
  const perfil = JSON.parse(localStorage.getItem('perfil'));
  if (!perfil) return alert('Preencha o perfil primeiro');

  let tmb =
    perfil.sexo === 'homem'
      ? 66 + 13.7 * perfil.peso + 5 * perfil.altura - 6.8 * perfil.idade
      : 655 + 9.6 * perfil.peso + 1.8 * perfil.altura - 4.7 * perfil.idade;

  let meta = tmb * perfil.atividade + Number(ajuste.value);

  localStorage.setItem('meta', meta.toFixed(0));
  metaCalorias.textContent = meta.toFixed(0);
}

/* RESUMO */
function carregarResumo() {
  const meta = localStorage.getItem('meta') || 0;
  metaSpan = document.getElementById('meta');
  if (metaSpan) metaSpan.textContent = meta;
}

/* AUTO LOAD */
document.addEventListener('DOMContentLoaded', () => {
  carregarPerfil();
  carregarResumo();
});
