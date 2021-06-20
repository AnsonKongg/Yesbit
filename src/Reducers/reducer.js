let userState = {
    type: "",
    userCapitals: [],
    tokenList: [],
    priceList: [],
};
const reducer = (state = userState, action) => {
    switch (action.type) {
        case 'GET_USER_CAPITALS':
            return {
                ...state,
                type: action.type,
                userCapitals: action.userCapitals,
                tokenList: action.tokenList,
            };
        case 'GET_PRICE_LIST':
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