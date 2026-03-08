import ElementUtils from '../utils/elementUtils'
import InputUtils from '../utils/inputUtils'

class RouteCreationPage {
    // Verify the create route page header
    checkHeader() {
        return ElementUtils.checkPageNavigation('Create Route', 'h3');
    }

    fillRouteName(name){
        return ElementUtils.setValueByTestId('route-form-name', name);
    }

    validateRouteName(name) {
        return InputUtils.validateString(name, { maxLength: 100, forbiddenRegex: /[\x00-\x1F]/g });
    }

    // Accept either a single path string or array of paths
    fillPath(path){
        const pathsString = Array.isArray(path) ? path.join(',') : path;
        return ElementUtils.setValueByTestId('route-form-paths-input-1', pathsString);
    }

    validatePath(path){
        return InputUtils.validateString(Array.isArray(path) ? path.join(',') : path, { maxLength: 500 });
    }

    fillTag(tag){
        const tagsString = Array.isArray(tag) ? tag.join(',') : tag;
        return ElementUtils.setValueByTestId('route-form-tags', tagsString);
    }

    validateTag(tag){
        const tagsString = Array.isArray(tag) ? tag.join(',') : tag;
        return InputUtils.validateString(tagsString, { maxLength: 200, forbiddenRegex: /[^a-zA-Z0-9,\-\s]/g });
    }

    fillForm(routeData){
        if (routeData.name) this.fillRouteName(routeData.name);
        if (routeData.path) this.fillPath(routeData.path);
        if (routeData.tag) this.fillTag(routeData.tag);
        if (routeData.serviceName) this.chooseService(routeData.serviceName);
    }

    // Select an existing service to attach to the route (best-effort)
    chooseService(serviceName) {
        if (!serviceName) return cy.wrap(null);
        // Try common select patterns: a dropdown trigger with data-testid 'service-select' or an input
        const optionSelector = `[data-testid="service-option-${serviceName}"]`;
        return cy.document().then(doc => {
            if (doc.querySelector('[data-testid="service-select"]')) {
                ElementUtils.clickByTestId('service-select');
                if (doc.querySelector(optionSelector)) {
                    ElementUtils.click(optionSelector);
                }
                return;
            }
            if (doc.querySelector(optionSelector)) {
                ElementUtils.click(optionSelector);
                return;
            }
            // fallback: no-op
            return cy.wrap(null);
        });
    }

    submit(){
        return ElementUtils.clickByTestId('route-create-form-submit');
    }

    cancel(){
        return ElementUtils.clickByTestId('route-create-form-cancel');
    }

    createRoute(routeData){
        this.fillForm(routeData);
        return this.submit();
    }
}

export default new RouteCreationPage();
