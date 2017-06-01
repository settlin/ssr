import { createValueReducer } from './utils';
import url from './url';

const platform = createValueReducer('platform', 'default');
const buildDate = createValueReducer('buildDate', 0);
const userLocale = createValueReducer('userLocale', 'en');
const user = createValueReducer('user', false);

export {
  platform,
  buildDate,
  url,
  userLocale,
  user,
};
