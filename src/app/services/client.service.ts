/* eslint-disable max-len */
/* eslint-disable @typescript-eslint/naming-convention */
import { Injectable, Inject } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { APP_CONFIG, AppConfig } from '../app.config';
import { Country } from '../models/country.models';
import { Setting } from '../models/setting.models';
import { ResetPasswordResponse } from '../models/reset-password-request.models';
import { AuthResponse } from '../models/auth-response.models';
import { SignUpRequest } from '../models/signup-request.models';
import { BaseListResponse } from '../models/base-list.models';
import { Profile } from '../models/profile.models';
import { ProfileUpdateRequest } from '../models/profile-update-request.models';
import { SupportRequest } from '../models/support-request.models';
import { Appointment } from '../models/appointment.models';
import { User } from '../models/user.models';
import { Rating } from '../models/rating.models';
import { ProviderPortfolio } from '../models/provider-portfolio.models';
import { SocialLoginRequest } from '../models/sociallogin-request.models';
import { Faq } from '../models/faq.models';
import { Observable } from 'rxjs';
import { Category } from '../models/category.models';

@Injectable()
export class ClientService {
    constructor(@Inject(APP_CONFIG) private config: AppConfig, private http: HttpClient) {

    }

    sendCodeEmail(data: any): Observable<AuthResponse> {
        const myHeaders = new HttpHeaders({ Accept: 'application/json', 'Content-Type': 'application/json' });
        return this.http.post<AuthResponse>(this.config.apiBase + 'api/send-code-email', JSON.stringify(data), { headers: myHeaders });
    }

    verifyCodeEmail(data: any): Observable<AuthResponse> {
        const myHeaders = new HttpHeaders({ Accept: 'application/json', 'Content-Type': 'application/json' });
        return this.http.post<AuthResponse>(this.config.apiBase + 'api/verify-code-email', JSON.stringify(data), { headers: myHeaders });
    }

    public getCountries(): Observable<Array<Country>> {
        return this.http.get<Array<Country>>('./assets/json/countries.json');
        /*
        .concatMap((data) => {
            return Observable.of(data);
        });
        */
    }

    public getSettings(): Observable<Array<Setting>> {
        const myHeaders = new HttpHeaders({ Accept: 'application/json', 'Content-Type': 'application/json' });
        return this.http.get<Array<Setting>>(this.config.apiBase + 'api/settings', { headers: myHeaders });
        /*
        .concatMap(data => {
            return Observable.of(data);
        });
        */
    }

    public forgetPassword(resetRequest: any): Observable<ResetPasswordResponse> {
        const myHeaders = new HttpHeaders({ Accept: 'application/json', 'Content-Type': 'application/json' });
        return this.http.post<ResetPasswordResponse>(this.config.apiBase + 'api/forgot-password', JSON.stringify(resetRequest), { headers: myHeaders });
        /*
        .concatMap(data => {
            return Observable.of(data);
        });
        */
    }

    public login(loginTokenRequest: any): Observable<AuthResponse> {
        const myHeaders = new HttpHeaders({ Accept: 'application/json', 'Content-Type': 'application/json' });
        return this.http.post<AuthResponse>(this.config.apiBase + 'api/login', JSON.stringify(loginTokenRequest), { headers: myHeaders });
        /*
        .concatMap(data => {
            return Observable.of(data);
        });
        */
    }

    public loginSocial(socialLoginRequest: SocialLoginRequest): Observable<AuthResponse> {
        const myHeaders = new HttpHeaders({ Accept: 'application/json', 'Content-Type': 'application/json' });
        return this.http.post<AuthResponse>(this.config.apiBase + 'api/social/login', socialLoginRequest, { headers: myHeaders });
        /*
        .concatMap(data => {
            return Observable.of(data);
        });
        */
    }

    public signUp(signUpRequest: SignUpRequest): Observable<AuthResponse> {
        const myHeaders = new HttpHeaders({ Accept: 'application/json', 'Content-Type': 'application/json' });
        return this.http.post<AuthResponse>(this.config.apiBase + 'api/register', JSON.stringify(signUpRequest), { headers: myHeaders });
        /*
        .concatMap(data => {
            return Observable.of(data);
        });
        */
    }

    public verifyMobile(verifyRequest: any): Observable<AuthResponse> {
        const myHeaders = new HttpHeaders({ Accept: 'application/json', 'Content-Type': 'application/json' });
        return this.http.post<AuthResponse>(this.config.apiBase + 'api/verify-mobile', JSON.stringify(verifyRequest), { headers: myHeaders });
        /*
        .concatMap(data => {
            return Observable.of(data);
        });
        */
    }

