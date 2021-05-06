newSessionValue = (key, value) => {
    sessionStorage.setItem(key, value);
}

getSessionValue = (key) => {
    // Get saved data from sessionStorage
    return sessionStorage.getItem(key);
}

deleteSessionValue = (key) => {
    // Remove saved data from sessionStorage
    sessionStorage.removeItem(key);
}


destroySessionValue = () => {
    // Remove all saved data from sessionStorage
    sessionStorage.clear();
}