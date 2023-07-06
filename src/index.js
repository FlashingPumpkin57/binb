import React from 'react';
import ReactDOM from 'react-dom/client';
import './style/index.css';
import Game from './components/Game';
import {
  createBrowserRouter, createRoutesFromElements, Link, Outlet,
  Route,
  RouterProvider, Routes,
} from "react-router-dom";
import {Grid, Typography} from "@mui/material";

const root = ReactDOM.createRoot(document.getElementById('root'));
const router = createBrowserRouter(
    createRoutesFromElements(
        <>
          <Route
              path="/"
              element={
                <Grid direction={'column'} spacing={4} m={4}>
                  <Grid item xs={6}>
                    <Link to={'hits'}>
                      <Typography variant={'h6'}>
                        Hits
                      </Typography>
                    </Link>
                  </Grid>
                  <Grid item xs={6}>
                    <Link to={'dutch'}>
                      <Typography variant={'h6'}>
                        Dutch
                      </Typography>
                    </Link>
                  </Grid>
                </Grid>
              }
              errorElement={'Das helemaal geen goede link joh'}
          />
          <Route path="/hits" element={<Game  />} />
          <Route path="/dutch" element={<Game />} />
        </>
    )
);

root.render(
  <>
    <RouterProvider router={router} />
  </>
);
