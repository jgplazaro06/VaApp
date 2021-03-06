import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { AuthGuardService } from './services/auth-guard.service';

const routes: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  { path: 'home', loadChildren: './home/home.module#HomePageModule' },

  { path: 'ambassador-category-holder', loadChildren: './ambassador-category-holder/ambassador-category-holder.module#AmbassadorCategoryHolderPageModule' },
  { path: 'ambassador-contact', loadChildren: './ambassador-contact/ambassador-contact.module#AmbassadorContactPageModule' },
  { path: 'ambassador-profile', loadChildren: './ambassador-profile/ambassador-profile.module#AmbassadorProfilePageModule' },
  { path: 'ambassadors', loadChildren: './ambassadors/ambassadors.module#AmbassadorsPageModule' },
  { path: 'change-password', loadChildren: './change-password/change-password.module#ChangePasswordPageModule' },
  { path: 'contact-profiles', loadChildren: './contact-profiles/contact-profiles.module#ContactProfilesPageModule' },
  { path: 'corporate', loadChildren: './corporate/corporate.module#CorporatePageModule' },
  { path: 'corporate-category-holder', loadChildren: './corporate-category-holder/corporate-category-holder.module#CorporateCategoryHolderPageModule' },
  { path: 'corporate-profile', loadChildren: './corporate-profile/corporate-profile.module#CorporateProfilePageModule' },
  { path: 'create-travel-request', loadChildren: './create-travel-request/create-travel-request.module#CreateTravelRequestPageModule' },
  { path: 'edit-power', loadChildren: './edit-power/edit-power.module#EditPowerPageModule' },
  { path: 'edit-va', loadChildren: './edit-va/edit-va.module#EditVaPageModule' },

  { path: 'login', loadChildren: './login/login.module#LoginPageModule' },
  { path: 'my-tools', loadChildren: './my-tools/my-tools.module#MyToolsPageModule' },
  { path: 'nomination-profile', loadChildren: './nomination-profile/nomination-profile.module#NominationProfilePageModule' },
  { path: 'nominations', loadChildren: './nominations/nominations.module#NominationsPageModule', canActivate: [AuthGuardService] },
  { path: 'nominee-category-holder', loadChildren: './nominee-category-holder/nominee-category-holder.module#NomineeCategoryHolderPageModule' },
  { path: 'notifications', loadChildren: './notifications/notifications.module#NotificationsPageModule' },
  { path: 'profile', loadChildren: './profile/profile.module#ProfilePageModule' },
  { path: 'profile-list', loadChildren: './profile-list/profile-list.module#ProfileListPageModule' },
  { path: 'single-notif', loadChildren: './single-notif/single-notif.module#SingleNotifPageModule' },
  { path: 'single-travel-request', loadChildren: './single-travel-request/single-travel-request.module#SingleTravelRequestPageModule' },
  { path: 'single-video', loadChildren: './single-video/single-video.module#SingleVideoPageModule' },
  { path: 'travel-request', loadChildren: './travel-request/travel-request.module#TravelRequestPageModule', canActivate: [AuthGuardService] },
  { path: 'videos', loadChildren: './videos/videos.module#VideosPageModule' },

  { path: 'ambassador-founder', loadChildren: './ambassador-founder/ambassador-founder.module#AmbassadorFounderPageModule' },
  { path: 'ambassador-partners', loadChildren: './ambassador-partners/ambassador-partners.module#AmbassadorPartnersPageModule' },
  { path: 'ambassador-associate', loadChildren: './ambassador-associate/ambassador-associate.module#AmbassadorAssociatePageModule' },
  { path: 'ambassador-council', loadChildren: './ambassador-council/ambassador-council.module#AmbassadorCouncilPageModule' },
  { path: 'tools', loadChildren: './tools/tools.module#ToolsPageModule', canActivate: [AuthGuardService] },
  { path: 'forgot-password', loadChildren: './forgot-password/forgot-password.module#ForgotPasswordPageModule' },
  { path: 'search-page', loadChildren: './search-page/search-page.module#SearchPagePageModule' },
  { path: 'nomination-history', loadChildren: './nomination-history/nomination-history.module#NominationHistoryPageModule' },
  { path: 'login-admin', loadChildren: './login-admin/login-admin.module#LoginAdminPageModule' },
  { path: 'tools-landing', loadChildren: './tools-landing/tools-landing.module#ToolsLandingPageModule' },
  { path: 'travel-send-request', loadChildren: './travel-send-request/travel-send-request.module#TravelSendRequestPageModule' },
  { path: 'directory', loadChildren: './directory/directory.module#DirectoryPageModule' },
  { path: 'pdf-votes', loadChildren: './pdf-votes/pdf-votes.module#PdfVotesPageModule', canActivate: [AuthGuardService] },
  { path: 'nomination-history-profile', loadChildren: './nomination-history-profile/nomination-history-profile.module#NominationHistoryProfilePageModule' },
  { path: 'nomination-history-holder', loadChildren: './nomination-history-holder/nomination-history-holder.module#NominationHistoryHolderPageModule' },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
