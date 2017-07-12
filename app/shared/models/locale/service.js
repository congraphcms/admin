
/**
 * @ngdoc service
 * @name LocalesService
 * @module app.shared.models
 *
 * @description
 *
 * @makes locales available for app
 */

// import angular from 'angular';

export default function LocalesService(LocaleRepository, $log, $q) {

  return self = {

    _locales: false,
    _defered: false,

    /**
     * Get all locales
     */
    getAll: function() {

      var self = this;

      if(self._defered) {
        return self._defered.promise;
      }

      self._defered = $q.defer();
      
      LocaleRepository.get()
        .then(
          function(locales){
            self._locales = locales;
            self._defered.resolve(self._locales);
            return locales;
          }, 
          function(errors){
            self._defered.reject(errors);
            return errors;
          }
        );

      return self._defered.promise;
    },

    getById: function(id) {
      var self = this;
      var defered = $q.defer();

      if(!self._locales) {
        self.getAll().then(function(locales){
          var locale = locales.findWhere({id: id});
          if(locale){
            defered.resolve(locale);
          } else {
            defered.reject("There is no locale with that ID");
          }
          return locales;
        }, function(errors){
          defered.reject(errors);
          return errors;
        });

        return defered.promise;
      }

      var locale = self._locales.findWhere({id: id});
      if(locale){
        defered.resolve(locale);
      } else {
        defered.reject("There is no locale with that ID");
      }
      
      return defered.promise;
    },

    getByCode: function(code) {
      var self = this;
      var defered = $q.defer();

      if(!self._locales) {
        self.getAll().then(function(locales){
          var locale = locales.findWhere({code: code});
          if(locale){
            defered.resolve(locale);
          } else {
            defered.reject("There is no locale with that code");
          }
          return locales;
        }, function(errors){
          defered.reject(errors);
          return errors;
        });

        return defered.promise;
      }

      var locale = self._locales.findWhere({code: code});
      if(locale){
        defered.resolve(locale);
      } else {
        defered.reject("There is no locale with that code");
      }
      
      return defered.promise;
    }

  };

}

LocalesService.$inject = [
  'LocaleRepository',
  '$log',
  '$q'
];