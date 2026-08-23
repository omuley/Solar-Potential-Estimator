import { useState, useEffect, useRef } from 'react';

export default function AddressSearch({ onSelect, className }) {
    const [query, setQuery] = useState('');
    const [suggestions, setSuggestions] = useState([]);
    const [isOpen, setIsOpen] = useState(false);  // for dropdown
    const [error, setError] = useState(null);
    const searchBoxRef = useRef(null);
    const sessionTokenRef = useRef(null);

    // init Google Places Autocomplete session token
    useEffect(() => {
        if (!window.google?.maps?.places) {
            setError('Google Maps Places API not loaded');
            return;
        }
        sessionTokenRef.current = new window.google.maps.places.AutocompleteSessionToken();
    }, []);

    // clicking outside box will close suggestions
    useEffect(() => {
        function handleClickOutside(e) {
        if (searchBoxRef.current && !searchBoxRef.current.contains(e.target)) {
            setIsOpen(false);
        }
        }
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    // fetch predictions when *query changes* (with a basic debounce)
    useEffect(() => {
        // empty search, no suggestions
        if (!query.trim()) {
            setSuggestions([]);
            return;
        }

        const debounce= setTimeout(async () => {
            if (!window.google?.maps?.places) return;

            try {
                const { AutocompleteSuggestion } = await window.google.maps.importLibrary("places");
                
                // request autocomplete for current query (after 350ms)
                const { suggestions: results } = await AutocompleteSuggestion.fetchAutocompleteSuggestions({
                    input: query,
                    sessionToken: sessionTokenRef.current,
                });
                // save suggestions, open dropdown
                setSuggestions(results || []);
                setIsOpen(true);
            } catch (err) {
                console.error('Error fetching suggestions:', err);
            }
        }, 350);

        // if a change is made before 350s, restart timer
        return () => clearTimeout(debounce);
    }, [query]);  


    const handleSelect = async (suggestion) => {
        const fullAddress = suggestion.placePrediction.text.text;
        setQuery('');   // clear query, so input bar stays empty
        setIsOpen(false);

        try {
            const { Place } = await window.google.maps.importLibrary("places");

            // create place obj for selected loc
            const place = suggestion.placePrediction.toPlace()
            
            // request fields
            await place.fetchFields({
                fields: ['location']
            });
            
            if (place.location) {
                // send parent component address and corrdinates 
                onSelect({
                    address: fullAddress,
                    lat: place.location.lat(),
                    lng: place.location.lng()
                });
            }
            
            // refresh session token for the next unique search string sequence
            sessionTokenRef.current = new window.google.maps.places.AutocompleteSessionToken();
        } catch (err) {
            console.error('Error fetching place details:', err);
        }
    };

    return (
        <div ref={searchBoxRef} className="relative flex-1">
            <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Enter an address"
                className={className}
            />
            {/* display suggestions in a dropdown list */}
            {isOpen && suggestions.length > 0 && (
                <ul className="absolute z-50 w-full mt-1 bg-white border border-gray-200 rounded-md shadow-lg max-h-60 overflow-y-auto">
                    {suggestions.map((suggestion) => (
                        <li
                            key={suggestion.placePrediction.placeId}
                            onClick={() => handleSelect(suggestion)}
                            className="px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 cursor-pointer transition-colors"
                        >
                            {suggestion.placePrediction.text.text}
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
}