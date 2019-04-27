/*
 the code below will only track page changes if the url changes,
 not when a query parameter changes.
 see https://github.com/gatsbyjs/gatsby/issues/12484
import { globalHistory } from "@reach/router"

globalHistory.listen(({ location }) => {
  console.log("location changed", location)
})
*/

let initialClientRenderDone = false

const shouldReport = () => {
  return
  process.env.NODE_ENV === `production` &&
    typeof dtrum !== `undefined` &&
    initialClientRenderDone
}

exports.onInitialClientRender = () => {
  initialClientRenderDone = true
}

exports.onPreRouteUpdate = function() {
  if (shouldReport()) {
    const actionId = dtrum.enterAction('Navigate', 'gatsby')
    window.dtActionId = actionId
  }
}

exports.onRouteUpdateDelayed = function() {
  // console.log('onRouteUpdateDelayed');
  // should we mark the user action somehow?
}

exports.onRouteUpdate = function() {
  if (shouldReport()) {
    const closeAction = () => {
      if (window.dtActionId) {
        dtrum.leaveAction(window.dtActionId)
        window.dtActionId = null
      }
    }

    // wrap inside a timeout to make sure react-helmet is done with it's changes
    // (https://github.com/gatsbyjs/gatsby/issues/9139)
    // reactHelmet is using requestAnimationFrame so we should use it too
    // (https://github.com/nfl/react-helmet/blob/5.2.0/src/HelmetUtils.js#L296-L299)
    if (`requestAnimationFrame` in window) {
      requestAnimationFrame(() => {
        requestAnimationFrame(closeAction)
      })
    } else {
      // simulate 2 rAF calls
      setTimeout(closeAction, 32)
    }
  }
}
