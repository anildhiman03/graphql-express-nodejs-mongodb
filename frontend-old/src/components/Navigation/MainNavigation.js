import React from 'react';
import { NavLink } from 'react-router-dom';
import AuthContext from '../../context/auth-context';

import './main-nav.css';
import authContext from '../../context/auth-context';

const mainNavigation = props => (
  <authContext.Consumer>
    {(context) => {
      return (
        <header className="main-navigation">
          <div className="main-navigation__logo">
            <h1>EasyEvent</h1>
          </div>
          <nav className="main-navigation__items">
            <ul>
              {!context.token && (
                <li>
                  <NavLink to="/auth">Authenticate</NavLink>
                </li>
              )
              }
              <li>
                <NavLink to="/events">Events</NavLink>
              </li>
              {context.token &&
                (
                  <li>
                  <NavLink to="/bookings">Bookings</NavLink>
                </li>
              )
              }
            </ul>
          </nav>
        </header>
        )
    }}
  </authContext.Consumer>
);

export default mainNavigation;