const GetAuthenticatedUserPermission = () => {
    return sessionStorage.getItem('userPermission')
};

export default GetAuthenticatedUserPermission;