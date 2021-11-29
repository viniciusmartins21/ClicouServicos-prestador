import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-addresses',
  templateUrl: './addresses.page.html',
  styleUrls: ['./addresses.page.scss'],
})
export class AddressesPage implements OnInit {

  constructor(
    private route: Router
    ) { }

  ngOnInit() {
  }
	
  addNew() {
    this.route.navigate(['./add-address']);
  } 

}
