import { Component, OnInit } from '@angular/core';
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';

import { environment } from './../environments/environment';
import { Lesson } from './model/lessons';
import { LessonsService } from './services/lessons.service';
import { NewsletterService } from './services/newsletter.service';

declare const window: any;

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  title = 'pushNotifWebApp';
  lessons$: Observable<Lesson[]>;

  constructor(
    private lessonsService: LessonsService,
    private newsletterService: NewsletterService
  ) {
    if (window.Notifications) {
      console.log('Your browser supports Notifications');
    } else {
      console.log("Your browser doesn't support Notifications =(");
    }

    const deviceInfo: any = this.newsletterService.getDeviceBrowserInfo();
    console.log('deviceInfo: ', deviceInfo);

    this.newsletterService.receivedNotifications();
  }

  subscribeToNotifications() {
    console.log('subscribeToNotifications: ');
    this.newsletterService.requestPermission();
  }

  ngOnInit() {
    this.loadLessons();
  }

  loadLessons() {
    this.lessons$ = this.lessonsService
      .loadAllLessons()
      .pipe(catchError((err) => of([])));
  }
}
