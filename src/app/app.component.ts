import {Component} from '@angular/core';
import {BiitIconService} from "@biit-solutions/wizardry-theme/icon";
import {completeIconSet} from "@biit-solutions/biit-icons-collection";
import {KafkaEventStructureRootService} from "@biit-solutions/kafka-event-structure";
import {UserManagerRootService} from "@biit-solutions/user-manager-structure";
import {BiitSnackbarHorizontalPosition, BiitSnackbarService, BiitSnackbarVerticalPosition} from "@biit-solutions/wizardry-theme/info";
import {Environment} from "../environments/environment";
import {TranslocoService} from "@ngneat/transloco";


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {

  constructor(biitSnackbarService: BiitSnackbarService,
              biitIconService: BiitIconService,
              rootService: KafkaEventStructureRootService,
              userManagerRootService: UserManagerRootService,
              transloco: TranslocoService) {
    biitSnackbarService.setPosition(BiitSnackbarVerticalPosition.TOP, BiitSnackbarHorizontalPosition.CENTER);
    biitIconService.registerIcons(completeIconSet);
    rootService.serverUrl = new URL(`${Environment.KAFKA_PROXY_URL}`);
    userManagerRootService.serverUrl = new URL(`${Environment.USER_MANAGER_URL}`);
    transloco.setActiveLang(navigator.language.split('-')[0]);
  }

}
