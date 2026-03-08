describe('Allure Smoke Test', () => {
  it('generates allure-results artifacts', () => {
    // mark feature and story for Allure
    cy.allure().feature('smoke-tests');
    cy.allure().story('allure-integration');

    // add a step and an attachment
    cy.allure().step('sanity step - ensure plugin loaded');
    cy.allure().attachment('sample-attachment', 'Allure plugin is active', 'text/plain');

    // log to runner console
    cy.log('allure smoke test running');

    // then list contents of allure-results directory so we can assert
    cy.task('listAllureResults').then(files => {
      cy.log('allure-results dir listing: ' + JSON.stringify(files));
    });

    // simple assertion
    expect(true).to.equal(true);
  });
});
