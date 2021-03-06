import React, { Component } from 'react';
import { withRouter, Switch, Route, Redirect } from 'react-router-dom';

import HomePage from './pages/homepage/homepage.component';
import ShopPage from './pages/shop/shop.component';
import Header from './components/header/header.component';
import SignInAndSignUpPage from './pages/sign-in-and-sign-up/sign-in-and-sign-up.component';
import CheckoutPage from './pages/checkout/checkout.component';
import ContactPage from './pages/contact/contact.component';
import ToastNotification from './components/toast-notification/toast-notif.component';
import Footer from './components/footer/footer.component';

import { displayToast } from './redux/toast-notif/toast-notif.actions';
import { toastMessages } from './redux/toast-notif/toast-notif.messages';

import { connect } from 'react-redux';
import { setCurrentUser } from './redux/user/user.actions';
import { createStructuredSelector } from 'reselect';
import { selectCurrentUser } from './redux/user/user.selectors';

import { auth, createUserProfileDocument } from './firebase/firebase.utils';
import { onSnapshot } from 'firebase/firestore';

import { INVERSE_STYLE_PAGES } from './pages/page-styling/inverse-styling.data';
import './App.css';

class App extends Component {
  unsubscribeFromAuth = null;

  componentDidMount() {
    const { setCurrentUserProp } = this.props;
    // Default toast styling
    let toastType = 'success';

    // Google User Authentication + Creation (stored in Firestore)
    this.unsubscribeFromAuth = auth.onAuthStateChanged(async userAuth => {
      if (userAuth) {
        const userRef = await createUserProfileDocument(userAuth);

        onSnapshot(userRef, (snapshot) => {
          setCurrentUserProp({
              id: snapshot.id,
              ...snapshot.data()
          });
        })
    
        this.props.displayToastProp({
          ...toastMessages[toastType],
          title: `Welcome back`,
          description: `Successfully signed in`,
        })
        
      }
      else {
        setCurrentUserProp(userAuth);
      }
    })
  }

  componentWillUnmount() {
    this.unsubscribeFromAuth();
  }

  render() {
    const { currentUserProp } = this.props;
    const { pathname } = this.props.location;

    return  (
      <div id="page-container">
        <div className={`content-wrap ${INVERSE_STYLE_PAGES.includes(pathname) ? 'inverse' : ''}`}>
          <Header />
          <div className="content">
            <ToastNotification />      
            <Switch>
              <Route exact path='/' component={HomePage} />
              <Route path='/shop' component={ShopPage} />
              <Route exact path='/contact' component={ContactPage} />
              <Route exact path='/checkout' component={CheckoutPage} />
              <Route exact path='/signin' render={() => currentUserProp ? 
                (<Redirect to='/' />) 
                : 
                (<SignInAndSignUpPage /> )
                } 
              />    
            </Switch>
          </div>
        </div>
        <Footer />
      </div>
    )
  };
}

const mapStateToProps = createStructuredSelector({
  currentUserProp: selectCurrentUser,
});

const mapDispatchToProps = dispatch => ({
  setCurrentUserProp: user => dispatch(setCurrentUser(user)),
  displayToastProp: content => dispatch(displayToast(content))
});

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(App));
