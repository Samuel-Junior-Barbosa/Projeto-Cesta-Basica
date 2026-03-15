

const SetAuthenticatedUserPermission = (itemValue) => {
    const userPermissions = sessionStorage.setItem('userPermission', itemValue)
    return userPermissions
};

export default SetAuthenticatedUserPermission;