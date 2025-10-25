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

// Development version - all supporter features enabled
angular.module('bibiscoApp').service('SupporterEditionChecker', ['$injector', '$rootScope', '$translate',
  function($injector, $rootScope, $translate) {
    'use strict';

    const { shell } = require('electron');
    let BibiscoPropertiesService = $injector.get('BibiscoPropertiesService');
    let $uibModal = $injector.get('$uibModal');

    return {
      // Always return that we have supporter status for development
      check: function() {
        return 1; // 1 = supporter, 0 = trial, -1 = expired
      },

      // Always return true - we are a "supporter" for development
      isSupporter: function() {
        return true;
      },

      // Always return true since we're treating as supporter
      isSupporterOrTrial: function() {
        return true;
      },

      // Always return true - treat as active trial for development
      isTrialActive: function() {
        return true;
      },

      // Always return false - trial never expires in development
      isTrialExpired: function() {
        return false;
      },

      // Always execute the action since we have supporter access
      filterAction: function(action, popupAction) {
        action();
      },

      // Return a high number of remaining days for development
      getRemainingTrialDays: function() {
        return 999;
      },

      // Development version - don't show supporter messages
      showSupporterMessage: function(callback) {
        console.log('Development mode: Supporter message suppressed');
        if (callback) callback();
      },

      // Development version - don't show trial messages
      showTrialMessage: function(callback) {
        console.log('Development mode: Trial message suppressed');
        if (callback) callback();
      }
    };
  }
]);