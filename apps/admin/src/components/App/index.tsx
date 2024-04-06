import React, { useReducer, useEffect } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';

import { reducer, initialState } from '@reducer';

import { authenticate, logout } from '@actions';

const App = () => {
  const [state, dispatch] = useReducer(reducer, initialState);
  const navigate = useNavigate();

  useEffect(() => {
    if (state.user.uid) return;

    authenticate(dispatch, navigate, window.location.pathname.replace('/login', ''));
  }, [state.user.uid]);

  return (
    <div className="App">
      {
        state.user.uid && <div className="logout-button" onClick={() => logout(dispatch, navigate) }><button className="button">Logout</button></div>
      }
      <Outlet context={{state, dispatch}} />
    </div>
  );
};

export default App;
