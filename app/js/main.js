    $(document).ready(function() {

        var objsToHide = [{
            lon: 107.5,
            lat: 0,
            geom:[20,50,10],
            timeRanges: [0, 100],
            display: "Lambrini"
        }, {
            lon: -75,
            lat: 10,
            geom:[20,20,10],
            timeRanges: [20, 100],
            display: "Banana"
        }, {
            lon: 350,
            lat: -12,
            geom:[20,10,100],
            timeRanges: [0, 100],
            display: "Pen"
        }];

        var objsFound = [];

        var options = {
            showHiddenObjs: 0,
            valiantOptions: {
                clickAndDrag: true, // use click-and-drag camera controls
                flatProjection: false, // map image to appear flat (often more distorted)
                hideControls: true, // hide player controls
                lon: 0, // initial lon for camera angle
                lat: 0, // initial lat for camera angle
                loop: "loop", // video loops by default
                muted: true, // video muted by default
                autoplay: true// video autoplays by default
            },
            hiddenObjs: objsToHide
        }

        var foundObjs =[];
        options.found = function(indexFound) {
            console.log('found ---' + indexFound);
            if(foundObjs.indexOf(indexFound)<0) {
                foundObjs.push(indexFound);
                $('.foundlist').append('<li>'+ objsToHide[indexFound].display +'</li>');

                if(foundObjs.length>=objsToHide.length) {
                    $('.dialog').html('Well done. You win!!');
                    $('.cover').slideDown()
                }
            }


        };

        options.keepLooking = function(indexNotFound) {};

        $('.valiantPhoto').SpotMe(options);

        $('.start').click(function() {
            $('.preplay').slideUp(300, function() {
                $('.playing').slideDown();
            });
            $('.cover').slideUp();
        });


    });
