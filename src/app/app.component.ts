import {Component} from '@angular/core';
import {BiitIconService} from "biit-ui/icon";
import {completeIconSet} from "biit-icons-collection";
import {KafkaEventStructureRootService} from "kafka-event-structure-lib";
import {BiitSnackbarHorizontalPosition, BiitSnackbarService, BiitSnackbarVerticalPosition} from "biit-ui/info";
import {Environment} from "../environments/environment";
import {TranslocoService} from "@ngneat/transloco";


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {

  constructor(
    biitSnackbarService: BiitSnackbarService,
    biitIconService: BiitIconService,
    rootService: KafkaEventStructureRootService,
    transloco: TranslocoService
    ) {
    biitSnackbarService.setPosition(BiitSnackbarVerticalPosition.TOP, BiitSnackbarHorizontalPosition.CENTER);
    biitIconService.registerIcons(completeIconSet);
    rootService.serverUrl = new URL(`${Environment.KAFKA_PROXY_URL}`);
    transloco.setActiveLang(navigator.language.split('-')[0]);
  }

}
