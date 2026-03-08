// Common input utilities: pure validation/sanitization functions separated from Cypress actions

const InputUtils = {
  // Remove characters matching forbiddenRegex from the input
  sanitizeString(value, forbiddenRegex) {
    const str = value == null ? '' : String(value);
    if (forbiddenRegex instanceof RegExp) {
      return str.replace(forbiddenRegex, '');
    }
    return str;
  },

  // Truncate string to maxLength if provided
  truncateString(value, maxLength) {
    const str = value == null ? '' : String(value);
    if (typeof maxLength === 'number' && maxLength >= 0) {
      return str.length > maxLength ? str.slice(0, maxLength) : str;
    }
    return str;
  },

  /**
   * Validate a string according to options and return a plain result object.
   * options:
   *  - maxLength: number
   *  - forbiddenRegex: RegExp
   *
   * Returned object:
   *  { original, sanitized, final, hadForbidden, truncated, reasons, isValid }
   */
  validateString(value, options = {}) {
    const { maxLength, forbiddenRegex } = options;
    const original = value == null ? '' : String(value);
    const hadForbidden = forbiddenRegex instanceof RegExp && original !== original.replace(forbiddenRegex, '');
    const sanitized = this.sanitizeString(original, forbiddenRegex);
    const truncated = typeof maxLength === 'number' && sanitized.length > maxLength;
    const final = truncated ? sanitized.slice(0, maxLength) : sanitized;

    const reasons = [];
    if (hadForbidden) reasons.push('forbiddenChars');
    if (truncated) reasons.push('tooLong');

    return {
      original,
      sanitized,
      final,
      hadForbidden,
      truncated,
      reasons,
      isValid: reasons.length === 0,
    };
  },

  /**
   * Type the sanitized/truncated value into the given selector and assert the value.
   * Returns a Cypress chainable wrapping the validation result for further chaining.
   */
  typeSanitized(selector, value, options = {}) {
    const result = this.validateString(value, options);
    cy.get(selector).clear().type(result.final);
    cy.get(selector).should('have.value', result.final);
    return cy.wrap(result);
  },
};

export default InputUtils;
