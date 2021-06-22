import * as APIs from "../config/API";
import * as types from "../config/ActionTypes";

export const getUserCapitals = () => {
    return async dispatch => {
        try {
            const response = await fetch(APIs.GET_USER_CAPITALS)
            const resData = await response.json();
            const items = resData;
            const tokenList = items.map(element => (
                { token: element.token, url: element.logoUrl }
            ));
            dispatch({
                type: types.GET_USER_CAPITALS,
                userCapitals: items,
                tokenList: tokenList,
            });
        } catch (error) {
            console.log(error)
        }
    }
}
export const getPriceList = () => {
    return async dispatch => {
        try {
            const response = await fetch(APIs.GET_PRICE_LIST)
            const priceList = await response.json();
            dispatch({
                type: types.GET_PRICE_LIST,
                priceList: priceList,
            });
        } catch (error) {
            console.log(error)
        }
    }
}