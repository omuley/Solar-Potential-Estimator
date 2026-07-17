import { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet'
import { useNavigate } from 'react-router-dom'
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer,
} from 'recharts';
import 'leaflet/dist/leaflet.css';
// import { mockEstimate } from "./mockEstimate";

export default function ResultsPage() {
    // extract data from state passed from InputForm
    const [result, setResult] = useState(null);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const stored = sessionStorage.getItem('solarEstimate');
        if (stored) {
            setResult(JSON.parse(stored));
        }
        setLoading(false);
    }, []);

    if (loading) return <p>Loading…</p>;

    if (!result) {
        return (
            <div>
                <p>No results found. Please submit the form first.</p>
                <button onClick={() => navigate('/')}>Back to form</button>
            </div>
        );
    }

    return (
        <div style={{ display: 'flex', width: '100vw', height: '100vh' }}>
            {/* leaflet map w/ pin */}
            <div style={{ width: '50%', height: '100%' }}>
                <MapContainer 
                    center={[result.location.lat, result.location.lng]}
                    zoom={18} 
                    style={{ width: '100%', height: '100%' }}>
                <TileLayer
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    attribution="&copy; OpenStreetMap contributors"
                />
                <Marker position={[result.location.lat, result.location.lng]}>
                    <Popup>Estimated {result.panelCount} panels</Popup>
                </Marker>
                </MapContainer>
            </div>

            {/* graphs/charts */}
            <div style={{ width: '50%', height: '100%', overflowY: 'auto' }}>
                <h3>Cumulative Profit Over Time</h3>
                <ResponsiveContainer width="100%" height={400}>
                    <LineChart data={result.yearlyData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="year" label={{ value: 'Year', position: 'insideBottom', offset: -5 }} />
                        <YAxis label={{ value: 'Cumulative Profit ($)', angle: -90, position: 'insideLeft' }} />
                        <Tooltip formatter={(value) => `$${value.toLocaleString()}`} />
                        <Legend />
                        <Line
                            type="monotone"
                            dataKey="cumulativeProfit"
                            stroke="#2563eb"
                            strokeWidth={2}
                            dot={{ r: 3 }}
                            name="Cumulative Profit"
                        />
                    </LineChart>
                </ResponsiveContainer>
            </div>
        </div>
    )
}