angular.
  module('bibiscoApp').
  component('assessment', {
    templateUrl: 'components/common/uielements/assessment/assessment.html',
    controller: AssessmentController,
    bindings: {
      changefunction: '&',
      closefunction: '&',
      connectortype: '<',
      deletefunction: '&',
      editorid: '@',
      editorcointainerid: '@',
      icon: '<',
      id: '<',
      placeholder: '<',
      readonly: '<',
      showassessment: '<',
      text: '<',
      type: '<',
    }
  });

function AssessmentController($q, BibiscoPropertiesService) {
  let self = this;
  const ASSESSMENT_BOX_HEIGHT = 150;
  const COMMENT_WIDTH = 250+10; 

  self.$onInit = function() {
    self.showAssessmentBox();
    self.lineTopOffset = self.calculateLineTopOffset();
    if (!self.text) {
      self.text = 'Assessment will appear here...';
    }
  };

  self.$onChanges = function() {
    self.showAssessmentBox();
  };

  self.closeAssessmentBox = function() {
    self.closefunction();
  };

  self.resetAssessmentBox = function() {
    self.text = null;
    self.positionTop = null;
    self.positionLeft = null;
    self.lineTop = null;
    self.lineLeft = null;
    self.lineWidth = null;
  };

  self.calculateLineTopOffset = function() {
    let zoomLevel = BibiscoPropertiesService.getProperty('zoomLevel');
    let offset;
    if (zoomLevel === 100) {
      offset = 21;
    } else if (zoomLevel === 115) {
      offset = 23;
    } else if (zoomLevel === 130) {
      offset = 25;
    }
    return offset;
  };

  self.showAssessmentBox = function() {

    let editorcointainer = document.getElementById(self.editorcointainerid);
    let editor = document.getElementById(self.editorid);

    if (!editorcointainer || !editor) {
      return;
    }

    let editorContainerPosition = editorcointainer.getBoundingClientRect();
    let editorPosition = editor.getBoundingClientRect();

    let spanAssessmentSources = document.getElementsByClassName(self.type + '-' + self.id);
    let foundPosition = false;
    
    for (let i = 0; i < spanAssessmentSources.length; i++) {
      const spanAssessmentSourcePosition = spanAssessmentSources[i].getBoundingClientRect();
      if (spanAssessmentSourcePosition.top > editorContainerPosition.top 
        && spanAssessmentSourcePosition.top < editorContainerPosition.bottom) {

        if (spanAssessmentSourcePosition.top + ASSESSMENT_BOX_HEIGHT > editorContainerPosition.bottom) {
          self.positionTop = editorContainerPosition.bottom - ASSESSMENT_BOX_HEIGHT;
        } else {
          self.positionTop = spanAssessmentSourcePosition.top;
        }
        self.positionLeft = editorPosition.left - COMMENT_WIDTH;
        self.lineTop = spanAssessmentSourcePosition.top + self.lineTopOffset + 5;
        self.lineLeft = editorPosition.left - 7;
        self.lineWidth = spanAssessmentSourcePosition.left-editorPosition.left;
        self.text = angular.element(spanAssessmentSources[i]).attr('data-'+self.type);
        foundPosition = true;
        break;
      }
    }
    
    if (!foundPosition) {
      self.positionTop = editorContainerPosition.top + 20;
      self.positionLeft = editorPosition.right - COMMENT_WIDTH - 20;
      self.lineTop = editorContainerPosition.top + 20;
      self.lineLeft = editorPosition.right - 20;
      self.lineWidth = 0;
      if (!self.text) {
        self.text = 'Assessment will appear here...';
      }
    }
  };
}