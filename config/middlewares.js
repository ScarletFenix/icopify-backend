module.exports = [
  'strapi::errors',
  {
    name: 'strapi::cors',
    config: {
      enabled: true,
      origin: ['*'], // You can restrict to your Next.js URL for better security
      methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
    },
  },
  'strapi::logger',
  'strapi::errors',
  'strapi::security',
  'strapi::cors',
  'strapi::poweredBy',
  'strapi::query',
  'strapi::body',
  'strapi::session',
  'strapi::favicon',
  'strapi::public',
];
