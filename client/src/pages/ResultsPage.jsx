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
import {
  Group,
  Panel,
  Separator,
} from "react-resizable-panels";
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
        <div class="w-screen h-screen fixed inset-0">
            <Group orientation="horizontal">
                <Panel id="map-panel" defaultSize="50%" minSize="25%" maxSize="75%" order={1}>
                    {/* leaflet map w/ pin */}
                    <div className="h-full w-full">
                        <MapContainer 
                            center={[result.location.lat, result.location.lng]}
                            zoom={18} 
                            style={{ height: "100%", width: "100%" }}>
                        <TileLayer
                            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                            attribution="&copy; OpenStreetMap contributors"
                        />
                        <Marker position={[result.location.lat, result.location.lng]}>
                            <Popup>Estimated {result.panelCount} panels</Popup>
                        </Marker>
                        </MapContainer>
                    </div>
                </Panel>

                <Separator className="w-1 bg-gray-300 hover:bg-blue-500 cursor-col-resize" />

                <Panel id="charts-panel" defaultSize="50%" minSize="25%" maxSize="75%" order={2}>
                    {/* graphs/charts */}
                    <div className="h-full w-full overflow-y-auto">
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
                </Panel>
            </Group>
        </div>
    )
}