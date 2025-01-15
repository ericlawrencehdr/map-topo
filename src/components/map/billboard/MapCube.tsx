// MapCube.jsx
import { useEffect, useRef, useState } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import Map from 'react-map-gl'
import * as THREE from 'three'

// Component to render the Mapbox map to a canvas and use it as a texture
const MapTexture = ({ onTextureReady }) => {
  const mapRef = useRef()
  const [mapLoaded, setMapLoaded] = useState(false)
  
  useEffect(() => {
    if (mapLoaded && mapRef.current) {
      // Get the canvas element from the map
      const canvas = mapRef.current.getCanvas()
      
      // Create a new texture from the canvas
      const texture = new THREE.CanvasTexture(canvas)
      texture.needsUpdate = true
      
      onTextureReady(texture)
    }
  }, [mapLoaded])

  return (
    <div style={{ position: 'absolute', visibility: 'hidden', width: '512px', height: '512px' }}>
      <Map
        ref={mapRef}
        initialViewState={{
          longitude: -100,
          latitude: 40,
          zoom: 3.5
        }}
        style={{ width: '512px', height: '512px' }}
        mapStyle="mapbox://styles/mapbox/streets-v12"
        mapboxAccessToken={import.meta.env.VITE_MAPBOX_TOKEN}
        onLoad={() => setMapLoaded(true)}
      />
    </div>
  )
}

// The cube that will display the map texture
const Cube = ({ mapTexture }) => {
  const meshRef = useRef()
  
  useFrame(() => {
    if (meshRef.current) {
      meshRef.current.rotation.y += 0.005
    }
  })

  return (
    <mesh ref={meshRef}>
      <boxGeometry args={[2, 2, 2]} />
      <meshStandardMaterial attach="material-0" color="white" />
      <meshStandardMaterial attach="material-1" color="white" />
      {/* Apply map texture to top face */}
      <meshStandardMaterial 
        attach="material-2" 
        map={mapTexture} 
        transparent={true}
      />
      <meshStandardMaterial attach="material-3" color="white" />
      <meshStandardMaterial attach="material-4" color="white" />
      <meshStandardMaterial attach="material-5" color="white" />
    </mesh>
  )
}

// Main component
const MapCube = () => {
  const [mapTexture, setMapTexture] = useState(null)

  return (
    <div style={{ width: '100vw', height: '100vh' }}>
      <MapTexture onTextureReady={setMapTexture} />
      <Canvas camera={{ position: [0, 5, 5] }}>
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} />
        {mapTexture && <Cube mapTexture={mapTexture} />}
      </Canvas>
    </div>
  )
}

export default MapCube