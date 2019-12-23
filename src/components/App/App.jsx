import React, { useReducer, useEffect, useState } from 'react';
import { LatLng, LatLngBounds } from 'leaflet';
import { Rnd } from 'react-rnd';
import ReactResizeDetector from 'react-resize-detector';
import { BrowserView, MobileOnlyView, MobileView, isMobile } from 'react-device-detect';
import { uuid } from 'uuidv4';

import USABMX from '../../services/USABMX';
import LoadingIndicator from '../LoadingIndicator';
import Navigation from '../Navigation';
import MobileNavigation from '../MobileNavigation';
import MapPanel from '../MapPanel';
import TrackInfo from '../TrackInfo';
import MobileTrackInfo from '../MobileTrackInfo';
import RaceList from '../RaceList';
import ZoomControl from '../ZoomControl';
import NearbyTrackList from '../NearbyTrackList';

import TrackCount from '../Widgets/TrackCount';
import EventCount from '../Widgets/EventCount';
import NationalCount from '../Widgets/NationalCount';
import DistrictCount from '../Widgets/DistrictCount';

import './App.css';

class App extends React.Component {
  static getSetting(key, defaultValue) {
    const stored = localStorage.getItem(key);
    return (stored !== undefined && stored !== null) ? stored : defaultValue;
  }

  static storeSetting(key, value) {
    localStorage.setItem(key, value);
  }

  static getArraySetting(key, defaultValue) {
    const stored = localStorage.getItem(key);
    return (stored !== undefined && stored !== null) ? JSON.parse(stored) : defaultValue;
  }

  static storeArraySetting(key, value) {
    localStorage.setItem(key, JSON.stringify(value));
  }

  constructor(props) {
    super(props);

    this.state = {
      width : isMobile ? innerWidth : (innerWidth - 77),
      height : isMobile ? (innerHeight - 77) : innerHeight,
      tracks : [],
      activeTrack : undefined,
      raceList : undefined,
      loaded : false,
      searchMode : 'location',
      widgets : ['NationalCount', 'TrackCount', 'EventCount', 'DistrictCount'],
      center : new LatLng(37.09024, -95.712891),
      nearbyTracks : [],
      runningInBackgound: false
    };

    const categoryFilterOptions = ['National', 'Gold Cup', 'State', 'Multi', 'Practice'];
    this.state.categoryFilterOptions = categoryFilterOptions;
    const defaultCategoryFilters = categoryFilterOptions.slice();
    defaultCategoryFilters.pop();
    this.state.categoryFilters = App.getArraySetting('categoryFilters', defaultCategoryFilters);

    const regionFilterOptions = ['North West', 'South West', 'North Central', 'South Central', 'North East', 'South East'];
    this.state.regionFilterOptions = regionFilterOptions;
    this.state.regionFilters = App.getArraySetting('regionFilters', regionFilterOptions.slice());

    if (window.cordova) {
      document.addEventListener("pause", () => {
        this.setState({ runningInBackgound : true })
      }, false);

      document.addEventListener("resume", () => {
        this.setState({ runningInBackgound : false })
      }, false);
    }
  }

  refreshData = () => {
    const { searchMode } = this.state;

    this.setState({ loaded : false, searchMode : 'loading' }, () => {
      USABMX.markDirty();

      USABMX.getTrackList().then((tracks) => {
        this.setState({ loaded : true, tracks : tracks, searchMode : searchMode });
      })
      .catch((err) => {
        console.error(err);
        this.setState({ loaded : true, searchMode : searchMode });
      })
    })
  }

  findNearbyTracks = () => {
    const { tracks, currentLocation, nearbyTracks, map, runningInBackgound } = this.state;
    map.setView(currentLocation, 10, { animate : true });
    const newNearbyTracks = tracks.filter((track) => track.position.distanceTo(currentLocation) <= 160934); // 100 miles

    newNearbyTracks.sort((a, b) => {
      const distanceA = a.position.distanceTo(currentLocation);
      const distanceB = b.position.distanceTo(currentLocation);

      if (distanceA < distanceB) {
        return -1
      }

      return 1;
    })

    function arraysEqual(_arr1, _arr2) {
      if (!Array.isArray(_arr1) || ! Array.isArray(_arr2) || _arr1.length !== _arr2.length) {
        return false;
      }

      var arr1 = _arr1.concat().sort();
      var arr2 = _arr2.concat().sort();

      for (var i = 0; i < arr1.length; i++) {
        if (arr1[i] !== arr2[i]) {
          return false;
        }
      }

      return true;
    }

    if (!arraysEqual(nearbyTracks, newNearbyTracks)) {
      const newTracks = newNearbyTracks.filter((track) => nearbyTracks.indexOf(track) < 0);

      if (runningInBackgound) {
        cordova.plugins.notification.local.schedule({
          title: 'Nearby BMX Tracks',
          text: `You are near ${newTracks.join(', ')}, check it out!`,
        });
      }

      map.fitBounds(new LatLngBounds(newNearbyTracks.map(track => track.position)));
      this.setState({ nearbyTracks : newNearbyTracks });
    }
  }

