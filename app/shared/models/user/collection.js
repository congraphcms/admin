
import * as CB from './../cb.js';

export default UserCollectionFactory;

function UserCollectionFactory(UserModel){
  
  var UserCollection = CB.Collection.extend({
    model: UserModel
  });
  CB.collections.user = UserCollection;
  return UserCollection;
}
  
UserCollectionFactory.$inject = ['UserModel'];