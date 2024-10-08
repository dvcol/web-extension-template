import { LoggerColor } from '@dvcol/common-utils/common/logger';

import type { MessagePayload } from '~/models/message.model';

import { MessageType } from '~/models/message.model';
import { Logger } from '~/services/logger.service';
import { storage } from '~/utils/browser/browser-storage.utils';
import { initLocalI18n } from '~/utils/i18n.utils';

const onVersionUpdate = async (storageKey = MessageType.VersionUpdate) => {
  const versionUpdate = await storage.local.get<MessagePayload<typeof storageKey>>(storageKey);
  if (!versionUpdate) return;

  Logger.debug('Version updated', versionUpdate);

  await storage.local.remove(storageKey);
};

export const initServices = async (options: { option?: boolean; popup?: boolean; web?: boolean } = {}) => {
  await initLocalI18n().promise;

  Logger.info(...Logger.colorize(LoggerColor.Success, Logger.timestamp, 'All services initialized!'), options);

  onVersionUpdate().catch(Logger.error);
};
