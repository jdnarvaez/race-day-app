# Race Day BMX
Available on the [Apple App Store](https://apps.apple.com/us/app/race-day-bmx/id1492349004) and on [Google Play](https://play.google.com/store/apps/details?id=com.elevate.raceday) 

[Location Based USA BMX Race Planner Web App Version](http://jdnarvaez.github.io/race-day-app/)

Supports both mobile and desktop browsers. OSX Safari may experience map issues.

![mobile demo](https://raw.githubusercontent.com/jdnarvaez/race-day-app/master/docs/images/mobile_demo.gif)

![demo](https://raw.githubusercontent.com/jdnarvaez/race-day-app/master/docs/images/demo.gif)

# Log Book Explanation

This tab allows you log your practice sessions or races, in as little or much detail as you would like. 

You start by selecting the Logbook tab in the app, then click the + button to start a new entry. It will first ask you to select a track location, but this is not required. At any point you can click the left < or right > arrows to go forward and backward through the screens to skip or change parts of the entry. 

After you have selected a track (which it currently finds tracks within 100 miles of your current location, I already have had a request to show all tracks so I will be adding in a toggle to select nearby or all), you can select an event. If no events are found for today's entry, you'll see an empty list. You can click that 'no events found' button to continue on, or use the right arrow to continue. 

Next, it will ask what kind of event it is (practice, local, state, national, etc), and next it will ask the point multiplier for that event. Practice events automatically select 'no points.' 

Next is the rider selection for the first entry. If you have not entered a rider before, you can select the 'enter a new riders name here' button and type one in, or you can tap the barcode button and scan a USABMX membership card so that it automatically enters the information for you. After that, you can select the class for that rider. This section is automatically skipped for 'practice' entries. 

If you click the + button next to the rider's name/total riders entry, you can add another class for that rider or another rider entirely. This allows you to track open/class/cruiser for a single rider in an entry, or track multiple riders and their classes in a single entry. If you slide left over that header, a delete button will appear and allow you to delete riders from the entry. Once all riders are removed, the entire entry will be deleted.

You can enter in other details about the event, such as the entry fee, the total number of motos for the event, the total riders for each rider's class. Each Rider Entry has a Moto details panel, where the top row is the Moto # and the second row is where the rider finished in that particular Moto. Once a main Moto number and place has been entered, a selector will show up to allow you to track what award that rider selected for that race. 

You can write general notes about the rider for that class and attach photos, but you can also add specific details about each Moto by tapping on the Moto title (M1, M2, Main, etc. When you enter into a specific Moto's detail panel, you can add information such as lane number, finish position, the number of riders in that Moto, the number of transfer spots available, notes specifically about that Moto as well as photos specific to that Moto (such as a photo of the Moto sheet). 
If you want to change the details of any part you walked through previously (location, date, type of race, point multiplier), tap on that detail in the header and the walkthrough will open back up or it will show a date selector accordingly. 
If there are other features anyone would find useful or if you have additional questions, feel free to ask. Thanks!

# Using

**Note**: This uses the open source OSM Tile Server, and as a result, map loading might be slow. 

You can filter races by location, current location, or by track. 

Location/current location work the same, only that when you select the current location option the browser attempts to locate you and then set the map view in your current area. As you pan/zoom the map, the event list will update accordingly. 

If you choose to filter via track, then when you click on a track icon, the events for that particular venue will be displayed.

Events can be filtered by **category** and **region** (only for Gold Cup events). By default, practice events are not included as there are **a ton of them**. 

![race-info](https://raw.githubusercontent.com/jdnarvaez/race-day-app/master/docs/images/race-info.png)

clicking on the **calendar** icon in the lower right of a race info display will create a calendar event, and clicking on the **track name** will open the **track info** display;

![track-info](https://raw.githubusercontent.com/jdnarvaez/race-day-app/master/docs/images/track-info.png)

clicking on the track info **email** will open a new email to the operator, and clicking on the track's **url** will open their site in a new tab.

If you have questions or suggestions, please feel free to reach out or file an issue. I work on this and other BMX related projects in my spare time, so if you find yourself using the app a lot and want to help me out, feel free to send a [donation](https://paypal.me/jdnarvaez) :) 

# Contributing

Checkout the project and build/run it, then submit a PR

```
git clone https://github.com/jdnarvaez/race-day-app.git
cd race-day-app
npm install && npm run start
```

then open your browser to http://localhost:8080/race-day-app
