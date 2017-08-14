

export default class EntityFormController {
  constructor(
    entityModel,
    attributeSet,
    contentModel,
    attributes,
    locales,
    defaultLocale,
    AttributeSetsService,
    EntityTypesService,
    EditorRegistry,
    EntityQuickForm,
    AppSettings,
    $mdDialog,
    $element,
    $scope,
    $rootScope,
    $state,
    $stateParams,
    $q,
    $timeout ){
    

    /* jshint validthis: true */
    var vm = this;

    vm.model = entityModel;
    vm.attributeSet = attributeSet;
    vm.contentModel = contentModel;
    vm.attributes = attributes;
    vm.locales = locales;
    vm.defaultLocale = defaultLocale;
    vm.AttributeSetsService = AttributeSetsService;
    vm.EntityTypesService = EntityTypesService;

    vm.$mdDialog = $mdDialog;
    vm.$element = $element;
    vm.$scope = $scope;
    vm.$rootScope = $rootScope;
    vm.$state = $state;
    vm.$stateParams = $stateParams;
    vm.$q = $q;
    vm.$timeout = $timeout;

    vm.EditorRegistry = EditorRegistry;
    vm.EntityQuickForm = EntityQuickForm;
    vm.AppSettings = AppSettings;
    
    // get locale
    vm.locale = vm.getLocale();

    vm.init();
  }

  init() {
    var vm = this;
    vm.optionsMenuItems = vm.getOptionsMenuItems();
    vm.getEditor();

    vm.$scope.$on('openNewForm', function(event, formSettings){
      console.log('openNewForm handler', arguments, formSettings);
      event.stopPropagation();
      
    });
  }

  // openEntityQuickForm(formSettings) {
  //   var self = this;
  //   formSettings.parent = self.$element;
  //   formSettings.scope = self.$scope.$new();

  //   var instance = self.EntityQuickForm.open(formSettings);

  //   var deregister = self.$scope.$on('quickFormSaved', function(event, inst, entity){
  //     if(instance != inst) {
  //       return;
  //     }

  //     deregister();
  //     deregister = null;

  //     self.$scope.$broadcast('quickFormSaved', formSettings.model, entity);
  //   });

  //   // self.$timeout(function(){
  //   //   self.EntityQuickForm.close(qForm);
  //   // }, 3000);
  // }

  getLocale() {
    var vm = this;
    var localeCode = vm.$stateParams.locale || vm.defaultLocale.get('code');

    var locale = vm.locales.findWhere({code: localeCode});

    return locale;
  }

  getOptionsMenuItems() {
    var vm = this;

    var menuNew = [


      {
        label: 'Discard',
        icon: 'cancel',
        action: function(ev) {
          vm.discard(ev);
        }
      }
    ];

    var menuEdit = [
      {
        label: 'Duplicate',
        icon: 'content_copy',
        disabled: function() {
          return true;
        },
        action: function() {
          vm.duplicate();
        }
      },
      {
        divider: true
      },
      {
        label: 'Delete',
        icon: 'delete',
        action: function(ev) {
          vm.delete(ev);
        }
      }
    ];

    var menuShared = [
      {
        divider: true
      },
      {
        label: 'Help',
        icon: 'help',
        disabled: function() {
          return true;
        },
        action: angular.noop
      }
    ];

    Array.prototype.push.apply(menuNew, menuShared);
    Array.prototype.push.apply(menuEdit, menuShared);

    return vm.isNew() ? menuNew : menuEdit;
  }

  getEditor() {
    var vm = this;

    vm.EditorRegistry.when(vm.model).then(function(editor){
      vm.editor = editor;
    });
  }

  logEntity() {
    console.log(this.model);
  }

  getTitle() {
    var vm = this;
    return vm.model.getTitle();
  }

  isNew() {
    return this.model.isNew();
  }

  canSave() {
    return this.editor && ! this.editor.busy;
  }

  save() {
    var vm = this;
    var newEntity = vm.model.isNew();

    vm.editor.save().then(function(data){

      vm.optionsMenuItems = vm.getOptionsMenuItems();
      vm.$rootScope.$broadcast('entitySaved', data);
      if(newEntity){
        vm.editor.deregister();
        vm.$state.go('^.edit', {id: data.get('id'), locale: vm.locale.get('code')}, {reload: true});
      }
      
    }, function(errors){

    });

    vm.optionsMenuItems = vm.getOptionsMenuItems();
  }

  duplicate() {
    var vm = this;
  }

  delete(ev) {
    var vm = this;

    vm.deleteDialog().then(function() {
      vm.editor.delete().then(function(result){
        vm.$rootScope.$broadcast('entityDeleted', vm.model);
        vm.editor.deregister();
        vm.$state.go('^');
      }, function(result){
        console.warn('Delete failed there should be notification to user in this case.');
      });
    });
  }

  discard(ev) {
    var vm = this;
    if(vm.editor.form.$pristine) {
      vm.editor.deregister();
      vm.$state.go('^');
      return;
    }

    vm.discardDialog().then(function() {
      vm.editor.deregister();
      vm.$state.go('^');
    }, function() {
      
    });
  }

  deleteDialog(ev) {
    var vm = this;

    var confirmDeleteDialog =
      vm.$mdDialog.confirm()
          .parent(angular.element(document.body))
          .title('Delete this entity?')
          .textContent('Do you really want to delete the entity?')
          .ariaLabel('Delete entity dialog')
          .targetEvent(ev)
          .ok('Delete')
          .cancel('Cancel');

    return vm.$mdDialog.show(confirmDeleteDialog);
  }

  discardDialog(ev) {
    var vm = this;
    var title = (vm.model.isNew())?'Discard entity?':'Discard changes?';
    var text = (vm.model.isNew())?'Do you really want to discard the entity?':'Do you really want to discard the changes?';
    var confirmDiscardDialog =
      vm.$mdDialog.confirm()
          .parent(angular.element(document.body))
          .title(title)
          .textContent(text)
          .ariaLabel('Discard entity dialog')
          .targetEvent(ev)
          .ok('Discard')
          .cancel('Cancel');

    return vm.$mdDialog.show(confirmDiscardDialog);
  }
}

EntityFormController.$inject = [
  'entityModel',
  'attributeSet',
  'contentModel',
  'attributes',
  'locales',
  'defaultLocale',
  'AttributeSetsService',
  'EntityTypesService',
  'EditorRegistry',
  'EntityQuickForm',
  'AppSettings',
  '$mdDialog',
  '$element',
  '$scope',
  '$rootScope',
  '$state',
  '$stateParams',
  '$q',
  '$timeout',
];