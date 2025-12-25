* {
  box-sizing: border-box;
  font-family: Arial, sans-serif;
}

body {
  margin: 0;
  background: #f3f4f6;
}

header {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 15px;
  background: #2563eb;
  color: white;
}

#menuBtn {
  font-size: 22px;
  background: none;
  border: none;
  color: white;
}

.menu {
  display: none;
  flex-direction: column;
  background: #1e40af;
}

.menu a {
  padding: 14px;
  color: white;
  text-decoration: none;
  border-bottom: 1px solid rgba(255,255,255,0.2);
}

.menu a:hover {
  background: rgba(255,255,255,0.1);
}

.menu.show {
  display: flex;
}

.container {
  padding: 20px;
}

h2 {
  text-align: center;
  margin-bottom: 20px;
}

.resumo-item {
  margin-bottom: 22px;
}

.resumo-item strong {
  display: flex;
  justify-content: space-between;
  margin-bottom: 6px;
  font-size: 15px;
}

.barra {
  height: 16px;
  background: #e5e7eb;
  border-radius: 10px;
  overflow: hidden;
}

.barra span {
  display: block;
  height: 100%;
  width: 0%;
  transition: width 0.3s ease;
}

/* CORES DO FAROL */
.barra.verde span {
  background: #22c55e;
}

.barra.amarela span {
  background: #facc15;
}

.barra.vermelha span {
  background: #ef4444;
}

