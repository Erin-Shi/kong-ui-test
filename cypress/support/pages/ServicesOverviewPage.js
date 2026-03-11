import ElementUtils from '../utils/elementUtils'

class ServicesOverviewPage {
    visit() {
        // Use centralized visit wrapper and header check
        ElementUtils.visitPage('/services');
        ElementUtils.checkPageNavigation('Gateway Services', 'h3');
        ElementUtils.waitForLoadingToFinish();
    }

    selectService(serviceName) {
        ElementUtils.clickByTestId(serviceName);
        // Use centralized navigation check to verify the page header
        ElementUtils.checkPageNavigation(serviceName, 'h3');
    }

    clickAddServiceInToolbar() {
        ElementUtils.clickByTestId('toolbar-add-gateway-service');
        ElementUtils.checkPageNavigation('New Gateway Service', 'h3');
    }

    clickAddServiceFromEmpty() {
        ElementUtils.clickByTestId('empty-state-action');
        ElementUtils.checkPageNavigation('New Gateway Service', 'h3');
    }

    findService(serviceName) {
        return ElementUtils.existsByTestId(serviceName);
    }

    deleteService(serviceName){
        // Click the row's dropdown trigger then perform delete via modal
        const triggerSelector = `tr[data-testid="${serviceName}"] button[data-testid="row-actions-dropdown-trigger"]`;
        ElementUtils.click(triggerSelector);
        const deleteOptionSelector = `div[data-testid="${serviceName}-actions-dropdown-popover"] [data-testid="action-entity-delete"]`;
        ElementUtils.click(deleteOptionSelector);
        ElementUtils.setValueByTestId("confirmation-input", serviceName);
        ElementUtils.clickByTestId("modal-action-button");
    }
}

export default new ServicesOverviewPage();
