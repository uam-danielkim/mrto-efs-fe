import {useEffect, useRef, useState} from 'react'

// const NORMAL_BAY_HEIGHT = 58;
const NORMAL_BAY_HEIGHT = 130;
const NORMAL_BAY_GAP = 6;
const COMPACT_SWITCH_BUFFER = 8;

function FlightStripBay({ bay, statusTitle }) {
    const bayRef = useRef(null);
    const [isCompact, setIsCompact] = useState(false);

    useEffect(() => {
        const bayElement = bayRef.current;

        if (!bayElement) {
            return undefined;
        }

        const bodyElement = bayElement.closest('.flight-strip-status-section__body');

        if (!bodyElement) {
            return undefined;
        }

        const updateCompactMode = () => {
            const bayElements = Array.from(
                bodyElement.querySelectorAll('.flight-strip-bay'),
            );

            const bayCount = bayElements.length;
            const availableHeight = bodyElement.clientHeight;
            const requiredNormalHeight =
                bayCount * NORMAL_BAY_HEIGHT + Math.max(bayCount - 1, 0) * NORMAL_BAY_GAP;

            setIsCompact(requiredNormalHeight > availableHeight - COMPACT_SWITCH_BUFFER);
        };

        updateCompactMode();

        const resizeObserver = new ResizeObserver(updateCompactMode);

        resizeObserver.observe(bodyElement);

        return () => {
            resizeObserver.disconnect();
        };
    }, []);

    // operationType에 따라 컬러 클래스 결정
    const typeClass = (() => {
        switch (bay.operationType) {
            case 'DEPARTURE':
                return 'flight-strip-bay--departure';
            case 'ARRIVAL':
                return 'flight-strip-bay--arrival';
            case 'TRANSIT':
                return 'flight-strip-bay--transit';
            case 'CIRCUIT':
                return 'flight-strip-bay--circuit';
            default:
                return '';
        }
    })();

    const stripTitle = (() => {
        switch (bay.operationType) {
            case 'DEPARTURE': return '[출발 스트립] DEPARTURE';
            case 'ARRIVAL': return '[도착 스트립] ARRIVAL';
            case 'TRANSIT': return '[통과비행 스트립] TRANSIT';
            case 'CIRCUIT': return '[장주비행 스트립] CIRCUIT';
            default: return 'FLIGHT STRIP';
        }
    })();

    // Authentic paper colors based on stitch_
    const paperColorStyle = (() => {
        switch (bay.operationType) {
            case 'DEPARTURE': return { background: '#dcfce7', color: '#064e3b' };
            case 'ARRIVAL': return { background: '#fef08a', color: '#713f12' };
            case 'TRANSIT': return { background: '#ffffff', color: '#111827' };
            case 'CIRCUIT': return { background: '#f3e8ff', color: '#581c87' };
            default: return { background: '#ffffff', color: '#111827' };
        }
    })();

    return (
        <article
            ref={bayRef}
            className={`flight-strip-bay ${typeClass} ${isCompact ? 'flight-strip-bay--compact' : ''}`}
            style={{ ...paperColorStyle, padding: '0', borderRadius: '3px', border: '1px solid #334155', overflow: 'hidden', height: isCompact ? '48px' : '56px', display: 'flex', flexDirection: 'row' }}
            draggable
            onDragStart={(event) => {
                event.dataTransfer.setData('bayId', bay.id);
                event.dataTransfer.effectAllowed = 'move';
            }}
        >
            {/* Section 1: Left 1/4 division (4 rows: 1, 2+2A, 3, 4) */}
            <div style={{ flex: '2.1', display: 'flex', flexDirection: 'column', borderRight: '1px solid rgba(0,0,0,0.35)', minWidth: 0 }}>
                <div style={{ flex: 1, display: 'flex', alignItems: 'center', padding: '0 3px', borderBottom: '1px solid rgba(0,0,0,0.2)', fontWeight: 800, fontSize: '11px', overflow: 'hidden', whiteSpace: 'nowrap', textOverflow: 'ellipsis' }}>
                    {bay.callsign}
                </div>
                <div style={{ flex: 1, display: 'flex', borderBottom: '1px solid rgba(0,0,0,0.2)', minWidth: 0 }}>
                    <div style={{ flex: 1, display: 'flex', alignItems: 'center', padding: '0 2px', borderRight: '1px solid rgba(0,0,0,0.2)', fontSize: '8px', overflow: 'hidden', whiteSpace: 'nowrap', textOverflow: 'ellipsis' }}>
                        {bay.aircraftType}/{bay.wakeCategory ?? 'M'}
                    </div>
                    <div style={{ flex: 1, display: 'flex', alignItems: 'center', padding: '0 2px', fontWeight: 800, fontSize: '8px', overflow: 'hidden', whiteSpace: 'nowrap', textOverflow: 'ellipsis' }}>
                        {bay.runway ?? '33L'}
                    </div>
                </div>
                <div style={{ flex: 1, display: 'flex', alignItems: 'center', padding: '0 3px', borderBottom: '1px solid rgba(0,0,0,0.2)', fontSize: '8px', overflow: 'hidden', whiteSpace: 'nowrap', textOverflow: 'ellipsis' }}>
                    {bay.callsign}/{bay.departureAirport ?? 'RKSI'}-{bay.arrivalAirport ?? 'RKSS'}
                </div>
                <div style={{ flex: 1, display: 'flex', alignItems: 'center', padding: '0 3px', fontSize: '8px', overflow: 'hidden', whiteSpace: 'nowrap', textOverflow: 'ellipsis' }}>
                    {bay.cid ?? '001'}
                </div>
            </div>

            {/* Section 2: 1/3 division (3 rows: 5, 6, 7) */}
            <div style={{ flex: '0.9', display: 'flex', flexDirection: 'column', borderRight: '1px solid rgba(0,0,0,0.35)', minWidth: 0 }}>
                <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', borderBottom: '1px solid rgba(0,0,0,0.2)', fontWeight: 700, fontSize: '8.5px' }}>
                    {bay.beaconCode ?? bay.ssrCode ?? '1200'}
                </div>
                <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', borderBottom: '1px solid rgba(0,0,0,0.2)', fontSize: '8.5px' }}>
                    {bay.etd ?? bay.time ?? '-'}
                </div>
                <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: '8.5px' }}>
                    C
                </div>
            </div>

            {/* Section 3: 1/3 division (3 rows: 8, 8A, 8B) */}
            <div style={{ flex: '1.1', display: 'flex', flexDirection: 'column', borderRight: '1px solid rgba(0,0,0,0.35)', minWidth: 0 }}>
                <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', borderBottom: '1px solid rgba(0,0,0,0.2)', fontWeight: 800, fontSize: '8.5px' }}>
                    {bay.departureAirport ?? 'RKSI'}
                </div>
                <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', borderBottom: '1px solid rgba(0,0,0,0.2)', fontSize: '8px' }}>
                    {bay.sidStar ?? bay.route?.slice(0, 8) ?? '-'}
                </div>
                <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '8px' }}>
                    {bay.gate ?? '-'}
                </div>
            </div>

            {/* Section 4: Center Wide (4 corners: 9, 9B, 9A, 9C + route) */}
            <div style={{ flex: '3.2', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', padding: '1px 3px', borderRight: '1px solid rgba(0,0,0,0.35)', minWidth: 0 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '8px', fontWeight: 700 }}>
                    <span>{bay.time ?? bay.etd ?? '0000'}</span>
                    <span>{bay.aircraftType ?? 'B738'}</span>
                </div>
                <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '8.5px', fontWeight: 700, overflow: 'hidden', whiteSpace: 'nowrap', textOverflow: 'ellipsis' }}>
                    {bay.route ?? 'NOPS1A NOPSI Y697 LANAT'}
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '8px' }}>
                    <span style={{ fontWeight: 700 }}>{bay.operationType?.slice(0, 3) ?? 'DEP'}</span>
                    <span style={{ opacity: 0.85, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{bay.remarks ?? 'RMK/ TCAS'}</span>
                </div>
            </div>

            {/* Section 5: Right 3x3 Grid (3 cols x 3 rows: 10,11,12 / 13,14,15 / 16,17,18) */}
            <div style={{ flex: '2.7', display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gridTemplateRows: 'repeat(3, 1fr)', gap: '1px', background: 'rgba(0,0,0,0.25)', minWidth: 0 }}>
                <div style={{ background: paperColorStyle.background, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '8px', fontWeight: 800 }}>
                    {bay.altitude ?? 'FL340'}
                </div>
                <div style={{ background: paperColorStyle.background, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '8px' }}>
                    {(bay.route || '').split(' ')[0] || 'DCT'}
                </div>
                <div style={{ background: paperColorStyle.background, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '8px' }}>
                    {bay.atd ? `ATD ${bay.atd}` : (bay.etd ? `ETD ${bay.etd}` : '-')}
                </div>

                <div style={{ background: paperColorStyle.background, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '8px' }}>
                    {bay.departureAirport ?? 'RKSI'}
                </div>
                <div style={{ background: paperColorStyle.background, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '8px', fontWeight: 800 }}>
                    {bay.arrivalAirport ?? 'RKSS'}
                </div>
                <div style={{ background: paperColorStyle.background, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '8px' }}>
                    {bay.assignedAltitude ?? bay.altitude ?? '-'}
                </div>

                <div style={{ background: paperColorStyle.background, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '8px' }}>
                    {bay.beaconCode ?? '1200'}
                </div>
                <div style={{ background: paperColorStyle.background, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '8px' }}>
                    {bay.speed ?? 'M084'}
                </div>
                <div style={{ background: paperColorStyle.background, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '8px', fontWeight: 800 }}>
                    {bay.status ?? 'ACT'}
                </div>
            </div>
        </article>
    );
}

export default FlightStripBay;