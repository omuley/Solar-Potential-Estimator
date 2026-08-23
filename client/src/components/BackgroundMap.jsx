import { MapContainer, TileLayer } from 'react-leaflet'

export default function BackgroundMap({ center = [41.8781, -87.6298], zoom = 10 }) {
    return (
        <MapContainer
            center={center} // default is Chicago, IL
            zoom={zoom}
            zoomControl={true}
            dragging={true}
            scrollWheelZoom={false}
            doubleClickZoom={false}
            style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', zIndex: 0 }}
        >

        {/* display map tiles */}
        <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution="&copy; OpenStreetMap contributors"
        />
        </MapContainer>
    )
}