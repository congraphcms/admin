'use strict'

import _ from 'underscore';

export default function ConditionBuilderController($scope, queryBuilderService){
    let vm                      = this;
    vm.scope                    = $scope;
    let qbs                     = queryBuilderService;
    let attrs                   = vm.scope.$parent.attributes.models;
    vm.rules                    = [];
    vm.modRules                 = {field: [], condition: [], value: [], inputType: []};
    vm.attributes               = qbs.extractAttributes(attrs);
    vm.inUseAttributes          = []; //vm.attributesInUse = [[], [], []]
    vm.attributesInUse          = [];
    vm.OperatorByCondition      = qbs.operatorByCondition;
    vm.conditions               = qbs.conditions; // Lists all conditions with labels and symbols
    vm.FieldTypeConditionMap    = qbs.fieldTypeConditionMap;
    vm.adminLabelCodeMap        = qbs.createAdminLabelCodeMap(vm.attributes); // Maps admin_label with attribute code used in createAPIQuery()
    vm.FieldTypeInputMap        = qbs.fieldTypeInputMap;
    vm.adminLabelFieldTypeMap   = qbs.createAdminLabelFieldTypeMap(vm.attributes); // Maping field type to the admin_label. Admin_label is passed through ng-model of Condition section to getConditionsForFieldType()
    console.log('vm.attributes',                vm.attributes);
    console.log('vm.OperatorByCondition',       vm.OperatorByCondition);
    console.log('vm.conditions',                vm.conditions);
    console.log('vm.FieldTypeConditionMap',     vm.FieldTypeConditionMap);
    console.log('vm.adminLabelCodeMap',         vm.adminLabelCodeMap);
    console.log('vm.FieldTypeInputMap',         vm.FieldTypeInputMap);
    console.log('vm.adminLabelFieldTypeMap',    vm.adminLabelFieldTypeMap);
    vm.htmlEntities             = qbs.htmlEntities;
    vm.conditionsState          = {};
    vm.conflictingOperatorsMap  = {};
    // console.log('attributes: ', vm.attributes);
    // console.log('new vm', vm);
    vm.fieldsOnly = [];
    for(let i = 0; i < vm.attributes.length; i++){
        vm.fieldsOnly.push(vm.attributes[i]["admin_label"]);
    }
    vm.fieldsOnly.sort();
    console.log("vm.fieldsOnly", vm.fieldsOnly);


    vm.createInUseAttributes(vm.attributes);

    $scope.$watch('vm.rules', function (newValue, oldValue, scope) {
        // console.log('Watch newValue', newValue);
        // console.log('Watch oldValue', oldValue);
        // console.log('Watch scope', scope);
        /*
         * Validation 1
         * When a user changes field and current selected operator is not available
         * for that field set operator to be the first from available operators for newly selected field
        */
        /*
         * Validation 3 ???
         * Do not add condition to rules array if value is not entered ????
        */
        // rulesValidation(vm.rules);
        // watch for changes in rules array and create query by calling createAPIQuery()
        vm.createAPIQuery();
    }, true);

    //TESTING
    $scope.$watch('vm.modRules', function(newValue, oldValue, scope){
        // console.log("newValue: ", newValue);
        // console.log("oldValue: ", oldValue);
    }, true)
};

