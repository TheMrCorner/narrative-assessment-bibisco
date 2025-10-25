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
  component('characters', {
    templateUrl: 'components/characters/characters.html',
    controller: CharactersController,
    bindings: {

    }
  });

function CharactersController($injector, $location, $rootScope, $scope, 
  MainCharacterService, SecondaryCharacterService, SupporterEditionChecker) {

  let self = this;
  let GroupService = null;

  self.$onInit = function() {
    
    // show menu item
    $rootScope.$emit('SHOW_PAGE', {
      item: 'characters'
    });

    self.showGroupFilter = false;
    self.maincharacterscardgriditems = self.getMainCharacterCardGridItems();
    self.secondarycharacterscardgriditems = self.getSecondaryCharacterCardGridItems();

    // hotkeys
    self.maincharacterhotkeys = ['ctrl+n', 'command+n'];
    self.secondarycharacterhotkeys = ['ctrl+shift+n', 'command+shift+n'];
  };

  self.createMainCharacter = function() {
    $location.path('/maincharacters/new');
  };

  self.createSecondaryCharacter = function() {
    $location.path('/secondarycharacters/new');
  };

  self.getGroupService = function () {
    if (!GroupService) {
      GroupService = $injector.get('GroupService');
    }
    return GroupService;
  };

  self.getMainCharacterCardGridItems = function() {
    let items;
    if (MainCharacterService.getMainCharactersCount() > 0) {
      let characters = MainCharacterService.getMainCharacters();
      items = self.getGridItemsFromCharacters(characters, 'maincharacter');
    }
    return items;
  };

  self.getSecondaryCharacterCardGridItems = function() {
    let items;
    if (SecondaryCharacterService.getSecondaryCharactersCount() > 0) {
      let characters = SecondaryCharacterService.getSecondaryCharacters();
      items = self.getGridItemsFromCharacters(characters, 'secondarycharacter');
    }
    return items;
  };

  self.getGridItemsFromCharacters = function(characters, type) {
    let items = [];
    for (let i = 0; i < characters.length; i++) {
      let tags = [];
      let showOnActiveFilter = false;
      if (SupporterEditionChecker.isSupporterOrTrial()) {
        let elementGroups = this.getGroupService().getElementGroups(type, characters[i].$loki);
        for (let i = 0; i < elementGroups.length; i++) {
          tags.push({key: elementGroups[i].$loki, label: elementGroups[i].name, color: elementGroups[i].color});
          if ($rootScope.groupFilter && elementGroups[i].$loki === $rootScope.groupFilter.key) {
            showOnActiveFilter = true;
          }
        }
        self.showGroupFilter = true;
      }
      if (!$rootScope.groupFilter || $rootScope.groupFilter.key === 'all' || showOnActiveFilter) {
        items.push({
          id: characters[i].$loki,
          image: characters[i].profileimage, 
          noimageicon: 'user',
          position: characters[i].position,
          status: characters[i].status,
          tags: tags,
          title: characters[i].name
        });
      }
    }
    return items;
  };

  self.mainCharacterSelect = function(id) {
    $location.path('/maincharacters/' + id);
  };

  self.secondaryCharacterSelect = function(id) {
    $location.path('/secondarycharacters/' + id + '/default');
  };

  self.mainCharacterMove = function(draggedObjectId, destinationObjectId) {
    MainCharacterService.move(draggedObjectId, destinationObjectId);
    self.maincharacterscardgriditems = this.getMainCharacterCardGridItems();
    $scope.$apply();
  };

  self.secondaryCharacterMove = function(draggedObjectId, destinationObjectId) {
    SecondaryCharacterService.move(draggedObjectId, destinationObjectId);
    self.secondarycharacterscardgriditems = this.getSecondaryCharacterCardGridItems();
    $scope.$apply();
  };

  self.refreshCardGridItems = function() {
    self.showGroupFilter = false;
    self.maincharacterscardgriditems = self.getMainCharacterCardGridItems();
    self.secondarycharacterscardgriditems = self.getSecondaryCharacterCardGridItems();
    $scope.$apply();
  };
}
