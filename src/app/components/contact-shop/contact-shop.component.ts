import { AfterViewInit, Component, ElementRef, OnInit, ViewChild, inject } from '@angular/core';
import { MapService } from 'src/app/shared/services/map.service';

@Component({
  selector: 'app-contact-shop',
  templateUrl: './contact-shop.component.html',
  styleUrls: ['./contact-shop.component.css']
})
export class ContactShopComponent  implements AfterViewInit {

  //mapService = inject(MapService);
  
  @ViewChild('map') mapElement!: ElementRef;

  constructor(private mapService: MapService) { }

  

  ngAfterViewInit(): void {
    if (this.mapElement) {
      this.mapService.initMap(this.mapElement.nativeElement);
      // Assuming mapService has a method to trigger map resize
      setTimeout(() => {
        this.mapService.triggerMapResize();
      }, 100);
    } else {
      console.error('Map element not found');
    }
  }
}