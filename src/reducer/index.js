const initialState = {
  user: {}
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
    default: {
      return state;
    }
  }
};

export { initialState, reducer };
