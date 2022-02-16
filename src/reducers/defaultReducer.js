const initialState = {
    workTime: [],
};

const defaultReducer = (state = initialState, action) => {
    switch (action.type) {
        case 'ADD_WORK_TIME': {
            return {
                ...state,
                workTime: [
                    ...state.workTime,
                    action.payload,
                ]
            };
        }
        case 'UPDATE_WORK_TIME': {
            const updateIndex = state.workTime.findIndex(
                (e) => e.id === action.payload.id
            );
            return {
                ...state,
                workTime: [
                    ...state.workTime.slice(0, updateIndex),
                    action.payload,
                    ...state.workTime.slice(updateIndex + 1),
                ],
            };
        }
        case 'DELETE_WORK_TIME': {
            return {
                ...state,
                workTime: state.workTime.filter((element) => element.id !== action.payload),
            };
        }

        default:
            return state;
    }
};

export default defaultReducer;
