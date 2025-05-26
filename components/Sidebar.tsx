.chatHistoryBar {
  width: 180px;
  background-color: #111;
  color: white;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding-top: 16px;
  position: fixed;
  right: 0;
  top: 0;
  height: 100vh;
  transition: width 0.3s;
  z-index: 10;
}

.collapsed {
  width: 32px;
}

.topSection {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
}

.logo {
  width: 64px;
  height: 64px;
  object-fit: contain;
  margin-bottom: 8px;
}

.iconButton {
  background: none;
  border: none;
  color: white;
  cursor: pointer;
}

.toggleButton {
  position: absolute;
  top: 16px;
  left: -12px; /* Cambiado de right a left porque ahora está a la derecha */
  background: none;
  border: none;
  color: white;
  cursor: pointer;
}
