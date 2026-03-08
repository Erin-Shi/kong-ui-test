const KONG_ADMIN_URL = Cypress.env('KONG_ADMIN_URL') || 'http://localhost:8001';

class KongAdminClient {
    createService(service) {
        return cy.request({ method: 'POST', url: `${KONG_ADMIN_URL}/services`, body: service, failOnStatusCode: false });
    }

    deleteService(serviceName) {
        return cy.request({ method: 'DELETE', url: `${KONG_ADMIN_URL}/services/${serviceName}`, failOnStatusCode: false });
    }

    getService(serviceName) {
        return cy.request({ method: 'GET', url: `${KONG_ADMIN_URL}/services/${serviceName}`, failOnStatusCode: false });
    }
}

export default KongAdminClient;