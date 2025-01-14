import Map, { Source, Layer } from 'react-map-gl';
import type { FillLayer } from 'react-map-gl';
import type {SkyLayer} from 'react-map-gl';

import styles from '../../styles/maps.module.scss'
import 'mapbox-gl/dist/mapbox-gl.css';

const mapboxToken = import.meta.env.VITE_MAPBOX_TOKEN

const skyLayer: SkyLayer = {
  id: 'sky',
  type: 'sky',
  paint: {
    'sky-type': 'atmosphere',
    'sky-atmosphere-sun': [0.0, 0.0],
    'sky-atmosphere-sun-intensity': 15
  }
};

const parkLayer: FillLayer = {
  id: 'landuse_park',
  type: 'fill',
  source: 'mapbox',
  'source-layer': 'landuse',
  filter: ['==', 'class', 'park'],
  paint: {
    'fill-color': '#d40677'
  }
};

export default function MapContainer() {
  if (!mapboxToken) return <div>Error: Missing Mapbox Token</div>

  return (
    <div className={`map-container ${styles.MapboxContainer}`}>
      <Map
        mapboxAccessToken={mapboxToken}
        initialViewState={{
          // longitude: -122.4,
          // latitude: 37.8,
          // zoom: 14
          longitude: -122.4,
          latitude: 37.8,
          zoom: 14,
          bearing: 80,
          pitch: 80
        }}
        maxPitch={85}

        style={{
          // width: '100%', 
          // height: '100%'
        }}
        mapStyle="mapbox://styles/mapbox/satellite-v9"
        // mapStyle="mapbox://styles/mapbox/streets-v9"
        terrain={{source: 'mapbox-dem', exaggeration: 1.5}}
      >
        <Source
          id="mapbox-dem"
          type="raster-dem"
          url="mapbox://mapbox.mapbox-terrain-dem-v1"
          tileSize={512}
          maxzoom={14}
        />
        <Layer {...skyLayer} />
        <Layer 
          {...parkLayer}
        />
      </Map>
    </div>
  )
}