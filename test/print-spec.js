const chai = require('chai'),
  expect = chai.expect,
  assert = chai.assert,
  ClioClass = require('../').Clio,
  Clio = require('../').loader({
    host: 'https://localhost:3000',
    env: 'dev'
  })

describe('Clio logger', function() {
  it('Instantiate logger', function() {
    assert.instanceOf(Clio, ClioClass)
  })

  describe('print', function() {
    it('Print a log message to console', function() {
      let res = Clio.print('Clio is the godes of history')

      expect(res).to.equal(0)
    })

    it('Print stack trace', function() {
      const error = new Error('Clio error!')
      let res = Clio.print(error)

      expect(res).to.equal(0)
    })

    it('Print message with stack trace', function() {
      const error = new Error('Clio error!')
      let res = Clio.print('Clio is the godes of history', error)

      expect(res).to.equal(0)
    })
  })

  describe('Clio levels', function() {
    describe('Import levels', function() {
      it('Should acquire login levels', function() {
        expect(Clio._levels).to.exist
      })
    })
  })

  describe('Mupltiple loggers', function() {
    describe('Should create two loggers with different configurations', function() {
      it('Instantiate two loggers', function() {
        const loggerOne = new ClioClass(),
          loggerTwo = new ClioClass()

        assert.instanceOf(loggerOne, ClioClass)
        assert.instanceOf(loggerTwo, ClioClass)
        expect(loggerOne).to.not.equal(loggerTwo)
      })
    })
  })

  describe('Log over HTTPS', function() {
    it('Should post log to remote server', function(done) {
      Clio.collect('Get logs from remote server', () => {
        done()
      })
    })

    it('Should post log to remote server', function(done) {
      Clio.send('Post log to remote server', () => {
        done()
      })
    })
  })
})