    public checkUser(checkUserRequest: any): Observable<any> {
        const myHeaders = new HttpHeaders({ Accept: 'application/json', 'Content-Type': 'application/json' });
        return this.http.post<any>(this.config.apiBase + 'api/check-user', JSON.stringify(checkUserRequest), { headers: myHeaders });
        /*
        .concatMap(data => {
            return Observable.of(data);
        });
        */
    }

    public updateProfile(token: string, profileRequest: ProfileUpdateRequest): Observable<Profile> {
        const myHeaders = new HttpHeaders({ Accept: 'application/json', 'Content-Type': 'application/json', Authorization: 'Bearer ' + token });
        return this.http.put<Profile>(this.config.apiBase + 'api/provider/profile', JSON.stringify(profileRequest), { headers: myHeaders });
        /*
        .concatMap(data => {
            return Observable.of(data);
        });
        */
    }

    saveSpecialization(token: string, content): Observable<Profile> {
        const myHeaders = new HttpHeaders({ Accept: 'application/json', 'Content-Type': 'application/json', Authorization: 'Bearer ' + token });
        return this.http.put<Profile>(this.config.apiBase + 'api/provider/profile/category', JSON.stringify(content), { headers: myHeaders });
    }

    saveSpecialization2(token: string, content) {
        const myHeaders = new HttpHeaders({ Accept: 'application/json', 'Content-Type': 'application/json', Authorization: 'Bearer ' + token });
        return this.http.put(this.config.apiBase + 'api/provider/profile/category?category_id=' + content.primary_category_id + '&sub_categories=-1', null, { headers: myHeaders });
    }

    saveServices(token: string, content) {
        const myHeaders = new HttpHeaders({ Accept: 'application/json', 'Content-Type': 'application/json', Authorization: 'Bearer ' + token });
        return this.http.put(this.config.apiBase + 'api/provider/profile/category?category_id=' + content.category + '&sub_categories=' + content.subcategories, null, { headers: myHeaders });
    }

    getServices(token: string, category: number): Observable<Category> {
        const myHeaders = new HttpHeaders({ Accept: 'application/json', 'Content-Type': 'application/json', Authorization: 'Bearer ' + token });
        return this.http.get<Category>(this.config.apiBase + 'api/provider/profile/category?category_id=' + category, { headers: myHeaders });
    }

    getCategories(token: string): Observable<BaseListResponse> {
        const myHeaders = new HttpHeaders({ Accept: 'application/json', 'Content-Type': 'application/json', Authorization: 'Bearer ' + token });
        return this.http.get<BaseListResponse>(this.config.apiBase + 'api/category', { headers: myHeaders });
    }

    getScheduleTime(token: string, page: number) {
        const myHeaders = new HttpHeaders({ Accept: 'application/json', 'Content-Type': 'application/json', Authorization: 'Bearer ' + token });
        return this.http.get(this.config.apiBase + 'api/provider/cronograma?page=' + page, { headers: myHeaders });
    }

    saveScheduleTime(token: string, content) {
        const myHeaders = new HttpHeaders({ Accept: 'application/json', 'Content-Type': 'application/json', Authorization: 'Bearer ' + token });
        return this.http.post(this.config.apiBase + 'api/provider/cronograma/register', JSON.stringify(content), { headers: myHeaders });
    }

    updateScheduleTime(token: string, content) {
        const myHeaders = new HttpHeaders({ Accept: 'application/json', 'Content-Type': 'application/json', Authorization: 'Bearer ' + token });
        return this.http.put(this.config.apiBase + 'api/provider/cronograma/update?cronograma_id=' + content.id, JSON.stringify(content), { headers: myHeaders });
    }

    deleteScheduleTime(token: string, id: number) {
        const myHeaders = new HttpHeaders({ Accept: 'application/json', 'Content-Type': 'application/json', Authorization: 'Bearer ' + token });
        return this.http.delete(this.config.apiBase + 'api/provider/cronograma/delete?cronograma_id=' + id, { headers: myHeaders });
    }

    public categoryChildren(token: string, parentId: number): Observable<BaseListResponse> {
        const myHeaders = new HttpHeaders({ Accept: 'application/json', 'Content-Type': 'application/json', Authorization: 'Bearer ' + token });
        return this.http.get<BaseListResponse>(this.config.apiBase + 'api/category?category_id=' + parentId, { headers: myHeaders });
        /*
        .concatMap(data => {
            return Observable.of(data);
        });
        */
    }

    public getProfile(token: string): Observable<Profile> {
        const myHeaders = new HttpHeaders({ Accept: 'application/json', 'Content-Type': 'application/json', Authorization: 'Bearer ' + token });
        return this.http.get<Profile>(this.config.apiBase + 'api/provider/profile', { headers: myHeaders });
        /*
        .concatMap(data => {
            return Observable.of(data);
        });
        */
    }

