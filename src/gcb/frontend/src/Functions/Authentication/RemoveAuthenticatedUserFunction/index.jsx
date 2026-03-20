const RemoveAuthenticatedUserFunction = () => {
    return sessionStorage.removeItem('role')
};

export default RemoveAuthenticatedUserFunction;