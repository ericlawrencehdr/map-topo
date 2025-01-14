import { useState, useCallback } from 'react'
import Map, { Source, Layer, useMap } from 'react-map-gl';
import type { FillLayer } from 'react-map-gl';
import type {SkyLayer} from 'react-map-gl';
import MapElevation from './MapElevation';
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

// Helper functions to get tile coordinates
function getTileX(lng, zoom) {
  return Math.floor((lng + 180) / 360 * Math.pow(2, zoom));
}

function getTileY(lat, zoom) {
  return Math.floor((1 - Math.log(Math.tan(lat * Math.PI / 180) + 1 / Math.cos(lat * Math.PI / 180)) / Math.PI) / 2 * Math.pow(2, zoom));
}

function getRGBElevation(r, g, b) {
  return -10000 + ((r * 256 * 256 + g * 256 + b) * 0.1);
}

const mm = async (evt) => {
  const { lngLat, target: map } = evt;
  const elevation = map.queryTerrainElevation([25,60]);
  console.log('el', elevation)
}

export default function MapContainer() {
  if (!mapboxToken) return <div>Error: Missing Mapbox Token</div>

  const {current: map} = useMap();

  const [elevation, setElevation] = useState(null);

  const onIdle = useCallback( async (evt) => {
    const { lngLat, target: map } = evt;
    const elevation = await map.queryTerrainElevation(lngLat);
    console.log('_ele_', elevation)
  }, [])

  const onMouseMoveHandler = useCallback(async (evt) => {
    const { lngLat, target: map } = evt;
    const { lng, lat } = lngLat
    const tileUrl = `https://api.mapbox.com/v4/mapbox.terrain-rgb/${map.getZoom()}/${getTileX(lng, map.getZoom())}/${getTileY(lat, map.getZoom())}@2x.pngraw?access_token=${mapboxToken}`;
        

    // Fetch the terrain tile
    const response = await fetch(tileUrl);
    const blob = await response.blob();
    
    // Create canvas to read RGB values
    const img = await createImageBitmap(blob);
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    
    canvas.width = img.width;
    canvas.height = img.height;
    ctx.drawImage(img, 0, 0);
    
    // Get pixel position within tile
    const pixelX = ((lng + 180) / 360 * Math.pow(2, map.getZoom())) % 1 * canvas.width;
    const pixelY = (1 - Math.log(Math.tan(lat * Math.PI / 180) + 1 / Math.cos(lat * Math.PI / 180)) / Math.PI) / 2 * Math.pow(2, map.getZoom()) % 1 * canvas.height;
    
    const pixel = ctx.getImageData(pixelX, pixelY, 1, 1).data;
    const elevation = getRGBElevation(pixel[0], pixel[1], pixel[2]);

    console.log('ELEVATION', elevation)
  }, [])

  const onMouseMove = useCallback(async (event) => {
    const { lngLat, target: map } = event;
    // console.log('target', map)
    // console.log('evt', event)
    // console.log('lngLat', lngLat)
    // console.log('map', map)
    
    // const elevation = await map.queryTerrainElevation(lngLat);

    const lngLatArray = [ 
    -122.40507140366098,
      37.80557994968211
    ]
    const elevation = await map.queryTerrainElevation(lngLatArray);
    
    console.log('elevation', elevation, lngLat)


    // setCursor(lngLat);

    // // Construct the Mapbox Terrain-RGB tile URL
    // // The URL pattern is: https://api.mapbox.com/v4/mapbox.terrain-rgb/{z}/{x}/{y}.pngraw?access_token=YOUR_TOKEN
    // const z = Math.floor(event.target.getZoom());
    // const x = Math.floor((lngLat.lng + 180) / 360 * Math.pow(2, z));
    // const y = Math.floor((1 - Math.log(Math.tan(lngLat.lat * Math.PI / 180) + 1 / Math.cos(lngLat.lat * Math.PI / 180)) / Math.PI) / 2 * Math.pow(2, z));

    // try {
    //   const response = await fetch(
    //     `https://api.mapbox.com/v4/mapbox.terrain-rgb/${z}/${x}/${y}.pngraw?access_token=${MAPBOX_TOKEN}`
    //   );
    //   const blob = await response.blob();
      
    //   // Create a canvas to read the RGB values
    //   const canvas = document.createElement('canvas');
    //   const ctx = canvas.getContext('2d');
    //   const img = new Image();
      
    //   img.onload = () => {
    //     canvas.width = img.width;
    //     canvas.height = img.height;
    //     ctx.drawImage(img, 0, 0);
        
    //     // Calculate the pixel position within the tile
    //     const pixelX = ((lngLat.lng + 180) / 360 * Math.pow(2, z) - x) * 256;
    //     const pixelY = ((1 - Math.log(Math.tan(lngLat.lat * Math.PI / 180) + 1 / Math.cos(lngLat.lat * Math.PI / 180)) / Math.PI) / 2 * Math.pow(2, z) - y) * 256;
        
    //     const pixel = ctx.getImageData(pixelX, pixelY, 1, 1).data;
        
    //     // Calculate elevation using Mapbox's elevation formula
    //     const elevation = -10000 + ((pixel[0] * 256 * 256 + pixel[1] * 256 + pixel[2]) * 0.1);
    //     setElevation(Math.round(elevation));
    //   };
      
    //   img.src = URL.createObjectURL(blob);
    // } catch (error) {
    //   console.error('Error fetching elevation:', error);
    // }
  }, []);


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
        // mapStyle="mapbox://styles/mapbox/satellite-v9"
        // mapStyle="mapbox://styles/mapbox/streets-v9"
        mapStyle="https://basemaps.cartocdn.com/gl/positron-gl-style/style.json"
        terrain={{source: 'mapbox-dem', exaggeration: 1}}

        // onMouseMove={onMouseMove}
        // onMouseMove={onMouseMoveHandler}
        onMouseUp={onMouseMoveHandler}
        // onMouseMove={mm}
        onIdle={onIdle}
      >
        {/* <MapElevation /> */}
        <Source
          id="mapbox-dem"
          type="raster-dem"
          url="mapbox://mapbox.terrain-rgb"
          // url="mapbox://mapbox.mapbox-terrain-dem-v1"
          tileSize={512}
          // maxzoom={14}
          maxzoom={4}
        />
        <Layer {...skyLayer} />
        {/* <Layer 
          {...parkLayer}
        /> */}
      </Map>
    </div>
  )
}