import Clio from './clio';
import log from './models/log';

const loader = (config = {}) => new Clio(config.host, config.env);

export {
  Clio,
  loader
};
