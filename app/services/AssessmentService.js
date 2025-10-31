angular.module('bibiscoApp').service('AssessmentService', function($q, $rootScope) {
  'use strict';

  const postMethod = 'POST';
  const getMethod = 'GET'

  const ipc = require('electron').ipcRenderer;
  const loadProjectEndpoint = '/load-project/';
  const assessEndpoint = '/assess';
  const setProjectsDirectoryEndpoint = '/setup-working-directory';


  return {
    set_projects_directory: function(projectsDirectory) {
        const deferred = $q.defer();

        ipc.send('logger-info', '[ASSESSMENTSERVICE] [SET_PROJECT_DIRECTORY] called to set projects folder');

        if(!$rootScope.assessmentApiReady) {
            ipc.send('logger-info', '[ASSESSMENTSERVICE] [SET_PROJECT_DIRECTORY] Python API not ready');
            deferred.reject('Python API is not ready')
            return deferred.promise;
        }

        ipc.send('api-call', {
            method: postMethod,
            endpoint: setProjectsDirectoryEndpoint,
            data: { working_directory: projectsDirectory }
        });

        const responseHandler = (event, response) => {
            ipc.removeListener('api-response', responseHandler);
            
            if (response.success) {
                deferred.resolve(response.data);
            } else {
                deferred.reject(response.error);
            }
        };
        
        ipc.on('api-response', responseHandler);
        
        return deferred.promise;
    },
    load_project: function(projectId) {
        const deferred = $q.defer();

        
        ipc.send('logger-info', '[ASSESSMENTSERVICE] [LOAD_PROJECT] called to load the project');

        if (!$rootScope.assessmentApiReady) {
            ipc.send('logger-info', '[ASSESSMENTSERVICE] [LOAD_PROJECT] Python API is not ready');
            deferred.reject('Python API is not ready');
            return deferred.promise;
        }

        let endpoint = loadProjectEndpoint + projectId;

        ipc.send('api-call', { 
            method: postMethod,
            endpoint: endpoint,
            data: { projectId: projectId }
        });

        const responseHandler = (event, response) => {
            ipc.removeListener('api-response', responseHandler);
            
            if (response.success) {
                deferred.resolve(response.data);
            } else {
                deferred.reject(response.error);
            }
        };
        
        ipc.on('api-response', responseHandler);
        
        return deferred.promise;
    },
    assess: function(projectId, text) {
        const deferred = $q.defer();
        
        console.log("[ASSESSMENTSERVICE] [ASSESS] Assessment called for project: " + projectId +" with text: " + text);
        
        if (!$rootScope.assessmentApiReady) {
            ipc.send('logger-info', '[ASSESSMENTSERVICE] [ASSESS] Python API is not ready for assessment');
            deferred.reject('Python API is not ready');
            return deferred.promise;
        }

        ipc.send('api-call', { 
            method: postMethod,
            endpoint: assessEndpoint,
            data: { 
                projectId: projectId,
                text: text
            }
        });

        // Listen for response
        const responseHandler = (event, response) => {
            ipc.removeListener('api-response', responseHandler);
            
            if (response.success) {
                ipc.send('logger-info', '[ASSESSMENTSERVICE] [ASSESS] Assessment completed successfully');
                ipc.send('logger-info', '[ASSESSMENTSERVICE] [ASSESS] Full response data: ' + JSON.stringify(response.data));
                
                if (response.data && response.data.assessment) {
                    ipc.send('logger-info', '[ASSESSMENTSERVICE] [ASSESS] Assessment result: ' + response.data.assessment);
                } else {
                    ipc.send('logger-info', '[ASSESSMENTSERVICE] [ASSESS] No assessment property found in response data');
                }
                
                deferred.resolve(response.data);
            } else {
                ipc.send('logger-info', '[ASSESSMENTSERVICE] [ASSESS] Assessment failed: ' + response.error);
                deferred.reject(response.error);
            }
        };
        
        ipc.on('api-response', responseHandler);
        
        return deferred.promise;
    }
  };
});
