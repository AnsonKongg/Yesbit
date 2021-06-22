import * as types from "../config/ActionTypes";
const userState = {
    type: "",
    userCapitals: [],
    tokenList: [],
    priceList: [],
};
const reducer = (state = userState, action) => {
    switch (action.type) {
        case types.GET_USER_CAPITALS:
            return {
                ...state,
                type: action.type,
                userCapitals: action.userCapitals,
                tokenList: action.tokenList,
            };
        case types.GET_PRICE_LIST:
            return {
                ...state,
                type: action.type,
                priceList: action.priceList,
            };
        default:
            return state;
    }
}

export default reducer;