import {useState} from 'react'
import FlightStripStatusField from './FlightStripStatusField.jsx'
import FlightStripBay from './FlightStripBay.jsx'

import boardGroups from '../config/boardGroups.js'
import initialFlightStrips from '../config/initialFlightStrips.js'

const COLUMN_ORDER = ['circuit', 'departure', 'arrival', 'transit'];
const DEFAULT_SECTION_HEIGHT = 120;
const MIN_SECTION_HEIGHT = 40;

function FlightStripBoard() {
    const [flightStrips, setFlightStrips] = useState(initialFlightStrips);
    const [sectionHeights, setSectionHeights] = useState({});
    // const [columns2, setBoards] = useState(boardGroups);

    const moveBayToStatusField = (bayId, targetStatus) => {
        setFlightStrips((prev) =>
            prev.map((strip) =>
                strip.id === bayId
                    ? {
                        ...strip,
                        status: targetStatus,
                    }
                    : strip,
            ),
        );
    };

    const startResizeSection = (sectionId, startEvent) => {
        startEvent.preventDefault();

        const topElement = startEvent.currentTarget.closest(
            '.flight-strip-board__column-top',
        );

        if (!topElement) {
            return;
        }

        const sectionElements = Array.from(
            topElement.querySelectorAll('.flight-strip-status-section--flex'),
        );

        const targetIndex = sectionElements.findIndex(
            (sectionElement) => sectionElement.dataset.sectionId === sectionId,
        );

        if (targetIndex === -1) {
            return;
        }

        const startY = startEvent.clientY;

        const startHeights = sectionElements.map((sectionElement) =>
            sectionElement.getBoundingClientRect().height,
        );

        const sectionIds = sectionElements.map(
            (sectionElement) => sectionElement.dataset.sectionId,
        );

        const handleMouseMove = (moveEvent) => {
            const deltaY = moveEvent.clientY - startY;
            const nextHeights = [...startHeights];

            if (deltaY > 0) {
                let remainingDelta = deltaY;

                for (let index = targetIndex + 1; index < nextHeights.length; index += 1) {
                    const shrinkableHeight = nextHeights[index] - MIN_SECTION_HEIGHT;
                    const shrinkHeight = Math.min(shrinkableHeight, remainingDelta);

                    nextHeights[index] -= shrinkHeight;
                    remainingDelta -= shrinkHeight;

                    if (remainingDelta <= 0) {
                        break;
                    }
                }

                const actualGrowHeight = deltaY - remainingDelta;
                nextHeights[targetIndex] += actualGrowHeight;
            }

            if (deltaY < 0) {
                const shrinkHeight = Math.min(
                    startHeights[targetIndex] - MIN_SECTION_HEIGHT,
                    Math.abs(deltaY),
                );

                nextHeights[targetIndex] -= shrinkHeight;

                if (targetIndex + 1 < nextHeights.length) {
                    nextHeights[targetIndex + 1] += shrinkHeight;
                }
            }

            setSectionHeights((prev) => {
                const next = {...prev};

                sectionIds.forEach((id, index) => {
                    next[id] = nextHeights[index];
                });

                return next;
            });
        };

        const handleMouseUp = () => {
            window.removeEventListener('mousemove', handleMouseMove);
            window.removeEventListener('mouseup', handleMouseUp);
        };

        window.addEventListener('mousemove', handleMouseMove);
        window.addEventListener('mouseup', handleMouseUp);
    };

    const canDropInGroup = (bayId, targetOperationType) => {
        const draggedStrip = flightStrips.find((strip) => strip.id === bayId);

        return draggedStrip?.operationType === targetOperationType;
    };

    // const queueStatuses = ['DEP_QUEUE', 'ARR_QUEUE', 'TRN_QUEUE', 'CCT_QUEUE'];

    return (
        <section
            className="flight-strip-board"
            aria-label="Electronic Flight Strip Board"
        >
            {/*{boardGroups.map((group) => {*/}
            {/*    // 이 그룹의 필드들을 QUEUE / 나머지로 분리*/}
            {/*    const queueFields = group.fields.filter((field) =>*/}
            {/*        queueStatuses.includes(field.status),*/}
            {/*    );*/}
            {/*    const normalFields = group.fields.filter(*/}
            {/*        (field) => !queueStatuses.includes(field.status),*/}
            {/*    );*/}
            {COLUMN_ORDER.map((groupId) => {
                const group = boardGroups.find((g) => g.id === groupId);
                if (!group) return null;

                const queueStatuses = ['DEP_QUEUE', 'ARR_QUEUE', 'TRN_QUEUE', 'CCT_QUEUE'];

                const queueFields = group.fields.filter((field) =>
                    queueStatuses.includes(field.status),
                );
                const normalFields = group.fields.filter(
                    (field) => !queueStatuses.includes(field.status),
                );

                return (
                    <div
                        key={group.id}
                        className="flight-strip-board__column"
                    >

                        {/* === 컬럼 상단 대표 헤더: DEPARTURE / ARRIVAL / ... === */}
                        <header className="flight-strip-board__column-header">
                            <div className="column-header__title">
                                {group.title}
                            </div>
                        </header>


                        {/* 1) 위쪽: 큐가 아닌 필드들 (가변 영역) */}
                        <div className="flight-strip-board__column-top">
                            {normalFields.map((field) => {
                                const stripsInField = flightStrips.filter(
                                    (strip) =>
                                        strip.operationType === group.operationType &&
                                        strip.status === field.status,
                                );

                                const sectionId = `${group.id}-${field.id}`;

                                return (
                                    <section
                                        key={field.id}
                                        data-section-id={sectionId}
                                        className="flight-strip-status-section flight-strip-status-section--flex"
                                        style={
                                            sectionHeights[sectionId]
                                                ? {
                                                    flex: `0 0 ${sectionHeights[sectionId]}px`,
                                                }
                                                : undefined
                                        }
                                        onDragOver={(event) => event.preventDefault()}
                                        onDrop={(event) => {
                                            event.preventDefault();

                                            const bayId =
                                                event.dataTransfer.getData('bayId');

                                            if (!bayId) {
                                                return;
                                            }

                                            if (!canDropInGroup(bayId, group.operationType)) {
                                                return;
                                            }

                                            moveBayToStatusField(
                                                bayId,
                                                field.status,
                                            );
                                        }}
                                    >
                                        <FlightStripStatusField
                                            title={field.title}
                                            // count={stripsInField.length}
                                        />
                                        <div className="flight-strip-status-section__body">
                                            {stripsInField.map((bay) => (
                                                <FlightStripBay
                                                    key={bay.id}
                                                    bay={bay}
                                                />
                                            ))}
                                        </div>
                                        <div
                                            className="flight-strip-status-section__resize-handle"
                                            onMouseDown={(event) => startResizeSection(sectionId, event)}
                                        />
                                    </section>
                                );
                            })}
                        </div>

                        {/* 2) 아래쪽: QUEUE 필드들 고정 영역 */}
                        <div className="flight-strip-board__column-bottom">
                            {queueFields.map((field) => {
                                const stripsInField = flightStrips.filter(
                                    (strip) =>
                                        strip.operationType === group.operationType &&
                                        strip.status === field.status,
                                );

                                return (
                                    <section
                                        key={field.id}
                                        className="flight-strip-status-section flight-strip-status-section--queue"
                                        onDragOver={(event) => event.preventDefault()}
                                        onDrop={(event) => {
                                            event.preventDefault();

                                            const bayId =
                                                event.dataTransfer.getData('bayId');

                                            if (!bayId) {
                                                return;
                                            }

                                            if (!canDropInGroup(bayId, group.operationType)) {
                                                return;
                                            }

                                            moveBayToStatusField(
                                                bayId,
                                                field.status,
                                            );
                                        }}
                                    >
                                        <FlightStripStatusField
                                            title={field.title}
                                            // count={stripsInField.length}
                                        />
                                        <div className="flight-strip-status-section__body">
                                            {stripsInField.map((bay) => (
                                                <FlightStripBay
                                                    key={bay.id}
                                                    bay={bay}
                                                />
                                            ))}
                                        </div>
                                    </section>
                                );
                            })}
                        </div>
                    </div>
                );
            })}
        </section>
    );
}

export default FlightStripBoard