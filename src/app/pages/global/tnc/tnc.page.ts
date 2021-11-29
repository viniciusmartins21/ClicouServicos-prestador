import { Component, OnInit } from '@angular/core';
import { Constants } from 'src/app/models/contants.models';

@Component({
  selector: 'app-tnc',
  templateUrl: './tnc.page.html',
  styleUrls: ['./tnc.page.scss'],
})
export class TncPage implements OnInit {
  terms: string = '';

  constructor() { }

  ngOnInit() {
    let data = JSON.parse(window.localStorage.getItem(Constants.KEY_SETTING));
    this.terms = data['9']['value'];
  }

}
