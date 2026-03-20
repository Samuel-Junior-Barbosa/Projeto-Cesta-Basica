

const SetAuthenticatedUserPermission = (itemValue) => {
    const userPermissions = sessionStorage.setItem('userPermission', itemValue)
    window.dispatchEvent(new Event("permissionsChanged"));
    return userPermissions
};

export default SetAuthenticatedUserPermission;