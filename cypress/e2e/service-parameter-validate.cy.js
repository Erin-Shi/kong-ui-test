import { registerServiceHooks } from '../support/hooks/service.hooks'
import ServicesOverviewPage from '../support/pages/ServicesOverviewPage';
import ServiceCreationPage from '../support/pages/ServiceCreationPage';
import ElementUtils from '../support/utils/elementUtils'

// Service parameter validation tests

describe('Services - Parameter Validation', () => {
  const getTestData = registerServiceHooks();

  it('warns or sanitizes forbidden characters in service name @service @full', () => {
    const testServiceData = getTestData();
    const nameWithForbidden = `bad\u0001name!@#`;

    ServicesOverviewPage.clickAddServiceFromEmpty();
    ServiceCreationPage.fillServiceName(nameWithForbidden);
    ElementUtils.checkItemValue('.k-input.input-error .help-text', "The name can be any string containing characters, letters, numbers, or the following characters: ., -, _, or ~. Do not use spaces.")
  });

  it('validates URL with spaces or control characters @service @full', () => {
    const testServiceData = getTestData();
    const badUrl = 'http://exa mple.com/path';
    ServicesOverviewPage.clickAddServiceFromEmpty();
    ServiceCreationPage.fillUrl(badUrl);
    ElementUtils.checkItemValue('.k-input.input-error .help-text', "The URL must follow a valid format. Example: https://api.kong-air.com/flights")
  });
});