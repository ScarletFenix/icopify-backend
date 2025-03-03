'use strict';

/**
 * status-site service
 */

const { createCoreService } = require('@strapi/strapi').factories;

module.exports = createCoreService('api::status-site.status-site');