  startTrackingLocation = () => {
    navigator.geolocation.getCurrentPosition((position) => {
      this.setState({ currentLocation : new LatLng(position.coords.latitude, position.coords.longitude) }, () => {
        const { searchMode } = this.state;

        if (searchMode === 'trackLocator') {
          this.findNearbyTracks();

          BackgroundGeolocation.configure({
            locationProvider: BackgroundGeolocation.DISTANCE_FILTER_PROVIDER,
            desiredAccuracy: BackgroundGeolocation.HIGH_ACCURACY,
            stationaryRadius: 50,
            distanceFilter: 50,
            notificationTitle: 'Searching for Tracks',
            notificationText: 'enabled',
            debug: false,
            interval: 10000,
            fastestInterval: 5000,
            activitiesInterval: 10000
          });

          BackgroundGeolocation.on('location', (location) => {
            this.setState({ currentLocation : new LatLng(location.latitude, location.longitude) }, () => {
              BackgroundGeolocation.startTask((taskKey) => {
                this.findNearbyTracks();
                BackgroundGeolocation.endTask(taskKey);
              });
            })
          });

          BackgroundGeolocation.on('error', (error) => {
            console.error('[ERROR] BackgroundGeolocation error:', error.code, error.message);
          });

          BackgroundGeolocation.on('start', () => {
            console.log('[INFO] BackgroundGeolocation service has been started');
          });

          BackgroundGeolocation.on('stop', () => {
            console.log('[INFO] BackgroundGeolocation service has been stopped');
          });

          BackgroundGeolocation.on('authorization', (status) => {
            console.log('[INFO] BackgroundGeolocation authorization status: ' + status);

            if (status !== BackgroundGeolocation.AUTHORIZED) {
              // we need to set delay or otherwise alert may not be shown
              setTimeout(() => {
                var showSettings = confirm('Race Day needs your permission to track your location so that it can find tracks in your area. Would you like to open app settings?');

                if (showSettings) {
                  return BackgroundGeolocation.showAppSettings();
                }
              }, 1000);
            }
          });

          BackgroundGeolocation.on('background', () => {
            console.log('[INFO] App is in background');
            this.setState({ runningInBackgound : true })
          });

          BackgroundGeolocation.on('foreground', () => {
            console.log('[INFO] App is in foreground');
            this.setState({ runningInBackgound : false })
          });

          BackgroundGeolocation.checkStatus((status) => {
            console.log('[INFO] BackgroundGeolocation service is running', status.isRunning);
            console.log('[INFO] BackgroundGeolocation services enabled', status.locationServicesEnabled);
            console.log('[INFO] BackgroundGeolocation auth status: ' + status.authorization);

            if (!status.isRunning) {
              BackgroundGeolocation.start();
            }
          });
        }
      })
    })
  }

  stopTrackingLocation = () => {
    BackgroundGeolocation.checkStatus((status) => {
      console.log('[INFO] BackgroundGeolocation service is running', status.isRunning);
      console.log('[INFO] BackgroundGeolocation services enabled', status.locationServicesEnabled);
      console.log('[INFO] BackgroundGeolocation auth status: ' + status.authorization);

      if (status.isRunning) {
        BackgroundGeolocation.stop();
      }
    });
  }

  onResize = (width, height) => {
    this.setState({ width, height });
  }

  componentDidMount() {
    window.addEventListener('orientationchange', this.onOrientationChange);
  }

  componentWillUnmount() {
    window.removeEventListener('orientationchange', this.onOrientationChange);
  }

  onOrientationChange = (e) => {
    this.setState({ width : innerWidth, height : innerHeight })
  }

  closeRaceList = () => {
    this.setState({ raceList : undefined })
  }

  setSearchMode = (mode) => {
    this.setState({ searchMode : mode })
  }

