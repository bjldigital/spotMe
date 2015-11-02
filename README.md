# spotMe

##A quick exploration with 360 videos and the plugin Valiant360

An extension of the Valiant 360 (https://github.com/flimshaw/Valiant360) plugin to add objects into the ThreeJS scene created, allow them to be shown and hidden and detect when they are clicked.

The plugin has several dependencies

- jQuery
- Three.js
- Three JS Detector
- The Valiant 360 player


##Options

###Default options which are passed if no options are passed.

```
{
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
}
```

###showHiddenObjs (Integer)

Opacity of the objects you are adding to the scene.

###found (function(hiddenObjsIndex))

```hiddenObjsIndex``` is the index of the object clicked in the hiddenObjs array.

Callback which fires when an item in the video is right clicked.

###keepLooking (function)

Function which fires when a right click is placed and an object isn't found. Fires once per object not found.

###valiantOptions (Object)

Options object to be passed to Valiant 360.

###hiddenObjs (Array)

An array of hidden objects which build up where hidden objects should be placed and what shape they should take.

A hidden object should take the following properties:

```
{
  lon: 107.5,
  lat: 0,
  geom:[20,50,10],
  timeRanges: [0, 100],
  display: "Wine bottle"
}
```

####Lon and Lat

Placement of the object onto the sphere in longtitude and latitude.

#### Geom

Array of shape [ length of shape in x plane, length of shape in y plane, length of shape in z plane]

####timeRanges

Array of time points where the object should be switched between on and off. Must be given in sets of two so length of array must be even.

(For example [0, 5, 10, 100] would make an object clickable at 0 seconds until 5 seconds, then off until 10seconds and on until 100 seconds. Use a large number to keep the object clickable until the end of the video.)

####display

Extra data can be assigned to the objects which you might want to use in the fallback functions. For example a ```display``` property is added to the object to be used as a display name when it is identified via the found function.





