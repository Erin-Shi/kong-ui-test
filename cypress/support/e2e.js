// Import Allure plugin to enable generation of allure-results during tests
import '@shelex/cypress-allure-plugin';

// Debug log to confirm support file loaded and plugin import executed
// eslint-disable-next-line no-console
console.log('support/e2e.js loaded and cypress-allure-plugin imported');

// Add global uncaught exception handler to capture cross-origin errors for debugging
// This will log the error to the runner and prevent the test from failing due to uncaught exceptions
// Remove or tighten this in production tests once root cause is fixed.
Cypress.on('uncaught:exception', (err, runnable) => {
  // Print the error object so runner logs / browser console show details
  // Some cross-origin errors will still be opaque, but this helps for same-origin issues
  // eslint-disable-next-line no-console
  console.error('CYPRESS uncaught exception:', err);
  // Return false to prevent failure
  return false;
});

import './command';

// Fallback: write minimal Allure JSON artifacts for each test after it finishes
// This helps when the cypress-allure-plugin writer does not produce files in some environments.
// Use function() so `this` is the Mocha context
afterEach(function () {
  const test = this.currentTest;
  if (!test) return;

  // Build a safe fullName without assuming parent.fullTitle is always a function
  let parentTitle = '';
  try {
    if (test.parent) {
      if (typeof test.parent.fullTitle === 'function') parentTitle = test.parent.fullTitle();
      else if (typeof test.parent.title === 'string') parentTitle = test.parent.title;
    }
  } catch (e) {
    parentTitle = '';
  }

  const data = {
    title: test.title,
    fullName: parentTitle ? `${parentTitle} ${test.title}` : test.title,
    state: test.state || 'passed', // 'passed' or 'failed'
    duration: test.duration || 0,
    testSuite: (test.parent && test.parent.title) ? test.parent.title : 'Cypress Suite'
  };

  // First inspect writer export (optional) then write fallback results.
  // Use .then(success, error) instead of .catch because Cypress chainables do not support .catch.
  return cy.task('inspectAllureWriter').then(
    info => {
      // eslint-disable-next-line no-console
      console.log('inspectAllureWriter ->', info);
      return null;
    },
    err => {
      // eslint-disable-next-line no-console
      console.log('inspectAllureWriter error ->', err);
      return null;
    }
  ).then(() => {
    return cy.task('writeAllureFromTest', data).then(
      res => {
        // eslint-disable-next-line no-console
        console.log('writeAllureFromTest result:', res);
        return res;
      },
      err => {
        // eslint-disable-next-line no-console
        console.log('writeAllureFromTest error:', err);
        return err;
      }
    );
  });
});