export const getUserCapitals = () => {
    return async dispatch => {
        try {
            const response = await fetch('http://localhost:8000/userCapitals')
            const resData = await response.json();
            let items = resData;
            let tokenList = [];
            items.forEach(element => {
                tokenList = [...tokenList, {token: element.token, url: element.logoUrl}];
            });
            dispatch({
                type: 'GET_USER_CAPITALS',
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
            const response = await fetch('http://localhost:8000/priceList')
            const priceList = await response.json();
            dispatch({
                type: 'GET_PRICE_LIST',
                priceList: priceList,
            });  
        } catch (error) {
            console.log(error)
        }
    }
}