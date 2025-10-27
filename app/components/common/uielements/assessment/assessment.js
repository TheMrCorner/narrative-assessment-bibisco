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
      showAssessment: '<',
      type: '<',
    }
  });

function AssessmentController($q) {
  let self = this;
  const ASSESSMENT_BOX_HEIGHT = 150;
  const COMMENT_WIDTH = 250+10; 

  elf.$onInit = function() {
    self.resettAssessmentBox();
    self.lineTopOffset = self.calculateLineTopOffset();
  };

  self.$onChanges = function() {
    if (self.showAssessment) {
      self.showAssessmentBox();
    } else {
      self.resettAssessmentBox();
    }
  };

  self.closeAssessmentBox = function() {
    self.closefunction();
  };

  self.resettAssessmentBox = function() {
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

    // I use the container editor to determine the top and bottom visibility of comment box
    let editorContainerPosition = editorcointainer.getBoundingClientRect();
    // I use the container editor to determine the left position of comment box
    let editorPosition = editor.getBoundingClientRect();

    let spanAssessmentSources = document.getElementsByClassName(self.type + '-' + self.id);
    for (let i = 0; i < spanAssessmentSources.length; i++) {
      const spanAssessmentSourcePosition = spanAssessmentSources[i].getBoundingClientRect();
      if (spanAssessmentSourcePosition.top > editorContainerPosition.top 
        && spanAssessmentSourcePosition.top < editorContainerPosition.bottom) {

        if (spanAssessmentSourcePosition.top + ASSESSMENT_BOX_HEIGHT > editorContainerPosition.bottom) {
          self.positionTop = editorContainerPosition.bottom - Assessment_BOX_HEIGHT;
        } else {
          self.positionTop = spanAssessmentSourcePosition.top;
        }
        self.positionLeft = editorPosition.left - COMMENT_WIDTH;
        self.lineTop = spanAssessmentSourcePosition.top + self.lineTopOffset + 5;
        self.lineLeft = editorPosition.left - 7;
        self.lineWidth = spanAssessmentSourcePosition.left-editorPosition.left;
        self.text = angular.element(spanAssessmentSources[i]).attr('data-'+self.type);
        break;
      }
    }
  };
}