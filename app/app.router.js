
function RouterConfig($stateProvider, $urlRouterProvider){
  $urlRouterProvider.otherwise("/");
}

RouterConfig.$inject = [
  '$stateProvider',
  '$urlRouterProvider'
];

export default RouterConfig;
