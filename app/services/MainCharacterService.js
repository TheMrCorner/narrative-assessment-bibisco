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

angular.module('bibiscoApp').service('MainCharacterService', function($injector, $rootScope, ChapterService,
  CollectionUtilService, ImageService, LoggerService, ProjectDbConnectionService, ProjectService, 
  WordCharacterCountService) {
  'use strict';

  let CustomQuestionService = null;

  return {
    addImage: function (id, name, path) {
      let filename = ImageService.addImageToProject(path);
      LoggerService.info('Added image file: ' + filename + ' for element with $loki='
        + id + ' in maincharacters');

      let maincharacter = this.getMainCharacter(id);
      let images = maincharacter.images;
      images.push({
        name: name,
        filename: filename
      });
      maincharacter.images = images;
      CollectionUtilService.update(this.getCollection(), maincharacter);

      return filename;
    },
    calculateStatus: function (maincharacter) {
      let result;

      if (maincharacter.personaldata.status === 'todo' &&
        maincharacter.physionomy.status === 'todo' &&
        maincharacter.behaviors.status === 'todo' &&
        maincharacter.sociology.status === 'todo' &&
        maincharacter.psychology.status === 'todo' &&
        maincharacter.ideas.status === 'todo' &&
        (maincharacter.custom.status === 'todo' || maincharacter.custom.status === null) &&
        maincharacter.lifebeforestorybeginning.status === 'todo' &&
        maincharacter.conflict.status === 'todo' &&
        maincharacter.evolutionduringthestory.status === 'todo'
      ) {
        result = 'todo';
      } else if (maincharacter.personaldata.status === 'done' &&
        maincharacter.physionomy.status === 'done' &&
        maincharacter.behaviors.status === 'done' &&
        maincharacter.sociology.status === 'done' &&
        maincharacter.psychology.status === 'done' &&
        maincharacter.ideas.status === 'done' &&
        (maincharacter.custom.status === 'done' || maincharacter.custom.status === null) &&
        maincharacter.lifebeforestorybeginning.status === 'done' &&
        maincharacter.conflict.status === 'done' &&
        maincharacter.evolutionduringthestory.status === 'done'
      ) {
        result = 'done';
      } else {
        result = 'tocomplete';
      }

      return result;
    },
    deleteImage: function (id, filename) {

      // delete image file
      ImageService.deleteImage(filename);
      LoggerService.info('Deleted image file: ' + filename + ' for element with $loki='
        + id + ' in maincharacters');

      // delete reference
      let maincharacter = this.getMainCharacter(id);
      let images = maincharacter.images;
      let imageToRemovePosition;
      for (let i = 0; i < images.length; i++) {
        if (images[i].filename === filename) {
          imageToRemovePosition = i;
          break;
        }
      }
      images.splice(imageToRemovePosition, 1);
      maincharacter.images = images;

      // delete profile image reference
      if (maincharacter.profileimage === filename) {
        maincharacter.profileimage = null;
      }

      CollectionUtilService.update(this.getCollection(), maincharacter);

      return maincharacter;
    },
    getCollection: function() { 
      return ProjectDbConnectionService.getProjectDb().getCollection('maincharacters');
    },
    getMainCharacter: function(id) {
      return this.getCollection().get(id);
    },
    getMainCharactersCount: function() {
      return this.getMainCharacters().length;
    },
    getMainCharacters: function() {
      return CollectionUtilService.getDataSortedByPosition(this.getCollection());
    },

    insert: function(maincharacter) {

      maincharacter = this.executeInsert(maincharacter);

      // insert character
      CollectionUtilService.insert(this.getCollection(), maincharacter);

      // emit insert event
      $rootScope.$emit('INSERT_ELEMENT', {
        id: maincharacter.$loki,
        collection: 'maincharacters'
      });

      return maincharacter;
    },

    insertWithoutCommit: function(maincharacter) {

      maincharacter = this.executeInsert(maincharacter);
      CollectionUtilService.insertWithoutCommit(this.getCollection(), maincharacter);

      return maincharacter;
    },

    executeInsert: function(maincharacter) {

      // personal data
      maincharacter.personaldata = this.createInfoWithQuestions('personaldata');

      // physionomy
      maincharacter.physionomy = this.createInfoWithQuestions('physionomy');

      // behaviors
      maincharacter.behaviors = this.createInfoWithQuestions('behaviors');

      // sociology
      maincharacter.sociology = this.createInfoWithQuestions('sociology');

      // psychology
      maincharacter.psychology = this.createInfoWithQuestions('psychology');

      // ideas
      maincharacter.ideas = this.createInfoWithQuestions('ideas');

      // custom questions
      maincharacter.custom = this.createInfoWithQuestions('custom');

      // life before story beginning
      maincharacter.lifebeforestorybeginning = this.createInfoWithoutQuestions('todo');

      // conflict
      maincharacter.conflict = this.createInfoWithoutQuestions('todo');

      // evolutionduringthestory
      maincharacter.evolutionduringthestory = this.createInfoWithoutQuestions('todo');

      // notes
      maincharacter.notes = this.createInfoWithoutQuestions(null);

      // images
      let images = [];
      maincharacter.images = images;

      return maincharacter;
    },

    createInfoWithQuestions: function(type) {

      let questionNumber;
      switch (type) {
      case 'personaldata':
        questionNumber = 13;
        break;
      case 'physionomy':
        questionNumber = 24;
        break;
      case 'behaviors':
        questionNumber = 12;
        break;
      case 'sociology':
        questionNumber = 11;
        break;
      case 'psychology':
        questionNumber = 62;
        break;
      case 'ideas':
        questionNumber = 18;
        break;
      case 'custom':
        questionNumber = this.getCustomQuestionsNumber();
        break;
      }

      let questions = [];
      for (let i = 0; i < questionNumber; i++) {
        questions[i.toString()] = {
          characters: 0, 
          text: '', 
          words: 0
        };
        if (type === 'custom') {
          questions[i.toString()].questionid = this.getCustomQuestionService().getCustomQuestions()[i].$loki;
        }
      }

      return {
        freetextcharacters: 0,
        freetext: '',
        freetextenabled: false,
        questions: questions,
        status: type === 'custom' ? null : 'todo',
        freetextwords: 0
      };
    },

    createInfoWithoutQuestions: function (status) {
      return {
        characters: 0, 
        status: status,
        text: '',
        words: 0
      };
    },

    getCustomQuestionsNumber: function() {
      return this.getCustomQuestionService().getCustomQuestionsCount();
    },

    getCustomQuestionService: function() {
      if (!CustomQuestionService) {
        CustomQuestionService = $injector.get('CustomQuestionService');
      }
      return CustomQuestionService;
    },
  
    move: function(sourceId, targetId) {
      CollectionUtilService.move(this.getCollection(), sourceId, targetId);
      // emit move event
      $rootScope.$emit('MOVE_ELEMENT', {
        id: sourceId,
        collection: 'maincharacters'
      });
    },
    remove: function(id) {
      this.executeRemoveWithoutCommit(id);
      ProjectDbConnectionService.saveDatabase(); 

      // emit remove event
      $rootScope.$emit('DELETE_ELEMENT', {
        id: id,
        collection: 'maincharacters'
      });
    },
    executeRemoveWithoutCommit: function(id) {
      CollectionUtilService.removeWithoutCommit(this.getCollection(), id);
      $injector.get('GroupService').removeElementFromGroupsWithoutCommit('maincharacter', id);
    },
    setProfileImage: function (id, filename) {
      LoggerService.info('Set profile image file: ' + filename + ' for element with $loki='
        + id + ' in maincharacters');

      let maincharacter = this.getMainCharacter(id);
      maincharacter.profileimage = filename;
      CollectionUtilService.update(this.getCollection(), maincharacter);
    },
    transformIntoSecondary: function(id) {
      let maincharacter = this.getMainCharacter(id);

      // load SecondaryCharacterService via $injector to avoid circular dependency
      let SecondaryCharacterService = $injector.get('SecondaryCharacterService');
      
      // create the cloned secondarycharacter
      let secondarycharacter = SecondaryCharacterService.insertWithoutCommit({
        description: '',
        name: maincharacter.name
      });

      // populate secondarycharacter description with maincharacter answered questions
      let ExportService = $injector.get('ExportService');
      secondarycharacter.description = ExportService.createMainCharacterForTransformation(maincharacter);
      let wordCountMode = ProjectService.getProjectInfo().wordCountMode;
      let count = WordCharacterCountService.count(secondarycharacter.description, wordCountMode);
      secondarycharacter.words = count.words; 
      secondarycharacter.characters = count.characters; 

      // populate secondarycharacter status
      secondarycharacter.status = maincharacter.status;

      // populate secondarycharacter events and images
      secondarycharacter.events = maincharacter.events;
      secondarycharacter.images = maincharacter.images;
      secondarycharacter.profileimage = maincharacter.profileimage;
      SecondaryCharacterService.updateWithoutCommit(secondarycharacter);

      // populate groups
      let GroupService = $injector.get('GroupService');
      let elementGroups = GroupService.getElementGroups('maincharacter', id);
      let groupids = [];
      for (let i = 0; i < elementGroups.length; i++) {
        groupids.push(elementGroups[i].$loki);        
      }
      GroupService.addElementToGroupsWithoutCommit('secondarycharacter', secondarycharacter.$loki, groupids);

      // update scene tags
      ChapterService.replaceCharacterInSceneTagsWithoutCommit('m_'+id, 's_'+secondarycharacter.$loki);

      // remove main character
      this.executeRemoveWithoutCommit(id);

      // save database
      ProjectDbConnectionService.saveDatabase(); 
      
      // emit TRANSFORM MAIN CHARACTER event
      $rootScope.$emit('TRANSFORM_MAIN_CHARACTER', {
        maincharacterid: id,
        secondarycharacterid: secondarycharacter.$loki
      });
      
      LoggerService.info('Transformed main character with $loki='
        + id + ' into secondary character with $loki=' + secondarycharacter.$loki);

      return secondarycharacter;
    },
    update: function(maincharacter) {
      maincharacter.status = this.calculateStatus(maincharacter);
      CollectionUtilService.update(this.getCollection(), maincharacter);
      // emit update event
      $rootScope.$emit('UPDATE_ELEMENT', {
        id: maincharacter.$loki,
        collection: 'maincharacters'
      });
    },
    updateLastSave: function(id, lastsave) {
      let maincharacter = this.getMainCharacter(id);
      maincharacter.lastsave = lastsave;
      this.update(maincharacter);
    },
    updateWithoutCommit: function(maincharacter) {
      maincharacter.status = this.calculateStatus(maincharacter);
      CollectionUtilService.updateWithoutCommit(this.getCollection(), maincharacter);
    }
  };
});
