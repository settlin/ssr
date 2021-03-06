import React from 'react';
import PropTypes from 'prop-types';
import { pure, changeLanguage, valueSet } from 'meteor/ssrwpo:ssr';
import Helmet from 'react-helmet';
import { FormattedMessage, FormattedDate } from 'react-intl';
import pick from 'lodash/pick';
import { connect } from 'react-redux';

const Translations = ({ languageChanger, intl }) => (
  <div>
    <Helmet title="Translations" />
    <h2>Translation from Messages</h2>
    {Meteor.settings.public.localization.async
    ? <p>You should set &quot;localization.async: false&quot;
        in settings.json to try synchronous translations </p>
    : <div>
      <br />
      <button onClick={() => languageChanger('en')}>English</button>
      <button onClick={() => languageChanger('fr')}>Français</button>
      <button onClick={() => languageChanger('tr')}>Türkçe</button>
      <br />
      <p>
        <FormattedMessage
          id="app.currentLanguage"
          values={{ language: intl.locale }}
        />
      </p>
      <h2><FormattedMessage id="app.greetings" defaultMessage="你好!" /></h2>
      <h3>
        <FormattedDate
          value={new Date()}
          year="numeric"
          month="long"
          day="numeric"
          weekday="long"
        />
      </h3>
    </div>
    }
  </div>
);
Translations.propTypes = {
  languageChanger: PropTypes.func.isRequired,
  intl: PropTypes.object.isRequired,
};
const mapStateToProps = state => pick(state, ['intl']);
const mapDispatchToProps = dispatch => ({
  languageChanger(locale) {
    dispatch(valueSet('userLocale', locale));
    dispatch(changeLanguage({ locale }));
  },
});
export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(pure(Translations));
