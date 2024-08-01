import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-new-menu',
  templateUrl: './new-menu.component.html',
  styleUrls: ['./new-menu.component.css']
})
export class NewMenuComponent {

constructor(private router: Router){}


  showTabularView(): void {
      this.router.navigate(['/tabular-menu/default']);
  }
}
