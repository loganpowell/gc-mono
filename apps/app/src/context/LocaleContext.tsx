import React, { createContext, useContext, useReducer } from "react";
import { IntlProvider } from "react-intl";
import { initialState, reducer } from "@reducer";
// import PropTypes from "prop-types";

const LocaleContext = createContext({
  state: initialState,
  dispatch: (x) => {},
});

export const LocaleProvider = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, initialState);
  const { locale, messages } = state;

  return (
    <LocaleContext.Provider value={{ state, dispatch }}>
      <IntlProvider locale={locale} messages={messages}>
        {children}
      </IntlProvider>
    </LocaleContext.Provider>
  );
};

// LocaleProvider.propTypes = {
//   children: PropTypes.node.isRequired,
// };

export const useLocale = () => useContext(LocaleContext);
