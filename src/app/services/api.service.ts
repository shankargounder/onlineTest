import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class ApiService {
  private tests: any[] = [];
  private lastResult: any = null;

  constructor(private http: HttpClient){}
  sendQuery(query: string): Observable<any> {
    return this.http.post('/chat', { query });
    //return this.http.post('http://localhost:3000/chat', { query });
  }
  
}