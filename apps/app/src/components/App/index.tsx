import React, { useState, useReducer } from "react";
import { injectIntl } from "react-intl";

import Logo from "@assets/images/logo.png";
import { search } from "@actions";
import { SearchBar } from "@ui/search-bar";
import SearchResult from "@components/SearchResult";

import { initialState, reducer } from "@reducer";
import { CategoryCard } from "@components/category";
import { GazaBanner } from "@components/banner";

const App = ({ intl }) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [state, dispatch] = useReducer(reducer, initialState);

  return (
    <div className="py-3 px-3 w-full items-center">
      <div className="w-80">
        <ul>
          <li>
            <a href={process.env.VITE_MEDIC_APP_URL}>
              {intl.formatMessage({ id: "medic-link" })}
            </a>
          </li>
        </ul>
      </div>
      <GazaBanner img={Logo} message={intl.formatMessage({ id: "app-info" })} />

      <div className="mx-auto max-w-xs p-3">
        <div className="aspect-w-1 aspect-h-1">
          <div className="grid grid-cols-2 gap-4">
            <CategoryCard img={Logo} link="#" title="Wound Care" />
            <CategoryCard img={Logo} link="#" title="Burn Care" />
            <CategoryCard img={Logo} link="#" title="Stopping Bleeding" />
            <CategoryCard img={Logo} link="#" title="Resuscitation" />
          </div>
        </div>
      </div>

      <div className="fixed bottom-0 left-0 w-full bg-white shadow-md p-4">
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

      <div className="w-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {state.searchResults.map((sr, index) => {
          console.log({ sr });
          return <SearchResult key={index} sr={sr} />;
        })}
      </div>
    </div>
  );
};

export default injectIntl(App);