    public getRatings(token: string, userId: number): Observable<Rating> {
        const myHeaders = new HttpHeaders({ Accept: 'application/json', 'Content-Type': 'application/json', Authorization: 'Bearer ' + token });
        return this.http.get<Rating>(this.config.apiBase + 'api/customer/providers/' + userId + '/rating-summary', { headers: myHeaders });
        /*
        .concatMap(data => {
            data.average_rating = Number(data.average_rating).toFixed(2);
            return Observable.of(data);
        });
        */
    }

    public getMyReviews(token: string, pageNo: number): Observable<BaseListResponse> {
        const myHeaders = new HttpHeaders({ Accept: 'application/json', 'Content-Type': 'application/json', Authorization: 'Bearer ' + token });
        return this.http.get<BaseListResponse>(this.config.apiBase + 'api/provider/ratings/?page=' + pageNo, { headers: myHeaders });
        /*
        .concatMap(data => {
            let locale = Helper.getLocale();
            for (let review of data.data) {
                review.created_at = Helper.formatTimestampDate(review.created_at, locale);
            }
            return Observable.of(data);
        });
        */
    }

    public getMyPortfolio(token: string): Observable<Array<ProviderPortfolio>> {
        const myHeaders = new HttpHeaders({ Accept: 'application/json', 'Content-Type': 'application/json', Authorization: 'Bearer ' + token });
        return this.http.get<Array<ProviderPortfolio>>(this.config.apiBase + 'api/provider/portfolio', { headers: myHeaders });
        /*
        .concatMap(data => {
            return Observable.of(data);
        });
        */
    }

    public addMyPortfolio(token: string, folioBody: { image_url: string; link: string }): Observable<ProviderPortfolio> {
        const myHeaders = new HttpHeaders({ Accept: 'application/json', 'Content-Type': 'application/json', Authorization: 'Bearer ' + token });
        return this.http.post<ProviderPortfolio>(this.config.apiBase + 'api/provider/portfolio', folioBody, { headers: myHeaders });
        /*
        .concatMap(data => {
            return Observable.of(data);
        });
        */
    }

    public deleteMyPortfolio(token: string, folioId): Observable<ProviderPortfolio> {
        const myHeaders = new HttpHeaders({ Accept: 'application/json', 'Content-Type': 'application/json', Authorization: 'Bearer ' + token });
        return this.http.delete<ProviderPortfolio>(this.config.apiBase + 'api/provider/portfolio/' + folioId, { headers: myHeaders });
        /*
        .concatMap(data => {
            return Observable.of(data);
        });
        */
    }

    public submitSupport(token: string, supportRequest: SupportRequest): Observable<any> {
        const myHeaders = new HttpHeaders({ Accept: 'application/json', 'Content-Type': 'application/json', Authorization: 'Bearer ' + token });
        return this.http.post<any>(this.config.apiBase + 'api/support', supportRequest, { headers: myHeaders });
        /*
        .concatMap(data => {
            return Observable.of(data);
        });
        */
    }

    public appointments(token: string, pageNo: number): Observable<BaseListResponse> {
        const myHeaders = new HttpHeaders({ Accept: 'application/json', 'Content-Type': 'application/json', Authorization: 'Bearer ' + token });
        return this.http.get<BaseListResponse>(this.config.apiBase + 'api/provider/appointment?page=' + pageNo, { headers: myHeaders });
        /*
        .concatMap(data => {
            let locale = Helper.getLocale();
            for (let ap of data.data) {
                ap.created_at = Helper.formatTimestampDateTime(ap.created_at, locale);
                ap.updated_at = Helper.formatTimestampDateTime(ap.updated_at, locale);
                for (let log of ap.logs) {
                    log.updated_at = Helper.formatTimestampDateTime(log.updated_at, locale);
                    log.created_at = Helper.formatTimestampDateTime(log.created_at, locale);
                }
                ap.date = Helper.formatTimestampDate(ap.date, locale);
                ap.time_from = ap.time_from.substr(0, ap.time_from.lastIndexOf(":"));
                ap.time_to = ap.time_to.substr(0, ap.time_to.lastIndexOf(":"));
            }
            return Observable.of(data);
        });
        */
    }

