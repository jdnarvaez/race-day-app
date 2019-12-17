# race-day-app
[Location Based USA BMX Race Planner](http://jdnarvaez.github.io/race-day-app/)

![demo](https://raw.githubusercontent.com/jdnarvaez/race-day-app/master/docs/images/demo.gif)

# Using

You can filter races by location, current location, or by track. 

Location/current location work the same, only that when you select the current location option the browser attempts to locate you and then set the map view in your current area. As you pan/zoom the map, the event list will update accordingly. 

If you choose to filter via track, then when you click on a track icon, the events for that particular venue will be displayed.

Events can be filtered by **category** and **region** (only for Gold Cup events). By default, practice events are not included as there are **a ton of them**. 

If you have questions or suggestions, please feel free to reach out or file an issue. I work on this and other BMX related projects in my spare time, so if you find yourself using the app a lot and want to help me out, feel free to send a [donation](https://paypal.me/jdnarvaez) :) 

# Contributing

Checkout the project and build/run it, then submit a PR

```
git clone https://github.com/jdnarvaez/race-day-app.git
cd race-day-app
npm install && npm run start
```

then open your browser to http://localhost:8080/race-day-app
