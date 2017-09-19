import _ from 'underscore';
import moment from 'moment';
import angular from 'angular';

export default function availableAttributesSearch() {
  return function(items, attrSearchSelectedItem) {

    if (_.isNull(attrSearchSelectedItem)) {
      return items;
    }

    var query = attrSearchSelectedItem.attributes.admin_label;
    var lowercaseQuery = angular.lowercase(query);

    let filteredItems = [];
    _.each(items, function(item){
      var label = angular.lowercase(item.attributes.admin_label);

      if (label.indexOf(lowercaseQuery) === 0) {
        filteredItems.push(item);
      }
    });

    return filteredItems;
  };
}
