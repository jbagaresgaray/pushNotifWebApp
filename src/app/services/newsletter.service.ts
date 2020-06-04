import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { DeviceUUID } from 'device-uuid';

import { environment } from './../../environments/environment';
import { AngularFireMessaging } from '@angular/fire/messaging';

declare const window: any;

@Injectable({
  providedIn: 'root',
})
export class NewsletterService {
  private deviceInfo: any = {};

  private status: BehaviorSubject<any> = new BehaviorSubject(null);
  private deviceInfoStatus: BehaviorSubject<any> = new BehaviorSubject(null);

  constructor(
    private http: HttpClient,
    private afMessaging: AngularFireMessaging
  ) {}

  getNotificationsData() {
    return this.status.getValue();
  }

  setNotification(notification: any) {
    this.status.next(notification);
    if (notification) {
      const notificationTitle = notification.notification.title;
      const notificationOptions: any = {
        body: notification.notification.body,
        data: notification.notification.data,
      };

      if (!('Notification' in window)) {
        alert('This browser does not support desktop notification');
      } else if (Notification.permission === 'granted') {
        // If it's okay let's create a notification
        // tslint:disable-next-line: no-unused-expression
        console.log('new Notification');
        new Notification(notificationTitle, notificationOptions);
      }
    }
  }

  setDeviceInfo(deviceInfo: any) {
    this.deviceInfo = deviceInfo;
    this.deviceInfoStatus.next(this.deviceInfo);
  }

  getDeviceInfo() {
    return this.deviceInfoStatus.getValue();
  }

  onNotificationChange(): Observable<any> {
    return this.status.asObservable();
  }

  requestPermission() {
    console.log('requestPermission');
    this.afMessaging.requestToken.subscribe(
      (token) => {
        console.log('Permission granted! Save to the server!', token);
        const deviceInfo: any = this.getDeviceBrowserInfo();
        const createUser = {
          platform: window.navigator.platform,
          modelName: deviceInfo.browser.name,
          manufacturer: window.navigator.vendor,
          uuid: deviceInfo.uuid,
          appVersion: deviceInfo.browser.version,
          operatingSystem: deviceInfo.os.name,
          osVersion: deviceInfo.os.version,
          pushToken: token,
        };
        this.registerDevice(createUser).subscribe(
          (res) => {
            console.log('registerDevice Success: ', res);
          },
          (err) => {
            console.log('registerDevice Err: ', err);
          }
        );
      },
      (error) => {
        console.error('Request Token Error: ', error);
      }
    );
  }

  receivedNotifications() {
    console.log('receivedNotifications');
    this.afMessaging.messages.subscribe((message) => {
      console.log('New Notification Received: ', message);
      this.setNotification(message);
    });

    this.afMessaging.onMessage((payload) => {
      console.log('New Notification onMessage: ', payload);
      this.setNotification(payload);
    });

    this.afMessaging.onTokenRefresh((payload) => {
      console.log('New Notification onTokenRefresh: ', payload);
    });
  }

  registerDevice(users: any): Observable<any> {
    console.log('environment.apiUrl: ', environment.apiUrl);
    console.log('registerDevice: ', users);
    return this.http.post<any>(environment.apiUrl + '/api/users', users);
  }

  deviceNotifications(uuid: string): Observable<any> {
    return this.http.get<any>(
      environment.apiUrl + '/api/users/' + uuid + '/notifications'
    );
  }

  getDeviceBrowserInfo() {
    const header = [
      navigator.platform,
      navigator.userAgent,
      navigator.appVersion,
      navigator.vendor,
      window.opera,
    ];
    const dataos = [
      { name: 'Windows Phone', value: 'Windows Phone', version: 'OS' },
      { name: 'Windows', value: 'Win', version: 'NT' },
      { name: 'iPhone', value: 'iPhone', version: 'OS' },
      { name: 'iPad', value: 'iPad', version: 'OS' },
      { name: 'Kindle', value: 'Silk', version: 'Silk' },
      { name: 'Android', value: 'Android', version: 'Android' },
      { name: 'PlayBook', value: 'PlayBook', version: 'OS' },
      { name: 'BlackBerry', value: 'BlackBerry', version: '/' },
      { name: 'Macintosh', value: 'Mac', version: 'OS X' },
      { name: 'Linux', value: 'Linux', version: 'rv' },
      { name: 'Palm', value: 'Palm', version: 'PalmOS' },
    ];
    const databrowser = [
      { name: 'Chrome', value: 'Chrome', version: 'Chrome' },
      { name: 'Firefox', value: 'Firefox', version: 'Firefox' },
      { name: 'Safari', value: 'Safari', version: 'Version' },
      { name: 'Internet Explorer', value: 'MSIE', version: 'MSIE' },
      { name: 'Opera', value: 'Opera', version: 'Opera' },
      { name: 'BlackBerry', value: 'CLDC', version: 'CLDC' },
      { name: 'Mozilla', value: 'Mozilla', version: 'Mozilla' },
    ];
    const matchItem = (strings, data) => {
      // tslint:disable-next-line: prefer-for-of
      for (let i = 0; i < data.length; i += 1) {
        const regex = new RegExp(data[i].value, 'i');
        const match = regex.test(strings);
        if (match) {
          const regexv = new RegExp(data[i].version + '[- /:;]([\\d._]+)', 'i');
          let matches = strings.match(regexv);
          let version = '';
          if (matches) {
            if (matches[1]) {
              matches = matches[1];
            }
          }
          if (matches) {
            matches = matches.split(/[._]+/);
            for (let j = 0; j < matches.length; j += 1) {
              if (j === 0) {
                version += matches[j] + '.';
              } else {
                version += matches[j];
              }
            }
          } else {
            version = '0';
          }
          return {
            name: data[i].name,
            version: parseFloat(version),
          };
        }
      }
      return { name: 'unknown', version: 0 };
    };

    const du = new DeviceUUID().parse();
    const dua = [
      du.language,
      du.platform,
      du.os,
      du.cpuCores,
      du.isAuthoritative,
      du.silkAccelerated,
      du.isKindleFire,
      du.isDesktop,
      du.isMobile,
      du.isTablet,
      du.isWindows,
      du.isLinux,
      du.isLinux64,
      du.isMac,
      du.isiPad,
      du.isiPhone,
      du.isiPod,
      du.isSmartTV,
      du.pixelDepth,
      du.isTouchScreen,
    ];
    const uuid = du.hashMD5(dua.join(':'));

    const agent = header.join(' ');
    const os = matchItem(agent, dataos);
    const browser = matchItem(agent, databrowser);

    return { uuid, os, browser };
  }
}
