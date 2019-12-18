import React, { useContext } from 'react';
import ReactDOMServer from 'react-dom/server';
import { LatLng } from 'leaflet';
import { Map, GeoJSON, Popup, TileLayer, Marker, Polyline, LayerGroup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import './MapPanel.css'

class TrackIcon extends React.PureComponent {
  render() {
    const { active, track, map } = this.props;

    return (
      <svg width="25px" height="25px" viewBox="0 0 42 42" className={`track-icon-svg ${active ? 'active' : 'inactive'}`}>
        <circle className="hole" cx="21" cy="21" r="16" fill={`${active ? 'rgba(72, 87, 94, .9)' : 'rgba(72, 87, 94, .7)'}`}></circle>
        <circle className="ring" cx="21" cy="21" r="16" fill="transparent" stroke={`${active ? 'rgba(101, 219, 146, .9)' : 'rgba(132, 137, 154, .8)'}`} strokeWidth="5"></circle>
      </svg>
    );
  }
}

class MapPanel extends React.PureComponent {
  constructor(props) {
    super(props)
    this.mapRef = React.createRef();
  }

  render() {
    const { app, tracks, activeTrack, center, width, height } = this.props;

    return (
      <Map
        className="track-map"
        ref={this.mapRef}
        center={center}
        zoom={14}
        maxZoom={16}
        attributionControl={false}
        zoomControl={false}
        doubleClickZoom={true}
        scrollWheelZoom={true}
        dragging={true}
        animate={true}
        easeLinearity={0.35}
        onViewportChanged={(e) => app.onViewportChanged(e, this.mapRef.current)}
        whenReady={(e) => app.mapReady(this.mapRef.current)}
        onDblClick={this.mapDoubleClicked}
        style={{ width : `${width}px`, height : `${height}px`, borderRadius : '10px', margin : '0 auto', overflow : 'hidden' }}
      >
        <TileLayer url={'https://{s}.tile.osm.org/{z}/{x}/{y}.png'} />
        {tracks.map((track) => {
          const icon = L.divIcon({
            className: `track-icon`,
            html: ReactDOMServer.renderToString(<TrackIcon track={track} active={activeTrack === track} />)
          });

          return (
            <LayerGroup key={track.id}>
              <Marker position={track.position} icon={icon} key={`${track.id}-marker`} onClick={(e) => { app.setActiveTrack(track) }} />
            </LayerGroup>
          )
        })}
      </Map>
  	);
  }
}

export default MapPanel;
