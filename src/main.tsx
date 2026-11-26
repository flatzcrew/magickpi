import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
// Токены ДС — до рендера: примитивы -> семантика (Theme Light/Dark) -> типографика
import './tokens/primitives.css'
import './tokens/semantics.css'
import './tokens/typography.css'
import './base.css'
import App from './App.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
