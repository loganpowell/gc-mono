// import "./styles.css";
// import "./styles-large.css";

import React, { useState, useReducer } from "react";
import { injectIntl } from "react-intl";
// import PropTypes from "prop-types";

import { search } from "@actions";
import { SearchBar } from "@ui/search-bar";
import SearchResult from "@components/SearchResult";
import Logo from "@assets/images/logo.png";

import { initialState, reducer } from "@reducer";

const App = ({ intl }) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [state, dispatch] = useReducer(reducer, initialState);

  return (
    <div className="py-3 px-3">
      <div className="w-80">
        <ul>
          <li>
            <a href={process.env.MEDIC_APP_URL}>
              {intl.formatMessage({ id: "medic-link" })}
            </a>
          </li>
        </ul>
      </div>
      <div className="w-1/4 m-auto">
        <img src={Logo} alt="gaza care logo" />
      </div>
      <div className="text-center">
        {intl.formatMessage({ id: "app-info" })}
      </div>
      <div className="m-6">
        <SearchBar
          onClick={async () => {
            const language = navigator.language.split("-")[0];
            console.log({ searchQuery, language });
            search(dispatch, searchQuery, language);
          }}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder={intl.formatMessage({ id: "search" })}
        />
      </div>
      <div className="flex flex-col max-w-xl md:mx-auto">
        {state.searchResults.map((sr, index) => {
          console.log({ sr });
          return <SearchResult key={index} sr={sr} />;
        })}
      </div>
    </div>
  );
};

export default injectIntl(App);

// App.propTypes = {
//   intl: PropTypes.object,
// };