/*
* Called on Add condition ng-click
*/
ConditionBuilderController.prototype.addCondition = function (){
    /*
    * Prvo napravi array sa postojecim atributima
    * Zatim napravi novi array u kome ce biti neupotrebljeni fieldovi
    * Potom dodaj novi rule
    * Onda prodji kroz rulove i modifikuj attributesInUse
    */
    const vm = this;
    let tmp = [];           // Used for putting unused fields intp attributesInUse
    let usedFields = [];    // Keeps track of used fields

    // Get all available admin_label-s from attributes into tmp
    for(let i = 0; i<vm.attributes.length; i++){
        tmp.push(vm.attributes[i]["admin_label"]);        
    }

    /*
     * Create array of values that are not currently used
     * and add it to the attributesInUse
    */
    tmp.sort();
    if(vm.rules.length>0){
        for(let i = 0; i < vm.rules.length; i++){
            let field = vm.rules[i].field;
            tmp.splice(tmp.indexOf(field), 1);
        }
        // console.log("tmp after processing: ", tmp)
    }
    // vm.attributesInUse.push(_.sortBy(tmp, function(adminLabel){return adminLabel}));
    vm.attributesInUse.push(tmp);
    
    /*
    * Add new rule
    */
    if(vm.attributesInUse.length>0){    
        const field = _.last(vm.attributesInUse)[0]; //vm.attributes[0]['admin_label'],
        const condition = vm.getInitialCondition(field); //vm.getInitialCondition(vm.attributes[0]['admin_label']),
        const inputType = vm.getInitialInputType(field); //vm.getInitialInputType(vm.attributes[0]['admin_label']),

        vm.rules.push({
            field: field,
            condition: condition,
            value: "",
            inputType: inputType,
            isSearchable: true
        });
    }

    /*
    * Update attributesInUse according to new state of the rules
    */
    let fieldsInUse = [];

    // Get all fields into the array
    for(let i = 0; i<vm.rules.length; i++){
        fieldsInUse.push(vm.rules[i].field)
    }
    
    for(let i = 0; i < vm.rules.length; i++){
        for(let j = 0; j < fieldsInUse.length; j++){
            if(i!==j){
                // Izbaci iz opsega
                let fieldName = fieldsInUse[j];
                // This condition is because the field has already been removed in the previous step
                if(vm.attributesInUse[i].indexOf(fieldName)!==-1){
                    vm.attributesInUse[i].splice(vm.attributesInUse[i].indexOf(fieldName), 1);
                }
            }
        }
    }

    //console.log("vm.rules: ", vm.rules)

};

/*
* Called on remove_circle_outline ng-click
*/
ConditionBuilderController.prototype.removeCondition = function(index, field){
    const vm = this;
    // Removes condition from the array
    vm.rules.splice(index, 1);
    /*
    * Added code when attributesInUse were added
    */
    vm.attributesInUse.splice(index, 1);
    for(let i = index; i < vm.attributesInUse.length; i++){
        vm.attributesInUse[i].push(field);
    }
    console.log(vm.attributesInUse)
};

/*
* Called on Condition ng-repeat
*/
ConditionBuilderController.prototype.getConditionsForFieldType = function(admin_label){
    const vm = this;
    // accept admin_label tied to Field ng-model
    // Get filed type from the map
    let fieldType = vm.adminLabelFieldTypeMap[admin_label];
    // get the value property of the field type from FieldTypeConditionMap
    let fieldTypeAttributes = vm.FieldTypeConditionMap[fieldType];
    // temp variable gets returned
    let temp = {};
    // Fill temp variable with conditions depanding on field_type
    for (let i = 0; i < fieldTypeAttributes.length; i++){
        // create an object to return
        temp[fieldTypeAttributes[i]] = vm.conditions[fieldTypeAttributes[i]];
    }
    return temp;
};

/*
* Called on Condition ng-change
*/
ConditionBuilderController.prototype.fieldChanged = function(index, admin_label){
    const vm = this;
    let newAdminLabel = admin_label;
    let ruleIndex = index;
    let tmp = []; //Privremeno cuva sve field-ove iz rulsa koji se koriste
    // Change input type for field type
    vm.setInputTypeForFieldType(index, admin_label);
    
}

/*
* Called on Field ng-change
*/
ConditionBuilderController.prototype.conditionChanged = function(index, condition){
    const vm = this;

    vm.formatInputField(index, condition);
}









/*
******************** * * * * * * * * *********************
******************** Helper functions ********************
******************** * * * * * * * * *********************
*/
ConditionBuilderController.prototype.formatInputField = function(index, condition){
    const vm = this;
    if(condition == "In" || condition == "Not in"){
        vm.rules[index].inputType = vm.rules[index].inputType + "-array";
        if(vm.rules[index].value.length > 1){
            let valueIntoArray = vm.rules[index].value
            vm.rules[index].value = [];
            vm.rules[index].value.push(valueIntoArray);
        } else {
            vm.rules[index].value = [];
        }
        // console.log(index);
        // console.log(condition);
        // console.log(vm.rules[index]);
    }
    else {
        vm.setInputTypeForFieldType(index, vm.rules[index].field);
        if(vm.rules[index].value.length > 0){
            let firstValueInArray = vm.rules[index].value[0];
            vm.rules[index].value = firstValueInArray;
        } else {
            vm.rules[index].value = "";
        }
        // console.log(index);
        // console.log(condition);
        // console.log(vm.rules[index]);
    }
};

