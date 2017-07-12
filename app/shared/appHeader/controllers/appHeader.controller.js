
var BOUND_CTRL_METHODS = [
  'appSidenavToggle'
];

import md5 from 'blueimp-md5';

export default class AppHeaderController {
  constructor(
    $scope, 
    $rootScope, 
    $state, 
    $element, 
    $attrs, 
    $document, 
    OAuth, 
    appSidenavService,
    $mdMedia) {
    /* jshint validthis: true */
    var vm = this;

    vm.$scope = $scope;
    vm.$rootScope = $rootScope;
    vm.$element = $element;
    vm.$attrs = $attrs;
    vm.$document = $document;
    vm.$state = $state;
    vm.OAuth = OAuth;

    vm.appSidenavService = appSidenavService;

    vm.$mdMedia = $mdMedia;

    angular.forEach(BOUND_CTRL_METHODS, function(methodName) {
      vm[methodName] = angular.bind(vm, vm[methodName]);
    });

    vm.init();
  }

  init() {
    var vm = this;

    // // make sure to get instance
    vm.appSidenavService.then(function(result){
      
    });

    // get settingsMenuItems
    vm.settingsMenuItems = vm.getSettingsMenuItems();
    vm.title = vm.$rootScope.translate('app_name');
    vm.getUser();
  }

  getSettingsMenuItems() {
    return [
      {
        label: 'Workpsace Settings',
        icon: 'settings'
      }, 
      {
        label: 'General Settings',
        icon: 'settings'
      }
    ];
  }

  getGravatar() {
    var email = this.user.email;
    email = email.toLowerCase().trim();
   
    var hash = md5(email);

    return hash;
  }

  getUser() {
    var self = this;
    self.OAuth.getUser().then(function(user){
      self.user = user;
      self.showUserProfile();
    });
  }

  showUserProfile() {
    this.showProfile = true;
  }

  appSidenavToggle() {
    this.appSidenavService.toggle();
  }

  logout() {
    var vm = this;
    vm.OAuth.revokeToken().then(function(response){
      console.log('revoke token response', response);
      vm.$state.go('login', {}, {reload: true});
    },
    function(errors){
      console.log('revoke token errors', errors)
    });
    console.log('logging out...');
  }
}


AppHeaderController.$inject = [
  '$scope', 
  '$rootScope',
  '$state',
  '$element', 
  '$attrs',
  '$document',
  'cbOAuth',
  'appSidenavService',
  '$mdMedia'
];
