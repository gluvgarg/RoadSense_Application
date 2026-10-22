import React, { useState, useEffect, useRef, useCallback } from 'react';
import { MapPin, X, Loader2 } from 'lucide-react';

export function LocationSearchInput({
  label,
  placeholder,
  value, // { name: string, coordinates: [lng, lat] } | null
  onSelectLocation,
  onClear,
  mapboxToken,
  badgeText,
  badgeColorClass = 'text-[#1E6091] bg-[#1E6091]/10 border-[#1E6091]/30'
}) {
  const [inputText, setInputText] = useState(value?.name || '');
  const [prevValue, setPrevValue] = useState(value);
  const [suggestions, setSuggestions] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);
  const [searchError, setSearchError] = useState(null);

  // Sync input text when external selected value changes
  if (value !== prevValue) {
    setPrevValue(value);
    setInputText(value?.name || '');
  }

  const containerRef = useRef(null);
  const inputRef = useRef(null);
  const abortControllerRef = useRef(null);
  const debounceTimerRef = useRef(null);

  // Click outside listener to dismiss dropdown
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setIsOpen(false);
        setActiveIndex(-1);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Fetch suggestions from Mapbox Geocoding API with India filter & Delhi NCR proximity bias
  const fetchSuggestions = useCallback(
    async (query) => {
      if (!mapboxToken || !query.trim() || query.trim().length < 2) {
        setSuggestions([]);
        setIsLoading(false);
        return;
      }

      // Abort preceding in-flight request
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
      abortControllerRef.current = new AbortController();

      setIsLoading(true);
      setSearchError(null);

      try {
        const encoded = encodeURIComponent(query.trim());
        const endpoint = `https://api.mapbox.com/geocoding/v5/mapbox.places/${encoded}.json?access_token=${mapboxToken}&country=IN&proximity=77.2168,28.5350&limit=5&types=poi,address,neighborhood,locality,place`;

        const res = await fetch(endpoint, { signal: abortControllerRef.current.signal });
        if (!res.ok) {
          throw new Error(`Geocoding HTTP error: ${res.status}`);
        }

        const data = await res.json();
        const features = data.features || [];
        setSuggestions(features);
        setIsOpen(true);
        setActiveIndex(-1);
      } catch (err) {
        if (err.name !== 'AbortError') {
          console.warn('Mapbox Geocoding search error:', err);
          setSearchError('Unable to load place suggestions');
          setSuggestions([]);
        }
      } finally {
        setIsLoading(false);
      }
    },
    [mapboxToken]
  );

  // Handle typing with 300ms debounce
  const handleInputChange = (e) => {
    const newText = e.target.value;
    setInputText(newText);

    // If text was modified after selecting, clear the verified location coordinates
    if (value && newText !== value.name) {
      onSelectLocation(null);
    }

    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }

    if (!newText.trim() || newText.trim().length < 2) {
      setSuggestions([]);
      setIsOpen(false);
      setIsLoading(false);
      return;
    }

    debounceTimerRef.current = setTimeout(() => {
      fetchSuggestions(newText);
    }, 300);
  };

  const handleSelectSuggestion = (feature) => {
    const selectedItem = {
      name: feature.place_name,
      primaryName: feature.text,
      coordinates: feature.center // [longitude, latitude]
    };

    setInputText(feature.place_name);
    setSuggestions([]);
    setIsOpen(false);
    setActiveIndex(-1);
    onSelectLocation(selectedItem);
  };

  const handleClear = () => {
    setInputText('');
    setSuggestions([]);
    setIsOpen(false);
    setActiveIndex(-1);
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    onClear();
    inputRef.current?.focus();
  };

  // Keyboard navigation for suggestions
  const handleKeyDown = (e) => {
    if (!isOpen || suggestions.length === 0) {
      if (e.key === 'ArrowDown' && suggestions.length > 0) {
        setIsOpen(true);
      }
      return;
    }

    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setActiveIndex((prev) => (prev < suggestions.length - 1 ? prev + 1 : 0));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setActiveIndex((prev) => (prev > 0 ? prev - 1 : suggestions.length - 1));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (activeIndex >= 0 && activeIndex < suggestions.length) {
        handleSelectSuggestion(suggestions[activeIndex]);
      }
    } else if (e.key === 'Escape') {
      e.preventDefault();
      setIsOpen(false);
      setActiveIndex(-1);
    }
  };

  const isLocationVerified = Boolean(value?.coordinates);

  return (
    <div ref={containerRef} className="relative space-y-1">
      {/* Field Label Header */}
      <div className="flex items-center justify-between text-[11px]">
        <label htmlFor={`loc-input-${label}`} className="font-semibold text-[#141E28]">
          {label}
        </label>
        {badgeText && (
          <span className={`px-1.5 py-0.2 rounded-xs font-mono text-[10px] border ${badgeColorClass}`}>
            {badgeText}
          </span>
        )}
      </div>

      {/* Input Field Container */}
      <div className="relative flex items-center">
        <MapPin
          className={`w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 shrink-0 ${
            isLocationVerified ? 'text-[#1E6091]' : 'text-[#717886]'
          }`}
        />

        <input
          id={`loc-input-${label}`}
          ref={inputRef}
          type="text"
          value={inputText}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          onFocus={() => {
            if (suggestions.length > 0 && !isLocationVerified) {
              setIsOpen(true);
            }
          }}
          placeholder={placeholder}
          autoComplete="off"
          role="combobox"
          aria-expanded={isOpen}
          aria-autocomplete="list"
          className={`w-full pl-8 pr-8 py-1.5 bg-white border rounded-xs text-xs text-[#141E28] placeholder-[#717886] focus:outline-none focus:ring-1 focus:ring-[#141E28] transition-colors ${
            isLocationVerified
              ? 'border-[#1E6091] bg-[#F0F7FA]/30'
              : 'border-[#DCD9CD]'
          }`}
        />

        {/* Loading Spinner or Clear Button */}
        <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center">
          {isLoading ? (
            <Loader2 className="w-3.5 h-3.5 text-[#1E6091] animate-spin" />
          ) : (
            inputText && (
              <button
                type="button"
                onClick={handleClear}
                className="p-0.5 rounded text-[#717886] hover:text-[#141E28] transition-colors cursor-pointer"
                aria-label={`Clear ${label}`}
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )
          )}
        </div>
      </div>

      {/* Suggestions Dropdown */}
      {isOpen && (
        <div className="absolute left-0 right-0 top-full mt-1 z-30 bg-[#F6F5EE] border border-[#DCD9CD] shadow-lg rounded-xs overflow-hidden text-xs max-h-60 overflow-y-auto">
          {suggestions.length > 0 ? (
            <ul role="listbox" className="divide-y divide-[#DCD9CD]/60">
              {suggestions.map((feature, idx) => {
                const isActive = idx === activeIndex;
                const primaryText = feature.text || feature.place_name.split(',')[0];
                const contextText = feature.place_name.replace(primaryText, '').replace(/^,\s*/, '');

                return (
                  <li
                    key={feature.id || idx}
                    role="option"
                    aria-selected={isActive}
                    onClick={() => handleSelectSuggestion(feature)}
                    onMouseEnter={() => setActiveIndex(idx)}
                    className={`px-3 py-2 cursor-pointer transition-colors ${
                      isActive ? 'bg-[#EAE8DD]' : 'hover:bg-[#EAE8DD]/50'
                    }`}
                  >
                    <div className="font-semibold text-xs text-[#141E28] leading-tight">
                      {primaryText}
                    </div>
                    {contextText && (
                      <div className="text-[10px] text-[#717886] mt-0.5 truncate font-sans">
                        {contextText}
                      </div>
                    )}
                  </li>
                );
              })}
            </ul>
          ) : !isLoading && inputText.trim().length >= 2 ? (
            <div className="px-3 py-2.5 text-[11px] text-[#717886] text-center italic">
              {searchError || 'No locations found in India'}
            </div>
          ) : null}
        </div>
      )}
    </div>
  );
}
