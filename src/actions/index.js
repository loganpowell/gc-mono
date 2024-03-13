const BASE_URI = process.env.API_URI;

const authenticate = (dispatch, navigate, redirectUrl) => {
  dispatch({ type: "REQUESTING_AUTH" });

  fetch(`${BASE_URI}/v1/session`, {
    method: 'GET',
    credentials: 'include',
  }).then(async response => {
    if (response.ok) {
      const json = await response.json();
      return {ok: true, ...json};
    }

    return {ok: false, status: response.status};
  })
    .then(json => {
      if (!json.ok) return navigate(`/login?redirect_to=${redirectUrl}`);

      dispatch({type: 'RECEIVED_AUTH', data: {...json}});
    });
};

const getVideos = dispatch => {
  dispatch({type: 'REQUESTING_VIDEOS'});

  return fetch(`${BASE_URI}/v1/videos`, {
    method: 'GET',
    credentials: 'include',
  }).then(async response => await response.json())
    .then(json => {
      dispatch({type: 'RECEIVED_VIDEOS', data: json})
      return json;
    });
};

const uploadVideo = (dispatch, {file, metadata, language}) => {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('metadata', JSON.stringify({...metadata, language}));

  dispatch({type: 'REQUESTING_UPLOAD_VIDEO'});

  fetch(
    `${BASE_URI}/v1/videos`,
    {
      method: 'POST',
      credentials: 'include',
      body: formData
    }
  ).then(async response => {
    if (response.ok) {
      const video = await response.json();
      dispatch({type: 'UPLOAD_VIDEO_SUCCESS', data: {
        flashMessage: {
          type: 'success',
          header: 'Success',
          body: 'Your file was successfully uploaded',
          flashDuration: 5000
        },
        video,
      }});
    }
    else {
      const error = await response.json();
      dispatch({type: 'UPLOAD_VIDEO_FAILURE', data: {
        flassMessage: {
          type: 'failure',
          header: 'Upload Failed',
          body: `There was an error: ${error}`,
          flashDuration: 5000
        },
      }});
    }
  })
};

const deleteVideo = (dispatch, id) => {
  dispatch({type: 'REQUESTING_DELETE_VIDEO'});

  return fetch(`${BASE_URI}/v1/videos/${id}`, {
    method: 'DELETE',
    credentials: 'include',
  }).then(async response => {
    if (response.ok) {
      dispatch({type: 'RECEIVED_DELETE_VIDEO', data: {id}});
    }
    else {
      const error = await response.json();
      dispatch({type: 'DELETE_VIDEO_FAILED', data: {error}});
    }
  });
};

const logout = (dispatch, navigate) => {
  dispatch({type: 'REQUESTING_LOGOUT'});

  fetch(`${BASE_URI}/v1/logout`, {
    method: 'GET',
    credentials: 'include',
  }).then(response => {
    dispatch({type: 'RECEIVED_LOGOUT'});
    navigate('/login');
  });
};

export { authenticate, logout, getVideos, uploadVideo, deleteVideo };
