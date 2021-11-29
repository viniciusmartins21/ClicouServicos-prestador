/* eslint-disable max-len */
/* eslint-disable @typescript-eslint/naming-convention */
import { Injectable, Inject } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { APP_CONFIG, AppConfig } from '../../app/app.config';
import { ResetPasswordResponse } from '../models/reset-password-request.models';
import { Observable } from 'rxjs';


@Injectable()
export class UploadService {
    constructor(@Inject(APP_CONFIG) private config: AppConfig, private http: HttpClient) {

    }
    public updatePic(content, token: string) {
        const myHeaders = new HttpHeaders({ Accept: 'application/json', 'Content-Type': 'application/json', Authorization: 'Bearer ' + token });
        return this.http.put(this.config.apiBase + 'api/provider/profile/avatar', JSON.stringify(content), { headers: myHeaders });
    }

    public sendDocs(content, token: string) {
        const myHeaders = new HttpHeaders({ Accept: 'application/json', 'Content-Type': 'application/json', Authorization: 'Bearer ' + token });
        return this.http.put(this.config.apiBase + 'api/provider/profile/documents', JSON.stringify(content), { headers: myHeaders });
    }

}
