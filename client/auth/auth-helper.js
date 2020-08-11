// Saving credentials
const authenticate = (jwt, cb) => {
    if (typeof window !== 'undefined') { // Checks if in browser
        localStorage.setItem('jwt', JSON.stringify(jwt));
    }
    cb(); // callback function after successful sign in 
}

// Retrive credentials
const isAuthenticated = () => {

    if (typeof window === 'undefined') {
        return false;
    }

    if (localStorage.getItem('jwt')) {
        return JSON.parse(localStorage.getItem('jwt'));
    } else {
        return false;
    }

}

// Remove credentials
const clearJwt = (cb) => {
    if (typeof window !== 'undefined') {
        localStorage.removeItem('jwt');
    }
    cb();
}

export default { authenticate, isAuthenticated, clearJwt };