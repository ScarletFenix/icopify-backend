module.exports = {
    'users-permissions': {
      config: {
        providers: [
          {
            uid: 'auth0',
            displayName: 'Auth0',
            icon: 'https://cdn.auth0.com/styleguide/components/1.0.8/media/logos/img/badge.png',
            auth: {
              clientId: process.env.AUTH0_CLIENT_ID,
              clientSecret: process.env.AUTH0_CLIENT_SECRET,
              domain: process.env.AUTH0_DOMAIN,
              callback: `${process.env.NEXT_PUBLIC_BASE_URL}/api/auth/callback`,
              scope: ['openid', 'profile', 'email'],
            },
          },
        ],
      },
    },
  };
  