export default function configureThemes($mdThemingProvider) {


    $mdThemingProvider.theme("success-toast");
    $mdThemingProvider.theme("error-toast");
    $mdThemingProvider.theme("info-toast");
}

configureThemes.$inject = [
    '$mdThemingProvider'
];