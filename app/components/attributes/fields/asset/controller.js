
import _ from 'underscore';
import moment from 'moment';
import angular from 'angular';

export default class AssetFieldEditorController {
  constructor( 
    AttributeSettings, 
    $scope, 
    $element, 
    $attrs
  ) {
    /* jshint validthis: true */
    let ctrl = this;
    
    ctrl.$scope = $scope;
    ctrl.$element = $element;
    ctrl.$attrs = $attrs;
    ctrl.assetTypes = AttributeSettings.assetTypes;

    ctrl.data = ctrl.$scope.editor.model.attributes.data;
    if( ! _.isObject(ctrl.data) ) {
      ctrl.data = {};
    }

    ctrl.allowedGroups = [];
    ctrl.allowedMimeTypes = [];

    ctrl.limitOptions = [
      {
        value: "min",
        label: "at least"
      },
      {
        value: "max",
        label: "not more than"
      },
      {
        value: "between",
        label: "between"
      },
    ];

    ctrl.sizeLimitOption = "between";

    ctrl.sizeFactors = [
      {
        value: 1,
        label: "bytes"
      },
      {
        value: 1024,
        label: "Kb"
      },
      {
        value: 1024 * 1024,
        label: "Mb"
      },
      {
        value: 1024 * 1024 * 1024,
        label: "Gb"
      },
    ];

    ctrl.minSize = ctrl.maxSize = 0;
    ctrl.minSizeFactor = ctrl.maxSizeFactor = 1024 * 1024;
    ctrl.setup();
    ctrl.init();
  }

  setup() {
    let ctrl = this;

    if(ctrl.data.allowed_types && ctrl.data.allowed_types.length > 0) {
      _.each(ctrl.assetTypes, function(group){
        _.each(group.mime_types, function(type){
          if(_.indexOf(ctrl.data.allowed_types, type.mime_type) > -1) {
            ctrl.allowedTypes = true;
            ctrl.allowedGroups.push(group);
            ctrl.addGroupTypes(group, false);        }
        });
      });
    } else {
      ctrl.data.allowed_types = false;
    }

    if(ctrl.data.allowed_sizes) {
      if(ctrl.data.allowed_sizes.min == 0 && ctrl.data.allowed_sizes.max == 0) {
        ctrl.allowed_sizes = false;
        return;
      }

      ctrl.allowedSizes = true;

      if(ctrl.data.allowed_sizes.min == 0) {
        ctrl.sizeLimitOption = 'max';
        ctrl.minSizeFactor = 1024 * 1024;
      } else {
        _.each(ctrl.sizeFactors, function(factor, key){
          if(Math.floor(ctrl.data.allowed_sizes.min / factor.value) >= 1 || key == 0) {
            ctrl.minSizeFactor = factor.value;
            ctrl.minSize = ctrl.data.allowed_sizes.min / factor.value;
          }
        });
      }

      if(ctrl.data.allowed_sizes.max == 0) {
        ctrl.sizeLimitOption = 'min';
        ctrl.maxSizeFactor = 1024 * 1024;
      } else {
        _.each(ctrl.sizeFactors, function(factor, key){
          if(Math.floor(ctrl.data.allowed_sizes.max / factor.value) >= 1 || key == 0) {
            ctrl.maxSizeFactor = factor.value;
            ctrl.maxSize = ctrl.data.allowed_sizes.max / factor.value;
          }
        });
      }


    } else {
      ctrl.data.allowed_sizes = false;
    }
  }

