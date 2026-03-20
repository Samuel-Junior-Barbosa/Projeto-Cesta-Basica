const RemoveAuthenticatedUserName = () => {
    return sessionStorage.removeItem('user')
};

export default RemoveAuthenticatedUserName;