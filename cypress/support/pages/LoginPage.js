class LoginPage {   
    visit() {
        cy.visit('/login');
        }
        
    fillUsername(username) {
        cy.get('#username').clear().type(username);
        }

    fillPassword(password) {
        cy.get('#password').clear().type(password);
        }
    submit() {
        cy.get('button[type="submit"]').click();
        }
    login(username, password) {
        this.visit();
        this.fillUsername(username);
        this.fillPassword(password);
        this.submit();
        cy.url().should('include', '/dashboard');
        }
            getErrorMessage() {
        return cy.get('.error-message');
        }
    }
    export default LoginPage;