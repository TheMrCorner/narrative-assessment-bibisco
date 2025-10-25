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
  component('exporttoformat', {
    templateUrl: 'components/export/export-to-format.html',
    controller: ExportToFormat
  });

function ExportToFormat($injector, $location, $routeParams, $rootScope, $scope, $timeout, $translate,
  BibiscoDbConnectionService,BibiscoPropertiesService, ChapterService, ContextService, ExportService, 
  FileSystemService, LocationService, MainCharacterService, PopupBoxesService, ProjectService, 
  SecondaryCharacterService, SupporterEditionChecker) {

  var self = this;
  let ObjectService = null;
  let GroupService = null;
  let NoteService = null;

  self.$onInit = function() {

    // load translations
    self.translations = $translate.instant([
      'common_architecture',
      'common_chapter',
      'common_chapters',
      'common_characters',
      'common_notes_title',
      'common_fabula',
      'common_locations',
      'common_premise',
      'common_setting',
      'common_strands',
      'chapter_title_format_chapter_label_number_suffix',
      'export_novel_project',
      'export_novel',
      'export_project',
      'export_timeline',
      'groups',
      'objects',
      'parts',
      'toc'
    ]);

    $rootScope.$emit('EXPORT_SELECT_DIRECTORY');

    // supporters or trial check
    self.includeSupporterEditionItems = SupporterEditionChecker.isSupporterOrTrial();

    self.exportAuthor;
    if ($routeParams.format === 'pdf') {
      self.pageheadertitle = 'jsp.export.title.pdf';
      self.exportAuthor = true;
    } else if ($routeParams.format === 'docx') {
      self.pageheadertitle = 'jsp.export.title.word';
      self.exportAuthor = true;
    } else if ($routeParams.format === 'txt') {
      self.pageheadertitle = 'jsp.export.title.txt';
      self.exportAuthor = true;
    } else if ($routeParams.format === 'archive') {
      self.pageheadertitle = 'jsp.export.title.archive';
      self.exportAuthor = false;
    }
    self.breadcrumbitems = [];
    self.breadcrumbitems.push({
      label: 'common_export',
      href: '/export'
    });
    self.breadcrumbitems.push({
      label: self.pageheadertitle
    });

    self.saving = false;
    
    self.exportpath = BibiscoPropertiesService.getProperty('exportpath');
    self.exportpathchanged = false;
    self.exportdefaultpath = self.exportpath ? self.exportpath : ContextService.getDownloadsDirectoryPath();

    if (self.exportAuthor) {
      self.author = ProjectService.getProjectInfo().author;
    }

    self.chaptertitleformat = BibiscoPropertiesService.getProperty('chaptertitleformat');
    self.chaptertitleexample = ExportService.calculateChapterTitleExample(self.chaptertitleformat);
    self.chaptertitleformatgroup = [{
      label: 'chapter_title_format_number_title',
      value: 'numbertitle'
    }, {
      label: 'chapter_title_format_only_number',
      value: 'number'
    }, {
      label: 'chapter_title_format_only_title',
      value: 'title'
    }, {
      label: '"' + self.translations.common_chapter + '" ' + self.translations.chapter_title_format_chapter_label_number_suffix,
      value: 'labelnumber'
    }];

    self.chaptertitleposition = BibiscoPropertiesService.getProperty('chaptertitleposition');
    self.chaptertitlepositiongroup = [{
      label: 'common_left',
      value: 'left'
    }, {
      label: 'common_center',
      value: 'center'
    }];

    self.sceneseparator = BibiscoPropertiesService.getProperty('sceneseparator');
    self.sceneseparatorgroup = [{
      label: 'blank_line',
      value: 'blank_line'
    }, {
      label: 'three_asterisks',
      value: 'three_asterisks'
    }, {
      label: 'three_dots',
      value: 'three_dots'
    }];

    self.exportscenetitle = BibiscoPropertiesService.getProperty('exportscenetitle');
    self.exportscenetitlegroup = [{
      label: 'jsp.common.button.enabled',
      value: 'true'
    }, {
      label: 'jsp.common.button.disabled',
      value: 'false'
    }];

    self.scenetitleposition = BibiscoPropertiesService.getProperty('scenetitleposition');
    self.scenetitlepositiongroup = [{
      label: 'common_left',
      value: 'left'
    }, {
      label: 'common_center',
      value: 'center'
    }];

    self.scenetitleformat = BibiscoPropertiesService.getProperty('scenetitleformat');
    self.scenetitleexample = ExportService.calculateChapterTitleExample(self.scenetitleformat);
    self.scenetitleformatgroup = [{
      label: 'chapter_title_format_number_title',
      value: 'numbertitle'
    }, {
      label: 'chapter_title_format_only_number',
      value: 'number'
    }, {
      label: 'chapter_title_format_only_title',
      value: 'title'
    }];

    self.exporthighlightedtext = BibiscoPropertiesService.getProperty('exporthighlightedtext');
    self.exporthighlightedtextgroup = [{
      label: 'jsp.common.button.enabled',
      value: 'true'
    }, {
      label: 'jsp.common.button.disabled',
      value: 'false'
    }];

    self.pagenumberposition = BibiscoPropertiesService.getProperty('pagenumberposition');
    self.pagenumberpositiongroup = [{
      label: 'page_number_position_none',
      value: 'none'
    }, {
      label: 'page_number_position_header',
      value: 'header'
    }, {
      label: 'page_number_position_footer',
      value: 'footer'
    }];

    self.pagenumberalignment = BibiscoPropertiesService.getProperty('pagenumberalignment');
    self.pagenumberalignmentgroup = [{
      label: 'common_left',
      value: 'left'
    }, {
      label: 'common_center',
      value: 'center'
    }, {
      label: 'common_right',
      value: 'right'
    }, {
      label: 'page_number_alignment_even_odd',
      value: 'even_odd'
    }];

    self.showfirstpagenumber = BibiscoPropertiesService.getProperty('showfirstpagenumber');
    self.showfirstpagenumbergroup = [{
      label: 'jsp.common.button.enabled',
      value: 'true'
    }, {
      label: 'jsp.common.button.disabled',
      value: 'false'
    }];

    self.pagenumberformat = BibiscoPropertiesService.getProperty('pagenumberformat');
    self.pagenumberformatgroup = [{
      label: 'page_number_format_number',
      value: 'number'
    }, {
      label: 'page_number_format_numberandcount',
      value: 'numberandcount'
    }, {
      label: 'page_number_format_pagenumberandcount',
      value: 'pageandnumberandcount'
    }];
    self.pagenumberformatexample = ExportService.calculatePageNumberFormatExample(self.pagenumberformat);

    self.tocformat = BibiscoPropertiesService.getProperty('tocformat');
    self.tocformatgroup = [{
      label: 'toc_none',
      value: 'none'
    }, {
      label: 'toc_beginning',
      value: 'beginning'
    }, {
      label: 'toc_end',
      value: 'end'
    }];
    self.toctitle = BibiscoPropertiesService.getProperty('toctitle');
    self.showtocnote= $routeParams.format === 'docx' ? true : false;

    self.footendnotemode = null;
    self.footendnotegroup = [];
    switch ($routeParams.format) {
    case 'pdf':
      self.footendnotemode = BibiscoPropertiesService.getProperty('pdfnoteexport');
      break;
    case 'docx':
      self.footendnotemode = BibiscoPropertiesService.getProperty('docxnoteexport');
      self.footendnotegroup.push({
        label: 'note_export_footnote',
        value: 'footnote'
      });
      break;
    case 'txt':
      self.footendnotemode = BibiscoPropertiesService.getProperty('txtnoteexport');
      break;
    default:
      break;
    }
    self.footendnotegroup.push({
      label: 'note_export_chapterendnote',
      value: 'chapterend'
    },{
      label: 'note_export_bookendnote',
      value: 'bookend'
    });
    self.bookendtitle = BibiscoPropertiesService.getProperty('bookendtitle');
  

    self.pagenumberpositiongroup = [{
      label: 'page_number_position_none',
      value: 'none'
    }, {
      label: 'page_number_position_header',
      value: 'header'
    }, {
      label: 'page_number_position_footer',
      value: 'footer'
    }];

    self.exportcomments = BibiscoPropertiesService.getProperty('exportcomments');
    self.exportcommentsgroup = [{
      label: 'jsp.common.button.enabled',
      value: 'true'
    }, {
      label: 'jsp.common.button.disabled',
      value: 'false'
    }];

    self.exportunansweredquestions = BibiscoPropertiesService.getProperty('exportunansweredquestions');
    self.exportunansweredquestionsgroup = [{
      label: 'jsp.common.button.enabled',
      value: 'true'
    }, {
      label: 'jsp.common.button.disabled',
      value: 'false'
    }];

    self.font;
    let supporterSuffix = SupporterEditionChecker.isSupporter() ? '' : '_ce';
    self.fontgroup = [{
      label: 'baskerville' + supporterSuffix,
      value: 'baskerville',
      buttonclass: 'bibiscoRichTextEditorSettings-baskerville'
    }, {
      label: 'courier',
      value: 'courier',
      buttonclass: 'bibiscoRichTextEditorSettings-courier'
    }, {
      label: 'garamond' + supporterSuffix,
      value: 'garamond',
      buttonclass: 'bibiscoRichTextEditorSettings-garamond'
    }, {
      label: 'georgia' + supporterSuffix,
      value: 'georgia',
      buttonclass: 'bibiscoRichTextEditorSettings-georgia'
    }, {
      label: 'arial',
      value: 'arial',
      buttonclass: 'bibiscoRichTextEditorSettings-arial'
    }, {
      label: 'palatino' + supporterSuffix,
      value: 'palatino',
      buttonclass: 'bibiscoRichTextEditorSettings-palatino'
    }, {
      label: 'times',
      value: 'times',
      buttonclass: 'bibiscoRichTextEditorSettings-times'
    }];
    self.setFont(BibiscoPropertiesService.getProperty('font'));

    self.exportfontsize = BibiscoPropertiesService.getProperty('exportfontsize');
    self.exportfontsizegroup = [{
      label: '8',
      value: 8
    }, {
      label: '10',
      value: 10
    }, {
      label: '12',
      value: 12
    }, {
      label: '14',
      value: 14
    }, {
      label: '16',
      value: 16
    }];
    self.indent = BibiscoPropertiesService.getProperty('indentParagraphEnabled');
    self.indentgroup = [{
      label: 'jsp.common.button.enabled',
      value: 'true'
    }, {
      label: 'jsp.common.button.disabled',
      value: 'false'
    }];
    self.linespacing = BibiscoPropertiesService.getProperty('linespacing');
    self.linespacinggroup = [{
      label: '1',
      value: 10
    }, {
      label: '1.3',
      value: 13
    }, {
      label: '1.4',
      value: 14
    }, {
      label: '1.5',
      value: 15
    }, {
      label: '2',
      value: 20
    }];
    self.paragraphspacing = BibiscoPropertiesService.getProperty('paragraphspacing');
    self.paragraphspacinggroup = [{
      label: '0',
      value: 'none'
    }, {
      label: '0.5',
      value: 'small'
    }, {
      label: '1',
      value: 'medium'
    }, {
      label: '1.5',
      value: 'large'
    }, {
      label: '2',
      value: 'double'
    }];

    self.isexporttopdfordocx = ($routeParams.format === 'pdf' || $routeParams.format === 'docx' ) ? true : false;
    self.isexporttopdfordocxortxt = ($routeParams.format === 'pdf' || $routeParams.format === 'docx' || $routeParams.format === 'txt') ? true : false;

    self.showExportFilter = $routeParams.format === 'archive' ? false : true;
    if (self.showExportFilter) {
      // export items
      self.items = [];
      self.items.push.apply(self.items, self.getGeneralItems());
      self.items.push.apply(self.items, self.getPartsFamily());
      self.items.push.apply(self.items, self.getChaptersFamily());
      self.items.push.apply(self.items, self.getArchitectureItem());
      self.items.push.apply(self.items, self.getStrandsItem());
      self.items.push.apply(self.items, self.getCharactersFamily());
      self.items.push.apply(self.items, self.getLocationsFamily());
      self.items.push.apply(self.items, self.getObjectsFamily());
      self.items.push.apply(self.items, self.getGroupsFamily());
      self.items.push.apply(self.items, self.getNotesFamily());
      self.items.push.apply(self.items, self.getTimelineItem());
      
      self.exportFilter = self.items[0];
      self.initExportingFlags();
    }

    self.advancedsettings = false;

    self.checkExit = {
      active: true
    };
  };

  self.showadvancedsettings = function() {
    self.advancedsettings = true;
  };
  
  self.hideadvancedsettings = function() {
    self.advancedsettings = false;
  };


  self.initExportingFlags = function () {
    self.exportingNovel = self.exportFilter.id === 'novel_project' || self.exportFilter.id === 'novel' || 
      self.exportFilter.type === 'part' || self.exportFilter.type === 'chapter' || 
      self.exportFilter.type === 'prologue' || self.exportFilter.type === 'epilogue' ? true : false;
    self.showToc = self.exportFilter.id === 'novel_project' || self.exportFilter.id === 'novel' || 
      self.exportFilter.type === 'part' || self.exportFilter.id === 'project' ? true : false;
    self.showExportunansweredquestions = self.exportFilter.id === 'novel_project' || self.exportFilter.id === 'project' ||
      self.exportFilter.type === 'maincharacter' ? true: false;
  };

  self.getGeneralItems = function () {
  
    let generalItems = [];
    let family = null;
    generalItems.push({
      id: 'novel_project',
      name: self.translations.export_novel_project,
      family: family
    });
    generalItems.push({
      id: 'novel',
      name: self.translations.export_novel,
      family: family
    });
    generalItems.push({
      id: 'project',
      name: self.translations.export_project,
      family: family
    });

    return generalItems;
  };

  self.getTimelineItem= function () {

    let timelineItem = [];

    timelineItem.push({
      id: 'timeline',
      name: self.translations.export_timeline,
      family: self.translations.export_timeline
    });

    return timelineItem;
  };

  self.changechaptertitleformat = function(selected) {
    self.chaptertitleexample = ExportService.calculateChapterTitleExample(selected);
  };

  self.changepagenumberformat = function(selected) {
    self.pagenumberformatexample = ExportService.calculatePageNumberFormatExample(selected);
  };


  self.selectItem = function(id) {
    if (id!=='novel_project') {  
      SupporterEditionChecker.filterAction(function() {
        for (let i = 0; i < self.items.length; i++) {
          const item = self.items[i];
          if (item.id === id) {
            self.exportFilter = item;
          }
          break;
        }
      }, function() {
        self.exportFilter = self.items[0];
      });
    } 
    self.initExportingFlags();
  };

  self.getPartsFamily = function () {
  
    let partsfamily = [];
    let family = self.translations.parts;

    let parts = ChapterService.getParts();
    for (let i = 0; i < parts.length; i++) {
      partsfamily.push({
        id: parts[i].$loki,
        name: parts[i].title,
        family: family,
        type: 'part',
      });
    }

    return partsfamily;
  };
  
  self.getChaptersFamily = function () {
  
    let chaptersfamily = [];
    let family = self.translations.common_chapters;

    let chapters = ChapterService.getChaptersWithPrologueAndEpilogue();
    for (let i = 0; i < chapters.length; i++) {
      let type = 'chapter';
      let name = ChapterService.getChapterPositionDescription(chapters[i].position) + ' ' + chapters[i].title;
      if (chapters[i].position === ChapterService.PROLOGUE_POSITION) {
        type = 'prologue';
        name = chapters[i].title;
      } else if (chapters[i].position === ChapterService.EPILOGUE_POSITION) {
        type = 'epilogue';
        name = chapters[i].title;
      }

      chaptersfamily.push({
        id: chapters[i].$loki,
        name: name,
        family: family,
        type: type,
      });
    }

    return chaptersfamily;
  };

  self.getCharactersFamily = function() {
    
    let charactersfamily = [];
    let family = self.translations.common_characters;

    // main characters
    let mainCharacters = MainCharacterService.getMainCharacters();
    for (let i = 0; i < mainCharacters.length; i++) {
      charactersfamily.push({
        id: mainCharacters[i].$loki,
        name: mainCharacters[i].name,
        family: family,
        type: 'maincharacter'
      });
    }

    // secondary characters
    let secondaryCharacters = SecondaryCharacterService.getSecondaryCharacters();
    for (let i = 0; i < secondaryCharacters.length; i++) {
      charactersfamily.push({
        id: secondaryCharacters[i].$loki,
        name: secondaryCharacters[i].name,
        family: family,
        type: 'secondarycharacter'
      });
    }

    // sort by name
    charactersfamily.sort(function (a, b) {
      return (a.name.toUpperCase() > b.name.toUpperCase()) ? 1 : ((b.name.toUpperCase() > a.name.toUpperCase()) ? -1 : 0);
    });

    return charactersfamily;
  };

  self.getArchitectureItem = function() {
    let architectureItem = [];

    let name =  self.translations.common_premise + ', ' + self.translations.common_fabula 
    + ', ' + self.translations.common_setting + ', ' + self.translations.common_notes_title;
    architectureItem.push({
      id: 'architecture',
      name: name,
      family: self.translations.common_architecture,
    });

    return architectureItem;
  };

  self.getStrandsItem = function() {
    let strandsItem = [];

    strandsItem.push({
      id: 'strands',
      name: self.translations.common_strands,
      family: self.translations.common_architecture,
    });

    return strandsItem;
  };

  self.getLocationsFamily = function () {
   
    let locationsfamily = [];
    let family = self.translations.common_locations;

    let locations = LocationService.getLocations();
    for (let i = 0; i < locations.length; i++) {
      let name = LocationService.calculateLocationName(locations[i]);
      locationsfamily.push({
        id: locations[i].$loki,
        name: name,
        family: family,
        type: 'location'
      });
    }

    // sort by name
    locationsfamily.sort(function (a, b) {
      return (a.name.toUpperCase() > b.name.toUpperCase()) ? 1 : ((b.name.toUpperCase() > a.name.toUpperCase()) ? -1 : 0);
    });

    return locationsfamily;
  };

  self.getObjectsFamily = function () {

    let objectsfamily = [];
    if (self.includeSupporterEditionItems) {
      let family = self.translations.objects;
      let objects = self.getObjectService().getObjects();
      for (let i = 0; i < objects.length; i++) {
        objectsfamily.push({
          id: objects[i].$loki,
          name: objects[i].name,
          family: family,
          type: 'object'
        });
      }
    }

    // sort by name
    objectsfamily.sort(function (a, b) {
      return (a.name.toUpperCase() > b.name.toUpperCase()) ? 1 : ((b.name.toUpperCase() > a.name.toUpperCase()) ? -1 : 0);
    });

    return objectsfamily;
  };

  self.getGroupsFamily = function () {

    let groupsfamily = [];
    if (self.includeSupporterEditionItems) {
      let family = self.translations.groups;
      let groups = self.getGroupService().getGroups();
      for (let i = 0; i < groups.length; i++) {
        groupsfamily.push({
          id: groups[i].$loki,
          name: groups[i].name,
          family: family,
          type: 'group'
        });
      }
    }

    // sort by name
    groupsfamily.sort(function (a, b) {
      return (a.name.toUpperCase() > b.name.toUpperCase()) ? 1 : ((b.name.toUpperCase() > a.name.toUpperCase()) ? -1 : 0);
    });

    return groupsfamily;
  };

  self.getNotesFamily = function () {

    let notesfamily = [];
    if (self.includeSupporterEditionItems) {
      let family = self.translations.common_notes_title;
      let notes = self.getNoteService().getNotes();
      for (let i = 0; i < notes.length; i++) {
        notesfamily.push({
          id: notes[i].$loki,
          name: notes[i].name,
          family: family,
          type: 'note'
        });
      }
    }

    // sort by name
    notesfamily.sort(function (a, b) {
      return (a.name.toUpperCase() > b.name.toUpperCase()) ? 1 : ((b.name.toUpperCase() > a.name.toUpperCase()) ? -1 : 0);
    });

    return notesfamily;
  };

  self.getObjectService = function () {
    if (!ObjectService) {
      ObjectService = $injector.get('ObjectService');
    }

    return ObjectService;
  };

  self.getGroupService = function () {
    if (!GroupService) {
      GroupService = $injector.get('GroupService');
    }

    return GroupService;
  };

  self.getNoteService = function () {
    if (!NoteService) {
      NoteService = $injector.get('NoteService');
    }

    return NoteService;
  };

  self.selectFontItem = function(value) {
    if (value!=='courier' && value!=='times' && value!=='arial' ) {  
      SupporterEditionChecker.filterAction(function() {
        self.setFont(value);
      }, function() {
        self.setFont('courier');
      });
    } else {
      self.setFont(value);
    }
  };

  self.setFont = function(value) {
    for (let i = 0; i < self.fontgroup.length; i++) {
      const item = self.fontgroup[i];
      if (item.value === value) {
        self.font = item;
        break;
      }
    }
  };

  self.export = function(isValid) {
    if (isValid && !self.forbiddenDirectory) {
      self.checkExit = {
        active: false
      };
      self.saving = true;

      $timeout(function () {
        if (self.exportAuthor) {
          ProjectService.updateProjectAuthor(self.author);
        }
        BibiscoPropertiesService.setProperty('chaptertitleformat', self.chaptertitleformat);
        BibiscoPropertiesService.setProperty('chaptertitleposition', self.chaptertitleposition);
        BibiscoPropertiesService.setProperty('sceneseparator', self.sceneseparator);
        BibiscoPropertiesService.setProperty('pagenumberposition', self.pagenumberposition);
        BibiscoPropertiesService.setProperty('pagenumberalignment', self.pagenumberalignment);
        BibiscoPropertiesService.setProperty('showfirstpagenumber', self.showfirstpagenumber);
        BibiscoPropertiesService.setProperty('pagenumberformat', self.pagenumberformat);
        BibiscoPropertiesService.setProperty('tocformat', self.tocformat);
        BibiscoPropertiesService.setProperty('toctitle', self.toctitle);
        BibiscoPropertiesService.setProperty('exporthighlightedtext', self.exporthighlightedtext);
        BibiscoPropertiesService.setProperty('exportpath', self.exportpath);
        if ($routeParams.format === 'pdf') {
          BibiscoPropertiesService.setProperty('pdfnoteexport', self.footendnotemode);
        } else if ($routeParams.format === 'docx') {
          BibiscoPropertiesService.setProperty('docxnoteexport', self.footendnotemode);
        } else if ($routeParams.format === 'txt') {
          BibiscoPropertiesService.setProperty('txtnoteexport', self.footendnotemode);
        } 
        BibiscoPropertiesService.setProperty('bookendtitle', self.bookendtitle);
        BibiscoPropertiesService.setProperty('exportcomments', self.exportcomments);
        BibiscoPropertiesService.setProperty('exportscenetitle', self.exportscenetitle);
        BibiscoPropertiesService.setProperty('scenetitleformat', self.scenetitleformat);
        BibiscoPropertiesService.setProperty('scenetitleposition', self.scenetitleposition);
        BibiscoPropertiesService.setProperty('exportunansweredquestions', self.exportunansweredquestions);
        BibiscoPropertiesService.setProperty('font', self.font.value);
        BibiscoPropertiesService.setProperty('exportfontsize', self.exportfontsize);
        BibiscoPropertiesService.setProperty('indentParagraphEnabled', self.indent);
        BibiscoPropertiesService.setProperty('linespacing', self.linespacing);
        BibiscoPropertiesService.setProperty('paragraphspacing', self.paragraphspacing);

        BibiscoDbConnectionService.saveDatabase();

        if ($routeParams.format === 'pdf') {
          ExportService.exportPdf(self.exportFilter, self.exportpath, self.exportCallback);
        } else if ($routeParams.format === 'docx') {
          ExportService.exportWord(self.exportFilter, self.exportpath, self.exportCallback);
        } else if ($routeParams.format === 'txt') {
          ExportService.exportTxt(self.exportFilter, self.exportpath, self.exportCallback);
        } else if ($routeParams.format === 'archive') {
          ExportService.exportArchive(self.exportpath, self.exportCallback);
        }
      }, 250);
    }
  },

  self.exportCallback = function() {
    $timeout(function () {
      $location.path('/export');
    }, 0);
  },

  self.selectProjectsDirectory = function (directory) {
    self.exportpathchanged = true;
    self.exportpath = directory;
    if (FileSystemService.canWriteDirectory(directory)) {
      self.forbiddenDirectory = false;
    } else {
      self.forbiddenDirectory = true;
    }
    
    $scope.$apply();
  };

  $scope.$on('$locationChangeStart', function (event) {
    PopupBoxesService.locationChangeConfirm(event, $scope.exportToFormatForm.$dirty || self.exportpathchanged, self.checkExit);
  });
}
