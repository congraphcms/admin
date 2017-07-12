/**
 * @ngdoc module
 * @name app.shared.models
 * @description
 *
 * CB Models
 */

import ClientFactory from './client.js';
import RepositoryFactory from './repository.js';

import LocaleModelFactory from './locale/model.js';
import LocaleCollectionFactory from './locale/collection.js';
import LocaleRepositoryFactory from './locale/repository.js';
import LocalesService from './locale/service.js';

import RoleModelFactory from './role/model.js';
import RoleCollectionFactory from './role/collection.js';
import RoleRepositoryFactory from './role/repository.js';

import UserModelFactory from './user/model.js';
import UserCollectionFactory from './user/collection.js';
import UserRepositoryFactory from './user/repository.js';
import UsersService from './user/service.js';

import AttributeModelFactory from './attribute/model.js';
import AttributeCollectionFactory from './attribute/collection.js';
import AttributeRepositoryFactory from './attribute/repository.js';
import AttributesService from './attribute/service.js';

import WorkflowPointModelFactory from './workflowPoint/model.js';
import WorkflowPointCollectionFactory from './workflowPoint/collection.js';
import WorkflowPointRepositoryFactory from './workflowPoint/repository.js';

import WorkflowModelFactory from './workflow/model.js';
import WorkflowCollectionFactory from './workflow/collection.js';
import WorkflowRepositoryFactory from './workflow/repository.js';

import AttributeSetModelFactory from './attributeSet/model.js';
import AttributeSetCollectionFactory from './attributeSet/collection.js';
import AttributeSetRepositoryFactory from './attributeSet/repository.js';
import AttributeSetsService from './attributeSet/service.js';

import EntityTypeModelFactory from './entityType/model.js';
import EntityTypeCollectionFactory from './entityType/collection.js';
import EntityTypeRepositoryFactory from './entityType/repository.js';
import EntityTypesService from './entityType/service.js';

import FileModelFactory from './file/model.js';
import FileCollectionFactory from './file/collection.js';
import FileRepositoryFactory from './file/repository.js';

import EntityModelFactory from './entity/model.js';
import EntityCollectionFactory from './entity/collection.js';
import EntityRepositoryFactory from './entity/repository.js';


export default 'app.shared.models';

angular
  .module('app.shared.models', [])

  .factory('Client', ClientFactory)
  .factory('Repository', RepositoryFactory)

  .factory('LocaleModel', LocaleModelFactory)
  .factory('LocaleCollection', LocaleCollectionFactory)
  .factory('LocaleRepository', LocaleRepositoryFactory)
  .service('LocalesService', LocalesService)

  .factory('RoleModel', RoleModelFactory)
  .factory('RoleCollection', RoleCollectionFactory)
  .factory('RoleRepository', RoleRepositoryFactory)

  .factory('UserModel', UserModelFactory)
  .factory('UserCollection', UserCollectionFactory)
  .factory('UserRepository', UserRepositoryFactory)
  .service('UsersService', UsersService)
  
  .factory('AttributeModel', AttributeModelFactory)
  .factory('AttributeCollection', AttributeCollectionFactory)
  .factory('AttributeRepository', AttributeRepositoryFactory)
  .service('AttributesService', AttributesService)

  .factory('WorkflowPointModel', WorkflowPointModelFactory)
  .factory('WorkflowPointCollection', WorkflowPointCollectionFactory)
  .factory('WorkflowPointRepository', WorkflowPointRepositoryFactory)

  .factory('WorkflowModel', WorkflowModelFactory)
  .factory('WorkflowCollection', WorkflowCollectionFactory)
  .factory('WorkflowRepository', WorkflowRepositoryFactory)
  
  .factory('AttributeSetModel', AttributeSetModelFactory)
  .factory('AttributeSetCollection', AttributeSetCollectionFactory)
  .factory('AttributeSetRepository', AttributeSetRepositoryFactory)
  .service('AttributeSetsService', AttributeSetsService)

  .factory('EntityTypeModel', EntityTypeModelFactory)
  .factory('EntityTypeCollection', EntityTypeCollectionFactory)
  .factory('EntityTypeRepository', EntityTypeRepositoryFactory)
  .service('EntityTypesService', EntityTypesService)

  .factory('FileModel', FileModelFactory)
  .factory('FileCollection', FileCollectionFactory)
  .factory('FileRepository', FileRepositoryFactory)

  .factory('EntityModel', EntityModelFactory)
  .factory('EntityCollection', EntityCollectionFactory)
  .factory('EntityRepository', EntityRepositoryFactory);
