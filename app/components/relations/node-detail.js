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
  component('nodedetail', {
    templateUrl: 'components/relations/node-detail.html',
    controller: NodeDetailController,
    bindings: {
      close: '&',
      dismiss: '&',
      resolve: '='
    },
  });

function NodeDetailController($injector, $scope, hotkeys, LocationService, PopupBoxesService,
  MainCharacterService, SecondaryCharacterService) {

  let self = this;
  let ObjectService = null;
  let GroupService = null;

  self.$onInit = function() {

    self.name = self.resolve.name;
    self.color = self.resolve.color;
    self.shape = self.resolve.shape;
    self.editMode = self.resolve.name ? true : false;

    self.shapegroup = [{
      icon: 'user',
      value: 'icon|user'
    }, {
      icon: 'user-o',
      value: 'icon|user-o'
    }, {
      icon: 'group',
      value: 'icon|group'
    }, {
      icon: 'map-marker',
      value: 'icon|map-marker'
    }, {
      icon: 'magic',
      value: 'icon|magic'
    }, {
      icon: 'star',
      value: 'icon|star'
    }, {
      icon: 'heart',
      value: 'icon|heart'
    }, {
      icon: 'flag',
      value: 'icon|flag'
    },{
      icon: 'circle',
      value: 'dot'
    }, {
      icon: 'square',
      value: 'square'
    }, {
      icon: 'play fa-rotate-270',
      value: 'triangle'
    }];

    self.items = [];

    // Characters
    self.items.push.apply(self.items, self.getCharactersNames());

    // Locations
    self.items.push.apply(self.items, self.getLocationsNames());

    // Objects
    self.items.push.apply(self.items, self.getObjectsNames());

    // Groups
    self.items.push.apply(self.items, self.getGroupsNames());
    
    hotkeys.bindTo($scope)
      .add({
        combo: ['enter', 'enter'],
        description: 'enter',
        allowIn: ['INPUT', 'SELECT', 'TEXTAREA'],
        callback: function ($event) {
          $event.preventDefault();
          self.save();
        }
      });
  };

  self.getCharactersNames = function () {

    let charactersnames = [];

    // main characters
    let mainCharacters = MainCharacterService.getMainCharacters();
    for (let i = 0; i < mainCharacters.length; i++) {
      charactersnames.push(mainCharacters[i].name);
    }

    // secondary characters
    let secondaryCharacters = SecondaryCharacterService.getSecondaryCharacters();
    for (let i = 0; i < secondaryCharacters.length; i++) {
      charactersnames.push(secondaryCharacters[i].name);
    }

    return charactersnames;
  };

  self.getLocationsNames = function () {

    let locationsnames = [];
    let locations = LocationService.getLocations();
    for (let i = 0; i < locations.length; i++) {
      let name = LocationService.calculateLocationName(locations[i]);
      locationsnames.push(name);
    }

    return locationsnames;
  };

  self.getObjectsNames = function () {

    let objectsnames = [];
    let objects = self.getObjectService().getObjects();
    for (let i = 0; i < objects.length; i++) {
      objectsnames.push(objects[i].name);
    }

    return objectsnames;
  };

  self.getObjectService = function () {
    if (!ObjectService) {
      ObjectService = $injector.get('ObjectService');
    }

    return ObjectService;
  };

  self.getGroupsNames = function () {

    let groupsnames = [];
    let groups = self.getGroupService().getGroups();
    for (let i = 0; i < groups.length; i++) {
      groupsnames.push(groups[i].name);
    }

    return groupsnames;
  };

  self.getGroupService = function () {
    if (!GroupService) {
      GroupService = $injector.get('GroupService');
    }

    return GroupService;
  };

  self.save = function () {
    self.nodeDetailForm.$submitted = true;
    if (self.nodeDetailForm.$valid) {
      self.close({
        $value: {
          action: 'edit',
          name: self.name, 
          color: self.color,
          shape: self.shape
        }
      });
    } 
  };

  self.back = function() {
    self.dismiss({
      $value: 'cancel'
    });
  };

  self.delete = function () {
    PopupBoxesService.confirm(function() {
      self.close({
        $value: {
          action: 'delete'
        }
      });
    }, 'relations_delete_element_confirm');    
  };
}
