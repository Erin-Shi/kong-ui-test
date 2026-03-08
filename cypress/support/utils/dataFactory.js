class DataFactory {
    static generateServiceName(prefix = 'test-service') {
        return `${prefix}-${Date.now()}`;
        }

    static generateRouteName(prefix = 'test-route') {
        return `${prefix}-${Date.now()}`;
    }

    static getDefaultServiceData() {
        return {
            name: this.generateServiceName(),
            url: 'http://httpbin:80',
            tags: ['test', 'cypress']
            };
        }

    static getDefaultRouteData() {
        return {
            name: this.generateRouteName(),
            path: '/test',
            tags: ['test', 'cypress']
        };
    }
    }

export default DataFactory;