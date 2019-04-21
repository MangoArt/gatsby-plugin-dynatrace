# gatsby-plugin-google-analytics

Easily add Dynatrace RUM to your Gatsby site.

By default Dynatrace will only report load actions and ignore navigation
inside the page as it relies on detection of XHR requests to determine 
significant actions. 
In order to provide some insight into user behaviour in
Gatsby this plugin uses the Dynatrace JavaScript API to report custom 
user actions to Dynatrace whenever the user navigates between pages.

NOTE: This plugin only works in production mode! To test the injections and firing of events correctly run: gatsby build && gatsby serve 

## Install

`npm install --save gatsby-plugin-dynatrace`

## How to use

```javascript
// In your gatsby-config.js
module.exports = {
  plugins: [
    {
      resolve: `@mangoart/gatsby-plugin-dynatrace`,
      options: {
        // include the Dynatrace JS Agent & enable tracking
        enabled: true,
        // your tenant id - part of the url e.g. https://YOUR_TENANT_ID.live.dynatrace.com 
        tenantId: `YOUR_TENANT_ID`, 
        // the id of the application where the user actions should be tracked. Usually this will
        // be the ID of a manually created "Agentless real user monitoring" application
        applicationId: `YOUR_APPLICATION_ID`,  
        // Dynatrace API Token, can be retrieve from Settings => Integration => Dynatrace API
        apiToken: `YOUR_API_TOKEN`,
        /*
         * How the JavaScript Agent should be embedded into the page
         * Available Modes:
         *  0 - One Agent JavaScript Tag => NOTE: Do NOT use, does not work currently
         *  1 - Asynchronous Code Snippet (~18KB)
         *  2 - Synchronous Code Snippet (~18KB)
         *  3 - Whole agent code inline (~120KB)
         */
        mode: 1
      },
    },
  ],
}
```

## JS Agent Updates & Configuration changes

The plugin fetches the JavaScript agent code & configuration directly 
from the Dynatrace API. Triggering a rebuild after configuration 
changes/JS agent updates should include the newest version in your 
Gatsby page. 

## Known limitations
 - Currently only changes to the path are reported to dynatrace, changes
   to the parameters (i.e. the search portion of the URL) are ignored due
   to https://github.com/gatsbyjs/gatsby/issues/9139.
 - ...
