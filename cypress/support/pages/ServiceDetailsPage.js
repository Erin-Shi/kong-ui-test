import ElementUtils from '../utils/elementUtils'

class ServiceDetailsPage {
  // Verify the details page header contains the service name (optional)
  checkHeader(serviceName) {
    return ElementUtils.checkPageNavigation(serviceName, 'h3');
  }

  // Read displayed host text
  getHostText() {
    return ElementUtils.getValueByTestId('host-plain-text');
  }

  // Read displayed name text
  getNameText() {
    return ElementUtils.getValueByTestId('name-plain-text');
  }

  // Redirect to route creation page from service details view
  redirectToRouteCreationPage() {
      return ElementUtils.click('.add-route-btn');
  }

  // Delete the service from the details view. Tries multiple known UI patterns safely.
  delete(serviceName) {
    const possibleDeleteSelectors = [
      '[data-testid="toolbar-delete-service"]',
      '[data-testid="toolbar-delete-entity"]',
      '[data-testid="action-entity-delete"]',
      'button[data-testid="toolbar-delete"]'
    ];

    // Try to click a delete control if present
    return cy.document().then(doc => {
      for (const sel of possibleDeleteSelectors) {
        if (doc.querySelector(sel)) {
          // use the selector directly with ElementUtils.click which accepts generic selector
          ElementUtils.click(sel);
          // stop at first match
          return;
        }
      }
      // As fallback, try a common toolbar delete test id
      return ElementUtils.clickByTestId('toolbar-delete-service');
    }).then(() => {
      // If a confirmation input/modal appears, fill and confirm
      return cy.document().then(doc => {
        if (doc.querySelector('[data-testid="confirmation-input"]')) {
          ElementUtils.setValueByTestId('confirmation-input', serviceName);
          ElementUtils.clickByTestId('modal-action-button');
        }
      });
    });
  }
}

export default new ServiceDetailsPage();
