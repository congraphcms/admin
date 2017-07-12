
import * as CB from './../cb.js';
import _ from 'underscore';

export default UserRepositoryFactory;

function UserRepositoryFactory($http, Repository, UserModel, UserCollection){
  
  var UserRepository = new Repository('/users');
  UserRepository.setModel(UserModel);
  UserRepository.setCollection(UserCollection);

  UserRepository.changePassword = function(id, password){
    if(_.isNull(password)) throw new Error("You need to specify a password.");
    var url = this.client.cleanUrl(this.client.domain + '/' + this.client.url + '/' + id + '/' + 'change-password');
    var config = {
      'data': {
        password: password
      },
      'responseType': 'json',
      'headers': {
        'Accept': this.client.acceptHeader
      },
    };

    return $http.post(url, config);
  }

  return UserRepository;
}

UserRepositoryFactory.$inject = [
	"$http",
  "Repository", 
  "UserModel", 
  "UserCollection"
];