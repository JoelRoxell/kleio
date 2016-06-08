import jsdom from 'jsdom';
import chai, { expect } from 'chai';

// Setup testing environment to run like a browser in the command line
global.document = jsdom.jsdom(`
    <!doctype html>
      <body></body>
    </html>
  `);
global.window = global.document.defaultView;

global.navigator = window.navigator = `Node.js (${process.platform}; U; rv:${process.version}) AppleWebKit/537.36 (KHTML, like Gecko)`; // eslint-disable-line

export { expect };
