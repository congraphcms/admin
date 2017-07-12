/**
 * @ngdoc module
 * @name app.components.users
 * @description
 *
 * User management
 */

import UsersRouterConfig from './router.js';
import UserListingController from './controllers/userListing.controller.js';
import UserFormController from './controllers/userForm.controller.js';
import UserEditorController from './controllers/userEditor.controller.js';
import UserEditorDirective from './directives/userEditor.directive.js';
import UserEmailUniqueValidator from './directives/userEmailUnique.validator.js';
import UserPasswordFormController from './controllers/userPasswordForm.controller.js';
import UserPasswordEditorController from './controllers/userPasswordEditor.controller.js';
import UserPasswordEditorDirective from './directives/userPasswordEditor.directive.js';


export default 'app.components.users';
angular
  .module('app.components.users', [])

  .controller('UserListingController', UserListingController)
  .controller('UserFormController', UserFormController)
  .controller('UserEditorController', UserEditorController)
  .controller('UserPasswordFormController', UserPasswordFormController)
  .controller('UserPasswordEditorController', UserPasswordEditorController)
  .directive('userEditor', UserEditorDirective)
  .directive('userPasswordEditor', UserPasswordEditorDirective)
  .directive('userEmailUnique', UserEmailUniqueValidator)

  .config(UsersRouterConfig);
