const GetAuthenticatedUserName = () => {
    return sessionStorage.getItem('user');
};

export default GetAuthenticatedUserName;