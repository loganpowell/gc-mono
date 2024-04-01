import "./styles.css";
import "./styles-large.css";

import { useState, useReducer } from "react";
import { injectIntl } from "react-intl";
import PropTypes from "prop-types";

import { search } from "@actions";

import SearchResult from "@components/SearchResult";
import Logo from "@assets/images/logo.png";

import { initialState, reducer } from "@reducer";

const App = ({ intl }) => {
  const [searchQuery, setSearchQuery] = useState(null);
  const [state, dispatch] = useReducer(reducer, initialState);

  return (
    <div className="App">
      <div className="links">
        <ul>
          <li>
            <a href={process.env.MEDIC_APP_URL}>
              {intl.formatMessage({ id: "medic-link" })}
            </a>
          </li>
          <li></li>
        </ul>
      </div>
      <div className="logo">
        <img src={Logo} alt="gaza care logo" />
      </div>
      <div className="app-info">{intl.formatMessage({ id: "app-info" })}</div>
      <div className="field">
        <div className="control">
          <input
            className="input"
            type="text"
            placeholder={intl.formatMessage({ id: "search" })}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>
      <div className="field">
        <div className="control">
          <button
            className="button is-primary"
            onClick={async () => {
              const language = navigator.language.split("-")[0];
              search(dispatch, searchQuery, language);
            }}
          >
            {intl.formatMessage({ id: "search" })}
          </button>
        </div>
      </div>
      <div className="videos">
        {state.searchResults.map((sr, index) => (
          <SearchResult key={index} sr={sr} />
        ))}
      </div>
    </div>
  );
};

export default injectIntl(App);

App.propTypes = {
  intl: PropTypes.object,
};