ConditionBuilderController.prototype.setInputTypeForFieldType = function(index, admin_label){
    const vm = this;
    // When Field select changes it calls this function to set 
    // input type of the input field
    // @TODO See if this function can be combined with getConditionsForFieldType()
    let fieldType = vm.adminLabelFieldTypeMap[admin_label];
    vm.rules[index].inputType = vm.FieldTypeInputMap[fieldType];
};

ConditionBuilderController.prototype.getInitialCondition = function(admin_label){
        const vm = this;
        let fieldType = vm.adminLabelFieldTypeMap[admin_label];
        let fieldTypeAttributes = vm.FieldTypeConditionMap[fieldType];
        // console.log(vm.conditions[fieldTypeAttributes[0]].label);
        return vm.conditions[fieldTypeAttributes[0]].label;
};

ConditionBuilderController.prototype.getInitialInputType = function(admin_label){
    // Called inside addCondition method
    const vm = this;
    // Sets initial inputType when new condition is added
    let fieldType = vm.adminLabelFieldTypeMap[admin_label];
    return vm.FieldTypeInputMap[fieldType];
};

ConditionBuilderController.prototype.formatIfDate = function(value){
    const vm = this;
    if(value instanceof Date){
        var day     = value.getDate(); 
        var month   = value.getMonth()+1;
        var year    = value.getFullYear();
        if(day <= 9){ day = "0" + day };
        if(month <= 9){ month = "0" + month };
        return day + "/" + month + "/" + year;
    }
    else {
        return vm.htmlEntities(value)
    } 
};

ConditionBuilderController.prototype.createAPIQuery = function(){
    const vm = this;
    // @TODO Validate form (rules array) before creating a auery string
    // validateRules(vm.rules);
    //console.log(JSON.stringify(vm.rules));
    
    console.log(vm.rules);
    if(vm.rules.length>0){
        vm.qry = "";
        let q = "?filter";
        for(let i = 0; i < vm.rules.length; i++){
            let field = vm.adminLabelCodeMap[vm.rules[i].field];
            let condition = vm.OperatorByCondition[vm.rules[i].condition];
            let value = vm.formatIfDate(vm.rules[i].value);
            // If rule value is an array format the query and the otherway around
            if(value != ""){
                if(vm.rules[i].value instanceof Array){
                    q += "[fields." + field + "][" + condition + "]=[" + value + "]"    
                } else {
                    q += "[fields." + field + "][" + condition + "]=" + value;
                }                
                if(i < vm.rules.length - 1){
                    q += "&";
                }
            }
        }
        // Validate length, create query if condition exists
        return vm.query = q;            
    } else {
        return vm.query = "";
    }
};

/*
* Creates an alternative object inUseAttributes that will be used to populate Field on template.
* Original vm.attributes is ment to intact.
*/
ConditionBuilderController.prototype.createInUseAttributes = function(){
    const vm = this;
    
    if(vm.rules.length===0){
        return true;
    } else {
        return true;
    }
    //Check if vm.rules is empty
        // If it does not then:
        // Add new condition
        // Add to variable XXX posible Fields and possible Conditions [{fields: [], conditions: [] }]
    //Else
        // if a rule is modified
            //get index of the modified rule
            //
        // else if a new rule is added

    // if(vm.rules.length === 0){
    //     vm.createAPIQuery();
    // } else {
    //     for(let i = 0; i < vm.rules.length; i++){
        
    // }

    // }
    // vm.inUseAttributes.push(rule[])
}

ConditionBuilderController.prototype.rulesState = function(field, inputType){
    const vm = this;
    //
}

/*
* Bellow inject
*/
ConditionBuilderController.$inject = ['$scope', 'queryBuilderService'];
