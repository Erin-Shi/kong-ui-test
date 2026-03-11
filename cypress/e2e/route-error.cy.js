import { registerRouteHooks } from '../support/hooks/route.hooks'
import RoutesOverviewPage from '../support/pages/RoutesOverviewPage';
import RouteCreationPage from '../support/pages/RouteCreationPage';
import ElementUtils from '../support/utils/elementUtils';

// Error/negative flows for Routes
describe('Routes Management - Error Flows', () => {
  const getTestData = registerRouteHooks();

  it('shows validation when required fields missing @route @full', () => {
    const testRouteData = getTestData();
    RoutesOverviewPage.clickAddRouteFromEmpty();
    // Leave name empty and assert save/submit is disabled
    ElementUtils.assertDisabledByTestId('route-create-form-submit', true);
  });

  it('prevents duplicate route creation @route @full', () => {
      const testRouteData = getTestData();
      RoutesOverviewPage.visit();
    RoutesOverviewPage.clickAddRouteFromEmpty();
    RouteCreationPage.createRoute(testRouteData);
    ElementUtils.checkToasterMessage('successfully created');

    RoutesOverviewPage.visit();
    RoutesOverviewPage.clickAddRouteInToolbar();
    RouteCreationPage.createRoute(testRouteData);

    const expected = `UNIQUE violation detected on '{name="${testRouteData.name}"}'`;
    cy.get('[data-testid="form-error"]', { timeout: 10000 }).should('be.visible').and($el => {
      const text = $el.text().trim();
      expect(text).to.contain('UNIQUE violation detected');
      expect(text).to.contain(`{name="${testRouteData.name}"}`);
    });
      RoutesOverviewPage.visit();
      RoutesOverviewPage.deleteRoute(testRouteData.name);
  });
});
