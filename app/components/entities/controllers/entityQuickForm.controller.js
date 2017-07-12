// import $ from 'jquery';

export default class ContactQuickFormController {

  constructor(
    ContactQuickForm, 
    EditorRegistry, 
    LocalesService,
    $mdDialog, 
    $scope, 
    $rootScope, 
    $element, 
    $timeout
  ){
    console.log('cqf ctrl init', this);

    var qf = this;

    qf.ContactQuickForm = ContactQuickForm;
    qf.EditorRegistry = EditorRegistry;

    qf.$scope = $scope;
    qf.$rootScope = $rootScope;
    qf.$element = $element;
    qf.$timeout = $timeout;
    qf.$backdrop = angular.element($element[0].children[0]);
    qf.$mdDialog = $mdDialog;
    qf.locales = [];
    qf.LocalesService = LocalesService;

    LocalesService.getAll().then(function(locales){
      qf.locales = locales;
    });

    console.log('qf instance', qf.$scope.instance);

    qf.init();
  }

  init() {
    var qf = this;
    qf.getEditor();

    qf.$rootScope.$on('contactSaved', function(event, editor, entity){
      console.log('qf contactSaved');
      
      if(editor == qf.editor) {
        qf.model = entity;
        // ctrl.optionsMenuItems = ctrl.getOptionsMenuItems();
        qf.getEditor();
        console.log('qf emit qf saved');
        qf.ContactQuickForm.resolve(qf.instance, entity);
        // qf.$scope.$emit('quickFormSaved', qf.instance, entity);

        // qf._close();
      }
    });
  }

  getEditor() {
    var qf = this;

    qf.EditorRegistry.when(qf.model).then(function(editor){
      qf.editor = editor;
      qf.instance.editor = editor;
    });
  }

  getTitle() {
    var qf = this;
    return qf.model.getTitle();
  }

  isNew() {
    return this.model.isNew();
  }

  canSave() {
    return this.editor && ! this.editor.busy;
  }

  save() {
    var qf = this;

    qf.editor.save()
      // .then(function(data){
        
      // }, function(errors){

      // });
  }

  discard() {
    var qf = this;
    if(qf.editor.form.$pristine) {
      qf._close();
      return;
    }

    qf.discardDialog().then(function() {
      qf._close();
    }, function() {
      
    });
  }

  discardDialog(ev) {
    var qf = this;
    var title = (qf.model.isNew())?'Discard this contact?':'Discard changes?';
    var text = (qf.model.isNew())?'Do you really want to discard the contact?':'Do you really want to discard the changes?';
    var confirmDiscardDialog = 
      qf.$mdDialog.confirm()
          .parent(angular.element(document.body))
          .title(title)
          .textContent(text)
          .ariaLabel('Discard contact dialog')
          .targetEvent(ev)
          .ok('Discard')
          .cancel('Cancel');

    return qf.$mdDialog.show(confirmDiscardDialog);
  }

  backdropDiscard(e) {
    if(e.target !== this.$backdrop[0]) {
      return false;
    }

    this.discard();
  }

  _close() {
    console.log('_close ctrl', this);
    this.ContactQuickForm.cancel(this.instance);
  }
}

ContactQuickFormController.$inject = [
  'ContactQuickForm',
  'EditorRegistry',
  'LocalesService',
  '$mdDialog',
  '$scope',
  '$rootScope',
  '$element',
  '$timeout'
];