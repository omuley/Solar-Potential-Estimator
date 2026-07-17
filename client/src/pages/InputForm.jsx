import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AddressSearch from '../components/AddressSearch';
import BackgroundMap from '../components/BackgroundMap';
import { mockEstimate } from "../mock-estimate";

export default function InputForm() {
    const [addressData, setAddressData] = useState(null);
    const [monthlyEBill, setEBill] = useState('');
    const [monthlykWh, setkWhUsage] = useState('');
    const [submitting, setSubmitting] = useState(false);
    const navigate = useNavigate();

    const isValidNumber = (val) => {
        return val !== '' && !isNaN(val) && Number(val) > 0;
    };

    const isFormValid = () => {
        return addressData !== null &&
            isValidNumber(monthlyEBill) &&
            isValidNumber(monthlykWh);  
    };
    
    const handleSubmit = async (e) => {
        e.preventDefault(); // don't reload page
        if (!isFormValid()) return;
        setSubmitting(true);

        try {
            // fetch solar estimate
            const res = await fetch('/api/fetchSolarEstimate', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                ...addressData, // { address, lat, lng }
                monthlyElectricityBill: Number(monthlyEBill),
                monthlyEnergyUsageKwh: Number(monthlykWh),
                }),
            });
            if (!res.ok) throw new Error(`HTTP request failed... status: ${res.status}`);
            
            // handle response 
            const result = await res.json();
            console.log(result);
            
            // save so ResultsPage can read it, even on refresh
            sessionStorage.setItem('solarEstimate', JSON.stringify(result));
            // route backend response to results page
            navigate('/results');
        } catch (err) {
            console.error(err);
        } finally {
            setSubmitting(false);
        }
    };

    // TEMPORARY — for testing ResultsPage without hitting the backend
    const handleTestResults = () => {
        sessionStorage.setItem('solarEstimate', JSON.stringify(mockEstimate));
        navigate('/results');
    };

    return (
        <div className="relative w-screen h-screen">
            <BackgroundMap center={addressData ? [addressData.lat, addressData.lng] : undefined} />
            
            <div style={{ position: 'relative', zIndex: 1, padding: '20px', maxWidth: '400px', backgroundColor: 'rgba(255, 255, 255, 0.9)', borderRadius: '8px', margin: '20px' }}>
                <form onSubmit={handleSubmit}>
                    <div className="flex flex-col gap-1.5">
                        <label htmlFor="address">Address</label>
                        
                        {/* show search bar if no address has been selected yet */}
                        {!addressData ? (
                            <AddressSearch onSelect={setAddressData} />
                        ) : (
                            // address exists, display card
                            <div className="flex items-start justify-between gap-3 bg-slate-50 border border-slate-200 p-3 rounded-lg shadow-sm animate-fadeIn">
                                <div className="flex gap-2">
                                    <p className="text-sm font-medium text-gray-800 leading-relaxed break-words">
                                        📍 {addressData.address}
                                    </p>
                                </div>
                                <button
                                    type="button"
                                    onClick={() => setAddressData(null)}
                                    className="text-xs font-semibold text-gray-400 hover:text-red-500 transition-colors pt-0.5"
                                >
                                    Change
                                </button>
                            </div>
                        )}
                    </div>
                    
                    <div className="flex flex-col gap-1.5">
                        <label htmlFor="electricityBill">Monthly Electricity Bill ($)</label>
                        <input
                            id="electricityBill"
                            type="number"
                            min="0"
                            step="0.01"
                            value={monthlyEBill}
                            onChange={(e) => setEBill(e.target.value)}
                            placeholder="e.g. 150"
                        />
                    </div>
                    <div className="flex flex-col gap-1.5">
                        <label htmlFor="energyUsage">Monthly Energy Usage (kWh)</label>
                        <input
                            id="energyUsage"
                            type="number"
                            min="0"
                            step="1"
                            value={monthlykWh}
                            onChange={(e) => setkWhUsage(e.target.value)}
                            placeholder="e.g. 900"
                        />
                    </div>

                    {/* TEMPORARY — remove once backend is live */}
                    <button onClick={handleTestResults}>
                        (Dev) View Mock Results
                    </button>

                    <button type="submit" disabled={!isFormValid || submitting}>
                        {submitting ? 'Submitting…' : 'Getting Solar Data'}
                    </button>
                </form>
            </div>
        </div>
        
    );
}