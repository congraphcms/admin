/**
 * @ngdoc service
 * @name appSidenavService
 * @module app.shared.appSidenav
 *
 * @description
 * `appSidenavService` makes it easy to interact with App Sidenav
 *
 * @usage
 * <hljs lang="js">
 * // Async toggle the sidenav
 * appSidenavService
 *    .toggle()
 *    .then(function(){
 *      $log.debug('App Sidenav toggled');
 *    });
 * // Async open the given sidenav
 * appSidenavService
 *    .open()
 *    .then(function(){
 *      $log.debug('opened');
 *    });
 * // Async close the sidenav
 * appSidenavService
 *    .close()
 *    .then(function(){
 *      $log.debug('closed');
 *    });
 * // Sync check to see if the sidenav is set to be open
 * appSidenavService.isOpen();
 * </hljs>
 */

export default AppSidenavService;

function AppSidenavService($mdComponentRegistry, $q) {

  var self,
      handle = 'appSidenav',
      errorMsg = "appSidenav '" + handle + "' is not available!",
      instance = $mdComponentRegistry.get(handle);

  return self = {
    // -----------------
    // Sync methods
    // -----------------
    isOpen: function() {
      return instance && instance.isOpen();
    },
    // -----------------
    // Async methods
    // -----------------
    toggle: function() {
      return instance ? instance.toggle() : $q.reject(errorMsg);
    },
    open: function() {
      return instance ? instance.open() : $q.reject(errorMsg);
    },
    close: function() {
      return instance ? instance.close() : $q.reject(errorMsg);
    },
    then : function( callbackFn ) {
      var promise = instance ? $q.when(instance) : waitForInstance();
      return promise.then( callbackFn || angular.noop );
    }
  };

  /**
   * Deferred lookup of component instance using $component registry
   */
  function waitForInstance() {
    return $mdComponentRegistry
              .when(handle)
              .then(function( it ){
                instance = it;
                return it;
              });
  }
}

AppSidenavService.$inject = ["$mdComponentRegistry", "$q"];
