angular.module('bibiscoApp').service('AssessmentService', function($q) {
  'use strict';

  const postMethod = 'POST';
  const getMethod = 'GET'

  const ipc = require('electron').ipcRenderer;
  const loadProjectEndpoint = '/load-project/';
  let apiReady = false;


  function checkApiStatus() {
    if (apiReady) return;
    
    console.log('Checking api status');
    
    ipc.send('check-api-status');
    
    const statusHandler = (event, response) => {
        console.log('Checking api status: response.ready');
        ipc.removeListener('api-status', statusHandler);
        apiReady = response.ready;
        console.log('API status checked:', apiReady);
    };
    
    ipc.on('api-status', statusHandler);
  }

  checkApiStatus();

  return {
    load_project: function(projectId) {
        const deferred = $q.defer();

        
        ipc.send('logger-info', 'called to load the project');

        // Check if the api is ready
        if (!apiReady) {
            ipc.send('logger-info', 'Python API is not ready');
            deferred.reject('Python API is not ready');
            return deferred.promise;
        }

        let endpoint = loadProjectEndpoint + projectId;

        ipc.send('api-call', { 
            method: postMethod,
            endpoint: endpoint,
            data: { projectId: projectId }
        });

        // Listen for response
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
        return null;
    }
  };
});
