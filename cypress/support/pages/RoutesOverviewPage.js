import ElementUtils from '../utils/elementUtils'

class RoutesOverviewPage {
    visit() {
        ElementUtils.visitPage('/routes');
        ElementUtils.checkPageNavigation('Routes', 'h3');
        ElementUtils.waitForLoadingToFinish();
    }

    clickAddRouteFromEmpty() {
        ElementUtils.clickByTestId('empty-state-action');
        ElementUtils.checkPageNavigation('Create Route', 'h3');
    }

    clickAddRouteInToolbar() {
        ElementUtils.clickByTestId('toolbar-add-route');
        ElementUtils.checkPageNavigation('Create Route', 'h3');
    }

    selectRoute(routeName) {
        ElementUtils.clickByTestId(routeName);
        ElementUtils.checkPageNavigation(routeName, 'h3');
    }

    findRoute(routeName) {
        return ElementUtils.existsByTestId(routeName);
    }

    deleteRoute(routeName) {
        const triggerSelector = `tr[data-testid="${routeName}"] button[data-testid=\"row-actions-dropdown-trigger\"]`;
        ElementUtils.click(triggerSelector);
        const deleteOptionSelector = `div[data-testid="${routeName}-actions-dropdown-popover"] [data-testid="action-entity-delete"]`;
        ElementUtils.click(deleteOptionSelector);
        ElementUtils.setValueByTestId("confirmation-input", routeName);
        ElementUtils.clickByTestId("modal-action-button");
    }
}

export default new RoutesOverviewPage();
