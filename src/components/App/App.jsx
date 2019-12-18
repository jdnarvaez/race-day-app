import React, { useReducer, useEffect, useState } from 'react';
import { LatLng, LatLngBounds } from 'leaflet';
import { Rnd } from 'react-rnd';
import ReactResizeDetector from 'react-resize-detector';
import { BrowserView, MobileOnlyView, isMobileOnly } from 'react-device-detect';

import USABMX from '../../services/USABMX';
import LoadingIndicator from '../LoadingIndicator';
import Navigation from '../Navigation';
import MobileNavigation from '../MobileNavigation';
import MapPanel from '../MapPanel';
import TrackInfo from '../TrackInfo';
import MobileTrackInfo from '../MobileTrackInfo';
import RaceList from '../RaceList';
import ZoomControl from '../ZoomControl';

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
      width : isMobileOnly ? innerWidth : (innerWidth - 77),
      height : isMobileOnly ? (innerHeight - 77) : innerHeight,
      tracks : [],
      activeTrack : undefined,
      raceList : undefined,
      loaded : false,
      searchMode : 'location',
      widgets : ['NationalCount', 'TrackCount', 'EventCount', 'DistrictCount'],
      center : new LatLng(37.09024, -95.712891)
    };

    const categoryFilterOptions = ['National', 'Gold Cup', 'State', 'Multi', 'Practice'];
    this.state.categoryFilterOptions = categoryFilterOptions;
    const defaultCategoryFilters = categoryFilterOptions.slice();
    defaultCategoryFilters.pop();
    this.state.categoryFilters = App.getArraySetting('categoryFilters', defaultCategoryFilters);

    const regionFilterOptions = ['North West', 'South West', 'North Central', 'South Central', 'North East', 'South East'];
    this.state.regionFilterOptions = regionFilterOptions;
    this.state.regionFilters = App.getArraySetting('regionFilters', regionFilterOptions.slice());
  }

  onResize = (width, height) => {
    this.setState({ width, height });
  }

  closeRaceList = () => {
    this.setState({ raceList : undefined })
  }

  setSearchMode = (mode) => {
    this.setState({ searchMode : mode })
  }

  setActiveTrack = (track) => {
    const { searchMode } = this.state;

    this.setState({ activeTrack : track }, () => {
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
      const { map } = this.state;
      map.setView(new LatLng(position.coords.latitude, position.coords.longitude), isMobileOnly ? 8 : 10, { animate : true });
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

    if (searchMode === 'location' && prevState.searchMode !== searchMode) {
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
        <MobileOnlyView style={{ width: '100%', height : '100%', overflow : 'hidden', display : 'flex', flexDirection : 'column' }}>
          <MapPanel app={this} tracks={this.state.tracks} activeTrack={this.state.activeTrack} width={this.state.width} height={this.state.height} center={this.state.center} key="map-panel" />
          <RaceList
            app={this}
            tracks={this.state.tracks}
            activeTrack={this.state.activeTrack}
            raceList={this.state.raceList}
            categoryFilterOptions={this.state.categoryFilterOptions}
            categoryFilters={this.state.categoryFilters}
            regionFilterOptions={this.state.regionFilterOptions}
            regionFilters={this.state.regionFilters}
            key="race-list" />
          <MobileTrackInfo app={this} track={this.state.activeTrack} key="track-info" />
          <LoadingIndicator className={`${this.state.loaded ? 'hide' : 'show'}`} key="loading-indicator" />
          <MobileNavigation app={this} width={this.state.height} searchMode={this.state.searchMode} />
        </MobileOnlyView>
      </div>
    )
  }
}


export default App;
