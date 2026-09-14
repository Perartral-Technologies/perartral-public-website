import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App'
import { DefencePage } from './pages/DefencePage'
import './index.css'

/**
 * The defence concept note is an unlisted route: it is not linked from the
 * public landing page and is marked noindex (see pages/DefencePage.tsx and
 * public/robots.txt). Two paths resolve to it so the page works whether the
 * host applies an SPA rewrite (/defence) or not (?doc=defence).
 */
const path = window.location.pathname.replace(/\/+$/, '')
const query = new URLSearchParams(window.location.search)
const isDefence = path === '/defence' || query.get('doc') === 'defence'

createRoot(document.getElementById('root')!).render(
  <StrictMode>{isDefence ? <DefencePage /> : <App />}</StrictMode>,
)
