// TerrainCube.jsx
import { useEffect, useRef, useState } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { OrbitControls } from '@react-three/drei'
import Map from 'react-map-gl'
import * as THREE from 'three'

const TerrainTexture = ({ onTextureReady }) => {
  const mapRef = useRef()
  const [mapLoaded, setMapLoaded] = useState(false)
  
  useEffect(() => {
    if (mapLoaded && mapRef.current) {
      // Create an interval to update the texture periodically
      const updateInterval = setInterval(() => {
        const canvas = mapRef.current.getCanvas()
        const texture = new THREE.CanvasTexture(canvas)
        texture.needsUpdate = true
        onTextureReady(texture)
      }, 100) // Update every 100ms while map is moving

      return () => clearInterval(updateInterval)
    }
  }, [mapLoaded])

  return (
    <div style={{ position: 'absolute', visibility: 'hidden', width: '512px', height: '512px' }}>
      <Map
        ref={mapRef}
        initialViewState={{
          longitude: -121.7603,
          latitude: 46.8523,
          zoom: 13,
          pitch: 85, // Even higher pitch to emphasize terrain
          bearing: 45, // Angled view for better terrain visibility
          altitude: 1.5 // Lower altitude to get closer to terrain
        }}
        style={{ width: '512px', height: '512px' }}
        mapStyle="mapbox://styles/mapbox/satellite-v9"
        mapboxAccessToken={import.meta.env.VITE_MAPBOX_TOKEN}
        onLoad={() => setMapLoaded(true)}
        terrain={{ source: 'mapbox-dem', exaggeration: 2.5 }}
      />
    </div>
  )
}

const TerrainCube = ({ mapTexture }) => {
  const meshRef = useRef()
  
  useFrame(() => {
    if (meshRef.current) {
      meshRef.current.rotation.y += 0.002
    }
  })

  // Create a custom geometry with more subdivisions for the top face
  const geometry = new THREE.BoxGeometry(2, 0.4, 2, 128, 128, 1) // Height reduced to 0.4 (1/5 of 2)

  return (
    <mesh ref={meshRef} geometry={geometry}>
      <meshStandardMaterial attach="material-0" color="darkgray" />
      <meshStandardMaterial attach="material-1" color="darkgray" />
      <meshStandardMaterial 
        attach="material-2"
        map={mapTexture}
        bumpMap={mapTexture}
        normalMap={mapTexture}
        displacementMap={mapTexture}
        displacementScale={0.5}
        bumpScale={0.3}
        roughness={0.8}
        metalness={0.2}
      />
      <meshStandardMaterial attach="material-3" color="darkgray" />
      <meshStandardMaterial attach="material-4" color="darkgray" />
      <meshStandardMaterial attach="material-5" color="darkgray" />
    </mesh>
  )
}

const TerrainCubeScene = () => {
  const [mapTexture, setMapTexture] = useState(null)

  return (
    <div style={{ width: '100vw', height: '100vh' }}>
      <TerrainTexture onTextureReady={setMapTexture} />
      <Canvas 
        camera={{ 
          position: [0, 1.5, 2.5], // Moved camera closer
          fov: 45, // Narrower field of view
          near: 0.1,
          far: 1000
        }}
      >
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} />
        <directionalLight position={[5, 5, 5]} intensity={1} />
        {mapTexture && <TerrainCube mapTexture={mapTexture} />}
        <OrbitControls 
          minDistance={2} 
          maxDistance={10}
          enablePan={true}
          enableZoom={true}
          enableRotate={true}
        />
      </Canvas>
    </div>
  )
}

export default TerrainCubeScene