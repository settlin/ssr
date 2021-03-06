import React from 'react';
import PropTypes from 'prop-types';
import Helmet from 'react-helmet';
import { Route, Switch, Link, withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import omit from 'lodash/omit';
import { pure, collectionAdd, logger, BrowserStats, UserStats, valueSet } from 'meteor/ssrwpo:ssr';
import { bgColor, secondaryColor } from '/imports/styles/colors';
// Collections
import FolksCollection from '/imports/api/Folks';
import PlacesCollection from '/imports/api/Places';
// Components
import TransitionLogger from '/imports/components/TransitionLogger';
import Privateroute from '/imports/components/Privateroute';
// Pages import
import Home from '/imports/routes/Home';
import Protected from '/imports/routes/Protected';
import Login from '/imports/routes/Login';
import Folks from '/imports/routes/Folks';
import Places from '/imports/routes/Places';
import Translations from '/imports/routes/Translations';
import TranslationsAsync from '/imports/routes/TranslationsAsync';
import Performance from '/imports/routes/Performance';
import PubSub from '/imports/routes/PubSub';
import AsyncData from '/imports/routes/AsyncData';
import AsymetricSsr from '/imports/routes/AsymetricSsr';
import Topics from '/imports/routes/Topics';
import About from '/imports/routes/About';
import NotFound from '/imports/routes/NotFound';

// This function will be called by the server to prepare the store before the
// server-side rendering. Since we may wish to prepare the same store from several
// different components, it's good practise to ensure that the function can only be
// called once
export const prepareGlobalStores = (store) => {
  const { areGlobalStoresInitialised } = store.getState();
  if (!areGlobalStoresInitialised) {
    logger.debug('Preparing Folks and Places store');
    const globalCollections = [
      { collection: PlacesCollection, name: 'Places' },
      { collection: FolksCollection, name: 'Folks' },
    ];
    globalCollections.forEach(({ collection, name }) =>
      collection.find({}, { sort: { order: -1 } }).fetch().forEach(item =>
        // eslint-disable-next-line no-underscore-dangle
        store.dispatch(collectionAdd(name, item._id, omit(item, '_id'))),
      ),
    );
    store.dispatch(valueSet('areGlobalStoresInitialised', true));
  }
};

const MainApp = ({ user }) => {
  const styles = {
    ul: { listStyleType: 'none', padding: 0, textAlign: 'center' },
    li: { display: 'inline', margin: 5 },
  };
  return (
    <div>
      <Helmet>
        <meta charSet="utf-8" />
        <meta httpEquiv="x-ua-compatible" content="ie=edge" />
        <title>SSR</title>
        <meta name="description" content="Router with SSR for Node & Meteor" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png?v=2" />
        <link rel="icon" type="image/png" href="/favicon-32x32.png?v=2" sizes="32x32" />
        <link rel="icon" type="image/png" href="/favicon-16x16.png?v=2" sizes="16x16" />
        <link rel="manifest" href="/_manifest.json?v=2" />
        <link rel="mask-icon" href="/safari-pinned-tab.svg?v=2" color={secondaryColor} />
        <link rel="shortcut icon" href="/favicon.ico?v=2" />
        <meta name="apple-mobile-web-app-title" content="SSR" />
        <meta name="application-name" content="SSR" />
        <meta name="theme-color" content={bgColor} />
      </Helmet>
      <TransitionLogger />
      <BrowserStats />
      <UserStats />
      <nav>
        <ul style={styles.ul}>
          <li style={styles.li}><Link to="/">Home</Link></li>
          {!user && <li style={styles.li} ><Link to="/login">Login</Link></li>}
          <li style={styles.li}><Link to="/protected">Protected</Link></li>
          <li style={styles.li}><Link to="/folks">Folks</Link></li>
          <li style={styles.li}><Link to="/places">Places</Link></li>
          <li style={styles.li}><Link to="/translations">Translations</Link></li>
          <li style={styles.li}><Link to="/translations-async">Async Translations</Link></li>
          <li style={styles.li}><Link to="/performance">Performance</Link></li>
          <li style={styles.li}><Link to="/pubsub">Reactive cases</Link></li>
          <li style={styles.li}><Link to="/async">Asynchronous data</Link></li>
          <li style={styles.li}><Link to="/asymetric-ssr">Asymetric SSR</Link></li>
          <li style={styles.li}><Link to="/topics">Topics</Link></li>
          <li style={styles.li}><Link to="/about">About</Link></li>
          <li style={styles.li}><Link to="/will-not-match">Will not match</Link></li>
        </ul>
      </nav>
      <main>
        <Switch>
          <Route exact path="/" component={Home} />
          <Privateroute path="/protected" component={Protected} />
          <Route path="/login" component={Login} />
          <Route path="/folks/:folkId" component={Folks} />
          <Route exact path="/folks" component={Folks} />
          <Route exact path="/places" component={Places} />
          <Route exact path="/translations-async" component={TranslationsAsync} />
          <Route exact path="/translations" component={Translations} />
          <Route exact path="/performance" component={Performance} />
          <Route exact path="/pubsub" component={PubSub} />
          <Route exact path="/async" component={AsyncData} />
          <Route exact path="/asymetric-ssr" component={AsymetricSsr} />
          <Route path="/topics" component={Topics} />
          <Route exact path="/about" component={About} />
          <Route component={NotFound} />
        </Switch>
      </main>
    </div>
  );
};

// SSR requirements for this component
MainApp.ssr = {
  // If you supply a `prepareStore` function on any component then it will be called
  // to hydrate the store for server-side-rendering.
  // This pre-hydrated store will also be send with the initial  HTML payload.
  //
  // Here we're adding it to the top-level to hydrate the Folks and Places stores
  // globally for the entire app.
  prepareStore: prepareGlobalStores,
};

MainApp.propTypes = {
  user: pt.oneOfType([pt.object, pt.bool]).isRequired,
};

export default withRouter(connect((state => ({ user: state.user })))(pure(MainApp)));
