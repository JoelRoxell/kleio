import { expect } from './test-helper';
import Clio from 'clio';

// Use to describe to group together similar tests.
describe('Clio', () => {
  // Use it to test a single attribute of a target.
  it('Instantiate logger correctly', ()=> {
    // Use expect to make an assertion about a target
    const clio = new Clio();

    expect(clio).to.exist;
  });

  it('Separate host string', () => {
    const clio = new Clio('localhost:8080', 'dev');

    expect(clio.host).to.contain('localhost');
    expect(clio.port).to.equal(8080);
  });

  it('Should record an error', () =>{
    throw 'Not implemented';
  });

  it('Validate all messageing levels', () =>{
    throw 'Not implemented';
  });

  it('Structure a server request', () =>{
    throw 'Not implemented';
  });

  it('Trigger callback on response', () =>{
    throw 'Not implemented';
  });

  it('Store stacktrace in localstorage', () =>{
    throw 'Not implemented';
  });
});
