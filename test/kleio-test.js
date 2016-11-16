import { expect } from 'chai';
import sinon from 'sinon';
import R from 'ramda';

import kleio, { LEVELS } from 'kleio';

describe('kleio', function() {
  let log;

  beforeEach(function() {
    let postMethod = function post(payload) {
      return new Promise(function fetch(resolve, reject) {
        if (payload) {
          resolve(payload);
        } else {
          reject(new Error('Failed to post log'));
        }
      });
    };

    log = kleio('production')(postMethod);
  });

  it('should currey and call the function if all parameters are passed.', function() {
    const callback = sinon.spy();
    const log = kleio('production')(callback)('msg')(LEVELS.SILENT)({});

    expect(callback.calledOnce).to.equal(true);
  });

  it('should not run post callback in development mode', function() {
    const callback = sinon.spy();
    const log = kleio('development')(callback)('msg')(LEVELS.SILENT)({});

    expect(callback.calledOnce).to.equal(false);
  });

  it('should use use post function and throw error', function(done) {
    log(R._)(LEVELS.ERROR)({}).catch(err => {
      expect(err).to.exist;

      done();
    });
  });

  it('should use use post function and succeed', function(done) {
    log('msg')(LEVELS.ERROR)({}).then(res => {
      expect(res).to.have.property('message', 'msg');
      expect(res).to.have.property('severity', 0);

      done();
    }).catch(err => {
      throw err;
    });
  });

  it('log levels should be specifed', function() {
    expect(LEVELS).to.deep.equal({
      ERROR: 0,
      WARN: 1,
      INFO: 2,
      VERBOSE: 3,
      DEBUG: 4,
      SILLY: 5,
      SILENT: 6
    });
  });
});
