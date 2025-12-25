let alimentos = [];
let resumo = { calorias:0, proteina:0, carboidrato:0, gordura:0 };
let tmb = 0;
let meta = 0;

fetch('taco.json')
  .then(resp => resp.json())
  .then(data => {
    alimentos = data;
    const select = document.getElementById('alimento-select');
    data.forEach(a => {
      const option = document.createElement('option');
      option.value = a.alimento;
      option.textContent = `${a.alimento} - ${a.calorias} kcal`;
      select.appendChild(option);
    });
  });

function atualizarResumo() {
  // Calorias: mostrar quanto falta ou ultrapassou
  let caloriasTexto = resumo.calorias.toFixed(1);
  if(meta > 0){
      const diferenca = resumo.calorias - meta;
      if(diferenca < 0) {
          caloriasTexto += ` | faltam ${Math.abs(diferenca).toFixed(1)} kcal`;
      } else if(diferenca > 0) {
          caloriasTexto += ` | ultrapassou ${diferenca.toFixed(1)} kcal`;
      } else {
          caloriasTexto += ` | atingiu a meta!`;
      }
  }

  document.getElementById('calorias').textContent = caloriasTexto;
  document.getElementById('proteina').textContent = resumo.proteina.toFixed(1);
  document.getElementById('carboidrato').textContent = resumo.carboidrato.toFixed(1);
  document.getElementById('gordura').textContent = resumo.gordura.toFixed(1);
}


// Salvar perfil
document.getElementById('salvar-perfil').addEventListener('click', () => {
  const sexo = document.getElementById('sexo').value;
  const idade = Number(document.getElementById('idade').value);
  const altura = Number(document.getElementById('altura').value);
  const atividade = Number(document.getElementById('atividade').value);

  tmb = sexo === 'homem'
    ? 66 + (13.7*70) + (5*altura) - (6.8*idade)
    : 655 + (9.6*60) + (1.8*altura) - (4.7*idade);

  tmb *= atividade;
  document.getElementById('tmb').textContent = tmb.toFixed(1);
  localStorage.setItem('perfil', JSON.stringify({sexo, idade, altura, atividade, tmb}));
});

// Salvar meta
document.getElementById('salvar-meta').addEventListener('click', () => {
  const objetivo = document.getElementById('objetivo').value;
  const delta = Number(document.getElementById('delta').value);

  meta = tmb;
  if(objetivo === 'ganhar') meta += delta;
  else if(objetivo === 'perder') meta -= delta;

  document.getElementById('meta-calorias').textContent = meta.toFixed(1);
  localStorage.setItem('meta', meta);
});

// Adicionar alimento com quantidade
document.getElementById('adicionar').addEventListener('click', () => {
  const select = document.getElementById('alimento-select');
  const item = alimentos.find(a => a.alimento === select.value);
  const quantidade = Number(document.getElementById('quantidade').value) || 100;
  if(!item) return;

  const fator = quantidade / 100;

  resumo.calorias += item.calorias * fator;
  resumo.proteina += item.proteina * fator;
  resumo.carboidrato += item.carboidrato * fator;
  resumo.gordura += item.gordura * fator;

  atualizarResumo();
});

// Zerar resumo
document.getElementById('zerar').addEventListener('click', () => {
  resumo = { calorias:0, proteina:0, carboidrato:0, gordura:0 };
  atualizarResumo();
});

// ===== Carregar dados salvos ao iniciar =====
window.addEventListener('load', () => {
  // Perfil
  const perfilSalvo = JSON.parse(localStorage.getItem('perfil'));
  if (perfilSalvo) {
    document.getElementById('sexo').value = perfilSalvo.sexo;
    document.getElementById('idade').value = perfilSalvo.idade;
    document.getElementById('altura').value = perfilSalvo.altura;
    document.getElementById('atividade').value = perfilSalvo.atividade;

    tmb = perfilSalvo.tmb;
    document.getElementById('tmb').textContent = tmb.toFixed(1);
  }

  // Meta
  const metaSalva = localStorage.getItem('meta');
  if (metaSalva) {
    meta = Number(metaSalva);
    document.getElementById('meta-calorias').textContent = meta.toFixed(1);
  }

  atualizarResumo();
});

