import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';
import { APP_CONFIG, BaseAppConfig } from 'src/app/app.config';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';

import { HttpClient, HttpClientModule } from '@angular/common/http';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { Camera } from '@ionic-native/camera/ngx';
import { LoginGuard } from './services/guard/login-guard.service';

import { OneSignal } from '@ionic-native/onesignal/ngx';
import { BackgroundMode } from '@ionic-native/background-mode/ngx';
import { Geolocation } from '@ionic-native/geolocation/ngx';
import { ClientService } from './services/client.service';

import { AppointmentDetailPage } from './pages/dashboard/appointments/appointment-detail/appointment-detail.page';
import { NewSchedulePage } from './pages/dashboard/account/my-profile/add-scheduling/new-schedule/new-schedule.page';
import { FormsModule } from '@angular/forms';
import { Clipboard } from '@ionic-native/clipboard/ngx';

@NgModule({
  declarations: [
    AppComponent,
    [
      AppointmentDetailPage,
      NewSchedulePage
    ],
  ],
  entryComponents: [
    AppointmentDetailPage,
    NewSchedulePage
  ],
  imports: [
    BrowserModule,
    IonicModule.forRoot(),
    AppRoutingModule,
    HttpClientModule,
    FormsModule
  ],
  providers: [
    LoginGuard,
    ClientService,
    StatusBar,
    SplashScreen,
    Camera,
    OneSignal,
    BackgroundMode,
    Geolocation,
    Clipboard,
    { provide: APP_CONFIG, useValue: BaseAppConfig },
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
