import { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, ImageOverlay } from 'react-leaflet'
import { useNavigate } from 'react-router-dom'
import 'leaflet/dist/leaflet.css';
import {
  Group,
  Panel,
  Separator,
} from "react-resizable-panels";
import ROIChart from '../components/charts/ROIChart';
import NetProfitChart from '../components/charts/NetProfitChart';
import AnnualSavingsChart from '../components/charts/AnnualSavingsChart';
import EnergyUseChart from '../components/charts/EnergyUseChart';
import { COLORS } from '../utils/chartColors';

// charts we have
const CHART_COMPONENTS = {
      "ROI": ROIChart,
      "Net Profit": NetProfitChart,
      "Annual Savings": AnnualSavingsChart,
      "Energy Use": EnergyUseChart,
    };

export default function ResultsPage() {
    // extract data from state passed from InputForm
    const [res, setRes] = useState(null);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState('ROI');  // defaults to roi graph

    const ActiveChart = CHART_COMPONENTS[activeTab];


    useEffect(() => {
        const stored = sessionStorage.getItem('solarEstimate');
        if (stored) {
            setRes(JSON.parse(stored));
        }
        setLoading(false);
    }, []);

    if (loading) return <p>Loading…</p>;

    if (!res) {
        return (
            <div>
                <p>No results found. Please submit the form first.</p>
                <button onClick={() => navigate('/')}>Back to form</button>
            </div>
        );
    }

    return (
        <div className="w-screen h-screen fixed inset-0">
            <Group orientation="horizontal">
                <Panel id="map-panel" defaultSize="50%" minSize="25%" maxSize="75%" order={1}>
                    {/* leaflet map w/ pin */}
                    <div className="h-full w-full">
                        <MapContainer 
                            center={[res.lat, res.lng]}
                            zoom={18}
                            zoomControl={true}
                            dragging={true}
                            style={{ height: "100%", width: "100%" }}>
                            <TileLayer
                                url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
                                attribution="Tiles © Esri"
                                maxNativeZoom={19}
                                maxZoom={22}
                            />
                            {res.imageBounds && res.imageUrl && (
                                <ImageOverlay
                                    url={res.imageUrl}
                                    bounds={res.imageBounds}
                                    opacity="0.8"
                                />
                            )}
                            <Marker position={[res.lat, res.lng]}>
                                <Popup>Estimated {res.panelCount} panels</Popup>
                            </Marker>
                        </MapContainer>
                    </div>
                </Panel>

                <Separator className="w-1 bg-gray-300 hover:bg-blue-500 cursor-col-resize" />

                <Panel id="charts-panel" defaultSize="50%" minSize="25%" maxSize="75%" order={2}>
                    {/* graphs/charts */}
                    <div className="h-full w-full overflow-y-auto"
                        style={{background: COLORS.paper}}>
                        <div><h3>Analysis</h3></div>

                        {/* Tab buttons */}
                        <div className="flex gap-2 border-b border-gray-200 mb-4 px-4 pt-4">
                            {Object.keys(CHART_COMPONENTS).map((key) => (
                                <button
                                    key={key}
                                    onClick={() => setActiveTab(key)}
                                    className={`px-3 py-2 text-sm ${
                                        activeTab === key
                                            ? 'font-semibold border-b-2 border-blue-600'
                                            : 'text-gray-500'
                                    }`}
                                >
                                    {key}
                                </button>
                            ))}
                        </div>

                        {/* Chart — only ONE renders at a time */}
                        <div className="h-96 w-full px-4">
                            <ActiveChart data={res} />
                        </div>
                    </div>
                </Panel>
            </Group>
        </div>
    )
}