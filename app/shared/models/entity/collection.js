
import * as CB from './../cb.js';

export default EntityCollectionFactory;

function EntityCollectionFactory(EntityModel){
    
  var EntityCollection = CB.Collection.extend({
  	model: EntityModel
  });
  CB.collections.entity = EntityCollection;
  return EntityCollection;
}
  
EntityCollectionFactory.$inject = ['EntityModel'];