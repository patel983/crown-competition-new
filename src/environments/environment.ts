import {
  AuthServiceConfig,
  FacebookLoginProvider,
  GoogleLoginProvider
} from 'angularx-social-login';

// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  server: {
    BASE_URL: 'https://crown-backend.herokuapp.com',
    API_VERSION: 'api'
  },
  STRIPE_PUB_KEY: 'pk_live_UsJI3Ts8tB4WW1F6IfvFQrm900Q1b4PtAp',
  AUTH_CONFIG: new AuthServiceConfig([
    {
      id: GoogleLoginProvider.PROVIDER_ID,
      provider: new GoogleLoginProvider(
        '457048883074-2k0unm1ah7bm363s1r82fhb0ode4jobn.apps.googleusercontent.com'
      )
    },
    {
      id: FacebookLoginProvider.PROVIDER_ID,
      provider: new FacebookLoginProvider('555523141825080')
    }
  ]),
  piwikServer: 'https://crowncompetitions.matomo.cloud/'
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
