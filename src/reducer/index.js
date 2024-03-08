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
            ...action.data.users,
            ...action.data.user_identities,
            profile: JSON.parse(action.data.user_identities.profile)
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
