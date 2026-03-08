import { registerServiceHooks } from '../support/hooks/service.hooks'
import ServicesOverviewPage from '../support/pages/ServicesOverviewPage';
import ServiceCreationPage from '../support/pages/ServiceCreationPage';
import ElementUtils from '../support/utils/elementUtils'

// Validation-focused tests for string handling
describe('Services Management - Validation Flows', () => {
  const getTestData = registerServiceHooks();

  it('warns or sanitizes forbidden characters in service name', () => {
    const testServiceData = getTestData();
    const nameWithForbidden = `bad\u0001name!@#`;
    const validation = ServiceCreationPage.validateServiceName(nameWithForbidden);

    ServicesOverviewPage.clickAddService();
    ServiceCreationPage.fillServiceName(nameWithForbidden);
    ElementUtils.checkValue('.k-input.input-error .help-text', "The name can be any string containing characters, letters, numbers, or the following characters: ., -, _, or ~. Do not use spaces.")
  });

  it('validates URL with spaces or control characters', () => {
    const testServiceData = getTestData();
    const badUrl = 'http://exa mple.com/path';
    ServicesOverviewPage.clickAddService();
    ServiceCreationPage.fillUrl(badUrl);
    ElementUtils.checkValue('.k-input.input-error .help-text', "The URL must follow a valid format. Example: https://api.kong-air.com/flights")
  });
});
