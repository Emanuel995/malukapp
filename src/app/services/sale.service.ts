import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import {env} from './env';

@Injectable({
  providedIn: 'root'
})


export class SaleService {

  constructor() { }
}
