import _ from 'underscore';
import moment from 'moment';
import angular from 'angular';

export default function availableAttributes() {
  return function(items, setAttributes, contentModel) {

    let filteredItems = [];
    _.each(items, function(item){
      if(setAttributes.length) {
        let selected = setAttributes.findWhere({id: item.id});

        if( selected ) {
          return false;
        }
      }

      if(!contentModel.get('localized')) {
        if(item.get('localized')) {
          return false;
        }
      }
      filteredItems.push(item);
    });

    return filteredItems;
  };
}