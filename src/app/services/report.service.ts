import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {env} from './env';

@Injectable({
  providedIn: 'root'
})
export class ReportService {
  private apiUrl = env.api_url+'/api/sales/report';
  
  constructor( private http : HttpClient) {   
  }

  downloadPDF(query : string){
    return this.http.get(this.apiUrl+'.pdf'+'?'+query,{responseType:'blob'});
  }
  downloadXSLX(query : string){
    return this.http.get(this.apiUrl+'.xlsx'+'?'+query,{responseType:'blob'});
  }
}