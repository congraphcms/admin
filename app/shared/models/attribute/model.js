
import * as CB from './../cb.js';

export default AttributeModelFactory;

function AttributeModelFactory(){
    
  var AttributeModel = CB.Model.extend({
    defaults: {
      type: 'attribute',
      code: '',
      admin_label: '',
      admin_notice: '',
      localized: 0,
      required: 0,
      unique: 0,
      filterable: 0,
      field_type: null,
      default_value: null,
      options: [],
      data: {}
    },
    emptyOption: {
      label: '',
      value: '',
      locale: 0,
      default: 0
    },

    addOption: function(option){
      option || (option = {});
      var opt = _.defaults({}, option, this.emptyOption);
      if(!_.isArray(this.attributes.options)){
        this.attributes.options = [];
      }
      this.attributes.options.push(opt);

      return opt;
    },

    removeOption: function(option){
      var index = _.indexOf(this.attributes.options, option);
      if(index < 0){
        throw new Error("Can't remove option, provided option doesn't exist in this model.");
      }
      this.attributes.options.splice(index, 1);
    }

  });

  CB.models.attribute = AttributeModel;
  
  return AttributeModel;
}

AttributeModelFactory.$inject = [];