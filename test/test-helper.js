import jsdom from 'jsdom';
import chai, { expect } from 'chai';

// Setup testing environment to run like a browser in the command line
global.document = jsdom.jsdom(`
    <!doctype html>
      <body></body>
    </html>
  `);
global.window = global.document.defaultView;

export { expect }
