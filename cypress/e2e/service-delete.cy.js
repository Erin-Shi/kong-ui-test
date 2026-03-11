import { registerServiceHooks } from '../support/hooks/service.hooks';
import ServicesOverviewPage from '../support/pages/ServicesOverviewPage';
import ServiceCreationPage from '../support/pages/ServiceCreationPage';
import ElementUtils from '../support/utils/elementUtils';

// Service delete flows
describe('Services - Delete', () => {
  const getTestData = registerServiceHooks();

  it('deletes a service from its overview view @critical @service @full', () => {
    const testServiceData = getTestData();

    cy.allure().feature('Services');
    cy.allure().story('Delete Service');

    ServicesOverviewPage.clickAddServiceFromEmpty();
    ServiceCreationPage.createService(testServiceData);
    ElementUtils.checkToasterMessage('successfully created');

    ServicesOverviewPage.visit();

    cy.allure().step('Delete the service via overview');
    ServicesOverviewPage.deleteService(testServiceData.name);

    ElementUtils.checkToasterMessage('successfully deleted');
    ElementUtils.notExistsByTestId(testServiceData.name);
  });
});