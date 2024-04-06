import React, { useReducer, useEffect } from "react";
import { Outlet, useNavigate } from "react-router-dom";

import { reducer, initialState } from "@reducer";

import { authenticate, logout } from "@actions";

// import './styles.css';

const App = () => {
  const [state, dispatch] = useReducer(reducer, initialState);
  const navigate = useNavigate();

  return (
    <div className="App">
      {state.user.uid && (
        <div
          className="logout-button"
          onClick={() => logout(dispatch, navigate)}
        >
          <figure className="image is-48x48">
            <img className="is-rounded" src={state.user?.profile?.picture} />
          </figure>
        </div>
      )}
      <Outlet context={{ state, dispatch }} />
    </div>
  );
};

export default App;
