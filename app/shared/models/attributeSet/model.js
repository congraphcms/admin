
import * as CB from './../cb.js';
import _ from 'underscore';

export default AttributeSetModelFactory;

function AttributeSetModelFactory(AttributeModel, AttributeCollection){
  
  var AttributeSetModel = CB.Model.extend({
    defaults: function(){
      return {
        type: 'attribute-set',
        code: '',
        entity_type_id: null,
        primary_attribute_id: null,
        name: '',
        attributes: []
      };
    },

    addAttribute: function(attribute){
      if(!_.isObject(attribute) || !(attribute instanceof AttributeModel) || attribute.isNew()){
        throw new Error("You can only add existing AttributeModel instances to attribute set.");
      }
      
      this._checkAttributesCollection();
      this.attributes.attributes.push(attribute);

      return attribute;
    },

    removeAttribute: function(attribute){
      this._checkAttributesCollection();
      return this.attributes.attributes.remove(attribute);
    },

    getPrimaryAttribute: function() {
      var self = this;
      var primaryAttribute = null;
      this._checkAttributesCollection();
      _.each(this.attributes.attributes.models, function(attribute){
        if(attribute.id == self.attributes.primary_attribute_id) {
          primaryAttribute = attribute;
        }
      });

      return primaryAttribute;
    },

    _checkAttributesCollection: function() {
      if(!(this.attributes.attributes instanceof AttributeCollection)){
        this.attributes.attributes = new AttributeCollection();
      }
    }

  });

  CB.models['attribute-set'] = AttributeSetModel;
  return AttributeSetModel;
}

AttributeSetModelFactory.$inject = ['AttributeModel', 'AttributeCollection'];