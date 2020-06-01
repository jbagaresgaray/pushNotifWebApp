import { Component, OnInit } from '@angular/core';
import { SwPush } from '@angular/service-worker';
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';

import { environment } from './../environments/environment';
import { Lesson } from './model/lessons';
import { LessonsService } from './services/lessons.service';
import { NewsletterService } from './services/newsletter.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  title = 'pushNotifWebApp';
  lessons$: Observable<Lesson[]>;
  sub: PushSubscription;

  readonly VAPID_PUBLIC_KEY = environment.publicKey;

  constructor(
    private lessonsService: LessonsService,
    private swPush: SwPush,
    private newsletterService: NewsletterService
  ) {
    this.subscribeToNotifications();
  }

  subscribeToNotifications() {
    this.swPush
      .requestSubscription({
        serverPublicKey: this.VAPID_PUBLIC_KEY,
      })
      .then((sub) => {
        this.sub = sub;

        console.log('Notification Subscription: ', sub);

        this.newsletterService.addPushSubscriber(sub).subscribe(
          () => console.log('Sent push subscription object to server.'),
          (err) =>
            console.log(
              'Could not send subscription object to server, reason: ',
              err
            )
        );
      })
      .catch((err) =>
        console.error('Could not subscribe to notifications', err)
      );

    this.swPush.subscription.subscribe((pushSubscription) => {
      console.log(pushSubscription.endpoint);
      console.log(pushSubscription.getKey('p256dh'));
      console.log(pushSubscription.getKey('auth'));
    });
  }

  ngOnInit() {
    this.loadLessons();
  }

  loadLessons() {
    this.lessons$ = this.lessonsService
      .loadAllLessons()
      .pipe(catchError((err) => of([])));
  }

  sendNewsletter() {
    console.log('Sending Newsletter to all Subscribers ...');

    this.newsletterService.send().subscribe();
  }
}
