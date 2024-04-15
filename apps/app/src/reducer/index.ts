import * as MESSAGES from "@lang/index.js";
const initialState = {
  loading: false,
  searchResults: [],
  locale: navigator.language.includes("en") ? "en" : "ar",
  messages: navigator.language.includes("en")
    ? MESSAGES.ENGLISH
    : MESSAGES.ARABIC,
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
    case "CHANGE_LOCALE": {
      const getMessages = (locale) => {
        switch (locale) {
          case "en":
            return MESSAGES.ENGLISH;
          case "ar":
            return MESSAGES.ARABIC;
          default:
            return MESSAGES.ARABIC;
        }
      };
      return {
        ...state,
        locale: action.data,
        messages: getMessages(action.data),
      };
    }

    default:
      return state;
  }
};

export { initialState, reducer };
