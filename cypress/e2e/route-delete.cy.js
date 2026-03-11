import { registerRouteHooks } from '../support/hooks/route.hooks'
import RoutesOverviewPage from '../support/pages/RoutesOverviewPage'
import RouteCreationPage from '../support/pages/RouteCreationPage'
import ElementUtils from '../support/utils/elementUtils'

describe('Routes - Delete', () => {
  const getTestData = registerRouteHooks()

  it('deletes a route from route list in overview page @route @full', () => {
    const testRouteData = getTestData()
    RoutesOverviewPage.clickAddRouteFromEmpty()
    RouteCreationPage.createRoute(testRouteData)
    ElementUtils.checkToasterMessage('successfully created')
    RoutesOverviewPage.visit()
    RoutesOverviewPage.deleteRoute(testRouteData.name)
    ElementUtils.checkToasterMessage('successfully deleted')
    ElementUtils.notExistsByTestId(testRouteData.name)
  })
})