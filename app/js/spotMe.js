/*!
 *
 * Released under the MIT license:
 *   http://www.opensource.org/licenses/mit-license.php
 *
 * Jquery plugin pattern based on https://github.com/jquery-boilerplate/jquery-patterns/blob/master/patterns/jquery.basic.plugin-boilerplate.js
 */

/* REQUIREMENTS:

jQuery 1.7.2 or greater
three.js r65 or higher

*/


/*!
 * jQuery lightweight plugin boilerplate
 * Original author: @ajpiano
 * Further changes, comments: @addyosmani
 * Licensed under the MIT license
 */

// the semi-colon before the function invocation is a safety
// net against concatenated scripts and/or other plugins
// that are not closed properly.
;
(function($, THREE, Detector, window, document, undefined) {

    // undefined is used here as the undefined global
    // variable in ECMAScript 3 and is mutable (i.e. it can
    // be changed by someone else). undefined isn't really
    // being passed in so we can ensure that its value is
    // truly undefined. In ES5, undefined can no longer be
    // modified.

    // window and document are passed through as local
    // variables rather than as globals, because this (slightly)
    // quickens the resolution process and can be more
    // efficiently minified (especially when both are
    // regularly referenced in your plugin).

    // Create the defaults once
    var pluginName = "SpotMe",
        defaults = {
            showHiddenObjs: 0,
            found: function() {},
            keepLooking: function() {},
            valiantOptions: {
                clickAndDrag: false,
                fov: 35,
                hideControls: false,
                lon: 0,
                lat: 0,
                loop: "loop",
                muted: true,
                debug: false,
                flatProjection: false,
                autoplay: true
            },
            hiddenObjs: []
        };

    // The actual plugin constructor
    function Plugin(element, options) {
        this.element = element;

        // jQuery has an extend method that merges the
        // contents of two or more objects, storing the
        // result in the first object. The first object
        // is generally empty because we don't want to alter
        // the default options for future instances of the plugin
        this.options = $.extend({}, defaults, options);

        this._defaults = defaults;
        this._name = pluginName;

        this.init();
    }

    Plugin.prototype = {

        init: function() {
            if (!$.fn.Valiant360) {
                console.error('You must have the Valiant360 plugin loaded');
                return false;
            }

            //Creates a Valiant 360 player instance
            $(this.element).Valiant360(this.options.valiantOptions);
            //Assigns the public properties to a variable for easy access
            var Player360 = $(this.element).data('plugin_Valiant360');


            var material = new THREE.MeshBasicMaterial({
                color: 0xff0000,
                transparent: true,
                opacity: this.options.showHiddenObjs
            });

            var hiddenObjs = this.options.hiddenObjs;
            for (var i = 0; i < hiddenObjs.length; i++) {

                var geometry = new THREE.CubeGeometry(hiddenObjs[i].geom[0], hiddenObjs[i].geom[1], hiddenObjs[i].geom[2]);

                hiddenObjs[i].threeObj = new THREE.Mesh(geometry, material);

                var herelat = Math.max(-85, Math.min(85, hiddenObjs[i].lat));
                var herephi = (90 - hiddenObjs[i].lat) * Math.PI / 180;
                var heretheta = hiddenObjs[i].lon * Math.PI / 180;

                hiddenObjs[i].threeObj.position.x = 500 * Math.sin(herephi) * Math.cos(heretheta);
                hiddenObjs[i].threeObj.position.y = 500 * Math.cos(herephi);
                hiddenObjs[i].threeObj.position.z = 500 * Math.sin(herephi) * Math.sin(heretheta);

                Player360._scene.add(hiddenObjs[i].threeObj);
            }


            Player360.element.addEventListener('mousedown', mouseDownCanvas.bind(this), false);
            //Prevents default right click
            Player360.element.oncontextmenu = function() {
                return false;
            };

            //Checks if a right click has found an object
            function mouseDownCanvas(event) {
                //Is it a rigt click?

                var currVidTime = Player360._video.currentTime;
                if (event.which === 3) {
                    event.preventDefault();

                    var vectorMouse = new THREE.Vector3( //vector from camera to mouse
                        -(window.innerWidth / 2 - event.clientX) * 2 / window.innerHeight, (window.innerHeight / 2 - event.clientY) * 2 / window.innerHeight, -1 / Math.tan(22.5 * Math.PI / 180)); //22.5 is half of camera frustum angle 45 degree
                    vectorMouse.applyQuaternion(Player360._camera.quaternion);
                    vectorMouse.normalize();

                    var hiddenObjs = this.options.hiddenObjs;
                    for (var i = 0; i < hiddenObjs.length; i++) {
                        var vectorObject = new THREE.Vector3(); //vector from camera to object
                        vectorObject.set(hiddenObjs[i].threeObj.position.x - Player360._camera.position.x,
                            hiddenObjs[i].threeObj.position.y - Player360._camera.position.y,
                            hiddenObjs[i].threeObj.position.z - Player360._camera.position.z);
                        vectorObject.normalize();

                        if (vectorMouse.angleTo(vectorObject) * 180 / Math.PI < 10) {
                            //mouse's position is near object's position

                            for(var t=0; t<hiddenObjs[i].timeRanges.length; t = t+2) {
                                if(currVidTime > hiddenObjs[i].timeRanges[t] && currVidTime < hiddenObjs[i].timeRanges[t+1]) {
                                    this.options.found(i);
                                } else {
                                    this.options.keepLooking(i);
                                }
                            }

                        } else {
                            this.options.keepLooking(i);
                        }
                    }
                }

            }


        }

    };

    // A really lightweight plugin wrapper around the constructor,
    // preventing against multiple instantiations
    $.fn[pluginName] = function(options) {
        return this.each(function() {
            if (!$.data(this, "plugin_" + pluginName)) {
                $.data(this, "plugin_" + pluginName,
                    new Plugin(this, options));
            }
        });
    };

})(jQuery, THREE, Detector, window, document);
