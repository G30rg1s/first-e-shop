import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import * as L from 'leaflet';

const mapUrl = 'https://www.openstreetmap.org/#map=4/41.87/28.21' ;

@Injectable({
  providedIn: 'root'
})
export class MapService {

  http: HttpClient = inject(HttpClient);

  private map: any;

  initMap(mapElement: HTMLElement): void {
    // Initialize your map here
    // Example for Google Maps
    this.map = new google.maps.Map(mapElement, {
      center: { lat: -34.397, lng: 150.644 },
      zoom: 8
    });
  }

  triggerMapResize(): void {
    // Example for Google Maps
    if (this.map) {
      google.maps.event.trigger(this.map, 'resize');
      // Re-center the map if necessary
      const center = this.map.getCenter();
      if (center) {
        this.map.setCenter(center);
      }
    }
  }
}
