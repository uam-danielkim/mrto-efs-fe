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
            style={{ ...paperColorStyle, padding: '2px', borderRadius: '4px', border: '1px solid #4b5563' }}
            draggable
            onDragStart={(event) => {
                event.dataTransfer.setData('bayId', bay.id);
                event.dataTransfer.effectAllowed = 'move';
            }}
        >
            <div className="flight-strip-bay__grid" style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr 1fr 1fr 1.5fr 1.5fr 1.5fr', gridTemplateRows: 'repeat(4, 22px)', gap: '1px', background: '#4b5563' }}>
                {/* Row 1 */}
                <div className="flight-strip-bay__cell" style={{ background: paperColorStyle.background, gridColumn: '1 / 2', gridRow: '1 / 2', fontWeight: 800, fontSize: '13px' }}>
                    {bay.callsign}
                </div>
                <div className="flight-strip-bay__cell" style={{ background: paperColorStyle.background, gridColumn: '2 / 3', gridRow: '1 / 2', fontWeight: 700 }}>
                    {bay.beaconCode ?? bay.ssrCode ?? '1200'}
                </div>
                <div className="flight-strip-bay__cell" style={{ background: paperColorStyle.background, gridColumn: '3 / 4', gridRow: '1 / 2', fontWeight: 800 }}>
                    {bay.departureAirport ?? 'RKSI'}
                </div>
                <div className="flight-strip-bay__cell" style={{ background: paperColorStyle.background, gridColumn: '4 / 5', gridRow: '1 / 2' }}>
                    {bay.time ?? bay.etd ?? '0000'}
                </div>
                <div className="flight-strip-bay__cell" style={{ background: paperColorStyle.background, gridColumn: '5 / 7', gridRow: '1 / 2', fontWeight: 700 }}>
                    {bay.aircraftType ?? 'B738'}
                </div>
                <div className="flight-strip-bay__cell" style={{ background: paperColorStyle.background, gridColumn: '7 / 8', gridRow: '1 / 2' }}>
                    {bay.altitude ?? 'FL340'}
                </div>
                <div className="flight-strip-bay__cell" style={{ background: paperColorStyle.background, gridColumn: '8 / 9', gridRow: '1 / 2' }}>
                    {bay.route?.slice(0, 10) ?? 'DCT'}
                </div>
                <div className="flight-strip-bay__cell" style={{ background: paperColorStyle.background, gridColumn: '9 / 10', gridRow: '1 / 2', fontWeight: 700 }}>
                    {bay.atd ? `ATD ${bay.atd}` : (bay.etd ? `ETD ${bay.etd}` : '-')}
                </div>

                {/* Row 2 */}
                <div className="flight-strip-bay__cell" style={{ background: paperColorStyle.background, gridColumn: '1 / 2', gridRow: '2 / 3' }}>
                    {bay.aircraftType}/{bay.wakeCategory ?? 'M'}
                </div>
                <div className="flight-strip-bay__cell" style={{ background: paperColorStyle.background, gridColumn: '2 / 3', gridRow: '2 / 3', fontWeight: 700 }}>
                    {bay.runway ?? '33L'}
                </div>
                <div className="flight-strip-bay__cell" style={{ background: paperColorStyle.background, gridColumn: '3 / 4', gridRow: '2 / 3' }}>
                    {bay.etd ?? bay.time ?? '-'}
                </div>
                <div className="flight-strip-bay__cell" style={{ background: paperColorStyle.background, gridColumn: '4 / 6', gridRow: '2 / 3' }}>
                    {bay.sidStar ?? bay.route?.slice(0, 12) ?? '-'}
                </div>
                <div className="flight-strip-bay__cell" style={{ background: paperColorStyle.background, gridColumn: '6 / 7', gridRow: '2 / 3', fontWeight: 800 }}>
                    {bay.flightRules ?? 'I'}
                </div>
                <div className="flight-strip-bay__cell" style={{ background: paperColorStyle.background, gridColumn: '7 / 8', gridRow: '2 / 3' }}>
                    {bay.departureAirport ?? 'RKSI'}
                </div>
                <div className="flight-strip-bay__cell" style={{ background: paperColorStyle.background, gridColumn: '8 / 9', gridRow: '2 / 3' }}>
                    {bay.arrivalAirport ?? 'RKSS'}
                </div>
                <div className="flight-strip-bay__cell" style={{ background: paperColorStyle.background, gridColumn: '9 / 10', gridRow: '2 / 3' }}>
                    {bay.assignedAltitude ?? bay.altitude ?? '-'}
                </div>

                {/* Row 3 */}
                <div className="flight-strip-bay__cell" style={{ background: paperColorStyle.background, gridColumn: '1 / 6', gridRow: '3 / 4', fontWeight: 700 }}>
                    {bay.callsign}/{bay.departureAirport ?? 'RKSI'}-{bay.arrivalAirport ?? 'RKSS'}
                </div>
                <div className="flight-strip-bay__cell" style={{ background: paperColorStyle.background, gridColumn: '6 / 7', gridRow: '3 / 4', fontWeight: 700 }}>
                    TCA
                </div>
                <div className="flight-strip-bay__cell" style={{ background: paperColorStyle.background, gridColumn: '7 / 8', gridRow: '3 / 4' }}>
                    SQ {bay.beaconCode ?? '1200'}
                </div>
                <div className="flight-strip-bay__cell" style={{ background: paperColorStyle.background, gridColumn: '8 / 9', gridRow: '3 / 4' }}>
                    {bay.speed ?? 'M084'}
                </div>
                <div className="flight-strip-bay__cell" style={{ background: paperColorStyle.background, gridColumn: '9 / 10', gridRow: '3 / 4', fontWeight: 700 }}>
                    {bay.status ?? 'FPL'}
                </div>

                {/* Row 4 */}
                <div className="flight-strip-bay__cell" style={{ background: paperColorStyle.background, gridColumn: '1 / 2', gridRow: '4 / 5' }}>
                    {bay.cid ?? '001'}
                </div>
                <div className="flight-strip-bay__cell" style={{ background: paperColorStyle.background, gridColumn: '2 / 3', gridRow: '4 / 5', fontWeight: 800 }}>
                    C
                </div>
                <div className="flight-strip-bay__cell" style={{ background: paperColorStyle.background, gridColumn: '3 / 4', gridRow: '4 / 5' }}>
                    {bay.gate ?? '-'}
                </div>
                <div className="flight-strip-bay__cell" style={{ background: paperColorStyle.background, gridColumn: '4 / 6', gridRow: '4 / 5', fontWeight: 700 }}>
                    {bay.operationType?.slice(0, 3) ?? 'DEP'}
                </div>
                <div className="flight-strip-bay__cell" style={{ background: paperColorStyle.background, gridColumn: '6 / 10', gridRow: '4 / 5', opacity: 0.85 }}>
                    {bay.remarks ?? 'RMK/ TCAS EQUIPPED'}
                </div>
            </div>
        </article>
    );
}

export default FlightStripBay;