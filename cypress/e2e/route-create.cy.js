import { registerRouteHooks } from '../support/hooks/route.hooks'
import RoutesOverviewPage from '../support/pages/RoutesOverviewPage'
import RouteCreationPage from '../support/pages/RouteCreationPage'
import ElementUtils from '../support/utils/elementUtils'
import ServicesOverviewPage from '../support/pages/ServicesOverviewPage'
import ServiceCreationPage from '../support/pages/ServiceCreationPage'
import ServiceDetailsPage from '../support/pages/ServiceDetailsPage'


describe('Routes - Create', () => {
  const getTestData = registerRouteHooks()

  it('creates a new route and shows it in the list @route @critical @full', () => {
    const testRouteData = getTestData()
    RoutesOverviewPage.visit()
    RoutesOverviewPage.clickAddRouteFromEmpty()
    RouteCreationPage.createRoute(testRouteData)
    ElementUtils.checkToasterMessage('successfully created')
    RoutesOverviewPage.visit()
    RoutesOverviewPage.findRoute(testRouteData.name)
    RoutesOverviewPage.deleteRoute(testRouteData.name)
  })

  it('creates a new route via service details page @route @critical @full', () => {
    const testRouteData = getTestData()
    const testServiceData = require('../support/utils/dataFactory').getDefaultServiceData()
    ServicesOverviewPage.visit()
    ServicesOverviewPage.clickAddServiceFromEmpty()
    ElementUtils.checkPath('/services', false)

      ServiceCreationPage.createService(testServiceData)
      ServiceDetailsPage.checkHeader(testServiceData.name)
      ServiceDetailsPage.redirectToRouteCreationPage()
 
    RouteCreationPage.checkHeader()
    RouteCreationPage.createRoute(testRouteData)
    ElementUtils.checkToasterMessage('successfully created')
    RoutesOverviewPage.findRoute(testRouteData.name)

    RoutesOverviewPage.deleteRoute(testRouteData.name)
    ServicesOverviewPage.visit()
    ServicesOverviewPage.deleteService(testServiceData.name)
  })
})