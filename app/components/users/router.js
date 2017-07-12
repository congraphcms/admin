import listingTemplate from './views/userListing.tmpl.html';
import formTemplate from './views/userForm.tmpl.html';
import passwordFormTemplate from './views/userPasswordForm.tmpl.html';

export default function UsersRouterConfig($stateProvider) {
  
  $stateProvider
    .state('app.users', {
      url: '/users',
      template: listingTemplate,
      requireAuth: true,
      controller: 'UserListingController',
      controllerAs: 'vm'
    })

    .state('app.users.new', {
      url: '/new', 
      template: formTemplate,
      requireAuth: true,
      controller: 'UserFormController',
      controllerAs: 'vm',
      resolve: {
        userModel : resolveNewUserModel,
        roles: resolveRoles
      }
    })

    .state('app.users.edit', {
      url: '/:id', 
      template: formTemplate,
      requireAuth: true,
      controller: 'UserFormController',
      controllerAs: 'vm',
      resolve: {
        userModel : resolveUserModel,
        roles: resolveRoles
      }
    })

    .state('app.users.edit.password', {
      url: '/change-password', 
      template: passwordFormTemplate,
      requireAuth: true,
      controller: 'UserPasswordFormController',
      controllerAs: 'vm'
    });
}

UsersRouterConfig.$inject = [
  '$stateProvider'
];

function resolveNewUserModel(UserRepository) {
  return UserRepository.newModel();
}

resolveNewUserModel.$inject = [
  'UserRepository'
];

function resolveUserModel(UserRepository, $stateParams) {

  // @todo check / validate id
  var model = UserRepository.get($stateParams.id); // returns promise
  return model;
}

resolveUserModel.$inject = [
  'UserRepository',
  '$stateParams'
];

function resolveRoles(RoleRepository) {
  return RoleRepository.get(); 
}

resolveRoles.$inject = ['RoleRepository'];

