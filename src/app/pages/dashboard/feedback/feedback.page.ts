import { Component, OnInit, ViewChild } from '@angular/core';
import { IonInfiniteScroll } from '@ionic/angular';
import { Subscription } from 'rxjs';
import { Constants } from 'src/app/models/contants.models';
import { Review } from 'src/app/models/review.models';
import { User } from 'src/app/models/user.models';
import { ClientService } from 'src/app/services/client.service';

@Component({
  selector: 'app-feedback',
  templateUrl: './feedback.page.html',
  styleUrls: ['./feedback.page.scss'],
  providers: [ClientService]
})
export class FeedbackPage implements OnInit {
  @ViewChild("IonInfiniteScroll", { read: IonInfiniteScroll, static: true }) infiniteScroll: IonInfiniteScroll;

  loading: boolean = false;
  pageNo = 1;
  reviews: Array<Review> = [];
  user: User;

  constructor(
    private service: ClientService
  ) {
    this.user = JSON.parse(window.localStorage.getItem(Constants.KEY_USER));
  }

  ngOnInit() {
    this.loadPage(true);
  }

  loadPage(infinite: boolean) {
    if (!infinite) {
      this.loading = true;
      this.pageNo = 1;
      this.reviews = new Array();
      this.infiniteScroll.disabled = false;
    }

    this.service.getMyReviews(window.localStorage.getItem(Constants.KEY_TOKEN), this.pageNo).subscribe(res => {
      console.log(res);
      this.loading = false;

      let reviews: Array<Review> = res.data;
      this.reviews = this.reviews.concat(reviews);
    }, err => {
      console.log('reviews', err);
      this.loading = false;
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

}
