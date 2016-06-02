/* eslint no-unused-expressions: "off" */
import { expect } from './test-helper';
import Clio from 'clio';
import Log from 'models/log';

// Use to describe to group together similar tests.
describe('Clio', () => {
  let clio = null;

  beforeEach(() => {
    const socket = 'http://localhost:80',
        env = 'dev';

    clio = new Clio(socket, env);
  });

  // Use it to test a single attribute of a target.
  it('Instantiate logger correctly', () => {
    // Use expect to make an assertion about a target
    expect(clio).to.exist;
  });

  it('Separate host string', () => {
    expect(clio.host).to.contain('http://localhost');
    expect(clio.port).to.equal(80);
  });

  it('Record an error', () => {
    let logger = new Clio('http://logger.dev/stack:80', Clio.ENV_MODES.PROD, log => {
      // Perform server communication...
      return log;
    });

    const log = logger.record('Test', Clio.levels.VERBOSE, 'stack', {
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
    expect(Clio.levels).to.deep.equal({
      ERROR: 0,
      WARN: 1,
      INFO: 2,
      VERBOSE: 3,
      DEBUG: 4,
      SILLY: 5
    });
  });

  it('Store stacktrace in localstorage', () => {
    throw new Error('Not implemented');
  });

  describe('Log', () => {
    it('Instantiate model', () => {
      const error = `Error: stackTrace\n at Context.<anonymous>`,
          log = new Log(
            'Test log init',
            Clio.levels.ERROR,
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
});
