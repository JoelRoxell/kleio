/* eslint no-unused-expressions: "off" */
import { expect } from './test-helper';
import Clio from 'clio';
import Log from 'models/log';

// Use to describe to group together similar tests.
describe('Clio', () => {
  let clio = null;

  beforeEach(() => {
    const socket = 'localhost:8080',
        env = 'dev';

    clio = new Clio(socket, env);
  });

  // Use it to test a single attribute of a target.
  it('Instantiate logger correctly', () => {
    // Use expect to make an assertion about a target
    expect(clio).to.exist;
  });

  it('Separate host string', () => {
    expect(clio.host).to.contain('localhost');
    expect(clio.port).to.equal(8080);
  });

  it('Record an error', () => {
    const log = clio.record('Test', Clio.levels.VERBOSE, 'stack', {
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
    throw 'Not implemented';
  });

  it('Structure a server request', () => {
    throw 'Not implemented';
  });

  it('Trigger callback on response', () => {
    throw 'Not implemented';
  });

  it('Store stacktrace in localstorage', () => {
    throw 'Not implemented';
  });

  describe('Log', () => {
    it('Instantiate', () => {
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
