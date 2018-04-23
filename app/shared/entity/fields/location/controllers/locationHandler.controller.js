import _ from 'underscore';

export default class LocationController{
  constructor(NgMap, AppSettings, $scope, $rootScope, $state, $stateParams, $q, $timeout) {

    /* jshint validthis: true */
    let handler = this;

    handler.NgMap = NgMap;

    handler.$scope = $scope;
    handler.$rootScope = $rootScope;
    handler.$state = $state;
    handler.$stateParams = $stateParams;
    handler.$q = $q;
    handler.$timeout = $timeout;
    handler.googleMapsUrl = "https://maps.googleapis.com/maps/api/js?key=" + AppSettings.APP.GMAP_KEY;

    // handler.attribute = handler.$scope.attribute;
    // handler.entity = handler.$scope.entity;

    handler.init();
  }

  init() {
    let handler = this;
  
    handler.fieldCode = handler.attribute.get('code');
    handler.fieldName = handler.attribute.get('admin_label');
    handler.required = handler.attribute.get('required');
    handler.unique = handler.attribute.get('unique');

    handler.mapParams = {
      control: {},
      center: [40.74349,-73.990822],
      zoom: 15,
      options: {
        dragging: true,
        disableDoubleClickZoom: true
      },
      bounds: {},
      markers: [],
      idkey: 'selectMap'
    };

    handler.markerParams = {
      control: {},
      id: 0,
      position: [40.7451, -73.9680],
      draggable: true,
      show: false
    };

    _.bindAll(handler, 'onMarkerDrag');

    handler.setDefaultValue();

    handler.$scope.$watch('handler.selectedAddress', function(newVal, oldVal){
      if(newVal == oldVal) return;
      handler.setValue(newVal);
    });

    handler.NgMap.getMap('map-'+handler.fieldCode).then(function(map) {
      handler.map = map;
      handler.mapCenter = map.getCenter();
      handler.$timeout(function(){
        handler.mapResize();
      }, 0);
    });
  }

  mapResize() {
    let handler = this;

    // handler.mapCenter = handler.map.getCenter();
    google.maps.event.trigger(handler.map, "resize");
    handler.map.setCenter(handler.mapCenter);
  }

  setDefaultValue() {
    let handler = this;
    
    if(handler.entity.isNew()) {
      handler.setValue(null);
    }

    handler.selectedAddress = handler.getValue();

    if(handler.selectedAddress == null) {
      return;
    }

    handler.markerParams.position = [handler.selectedAddress.geometry.location.lat, handler.selectedAddress.geometry.location.lng];
  }

  searchForAddress(val) {
    let handler = this,
        deferred = handler.$q.defer(),
        geocoder = new google.maps.Geocoder();

    geocoder.geocode({
        address: val
    }, function(results, status) {
        if (status == google.maps.GeocoderStatus.OK) {
            deferred.resolve(results);
            return
        }
        deferred.reject('error with google api');
    });

    return deferred.promise;
  }

  selectionChanged(item) {
    if(!item || !item.geometry) return;

    let handler = this,
        lat = item.geometry.location.lat(),
        lng = item.geometry.location.lng();

      handler._updateMarker(lat, lng);
      handler.searchText = null;
      if (item.geometry.location instanceof google.maps.LatLng) {
        // var location = {
        //     lat: obj.geometry.location.lat(),
        //     lng: obj.geometry.location.lng()
        // };
        let location = {
            lat: lat,
            lng: lng
        };
        item.geometry.location = location;
      }
      handler.selectedAddress = item;
  }

  _updateMarker(lat, lng) {
    let handler = this;
    
    handler.$timeout(function() {
        handler.markerParams.position = [lat, lng];
    }, 0);
    handler._centerOn(lat, lng);
  }

  _centerOn(lat, lng) {
    let handler = this;
    
    handler.$timeout(function() {
      handler.map.panTo(new google.maps.LatLng(lat, lng));
    }, 0);
  }

  onMarkerDrag(marker) {
    let handler = this,
        lat = marker.latLng.lat(),
        lng = marker.latLng.lng();

    handler._setAddressFromLatLng(lat, lng);
  }

  _setAddressFromLatLng(lat, lng) {
    let handler = this,
        latLng = new google.maps.LatLng(lat, lng),
        geocoder = new google.maps.Geocoder(),
        result = null;

    geocoder.geocode({
      'latLng': latLng
    }, function(results, status) {
      handler.$scope.$apply(function(){
        if (status == google.maps.GeocoderStatus.OK) {
          result = results[0];

          // to avoid snppaing marker to road (gmaps behavoir)
          // update result lat, lng
          let obj = angular.copy(result);
          if (obj.geometry.location instanceof google.maps.LatLng) {
            // var location = {
            //     lat: obj.geometry.location.lat(),
            //     lng: obj.geometry.location.lng()
            // };
            let location = {
                lat: lat,
                lng: lng
            };
            obj.geometry.location = location;
          }

          handler.selectedAddress = obj;
        }
      });
      
    });
  }

  getValue() {
    var handler = this;
    return handler.entity.getField(handler.fieldCode);
  }

  setValue(value) {
    var handler = this;
    handler.entity.setField(handler.fieldCode, value);
  }
}

LocationController.$inject = [
  'NgMap',
  'AppSettings',
  '$scope',
  '$rootScope',
  '$state',
  '$stateParams',
  '$q', 
  '$timeout',
];
