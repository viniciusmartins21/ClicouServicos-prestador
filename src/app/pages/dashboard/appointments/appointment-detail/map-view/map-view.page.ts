/* eslint-disable @typescript-eslint/naming-convention */
/* eslint-disable @typescript-eslint/no-inferrable-types */
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Platform } from '@ionic/angular';
import { Constants } from 'src/app/models/contants.models';
import { ClientService } from 'src/app/services/client.service';

declare let google;

@Component({
  selector: 'app-map-view',
  templateUrl: './map-view.page.html',
  styleUrls: ['./map-view.page.scss'],
})
export class MapViewPage implements OnInit {
  @ViewChild('map', { read: ElementRef, static: false }) mapElement: ElementRef;
  loading: boolean = false;
  map: any;
  currentTrackMap = null;
  trackedRoutes = [];

  id: number;
  latitude: number;
  longitude: number;
  category: string = '';
  name: string = '';
  image_url: string;

  constructor(
    private platform: Platform,
    private activatedRoute: ActivatedRoute,
    private service: ClientService
  ) {
    this.activatedRoute.queryParams.subscribe(params => {
      this.id = params.id;
      this.latitude = params.latitude;
      this.longitude = params.longitude;
      this.category = params.category;
      this.name = params.name;
      this.image_url = params.image_url;
      this.loadPage();
    });
  }

  ngOnInit() {
  }

  loadPage() {
    this.loading = true;
    this.service.getProviderCoords(window.localStorage.getItem(Constants.KEY_TOKEN), this.id).subscribe((res: any) => {
      console.log(res);
      this.loading = false;
      this.startTracking(Number(res.latitude), Number(res.longitude));

    }, err => {
      console.log(err);
      this.loading = false;
    });
  }

  startTracking(latitude: number, longitude: number) {
    this.platform.ready().then(() => {
      const mapOptions = {
        zoom: 15,
        mapTypeControl: false,
        streetViewControl: false,
        fullScreenControl: false
      };

      this.map = new google.maps.Map(this.mapElement.nativeElement, mapOptions);

      const latLng = new google.maps.LatLng(latitude, longitude);
      this.map.setCenter(latLng);

      const marker = new google.maps.Marker({
        position: latLng,
        map: this.map,
        title: 'Minha posição',
        animation: google.maps.Animation.DROP,
      });

      this.trackedRoutes = [];
      this.trackedRoutes = [
        { lat: latitude, lng: longitude },
        { lat: Number(this.latitude), lng: Number(this.longitude) }
      ];
      this.redrawPath(this.trackedRoutes);
    });
  }

  redrawPath(path) {
    if (this.currentTrackMap) {
      this.currentTrackMap = null;

    } else {
      this.currentTrackMap = new google.maps.Polyline({
        path,
        geodesic: true,
        strokeColor: 'black',
        strokeOpacity: 1.0,
        strokeWeight: 3
      });

      this.currentTrackMap.setMap(this.map);
    }
  }

}
