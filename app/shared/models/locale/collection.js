
import * as CB from './../cb.js';

export default LocaleCollectionFactory;

function LocaleCollectionFactory(LocaleModel){
  
  var LocaleCollection = CB.Collection.extend({
    model: LocaleModel
  });
  CB.collections.locale = LocaleCollection;
  return LocaleCollection;
}
  
LocaleCollectionFactory.$inject = ['LocaleModel'];