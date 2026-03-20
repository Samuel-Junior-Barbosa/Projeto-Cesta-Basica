const RemoveAuthenticateduserPermission = () => {
    return sessionStorage.removeItem('userPermission')
};

export default RemoveAuthenticateduserPermission;