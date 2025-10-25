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
  component('card', {
    templateUrl: 'components/common/uielements/card/card.html',
    controller: CardController,
    bindings: {
      cardid: '<',
      cardtitle: '@',
      characters: '<',
      dimension: '@',
      dndenabled: '<',
      dropfunction: '&',
      family: '@',
      hastext: '<',
      image: '@',
      noimageicon: '@',
      selectfunction: '&',
      status: '<',
      supportersonly: '<',
      tags: '<',
      text: '@',
      words: '<'
    }
  });


function CardController(FileSystemService, ImageService) {

  let self = this;

  self.$onInit = function () {
    self.projectImagesDirectory = ImageService.getProjectImagesDirectoryPath() + FileSystemService.getPathSeparator();
    self.tagspresent = self.tags ? '' : '-notags';
  };
}
