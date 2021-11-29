import { Component, OnInit, ViewChild } from '@angular/core';
import { IonInfiniteScroll, NavController, ToastController } from '@ionic/angular';
import { Chat } from 'src/app/models/chat.models';
import { User } from 'src/app/models/user.models';
import { Constants } from 'src/app/models/contants.models';
import { Message } from 'src/app/models/message.models';
import firebase from 'firebase/app';
import { NavigationExtras } from '@angular/router';

@Component({
  selector: 'app-messages',
  templateUrl: './messages.page.html',
  styleUrls: ['./messages.page.scss'],
})
export class MessagesPage implements OnInit {
  loading: boolean = false;
  chats = new Array<Chat>();
  chatsAll = new Array<Chat>();
  userMe: User;
  
  constructor(
    private navCtrl: NavController,
    private toastCtrl: ToastController
    ) {
      this.userMe = JSON.parse(window.localStorage.getItem(Constants.KEY_USER));
    }
    
    ngOnInit() {
      this.loadPage();
    }
    
    loadPage() {
      this.loading = true;
      this.chats = new Array();
      this.chatsAll = new Array();
      const component = this;
      let inbox = firebase.database().ref(Constants.REF_INBOX).child(component.userMe.id + "hp");
      
      inbox.on('child_added', function (data) {
        let newMessage = data.val() as Message;
        
        if (newMessage && newMessage.id && newMessage.chatId) {
          let newChat = Chat.fromMessage(newMessage, (component.userMe.id + "hp") == newMessage.senderId);
          component.chatsAll.push(newChat);
          component.chatsAll.sort((one, two) => (one.dateTimeStamp > two.dateTimeStamp ? -1 : 1));
          component.chats = component.chatsAll;
        }
        
        component.loading = false;
        
      }, err => {
        console.log(err);
        component.loading = false;
        component.showToast('Tente novamente mais tarde');
      });
      
      inbox.on('child_changed', function (data) {
        var oldMessage = data.val() as Message;
        if (oldMessage && oldMessage.id && oldMessage.chatId) {
          let oldChat = Chat.fromMessage(oldMessage, ((component.userMe.id + "hp") == oldMessage.senderId));
          let oldIndex = -1;
          for (let i = 0; i < component.chatsAll.length; i++) {
            if (oldChat.chatId == component.chatsAll[i].chatId) {
              oldIndex = i;
              break;
            }
          }
          if (oldIndex != -1) {
            component.chatsAll.splice(oldIndex, 1);
            component.chatsAll.unshift(oldChat);
            component.chats = component.chatsAll;
          }
        }
        component.loading = false;
        
      }, err => {
        console.log(err);
        component.loading = false;
        component.showToast('Tente novamente mais tarde');
      });
      
      setTimeout(() => {
        this.loading = false;
      }, 2500);
    }
    
    openChat(chat) {
      let navigationExtras: NavigationExtras = {
        queryParams: {
          data: JSON.stringify(chat)
        }
      };
      
      this.navCtrl.navigateForward(['./chat'], navigationExtras);
    }
    
    //PULL TO REFRESH
    refresh(event) {
      this.loading = true;
      setTimeout(() => {
        this.loadPage();
        event.target.complete();
      }, 1500);
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
  