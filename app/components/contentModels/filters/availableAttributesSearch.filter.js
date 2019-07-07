import _ from 'underscore';
import moment from 'moment';
import angular from 'angular';

export default function availableAttributesSearch() {
  return function(items, attrSearchSelectedItem) {

    if (_.isNull(attrSearchSelectedItem)) {
      return items;
    }

    var query = attrSearchSelectedItem.attributes.admin_label;
    var lowercaseQuery = query.toLowerCase();

    let filteredItems = [];
    _.each(items, function(item){
      var label = item.attributes.admin_label.toLowerCase();

      if (label.indexOf(lowercaseQuery) === 0) {
        filteredItems.push(item);
      }
    });

    return filteredItems;
  };
}
