'use strict';

/**
 * site router
 */

// @ts-ignore
const { createCoreRouter } = require('@strapi/strapi').factories;

module.exports = createCoreRouter('api::site.site', {
  config: {
    update: {
      handler: 'site.update', // Correct handler reference
    },
  },
});