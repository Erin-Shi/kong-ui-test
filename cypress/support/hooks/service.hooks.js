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

        // (optional) cleanup logic could go here, e.g. remove created entities
    })

    // Return accessor for specs to read the current data
    return () => testServiceData
}
