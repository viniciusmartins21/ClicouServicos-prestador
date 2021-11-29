import { Component, OnInit } from '@angular/core';
import { NavController, LoadingController, ToastController } from '@ionic/angular';
import { Constants } from 'src/app/models/contants.models';
import { Profile } from 'src/app/models/profile.models';
import { ClientService } from 'src/app/services/client.service';

@Component({
  selector: 'app-add-address',
  templateUrl: './add-address.page.html',
  styleUrls: ['./add-address.page.scss'],
  providers: [ClientService]
})
export class AddAddressPage implements OnInit {
  loading: boolean = false;
  cepAccepted: boolean = false;
  profile: Profile;
  cep: string = '';
  street: string = '';
  number: string = '';
  district: string = '';
  city: string = '';

  constructor(
    private navCtrl: NavController,
    private service: ClientService,
    private loadingCtrl: LoadingController,
    private toastCtrl: ToastController
  ) { }

  ngOnInit() {
    this.profile = JSON.parse(window.localStorage.getItem(Constants.KEY_PROFILE));
  }

  getAddress() {
    let valor = this.cep;
    let cep = valor.replace(/\D/g, '');
    if (cep.length == 8) {

      let validacep = /^[0-9]{8}$/;
      if (validacep.test(cep) && this.cepAccepted == false) {

        this.loading = true;
        this.service.verifyCEP(cep).subscribe((res) => {
          console.log(res);

          if (res['erro']) {
            this.cepAccepted = false;
            this.loading = false;

            this.street = '';
            this.district = '';
            this.city = '';

            this.showToast('CEP não encontrado');

          } else {
            this.cepAccepted = true;
            this.loading = false;

            this.street = res['logradouro'];
            this.district = res['bairro'];
            this.city = res['localidade'] + ' - ' + res['uf'];
          }
        }, err => {
          console.log(err);
          this.loading = false;
          this.showToast('Tente novamente mais tarde');
        });

      } else {
        this.cep = '';
        this.street = '';
        this.district = '';
        this.city = '';
        this.cepAccepted = false;
      }
    } else {
      this.street = '';
      this.district = '';
      this.city = '';
      this.cepAccepted = false;
    }
  }

  async save() {
    if (this.cep.length > 0 && this.cepAccepted) {
      if (this.number) {
        const loading = await this.loadingCtrl.create({
          message: 'Aguarde...',
        });

        await loading.present();
        this.loading = true;

        let fullAddress = this.street + ', ' + this.number + ' - ' + this.district + ', ' + this.city + ', ' + this.cep + ', Brasil';
        this.service.saveAddress(window.localStorage.getItem(Constants.KEY_TOKEN), fullAddress).subscribe(res => {
          this.loading = false;
          loading.dismiss();

          if (res['message']) {
            this.profile.address = fullAddress;
            window.localStorage.setItem(Constants.KEY_PROFILE, JSON.stringify(this.profile))

            this.showToast('Endereço alterado');
            this.navCtrl.back();

          } else {
            this.showToast('Algo não deu certo');
          }
        }, err => {
          console.log(err);
          this.loading = false;
          loading.dismiss();
          this.showToast('Tente novamente mais tarde');
        });
      } else {
        this.showToast('Você precisa adicionar um número');
      }
    } else {
      this.showToast('Você precisa adicionar um cep válido');
    }

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
