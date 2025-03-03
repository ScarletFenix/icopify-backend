'use strict';

/**
 * status-site controller
 */

const { createCoreController } = require('@strapi/strapi').factories;

module.exports = createCoreController('api::status-site.status-site');
