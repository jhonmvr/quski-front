import { Injectable } from '@angular/core';

import { ReplaySubject, Observable, Observer } from 'rxjs';

@Injectable()
export class WebsocketService {
  constructor() { }

  private subject: ReplaySubject <MessageEvent>;

	public connect(url): ReplaySubject <MessageEvent> {
		if (!this.subject) {
			this.subject = this.create(url);
      		//console.log("Successfully connected: " + url);
		} 
		return this.subject;
	}

  private create(url): ReplaySubject<MessageEvent> {
		let ws = new WebSocket(url);

		let observable = Observable.create(
			(obs: Observer<MessageEvent>) => {
				ws.onmessage = obs.next.bind(obs);
				ws.onerror = obs.error.bind(obs);
				ws.onclose = obs.complete.bind(obs);
				return ws.close.bind(ws);
			})

		let observer = {
			next: (data: Object) => {
				if (ws.readyState === WebSocket.OPEN) {
					ws.send(JSON.stringify(data));
				}
			}
		}

		return ReplaySubject.create(observer, observable);
	}

}