  init() {
    let ctrl = this;

    ctrl.$scope.$watch('fieldCtrl.allowedTypes', function(newValue, oldValue){
      if(newValue == oldValue) {
        return;
      }

      if( ! newValue ) {
        ctrl.data.allowed_types = false;
      } else {
        ctrl.data.allowed_types = [];
      }
    });

    ctrl.$scope.$watch('fieldCtrl.allowedSizes', function(newValue, oldValue){
      if(newValue == oldValue) {
        return;
      }

      if( ! newValue ) {
        ctrl.data.allowed_sizes = false;
      } else {
        ctrl.data.allowed_sizes = {
          min: 0,
          max: 0
        };
        ctrl.minSize = ctrl.maxSize = 0;
        ctrl.minSizeFactor = ctrl.maxSizeFactor = 1024 * 1024;
      }
    });

    ctrl.$scope.$watch('fieldCtrl.sizeLimitOption', function(newValue, oldValue){
      if(newValue == oldValue) {
        return;
      }

      if( newValue == 'min' ) {
        ctrl.maxSize = 0;
        ctrl.maxSizeFactor = 1024 * 1024;
      }

      if( newValue == 'max' ) {
        ctrl.minSize = 0;
        ctrl.minSizeFactor = 1024 * 1024;
      }
    });

    ctrl.$scope.$watchGroup(['fieldCtrl.minSize', 'fieldCtrl.minSizeFactor'], function(newValue, oldValue){
      if(newValue == oldValue) {
        return;
      }
      
      ctrl.data.allowed_sizes.min = ctrl.minSize * ctrl.minSizeFactor;

    });

    ctrl.$scope.$watchGroup(['fieldCtrl.maxSize', 'fieldCtrl.maxSizeFactor'], function(newValue, oldValue){
      if(newValue == oldValue) {
        return;
      }
      ctrl.data.allowed_sizes.max = ctrl.maxSize * ctrl.maxSizeFactor;
      
    });

    ctrl.$scope.$watch('fieldCtrl.data', function(newValue, oldValue){
      if(newValue == oldValue) {
        return;
      }
      ctrl.$scope.editor.model.attributes.data = newValue;
      
    }, true);
  }

  allowedGroup(group) {
    return _.indexOf(this.allowedGroups, group) > -1;
  }

  allowedMimeType(type) {
    return _.indexOf(this.allowedMimeTypes, type) > -1;
  }

  selectedMimeType(type) {
    return _.indexOf(this.data.allowed_types, type.mime_type) > -1;
  }

  toggleGroup(group) {
    let index = _.indexOf(this.allowedGroups, group);
    if(index > -1) {
      this.allowedGroups.splice(index, 1);
      this.removeGroupTypes(group);
      return;
    }

    this.allowedGroups.push(group);
    this.addGroupTypes(group);
  }

  toggleMimeType(type) {
    let index = _.indexOf(this.data.allowed_types, type.mime_type);
    if(this.selectedMimeType(type)) {
      this.data.allowed_types.splice(index, 1);
      return;
    }

    this.data.allowed_types.push(type.mime_type);
  }

  removeGroupTypes(group) {
    let ctrl = this;
    _.each(group.mime_types, function(mimeType){
      let index = _.indexOf(ctrl.data.allowed_types, mimeType.mime_type)
      if( index > -1) {
        ctrl.data.allowed_types.splice(index, 1);
      }
      index = _.indexOf(ctrl.allowedMimeTypes, mimeType)
      if( index > -1) {
        ctrl.allowedMimeTypes.splice(index, 1);
      }
    });
  }

  addGroupTypes(group, addToValidation) {
    let ctrl = this;
    addToValidation = (addToValidation === undefined)?true:addToValidation;

    _.each(group.mime_types, function(mimeType){
      
      let index = _.indexOf(ctrl.allowedMimeTypes, mimeType)
      if( index == -1) {
        ctrl.allowedMimeTypes.push(mimeType);
      }

      if(addToValidation) {
        let index = _.indexOf(ctrl.data.allowed_types, mimeType.mime_type)
        if( index == -1) {
          ctrl.data.allowed_types.push(mimeType.mime_type);
        }
      }
    });
  }



  getMaxForMin() {
    let ctrl = this;
    if(ctrl.sizeLimitOption == 'between') {
      return (ctrl.maxSize * ctrl.maxSizeFactor) / ctrl.minSizeFactor;
    }

    return 9999;
  }

  getMinForMax() {
    let ctrl = this;
    if(ctrl.sizeLimitOption == 'between') {
      return (ctrl.min * ctrl.minSizeFactor) / ctrl.maxSizeFactor;
    }

    return 0;
  }

  isNew() {
    return this.attributeModel.isNew();
  }
}

AssetFieldEditorController.$inject = [
  'AttributeSettings',
  '$scope',
  '$element',
  '$attrs',
];