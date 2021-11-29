import { Component, OnInit } from '@angular/core';
import { LoadingController, NavController, ToastController } from '@ionic/angular';
import { Subscription } from 'rxjs';
import { Constants } from 'src/app/models/contants.models';
import { Helper } from 'src/app/models/helper.models';
import { SupportRequest } from 'src/app/models/support-request.models';
import { User } from 'src/app/models/user.models';
import { ClientService } from 'src/app/services/client.service';

@Component({
  selector: 'app-contact-us',
  templateUrl: './contact-us.page.html',
  styleUrls: ['./contact-us.page.scss'],
  providers: [ClientService]
})
export class ContactUsPage implements OnInit {
  loading = false;
  userMe: User;
  supportRequest: SupportRequest;
  subscriptions: Array<Subscription> = [];
  
  constructor(
    private service: ClientService, 
    //private callNumber: CallNumber,
    private loadingCtrl: LoadingController, 
    private toastCtrl: ToastController,
    private navCtrl: NavController
    ) { 
      this.userMe = JSON.parse(window.localStorage.getItem(Constants.KEY_USER));
      this.supportRequest = new SupportRequest(this.userMe.name, this.userMe.email, "");
    }
    
    ngOnInit() {
    }

    dialSupport() {
      let phoneNumber = Helper.getSetting("support_phone");
      if (phoneNumber) {
        //this.callNumber.callNumber(phoneNumber, true).then(res => console.log('Launched dialer!', res)).catch(err => console.log('Error launching dialer', err));
      }
    }
    
    async submitSupport() {
      if (!this.supportRequest.message || !this.supportRequest.message.length) {
        this.showToast('Digite uma mensagem');

      } else {
        const loading = await this.loadingCtrl.create({
          message: 'Aguarde...',
        });
        
        await loading.present();
        this.loading = true;
        
        let subscription: Subscription = this.service.submitSupport(window.localStorage.getItem(Constants.KEY_TOKEN), this.supportRequest).subscribe(res => {
          console.log(res);
          loading.dismiss();
          this.loading = false;
          this.showToast('Dados salvos');
          
          this.navCtrl.pop();
        }, err => {
          console.log('support', err);
          loading.dismiss();
          this.loading = false;
          this.showToast('Falha ao salvar dados');
        });
        this.subscriptions.push(subscription);
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
  