  setActiveTrack = (track) => {
    const { searchMode } = this.state;
    const nextState = { activeTrack : track };

    if (searchMode === 'trackLocator') {
      nextState.searchMode = 'track';
    }

    this.setState(nextState, () => {
      if (searchMode !== 'track') {
        return;
      }

      if (!track) {
        return this.setState({ raceList : undefined });
      }

      this.searchByTrack(track);
    });
  }

  showTrackWithName = (trackname) => {
    const { tracks } = this.state;
    const track = tracks.find((t) => t.name === trackname);
    this.setState({ activeTrack : track });
  }

  mapReady = (map) => {
    this.setState({ map : map.contextValue.map, currentZoom : map.contextValue.map.getZoom(), minZoom : map.contextValue.map.getMinZoom(), maxZoom : map.contextValue.map.getMaxZoom() }, () => {
      USABMX.getTrackList().then((tracks) => {
        this.setState({ tracks : tracks, bounds : new LatLngBounds(tracks.map(track => track.position)) }, () => {
          const { searchMode, map, bounds } = this.state;
          map.invalidateSize();
          map.fitBounds(bounds);

          if (searchMode === 'currentLocation') {
            this.searchByCurrentLocation();
          } else if (searchMode === 'location') {
            this.searchByLocation(map.getBounds());
          }
        });
      })
    });
  }

  onViewportChanged = (e, map) => {
    const { tracks, searchMode } = this.state;

    if (map && (searchMode === 'location' || searchMode === 'currentLocation')) {
      if (map) {
        this.setState({ currentZoom : map.contextValue.map.getZoom(), minZoom : map.contextValue.map.getMinZoom(), maxZoom : map.contextValue.map.getMaxZoom() }, () => {
          this.searchByLocation(map.contextValue.map.getBounds());
        })
      } else {
        this.searchByLocation(map.contextValue.map.getBounds());
      }
    }
  }

  searchByCurrentLocation = () => {
    navigator.geolocation.getCurrentPosition((position) => {
      const { map, searchMode } = this.state;

      if (searchMode !== 'currentLocation') {
        return;
      }

      map.setView(new LatLng(position.coords.latitude, position.coords.longitude), isMobile ? 8 : 10, { animate : true });
      this.searchByLocation(map.getBounds());
    })
  }

  searchByLocation = (bounds) => {
    const { tracks } = this.state;
    const trackNames = tracks.filter((track) => bounds.contains(track.position)).map((track) => track.name);

    USABMX.getRacesByTracks(trackNames).then((raceList) => {
      this.setState({ raceList : this.filterResults(raceList), loaded : true });
    })
  }

  searchByTrack = (track) => {
    USABMX.getRacesByTrack(track).then((raceList) => {
      this.setState({ raceList : this.filterResults(raceList) });
    })
  }

  filterResults = (results) => {
    const { categoryFilters, regionFilters } = this.state;

    return results.filter((race) => {
      const category = race.category;

      if (category === 'Gold Cup') {
        return categoryFilters.indexOf(category) >= 0 && regionFilters.indexOf(race.region) >= 0;
      }

      return categoryFilters.indexOf(category) >= 0;
    });
  }

  toggleCategoryFilter = (filter) => {
    const { categoryFilters } = this.state;
    const idx = categoryFilters.indexOf(filter);

    if (idx >= 0) {
      var newFilters = categoryFilters.slice();
      newFilters.splice(idx, 1);

      this.setState({ categoryFilters : newFilters });
    } else {
      this.setState({ categoryFilters : categoryFilters.concat(filter) });
    }
  }

  toggleRegionFilter = (filter) => {
    const { regionFilters } = this.state;
    const idx = regionFilters.indexOf(filter);

    if (idx >= 0) {
      var newFilters = regionFilters.slice();
      newFilters.splice(idx, 1);

      this.setState({ regionFilters : newFilters });
    } else {
      this.setState({ regionFilters : regionFilters.concat(filter) });
    }
  }

