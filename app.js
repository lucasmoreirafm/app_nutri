body {
  font-family: Inter, Arial, sans-serif;
  background: #eef2f5;
  margin: 0;
}

.center-screen {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
}

.nav {
  background: #111827;
  padding: 10px;
}

.hamburger {
  background: none;
  border: none;
  color: white;
  font-size: 22px;
}

.menu {
  display: none;
  flex-direction: column;
}

.menu.show {
  display: flex;
}

.menu a {
  color: white;
  text-decoration: none;
  padding: 8px 0;
}

.card {
  background: white;
  margin: 15px;
  padding: 20px;
  border-radius: 14px;
}

button {
  width: 100%;
  padding: 14px;
  background: #3b82f6;
  color: white;
  border: none;
  border-radius: 10px;
}

.progress-bar {
  background: #e5e7eb;
  height: 10px;
  border-radius: 6px;
  overflow: hidden;
  margin-bottom: 12px;
}

.progress-bar div {
  height: 100%;
  width: 0%;
  transition: 0.3s;
}

.pb-ok { background: #22c55e; }
.pb-alerta { background: #facc15; }
.pb-excedeu { background: #ef4444; }
