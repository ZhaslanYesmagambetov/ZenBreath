import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'
// 👇 Главное изменение: Импортируем HashRouter
import { HashRouter } from 'react-router-dom'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    {/* 👇 Оборачиваем всё приложение в HashRouter */}
    <HashRouter>
      <App />
    </HashRouter>
  </React.StrictMode>,
)