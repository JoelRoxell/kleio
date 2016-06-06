/* eslint no-unused-expressions: "off" */
import { expect } from './test-helper';
import Kleio from 'kleio';
import Log from 'models/log';
import distKleio from '../dist';

// Use to describe to group together similar tests.
describe('Kleio', () => {
  let kleio = null;

  beforeEach(() => {
    const socket = 'http://localhost:80',
        env = 'dev';

    kleio = new Kleio(socket, env);
  });

  // Use it to test a single attribute of a target.
  it('Instantiate logger correctly', () => {
    // Use expect to make an assertion about a target
    expect(kleio).to.exist;
  });

  it('Separate host string', () => {
    expect(kleio.host).to.contain('http://localhost');
    expect(kleio.port).to.equal(80);
  });

  it('Record an error', () => {
    let logger = new Kleio('https://logger.dev/stack:80', Kleio.ENV_MODES.PROD, log => {
      // Perform server communication...
      return log;
    });

    const log = logger.record('Test', Kleio.levels.VERBOSE, 'stack', {
      context: 'test issue'
    });

    expect(log).deep.equal({
      description: 'Test',
      stackTrace: 'stack',
      level: 3,
      data: { context: 'test issue' }
    });
  });

  it('Validate all messageing levels', () => {
    expect(Kleio.levels).to.deep.equal({
      ERROR: 0,
      WARN: 1,
      INFO: 2,
      VERBOSE: 3,
      DEBUG: 4,
      SILLY: 5
    });
  });

  describe('Log', () => {
    it('Instantiate model', () => {
      const error = `Error: stackTrace\n at Context.<anonymous>`,
          log = new Log(
            'Test log init',
            Kleio.levels.ERROR,
            error,
            { additionalData: true }
          );

      expect(log).deep.equal({
        description: 'Test log init',
        level: 0,
        stackTrace: error,
        data: { additionalData: true }
      });
    });
  });

  describe('Export', () => {
    it('Eport kleio dist properly', () => {
      expect(Object.getPrototypeOf(Kleio))
        .to.equal(Object.getPrototypeOf(distKleio));
    });
  });
});