    public appointmentUpdate(token: string, apId: number, status: string): Observable<Appointment> {
        const myHeaders = new HttpHeaders({ Accept: 'application/json', 'Content-Type': 'application/json', Authorization: 'Bearer ' + token });
        return this.http.put<Appointment>(this.config.apiBase + 'api/provider/appointment/' + apId, { status }, { headers: myHeaders });
        /*
        .concatMap(data => {
            let locale = Helper.getLocale();
            data.updated_at = Helper.formatTimestampDateTime(data.updated_at, locale);
            data.created_at = Helper.formatTimestampDateTime(data.created_at, locale);
            for (let log of data.logs) {
                log.updated_at = Helper.formatTimestampDateTime(log.updated_at, locale);
                log.created_at = Helper.formatTimestampDateTime(log.created_at, locale);
            }
            data.date = Helper.formatTimestampDate(data.date, locale);
            data.time_from = data.time_from.substr(0, data.time_from.lastIndexOf(":"));
            data.time_to = data.time_to.substr(0, data.time_to.lastIndexOf(":"));
            return Observable.of(data);
        });
        */
    }

    public updateUser(token: string, requestBody: any): Observable<User> {
        const myHeaders = new HttpHeaders({ Accept: 'application/json', 'Content-Type': 'application/json', Authorization: 'Bearer ' + token });
        return this.http.put<User>(this.config.apiBase + 'api/user', requestBody, { headers: myHeaders });
        /*
        .concatMap(data => {
            return Observable.of(data);
        });
        */
    }

    public logActivity(token: string): Observable<any> {
        const myHeaders = new HttpHeaders({ Accept: 'application/json', 'Content-Type': 'application/json', Authorization: 'Bearer ' + token });
        return this.http.post<any>(this.config.apiBase + 'api/activity-log', {}, { headers: myHeaders });
        /*
        .concatMap(data => {
            return Observable.of(data);
        });
        */
    }

    public faqs(): Observable<Array<Faq>> {
        const myHeaders = new HttpHeaders({ 'Content-Type': 'application/json', Accept: 'application/json' });
        return this.http.get<Array<Faq>>(this.config.apiBase + 'api/faq-help', { headers: myHeaders });
        /*
        .concatMap(data => {
            return Observable.of(data);
        });
        */
    }

    public postNotification(token: string, roleTo: string, userIdTo: string): Observable<any> {
        const myHeaders = new HttpHeaders({ Accept: 'application/json', 'Content-Type': 'application/json', Authorization: 'Bearer ' + token });
        return this.http.post<any>(this.config.apiBase + 'api/user/push-notification', { role: roleTo, user_id: userIdTo }, { headers: myHeaders });
        /*
        .concatMap(data => {
            return Observable.of(data);
        });
        */
    }

    verifyCEP(cep): Observable<any> {
        const url = 'https://viacep.com.br/ws/' + cep + '/json/';

        return this.http.get(url);
    }

    saveAddress(token: string, address: string): Observable<any> {
        const myHeaders = new HttpHeaders({ Accept: 'application/json', 'Content-Type': 'application/json', Authorization: 'Bearer ' + token });
        return this.http.put<any>(this.config.apiBase + 'api/provider/profile', { address }, { headers: myHeaders });
    }

    updateAppointment(token: string, apId: number, status: string): Observable<Appointment> {
        const myHeaders = new HttpHeaders({ Accept: 'application/json', 'Content-Type': 'application/json', Authorization: 'Bearer ' + token });
        return this.http.put<Appointment>(this.config.apiBase + 'api/provider/appointment/' + apId, { status }, { headers: myHeaders });
    }

    sendCoord(token: string, id: number, coords: any): Observable<Appointment> {
        const myHeaders = new HttpHeaders({ Accept: 'application/json', 'Content-Type': 'application/json', Authorization: 'Bearer ' + token });
        return this.http.post<Appointment>(this.config.apiBase + 'api/provider/appointment/onway', { appointment_id: id, latitude: coords.latitude, longitude: coords.longitude }, { headers: myHeaders });
    }

    getBanks() {
        return this.http.get('assets/json/banks.json');
    }

    getBankAccount(token: string) {
        const myHeaders = new HttpHeaders({ Accept: 'application/json', 'Content-Type': 'application/json', Authorization: 'Bearer ' + token });
        return this.http.get(this.config.apiBase + 'api/provider/profile/contapagarme', { headers: myHeaders });
    }

    saveBankAccount(token: string, content: any) {
        const myHeaders = new HttpHeaders({ Accept: 'application/json', 'Content-Type': 'application/json', Authorization: 'Bearer ' + token });
        return this.http.put(this.config.apiBase + 'api/provider/profile/contapagarme', content, { headers: myHeaders });
    }

    getProviderCoords(token: string, id: number) {
        const myHeaders = (token && token.length) ? new HttpHeaders({ Accept: 'application/json', 'Content-Type': 'application/json', Authorization: 'Bearer ' + token }) : new HttpHeaders({ Accept: 'application/json', 'Content-Type': 'application/json' });
        return this.http.get(this.config.apiBase + 'api/customer/appointment/onway?appointment_id=' + id, { headers: myHeaders });
    }

}
