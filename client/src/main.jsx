import { StrictMode } from 'react';
import ReactDOM from 'react-dom/client';
import { RouterProvider } from 'react-router-dom';
import router from '@/router';

import 'rsuite/dist/rsuite.min.css';
import './style.css';

// import axios from "axios";
// axios.defaults.baseURL = "http://localhost:3000";

ReactDOM.createRoot(document.getElementById('root')).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>,
);
