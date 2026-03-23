import type { MessagePayload } from '~/models/message.model';
import type { DefineOption } from '~/web/define-component';

import { LoggerColor } from '@dvcol/common-utils/common/logger';

import { MessageType } from '~/models/message.model';
import { Logger } from '~/services/logger.service';
import { storage } from '~/utils/browser/browser-storage.utils';
import { initLocalI18n } from '~/utils/i18n.utils';

async function onVersionUpdate(storageKey = MessageType.VersionUpdate) {
  const versionUpdate = await storage.local.get<MessagePayload<typeof storageKey> | undefined>(storageKey);
  if (!versionUpdate) return;

  Logger.debug('Version updated', versionUpdate);

  await storage.local.remove(storageKey);
}

export async function initServices(options: DefineOption = {}) {
  await initLocalI18n(options.baseUrl).promise;

  Logger.info(...Logger.colorize(LoggerColor.Success, Logger.timestamp, 'All services initialized!'), options);

  onVersionUpdate().catch(Logger.error);
}
