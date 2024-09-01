import { ProxyLogger } from '@dvcol/common-utils/common/logger';

export class Logger {
  static logger = new ProxyLogger();

  static colorize = ProxyLogger.colorize;

  static get timestamp() {
    return ProxyLogger.timestamp();
  }

  static get debug() {
    return this.logger.debug;
  }

  static get info() {
    return this.logger.info;
  }

  static get warn() {
    return this.logger.warn;
  }

  static get error() {
    return this.logger.error;
  }
}
