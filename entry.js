import { AppContainer } from 'react-hot-loader';

import AppComponent from 'react-heatpack-script-alias'
import React from 'react-heatpack-react-alias'
import ReactDOM from 'react-heatpack-react-dom-alias'

var alreadyRendered = document.querySelector('#app').childNodes.length > 0

function render(Component) {
  // Don't attempt to render if there was already something rendered in #app,
  // or if nothing was exported (assumption: they rendered somewhere else and
  // didn't export anything)
  if (
    alreadyRendered || !(
      typeof Component === 'function' || Object.keys(Component).length > 0
    )
  ) {
    return
  }

  // Assumption: either a React component or element was exported
  // If a React component was exported, create an element
  if (typeof Component === 'function' || !(Component.type && Component.props)) {
    Component = <Component />
  }

  // Component should now be a React element
  let rootEl = document.querySelector('#app')
  ReactDOM.render(<AppContainer children={Component} />, rootEl)
}

render(AppComponent)

if (module.hot) {
  module.hot.accept('react-heatpack-script-alias', function() {
    render(require('react-heatpack-script-alias').default)
  })
}
