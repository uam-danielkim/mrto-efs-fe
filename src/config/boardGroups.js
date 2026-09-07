const boardGroups = [
    {
        id: 'departure',
        title: 'DEPARTURE',
        operationType: 'DEPARTURE',
        fields: [
            { id: 'dep-queue', title: 'DEP QUEUE', status: 'DEP_QUEUE' },
            { id: 'airborne', title: 'AIRBORNE', status: 'AIRBORNE' },
            { id: 'line-up', title: 'LINE-UP', status: 'LINE_UP' },
            { id: 'taxi-out', title: 'TAXI-OUT', status: 'TAXI_OUT' },
            { id: 'pushback', title: 'PUSHBACK', status: 'PUSHBACK' },
        ],
    },
    {
        id: 'arrival',
        title: 'ARRIVAL',
        operationType: 'ARRIVAL',
        fields: [
            { id: 'arr-queue', title: 'ARR QUEUE', status: 'ARR_QUEUE' },
            { id: 'arrival', title: 'ARRIVAL', status: 'ARRIVAL' },
            { id: 'approach', title: 'APPROACH', status: 'APPROACH' },
            { id: 'taxi-in', title: 'TAXI-IN', status: 'TAXI_IN' },
            { id: 'on-block', title: 'ON-BLOCK', status: 'ON_BLOCK' },
        ],
    },
    {
        id: 'transit',
        title: 'TRANSIT',
        operationType: 'TRANSIT',
        fields: [
            { id: 'trn-queue', title: 'TRN QUEUE', status: 'TRN_QUEUE' },
            { id: 'exit', title: 'EXIT', status: 'EXIT' },
            { id: 'passing', title: 'PASSING', status: 'PASSING' },
            { id: 'entry', title: 'ENTRY', status: 'ENTRY' },
        ],
    },
    {
        // 장주 그룹: CIRCUIT → TRAFFIC PATTERN 으로 화면 표시만 변경
        id: 'circuit',
        title: 'TRAFFIC PATTERN',
        operationType: 'CIRCUIT',
        fields: [
            { id: 'cct-queue', title: 'CCT QUEUE', status: 'CCT_QUEUE' },
            { id: 'final', title: 'FINAL', status: 'FINAL' },
            { id: 'base', title: 'BASE', status: 'BASE' },
            { id: 'downwind', title: 'DOWNWIND', status: 'DOWNWIND' },
            { id: 'crosswind', title: 'CROSSWIND', status: 'CROSSWIND' },
            { id: 'upwind', title: 'UPWIND', status: 'UPWIND' },
        ],
    },

]

export default boardGroups;