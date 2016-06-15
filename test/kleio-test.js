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
  it('Instantiate logger correctly.', () => {
    // Use expect to make an assertion about a target
    expect(kleio).to.exist;
  });

  it('Separate host string.', () => {
    expect(kleio.host).to.contain('http://localhost');
    expect(kleio.port).to.equal(80);
  });

  it('Record an error to remote host.', () => {
    let logger = new Kleio('https://logger.dev/stack:80', Kleio.ENV_MODES.PROD, log => {
      // Perform server communication...
      return log;
    });

    const log = logger.record(
      'Title',
      'description',
      Kleio.levels.VERBOSE,
      'stack',
      {
        context: 'test issue'
      }
    );

    expect(log).deep.equal({
      data: {
        type: 'log',
        id: logger.id,
        attributes: {
          title: 'Title',
          description: 'description',
          level: Kleio.levels.VERBOSE,
          stackTrace: 'stack',
          data: { context: 'test issue' },
          userAgent: navigator.userAgent
        }
      }
    });
  });

  it('Log an error to console', () => {
    kleio.record(
      'Console log test',
      'Log description',
      Kleio.levels.ERROR,
      'My Stack trace', {
        error: true
      });
  });

  it('Validate all messageing levels.', () => {
    expect(Kleio.levels).to.deep.equal({
      ERROR: 0,
      WARN: 1,
      INFO: 2,
      VERBOSE: 3,
      DEBUG: 4,
      SILLY: 5
    });
  });

  it('Compose a post log object based on <json:api> standard.', () => {
    let logger = new Kleio('https://logger.dev/stack:80', Kleio.ENV_MODES.PROD, log => {
      // Perform server communication...
      return log;
    });

    const log = logger.record(
      'Log title',
      'log description',
      Kleio.levels.INFO,
      'log stack', {
        additionalData: 'test issue #2'
      }
    );

    expect(log).deep.equal({
      data: {
        type: 'log',
        id: logger.id,
        attributes: {
          title: 'Log title',
          description: 'log description',
          level: Kleio.levels.INFO,
          stackTrace: 'log stack',
          userAgent: navigator.userAgent,
          data: {
            additionalData: 'test issue #2'
          }
        }
      }
    });
  });

  describe('Log', () => {
    it('Instantiate model.', () => {
      const error = `Error: stackTrace\n at Context.<anonymous>`,
          log = new Log(
            'Test title',
            'Test log init',
            Kleio.levels.ERROR,
            error,
            { additionalData: true }
          );

      expect(log).deep.equal({
        title: 'Test title',
        description: 'Test log init',
        level: 0,
        stackTrace: error,
        data: { additionalData: true }
      });
    });
  });

  describe('Export', () => {
    it('Eport kleio dist properly.', () => {
      expect(Object.getPrototypeOf(Kleio))
        .to.equal(Object.getPrototypeOf(distKleio));
    });
  });
});
