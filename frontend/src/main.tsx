import React from 'react';
import ReactDOM from 'react-dom/client';
import "../src/style/css/iconsax.css";
import ALLRoutes from './feature-module/router/router';
import { BrowserRouter } from 'react-router-dom';
import { UserProvider } from './core/context/UserContext'
import { base_path } from './environment.tsx';
import "../node_modules/bootstrap/dist/css/bootstrap.min.css";
import './index.scss';
import { Provider } from 'react-redux';
import store from './core/redux/store';
import "../node_modules/@tabler/icons-webfont/dist/tabler-icons.css";
import "../node_modules/@fortawesome/fontawesome-free/css/fontawesome.min.css";
import "../node_modules/@fortawesome/fontawesome-free/css/all.min.css";
import "../node_modules/bootstrap/dist/js/bootstrap.bundle.min.js";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
  <React.StrictMode>
    <Provider store={store}>
      <BrowserRouter basename={base_path}>
        <UserProvider>
          <ALLRoutes />
           <ToastContainer
            position="top-right"
            autoClose={5000}
            hideProgressBar={false}
            newestOnTop={false}
            closeOnClick
            rtl={false}
            pauseOnFocusLoss
            draggable
            pauseOnHover
            theme="light"
          />
        </UserProvider>
      </BrowserRouter>
    </Provider>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
