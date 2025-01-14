import { useState } from 'react'
import './App.scss'
import MapContainer from './components/map/MapContainer'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <div className='app-container'>
        <MapContainer />
      </div>
    </>
  )
}

export default App
