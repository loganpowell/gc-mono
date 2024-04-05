const initialState = {
  user: {}
};

const reducer = (state, action) => {
  switch (action.type) {
    case 'RECEIVED_AUTH': {
      return {
        ...state,
        user: {...action.data},
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
