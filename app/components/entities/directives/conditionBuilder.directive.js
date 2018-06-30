'use strict'

import _ from 'underscore';

import template from './../views/conditionBuilder.tmpl.html';

export default function ConditionBuilderDirective(){
    return {
        restrict: 'AE',
        scope: {
        },
        template: template,
        controller: ConditionBuilderController,
        bindToController: true,
        controllerAs: 'vm'
    }
}

function ConditionBuilderController($scope, queryBuilderService){
    let vm                      = this;
    vm.scope                    = $scope;
    let qbs                     = queryBuilderService;
    let attrs                   = vm.scope.$parent.attributes.models;
    vm.rules                    = [];
    vm.attributes               = qbs.extractAttributes(attrs);
    vm.inUseAttributes          = {true: [], false: []};
    vm.OperatorByCondition      = qbs.operatorByCondition;
    vm.conditions               = qbs.conditions; // Lists all conditions with labels and symbols
    vm.FieldTypeConditionMap    = qbs.fieldTypeConditionMap;
    vm.adminLabelCodeMap        = qbs.createAdminLabelCodeMap(vm.attributes); // Maps admin_label with attribute code used in createAPIQuery()
    vm.FieldTypeInputMap        = qbs.fieldTypeInputMap;
    vm.adminLabelFieldTypeMap   = qbs.createAdminLabelFieldTypeMap(vm.attributes); // Maping field type to the admin_label. Admin_label is passed through ng-model of Condition section to getConditionsForFieldType()
    vm.htmlEntities             = qbs.htmlEntities;
    vm.conditionsState          = {};
    vm.conflictingOperatorsMap  = {};
    // console.log('attributes: ', vm.attributes);
    // console.log('new vm', vm)

    // console.log('attributes.length: ', vm.attributes.length)
    for(let i = 0; i<vm.attributes.length; i++){
        vm.inUseAttributes[true].push(vm.attributes[i]['admin_label']);    
    }
    console.log('inUseAttributes', vm.inUseAttributes);

    $scope.$watch('vm.rules', function (newValue, oldValue, scope) {
        // console.log(newValue);
        // console.log(oldValue);
        // console.log(scope);
        /*
         * Validation 1
         * When a user changes field and current selected operator is not available
         * for that field set operator to be the first from available operators for newly selected field
        */
        /*
         * Validation 2
         * If there are two same text fields that contain operator equal or not equal,   
         * create one rule with input type text but with chips and operator IN or NIN
        */
        //mergeRulesIfContainTheSameValue(vm.rules);
        /*
         * Validation 3 ???
         * Do not add condition to rules array if value is not entered ????
        */
        /*
         * Validation 4
         * Do not add conditions to rules that are contradictory (conflicting)
         * Example:
         * Product=Shoes&Product Match Cars
         * They must have the same field selected
         * use operatorsCondtradictionMap variable
         * Solution: Leave all, mark the last one isSearchable: true and others above isSearchable: false.
         *          Those that are not searchable gray out on the screen.
         *   _.map
         *  _.where
         *  _.countBy
        */

        // rulesValidation(vm.rules);
        // watch for changes in rules array and create query by calling createAPIQuery()
        vm.createAPIQuery();
    }, true);
};

ConditionBuilderController.prototype.rulesState = function(field, inputType){
    // const vm = this;

    // if(rules.length != 0){

    // } else {
    //     vm.conditionsState
    // }
    // vm.conditionsState = {};
    // console.log('rulesState(): ', rules.length);

}

ConditionBuilderController.prototype.addCondition = function (){
    const vm = this;
    // vm.rulesState(vm.rules);
    // ng-repeat of .group-condition is tied to vm.rules[]
    // if(vm.rules.length == 0){

        const field = vm.attributes[0]["admin_label"]; //vm.attributes[0]['admin_label'],
        const condition = vm.getInitialCondition(vm.attributes[0]["admin_label"]); //vm.getInitialCondition(vm.attributes[0]['admin_label']),
        const inputType = vm.getInitialInputType(vm.attributes[0]['admin_label']); //vm.getInitialInputType(vm.attributes[0]['admin_label']),
        
        vm.rules.push({
            field: field,
            condition: condition,
            value: "",
            inputType: inputType,
            isSearchable: true
        });

    //     vm.rulesState(field, inputType);

    // } else {
    //     // 
    // }
};

ConditionBuilderController.prototype.removeCondition = function(index){
    const vm = this;
    // Removes condition from the array
    vm.rules.splice(index, 1);
};

ConditionBuilderController.prototype.getInitialCondition = function(admin_label){
        const vm = this;
        let fieldType = vm.adminLabelFieldTypeMap[admin_label];
        let fieldTypeAttributes = vm.FieldTypeConditionMap[fieldType];
        console.log(vm.conditions[fieldTypeAttributes[0]].label);
        return vm.conditions[fieldTypeAttributes[0]].label;
};

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
    // When Field select changes it call this function to set 
    // input type of the input field
    // @TODO See if this function can be combined with getConditionsForFieldType()
    let fieldType = vm.adminLabelFieldTypeMap[admin_label];
    vm.rules[index].inputType = vm.FieldTypeInputMap[fieldType];
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

ConditionBuilderController.$inject = ['$scope', 'queryBuilderService'];
