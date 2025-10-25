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

angular.module('bibiscoApp').service('WordCharacterCountService', function() {
  'use strict';
  
  let htmlToText = require('html-to-text');
  
  return {
    count: function(html, wordCountMode) {

      let wordregex;
      if (wordCountMode === 'hyphenated-contracted-possessive-1-word') {
        wordregex = /[a-zA-Z0-9_\-'’\.,\u00c0-\u00d6\u00d8-\u00f6\u00f8-\u00ff\u0100-\u017f\u0180-\u024f\u0370-\u0373\u0376-\u0376\u037b-\u037d\u0388-\u03ff\u0400-\u04FF]+|[\u4E00-\u9FFF\u3400-\u4dbf\uf900-\ufaff\u3040-\u309f\uac00-\ud7af\u0400-\u04FF]+|[\u00E4\u00C4\u00E5\u00C5\u00F6\u00D6]+|\w+/g;
      } else {
        wordregex = /[a-zA-Z0-9_\u00c0-\u00d6\u00d8-\u00f6\u00f8-\u00ff\u0100-\u017f\u0180-\u024f\u0370-\u0373\u0376-\u0376\u037b-\u037d\u0388-\u03ff\u0400-\u04FF]+|[\u4E00-\u9FFF\u3400-\u4dbf\uf900-\ufaff\u3040-\u309f\uac00-\ud7af\u0400-\u04FF]+|[\u00E4\u00C4\u00E5\u00C5\u00F6\u00D6]+|\w+/g;
      }

      let text = htmlToText.fromString(html, {
        wordwrap: false,
        ignoreImage: true,
        ignoreHref: true
      });
      text = text.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
      let characters = text.replace(/\n/g, '').trim().length;
      let words = 0;
      let matches = text.match(wordregex);
      if (matches) {
        words = matches.length;
      }

      return {
        characters: characters,
        words: words
      };
    },
  };
});
