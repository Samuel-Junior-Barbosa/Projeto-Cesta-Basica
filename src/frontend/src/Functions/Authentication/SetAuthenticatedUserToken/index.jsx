const SetAuthenticatedUserToken = ( itemValue ) => {
    return sessionStorage.setItem('token', itemValue)
};

export default SetAuthenticatedUserToken;