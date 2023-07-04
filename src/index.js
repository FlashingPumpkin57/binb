import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import {
  createBrowserRouter, createRoutesFromElements, Link, Outlet,
  Route,
  RouterProvider, Routes,
} from "react-router-dom";
import {Box} from "@mui/material";

const root = ReactDOM.createRoot(document.getElementById('root'));
const router = createBrowserRouter(
    createRoutesFromElements(
        <>
          <Route
              path="/"
              element={
                <Box display={'flex'} flexDirection={'column'}>
                  <Link to={"hits"}>Hits</Link>
                  <Link to={"dutch"}>Dutch</Link>
                </Box>
              }
              errorElement="Das helemaal geen goede link joh"
          />
          <Route path="/hits" element={<App />} />
          <Route path="/dutch" element={<App />} />
        </>
    )
);

root.render(
  <>
    <RouterProvider router={router} />
  </>
);
