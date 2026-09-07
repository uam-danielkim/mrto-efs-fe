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
            <div className="flight-strip-bay__grid">
                <div className="flight-strip-bay__cell flight-strip-bay__cell--callsign">
                    <span className="flight-strip-bay__label">ACID</span>
                    <strong>{bay.callsign}</strong>
                </div>

                <div className="flight-strip-bay__cell">
                    <span className="flight-strip-bay__label">TYPE</span>
                    <strong>{bay.aircraftType}</strong>
                </div>

                <div className="flight-strip-bay__cell">
                    <span className="flight-strip-bay__label">WAKE</span>
                    <strong>{bay.wakeCategory ?? '-'}</strong>
                </div>

                <div className="flight-strip-bay__cell">
                    <span className="flight-strip-bay__label">CODE</span>
                    <strong>{bay.beaconCode ?? '-'}</strong>
                </div>

                <div className="flight-strip-bay__cell">
                    <span className="flight-strip-bay__label">DEP</span>
                    <strong>{bay.departureAirport ?? '-'}</strong>
                </div>

                <div className="flight-strip-bay__cell">
                    <span className="flight-strip-bay__label">ARR</span>
                    <strong>{bay.arrivalAirport ?? '-'}</strong>
                </div>

                <div className="flight-strip-bay__cell">
                    <span className="flight-strip-bay__label">ALT</span>
                    <strong>{bay.altitude ?? bay.requestedAltitude ?? '-'}</strong>
                </div>

                <div className="flight-strip-bay__cell">
                    <span className="flight-strip-bay__label">RWY</span>
                    <strong>{bay.runway ?? '-'}</strong>
                </div>

                <div className="flight-strip-bay__cell flight-strip-bay__cell--route">
                    <span className="flight-strip-bay__label">ROUTE</span>
                    <strong>{bay.route ?? '-'}</strong>
                </div>

                <div className="flight-strip-bay__cell">
                    <span className="flight-strip-bay__label">TIME</span>
                    <strong>{bay.time ?? bay.etd ?? '-'}</strong>
                </div>

                <div className="flight-strip-bay__cell">
                    <span className="flight-strip-bay__label">GATE</span>
                    <strong>{bay.gate ?? '-'}</strong>
                </div>

                <div className="flight-strip-bay__cell flight-strip-bay__cell--remarks">
                    <span className="flight-strip-bay__label">RMK</span>
                    <strong>{bay.remarks ?? statusTitle ?? bay.status}</strong>
                </div>
            </div>
        </article>
    );
}

export default FlightStripBay;