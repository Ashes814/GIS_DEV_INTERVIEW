import React, { useEffect, useRef } from "react";
import "ol/ol.css";
import { Map, View } from "ol";
import TileLayer from "ol/layer/Tile";
import OSM from "ol/source/OSM";
import GeoJSON from "ol/format/GeoJSON";
import VectorLayer from "ol/layer/Vector";
import VectorSource from "ol/source/Vector";
import "./MapStyle.css";

function MapContainer() {
  const mapRef = useRef(null);

  useEffect(() => {
    const map = new Map({
      target: mapRef.current,
      view: new View({
        center: [0, 0],
        zoom: 2,
      }),
    });

    const tileLayer = new TileLayer({
      source: new OSM(),
    });
    map.addLayer(tileLayer);

    const url =
      "http://localhost:8080/geoserver/sh/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=sh%3AshSubway&outputFormat=application%2Fjson";

    fetch(url)
      .then((response) => response.json())
      .then((geojsonObject) => {
        const vectorSource = new VectorSource({
          features: new GeoJSON().readFeatures(geojsonObject),
        });

        const vectorLayer = new VectorLayer({
          source: vectorSource,
        });

        map.addLayer(vectorLayer);
      })
      .catch((error) => {
        console.error("Error loading GeoJSON:", error);
      });

    return () => {
      map.setTarget(null);
    };
  }, []);

  return <div ref={mapRef} className="map-container"></div>;
}

export default MapContainer;
