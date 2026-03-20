const RemoveAuthenticatedUserToken = () => {
    return sessionStorage.removeItem('token')
};

export default RemoveAuthenticatedUserToken;