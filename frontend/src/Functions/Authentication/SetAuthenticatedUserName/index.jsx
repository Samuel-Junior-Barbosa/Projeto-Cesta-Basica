const SetAuthenticatedUserName = ( itemValue ) => {
    return sessionStorage.setItem('user', itemValue)
};

export default SetAuthenticatedUserName;