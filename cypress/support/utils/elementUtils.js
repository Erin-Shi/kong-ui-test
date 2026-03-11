// Utility helpers for common element interactions: click, set value, get/check value
const ElementUtils = {
  // Build selector from data-testid
  _testIdSelector(testId) {
    return `[data-testid="${testId}"]`;
  },

  // Click an element by data-testid after asserting visibility
  clickByTestId(testId) {
    const selector = this._testIdSelector(testId);
    return cy.get(selector).should('be.visible').click();
  },

  // Generic click by selector
  click(selector) {
    return cy.get(selector).should('be.visible').click();
  },

  // Set value into element identified by data-testid (clears then types)
  setValueByTestId(testId, value) {
    const selector = this._testIdSelector(testId);
      return cy.get(selector).scrollIntoView().should('be.visible').clear().type(String(value));
  },

  // Generic set value by selector
  setValue(selector, value) {
      return cy.get(selector).scrollIntoView().should('be.visible').clear().type(String(value));
  },

  // Get the value (or text) of an element by data-testid ¡ª returns a chainable resolving to the final string
  getValueByTestId(testId) {
    const selector = this._testIdSelector(testId);
    // Mirror behaviour of checkValue: ensure element is scrolled into view and visible first
    return cy.get(selector).scrollIntoView().should('be.visible').then($el => {
      // Prefer the first matched element
      const el = $el[0];
      if (!el) return cy.wrap('');
      const tag = el.tagName && el.tagName.toLowerCase();

      // For form controls and paragraphs, read the value
      if (tag === 'input' || tag === 'textarea' || tag === 'select' || tag === 'p') {
        const val = $el.val();
        return (typeof val !== 'undefined' && val !== null) ? String(val) : '';
      }

      // If element contains a single span child often used for plain-text displays, prefer that
      const $span = $el.querySelector && $el.querySelector('span');
      if ($span) {
        return String($span.textContent || '').trim();
      }

      // Fallback to trimmed text content of the element
      return String($el.text().trim());
    });
  },

  // Check element visibility and its value/text by data-testid
  checkElementValueByTestId(testId, expectedValue) {
        const selector = this._testIdSelector(testId);
      this.checkValue(selector, expectedValue);
  },

  // Return the textual value of an element identified by data-testid.
  // Resolves to the element's value (for inputs) or trimmed text content for other elements.
  getElementValueByTestId(testId) {
    // Delegate to getValueByTestId for consistent behavior
    return this.getValueByTestId(testId);
  },

    checkValue(selector, expectedValue) {
        return cy.get(selector).scrollIntoView().should('be.visible').then($el => {
            const tag = $el.prop('tagName') && $el.prop('tagName').toLowerCase();
            if (tag === 'input' || tag === 'textarea' || tag === 'select' || tag === 'p') {
                const val = $el.val();
                expect(String(val)).to.equal(String(expectedValue));
                return;
            }
            const text = $el.text().trim();
            expect(String(text)).to.equal(String(expectedValue));
        });
    },

    checkItemValue(selector, expectedValue) {
        cy.get(selector).should('have.text', String(expectedValue));
    },


  check(selector){
      cy.get(selector).should('be.visible');
  },

  // Assert existence of an element by data-testid
  existsByTestId(testId) {
    const selector = this._testIdSelector(testId);
    return cy.get(selector).should('exist');
  },

  // Check existence of an element by data-testid without failing the test.
  // Returns a chainable resolving to a boolean.
  existsOptionalByTestId(testId) {
    const selector = this._testIdSelector(testId);
    return cy.get('body').then($body => {
      const found = $body.find(selector).length > 0;
      return cy.wrap(found);
    });
  },

  // Assert non-existence of an element by data-testid
  notExistsByTestId(testId) {
    const selector = this._testIdSelector(testId);
    return cy.get(selector).should('not.exist');
  },

  // Return whether an element identified by data-testid is disabled (checks disabled prop, attribute, and aria-disabled)
  isDisabledByTestId(testId) {
    const selector = this._testIdSelector(testId);
    return cy.get(selector).then($el => {
      // If multiple elements match, check the first
      const el = $el[0];
      if (!el) return cy.wrap(false);
      const propDisabled = el.disabled === true;
      const attrDisabled = $el.attr('disabled') !== undefined;
      const ariaDisabled = $el.attr('aria-disabled') === 'true';
      return cy.wrap(propDisabled || attrDisabled || ariaDisabled);
    });
  },

  // Assert disabled state for element by data-testid
  assertDisabledByTestId(testId, expected = true) {
    return this.isDisabledByTestId(testId).then(disabled => {
      expect(disabled).to.equal(expected);
    });
  },

  // Wrapper around cy.visit to centralize navigation behavior
  // path: URL path or full URL
  // options: optional cy.visit options
  visitPage(path, options = {}) {
    // Increase default timeout for page load to 60s unless overridden
    const defaultOptions = { timeout: 60000 };
    const mergedOptions = { ...defaultOptions, ...options };
    return cy.visit(path, mergedOptions);
  },

  // Parse hostname from a URL string, tolerant to missing scheme or invalid input
  // Returns empty string if hostname cannot be determined
  getHostnameFromUrl(url) {
    if (!url) return '';
    try {
      // Try as-is first
      return new URL(String(url)).hostname || '';
    } catch (e) {
      try {
        // Prepend http:// if scheme missing
        return new URL(`http://${String(url)}`).hostname || '';
      } catch (e2) {
        return '';
      }
    }
  },

  // Check that navigation landed on a page by inspecting header content.
  // expectedHeader can be a string or RegExp.
  // headerSelector defaults to common header selectors.
  // timeout is optional milliseconds to wait for header.
  checkPageNavigation(expectedHeader, headerSelector = 'h1, h2, h3, page-header', timeout = 10000) {
    // Wait for any of the header selectors to be visible and then verify content
    // Use .should callback so Cypress retries until the expectation passes or timeout
    return cy.get(headerSelector, { timeout }).should($els => {
      // Find the first element that has non-empty text
      let matched = false;
      $els.each((_, el) => {
        const text = Cypress.$(el).text().trim();
        if (!text) return;
        if (expectedHeader instanceof RegExp) {
          if (expectedHeader.test(text)) matched = true;
        } else {
          if (text.includes(String(expectedHeader))) matched = true;
        }
      });
      expect(matched, `expected header ${expectedHeader} to be present in ${headerSelector}`).to.be.true;
    });
  },

  // Check path of current location (pathname).
  // expectedPath can be string or RegExp. If exact is true, perform equality check; otherwise check substring inclusion.
  checkPath(expectedPath, exact = true, timeout = 10000) {
    if (expectedPath instanceof RegExp) {
      return cy.location('pathname', { timeout }).should('match', expectedPath);
    }
    if (exact) {
      return cy.location('pathname', { timeout }).should('equal', String(expectedPath));
    }
    return cy.location('pathname', { timeout }).should('contain', String(expectedPath));
  },

  // Check a toaster message element (class .toaster-message) contains expected text.
  // If exact is true, the text must exactly equal expectedMessage (trimmed).
  // timeout is optional milliseconds to wait for toaster to appear.
  checkToasterMessage(expectedMessage, exact = false, timeout = 10000) {
    return cy.get('.toaster-message', { timeout }).should('be.visible').then($el => {
      const text = $el.text().trim();
      if (exact) {
        expect(text).to.equal(String(expectedMessage));
      } else {
        expect(text).to.contain(String(expectedMessage));
      }
    });
  },

  // Wait for any element with class 'loading-container' to disappear from the page.
  // This handles both cases where the element is present and then removed, or not present at all.
  // timeout is optional milliseconds to wait for disappearance.
  waitForLoadingToFinish(timeout = 10000) {
    // Check if loading element exists first to avoid cy.get failing when absent
    return cy.get('body').then($body => {
      const found = $body.find('.loading-container').length > 0;
      if (found) {
        return cy.get('.loading-container', { timeout }).should('not.exist');
      }
      // nothing to wait for
      return cy.wrap(true);
    });
  },

};

export default ElementUtils;
