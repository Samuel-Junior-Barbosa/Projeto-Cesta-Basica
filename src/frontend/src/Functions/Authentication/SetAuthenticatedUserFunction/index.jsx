const SetAuthenticatedUserFunction = ( itemValue ) => {
    return sessionStorage.setItem('role', itemValue)
};

export default SetAuthenticatedUserFunction;