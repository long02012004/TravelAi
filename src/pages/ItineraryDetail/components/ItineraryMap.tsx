import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polyline, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import type { RoutePoint } from '../ItineraryDetail';
import styles from '../ItineraryDetail.module.scss';
import axios from 'axios';

interface Props {
  points: RoutePoint[];
  activePointId: string | null;
  onPointClick: (id: string) => void;
  isPreviewing: boolean;
  onAddSpot: (point: Omit<RoutePoint, 'id'>) => void;
}

// Custom hook to handle map side-effects like flying to markers
const MapEffectManager: React.FC<{
  points: RoutePoint[];
  activePointId: string | null;
  isPreviewing: boolean;
  tempSearchMarker?: any | null;
}> = ({ points, activePointId, isPreviewing, tempSearchMarker }) => {
  const map = useMap();

  // Fly to active point
  useEffect(() => {
    if (activePointId) {
      const point = points.find(p => p.id === activePointId);
      if (point) {
        map.flyTo([point.lat, point.lng], 15, { duration: 1.2 });
      }
    }
  }, [activePointId, map, points]);

  // Handle Preview logic
  useEffect(() => {
    let timeoutId: number | ReturnType<typeof setTimeout>;
    let isCancelled = false;

    const playPreview = async () => {
      // Loop through all points
      for (const point of points) {
        if (isCancelled) break;
        // Fly to point
        map.flyTo([point.lat, point.lng], 16, { duration: 1.5 });
        // Wait at point
        await new Promise(r => { timeoutId = setTimeout(r, 2500); });
      }
      
      // Auto zoom out at the end
      if (!isCancelled && points.length > 0) {
        const bounds = L.latLngBounds(points.map(p => [p.lat, p.lng] as [number, number]));
        map.fitBounds(bounds.pad(0.2));
      }
    };

    if (isPreviewing) {
      playPreview();
    }

    return () => {
      isCancelled = true;
      clearTimeout(timeoutId);
    };
  }, [isPreviewing, map, points]);

  // Fit bounds when points change
  useEffect(() => {
    if (points.length > 0 && !activePointId && !isPreviewing && !tempSearchMarker) {
      const bounds = L.latLngBounds(points.map(p => [p.lat, p.lng] as [number, number]));
      map.fitBounds(bounds.pad(0.1));
    }
  }, [points, map]); // Removed activePointId and isPreviewing from deps to only run on initial load or point addition

  // Fly to search marker
  useEffect(() => {
    if (tempSearchMarker) {
      map.flyTo([tempSearchMarker.lat, tempSearchMarker.lng], 16, { duration: 1.2 });
    }
  }, [tempSearchMarker, map]);

  return null;
};

// Controls component
const MapControls: React.FC = () => {
  const map = useMap();
  
  return (
    <div className={styles.mapCtrlStack}>
      <div className={styles.ctrlGroup}>
        <button onClick={() => map.zoomIn()} aria-label="Phóng to bản đồ">
          <i className="ph-bold ph-plus"></i>
        </button>
        <button onClick={() => map.zoomOut()} aria-label="Thu nhỏ bản đồ">
          <i className="ph-bold ph-minus"></i>
        </button>
      </div>
      <button 
        className={styles.ctrlBtn} 
        aria-label="Định vị vị trí hiện tại"
        onClick={() => {
          map.locate().on("locationfound", function (e) {
            map.flyTo(e.latlng, map.getZoom());
          });
        }}
      >
        <i className="ph-bold ph-crosshair"></i>
      </button>
    </div>
  );
};


