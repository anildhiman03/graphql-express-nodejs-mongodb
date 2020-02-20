import React from 'react';
import { BrowserRouter, Route, Redirect, Switch } from 'react-router-dom';
import './App.css';

import AuthPage from './pages/Auth';
import BookingsPage from './pages/Bookings';
import EventsPage from './pages/Events';
import MainNavigation from './components/Navigation/MainNavigation';
import AuthContext from './context/auth-context'
function App(login,logout) {

  const state = {
    token: null,
    userId: null
  }

  return (
    <BrowserRouter>
      <React.Fragment>  {/* save as ng-template for angular just wrapper */}
        <AuthContext.Provider value={{
          token: state.token,
          userId: state.userId,
          login: (token,userId, tokenExpiration) => {
            this.state({token:token,userId:userId})
          },
          logout:() => {
            this.state({token:null,userId:null})
          }
        }}>
          <MainNavigation />
          <main className="main-content">
            <Switch>
              <Redirect from="/" to="/auth" exact />
              <Route path="/auth" component={AuthPage}></Route>
              <Route path="/events" component={EventsPage}></Route>
              <Route path="/bookings" component={BookingsPage}></Route>
            </Switch>
            </main>
          </AuthContext.Provider>
      </React.Fragment>
    </BrowserRouter>
  );
}

export default App;
