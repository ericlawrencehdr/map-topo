import { useMap } from "react-map-gl";

export default function MapElevation() {
  const {current: map} = useMap();

  const onClick = () => {
    // map.flyTo({center: [-122.4, 37.8]});
    console.log('mappppp', map)
  };


  return (
    <>
      <button onClick={onClick}>Go</button>;
      
    </>
  )
}