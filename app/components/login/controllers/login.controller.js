

export default class LoginController{

  constructor(OAuth, $scope, $rootScope, $state, $stateParams, $element, $q, $timeout) {
    /* jshint validthis: true */
    var vm = this;

    vm.OAuth = OAuth;

    vm.$scope = $scope;
    vm.$rootScope = $rootScope;
    vm.$state = $state;
    vm.$stateParams = $stateParams
    vm.$element = $element;
    vm.$q = $q;
    vm.$timeout = $timeout;

    vm.init();

    $scope.$on('$viewContentLoaded', handleViewContentLoaded);
    function handleViewContentLoaded(event) {
      $timeout(function(){
        angular.element(document.getElementById('appLoader')).addClass('done');
      }, 200);
    }
  }

  init() {
    var vm = this;

    vm.email = '';
    vm.password = '';
    vm.errors = {};
  }

  login() {
    var vm = this;
    if(vm.busy) return false;
    vm.busy = true;
    vm.errors = {};
    var result = vm.OAuth.authenticate({username: vm.email, password: vm.password});
    
    result.then(function(response){
      if(vm.$stateParams.redirect) {
        vm.$state.go(vm.$stateParams.redirect.name, vm.$stateParams.redirectParams);
      } else {
        vm.$state.go('app.dashboard');
      }
    }, function(response){
      vm.busy = false;
      vm.errors.serverError = true;
      vm.errors.serverErrorMessage = response.data.message;
    });
  }
}


LoginController.$inject = [
  'cbOAuth',
  '$scope',
  '$rootScope',
  '$state',
  '$stateParams',
  '$element',
  '$q', 
  '$timeout'
];
