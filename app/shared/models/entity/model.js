
import * as CB from './../cb.js';
import _ from 'underscore';

export default EntityModelFactory;

function EntityModelFactory(AttributeSetModel, EntityTypeModel, FileModel) {

  var EntityModel = CB.Model.extend({
    defaults: {
      type: 'entity',
      code: '',
      entity_type_id: null,
      entity_type: null,
      attribute_set_id: null,
      attribute_set: null,
      status: null,
      locale: null,
      fields: {}
    },

    setEntityType: function(entityType) {
      if(!EntityTypeModel) { EntityTypeModel = $injector.get('EntityTypeModel'); }
      if(!_.isObject(entityType) || !(entityType instanceof EntityTypeModel) || entityType.isNew()) {
        throw new Error("You can only set existing EntityTypeModel instance as entity's entity type.");
      }
      this.attributes.entity_type = entityType;
      this.attributes.entity_type_id = entityType.id;
    },

    setAttributeSet: function(attributeSet) {
      if(!_.isObject(attributeSet) || !(attributeSet instanceof AttributeSetModel) || attributeSet.isNew()) {
        throw new Error("You can only set existing AttributeSetModel instance as entity's attribute set.");
      }
      this.attributes.attribute_set = attributeSet;
      this.attributes.attribute_set_id = attributeSet.id;
    },

    setField: function(field, value, locale) {
      if( this.attributes.locale || ! locale) {
        this.attributes.fields[field] = value;
      } else {
        if( ! _.isObject(this.attributes.fields[field]) ) {
          this.attributes.fields[field] = {};
        }
        this.attributes.fields[field][locale] = value;
      }
    },

    getField: function(field, locale) {
      if( this.attributes.locale || ! locale) {
        return this.attributes.fields[field];
      } else {
        if( ! _.isObject(this.attributes.fields[field]) || ! this.attributes.fields[field][locale]) {
          return this.attributes.fields[field];
        }
        return this.attributes.fields[field][locale];
      }
    },

    getTitle: function(locale) {

      var field = this.attributes.fields[this.attributes.primary_field];

      return this.getTitleFromField(field, locale, true);

    },

    getContactName() {
      if(this.get('attribute_set_code') == 'person') {
        var name = (this.getField('person_name'))?this.getField('person_name'): '' ;
        var surname = (this.getField('person_surname'))?this.getField('person_surname'): '' ;
        return name + ' ' + surname;
      } else {
        return this.getField('company_name');
      }
    },

    getCaseTitle() {
      var caseId = this.getField('case_id');
      var caseDescription = (this.getField('case_description'))?this.getField('case_description'): '' ;
      return caseId + ' - ' + caseDescription;
    },

    getTitleFromField: function(field, locale, includePrefix) {
      var self = this;
      var title = field;
      var prefix = (includePrefix)?this.attributes.primary_field + ': ':'';

      if( locale && _.isObject(field)) {

        if(_.isObject(locale)){
          locale = locale.code;
        }

        if(field[locale]){
          title = field[locale];
        }
      }

      if(_.isArray(title) || title instanceof CB.Collection) {
        if(title instanceof CB.Collection) {
          title = title.models;
        }

        var concatTitle = '[';
        _.each(title, function(t){
          concatTitle += self.getTitleFromField(t);
        });
        concatTitle += ']';
        title = concatTitle;

        return title;
      }

      if(title instanceof EntityModel) {
        title = prefix + title.getTitle();
        return title;
      }

      if(title instanceof FileModel) {
        title = prefix + title.get('name');
        return title;
      }

      return title;
    },

    getLocale: function(locale) {
      if(_.isObject(locale)){
        locale = locale.get('code');
      }

      var data = this.getData();
      if(data.locale) {
        if(locale != locale) {
          return false;
        }

        return this;
      }

      if(!data.status[locale]) {
        return false;
      }

      data.status = data.status[locale];

      _.each(data.fields, function(field, key) {
        if(_.isObject(field) && locale in field) {
          data.fields[key] = field[locale];
        }
      });

      return new EntityModel(data);
    }

  });

  CB.models.entity = EntityModel;
  return EntityModel;
}

EntityModelFactory.$inject = ['AttributeSetModel', 'EntityTypeModel', 'FileModel'];
