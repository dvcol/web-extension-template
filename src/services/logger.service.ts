import { LogLevel, ProxyLogger } from '@dvcol/common-utils/common/logger';

export class Logger {
  static logger = new ProxyLogger({
    logLevel: import.meta.env.DEV ? LogLevel.Debug : LogLevel.Warn,
  });

  static colorize = ProxyLogger.colorize;
  static get timestamp() {
    return ProxyLogger.timestamp();
  }

  static get trace() {
    return this.logger.trace as Console['trace'];
  }

  static get debug() {
    return this.logger.debug as Console['debug'];
  }

  static get info() {
    return this.logger.info as Console['info'];
  }

  static get warn() {
    return this.logger.warn as Console['warn'];
  }

  static get error() {
    return this.logger.error as Console['error'];
  }
}

export { LogLevel };
