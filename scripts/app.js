  // Copyright 2016 Google Inc.
  // 
  // Licensed under the Apache License, Version 2.0 (the "License");
  // you may not use this file except in compliance with the License.
  // You may obtain a copy of the License at
  // 
  //      http://www.apache.org/licenses/LICENSE-2.0
  // 
  // Unless required by applicable law or agreed to in writing, software
  // distributed under the License is distributed on an "AS IS" BASIS,
  // WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
  // See the License for the specific language governing permissions and
  // limitations under the License.


  (function() {
    'use strict';

    var app = {
      isLoading: true,
      visibleCards: {},
      favoriteStop: [],
      possiblestops: [],
      spinner: document.querySelector('.loader'),
      cardTemplate: document.querySelector('.cardTemplate'),
      cardTemplateAdd: document.querySelector('.cardTemplateAdd'),
      container: document.querySelector('.main')
    };

    app.updateStopCard = function(data){
      var name = data.libelle
      var lignes = data.ligne.reduce((x,y)=> x +String(y.numLigne)+",", "Ligne ")
      console.log(name,lignes)

      var card = app.visibleCards[data.codeLieu]
      if(!card){
        card = app.cardTemplate.cloneNode(true)
        card.classList.remove('cardTemplate');
        card.querySelector('.card-title').textContent = data.name
        card.removeAttribute('hidden')
        app.container.appendChild(card)
        app.visibleCards[data.codeLieu] = card
      }

      card.querySelector(".card-title").textContent = name
      card.querySelector(".card-text").textContent = lignes.slice(0,-1)
    }

    const initialStopData = [
      {"codeLieu":"CRQU",
      "libelle":"Place du Cirque",
      "distance":"13 m",
      "ligne":[
        {"numLigne":"2"},
        {"numLigne":"C1"},
        {"numLigne":"C2"},
        {"numLigne":"C6"},
        {"numLigne":"11"},
        {"numLigne":"23"},
        {"numLigne":"LU"}
      ]},
      {"codeLieu":"BRTA",
      "libelle":"Bretagne",
      "distance":"120 m",
      "ligne":[
        {"numLigne":"3"}
      ]},
      {"codeLieu":"CMAR",
      "libelle":"Cirque - Marais",
      "distance":"162 m",
      "ligne":[
        {"numLigne":"C2"},
        {"numLigne":"12"},
        {"numLigne":"23"}
      ]}
    ]
    /*****************************************************************************
     *
     * Event listeners for UI elements
     *
     ****************************************************************************/
    function addFav(card) {
      initialStopData.push(card)
      localStorage.favoriteStop =JSON.stringify(initialStopData)
    }

    app.updateAddCard = function(data){
      console.log(data)
      var name = data.libelle
      var lignes = data.ligne.reduce((x,y)=> x +String(y.numLigne)+",", "Ligne ")

        var card = app.cardTemplateAdd.cloneNode(true)
        card.classList.remove('cardTemplateAdd');
        card.querySelector('.card-title').textContent = data.name
        card.removeAttribute('hidden')
        app.container.appendChild(card)

      card.querySelector(".card-title").textContent = name
      card.querySelector(".card-text").textContent = lignes.slice(0,-1)
      card.querySelector(".card-add").onclick = addFav(data)
    }


    function getLocation(callback) {
      if (navigator.geolocation) {
          //navigator.geolocation.getCurrentPosition(getStopFromPos);
          getStopFromPos(null,callback)
      } else {
          x.innerHTML = "Geolocation is not supported by this browser.";
      }
    }

    function getStopFromPos(position, callback){
      /*var lat = String(position.coords.latitude).replace('.',',');
      var long = String(position.coords.longitude).replace('.',',');
      getJSON("http://open.tan.fr/ewp/arrets.json/"+lat+"/"+long,
        function(err, data) {
          if (err !== null) {
            alert('Something went wrong: ' + err);
          } else {
            alert('Your data: ' + data);
            return data
          }
      });*/
      // We may not use this function because of cross-origin error
      $.ajaxSetup({beforeSend: function(xhr){
        if (xhr.overrideMimeType)
        {
          xhr.overrideMimeType("application/json");
        }
      }
      });

      $.getJSON('./data/stops.json', callback)
    }

    var getJSON = function(url, callback) {
      var xhr = new XMLHttpRequest();
      xhr.open('GET', url, true);
      xhr.setRequestHeader("Access-Control-Allow-Origin", "*");
      xhr.responseType = 'json';
      xhr.onload = function() {
        var status = xhr.status;
        if (status === 200) {
          callback(null, xhr.response);
        } else {
          callback(status, xhr.response);
        }
      };
      xhr.send();
  };
  window.onload = function () {
    if(window.location.href.endsWith("index.html")){
      console.log('hello')
      app.favoriteStop = localStorage.favoriteStop;
      if (app.favoriteStop) {
        app.favoriteStop = JSON.parse(app.favoriteStop);
        app.favoriteStop.forEach(app.updateStopCard);
      } else {
        initialStopData.forEach(app.updateStopCard)
        localStorage.favoriteStop = JSON.stringify(initialStopData)
      }
    } else {
      getLocation(data => {console.log(data);app.possiblestops = data.data; app.possiblestops.forEach(app.updateAddCard)})
      
    }
    
  }

    // TODO add service worker code here
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker
              .register('./service-worker.js')
              .then(function() { console.log('Service Worker Registered'); });
    }

  })();
