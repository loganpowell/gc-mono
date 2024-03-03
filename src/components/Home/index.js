import { useState } from 'react';
import { useOutletContext } from 'react-router-dom';

const Home = () => {
  const { state, dispatch } = useOutletContext();

  return (
    <div className="Home">
      <h1>Hello {`${state.user.name}, `}</h1>
      <h2>Admin</h2>
    </div>
  );
};

export default Home;
