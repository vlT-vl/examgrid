import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import { LanguageProvider } from './uiText.jsx';
import { DataProvider } from './dataContext.jsx';
import { VoucherProvider } from './voucherContext.jsx';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <LanguageProvider>
      <DataProvider>
        <VoucherProvider>
          <App />
        </VoucherProvider>
      </DataProvider>
    </LanguageProvider>
  </React.StrictMode>
);