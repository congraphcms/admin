export default class QueryBuilderController{
    constructor($scope, queryBuilderService){
        let qb = this;
        
        qb.scope = $scope;
        console.log('QBC', qb);
        // console.log('qbs', qbs);

    }   
}

QueryBuilderController.$inject = ['$scope', 'queryBuilderService'];
