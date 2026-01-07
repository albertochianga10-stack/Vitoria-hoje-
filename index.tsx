import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

const initializeApp = () => {
  const rootElement = document.getElementById('root');
  
  if (!rootElement) {
    console.error("Erro Fatal: Elemento #root não encontrado no DOM.");
    return;
  }

  try {
    const root = ReactDOM.createRoot(rootElement);
    root.render(
      <React.StrictMode>
        <App />
      </React.StrictMode>
    );
    console.log("CustomBet 14 inicializado com sucesso.");
  } catch (error) {
    console.error("Falha na renderização do React:", error);
    rootElement.innerHTML = `
      <div style="background:#0f172a; color:white; height:100vh; display:flex; flex-direction:column; align-items:center; justify-content:center; font-family:sans-serif; text-align:center; padding:20px;">
        <h1 style="color:#ef4444; margin-bottom:10px;">Erro de Carregamento</h1>
        <p style="color:#94a3b8; max-width:400px;">Houve um problema técnico ao iniciar o aplicativo. Isso pode ser causado por extensões do navegador ou uma versão antiga do browser.</p>
        <button onclick="window.location.reload()" style="margin-top:20px; background:#10b981; color:white; border:none; padding:12px 24px; border-radius:8px; cursor:pointer; font-weight:bold;">
          Recarregar Aplicação
        </button>
      </div>
    `;
  }
};

// Garantir que a inicialização ocorra após o carregamento do DOM
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initializeApp);
} else {
  initializeApp();
}
