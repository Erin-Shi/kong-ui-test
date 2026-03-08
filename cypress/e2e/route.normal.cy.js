import { registerRouteHooks } from '../support/hooks/route.hooks'
import RoutesOverviewPage from '../support/pages/RoutesOverviewPage'
import RouteCreationPage from '../support/pages/RouteCreationPage'
import RouteDetailsPage from '../support/pages/RouteDetailsPage'
import ElementUtils from '../support/utils/elementUtils'
import ServiceCreationPage from '../support/pages/ServiceCreationPage'
import ServiceDetailsPage from '../support/pages/ServiceDetailsPage'
import DataFactory from '../support/utils/dataFactory'
import ServicesOverviewPage from '../support/pages/ServicesOverviewPage'

describe('Routes Management - Normal Flows', () => {
  const getTestData = registerRouteHooks()

  it('creates a new route and shows it in the list', () => {
    const testRouteData = getTestData()
    RoutesOverviewPage.clickAddRoute()
    RouteCreationPage.createRoute(testRouteData)
    ElementUtils.checkToasterMessage('successfully created')
    RoutesOverviewPage.visit()
    RoutesOverviewPage.findRoute(testRouteData.name)
  })

  it('displays route details correctly after creation', () => {
    const testRouteData = getTestData()

    // create a route first
    RoutesOverviewPage.clickAddRoute()
    RouteCreationPage.createRoute(testRouteData)
    ElementUtils.checkToasterMessage('successfully created')

    // go to list and open the route detail
    RoutesOverviewPage.visit()
    RoutesOverviewPage.selectRoute(testRouteData.name)

    // ensure header contains route name
    RouteDetailsPage.checkHeader(testRouteData.name)

    // check displayed name
      ElementUtils.checkElementValueByTestId('name-plain-text', testRouteData.name)
      ElementUtils.checkItemValue('[data-testid="paths-copy-uuid-array"] .copy-text', testRouteData.path)
  })

  it('creates a new route via service details page', () => {
    const testRouteData = getTestData()
    const testServiceData = DataFactory.getDefaultServiceData()
    // Go to services overview and open create service page
    ServicesOverviewPage.visit()
    ServicesOverviewPage.clickAddService()
    // confirm we navigated to service creation (use substring match)
    ElementUtils.checkPath('/services', false)

    // create service and ensure we are on its details page
    ServiceCreationPage.createService(testServiceData)
    ServiceDetailsPage.checkHeader(testServiceData.name)

    // from service details, go to route creation and assert navigation
    ServiceDetailsPage.redirectToRouteCreationPage()

    // ensure route creation page is ready, then fill and submit
    RouteCreationPage.checkHeader()
    RouteCreationPage.createRoute(testRouteData)
    ElementUtils.checkToasterMessage('successfully created')
    RoutesOverviewPage.findRoute(testRouteData.name)

    RoutesOverviewPage.deleteRoute(testRouteData.name)
    ServicesOverviewPage.visit()
    ServicesOverviewPage.deleteService(testServiceData.name)
  })

  it('deletes a route from route list in overview page', () => {
    const testRouteData = getTestData()
    RoutesOverviewPage.clickAddRoute()
    RouteCreationPage.createRoute(testRouteData)
    ElementUtils.checkToasterMessage('successfully created')
    RoutesOverviewPage.visit()
    RoutesOverviewPage.deleteRoute(testRouteData.name)
    ElementUtils.checkToasterMessage('successfully deleted')
    ElementUtils.notExistsByTestId(testRouteData.name)
  })

  it('cancels add route operation without creating', () => {
    const testRouteData = getTestData()
    RoutesOverviewPage.clickAddRoute()
    RouteCreationPage.fillRouteName(testRouteData.name)
    RouteCreationPage.fillPath(testRouteData.path)
    RouteCreationPage.cancel()
    ElementUtils.checkPageNavigation('Routes', 'h3')
    ElementUtils.notExistsByTestId(testRouteData.name)
  })
})
