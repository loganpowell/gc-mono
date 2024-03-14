const BASE_URI = process.env.API_URI

const authenticate = (dispatch, navigate, redirectUrl) => {
    dispatch({ type: 'REQUESTING_AUTH' })

    fetch(`${BASE_URI}/v1/session`, {
        method: 'GET',
        credentials: 'include',
    })
        .then(async (response) => {
            if (response.ok) {
                const json = await response.json()
                return { ok: true, ...json }
            }

            return { ok: false, status: response.status }
        })
        .then((json) => {
            if (!json.ok) return navigate(`/login?redirect_to=${redirectUrl}`)

            dispatch({ type: 'RECEIVED_AUTH', data: { ...json } })
        })
}

const logout = (dispatch, navigate) => {
    dispatch({ type: 'REQUESTING_LOGOUT' })

    fetch(`${BASE_URI}/v1/logout`, {
        method: 'GET',
        credentials: 'include',
    }).then((response) => {
        dispatch({ type: 'RECEIVED_LOGOUT' })
        navigate('/login')
    })
}

const getVideos = (dispatch) => {
    dispatch({ type: 'REQUESTING_TODOS' })

    return fetch(`${BASE_URI}/v1/todos`, {
        method: 'GET',
        credentials: 'include',
    })
        .then(async (response) => await response.json())
        .then((json) => {
            dispatch({ type: 'RECEIVED_TODOS', data: json })
            return json
        })
}

export { authenticate, logout, getVideos }
