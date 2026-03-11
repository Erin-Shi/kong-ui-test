import { registerServiceHooks } from '../support/hooks/service.hooks';
import ServicesOverviewPage from '../support/pages/ServicesOverviewPage';
import ServiceCreationPage from '../support/pages/ServiceCreationPage';
import ElementUtils from '../support/utils/elementUtils';

// Service create flows
describe('Services - Create', () => {
  const getTestData = registerServiceHooks();

  it('creates a new service and shows it in the list @critical @service @full', () => {
    const testServiceData = getTestData();

    cy.allure().feature('Services');
    cy.allure().story('Create Service');
    cy.allure().severity('critical');

    cy.allure().step('Open add service page');
    ServicesOverviewPage.visit();
    ServicesOverviewPage.clickAddServiceFromEmpty();

    cy.allure().step('Fill and submit service form');
    ServiceCreationPage.createService(testServiceData);

    ElementUtils.checkToasterMessage('successfully created');

    cy.allure().step('Verify service appears in list');
    ServicesOverviewPage.visit();
    ServicesOverviewPage.findService(testServiceData.name);
    ServicesOverviewPage.deleteService(testServiceData.name);
  });

  it('creates a service with both name and tags empty and receives auto-generated name @critical @service @full', () => {
    const testServiceData = getTestData();
    testServiceData.name = '';
    testServiceData.tags = [];
    cy.allure().feature('Services');
    cy.allure().story('Auto-generated Name');
    ServicesOverviewPage.visit();
    ServicesOverviewPage.clickAddServiceFromEmpty();
    ServiceCreationPage.createService(testServiceData);
    ElementUtils.checkToasterMessage('successfully created');


      ElementUtils.getElementValueByTestId('name-plain-text').then(generatedName => {
          testServiceData.name = generatedName;
          ServicesOverviewPage.visit();
          ServicesOverviewPage.findService(testServiceData.name);
          ServicesOverviewPage.deleteService(testServiceData.name);
      });


  });
});