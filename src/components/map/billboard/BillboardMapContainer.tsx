import React, { useState, useEffect } from 'react';
import ReactMapGL, { Marker } from 'react-map-gl';
import Map, { Source, Layer, useMap } from 'react-map-gl';

// Set your Mapbox access token
const MAPBOX_TOKEN = import.meta.env.VITE_MAPBOX_TOKEN ?? ''

const App = () => {
  const [viewport, setViewport] = useState({
    width: '100%',
    height: '100vh',
    latitude: 40,
    longitude: -74.5,
    zoom: 12,
    pitch: 45, // Tilt for 3D terrain
    bearing: -17.6
  });

  const [floatingMapPosition, setFloatingMapPosition] = useState({
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
  });

  useEffect(() => {
    const updateFloatingMapPosition = () => {
      setFloatingMapPosition({
        top: `${window.innerHeight / 2 - 100}px`,
        left: `${window.innerWidth / 2 - 150}px`,
        transform: `translate(-50%, -50%) rotate(${viewport.bearing}deg)`,
      });
    };

    updateFloatingMapPosition();

    window.addEventListener('resize', updateFloatingMapPosition);

    return () => {
      window.removeEventListener('resize', updateFloatingMapPosition);
    };
  }, [viewport]);

  return (
    <div>
      {/* React Map */}
      {/* <ReactMapGL
        {...viewport}
        mapboxApiAccessToken={MAPBOX_TOKEN}
        onViewportChange={(nextViewport) => setViewport(nextViewport)}
        mapStyle="mapbox://styles/mapbox/streets-v11"
        style={{ position: 'absolute', width: '100%', height: '100%' }}
      ></ReactMapGL> */}
      

      {/* Floating map container */}
      <div
        style={{
          position: 'absolute',
          ...floatingMapPosition,
          width: '300px',
          height: '200px',
          background: `url('https://api.mapbox.com/styles/v1/mapbox/streets-v11/static/${viewport.longitude},${viewport.latitude},${viewport.zoom},${viewport.pitch},${viewport.bearing}/500x300?access_token=${MAPBOX_TOKEN}')`,
          backgroundSize: 'cover',
          transition: 'transform 1s ease-out',
        }}
      />
    </div>
  );
};

export default App;
