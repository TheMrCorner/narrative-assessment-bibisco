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

angular.module('bibiscoApp').service('TxtExporterService', function (FileSystemService) {
  'use strict';

  let htmlparser = require('htmlparser2');
  
  /*
   * needed module to wrap the text to given lenght
   * TODO: ask for the wrapLenght in the client frontend.
   * 
   */
  
  let wrap = require('word-wrap');

  return {

    export: function (params, callback) {

      let content = '';
      
      let currentText = '';
      let h1counter = 0;
      let h2counter = 0;
      let h3counter = 0;
      let listCounter = 0;
      let listType = '';
      /*
       * By now, wrapValue is fixed.
       * TODO: add a radio button in the export dialog to allow
       * users to define a different wrap value.
       */
      let wrapValue = 80;
      let firstLine = '';
      let wrappedContent = '';
      let footnotesCounter = 0;
      let closeComment = false;
      let comment = null;

      let parser = new htmlparser.Parser({

        onopentag: function (name, attribs) {

          if (name === 'exporttitle') {
            currentText = '';
          } else if (name === 'exportauthor') {
            currentText = '';
          } else if (name === 'exportsubtitle') {
            currentText = '';
          } else if (name === 'parttitle') {
            currentText = '';
          } else if (name === 'prologue' || name === 'epilogue') {
            currentText += '';
          } else if (name === 'h1') {
            h1counter += 1;     
            if (params.exportconfig.hcountingactive) {
              currentText += h1counter+' ';
            }     
          } else if (name === 'h2') {
            h2counter += 1;
            if (params.exportconfig.hcountingactive) {
              currentText += h1counter + '.' + h2counter + ' ';
            }
          } else if (name === 'h3') {
            h3counter += 1;
            if (params.exportconfig.hcountingactive) {
              currentText += h1counter + '.' + h2counter + '.' + h3counter + ' ';
            }
          } else if (name === 'question') {
            currentText = '';
          } else if (name === 'span') {
            currentText += this.manageFootendnote(attribs);
            currentText += this.manageComment(attribs);
          } else if ( name === 'ol' ) {
            listType = name;
            // beware of nested ordered lists... this could be tricky
            listCounter = 0;
          } else if (name === 'p' || name === 'li' || name === 'note') {
            currentText = '';
          }
          
        },

        ontext: function (text) {
          currentText += text;     
        },

        onclosetag: function (name) {
          
          if (name === 'exporttitle') {
            content += '*** ' + currentText.toUpperCase() + ' ***\n';
            currentText = '';
          } else if (name === 'exportauthor') {
            content += '*** ' + currentText.toUpperCase() + ' ***\n';
            currentText = '';
          } else if (name === 'exportsubtitle') {
            if (currentText && currentText.length>0) {
              content += currentText.toUpperCase() + ' \n';
            } 
            content += '\n';
            currentText = '';
          } else if (name === 'parttitle') {
            content += currentText.toUpperCase() + '\n';
            currentText = '';
          } else if (name === 'prologue' || name === 'epilogue') {
            content += currentText.toUpperCase() + '\n';
            currentText = '';
          } else if (name === 'h1') {
            content += currentText.toUpperCase() + '\n';
            currentText = '';
            h2counter = 0;
          } else if (name === 'h2') {
            content += currentText.toUpperCase() + '\n';
            currentText = '';
            h3counter = 0;
          } else if (name === 'h3') {
            content += currentText.toUpperCase() + '\n';
            currentText = '';
          } else if (name === 'question') {
            content += currentText + '\n';
            currentText = '';
          } else if (name === 'ul') {
            
          } else if (name === 'ol') {
            listCounter = 0;
            listType = '';
          } else if (name === 'li') {
            
            if (listType === 'ol') {
              listCounter += 1;
              content += listCounter + '. ' + currentText + '\n';
            } else {
              content += '-  ' + currentText + '\n';
            }
            currentText = '';
            firstLine = '';
          } else if (name === 'p' || name === 'note') {
            content += currentText + '\n';
            currentText = '';
          } else if (name === 'span') {
            if (closeComment) {
              content += currentText + '['+comment+']]';
              closeComment = false;
              comment = null;
              currentText = '';
            }
          } else if (name === 'b') {
            
          } else if (name === 'i') {
            
          } else if (name === 'u') {
            
          } else if (name === 'strike') {
            
          }

        },

        onend: function() {
          content = content.replace(/  +/g, ' ');
          wrappedContent = wrap(content, {width: wrapValue, indent: params.exportconfig.indent});
          FileSystemService.writeFileSync(params.filepath + '.txt', wrappedContent);
          
          if (callback) {
            callback();
          }
        },

        manageFootendnote: function(attribs) {

          const footendnotemode = params.exportconfig.footendnotemode;
          if (attribs.class && attribs.class.indexOf('footendnote') > -1) {
            footnotesCounter++;
            if (footendnotemode === 'chapterend' || footendnotemode === 'bookend') {
              return '('+footnotesCounter.toString()+') ';
            }
          }

          return '';
        },

        manageComment: function(attribs) {
          let result = '';
          if (params.exportconfig.exportcomments === 'true' && attribs['data-iscomment'] && attribs['data-iscomment'] === 'true') {
            if (attribs.class.indexOf('comment-beginning') > -1) {
              result = '[';
            }
            if (attribs.class.indexOf('comment-end') > -1) {
              comment = attribs['data-comment'];
              closeComment = true;
            }
          }
          return result;
        },

      }, { decodeEntities: true });

      parser.write(params.html);

      parser.end();
    }
  };
});
