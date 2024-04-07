import { Component } from '@angular/core';
import {BiitIconService} from "biit-ui/icon";
import {completeIconSet} from "biit-icons-collection";
import {KafkaEventStructureRootService} from "kafka-event-structure-lib";
import {HttpClient} from "@angular/common/http";
import {BiitSnackbarService, BiitSnackbarVerticalPosition, BiitSnackbarHorizontalPosition} from "biit-ui/info";
import {Environment} from "../environments/environment";


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {

  constructor(
    biitSnackbarService: BiitSnackbarService,
    biitIconService: BiitIconService,
    rootService: KafkaEventStructureRootService
    ) {
    biitSnackbarService.setPosition(BiitSnackbarVerticalPosition.TOP, BiitSnackbarHorizontalPosition.CENTER);
    biitIconService.registerIcons(completeIconSet);
    rootService.serverUrl = new URL(`${Environment.ROOT_URL}${Environment.KAFKA_PROXY_PATH}`);
  }

}
