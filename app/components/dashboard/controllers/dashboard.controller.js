export default class DashboardController{
  constructor($scope, $rootScope, $state) {
    /* jshint validthis: true */
    var ctrl = this;

    ctrl.$state = $state;

    // init();

    ctrl.contentModelCards = [
      {
        key: 'attributes',
        title: $rootScope.translate('attributes_label'),
        description: $rootScope.translate('attributes_description'),

      },
      {
        key: 'contenttypes',
        title: $rootScope.translate('content_types_label'),
        description: $rootScope.translate('content_types_description'),
      }
    ];

    ctrl.getCardSref = function(key) {
      switch (key) {
        case 'attributes':
          ctrl.$state.go('app.attributes');
          break;
        case 'contenttypes':
          ctrl.$state.go('app.contentModels');
          break;
        default:

      }
    };

  }
}


DashboardController.$inject = [
  '$scope',
  '$rootScope',
  '$state'
];
