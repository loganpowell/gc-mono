const initialState = {
  flashMessage: {},
  user: {},
  uploadsByID: {},
  uploads: {
    pending: [],
    approved: []
  },
};

const groupByStatus = uploads => {
  console.log('got uploads!!', uploads)
  return Object.values(uploads).reduce((r, v) => {
    r[v.status] ||= [];
    r[v.status].push(v);

    return r;
  }, {});
};

const reducer = (state, action) => {
  switch (action.type) {
    case 'RECEIVED_AUTH': {
      return {
        ...state,
        ...{
          user: {
            ...action.data,
            profile: JSON.parse(action.data.profile)
          }
        }
      };
    }
    case 'RECEIVED_LOGOUT': {
      return {
        ...state,
        user: {}
      }
    }
    case 'REQUESTING_VIDEOS': {
      return {
        ...state,
        loading: true,
      }
    }
    case 'RECEIVED_VIDEOS': {
      const byID = action.data.reduce((r, v) => {
        r[v.id] = v;
        return r;
      }, {});

      return {
        ...state,
        loading: false,
        uploadsByID: byID,
        uploads: groupByStatus(byID),
      }
    }
    case 'REQUESTING_UPLOAD_VIDEO': {
      return {
        ...state,
        uploadingVideo: true,
      };
    }
    case 'UPLOAD_VIDEO_SUCCESS': {
      const uploadsByID = {
        ...state.uploadsByID,
        [action.data.video.id]: action.data.video,
      };

      return {
        ...state,
        flashMessage: action.data.flashMessage,
        uploadingVideo: false,
        uploadsByID,
        uploads: groupByStatus(uploadsByID)
      };
    }
    case 'UPLOAD_VIDEO_FAILURE': {
      return {
        ...state,
        flashMessage: action.data.flashMessage,
      };
    }
    case 'REQUESTING_DELETE_VIDEO': {
      return {
        ...state,
        loading: true,
      }
    }
    case 'RECEIVED_DELETE_VIDEO': {
      const uploadsByID = Object.values(state.uploadsByID).reduce((r, u) => {
        if (u.id === action.data.id) return r;

        r[u.id] = u;
        return r;
      }, {});

      return {
        ...state,
        loading: false,
        uploadsByID,
        uploads: groupByStatus(uploadsByID)
      }
    }
    case 'DELETE_VIDEO_FAILED': {
      return {
        ...state,
        loading: false,
        flashMessage: {
          type: 'failure',
          header: 'Delete video failed',
          body: `Error deleting video: ${action.data.error}`,
          flashDuration: 5000
        }
      };
    }
    case 'CLEAR_FLASH_MESSAGE': {
      return {
        ...state,
        flashMessage: {},
      };
    }
    default: {
      return state;
    }
  }
};

export { initialState, reducer };
