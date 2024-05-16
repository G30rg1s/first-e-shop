import { Component, OnInit } from '@angular/core';
import { MapService } from 'src/app/shared/services/map.service';


@Component({
  selector: 'app-contact-shop',
  templateUrl: './contact-shop.component.html',
  styleUrls: ['./contact-shop.component.css']
})
export class ContactShopComponent implements OnInit {

  constructor(private mapService: MapService) { }

  ngOnInit(): void {
    this.mapService.loadMap();
    //this.mapService.L.marker(37.97583406077856, 23.732692889038436);
  }

}