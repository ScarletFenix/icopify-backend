'use strict';

/**
 * site router
 */

// @ts-ignore
const { createCoreRouter } = require('@strapi/strapi').factories;

module.exports = createCoreRouter('api::site.site', {
    config: {
      update: {
        auth: { scope: ['authenticated'] },  // ✅ Ensure only authenticated users can update
        policies: [],                        // ✅ Remove 'adminOnly' policy if it exists
        handler: 'site.update',              // ✅ Correct handler reference
      },
    },
});
