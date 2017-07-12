
import * as CB from './../cb.js';

export default RoleModelFactory;

function RoleModelFactory(){
    
  var RoleModel = CB.Model.extend({
    defaults: {
      type: 'role',
      name: '',
      description: '',
      scopes: []
    }

  });

  CB.models.role = RoleModel;
  
  return RoleModel;
}

RoleModelFactory.$inject = [];