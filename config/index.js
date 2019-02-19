/**
 * Define url in prod and in dev
 */

switch (process.env.NODE_ENV) {
case 'production':
  module.exports = {
    NODE_ENV: '"production"', 
    GEONETWORK: '"http://demo.formater/geonetwork/"'
  }
  break;
case 'preproduction':
case 'development':
  module.exports = {
    NODE_ENV: '"' + process.env.NODE_ENV + '"',
    GEONETWORK: '"http://demo.formater/geonetwork/"'
  }
}
