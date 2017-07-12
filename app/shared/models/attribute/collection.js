
import * as CB from './../cb.js';

export default AttributeCollectionFactory;

function AttributeCollectionFactory(AttributeModel){
  
  var AttributeCollection = CB.Collection.extend({
    model: AttributeModel
  });
  // CB.collections['attribute'] = AttributeCollection;
  CB.collections.attribute = AttributeCollection;
  return AttributeCollection;
}

AttributeCollectionFactory.$inject = ['AttributeModel'];