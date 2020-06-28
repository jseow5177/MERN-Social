const create = async (user) => {
    try {
        const response = await fetch('/api/users', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json', // JSON data being sent
                'Accept': 'application/json' // JSON data expected as response
            },
            body: JSON.stringify(user)
        });
        return await response.json();
    } catch (err) {
        console.log(err);
    }
}

const list = async (signal) => {
    try {
        const response = await fetch('/api/users', {
            method: 'GET',
            signal: signal // AbortController signal
        });
        return await response.json(); // Returns an array of users
    } catch (err) {
        console.log(err);
    }
}

const read = async (params, credentials, signal) => {
    /*
        params: userId,
        credentials: JWT token
        signal: AbortController's signal
    */
    try {
        const response = await fetch(`/api/users/${params.userId}`, {
            method: 'GET',
            signal: signal,
            headers: {
                'Accept': 'application/json',
                'Authorization': `Bearer ${credentials.token}`
            }
        });
        return await response.json();
    } catch (err) {
        console.log(err);
    }
}

const update = async (params, credentials, user) => {

    try {
        const response = await fetch(`/api/users/${params.userId}`, {
            method: 'PUT',
            headers: {
                'Accept': 'application/json',
                'Authorization': `Bearer ${credentials.token}`
            },
            body: user
        });
        return await response.json();
    } catch (err) {
        console.log(err);
    }
}

const updatePassword = async (params, credentials, passwords) => {
    try {
        const response = await fetch(`/api/users/${params.userId}/edit-password`, {
            method: 'PUT',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${credentials.token}`
            },
            body: JSON.stringify(passwords)
        });
        return await response.json();
    } catch (err) {
        console.log(err);
    }
}

const remove = async (params, credentials) => {
    try {
        const response = await fetch(`/api/users/${params.userId}`, {
            method: 'DELETE',
            headers: {
                'Accept': 'application/json',
                'Authorization': `Bearer ${credentials.token}`
            }
        });
        return await response.json()
    } catch (err) {
        console.log(err);
    }
}

const follow = async (params, credentials, followId) => {
    try {
        const response = await fetch('/api/users/follow', {
            method: 'PUT',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${credentials.token}`
            },
            body: JSON.stringify({ userId: params.userId, followId: followId })
        });
        return await response.json();
    } catch (err) {
        console.log(err);
    }
}

const unfollow = async (params, credentials, unfollowId) => {
    try {
        const response = await fetch('/api/users/unfollow', {
            method: 'PUT',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${credentials.token}`
            },
            body: JSON.stringify({userId: params.userId, unfollowId: unfollowId})
        });
        return await response.json();
    } catch (err) {
        console.log(err);
    }
}

const findPeople = async (params, credentials, signal) => {
    try {
        const response = await fetch(`/api/users/notfollow/${params.userId}`, {
            method: 'GET',
            signal: signal,
            headers: {
                'Accept': 'application/json',
                'Authorization': `Bearer ${credentials.token}`
            }
        });
        return await response.json();
    } catch (err) {
        console.log(err);
    }
}

export { create, list, read, update, remove, updatePassword, follow, unfollow, findPeople };