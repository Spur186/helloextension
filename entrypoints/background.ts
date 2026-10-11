export default defineBackground(() => {

  async function updateBlockingRules() {
    const result = await browser.storage.local.get('blockedSites');

    const blockedSites =
      (result.blockedSites as string[] | undefined) ?? [];

    const rules = blockedSites.map((site, index) => ({
      id: index + 1,
      priority: 1,

      action: {
        type: 'block' as const,
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

  // Run when background script starts
  updateBlockingRules();

  // Run whenever blockedSites changes
  browser.storage.onChanged.addListener((changes, area) => {
    if (area === 'local' && changes.blockedSites) {
      updateBlockingRules();
    }
  });

});