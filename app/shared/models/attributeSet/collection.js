
import * as CB from './../cb.js';

export default AttributeSetCollectionFactory;

function AttributeSetCollectionFactory(AttributeSetModel){
  
  var AttributeSetCollection = CB.Collection.extend({
  	model: AttributeSetModel
  });
  CB.collections['attribute-set'] = AttributeSetCollection;
  return AttributeSetCollection;
}

AttributeSetCollectionFactory.$inject = ['AttributeSetModel'];