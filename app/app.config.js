
import translations from './translations.js';

function mdThemesConfig($mdThemingProvider) {

    // $mdThemingProvider.generateThemesOnDemand(true);

    // Configure a dark theme with primary foreground yellow
    $mdThemingProvider.theme('cb-dark')
        .primaryPalette('grey', { 'default': '800' })
        .accentPalette('grey', { 'default': '700' })
        .dark();

    // Configure a dark theme with primary foreground yellow
    $mdThemingProvider.theme('cb-grey', 'default')
        .backgroundPalette('grey', { 'default': '200' });


}
mdThemesConfig.$inject = [
    '$mdThemingProvider'
];

function translationsConfig($rootScope) {
    $rootScope.translations = translations;
    $rootScope.language = 'sr';
    $rootScope.translate = function (key) {
        return $rootScope.translations[$rootScope.language][key] || key;
    };

    angular.element(document.getElementById('loader-text')).html($rootScope.translate('please_wait_text'));
}
translationsConfig.$inject = [
    '$rootScope'
];

function authConfig($rootScope, $state, $stateParams, cbOAuth) {
    $rootScope.$on('$stateChangeStart', function (event, toState, toStateParams) {
        // track the state the user wants to go to;
        // authorization service needs this
        $rootScope.toState = toState;
        $rootScope.toStateParams = toStateParams;

        // if the principal is resolved, do an
        // authorization check immediately. otherwise,
        // it'll be done when the state it resolved.


        if (toState.requireAuth && !cbOAuth.isAuthenticated()) {
            event.preventDefault();
            console.warn('Not Authorized', cbOAuth.isAuthenticated());
            $state.go('login', { redirect: toState, redirectParams: toStateParams }, { reload: true });
            return;
        }

        if (toState.name == 'login' && cbOAuth.isAuthenticated()) {
            console.warn('Already authenticated');
            event.preventDefault();
            $state.go('app.dashboard');
            return;
        }

        if (!cbOAuth.ownerExists() && cbOAuth.isAuthenticated()) {
            cbOAuth.getOwner();
        }

    });

    $rootScope.$on('oauth:error', function (event, errors) {
        console.error('oauth:error handler', errors);
        $state.go('login', { reload: true });
    });
}

authConfig.$inject = [
    '$rootScope',
    '$state',
    '$stateParams',
    'cbOAuth'
];

export {
    mdThemesConfig,
    translationsConfig,
    authConfig
};