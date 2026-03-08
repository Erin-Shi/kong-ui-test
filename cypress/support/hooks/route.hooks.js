import RoutesOverviewPage from '../pages/RoutesOverviewPage'
import DataFactory from '../utils/dataFactory'

export function registerRouteHooks() {
  let testRouteData = null

  beforeEach(() => {
    testRouteData = DataFactory.getDefaultRouteData()
    RoutesOverviewPage.visit()
  })

  afterEach(() => {
    if (!testRouteData) return
    RoutesOverviewPage.visit()
    const selector = `tr[data-testid="${testRouteData.name}"]`, simpleSelector = `[data-testid="${testRouteData.name}"]`
    cy.document().then(doc => {
      if (doc.querySelector(selector) || doc.querySelector(simpleSelector)) {
        return RoutesOverviewPage.deleteRoute(testRouteData.name)
      }
    })
  })

  return () => testRouteData
}
