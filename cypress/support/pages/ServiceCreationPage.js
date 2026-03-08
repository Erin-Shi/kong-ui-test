import ElementUtils from '../utils/elementUtils'
import InputUtils from '../utils/inputUtils'

class ServiceCreationPage {
    visit() {
        ElementUtils.visitPage('/services/create');
        ElementUtils.checkPageNavigation('New Gateway Service', 'h3');
    }

    // Type into the service name input without sanitization
    fillServiceName(name){
        return ElementUtils.setValueByTestId('gateway-service-name-input', name);
    }

    // Provide a pure validation method for the service name (no UI interaction)
    validateServiceName(name) {
        return InputUtils.validateString(name, { maxLength: 50, forbiddenRegex: /[\x00-\x1F]/g });
    }

    // Type into the URL input without sanitization
    fillUrl(url){
        return ElementUtils.setValueByTestId('gateway-service-url-input', url);
    }

    // Pure validation for URL
    validateUrl(url) {
        return InputUtils.validateString(url, { forbiddenRegex: /[\s\x00-\x1F]/g });
    }

    // Type tags input; accepts array or comma-separated string (no sanitization)
    fillTag(tag){
        const tagsString = Array.isArray(tag) ? tag.join(',') : tag;
        // Expand tags section if present
        ElementUtils.clickByTestId('collapse-trigger-content');
        return ElementUtils.setValueByTestId('gateway-service-tags-input', tagsString);
    }

    // Pure validation for tags string
    validateTag(tag){
        const tagsString = Array.isArray(tag) ? tag.join(',') : tag;
        return InputUtils.validateString(tagsString, { maxLength: 200, forbiddenRegex: /[^a-zA-Z0-9,\-\s]/g });
    }

    fillForm(serviceData){
        if (serviceData.url)
            this.fillUrl(serviceData.url);
        if (serviceData.name)
            this.fillServiceName(serviceData.name);
        if (serviceData.tag)
            this.fillTag(serviceData.tag);
    }
    
    submit() {
        ElementUtils.clickByTestId('service-create-form-submit');
    }

    cancel(){
        ElementUtils.clickByTestId('service-create-form-cancel');
    }

    createService(serviceData){
        this.fillForm(serviceData);
        this.submit();
    }
}

export default new ServiceCreationPage();
