const initialState = {
  loading: false,
  searchResults: [],
};

const reducer = (state, action) => {
  switch (action.type) {
    case "REQUESTING_SEARCH": {
      return {
        ...state,
        loading: true,
      };
    }
    case "RECEIVED_SEARCH_RESULTS": {
      return {
        ...state,
        loading: false,
        searchResults: action.data,
      };
    }
    default:
      return state;
  }
};

export { initialState, reducer };
