'use strict';

/**
 * status-site router
 */

const { createCoreRouter } = require('@strapi/strapi').factories;

module.exports = createCoreRouter('api::status-site.status-site');
