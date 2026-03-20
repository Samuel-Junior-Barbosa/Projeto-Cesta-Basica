const GetAuthenticatedUserToken = () => {
    return sessionStorage.getItem('token')
};

export default GetAuthenticatedUserToken;