import { Component, OnInit, ViewChild } from '@angular/core';
import { ClientService } from 'src/app/services/client.service';
import firebase from 'firebase/app';
import { Message } from 'src/app/models/message.models';
import { Chat } from 'src/app/models/chat.models';
import { User } from 'src/app/models/user.models';
import { ToastController } from '@ionic/angular';
import { Helper } from 'src/app/models/helper.models';
import { Constants } from 'src/app/models/contants.models';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.page.html',
  styleUrls: ['./chat.page.scss'],
  providers: [ClientService]
})
export class ChatPage implements OnInit {
  @ViewChild('content', null) content: any;
  loading: boolean = false;
  chat: Chat;
  userMe: User;
  chatChild: string;
  userPlayerId: string;
  newMessageText: string;
  chatRef: firebase.database.Reference;
  inboxRef: firebase.database.Reference;
  messages = new Array<Message>();

  constructor(
    private toastCtrl: ToastController,
    private clientService: ClientService,
    private activatedRoute: ActivatedRoute
  ) {
    this.activatedRoute.queryParams.subscribe(params => {
      this.chat = JSON.parse(params.data);
      this.userMe = JSON.parse(window.localStorage.getItem(Constants.KEY_USER));
      this.chatChild = Helper.getChatChild(this.chat.myId, this.chat.chatId);
    });
  }

  ngOnInit() {
    this.loadPage();
    this.scrollList();
  }

  loadPage() {
    this.loading = true;

    this.inboxRef = firebase.database().ref(Constants.REF_INBOX);
    this.chatRef = firebase.database().ref(Constants.REF_CHAT);

    const component = this;
    this.chatRef.child(this.chatChild).limitToLast(20).on("child_added", function (snapshot, prevChildKey) {
      component.loading = false;

      let newMessage = snapshot.val() as Message;
      if (newMessage) {
        newMessage.timeDiff = Helper.formatMillisDateTime(Number(newMessage.dateTimeStamp), Helper.getLocale());
        component.addMessage(newMessage);
        component.markDelivered();
        component.scrollList();
      }
    }, err => {
      console.log(err);
      component.loading = false;
      component.showToast('Tente novamente mais tarde');
    });

    firebase.database().ref(Constants.REF_USERS_FCM_IDS).child(this.chat.chatId).once("value", function (snap) {
      component.loading = false;
      component.userPlayerId = snap.val();
    }, err => {
      console.log(err);
      component.loading = false;
      component.showToast('Tente novamente mais tarde');
    });
  }

  scrollList() {
    if (this.content) {
      this.content.scrollToBottom(300);
    }
  }

  notifyMessages() {
    this.clientService.postNotification(window.localStorage.getItem(Constants.KEY_TOKEN), "customer", Number(this.chat.chatId) ? this.chat.chatId : this.chat.chatId.substring(0, this.chat.chatId.indexOf("hc"))).subscribe(res => {
      console.log("Notificação enviada", res)
    }, err => {
      console.log("Falha ao enviar notificação", err)
    });
  }

  markDelivered() {
    if (this.messages && this.messages.length) {
      if (this.messages[this.messages.length - 1].senderId != this.chat.myId) {
        this.messages[this.messages.length - 1].delivered = true;
        this.chatRef.child(this.chatChild).child(this.messages[this.messages.length - 1].id).child("delivered").set(true);
      }
      // else {
      //   let toNotify;
      //   if (!this.messages[this.messages.length - 1].delivered) {
      //     toNotify = this.messages[this.messages.length - 1];
      //     this.messages[this.messages.length - 1].delivered = true;
      //   }
      //   if (toNotify) {
      //     this.notifyMessages(toNotify);
      //   }
      // }
    }
  }

  addMessage(msg: Message) {
    this.messages = this.messages.concat(msg);
    //this.storage.set(Constants.KEY_MESSAGES + this.chatChild, this.messages);
    if (this.chat && msg) {
      let isMeSender = msg.senderId == this.chat.myId;
      this.chat.chatImage = isMeSender ? msg.recipientImage : msg.senderImage;
      this.chat.chatName = isMeSender ? msg.recipientName : msg.senderName;
      this.chat.chatStatus = isMeSender ? msg.recipientStatus : msg.senderStatus;
    }
  }

  send() {
    if (this.newMessageText && this.newMessageText.trim().length) {
      let toSend = new Message();
      toSend.chatId = this.chatChild;
      toSend.body = this.newMessageText;
      toSend.dateTimeStamp = String(new Date().getTime());
      toSend.delivered = false;
      toSend.sent = true;
      toSend.recipientId = this.chat.chatId;
      toSend.recipientImage = this.chat.chatImage;
      toSend.recipientName = this.chat.chatName;
      toSend.recipientStatus = this.chat.chatStatus;
      toSend.senderId = this.chat.myId;
      toSend.senderName = this.userMe.name;
      toSend.senderImage = (this.userMe.image_url && this.userMe.image_url.length) ? this.userMe.image_url : "assets/imgs/empty_dp.png";
      toSend.senderStatus = this.userMe.email;
      toSend.id = this.chatRef.child(this.chatChild).push().key;//HERE

      this.chatRef.child(this.chatChild).child(toSend.id).set(toSend).then(res => {
        this.inboxRef.child(toSend.recipientId).child(toSend.senderId).set(toSend);
        this.inboxRef.child(toSend.senderId).child(toSend.recipientId).set(toSend);
        this.newMessageText = '';
        this.notifyMessages();
      });
    } else {
      //this.showToast(value);
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
