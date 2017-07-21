
import _ from 'underscore';

export default class EntityEditorController{

  constructor (
    EditorRegistry, 
    EntityRepository, 
    fieldTypes, 
    fieldSelection,
    $attrs, 
    $element, 
    $scope, 
    $rootScope, 
    $state, 
    $q, 
    $timeout, 
    $compile
  ) {

    /* jshint validthis: true */
    var editor = this;

    console.log('EntityEditorController', editor);

    editor.fieldTypes = fieldTypes;
    editor.fieldSelection = fieldSelection;

    editor.form = $element.controller('form');

    editor.$attrs = $attrs;
    editor.$element = $element;
    editor.$scope = $scope;
    editor.$rootScope = $rootScope;
    editor.$state = $state;
    editor.$q = $q;
    editor.$timeout = $timeout;
    editor.$compile = $compile;

    editor.EditorRegistry = EditorRegistry;

    editor.EntityRepository = EntityRepository;

    editor.workflow = editor.contentModel.get('workflow');
    editor.workflowPoints = editor.workflow.get('points');
    editor.currentWorkflowPoint = editor.workflowPoints.findWhere({status:editor.model.get('status')});
    editor.statusColor = {color: editor.getStatusColor(editor.currentWorkflowPoint)};

    editor.init();
  }

  init() {
    var editor = this;

    editor.$scope.$watch('attrEditor.form.$pending', function(newValue) {

      if(newValue == undefined) {
        editor.busy = false;
      } else {
        editor.busy = true;
      }
    });

    editor.getTranslations();

    editor.deregister = editor.EditorRegistry.register(this, editor.model);
  }


  isNew() {
    return this.model.isNew();
  }

  getTitle() {
    var editor = this;
    return editor.model.getTitle();
  }

  getFullStatus(status) {
    var editor = this;

    if(_.isObject(status)) {
      status = status.get('status');
    }
    
    var point = null;
    _.each(editor.workflowPoints.models, function(workflowPoint){
      if(workflowPoint.get('status') == status) {
        point = workflowPoint;
      }
    });

    return point;
  }

  getStatus(point) {
    if(!point) return false;
    return point.get('name');
  }

  getStatusAction(point) {
    if(!point) return false;
    return point.get('action');
  }

  getStatusColor(point) {
    if(!point) return false;
    var colors = {
      green: 'green-A700',
      amber: 'amber-300',
      red: 'deep-orange-A700'
    };

    if(point.get('public')) {
      return colors.green;
    }
    if(point.get('deleted')) {
      return colors.red;
    }

    return colors.amber;
  }

  allowedPoint(point) {
    var allowedSteps = this.currentWorkflowPoint.get('steps');
    if(!allowedSteps || !allowedSteps.length) {
      return false;
    }
    var allowed = allowedSteps.findWhere({id: point.id});
    return !!allowed;
  }

  isLocalized() {
    var editor = this;
    if(editor.locales.length <= 1) {
      return false;
    }

    return editor.model.get('localized');
  }


  save(point) {
    var editor = this;
    
    editor.form.$setDirty(true);
    editor.form.$setSubmitted(true);

    if(editor.form.$invalid) {

      var defered = editor.$q.defer();
      defered.reject({error: "Invalid form"});
      return defered.promise;
    }

    if(point) {
      editor.model.set('status', point.get('status'));
    }

    editor.busy = true;
    var promise = editor.EntityRepository.save(editor.model);
    promise.then(function(result){

      result.setAttributeSet(editor.model.get('attribute_set'));
      result.setEntityType(editor.model.get('entity_type'));
      editor.deregister();
      editor.model = result;

      editor.getTranslations();

      editor.deregister = editor.EditorRegistry.register(editor, result);
      editor.busy = false;
      editor.form.$setDirty(false);

      editor.currentWorkflowPoint = editor.workflowPoints.findWhere({status:result.get('status')});
      editor.statusColor = {color: editor.getStatusColor(editor.currentWorkflowPoint)};
      editor.form.$setPristine(true);

      editor.$rootScope.$broadcast('editor.entitySaved', editor, result);

      return result;
    }, function(errors){
      console.error("SAVE ENTITY ERROR", errors);
      editor.busy = false;
      return errors;
    });

    return promise;
  }

  delete() {
    var editor = this;
    var defered = editor.$q.defer();

    if(editor.isNew()) {
      defered.reject('can\'t delete unsaved field.');
      return defered.promise;
    }

    return editor.EntityRepository.delete(editor.model);
  }

  getTranslations() {
    var editor = this;
    editor.translations = {};

    _.each(editor.locales.models, function(locale){
      if(locale.get('code') == editor.model.get('locale')) {
        return;
      }
      editor.translations[locale.get('code')] = false;
      editor.EntityRepository.get(editor.model.id, {locale: locale.get('code')})
        .then(function(data){
          editor.translations[locale.get('code')] = data;
        });
    });
  }

  getTranslation(locale) {
    var editor = this;

    if(_.isObject(locale)) {
      locale = locale.get('code');
    }

    if( ! editor.translations ) {
      return false;
    }

    return editor.translations[locale];
  }

  ownTranslation(locale) {
    var editor = this;

    if(locale.get('code') == editor.model.get('locale')) {
      return true;
    }

    return false;
  }


  translationType(locale) {
    var editor = this;

    if(editor.ownTranslation(locale)) {
      return 'selected';
    }

    var translation = editor.translations[locale.get('code')]
    if(translation) {
      if(translation.get('status')) {
        return 'other';
      }
    }

    return 'empty';
  }

  getTranslationTitle(locale) {
    var editor = this;

    var translation = editor.getTranslation(locale);
    if( ! translation || ! translation.getTitle ) {
      return false;
    }

    return translation.getTitle();
  }

  getTranslationDate(locale) {
    var editor = this;

    var translation = editor.getTranslation(locale);
    if( ! translation ) {
      return false;
    }

    return translation.get('updated_at');
  }

  goToTranslation($event, locale) {
    var editor = this;

    if(editor.ownTranslation(locale)) {
      $event.preventDefault();
      return;
    }
    editor.deregister();
    editor.$state.go('^.edit', {locale: locale.get('code'), attributeSet: editor.model.attributes.attribute_set.attributes.code}, { reload: true });
  }

  getLocaleISOName(locale) {
    var code = locale.get('code');
    var parts = code.split('_');
    var iso = parts[1];
    return iso;
  }

  getLocaleFlag(locale) {
    var iso = this.getLocaleISOName(locale);
    var url = '/img/flags/' + iso + '.png';
    return url;
  }
}

EntityEditorController.$inject = [
  'EditorRegistry',
  'EntityRepository',
  'fieldTypes',
  'fieldSelection',
  '$attrs', 
  '$element', 
  '$scope',
  '$rootScope',
  '$state',
  '$q', 
  '$timeout',
  '$compile'
];