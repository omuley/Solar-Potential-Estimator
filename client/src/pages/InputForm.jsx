import { useState } from 'react';
import AddressSearch from '../components/AddressSearch';
import BackgroundMap from '../components/BackgroundMap';

export default function InputForm() {
    const [addressData, setAddressData] = useState(null);
    const [monthlyEBill, setEBill] = useState('');
    const [monthlykWh, setkWhUsage] = useState('');
    const [submitting, setSubmitting] = useState(false);

    const isValidNumber = (val) => {
    return val !== '' && !isNaN(val) && Number(val) > 0;
    };

    const isFormValid =
    addressData !== null &&
    isValidNumber(monthlyEBill) &&
    isValidNumber(monthlykWh);
    
    const handleSubmit = async (e) => {
        e.preventDefault(); // don't reload page
        if (!isFormValid) return;

        setSubmitting(true);
        try {
            // send data to backend
            const res = await fetch('/api/fetchSolarEstimate', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                ...addressData, // { address, lat, lng }
                monthlyElectricityBill: Number(monthlyEBill),
                monthlyEnergyUsageKwh: Number(monthlykWh),
                }),
            });
            // handle response 
            const result = await res.json();
            console.log(result);
        
            // TODO: route to results page
        } catch (err) {
            console.error(err);
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div style={{ position: 'relative', width: '100vw', height: '100vh'}}>
            <BackgroundMap center={addressData ? [addressData.lat, addressData.lng] : undefined} />
            <div style={{ position: 'relative', zIndex: 1, padding: '20px', maxWidth: '400px', backgroundColor: 'rgba(255, 255, 255, 0.9)', borderRadius: '8px', margin: '20px' }}>
                <form onSubmit={handleSubmit}>
                    <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                        <label htmlFor="address">Address</label>
                        <AddressSearch onSelect={setAddressData} />
                    </div>

                    {addressData && (
                        <p>
                        {addressData.address} ({addressData.lat.toFixed(5)}, {addressData.lng.toFixed(5)})
                        </p>
                    )}
                    
                    <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
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
                    <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
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

                    <button type="submit" disabled={!isFormValid || submitting}>
                        {submitting ? 'Submitting…' : 'Getting Solar Data'}
                    </button>
                </form>
            </div>
        </div>
        
    );
}