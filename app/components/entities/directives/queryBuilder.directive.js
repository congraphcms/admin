/**
 * @ngdoc directive
 * @name QueryBuilderDirective
 * @module app.components.entities
 *
 * @restrict EA
 *
 * @description
 * `<query-builder></query-builder>`.
 *
 * @usage
 *
 */

// import QueryBuilderController from './../controllers/queryBuilder.controller';
import template from './../views/queryBuilder.tmpl.html';
import './../styles/queryBuilder.scss';

export default function QueryBuilderDirective(){
    return{
        restrict: 'AE',
        template: template,
        scope:{
            attributes: '=',
            query: '='
        },
        controller: 'QueryBuilderController',
        // bindToController: true,
        // controllerAs: 'qb'
    }
}

