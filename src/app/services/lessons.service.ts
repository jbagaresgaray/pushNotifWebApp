import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Lesson } from '../model/lessons';

import { environment } from './../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class LessonsService {
  constructor(private http: HttpClient) {}

  loadAllLessons(): Observable<Lesson[]> {
    return this.http.get<any>(environment.apiUrl + '/api/lessons').pipe(map((res) => res.lessons));
  }

  findLessonById(id: number) {
    return this.http.get<Lesson>(environment.apiUrl + '/api/lessons/' + id);
  }
}
