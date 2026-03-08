import { registerServiceHooks } from '../support/hooks/service.hooks'
import ServicesOverviewPage from '../support/pages/ServicesOverviewPage';
import ServiceCreationPage from '../support/pages/ServiceCreationPage';
import ServiceDetailsPage from '../support/pages/ServiceDetailsPage';
import RouteCreationPage from '../support/pages/RouteCreationPage';
import RoutesOverviewPage from '../support/pages/RoutesOverviewPage';
import DataFactory from '../support/utils/dataFactory';
import ElementUtils from '../support/utils/elementUtils';

// Error/negative flows for Services
describe('Services Management - Error Flows', () => {
  const getTestData = registerServiceHooks();

  it('shows validation when required fields missing', () => {
    ServicesOverviewPage.clickAddService();
    // The correct behavior is that the submit/save button is disabled when name is missing
    ElementUtils.assertDisabledByTestId('service-create-form-submit', true);
  });

  it('prevents duplicate service creation', () => {
    const testServiceData = getTestData();
    ServicesOverviewPage.clickAddService();
    ServiceCreationPage.createService(testServiceData);
    // wait for success toaster using existing helper
    ElementUtils.checkToasterMessage('successfully created');

    ServicesOverviewPage.visit();
    ServicesOverviewPage.clickAddService();
    ServiceCreationPage.createService(testServiceData);

    // When duplicate, the form displays an element with data-testid="form-error"
    // which somewhere contains text like: UNIQUE violation detected on '{name="<serviceName>"}'
    cy.get('[data-testid="form-error"]', { timeout: 10000 }).should('be.visible').and($el => {
      // ensure the error text includes the expected message
      const text = $el.text().trim();
      expect(text).to.contain('UNIQUE violation detected');
      expect(text).to.contain(`{name="${testServiceData.name}"}`);
    });
  });

  it('prevents deleting a service that has associated routes', () => {
    const testServiceData = getTestData();
    const testRouteData = DataFactory.getDefaultRouteData();

    // Create the service
    ServicesOverviewPage.clickAddService();
    ServiceCreationPage.createService(testServiceData);
    ElementUtils.checkToasterMessage('successfully created');

    // From service details, create a route attached to this service
    ServicesOverviewPage.visit();
    ServicesOverviewPage.selectService(testServiceData.name);
    ServiceDetailsPage.checkHeader(testServiceData.name);
    ServiceDetailsPage.redirectToRouteCreationPage();
    RouteCreationPage.checkHeader();

    // ensure the route is attached to the created service
    RouteCreationPage.createRoute(testRouteData);
    ElementUtils.checkToasterMessage('successfully created');

    // Attempt to delete the service - expected to fail because route exists
    ServicesOverviewPage.visit();
    ServicesOverviewPage.deleteService(testServiceData.name);
    ElementUtils.checkItemValue('.kong-ui-entity-delete-modal .k-alert.danger .alert-message', "an existing 'routes' entity references this 'services' entity");
    ElementUtils.clickByTestId('modal-cancel-button');

    // Service should still exist and deletion should not succeed
    ElementUtils.existsByTestId(testServiceData.name);

    // Clean up: delete the created route then delete the service
    RoutesOverviewPage.visit();
    RoutesOverviewPage.deleteRoute(testRouteData.name);
    ServicesOverviewPage.visit();
    ServicesOverviewPage.deleteService(testServiceData.name);
  });
});
