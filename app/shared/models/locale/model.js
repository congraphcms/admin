
import * as CB from './../cb.js';

export default LocaleModelFactory;

function LocaleModelFactory(){
    
  var LocaleModel = CB.Model.extend({
    defaults: {
      type: 'locale',
      code: '',
      name: '',
      description: ''
    }

  });

  CB.models.locale = LocaleModel;
  
  return LocaleModel;
}

LocaleModelFactory.$inject = [];