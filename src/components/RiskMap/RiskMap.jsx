import React from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import markerIcon from 'leaflet/dist/images/marker-icon.png'; // Import de l'icône
import './RiskMap.css'; // Import du fichier CSS

const RiskMap = () => {
    // Définir les zones à risque avec des coordonnées et des informations
    const riskZones = [
        { lat: 46.34806776030092, lng: -72.57637493364324, title: 'Zone à Risque 1', description: 'Pollution élevée en intérieur' },
        { lat: 46.349326516494244, lng: -72.5750794836879, title: 'Zone à Risque 2', description: 'Pollution élevée en extérieur' }
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
                        <Marker
                            key={index}
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
                    ))}
                </MapContainer>
            </div>
        </div>
    );
    
};

export default RiskMap;
