import { registerRouteHooks } from '../support/hooks/route.hooks'
import RoutesOverviewPage from '../support/pages/RoutesOverviewPage'
import RouteCreationPage from '../support/pages/RouteCreationPage'
import RouteDetailsPage from '../support/pages/RouteDetailsPage'
import ElementUtils from '../support/utils/elementUtils'

describe('Routes - Retrieve', () => {
  const getTestData = registerRouteHooks()

  it('displays route details correctly after creation @route @full', () => {
    const testRouteData = getTestData()

    RoutesOverviewPage.clickAddRouteFromEmpty()
    RouteCreationPage.createRoute(testRouteData)
    ElementUtils.checkToasterMessage('successfully created')

    RoutesOverviewPage.visit()
    RoutesOverviewPage.selectRoute(testRouteData.name)

    RouteDetailsPage.checkHeader(testRouteData.name)
    ElementUtils.checkElementValueByTestId('name-plain-text', testRouteData.name)
    ElementUtils.checkItemValue('[data-testid="paths-copy-uuid-array"] .copy-text', testRouteData.path)
  })
})