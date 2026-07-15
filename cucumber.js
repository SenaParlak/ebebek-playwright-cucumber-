export default {
  default: {
    paths: ['features/**/*.feature'],

    import: [
      'src/support/**/*.js',
      'src/steps/**/*.js'
    ],

    format: [
      'progress',
      'summary',
      'allure-cucumberjs/reporter'
    ],

    formatOptions: {
      resultsDir: 'allure-results'
    },

    publishQuiet: true
  }
};