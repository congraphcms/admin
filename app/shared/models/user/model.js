
import * as CB from './../cb.js';

export default UserModelFactory;

function UserModelFactory(RoleCollection){
    
  var UserModel = CB.Model.extend({
    defaults: {
      type: 'user',
      name: '',
      email: '',
      roles: new RoleCollection()
    }

  });

  CB.models.user = UserModel;
  
  return UserModel;
}

UserModelFactory.$inject = ['RoleCollection'];