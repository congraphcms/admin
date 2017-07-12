export default function localizedOptions() {
  return function(items, localized, locale) {
    if(!localized) return items;

    let filteredItems = [];
    _.each(items, function(item){
      if(item.locale != locale) {
        return false;
      }

      filteredItems.push(item);
    });

    return filteredItems;
  };
}