  componentDidUpdate(prevProps, prevState) {
    const { tracks, searchMode, map, bounds, loaded, activeTrack, categoryFilters, regionFilters } = this.state;

    if (!loaded) {
      return;
    }

    if (prevState.searchMode !== searchMode) {
      App.storeSetting('searchMode', searchMode);
    }

    if (prevState.searchMode === 'trackLocator' && prevState.searchMode !== searchMode) {
      this.stopTrackingLocation();
    }

    if (searchMode === 'trackLocator' && prevState.searchMode !== searchMode) {
      this.startTrackingLocation();
    } else if (searchMode === 'location' && prevState.searchMode !== searchMode) {
      map.fitBounds(bounds, { animate : true });

      this.setState({ activeTrack : undefined }, () => {
        this.searchByLocation(map.getBounds());
      })
    } else if (searchMode === 'currentLocation' && prevState.searchMode !== searchMode) {
      this.setState({ activeTrack : undefined }, () => {
        this.searchByCurrentLocation();
      })
    } else if (searchMode === 'track' && prevState.searchMode !== searchMode) {
      if (!activeTrack) {
        const bounds = map.getBounds();
        const track = tracks.find((track) => bounds.contains(track.position));

        if (track) {
          map.setView(track.position, 10, { animate : true });

          this.setState({ activeTrack : track }, () => {
            this.searchByTrack(track);
          })
        } else {
          this.setState({ raceList : undefined });
        }
      } else {
        this.searchByTrack(activeTrack);
      }
    } else if (categoryFilters !== prevState.categoryFilters || regionFilters !== prevState.regionFilters) {
      App.storeArraySetting('categoryFilters', categoryFilters.slice());
      App.storeArraySetting('regionFilters', regionFilters.slice());

      if (searchMode === 'location' || searchMode === 'currentLocation') {
        this.searchByLocation(map.getBounds());
      } else if (searchMode === 'track' && activeTrack) {
        this.searchByTrack(activeTrack);
      }
    }
  }

  // <NationalCount widgets={this.state.widgets} />
  // <TrackCount widgets={this.state.widgets} />
  // <EventCount widgets={this.state.widgets} />
  // <DistrictCount widgets={this.state.widgets} />

  render() {
    return (
      <div className="app">
        <BrowserView style={{ width: '100%', height : '100%', overflow : 'hidden', display : 'flex', flexDirection : 'row' }}>
          <Navigation app={this} height={this.state.height} searchMode={this.state.searchMode} />
          <ReactResizeDetector handleWidth handleHeight onResize={this.onResize} className="main-panel">
            <MapPanel app={this} tracks={this.state.tracks} activeTrack={this.state.activeTrack} width={this.state.width} height={this.state.height} center={this.state.center} key="map-panel" />
            <TrackInfo app={this} track={this.state.activeTrack} key="track-info" />
            <RaceList app={this} tracks={this.state.tracks} raceList={this.state.raceList} categoryFilterOptions={this.state.categoryFilterOptions} categoryFilters={this.state.categoryFilters} regionFilterOptions={this.state.regionFilterOptions} regionFilters={this.state.regionFilters} key="race-list" />
            <LoadingIndicator className={`${this.state.loaded ? 'hide' : 'show'}`} key="loading-indicator" />
            {this.state.loaded && <ZoomControl map={this.state.map} minZoom={this.state.minZoom} maxZoom={this.state.maxZoom} currentZoom={this.state.currentZoom} key="zoom-control" />}
          </ReactResizeDetector>
        </BrowserView>
        <MobileView style={{ width: '100%', height : '100%', overflow : 'hidden', display : 'flex', flexDirection : 'column' }}>
          <MapPanel app={this} tracks={this.state.tracks} activeTrack={this.state.activeTrack} width={this.state.width} height={this.state.height} center={this.state.center} key="map-panel" />
          <RaceList
            app={this}
            searchMode={this.state.searchMode}
            tracks={this.state.tracks}
            activeTrack={this.state.activeTrack}
            raceList={this.state.raceList}
            categoryFilterOptions={this.state.categoryFilterOptions}
            categoryFilters={this.state.categoryFilters}
            regionFilterOptions={this.state.regionFilterOptions}
            regionFilters={this.state.regionFilters}
            key="race-list" />
          <NearbyTrackList
            app={this}
            searchMode={this.state.searchMode}
            nearbyTracks={this.state.nearbyTracks}
            currentLocation={this.state.currentLocation}
          />
          <MobileTrackInfo app={this} searchMode={this.state.searchMode} track={this.state.activeTrack} key="track-info" />
          <LoadingIndicator className={`${this.state.loaded ? 'hide' : 'show'}`} key="loading-indicator" />
          <MobileNavigation app={this} width={this.state.height} searchMode={this.state.searchMode} />
        </MobileView>
      </div>
    )
  }
}

export default App;
