import React from 'react';
import { MapContainer, TileLayer, Marker, Popup, Circle } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import markerIcon from 'leaflet/dist/images/marker-icon.png'; // Import de l'icône
import './RiskMap.css'; // Import du fichier CSS

const RiskMap = () => {
  // Définir les zones à risque avec des coordonnées, des informations et une couleur pour le cercle
  const riskZones = [
    {
      lat: 46.34806776030092,
      lng: -72.57637493364324,
      title: 'Zone à Risque 1',
      description: 'Pollution élevée en intérieur',
      color: 'red'  // Couleur indiquant une qualité d'air très dégradée
    },
    {
      lat: 46.349326516494244,
      lng: -72.5750794836879,
      title: 'Zone à Risque 2',
      description: 'Pollution élevée en extérieur',
      color: 'orange'  // Couleur indiquant une qualité d'air dégradée
    }
  ];

  return (
    <div className="map-container">
      <div className="inner-map">
        <MapContainer
          center={[46.349326516494244, -72.5750794836879]}
          zoom={17}
          style={{ width: '100%', height: '100%' }}
          scrollWheelZoom={false}
        >
          <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
          {riskZones.map((zone, index) => (
            <React.Fragment key={index}>
              <Marker
                position={[zone.lat, zone.lng]}
                icon={new L.Icon({
                  iconUrl: markerIcon,
                  iconSize: [25, 41],
                  iconAnchor: [12, 41]
                })}
              >
                <Popup>
                  <h3>{zone.title}</h3>
                  <p>{zone.description}</p>
                </Popup>
              </Marker>
              <Circle
                center={[zone.lat, zone.lng]}
                pathOptions={{ color: zone.color, fillColor: zone.color, fillOpacity: 0.2 }}
                radius={50} // Ajustez le rayon selon vos besoins
              />
            </React.Fragment>
          ))}
        </MapContainer>
      </div>
    </div>
  );
};

export default RiskMap;
