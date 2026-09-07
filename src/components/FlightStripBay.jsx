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

    return (
        <article
            ref={bayRef}
            className={`flight-strip-bay ${typeClass} ${isCompact ? 'flight-strip-bay--compact' : ''}`}
            draggable
            onDragStart={(event) => {
                event.dataTransfer.setData('bayId', bay.id);
                event.dataTransfer.effectAllowed = 'move';
            }}
        >
            <div className="flight-strip-bay__title-bar" style={{ display: 'flex', justifyContent: 'space-between', padding: '2px 4px', fontSize: '8px', color: 'var(--text-muted)' }}>
                <span style={{ fontWeight: 800 }}>{stripTitle}</span>
                <span>{bay.status}</span>
            </div>

            <div className="flight-strip-bay__grid">
                <div className="flight-strip-bay__cell flight-strip-bay__cell--callsign">
                    <span className="flight-strip-bay__label">1 ACID</span>
                    <strong>{bay.callsign}</strong>
                </div>

                <div className="flight-strip-bay__cell">
                    <span className="flight-strip-bay__label">2 REV</span>
                    <strong>{bay.revisionNumber ?? '01'}</strong>
                </div>

                <div className="flight-strip-bay__cell">
                    <span className="flight-strip-bay__label">2A SEC</span>
                    <strong>{bay.originator ?? 'D1'}</strong>
                </div>

                <div className="flight-strip-bay__cell">
                    <span className="flight-strip-bay__label">3 TYPE</span>
                    <strong>{bay.aircraftType}/{bay.wakeCategory ?? 'M'}</strong>
                </div>

                <div className="flight-strip-bay__cell">
                    <span className="flight-strip-bay__label">4 CID</span>
                    <strong>{bay.cid ?? '042'}</strong>
                </div>

                <div className="flight-strip-bay__cell">
                    <span className="flight-strip-bay__label">5 SSR</span>
                    <strong>{bay.beaconCode ?? '-'}</strong>
                </div>

                <div className="flight-strip-bay__cell">
                    <span className="flight-strip-bay__label">6 TIME</span>
                    <strong>{bay.time ?? bay.etd ?? '-'}</strong>
                </div>

                <div className="flight-strip-bay__cell">
                    <span className="flight-strip-bay__label">7 ALT</span>
                    <strong>{bay.altitude ?? bay.requestedAltitude ?? '-'}</strong>
                </div>

                <div className="flight-strip-bay__cell">
                    <span className="flight-strip-bay__label">8 DEP/ETA</span>
                    <strong>{bay.departureAirport ?? bay.eta ?? '-'}</strong>
                </div>

                <div className="flight-strip-bay__cell">
                    <span className="flight-strip-bay__label">9B GATE</span>
                    <strong>{bay.gate ?? bay.runway ?? '-'}</strong>
                </div>

                <div className="flight-strip-bay__cell flight-strip-bay__cell--route">
                    <span className="flight-strip-bay__label">9 ROUTE</span>
                    <strong>{bay.route ?? '-'}</strong>
                </div>

                <div className="flight-strip-bay__cell flight-strip-bay__cell--remarks">
                    <span className="flight-strip-bay__label">9A PO/RMK</span>
                    <strong>{bay.remarks ?? statusTitle ?? bay.status}</strong>
                </div>
            </div>
        </article>
    );
}

export default FlightStripBay;