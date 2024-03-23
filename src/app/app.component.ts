import { Component } from '@angular/core';
import {BiitIconService} from "biit-ui/icon";
import {completeIconSet} from "biit-icons-collection";


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {

  constructor(biitIconService: BiitIconService) {
    biitIconService.registerIcons(completeIconSet);
  }

}
