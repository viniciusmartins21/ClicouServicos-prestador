/* eslint-disable @typescript-eslint/naming-convention */
/* eslint-disable @typescript-eslint/no-inferrable-types */
import { Component, OnInit } from '@angular/core';
import { NavController, LoadingController, ToastController } from '@ionic/angular';
import { Subscription } from 'rxjs';
import { Constants } from 'src/app/models/contants.models';
import { ClientService } from 'src/app/services/client.service';

@Component({
  selector: 'app-bank-account',
  templateUrl: './bank-account.page.html',
  styleUrls: ['./bank-account.page.scss'],
})
export class BankAccountPage implements OnInit {
  loading: boolean = false;
  fisicPerson: boolean = true;
  banks: Array<any> = [];
  document: string = '';
  cpf: string = '';
  cnpj: string = '';

  bankAccount = {
    bank_code: '',
    agencia: '',
    agencia_dv: '',
    conta: '',
    type: '',
    conta_dv: '',
    document_number: '',
    legal_name: '',
    ativar_pagarme: 0
  };

  constructor(
    private navCtrl: NavController,
    private service: ClientService,
    private loadingCtrl: LoadingController,
    private toastCtrl: ToastController
  ) { }

  ngOnInit() {
    this.service.getBanks().subscribe((data: any) => {
      this.banks = data.Bancos;
    });

    this.loadPage();
  }

  loadPage() {
    this.loading = true;
    this.service.getProfile(window.localStorage.getItem(Constants.KEY_TOKEN)).subscribe((res: any) => {
      window.localStorage.setItem(Constants.KEY_PROFILE, JSON.stringify(res));
      console.log(res);

      this.bankAccount.bank_code = res.bank_code;
      this.bankAccount.agencia = res.agencia;
      this.bankAccount.agencia_dv = res.agencia_dv;
      this.bankAccount.conta = res.conta;
      this.bankAccount.type = res.type;
      this.bankAccount.conta_dv = res.conta_dv;
      this.bankAccount.legal_name = res.legal_name;
      this.bankAccount.ativar_pagarme = res.ativar_pagarme;

      this.document = res.document_number;

      if (res.document_number) {
        if (res.document_number.length === 11) {
          this.fisicPerson = true;
          this.cpf = res.document_number;
        } else {
          this.fisicPerson = false;
          this.cnpj = res.document_number;
        }
      }

      this.loading = false;
    }, err => {
      console.log('profile_get_err', err);
      this.loading = false;
      this.showToast('Falha ao atualizar dados');
    });
  }

  async save() {
    if (this.cpf) {
      let cpf = this.cpf.replace(/[^0-9 ]/g, '');
      cpf = cpf.replace(' ', '');
      this.bankAccount.document_number = cpf;

    } else if (this.cnpj) {
      let cnpj = this.cnpj.replace(/[^0-9 ]/g, '');
      cnpj = cnpj.replace(' ', '');
      this.bankAccount.document_number = cnpj;

    } else {
      this.showToast('Informe um documento');
    }

    if (this.bankAccount.document_number) {
      if (!this.bankAccount.legal_name) {
        this.showToast('Informe um nome');

      } else if (!this.bankAccount.bank_code) {
        this.showToast('Selecione um banco');

      } else if (!this.bankAccount.agencia) {
        this.showToast('Informe a agência');

      } else if (!this.bankAccount.type) {
        this.showToast('Selecione o tipo de conta');

      } else if (!this.bankAccount.conta) {
        this.showToast('Informe o número da conta');

      } else if (!this.bankAccount.conta_dv) {
        this.showToast('Informe o digito da conta');

      } else {
        const loading = await this.loadingCtrl.create({
          message: 'Aguarde...',
        });

        await loading.present();
        this.loading = true;

        this.service.saveBankAccount(window.localStorage.getItem(Constants.KEY_TOKEN), this.bankAccount).subscribe((res: any) => {
          this.loading = false;
          loading.dismiss();

          if (res.message) {
            this.showToast('Dados salvos');
            this.navCtrl.back();

          } else {
            this.showToast('Verifique os dados e tente novamente');
          }
        }, err => {
          console.log(err);
          this.loading = false;
          loading.dismiss();
          this.showToast('Tente novamente mais tarde');
        });
      }
    }

  }

  async showToast(msg: string) {
    const toast = await this.toastCtrl.create({
      message: msg,
      position: 'middle',
      duration: 3000
    });
    toast.present();
  }

}
