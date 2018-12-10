import {JailFS}                             from '@berry/zipfs';

import {Fetcher, FetchOptions, FetchResult} from './Fetcher';
import {WorkspaceBaseResolver}              from './WorkspaceBaseResolver';
import * as structUtils                     from './structUtils';
import {Locator}                            from './types';

export class WorkspaceBaseFetcher implements Fetcher {
  supports(locator: Locator) {
    if (!locator.reference.startsWith(WorkspaceBaseResolver.protocol))
      return false;

    return true;
  }

  async fetch(locator: Locator, opts: FetchOptions) {
    return [new JailFS(this.getWorkspace(locator, opts).cwd, {baseFs: opts.rootFs}), async () => {}] as FetchResult;
  }

  getWorkspace(locator: Locator, opts: FetchOptions) {
    const normalizedLocator = structUtils.makeLocator(locator, locator.reference.slice(WorkspaceBaseResolver.protocol.length));

    return opts.project.getWorkspaceByLocator(normalizedLocator);
  }
}
