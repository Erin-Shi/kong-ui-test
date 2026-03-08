import LoginPage from './pages/LoginPage'
import KongAdminClient from './utils/apiClient'

Cypress.Commands.add('login', (username = 'admin', password = 'password') => {
    LoginPage.login(username, password);
});

Cypress.Commands.add('deleteServiceByName', (name) => {
    // Attempt to delete via admin API first for speed; fallback to UI cleanup can be used by tests
    return KongAdminClient.deleteService(name);
});

