(function() {
     function seekBar($document) {

         var calculatePercent = function(seekBar, event) {
             var offsetX = event.pageX - seekBar.offset().left;
             var seekBarWidth = seekBar.width();
             var offsetXPercent = offsetX / seekBarWidth;
             offsetXPercent = Math.max(0, offsetXPercent);
             offsetXPercent = Math.min(1, offsetXPercent);
             return offsetXPercent;
        };

         return {
             templateUrl: '/templates/directives/seek_bar.html',
             replace: true,
             restrict: 'E',
             scope: {
                 onChange: '&'
                },
             link: function(scope, element, attributes) {
             // directive logic to return
                scope.value = 0;
                scope.max = 100;

                var seekBar = $(element);

                attributes.$observe('value', function(newValue) {
                    scope.value = newValue;
                });

                attributes.$observe('max', function(newValue) {
                    scope.max = newValue;
                });

                var percentString = function () {
                    var value = scope.value;
                    var max = scope.max;
                    var percent = value / max * 100;
                    return percent + "%";
                };

                scope.fillStyle = function () {
                    return {width: percentString()};
                };

                scope.thumbStyle = function () {
                    return {left: percentString()};
                }




                scope.onClickSeekBar = function(event) {
                    var percent = calculatePercent(seekBar, event);
                    scope.value = percent * scope.max;
                    notifyOnChange(scope.value); //We need to pass the updated value to the onChange attribute. To do so, we'll write a function to call in the onClickSeekBar and trackThumb methods that will send the updated scope.value to the function evaluated by onChange
                };

                scope.trackThumb = function() {
                    $document.bind('mousemove.thumb', function(event) {
                        var percent = calculatePercent(seekBar, event);
                        scope.$apply(function() {
                            scope.value = percent * scope.max;
                            notifyOnChange(scope.value); //We need to pass the updated value to the onChange attribute. To do so, we'll write a function to call in the onClickSeekBar and trackThumb methods that will send the updated scope.value to the function evaluated by onChange
                        });
                    });

                    $document.bind('mouseup.thumb', function() {
                        $document.unbind('mousemove.thumb');
                        $document.unbind('mouseup.thumb');
                    });
                };

                var notifyOnChange = function(newValue) {
                    if (typeof scope.onChange === 'function') { //We test to make sure that scope.onChange is a function. If a future developer fails to pass a function to the on-change attribute in the HTML, the next line will not be reached, and no error will be thrown.
                        scope.onChange({value: newValue}); //We pass a full function call to the on-change attribute in the HTML –  scope.onChange() calls the function in the attribute.
                    } //The function we pass in the HTML has an argument, value, which isn't defined in the view (remember that it's not the same as scope.value). Using built-in Angular functionality, we specify the value of this argument using hash syntax. Effectively, we're telling Angular to insert the local newValue variable as the  value argument we pass into the SongPlayer.setCurrentTime() function called in the view.
                };
            }
        };
     }

     angular
         .module('blocJams')
         .directive('seekBar', ['$document',seekBar]);
 })();
