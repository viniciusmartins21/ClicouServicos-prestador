/* eslint-disable max-len */
import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { LoginGuard } from './services/guard/login-guard.service';

const routes: Routes = [
  {
    path: '',
    loadChildren: () => import('./pages/dashboard/tabs/tabs.module').then(m => m.TabsPageModule),
    canActivate: [LoginGuard]
  },
  {
    path: 'sign-in',
    loadChildren: () => import('./pages/sign-in/sign-in.module').then(m => m.SignInPageModule)
  },
  {
    path: 'register',
    loadChildren: () => import('./pages/register/register.module').then(m => m.RegisterPageModule)
  },
  {
    path: 'verification',
    loadChildren: () => import('./pages/verification/verification.module').then(m => m.VerificationPageModule)
  },
  {
    path: 'chat',
    loadChildren: () => import('./pages/dashboard/messages/chat/chat.module').then(m => m.ChatPageModule)
  },
  {
    // caminho para avaliacao
    path: 'feedback',
    loadChildren: () => import('./pages/dashboard/feedback/feedback.module').then(m => m.FeedbackPageModule)
  },
  {
    path: 'account',
    loadChildren: () => import('./pages/dashboard/account/account.module').then(m => m.AccountPageModule)
  },
  {
    path: 'my-profile',
    loadChildren: () => import('./pages/dashboard/account/my-profile/my-profile.module').then(m => m.MyProfilePageModule)
  },
  {
    path: 'add-scheduling',
    loadChildren: () => import('./pages/dashboard/account/my-profile/add-scheduling/add-scheduling.module').then(m => m.AddSchedulingPageModule)
  },
  {
    path: 'add-services',
    loadChildren: () => import('./pages/dashboard/account/my-profile/add-services/add-services.module').then(m => m.AddServicesPageModule)
  },
  {
    path: 'add-specializations',
    loadChildren: () => import('./pages/dashboard/account/my-profile/add-specializations/add-specializations.module').then(m => m.AddSpecializationsPageModule)
  },
  {
    path: 'contact-us',
    loadChildren: () => import('./pages/dashboard/account/contact-us/contact-us.module').then(m => m.ContactUsPageModule)
  },
  {
    path: 'faq',
    loadChildren: () => import('./pages/dashboard/account/faq/faq.module').then(m => m.FaqPageModule)
  },
  {
    path: 'map-view',
    loadChildren: () => import('./pages/dashboard/appointments/appointment-detail/map-view/map-view.module').then(m => m.MapViewPageModule)
  },
  {
    path: 'tnc',
    loadChildren: () => import('./pages/global/tnc/tnc.module').then(m => m.TncPageModule)
  },
  {
    path: 'appointments',
    loadChildren: () => import('./pages/dashboard/appointments/appointments.module').then(m => m.AppointmentsPageModule)
  },
  {
    path: 'notifications',
    loadChildren: () => import('./pages/dashboard/account/notifications/notifications.module').then(m => m.NotificationsPageModule)
  },
  {
    path: 'add-address',
    loadChildren: () => import('./pages/dashboard/account/my-profile/add-address/add-address.module').then(m => m.AddAddressPageModule)
  },
  {
    path: 'new-schedule',
    loadChildren: () => import('./pages/dashboard/account/my-profile/add-scheduling/new-schedule/new-schedule.module').then(m => m.NewSchedulePageModule)
  },
  {
    path: 'appointment-detail',
    loadChildren: () => import('./pages/dashboard/appointments/appointment-detail/appointment-detail.module').then( m => m.AppointmentDetailPageModule)
  },
  {
    path: 'bank-account',
    loadChildren: () => import('./pages/dashboard/account/bank-account/bank-account.module').then( m => m.BankAccountPageModule)
  },
  {
    path: 'verification-email',
    loadChildren: () => import('./pages/verification-email/verification-email.module').then( m => m.VerificationEmailPageModule)
  }
];
@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
