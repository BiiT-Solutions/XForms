import {Injectable} from "@angular/core";
import {Subject} from "../../models/events/subject";
import {Constants} from "../../shared/constants";
import {Event, EventService as KafkaEventService} from "kafka-event-structure-lib";
import {Observable} from "rxjs";
import {OrganizationService} from "user-manager-structure-lib";

@Injectable({providedIn: 'root'})
export class EventService {
  static readonly REPLY_TO: string = "CADT";
  static readonly TAG: string = "CADT";
  public organization: string = null;

  constructor(private eventService: KafkaEventService) {
  }

  public sendEvent<T>(payload: T, entityType: string, subject: Subject, customProperties: Map<string, string>, topic: string = undefined,
                      replyTo: string = EventService.REPLY_TO, tag: string = EventService.TAG): Observable<Event<T>> {
    const sessionId: string = sessionStorage.getItem(Constants.SESSION_STORAGE.SESSION);
    const event: Event<T> = new Event();
    event.subject = subject;
    event.sessionId = sessionId;
    event.payload = payload;
    if (this.organization) {
      event.organization = this.organization;
    }
    event.replyTo = replyTo;
    event.tag = tag;
    if (payload && (payload as any).class) {
      event.entityType = (payload as any).class;
    }
    event.customPropertiesMap = customProperties;
    return this.eventService.createEvent(event, topic);
  }
}
