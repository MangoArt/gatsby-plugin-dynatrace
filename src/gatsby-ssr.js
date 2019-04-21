import React from 'react';
import * as fs from 'fs';
import HTMLReactParser from 'html-react-parser';

exports.onRenderBody = function(apiCallbackContext, pluginOptions) {

  if (process.env.NODE_ENV !== `production` && process.env.NODE_ENV !== `test`) {
    return null
  }

  const { mode, enabled } = pluginOptions;
  var script = fs.readFileSync("./.cache/dynatrace.js", {encoding: 'utf-8'});
  var parsedScript = HTMLReactParser(script);

  if (!parsedScript || !enabled) {
    return false;
  }

  const {
    setHeadComponents,
  } = apiCallbackContext;

  const setComponents = setHeadComponents;

  if (mode === 0) {
    return setComponents([
      <script
        key="gatsby-plugin-dynatrace"
        src={parsedScript.props.src}
        data-dtconfig={parsedScript.props['data-dtconfig']}
        crossorigin="anonymous"
      />,
    ]);
  } else if (mode === 1 || mode === 2) {
    return setComponents([
      <script
        key="gatsby-plugin-dynatrace"
        type="text/javascript"
        dangerouslySetInnerHTML={parsedScript.props.dangerouslySetInnerHTML}
      />,
    ]);
  } else if (mode === 3) {
    return setComponents([
      <script
        key="gatsby-plugin-dynatrace"
        type="text/javascript"
        data-dtconfig={parsedScript.props['data-dtconfig']}
        dangerouslySetInnerHTML={parsedScript.props.dangerouslySetInnerHTML}
      />,
    ]);
  }
}
