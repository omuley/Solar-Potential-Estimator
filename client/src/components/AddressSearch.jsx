// npm install use-places-autocomplete

import { useEffect, useRef } from 'react';
import usePlacesAutocomplete, {
  getGeocode,
  getLatLng,
} from 'use-places-autocomplete';

export default function AddressSearch({ onSelect }) {
    const {
        ready,  // api is ready to use
        value,
        suggestions: { status, data }, 
        setValue,   // set input value
        clearSuggestions,
    } = usePlacesAutocomplete({ 
        debounce: 350,
        callbackName: "initMap"
    });

    const searchBoxRef = useRef(null);

    // clicking outside box will close suggestions
    useEffect(() => {
        function handleClickOutside(e) {
        if (searchBoxRef.current && !searchBoxRef.current.contains(e.target)) {
            clearSuggestions();
        }
        }
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [clearSuggestions]);

    
    const handleSelect = async (description) => {
        setValue(description, false);
        clearSuggestions();

        try {
        const results = await getGeocode({ address: description });
        const { lat, lng } = await getLatLng(results[0]);
        onSelect({ address: description, lat, lng }); // send info to parent component
        } catch (err) {
        console.error('Geocode error:', err);
        }
    };

    return (
        <div ref={searchBoxRef} style={{ position: 'relative' }}>
        <input
            value={value}
            onChange={(e) => setValue(e.target.value)}
            disabled={!ready}
            placeholder="Enter an address"
            className="address-input"
        />
        {/* display suggestions in a dropdown list */}
        {status === 'OK' && (
            <ul className="suggestions-list">
            {data.map(({ place_id, description }) => (
                <li key={place_id} onClick={() => handleSelect(description)}>
                {description}
                </li>
            ))}
            </ul>
        )}
        </div>
    );
}