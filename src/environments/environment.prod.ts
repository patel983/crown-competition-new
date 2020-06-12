import {
  AuthServiceConfig,
  FacebookLoginProvider,
  GoogleLoginProvider
} from 'angularx-social-login';

export const environment = {
  production: true,
  server: {
    BASE_URL: 'https://crown-backend.herokuapp.com',
    API_VERSION: 'api'
  },
  STRIPE_PUB_KEY: 'pk_live_UsJI3Ts8tB4WW1F6IfvFQrm900Q1b4PtAp',
  AUTH_CONFIG: new AuthServiceConfig([
    {
      id: GoogleLoginProvider.PROVIDER_ID,
      provider: new GoogleLoginProvider(
        'aF5W3aS-ancuEu-x7qgHuVy7'
      )
    },
    {
      id: FacebookLoginProvider.PROVIDER_ID,
      provider: new FacebookLoginProvider('555523141825080')
    }
  ]),
  piwikServer: 'https://crowncompetitions.matomo.cloud/'
};
