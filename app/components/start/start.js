/*
 * Copyright (C) 2014-2024 Andrea Feccomandi
 *
 * Licensed under the terms of GNU GPL License;
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      https://www.gnu.org/licenses/gpl-3.0.en.html
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY.
 * See the GNU General Public License for more details.
 *
 */
angular.
  module('bibiscoApp').
  component('start', {
    templateUrl: 'components/start/start.html',
    controller: StartController
  });

function StartController($location, $rootScope, ProjectService, SupporterEditionChecker, BibiscoPropertiesService, AssessmentService) {
  
  $rootScope.$emit('SHOW_START');

  let self = this;

  self.$onInit = function () {
    $rootScope.bibiscoStarted = true;
    if ($rootScope.actualPath === '/exitproject') {
      ProjectService.close();
    }
    this.onAssessmentServiceReady();
  };

  self.projectsPresent = function() {
    return ProjectService.getProjectsCount() > 0;
  };

  self.createProject = function() {
    $location.path('/createproject');
  };

  self.openProject = function() {
    $location.path('/openproject');
  };

  self.importProject = function() {
    $location.path('/importproject');
  };

  self.settings = function() {
    $location.path('/settings');
  };

  self.info = function () {
    $location.path('/info');
  };

  self.createSequel = function() {
    SupporterEditionChecker.filterAction(function() {
      $location.path('/createsequel');
    });
  };

  self.onAssessmentServiceReady = function() {
    if($rootScope.assessmentApiReady) {
      console.log('[START_CONTROLLER] [ON_ASSESSMENT_SERVICE_READY] Assessment service ready, setting up working directory');
      AssessmentService.set_projects_directory(BibiscoPropertiesService.getProject)
    } else {
      console.log('[START_CONTROLLER] [ON_ASSESSMENT_SERVICE_READY] No directory set');
    }
  };
}
