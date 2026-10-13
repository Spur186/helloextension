
export default defineBackground(() => {

  async function updateBlockingRules() {

    const result = await browser.storage.local.get([
      'blockedSites',
      'redirectSites'
    ]);

    const blockedSites =
      (result.blockedSites as string[] | undefined) ?? [];

    const redirectSites =
      (result.redirectSites as string[] | undefined) ?? [];

    let redirectURL: string | null = null;

    for (const site of redirectSites) {
      try {
        const url = new URL(
          site.includes('://') ? site : `https://${site}`
        );

        if (url.protocol === 'https:' || url.protocol === 'http:') {
          redirectURL = url.href;
          break;
        }
      } catch {
      }
    }

    const domains = blockedSites.flatMap((site) => {
      try {
        const url = new URL(
          site.includes('://') ? site : `https://${site}`
        );

        if (url.protocol !== 'https:' && url.protocol !== 'http:') {
          return [];
        }

        return [url.hostname.toLowerCase()];
      } catch {
        return [];
      }
    });

    if (redirectURL) {
      const destination = new URL(redirectURL).hostname;

      const destinationBlocked = domains.some(
        domain =>
          destination === domain ||
          destination.endsWith(`.${domain}`)
      );

      if (destinationBlocked) {
        redirectURL = null;
      }
    }

    const rules = domains.map((site, index) => ({
      id: index + 1,
      priority: 1,

      action: redirectURL
        ? {
            type: 'redirect' as const,
            redirect: {
              url: redirectURL
            }
          }
        : {
            type: 'block' as const
          },

      condition: {
        urlFilter: `||${site}^`,
        resourceTypes: ['main_frame' as const],
      },
    }));

    const oldRules =
      await browser.declarativeNetRequest.getDynamicRules();

    await browser.declarativeNetRequest.updateDynamicRules({
      removeRuleIds: oldRules.map(rule => rule.id),
      addRules: rules,
      
    });
  }

  updateBlockingRules();

  browser.storage.onChanged.addListener((changes, area) => {
    if (
      area === 'local' &&
      (changes.blockedSites || changes.redirectSites)
    ) {
      updateBlockingRules();
    }
  });

}); 
