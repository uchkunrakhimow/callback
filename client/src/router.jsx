import { createBrowserRouter } from 'react-router-dom';
import App from './App.jsx';
import { Login, Admin, ErrorPage, Logs } from './layouts/index.jsx';

const rotuer = createBrowserRouter([
  {
    path: '/',
    element: <App />,
  },
  {
    path: '/login',
    element: <Login />,
  },
  {
    path: '/admin',
    element: <Admin />,
  },
  {
    path: '/logs',
    element: <Logs />,
  },
  {
    path: '/*',
    element: <ErrorPage />,
  },
]);

export default rotuer;
