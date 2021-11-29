import { Component, OnInit } from '@angular/core';
import { NavController, ToastController, LoadingController } from '@ionic/angular';
import { Category } from 'src/app/models/category.models';
import { Constants } from 'src/app/models/contants.models';
import { Profile } from 'src/app/models/profile.models';
import { ClientService } from 'src/app/services/client.service';

@Component({
  selector: 'app-add-specializations',
  templateUrl: './add-specializations.page.html',
  styleUrls: ['./add-specializations.page.scss'],
  providers: [ClientService]
})
export class AddSpecializationsPage implements OnInit {
  loading: boolean = false;
  profile: Profile;
  categories: Array<Category>;
  tempCategories: Array<Category>;
  specialization: number;
  term: string = '';
  
  constructor(
    private navCtrl: NavController,
    private service: ClientService,
    private loadingCtrl: LoadingController,
    private toastCtrl: ToastController
    ) {
      
    }
    
    ngOnInit() {
      this.profile = JSON.parse(window.localStorage.getItem(Constants.KEY_PROFILE));
      if (this.profile.primary_category_id != null) {
        this.specialization = this.profile.primary_category_id;
      }
      this.loadPage();
    }
    
    loadPage() {
      this.loading = true;
      
      this.service.getCategories(window.localStorage.getItem(Constants.KEY_TOKEN)).subscribe(res => {
        console.log(res);
        this.loading = false;
        
        let cats: Array<Category> = res.data;
        this.categories = cats;
        this.tempCategories = cats;
        
      }, err => {
        console.log('Fail', err);
        this.loading = false;
        this.showToast('Falha ao carregar categorias');
      });
    }
    
    async search(evt) {
      this.categories = this.tempCategories;
      let searchTerm = evt.srcElement.value;
      
      if (!searchTerm) {
        this.categories = this.tempCategories;
        return;
        
      } else {
        this.categories = this.categories.filter(data => {
          if (data['title'] && searchTerm) {
            return (data['title'].toLowerCase().indexOf(searchTerm.toLowerCase()) > -1);
          }
        })
      }
    }
    
    async save() {
      if (this.specialization !== undefined) {
        
        const loading = await this.loadingCtrl.create({
          message: 'Aguarde...',
        });
        
        await loading.present();
        this.loading = true;
        
        this.service.saveSpecialization2(window.localStorage.getItem(Constants.KEY_TOKEN), { primary_category_id: this.specialization, sub_categories: this.profile.subcategories }).subscribe(res => {
          loading.dismiss();
          this.loading = false;

          if(res['message']){
            this.showToast('Dados salvos');
            /*
            let cat;
            
            this.categories.filter((data) => {
              if (data.id == this.specialization) {
                cat = data;
              }
            });
            
            this.profile.primary_category_id = this.specialization;
            this.profile.primary_category.id = cat.id;
            this.profile.primary_category.image_url = cat.image_url;
            this.profile.primary_category.parent_id = cat.parent_id;
            this.profile.primary_category.secondary_image_url = cat.secondary_image_url;
            this.profile.primary_category.selected = cat.selected;
            this.profile.primary_category.title = cat.title;
            
            window.localStorage.setItem(Constants.KEY_PROFILE, JSON.stringify(this.profile));
            */

            this.navCtrl.back();
            
          } else {
            this.showToast('Falha ao salvar dados');
          }
          
        }, err => {
          console.log('Fail', err);
          loading.dismiss();
          this.loading = false;
          this.showToast('Tente novamente mais tarde');
        });
      } else {
        this.showToast('Selecione uma das opções');
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
  