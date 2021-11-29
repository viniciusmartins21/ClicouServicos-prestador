import { Component, OnInit, Inject } from '@angular/core';
import { Constants } from 'src/app/models/contants.models';
import { Helper } from 'src/app/models/helper.models';
import { MyNotification } from 'src/app/models/notifications.models';
import { APP_CONFIG, AppConfig } from '../../../../app.config';

@Component({
  selector: 'app-notifications',
  templateUrl: './notifications.page.html',
  styleUrls: ['./notifications.page.scss'],
})
export class NotificationsPage implements OnInit {
  notifications = new Array<MyNotification>();

  constructor(@Inject(APP_CONFIG) private config: AppConfig) { }

  ngOnInit() {
    let notifications: Array<MyNotification> = JSON.parse(window.localStorage.getItem(Constants.KEY_NOTIFICATIONS));
    if (notifications && notifications.length) {
      let locale = Helper.getLocale();
      for (let noti of notifications) {
        noti.time = Helper.formatMillisDate(Number(noti.time), locale);
        if (noti.title.toLowerCase().includes("pending")) {
          //noti.title = "Pending";
        } else if (noti.title.toLowerCase().includes("accepted")) {
          //noti.title = "Accepted";
          noti.colorclass = "completed";
        } else if (noti.title.toLowerCase().includes("onway")) {
          //noti.title = "On the way";
        } else if (noti.title.toLowerCase().includes("ongoing")) {
          //noti.title = "On going";
        } else if (noti.title.toLowerCase().includes("complete")) {
          //noti.title = "Complete";
          noti.colorclass = "completed";
        } else if (noti.title.toLowerCase().includes("cancelled")) {
          //noti.title = "Cancelled";
          noti.colorclass = "cancelled";
        } else if (noti.title.toLowerCase().includes("rejected")) {
          //noti.title = "Rejected";
          noti.colorclass = "cancelled";
        } else if (noti.title.toLowerCase().includes("message")) {
          //noti.title = "New Message";
          noti.colorclass = "new_message";
        }
      }
      this.notifications = notifications.reverse();
    }
  }

}
