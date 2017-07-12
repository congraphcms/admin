
import * as CB from './../cb.js';

export default EntityTypeCollectionFactory;

function EntityTypeCollectionFactory(EntityTypeModel){
  
  var EntityTypeCollection = CB.Collection.extend({
  	model: EntityTypeModel
  });
  CB.collections['entity-type'] = EntityTypeCollection;
  return EntityTypeCollection;
}

EntityTypeCollectionFactory.$inject = ['EntityTypeModel'];