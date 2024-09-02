import React, { useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { Icon } from 'leaflet';
import './style.css';  // Assuming you have this CSS file for additional styles

// Custom flower icon (generic placeholder)
const flowerIcon = new Icon({
  iconUrl: '/api/placeholder/32/32',
  iconSize: [32, 32],
  iconAnchor: [16, 32],
  popupAnchor: [0, -32],
});

// Sample data for native flowers by region, updated with emojis and more details
const flowerData = [
  {
    region: 'North America',
    lat: 40,
    lon: -100,
    flower: '🌻',
    biologicalName: 'Rudbeckia hirta',
    type: 'Perennial',
    details: 'Black-Eyed Susan: Native to North America, with yellow petals and a dark center.'
  },
  {
    region: 'South America',
    lat: -15,
    lon: -60,
    flower: '🌺',
    biologicalName: 'Passiflora',
    type: 'Perennial Vine',
    details: 'Passion Flower: Found in South America, known for its unique and complex structure.'
  },
  {
    region: 'Europe',
    lat: 50,
    lon: 10,
    flower: '🌹',
    biologicalName: 'Papaver rhoeas',
    type: 'Annual',
    details: 'Common Poppy: Bright red petals, widely distributed across Europe.'
  },
  {
    region: 'Africa',
    lat: 0,
    lon: 20,
    flower: '🌼',
    biologicalName: 'Strelitzia reginae',
    type: 'Perennial',
    details: 'Bird of Paradise: Vibrant colors, native to South Africa.'
  },
  {
    region: 'Asia',
    lat: 35,
    lon: 105,
    flower: '🌸',
    biologicalName: 'Prunus serrulata',
    type: 'Deciduous',
    details: 'Cherry Blossom: Iconic in Japan, with delicate pink flowers.'
  },
  {
    region: 'Australia',
    lat: -25,
    lon: 135,
    flower: '🌿',
    biologicalName: 'Acacia pycnantha',
    type: 'Shrub or Small Tree',
    details: 'Golden Wattle: Australia\'s national floral emblem, with bright yellow flower heads.'
  },
  {
    region: 'Antarctica',
    lat: -75,
    lon: 0,
    flower: '❄️',
    biologicalName: 'Deschampsia antarctica',
    type: 'Perennial Grass',
    details: 'Antarctic Hair Grass: One of the only two flowering plants native to Antarctica.'
  },
];

const GlobalNativeFlowersMap = () => {
  const [activeFlower, setActiveFlower] = useState(null);

  return (
    <div className="h-[600px] w-full">
      <MapContainer center={[20, 0]} zoom={2} style={{ height: '100%', width: '100%' }}>
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />
        {flowerData.map((flower, index) => (
          <Marker
            key={index}
            position={[flower.lat, flower.lon]}
            icon={flowerIcon}
            eventHandlers={{
              click: () => {
                setActiveFlower(flower);
              },
            }}
          >
            <Popup>
              <div className="flower-popup">
                <h3 className="font-bold text-lg flower-emoji">{flower.flower}</h3>
                <p className="text-sm"><strong>{flower.biologicalName}</strong></p>
                <p className="text-sm"><strong>Type:</strong> {flower.type}</p>
                <p className="text-sm">{flower.details}</p>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
      {activeFlower && (
        <div className="mt-4 p-4 bg-white rounded shadow animate-bounce transition duration-300">
          <h2 className="text-2xl font-bold mb-2">{activeFlower.flower}</h2>
          <p className="text-lg mb-2"><strong>Region:</strong> {activeFlower.region}</p>
          <p className="text-lg mb-2"><strong>Biological Name:</strong> {activeFlower.biologicalName}</p>
          <p className="text-lg mb-2"><strong>Type:</strong> {activeFlower.type}</p>
          <p className="text-sm">{activeFlower.details}</p>
        </div>
      )}
    </div>
  );
};

export default GlobalNativeFlowersMap;