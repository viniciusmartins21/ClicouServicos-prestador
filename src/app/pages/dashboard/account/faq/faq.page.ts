import { Component, OnInit } from '@angular/core';
import { Constants } from 'src/app/models/contants.models';

@Component({
  selector: 'app-faq',
  templateUrl: './faq.page.html',
  styleUrls: ['./faq.page.scss'],
})
export class FaqPage implements OnInit {
  faq: string = '';

  constructor() { }

  ngOnInit() {
    let data = JSON.parse(window.localStorage.getItem(Constants.KEY_SETTING));
    this.faq = data['8']['value'];
    console.log(this.faq);
  }

}
