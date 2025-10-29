angular.
    module('bibiscoApp').
    component('assessmentbutton', {
    templateUrl: 'components/common/forms/assessment-button/assessment-button.html',
    controller: AssessmentButtonController
});

function AssessmentButtonController($rootScope, $scope, hotkeys, BibiscoDbConnectionService,
    BibiscoPropertiesService, AssessmentService, LoggerService) {
    let self = this;
    self.assessText = function() {
        LoggerService.info('Assessment button clicked');
        $rootScope.$emit('ASSESS_TEXT');
    };
}