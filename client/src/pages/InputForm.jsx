import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AddressSearch from '../components/AddressSearch';
import BackgroundMap from '../components/BackgroundMap';
// import { mockEstimate } from "../mock-estimate";

export default function InputForm() {
    const [addressData, setAddressData] = useState(null);
    const [monthlyEBill, setEBill] = useState('');
    const [monthlykWh, setkWhUsage] = useState('');
    const [submitting, setSubmitting] = useState(false);
    const [attempted, setAttempted] = useState(false); // validation msg only shows after a submit attempt
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
        setAttempted(true);
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
    // const handleTestResults = () => {
    //     sessionStorage.setItem('solarEstimate', JSON.stringify(mockEstimate));
    //     navigate('/results');
    // };
    const inputClasses =
        "w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-900 " +
        "placeholder:text-slate-400 shadow-sm transition-colors " +
        "focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500";

    return (
        <div className="w-screen h-screen fixed inset-0">
            <BackgroundMap center={addressData ? [addressData.lat, addressData.lng] : undefined} />
            
            <div className="relative z-10 flex h-full w-full items-center justify-center p-5">
                <div className="w-full max-w-md rounded-2xl border border-white/60 bg-white/95 p-6 shadow-xl backdrop-blur-sm">
                    <h2 className="mb-1 text-lg font-semibold text-slate-900">Get Your Solar Estimate</h2>
                    <p className="mb-5 text-sm text-slate-500">
                        Tell us a bit about your home and energy use.
                    </p>
    
                    <form onSubmit={handleSubmit} noValidate>
                        <div className="flex flex-col gap-1.5">
                            <label htmlFor="address" className="mt-3 text-sm font-medium text-slate-700">
                                Address *
                            </label>
    
                            {/* show search bar if no address has been selected yet */}
                            {!addressData ? (
                                <AddressSearch onSelect={setAddressData} className={inputClasses} />
                            ) : (
                                // address exists, display card
                                <div className="flex items-start justify-between gap-3 bg-slate-50 border border-slate-200 p-3 rounded-lg shadow-sm animate-fadeIn">
                                    <div className="flex gap-2">
                                        <p className="text-sm font-medium text-gray-800 leading-relaxed wrap-break-word">
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
    
                        <div className="mt-4 mb-3 grid grid-cols-2 gap-3">
                            <div className="flex flex-col gap-1.5">
                                <label htmlFor="electricityBill" className="text-sm font-medium text-slate-700">
                                    Monthly Bill ($) *
                                </label>
                                <input
                                    id="electricityBill"
                                    type="number"
                                    min="0"
                                    step="0.01"
                                    inputMode="decimal"
                                    value={monthlyEBill}
                                    onChange={(e) => setEBill(e.target.value)}
                                    placeholder="150"
                                    className={inputClasses}
                                    aria-invalid={attempted && !isValidNumber(monthlyEBill)}
                                />
                            </div>
                            <div className="flex flex-col gap-1.5">
                                <label htmlFor="energyUsage" className="text-sm font-medium text-slate-700">
                                    Usage (kWh) *
                                </label>
                                <input
                                    id="energyUsage"
                                    type="number"
                                    min="0"
                                    step="1"
                                    inputMode="numeric"
                                    value={monthlykWh}
                                    onChange={(e) => setkWhUsage(e.target.value)}
                                    placeholder="900"
                                    className={inputClasses}
                                    aria-invalid={attempted && !isValidNumber(monthlykWh)}
                                />
                            </div>
                        </div>
    
                        {/* only nag the user after they've tried to submit */}
                        {attempted && !isFormValid() && (
                            <p className="mt-3 mb-3 text-sm text-red-600" role="alert">
                                Please complete all required fields before submitting.
                            </p>
                        )}
    
                        <button
                            type="submit"
                            disabled={submitting}
                            className="mt-2 w-full rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white
                                    shadow-sm transition-colors hover:bg-blue-700 disabled:cursor-not-allowed
                                    disabled:bg-slate-300 disabled:text-slate-500"
                        >
                            {submitting ? 'Getting your estimate…' : 'Get Solar Data'}
                        </button>
                    </form>
                </div>
            </div>

            
        </div>
        
    );
}