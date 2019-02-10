const ReactGA = require('react-ga');

ReactGA.initialize('UA-63312977-14');

exports.onRouteUpdate = (state, page, pages) => {
  ReactGA.pageview(state.location.pathname);
};
