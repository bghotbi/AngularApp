// This file can be replaced during build by using the `fileReplacements` array.
// `ng build` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  azure: {
    blob: {
      account: "bgangularstorage",
      SAS: "?si=full&sv=2021-12-02&sr=c&sig=o9hJO%2BUzOTpMrSXircZIXOEUBj%2FvF1bm0hXKo21CKIY%3D",
      SASReadOnly: "?si=Read-only&spr=https&sv=2021-12-02&sr=c&sig=XzEDiATiQcijgpf%2BffGRLnyMScP4AdvEXacCUg4UPz0%3D"
    }
  }
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/plugins/zone-error';  // Included with Angular CLI.
