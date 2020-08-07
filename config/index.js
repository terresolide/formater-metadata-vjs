/**
 * Define sso and others parameters
 */


module.exports = {
  build: {
    // webpack4 mode
    mode: 'production',
    env: require('./prod.env'),
   },
  pre: {
    mode: 'production',
    env: require('./dev.env'),
  },
  dev: {
    mode: 'development',
    env: require('./dev.env')
  }
}
