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

angular.module('bibiscoApp').service('StrandService', function($injector, $rootScope,
  CollectionUtilService, ProjectDbConnectionService
) {
  'use strict';

  return {
    getCollection: function() {
      return ProjectDbConnectionService.getProjectDb().getCollection(
        'strands');
    },
    getStrand: function(id) {
      return this.getCollection().get(id);
    },
    getStrandsCount: function() {
      return this.getStrands().length;
    },
    getStrands: function() {
      return CollectionUtilService.getDataSortedByPosition(this.getCollection());
    },
    insert: function(strand) {
      CollectionUtilService.insert(this.getCollection(), strand);
      // emit insert event
      $rootScope.$emit('INSERT_ELEMENT', {
        id: strand.$loki,
        collection: 'strands'
      });
      return strand;
    },
    move: function(sourceId, targetId) {
      CollectionUtilService.move(this.getCollection(), sourceId, targetId);
      // emit move event
      $rootScope.$emit('MOVE_ELEMENT', {
        id: sourceId,
        collection: 'strands'
      });
    },
    remove: function(id) {
      // delete strand
      CollectionUtilService.removeWithoutCommit(this.getCollection(), id);

      // delete group memberships
      $injector.get('GroupService').removeElementFromGroupsWithoutCommit('strand', id);
      ProjectDbConnectionService.saveDatabase(); 

      // emit remove event
      $rootScope.$emit('DELETE_ELEMENT', {
        id: id,
        collection: 'strands'
      });
    },
    update: function(strand) {
      CollectionUtilService.update(this.getCollection(), strand);
      // emit update event
      $rootScope.$emit('UPDATE_ELEMENT', {
        id: strand.$loki,
        collection: 'strands'
      });
    },
    updateLastSave: function(id, lastsave) {
      let strand = this.getStrand(id);
      strand.lastsave = lastsave;
      this.update(strand);
    },
    updateWithoutCommit: function(strand) {
      CollectionUtilService.updateWithoutCommit(this.getCollection(), strand);
    }
  };
});
