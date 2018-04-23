import angular from 'angular';

export default class FileFormController {
  constructor(
    FileRepository, 
    AppSettings,
    $mdDialog, 
    $scope, 
    $q, 
    $timeout ){
    

    /* jshint validthis: true */
    var fc = this;

    fc.FileRepository = FileRepository;

    fc.$mdDialog = $mdDialog;

    fc.$scope = $scope;
    fc.$q = $q;
    fc.$timeout = $timeout;

    fc.AppSettings = AppSettings;

    fc.init();
  }

  init() {
    var fc = this;
    fc.FileCollection = fc.FileRepository.getCollection();
    fc.FileModel = fc.FileRepository.getModel();
    
    fc.model = angular.copy(fc.fileModel);
  }

  rejectForm() {
    this.$mdDialog.cancel();
  }

  resolveForm() {
    this.$mdDialog.hide(this.model);
  }

  logEntity() {
    console.log(this.model);
  }

  save() {

    var fc = this;
    
    fc.$scope.form.$setDirty(true);
    fc.$scope.form.$setSubmitted(true);

    if(fc.$scope.form.$invalid) {

      var defered = fc.$q.defer();
      defered.reject({error: "Invalid form"});
      return defered.promise;
    }

    fc.busy = true;
    // var caseFile = fc.model.getField('document_file');
    var promise = fc.FileRepository.save(fc.model);
    promise.then(function(result){
      fc.busy = false;
      fc.$scope.form.$setDirty(false);

      fc.$scope.$emit('fileSaved', fc, result);
      fc.$scope.form.$setPristine(true);
      fc.fileModel.set('caption', fc.model.get('caption'))
      fc.fileModel.set('description', fc.model.get('description'));
      fc.resolveForm()
      return result;
    }, function(errors){
      console.error("SAVE FILE ERROR", errors);
      fc.busy = false;
      return errors;
    });

    return promise;
  }
}

FileFormController.$inject = [
  'FileRepository',
  'AppSettings',
  '$mdDialog',
  '$scope',
  '$q', 
  '$timeout',
];