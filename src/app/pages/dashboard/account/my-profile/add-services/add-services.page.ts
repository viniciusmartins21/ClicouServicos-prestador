import { Component, OnInit } from '@angular/core';
import { NavController, LoadingController, ToastController } from '@ionic/angular';
import { Category } from 'src/app/models/category.models';
import { Constants } from 'src/app/models/contants.models';
import { Profile } from 'src/app/models/profile.models';
import { ClientService } from 'src/app/services/client.service';

@Component({
  selector: 'app-add-services',
  templateUrl: './add-services.page.html',
  styleUrls: ['./add-services.page.scss'],
  providers: [ClientService]
})
export class AddServicesPage implements OnInit {
  loading: boolean = false;
  profile: Profile;
  subcategories: Array<Category> = [];
  tempSubcategories: Array<Category> = [];
  selectedSubcategories: Array<Category> = [];
  term: string = '';

  constructor(
    private navCtrl: NavController,
    private service: ClientService,
    private loadingCtrl: LoadingController,
    private toastCtrl: ToastController
  ) { }

  ngOnInit() {
    this.profile = JSON.parse(window.localStorage.getItem(Constants.KEY_PROFILE));
    this.loadPage();
  }

  loadPage() {
    this.loading = true;

    this.service.getServices(window.localStorage.getItem(Constants.KEY_TOKEN), this.profile.primary_category_id).subscribe(res => {
      this.loading = false;

      res.forEach(element => {
        this.subcategories.push(element);
        this.tempSubcategories.push(element);
      });

    }, err => {
      console.log('Fail', err);
      this.loading = false;
      this.showToast('Falha ao carregar serviços');
    });
  }

  async search(evt) {
    this.subcategories = this.tempSubcategories;
    let searchTerm = evt.srcElement.value;

    if (!searchTerm) {
      this.subcategories = this.tempSubcategories;
      return;

    } else {
      this.subcategories = this.subcategories.filter(data => {
        if (data['title'] && searchTerm) {
          return (data['title'].toLowerCase().indexOf(searchTerm.toLowerCase()) > -1);
        }
      })
    }
  }

  change(id: number, checked: boolean) {
    let newSubcategory = [];

    this.subcategories.filter((data) => {
      if (data.id != id) {
        newSubcategory.push(data);
      } else {
        data.selected = !checked;
        newSubcategory.push(data);
      }
    });

    this.subcategories = newSubcategory;
  }

  async save() {
    if (this.subcategories !== undefined && this.subcategories.length > 0) {

      this.subcategories.forEach(element => {
        if (element['selected']) {
          this.selectedSubcategories.push(element);
        }
      });

      if (this.selectedSubcategories !== undefined && this.selectedSubcategories.length > 0) {
        const loading = await this.loadingCtrl.create({
          message: 'Aguarde...',
        });

        await loading.present();
        this.loading = true;

        let services = '';
        let count = 0;
        this.selectedSubcategories.forEach(element => {
          count++;
          services += element['id'];
          if (count < this.selectedSubcategories.length) {
            services += ',';
          }
        });

        this.service.saveServices(window.localStorage.getItem(Constants.KEY_TOKEN), { category: this.profile.primary_category_id, subcategories: services }).subscribe(res => {
          loading.dismiss();
          this.loading = false;

          if (res['message']) {
            this.showToast('Dados salvos');
            this.navCtrl.back();

          } else {
            this.showToast('Falha ao salvar dados');
          }

        }, err => {
          console.log('Fail', err);
          loading.dismiss();
          this.loading = false;
          this.showToast('Falha ao salvar dados');
        });
      } else {
        this.showToast('Selecione ao menos uma opção');
      }
    } else {
      this.showToast('Não há serviços disponíveis no momento');
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
