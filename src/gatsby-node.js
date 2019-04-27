import fetch from 'node-fetch'
import * as fs from 'fs'

exports.onPreBootstrap = function(helpers, pluginOptions) {
  const modes = ['jsTag', 'asyncCS', 'syncCS', 'jsInlineScript']
  const { tenantId, applicationId, apiToken, mode } = pluginOptions

  const { reporter } = helpers

  const urlToJSAgentSnippet = `https://${tenantId}.live.dynatrace.com/api/v1/rum/${
    modes[mode]
  }/${applicationId}?Api-Token=${apiToken}`

  return fetch(urlToJSAgentSnippet)
    .then(response => {
      // unzip and return text
      return response.text()
    })
    .then(response => {
      fs.writeFileSync('./.cache/dynatrace.js', response, { encoding: 'utf8' })
      reporter.info('Successfully retrieved dynatrace JS Agent snippet!')
    })
    .catch(error => {
      reporter.error('Failed to retrieve dynatrace JS Agent snippet!', error)
    })
}
