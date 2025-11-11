import {Injectable} from "@angular/core";
import {Subject} from "./subject";
import {Constants} from "../../shared/constants";
import {Event, EventService as KafkaEventService} from "@biit-solutions/kafka-event-structure";
import {Observable} from "rxjs";

@Injectable({providedIn: 'root'})
export class EventService {
  static readonly REPLY_TO: string = "XFORMS";
  static readonly TAG: string = "XFORMS";
  public organization: string = null;
  public unit: string = null;

  constructor(private eventService: KafkaEventService) {
  }

  public sendEvent<T>(payload: T, entityType: string, context: any, subject: Subject, customProperties: Map<string, string>, topic: string = undefined,
                      replyTo: string = EventService.REPLY_TO, tag: string = EventService.TAG): Observable<Event<T>> {
    const sessionId: string = sessionStorage.getItem(Constants.SESSION_STORAGE.SESSION);
    const event: Event<T> = new Event();
    event.subject = subject;
    event.sessionId = sessionId;
    event.payload = payload;
    event.customPropertiesMap = new Map<string, string>([['context', JSON.stringify(context)]]);
    if (this.organization) {
      event.organization = this.organization;
    }
    if (this.unit) {
      event.unit = this.unit;
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
