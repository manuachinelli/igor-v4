.dashboard-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  color: white;
  padding: 2rem;
}

.dashboard-stats {
  display: flex;
  gap: 2rem;
  margin-bottom: 2rem;
}

.circle {
  background: #222;
  border-radius: 50%;
  width: 100px;
  height: 100px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}

.value {
  font-size: 1.5rem;
  font-weight: bold;
}

.value.error {
  color: red;
}

.label {
  text-align: center;
  font-size: 0.9rem;
  margin-top: 0.2rem;
}

.dashboard-progress {
  width: 80%;
  max-width: 600px;
}

.progress-bar {
  background: #444;
  border-radius: 10px;
  height: 20px;
  margin-top: 0.5rem;
  overflow: hidden;
}

.progress-fill {
  background: limegreen;
  height: 100%;
  transition: width 0.3s ease-in-out;
}
