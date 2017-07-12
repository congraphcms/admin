
import * as CB from './../cb.js';

export default RoleCollectionFactory;

function RoleCollectionFactory(RoleModel){
  
  var RoleCollection = CB.Collection.extend({
    model: RoleModel
  });
  CB.collections.role = RoleCollection;
  return RoleCollection;
}
  
RoleCollectionFactory.$inject = ['RoleModel'];