const ItineraryMap: React.FC<Props> = ({ points, activePointId, onPointClick, isPreviewing, onAddSpot }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [suggestions, setSuggestions] = useState<any[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [tempSearchMarker, setTempSearchMarker] = useState<any | null>(null);

  // Auto-search on type with debounce
  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      if (searchQuery.trim().length >= 2) {
        setIsSearching(true);
        axios.get(`https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(searchQuery)}&format=json&addressdetails=1&countrycodes=vn&limit=5`)
          .then(res => {
            if (res.data && res.data.length > 0) {
              setSuggestions(res.data);
            } else {
              setSuggestions([]);
            }
          })
          .catch(e => console.error(e))
          .finally(() => setIsSearching(false));
      } else if (searchQuery.trim().length === 0) {
        setSuggestions([]);
      }
    }, 600);

    return () => clearTimeout(delayDebounceFn);
  }, [searchQuery]);
  
  // Custom Icon factory
  const createNumberedIcon = (index: number) => {
    return L.divIcon({
      className: 'global-iti-map-marker-wrap', // Scoped via global in CSS
      html: `
        <div class="iti-map-marker" style="width: 32px; height: 32px; background: white; border: 4px solid #0ea5e9; border-radius: 50% 50% 50% 0; transform: rotate(-45deg); display: flex; align-items: center; justify-content: center; box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);">
          <span style="transform: rotate(45deg); font-size: 0.85rem; font-weight: 800; color: #0ea5e9;">${index}</span>
        </div>`,
      iconSize: [36, 44],
      iconAnchor: [18, 44],
    });
  };

  const createSearchIcon = () => {
    return L.divIcon({
      className: "search-marker",
      html: `<div style="background-color: #ef4444; width: 36px; height: 36px; border: 3px solid white; border-radius: 50%; box-shadow: 0 6px 16px rgba(0,0,0,0.3); display: flex; align-items: center; justify-content: center; color: white; font-weight: 800; font-size: 12px;">
                 <i class="ph-fill ph-map-pin" style="font-size: 16px;"></i>
             </div>`,
      iconSize: [36, 36],
      iconAnchor: [18, 36],
      popupAnchor: [0, -36]
    });
  };

  const handleSearch = async () => {
    if (!searchQuery.trim()) {
      setSuggestions([]);
      return;
    }
    
    setIsSearching(true);
    try {
      const res = await axios.get(`https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(searchQuery)}&format=json&addressdetails=1&countrycodes=vn&limit=5`);
      
      if (res.data && res.data.length > 0) {
        setSuggestions(res.data);
      } else {
        setSuggestions([]);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsSearching(false);
    }
  };

  const handleSelectSuggestion = (item: any) => {
    setTempSearchMarker({
      lat: parseFloat(item.lat),
      lng: parseFloat(item.lon),
      name: item.name || item.display_name.split(',')[0],
      address: item.display_name
    });
    setSuggestions([]);
    setSearchQuery(item.name || item.display_name.split(',')[0]);
  };

  const renderPolylines = () => {
    if (points.length < 2) return null;
    const pathPositions = points.map(p => [p.lat, p.lng] as [number, number]);

    return (
      <>
        {/* Background shadow line */}
        <Polyline 
          positions={pathPositions} 
          pathOptions={{ color: '#0ea5e9', weight: 12, opacity: 0.1, lineCap: 'round' }} 
        />
        {/* Dashed line */}
        <Polyline 
          positions={pathPositions} 
          pathOptions={{ color: '#0ea5e9', weight: 6, opacity: 0.8, dashArray: '1, 12', lineCap: 'round', lineJoin: 'round' }} 
        />
      </>
    );
  };

  return (
    <main className={styles.mapViewContainer}>
      <MapContainer 
        center={[16.047079, 108.20623]} 
        zoom={11} 
        zoomControl={false}
        style={{ width: '100%', height: '100%', zIndex: 1 }}
      >
        <TileLayer
          attribution="© Google Maps"
          url="https://{s}.google.com/vt/lyrs=m&x={x}&y={y}&z={z}"
          subdomains={['mt0', 'mt1', 'mt2', 'mt3']}
          maxZoom={20}
        />
        
        <MapEffectManager points={points} activePointId={activePointId} isPreviewing={isPreviewing} tempSearchMarker={tempSearchMarker} />
        <MapControls />

        {renderPolylines()}

        {points.map((point, idx) => (
          <Marker 
            key={point.id} 
            position={[point.lat, point.lng]} 
            icon={createNumberedIcon(idx + 1)}
            eventHandlers={{
              click: () => onPointClick(point.id)
            }}
          >
            <Popup className="iti-custom-popup">
              <div className={styles.popupCard}>
                {point.imageUrl && (
                  <div className={styles.popupImg}>
                    <img src={point.imageUrl} alt={point.name} />
                  </div>
                )}
                <div className={styles.popupContent}>
                   <div className={styles.popupMeta}>
                      <span className={styles.popupTime}>{point.time}</span>
                      <span className={styles.popupTag}>{point.type}</span>
                   </div>
                   <h4 className={styles.popupTitle}>{point.name}</h4>
                   <p className={styles.popupDesc}>{point.description}</p>
                </div>
              </div>
            </Popup>
          </Marker>
        ))}

        {tempSearchMarker && (
          <Marker 
            position={[tempSearchMarker.lat, tempSearchMarker.lng]}
            icon={createSearchIcon()}
          >
             <Popup>
                <div style={{ minWidth: "240px", padding: "4px" }}>
                  <h4 style={{ margin: "0 0 6px", fontSize: "1rem", color: "#0f172a", fontWeight: 700, borderBottom: "1px solid #e2e8f0", paddingBottom: "8px" }}>
                    {tempSearchMarker.name}
                  </h4>
                  <p style={{ margin: "0 0 12px", fontSize: "0.85rem", color: "#64748b", lineHeight: 1.5 }}>
                     {tempSearchMarker.address.substring(0, 100)}...
                  </p>
                  <button 
                    onClick={async (e) => {
                      e.currentTarget.disabled = true;
                      e.currentTarget.innerText = 'Đang thêm...';
                      try {
                        const searchRes = await axios.get(`https://vi.wikipedia.org/w/api.php?action=query&list=search&srsearch=${encodeURIComponent(tempSearchMarker.name)}&utf8=&format=json&origin=*`);
                        let desc = '';
                        if (searchRes.data.query.search.length > 0) {
                          const title = searchRes.data.query.search[0].title;
                          const detailRes = await axios.get(`https://vi.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(title)}`);
                          desc = detailRes.data.extract || '';
                        }
                        onAddSpot({
                          name: tempSearchMarker.name,
                          lat: tempSearchMarker.lat,
                          lng: tempSearchMarker.lng,
                          time: '12:00',
                          type: 'other',
                          description: desc || `Đây là một địa điểm thú vị tại ${tempSearchMarker.name}.`
                        });
                      } catch (err) {
                        onAddSpot({
                          name: tempSearchMarker.name,
                          lat: tempSearchMarker.lat,
                          lng: tempSearchMarker.lng,
                          time: '12:00',
                          type: 'other',
                          description: `Đây là một địa điểm thú vị tại ${tempSearchMarker.name}.`
                        });
                      } finally {
                        setTempSearchMarker(null);
                      }
                    }}
                    style={{ background: "#10b981", color: "white", border: "none", padding: "8px", borderRadius: "12px", fontSize: "0.85rem", fontWeight: 600, cursor: "pointer", width: "100%", marginTop: "8px" }}
                  >
                    <i className="ph-bold ph-plus"></i> Thêm địa điểm này
                  </button>
                </div>
             </Popup>
          </Marker>
        )}
      </MapContainer>

      {/* Map Top Search Overlay */}
      <div className={styles.mapOverlaysContainer}>
        <div className={styles.mapTopSearch}>
          <div className={styles.searchWrap}>
            <div className={styles.searchInputContainer}>
              <div className={styles.searchIcons}>
                <i className="ph-fill ph-magnifying-glass" style={{ color: '#0ea5e9' }}></i>
              </div>
              <div className={styles.searchInputWrapper}>
                <input 
                  type="text" 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                  placeholder="Tìm kiếm địa điểm..." 
                  className={styles.searchInput}
                />
                {searchQuery && (
                  <button className={styles.btnClearInline} onClick={() => { setSearchQuery(''); setTempSearchMarker(null); }}>
                    <i className="ph-bold ph-x"></i>
                  </button>
                )}
              </div>
              <button 
                className={styles.btnFindNow} 
                onClick={handleSearch}
                disabled={isSearching}
              >
                {isSearching ? 'Đang tìm...' : 'Tìm kiếm'}
              </button>
            </div>
            {/* Search Suggestions dropdown */}
            {suggestions.length > 0 && (
              <div style={{ position: 'absolute', top: '100%', left: 0, right: 0, background: 'white', borderRadius: '16px', marginTop: '8px', boxShadow: '0 10px 30px rgba(0,0,0,0.1)', overflow: 'hidden', zIndex: 1000 }}>
                {suggestions.map((item, index) => (
                  <div 
                    key={index}
                    onClick={() => handleSelectSuggestion(item)}
                    style={{ padding: '12px 16px', borderBottom: index < suggestions.length - 1 ? '1px solid #f1f5f9' : 'none', cursor: 'pointer', transition: 'background 0.2s', display: 'flex', alignItems: 'center', gap: '12px' }}
                    onMouseEnter={(e) => e.currentTarget.style.background = '#f8fafc'}
                    onMouseLeave={(e) => e.currentTarget.style.background = 'white'}
                  >
                    <i className="ph-fill ph-map-pin" style={{ color: '#0ea5e9', fontSize: '1.2rem' }}></i>
                    <div>
                      <div style={{ fontWeight: 600, color: '#0f172a', fontSize: '0.95rem' }}>{item.name || item.display_name.split(',')[0]}</div>
                      <div style={{ fontSize: '0.8rem', color: '#64748b', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: '300px' }}>{item.display_name}</div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  );
};

export default ItineraryMap;
