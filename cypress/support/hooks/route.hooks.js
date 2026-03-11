import RoutesOverviewPage from '../pages/RoutesOverviewPage'
import DataFactory from '../utils/dataFactory'

export function registerRouteHooks() {
  let testRouteData = null

  beforeEach(() => {
    testRouteData = DataFactory.getDefaultRouteData()
    RoutesOverviewPage.visit()
  })

  afterEach(() => {
    
  })

  return () => testRouteData
}
