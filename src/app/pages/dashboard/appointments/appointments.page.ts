import { Component, OnInit, ViewChild } from '@angular/core';
import { IonInfiniteScroll, IonRouterOutlet, ModalController, ToastController } from '@ionic/angular';
import { Appointment } from 'src/app/models/appointment.models';
import { Constants } from 'src/app/models/contants.models';
import { ClientService } from 'src/app/services/client.service';
import { AppointmentDetailPage } from './appointment-detail/appointment-detail.page';

@Component({
  selector: 'app-appointments',
  templateUrl: './appointments.page.html',
  styleUrls: ['./appointments.page.scss'],
  providers: [ClientService]
})
export class AppointmentsPage implements OnInit {
  @ViewChild("IonInfiniteScroll", { read: IonInfiniteScroll, static: true }) infiniteScroll: IonInfiniteScroll;
  loading: boolean = false;
  pageNo: number = 1;
  upcoming: Array<Appointment> = [];
  complete: Array<Appointment> = [];

  constructor(
    public modalController: ModalController,
    private routerOutlet: IonRouterOutlet,
    private service: ClientService,
    private toastCtrl: ToastController
  ) { }

  ngOnInit() {
    this.loadPage(false);
  }

  loadPage(infinite: boolean) {
    if (!infinite) {
      this.loading = true;
      this.pageNo = 1;
      this.upcoming = new Array();
      this.complete = new Array();
      this.infiniteScroll.disabled = false;
    }

    this.service.appointments(window.localStorage.getItem(Constants.KEY_TOKEN), this.pageNo).subscribe((res: any) => {
      this.loading = false;

      res['data'].forEach(element => {
        if (element.type == 'online') {
          element.type = 'Online';
        } else if (element.type == 'escritorio') {
          element.type = 'No profissional';
        } else if (element.type == 'domiciliar') {
          element.type = 'Domiciliar';
        }
        if (element.status == 'complete') element.statusShow = 'Concluído';
        if (element.status == 'rejected') element.statusShow = 'Recusado';
        if (element.status == 'cancelled') element.statusShow = 'Cancelado';
        if (element.status == 'pending') element.statusShow = 'Solicitado';
        if (element.status == 'accepted') element.statusShow = 'Aceito';
        if (element.status == 'onway') element.statusShow = 'A caminho';
        if (element.status == 'ongoing') element.statusShow = 'Em andamento';
        element.time_from = element.time_from.substring(0, 5);

        let day = element.date.substring(8, 10);
        let month = element.date.substring(5, 7);
        let year = element.date.substring(0, 4);

        element.date = day + '/' + month + '/' + year;

        if (element.status == 'complete' || element.status == 'rejected' || element.status == 'cancelled') {
          this.complete.push(element);
        } else {
          this.upcoming.push(element);
        }
      });

      if (infinite) this.infiniteScroll.complete();

      if (res['data'].length == 0) {
        this.infiniteScroll.disabled = true;
      } else {
        this.pageNo++;
      }

    }, err => {
      console.log('appointments', err);
      this.loading = false;
      if (infinite) this.infiniteScroll.complete();
      this.showToast('Tente novamente mais tarde');
    });
  }

  //PULL TO REFRESH
  refresh(event) {
    this.loading = true;
    setTimeout(() => {
      this.loadPage(false);
      event.target.complete();
    }, 1500);
  }

  //SCROLL DOWN TO LOAD DATA
  doInfinite() {
    this.loadPage(true);
  }

  async details(item: any) {
    const modal = await this.modalController.create({
      component: AppointmentDetailPage,
      mode: 'ios',
      swipeToClose: true,
      presentingElement: this.routerOutlet.nativeEl,
      componentProps: {
        data: item
      }
    });

    modal.onDidDismiss()
      .then((data) => {
        if (data['data']) {
          this.loadPage(false);
        }
      });

    return await modal.present();
  }

  async showToast(msg: string) {
    const toast = await this.toastCtrl.create({
      message: msg,
      position: "middle",
      duration: 3000
    });
    toast.present();
  }

}
