export default function QueryBuilderService(queryBuilderConstant){
    let qbc = queryBuilderConstant;
    return self = {
        qbc:                            queryBuilderConstant,
        extractAttributes:              this.extractAttributes,
        createAdminLabelFieldTypeMap:   this.createAdminLabelFieldTypeMap,
        createAdminLabelCodeMap:        this.createAdminLabelCodeMap,
        conditions:                     qbc.conditions,
        operatorByCondition:            qbc.operatorByCondition,
        fieldTypeConditionMap:          qbc.fieldTypeConditionMap,
        fieldTypeInputMap:              qbc.fieldTypeInputMap,
        htmlEntities:                   function(str){return String(str).replace(/</g, '&lt;').replace(/>/g, '&gt;')}
    }
}

QueryBuilderService.prototype.extractAttributes = function(attrSet){
    let attributes          = [];   // Stores final result of attributes. Passed to directive.
    let attributesControl   = [];   // Array used when parsing attribute set. Stores attribute ids and prevents from duplicates
    let excludedFieldTypes  = ['asset', 'relation', 'node', 'node_collection']; // Select attribute set that you want to exclude from API
    for (var i = 0; i < attrSet.length; i++){
        var temp = {};
        if(!attributesControl.includes(attrSet[i].attributes.id) 
                && !excludedFieldTypes.includes(attrSet[i].attributes['field_type'])){
            attributesControl.push(attrSet[i].attributes.id);
            temp.id             = attrSet[i].attributes.id;
            temp.code           = attrSet[i].attributes.code;
            temp['admin_label'] = attrSet[i].attributes['admin_label'];
            temp['field_type']  = attrSet[i].attributes['field_type'];
            attributes.push(temp);
            temp = {};
        }
    }
    attributesControl   = null;
    attrSet             = null;
    return attributes;
}

QueryBuilderService.prototype.createAdminLabelFieldTypeMap = function(attributes){
    let adminLabelFieldTypeMap = [];
    for (let i = 0; i < attributes.length; i++ ){
        let field = attributes[i]['admin_label'];
        adminLabelFieldTypeMap[attributes[i]['admin_label']] = attributes[i]['field_type'];
        // vm.fields.push(field);
        field = ""; // Reset variable
    };
    return adminLabelFieldTypeMap;
}

QueryBuilderService.prototype.createAdminLabelCodeMap = function(attributes){
    let adminLabelCodeMap = [];
    for (let i = 0; i < attributes.length; i++){
        let adminLabel = attributes[i]['admin_label'];
        let code = attributes[i]['code'];
        adminLabelCodeMap[adminLabel] = code;
    }
    return adminLabelCodeMap;
}

QueryBuilderService.$inject = ['queryBuilderConstant'];
