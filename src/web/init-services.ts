import { LoggerColor } from '@dvcol/common-utils/common/logger';

import type { VersionUpdateDetails } from '@dvcol/web-extension-utils/chrome/models';

import { Logger } from '~/services/logger.service';
import { storage } from '~/utils/browser/browser-storage.utils';
import { initLocalI18n } from '~/utils/i18n.utils';

const onVersionUpdate = async (storageKey = 'version-update') => {
  const versionUpdate = await storage.local.get<VersionUpdateDetails & { date: number }>(storageKey);
  if (!versionUpdate) return;

  await storage.local.remove(storageKey);
};

export const initServices = async (options: { option?: boolean; popup?: boolean; web?: boolean } = {}) => {
  await initLocalI18n().promise;

  Logger.info(...Logger.colorize(LoggerColor.Success, Logger.timestamp, 'All services initialized!'), options);

  onVersionUpdate().catch(Logger.error);
};
