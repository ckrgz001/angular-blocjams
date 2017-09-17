//Our SongPlayer service should now contain:
//two private attributes: currentSong and currentBuzzObject,
//one private function: setSong,
//and two public methods: SongPlayer.play and SongPlayer.pause.

(function() {
     function SongPlayer($rootScope, Fixtures) {

          var SongPlayer = {};
          //@desc To move between songs, we need to know the index of the song object within the  songs array.
          //To access the songs array, we need to store the album information
          var currentAlbum = Fixtures.getAlbum();

          //@desc Buzz object audio file
          //@type {Object}
          var currentBuzzObject = null;

          //@function setSong
          //@desc Stops currently playing song and loads new audio file as currentBuzzObject
          //@param {Object} song
          var setSong = function(song) {
              if (currentBuzzObject) {
                  currentBuzzObject.stop();
                  SongPlayer.currentSong.playing = null;
                }

                currentBuzzObject = new buzz.sound(song.audioUrl, {
                    formats: ['mp3'],
                    preload: true
                });

                currentBuzzObject.bind('timeupdate', function() {
                    $rootScope.$apply(function() {
                        SongPlayer.currentTime = currentBuzzObject.getTime();
                    });
                }); //Add the $apply to the SongPlayer.setSong method so that it starts "applying" the time update once we know which song to play

                SongPlayer.currentSong = song;
            };
          /*@function playSong
            @desc Plays currentBuzzObject
            @param {Object} song */
            var playSong = function(song) {
                    song.playing = true;
                    currentBuzzObject.play();

            };

            var stopSong = function () {
                currentBuzzObject.stop();
                song.playing = null;
            };

            /*@function getSongIndex
              @desc gets the index of a song
              @param {song}
             */
            var getSongIndex = function(song) {
                return currentAlbum.songs.indexOf(song);
            };


            //@desc Active song object from list of songs
            //@type {Object}
            SongPlayer.currentSong = null;

            //@desc Current playback time (in seconds) of currently playing song
            //@type {Number}
            SongPlayer.currentTime = null;

            //@desc Current song volume
            //@type {Number}
            SongPlayer.volume = 80;

            SongPlayer.isMuted = false;



        /* @function play
        @desc Play current or new song
        @param {Object} song */
        SongPlayer.play = function(song) {
            song = song || SongPlayer.currentSong;
            if (SongPlayer.currentSong !== song) {
                setSong(song);
                playSong(song);
            } else if (SongPlayer.currentSong === song) {
                    if (currentBuzzObject.isPaused()) {
                        playSong(song);
                    }
                }
            };

        SongPlayer.pause = function(song) {
            song = song || SongPlayer.currentSong;
            currentBuzzObject.pause();
            song.playing = false;
            };

        //@function SongPlayer.previous
        //@desc takes currentSong and decrements by 1
        SongPlayer.previous = function() {
            var currentSongIndex = getSongIndex(SongPlayer.currentSong);
            currentSongIndex--;

         //If on first song and clicks previous button, stop currentSong & set value of current playing song to first song.
            if (currentSongIndex < 0) {
                currentBuzzObject.stop();
                SongPlayer.currentSong.playing = null;
         //If the currentSongIndex is not less than zero, then it must be greater than zero
         //so the conditional moves to the previous song and automatically plays it
            } else {
                var song = currentAlbum.songs[currentSongIndex];
                    setSong(song);
                    playSong(song);
                }
            };

            //@function SongPlayer.previous
            //@desc takes currentSong and increments by 1
        SongPlayer.next = function()    {
            var currentSongIndex = getSongIndex(SongPlayer.currentSong);
            currentSongIndex++;

                if (currentSongIndex == currentAlbum.songs.length){
                    currentSongIndex = 0;
                }
            //If on last song and clicks next button, stop currentSong & set value of current playing song to zero.
               if (currentSongIndex < 0) {
                   currentBuzzObject.stop();
                   SongPlayer.currentSong.playing = null;
            //If the currentSongIndex is not less than zero, then it must be greater than zero
            //so the conditional moves to the next song and automatically plays it
            } else {
                var song = currentAlbum.songs[currentSongIndex];
                    setSong(song);
                    playSong(song);
                }
            };
            // @function setCurrentTime
            //@desc Set current time (in seconds) of currently playing song
            //@param {Number} time
        SongPlayer.setCurrentTime = function(time) {
            if (currentBuzzObject) {
                currentBuzzObject.setTime(time);
                }
            };
            //@function setVolume
            //@desc Set current volume (number)
            //@param {Number}
        SongPlayer.setVolume = function (volume) {
            if (currentBuzzObject) {
                currentBuzzObject.setVolume(volume);
                }
            SongPlayer.volume = volume;
            };

        SongPlayer.mute = function () {
            if (currentBuzzObject) {
                currentBuzzObject.mute();
            }
            SongPlayer.volume = 0;
            SongPlayer.isMuted = true;
        };

        SongPlayer.unmute = function() {
            if (currentBuzzObject.isMuted()) {
                currentBuzzObject.unmute();
            }
            SongPlayer.isMuted = false;
            SongPlayer.volume = 80;
        };

         return SongPlayer;
     };

     angular
         .module('blocJams')
         .factory('SongPlayer',['$rootScope','Fixtures', SongPlayer]);
 })();
