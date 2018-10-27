# rx-dual-slider
> react dual slider

[Example](http://sj5000-rx-dual-slider.s3-website-us-west-2.amazonaws.com/)

## Usage 

```js
<div>
          <DualSlider
            min={0}
            max={100}
            values={[5, 15]}
            onChange={(values) => { console.log(values) }}
            trackRangeColor='#39ff14'
            quickLinks={[{name: 'foo', values: [1, 19]}, {name: 'bar', values: [81, 99]}]}
          />
 </div>
```

## Options

* `min`             minimum value for the slider (defaults to 0)
* `max`             maximum value for the slider (defaults to 100) 
* `values`          array of initial values (defaults to [0,100])
* `onChange`        event handler for slider changes
* `trackRangeColor` color for range track
* `quickLinks`      array of links that will move sliders into the passed-in positions when clicked. 


## Additional Features

* Clickable track.  Clicking on the track will move the closest handle to the clicked location.
