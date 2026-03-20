const GetAuthenticatedUserFunction = () => {
    return sessionStorage.getItem('role')
};

export default GetAuthenticatedUserFunction;