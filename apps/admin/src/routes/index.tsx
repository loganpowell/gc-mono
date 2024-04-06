import App from '@components/App';
import Home from '@components/Home';
import Login from '@components/Login';

const routes = {
  path: '/',
  element: <App />,
  children: [
    {index: true, element: <Home />},
    {path: '/login', element: <Login />}
  ]
};

export { routes };
