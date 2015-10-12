'use strict';

angular.module("Cache", [])
    .factory("localStorageCache", ["$window", function($window){
        if($window.indexedDB){
            var indexedDB = $window.indexedDB;
            indexedDB.db = null;

            indexedDB.open = function(){
                var request = indexedDb.open("auto_requests");
                request.onsuccess = function(e) {
                    indexedDB.db = e.target.result;
                };

                request.onfailure = indexedDB.onerror;
            };

        } else
            console.log("IndexedDB is DISABLED!");


        return indexedDB;
    }]);
