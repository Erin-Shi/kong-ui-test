import { registerServiceHooks } from '../support/hooks/service.hooks';
import ServicesOverviewPage from '../support/pages/ServicesOverviewPage';
import ServiceCreationPage from '../support/pages/ServiceCreationPage';
import ElementUtils from '../support/utils/elementUtils';

// Service retrieve flows
describe('Services - Retrieve', () => {
  const getTestData = registerServiceHooks();

  it('displays service details correctly after creation @critical @service @full', () => {
    const testServiceData = getTestData();

    cy.allure().feature('Services');
    cy.allure().story('Service Details');

    ServicesOverviewPage.clickAddServiceFromEmpty();
    ServiceCreationPage.createService(testServiceData);
    ElementUtils.checkToasterMessage('successfully created');

    ServicesOverviewPage.visit();
    ServicesOverviewPage.selectService(testServiceData.name);

    cy.allure().step('Assert displayed host and name');
    ElementUtils.checkElementValueByTestId('host-plain-text', ElementUtils.getHostnameFromUrl(testServiceData.url));
      ElementUtils.checkElementValueByTestId('name-plain-text', testServiceData.name);
      ServicesOverviewPage.visit();
      ServicesOverviewPage.deleteService(testServiceData.name);
  });
});