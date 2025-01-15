import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import AppBillboard from './AppBillboard'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <AppBillboard />
  </StrictMode>,
)
