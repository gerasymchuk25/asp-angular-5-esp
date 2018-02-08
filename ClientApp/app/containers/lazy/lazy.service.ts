import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable()
export class LazyService {

  constructor(private http: HttpClient) { }

}
