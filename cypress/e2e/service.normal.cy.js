import { registerServiceHooks } from '../support/hooks/service.hooks';
import ServicesOverviewPage from '../support/pages/ServicesOverviewPage';
import ServiceCreationPage from '../support/pages/ServiceCreationPage';
import ElementUtils from '../support/utils/elementUtils';

// Normal (happy-path) flows for Services
describe('Services Management - Normal Flows', () => {
  const getTestData = registerServiceHooks();

  it('creates a new service and shows it in the list', () => {
    const testServiceData = getTestData();

    // Allure metadata for this test
    cy.allure().feature('Services');
    cy.allure().story('Create Service');
    cy.allure().severity('critical');

    cy.allure().step('Open add service page');
    ServicesOverviewPage.clickAddService();

    cy.allure().step('Fill and submit service form');
    ServiceCreationPage.createService(testServiceData);

    ElementUtils.checkToasterMessage('successfully created');

    cy.allure().step('Verify service appears in list');
    ServicesOverviewPage.visit();
    ServicesOverviewPage.findService(testServiceData.name);
  });

  it('displays service details correctly after creation', () => {
    const testServiceData = getTestData();

    cy.allure().feature('Services');
    cy.allure().story('Service Details');

    ServicesOverviewPage.clickAddService();
    ServiceCreationPage.createService(testServiceData);
    ElementUtils.checkToasterMessage('successfully created');

    ServicesOverviewPage.visit();
    ServicesOverviewPage.selectService(testServiceData.name);

    cy.allure().step('Assert displayed host and name');
    ElementUtils.checkElementValueByTestId('host-plain-text', ElementUtils.getHostnameFromUrl(testServiceData.url));
    ElementUtils.checkElementValueByTestId('name-plain-text', testServiceData.name);
  });

  it('deletes a service from its detail view', () => {
    const testServiceData = getTestData();

    cy.allure().feature('Services');
    cy.allure().story('Delete Service');

    ServicesOverviewPage.clickAddService();
    ServiceCreationPage.createService(testServiceData);
    ElementUtils.checkToasterMessage('successfully created');

    ServicesOverviewPage.visit();

    cy.allure().step('Delete the service via overview');
    ServicesOverviewPage.deleteService(testServiceData.name);

    ElementUtils.checkToasterMessage('successfully deleted');
    ElementUtils.notExistsByTestId(testServiceData.name);
  });

  it('cancels add service operation without creating', () => {
    const testServiceData = getTestData();

    cy.allure().feature('Services');
    cy.allure().story('Cancel Create');

    ServicesOverviewPage.clickAddService();
    ServiceCreationPage.fillServiceName(testServiceData.name);
    ServiceCreationPage.fillUrl(testServiceData.url);
    ServiceCreationPage.cancel();
    ElementUtils.checkPageNavigation('Gateway Services', 'h3');
    ElementUtils.notExistsByTestId(testServiceData.name);
  });

  it('creates a service with both name and tags empty and receives auto-generated name', () => {
    const testServiceData = getTestData();
    const dataEmpty = { ...testServiceData, name: '', tag: '' };

    cy.allure().feature('Services');
    cy.allure().story('Auto-generated Name');

    ServicesOverviewPage.clickAddService();
    ServiceCreationPage.createService(dataEmpty);
    ElementUtils.checkToasterMessage('successfully created');
    ServicesOverviewPage.visit();
    ElementUtils.check('[data-testid^="new-service"]');
  });
});
