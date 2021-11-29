import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { LoadingController, ToastController, ActionSheetController } from '@ionic/angular';
import { Subscription } from 'rxjs';
import { Category } from 'src/app/models/category.models';
import { Constants } from 'src/app/models/contants.models';
import { Profile } from 'src/app/models/profile.models';
import { User } from 'src/app/models/user.models';
import { ClientService } from 'src/app/services/client.service';
import { UploadService } from 'src/app/services/upload.service';
import { Camera, CameraOptions, PictureSourceType } from '@ionic-native/camera/ngx';

@Component({
  selector: 'app-my-profile',
  templateUrl: './my-profile.page.html',
  styleUrls: ['./my-profile.page.scss'],
  providers: [ClientService, UploadService, Camera]
})
export class MyProfilePage implements OnInit {
  user: User;
  profile: Profile;
  categories: Array<Category>;
  subscriptions: Array<Subscription> = [];
  subcategoriestext: string;
  
  doc1: string = '';
  doc2: string = '';
  doc3: string = '';
  
  docSelected1: boolean = false;
  docSelected2: boolean = false;
  docSelected3: boolean = false;
  sent: boolean = false;
  
  constructor(
    private route: Router,
    private loadingCtrl: LoadingController,
    private toastCtrl: ToastController,
    private actionSheetController: ActionSheetController,
    private camera: Camera,
    private serviceUpload: UploadService,
    private service: ClientService
    ) { }
    
    ngOnInit() {
      this.user = JSON.parse(window.localStorage.getItem(Constants.KEY_USER));
      this.profile = JSON.parse(window.localStorage.getItem(Constants.KEY_PROFILE));
    }
    
    ionViewWillEnter() {
      this.refreshProfile();
      
      if(window.localStorage.getItem(Constants.DOC1_STATUS)){
        this.docSelected1 = true;
      } 
      
      if(window.localStorage.getItem(Constants.DOC2_STATUS)){
        this.docSelected2 = true;
      } 
      
      if(window.localStorage.getItem(Constants.DOC3_STATUS)){
        this.docSelected3 = true;
      } 
      
      if(window.localStorage.getItem(Constants.DOCS_SENT)){
        this.sent = true;
      } 
    }
    
    refreshProfile() {
      let subscription: Subscription = this.service.getProfile(window.localStorage.getItem(Constants.KEY_TOKEN)).subscribe(res => {
        this.profile = res;
        window.localStorage.setItem(Constants.KEY_PROFILE, JSON.stringify(res));

        if(this.profile.document_url){
          this.sent = true;
        }
        
      }, err => {
        console.log('profile_get_err', err);
        this.showToast('Falha ao atualizar dados');
      });
      this.subscriptions.push(subscription);
    }
    
    async selectImage(type: number) {
      const actionSheet = await this.actionSheetController.create({
        header: 'Selecione o local da imagem',
        buttons: [{
          text: 'Galeria',
          handler: () => {
            this.takePicture(this.camera.PictureSourceType.PHOTOLIBRARY, type);
          }
        },
        {
          text: 'Camera',
          handler: () => {
            this.takePicture(this.camera.PictureSourceType.CAMERA, type);
          }
        },
        {
          text: 'Cancelar',
          role: 'cancel'
        }]
      });
      
      await actionSheet.present();
    }
    
    async takePicture(sourceType: PictureSourceType, type: number) {
      const options: CameraOptions = {
        quality: 30,
        sourceType: sourceType,
        targetWidth: 400,
        targetHeight: 400,
        saveToPhotoAlbum: false,
        correctOrientation: true,
        destinationType: this.camera.DestinationType.DATA_URL,
        encodingType: this.camera.EncodingType.JPEG,
        mediaType: this.camera.MediaType.PICTURE,
      };
      
      this.camera.getPicture(options).then((imageData) => {
        if (type == 0) {
          this.doUpload(imageData);
          
        } else if (type == 1) {
          this.doc1 = imageData;
          this.docSelected1 = true;
          window.localStorage.setItem(Constants.DOC1_STATUS, JSON.stringify(true));
        } else if (type == 2) {
          this.doc2 = imageData;
          this.docSelected2 = true;
          window.localStorage.setItem(Constants.DOC2_STATUS, JSON.stringify(true));
        } else if (type == 3) {
          this.doc3 = imageData;
          this.docSelected3 = true;
          window.localStorage.setItem(Constants.DOC3_STATUS, JSON.stringify(true));
        }
        
      });
    }
    
    async doUpload(imageData) {
      const loading = await this.loadingCtrl.create({
        message: 'Aguarde...',
      });
      
      await loading.present();
      
      const dataPost = {
        'image_url': "data:image/jpeg;base64," + imageData
      };
      
      this.serviceUpload.updatePic(dataPost, window.localStorage.getItem(Constants.KEY_TOKEN)).subscribe((res) => {
        loading.dismiss();
        this.profile.image_url = "data:image/jpeg;base64," + imageData;
        this.refreshProfile();
      }, err => {
        loading.dismiss();
        this.showToast('Tente novamente mais tarde');
      });
    }
    
    async send() {
      const loading = await this.loadingCtrl.create({
        message: 'Aguarde...',
      });
      
      await loading.present();
      
      const dataPost = {
        'document_url': "data:image/jpeg;base64," + this.doc1,
        'comprovante_residencia_url': "data:image/jpeg;base64," + this.doc2,
        'certificado_especialidade_url': "data:image/jpeg;base64," + this.doc3
      };
      
      this.serviceUpload.sendDocs(dataPost, window.localStorage.getItem(Constants.KEY_TOKEN)).subscribe((res) => {
        loading.dismiss();
        this.showToast('Documentos enviados!');
        this.sent = true;
        window.localStorage.setItem(Constants.DOCS_SENT, JSON.stringify(true));
        
      }, err => {
        loading.dismiss();
        this.showToast('Tente novamente mais tarde');
      });
      
    }
    
    addScheduling() {
      this.route.navigate(['./add-scheduling']);
    }

    back() {
      this.route.navigate(['./tabs/account']);
    }
    
    addAddress() {
      this.route.navigate(['./add-address']);
    }
    
    addSpecializations() {
      if (this.profile.address) {
        this.route.navigate(['./add-specializations']);
      } else {
        this.showToast('Primeiro informe um endereço de atendimento');
      }
    }
    
    addServices() {
      if (this.profile.primary_category) {
        this.route.navigate(['./add-services']);
      } else {
        this.showToast('Primeiro selecione uma especialização');
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
  