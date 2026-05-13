// src/components/LocationPicker/LocationPicker.tsx
import { useState } from 'react';
import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import styles from './LocationPicker.module.css';

// Fix leaflet default marker icon
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
    iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
    shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

interface LocationPickerProps {
    onConfirm: (coords: { latitude: number; longitude: number }) => void;
    onClose: () => void;
}

function MapClickHandler({ onSelect }: { onSelect: (lat: number, lng: number) => void }) {
    useMapEvents({
        click(e) {
            onSelect(e.latlng.lat, e.latlng.lng);
        },
    });
    return null;
}

export default function LocationPicker({ onConfirm, onClose }: LocationPickerProps) {
    const [selected, setSelected] = useState<{ lat: number; lng: number } | null>(null);

    const handleConfirm = () => {
        if (!selected) return;
        onConfirm({ latitude: selected.lat, longitude: selected.lng });
    };

    return (
        <div className={styles.overlay}>
            <div className={styles.sheet}>
                <div className={styles.header}>
                    <h4 className={styles.title}>Odaberi lokaciju</h4>
                    <button type="button" className={styles.closeBtn} onClick={onClose}>
                        ✕
                    </button>
                </div>
                <p className={styles.hint}>Tapni na mapi za odabir lokacije</p>

                <div className={styles.mapWrapper}>
                    <MapContainer
                        center={[45.815, 15.9819]}
                        zoom={7}
                        style={{ width: '100%', height: '100%' }}
                    >
                        <TileLayer
                            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                            attribution="&copy; OpenStreetMap contributors"
                        />
                        <MapClickHandler onSelect={(lat, lng) => setSelected({ lat, lng })} />
                        {selected && <Marker position={[selected.lat, selected.lng]} />}
                    </MapContainer>
                </div>

                <div className={styles.footer}>
                    <button
                        type="button"
                        className={`${styles.confirmBtn} ${!selected ? styles.confirmBtnDisabled : ''}`}
                        disabled={!selected}
                        onClick={handleConfirm}
                    >
                        Potvrdi lokaciju
                    </button>
                </div>
            </div>
        </div>
    );
}
