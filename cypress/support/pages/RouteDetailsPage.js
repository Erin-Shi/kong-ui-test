import ElementUtils from '../utils/elementUtils'

class RouteDetailsPage {
  // Verify header contains route name
  checkHeader(routeName) {
    return ElementUtils.checkPageNavigation(routeName, 'h3');
  }

  // Read displayed paths text
  getPathsText() {
    return ElementUtils.getValueByTestId('paths-plain-text');
  }

  // Read displayed name text
  getNameText() {
    return ElementUtils.getValueByTestId('name-plain-text');
  }

  // Delete the route from details view
  delete(routeName) {
    const possibleDeleteSelectors = [
      '[data-testid="toolbar-delete-route"]',
      '[data-testid="toolbar-delete-entity"]',
      '[data-testid="action-entity-delete"]',
      'button[data-testid="toolbar-delete"]'
    ];

    return cy.document().then(doc => {
      for (const sel of possibleDeleteSelectors) {
        if (doc.querySelector(sel)) {
          ElementUtils.click(sel);
          return;
        }
      }
      return ElementUtils.clickByTestId('toolbar-delete-route');
    }).then(() => {
      return cy.document().then(doc => {
        if (doc.querySelector('[data-testid="confirmation-input"]')) {
          ElementUtils.setValueByTestId('confirmation-input', routeName);
          ElementUtils.clickByTestId('modal-action-button');
        }
      });
    });
  }
}

export default new RouteDetailsPage();
