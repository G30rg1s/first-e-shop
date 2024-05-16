import { Injectable } from '@angular/core';
import * as L from 'leaflet';

@Injectable({
  providedIn: 'root'
})
export class MapService {

  private map: L.Map;

  constructor() { }

  loadMap() {
    const map = L.map('map').setView([51.505, -0.09], 13);

    var customIcon = L.divIcon({
      className: 'leaflet-div-icon',
      html: '<i class="bi bi-geo-alt-fill"  style="font-size: 30px;"></i>',
      iconSize: [0, 0], 
      iconAnchor: [0, 0], 
      popupAnchor: [0, 0]
    });
     
  

L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(map);

L.marker([37.97583406077856, 23.732692889038436], {icon: customIcon}).addTo(map)
    .bindPopup('<div style="text-align: center;"><h4>Το κατάστημά μας</h4><br></div>')
    .openPopup();
}
 
}
