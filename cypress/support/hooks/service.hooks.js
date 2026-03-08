import ServicesOverviewPage from '../pages/ServicesOverviewPage'
import DataFactory from '../utils/dataFactory'

// Registers shared beforeEach/afterEach hooks for service-related specs
// Returns a function that retrieves the current testServiceData from the hook closure
export function registerServiceHooks() {
  let testServiceData = null

  beforeEach(() => {
    // Generate fresh test data and navigate to services page
    testServiceData = DataFactory.getDefaultServiceData()
    ServicesOverviewPage.visit()
  })

  afterEach(() => {
    // Defensive cleanup: only delete the service if it exists
    if (!testServiceData) return

    ServicesOverviewPage.visit()
    const selector = `tr[data-testid="${testServiceData.name}"]`,
      // also check flat list item case
      simpleSelector = `[data-testid="${testServiceData.name}"]`

    // Use document query to check existence without causing Cypress to fail if absent
    cy.document().then(doc => {
      if (doc.querySelector(selector) || doc.querySelector(simpleSelector)) {
        // Element exists in the DOM -> perform delete via the UI
        return ServicesOverviewPage.deleteService(testServiceData.name)
      }
      // nothing to do if service not found
    })
  })

  // Return accessor for specs to read the current data
  return () => testServiceData
}
