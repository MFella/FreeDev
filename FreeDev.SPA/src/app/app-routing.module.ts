import { SavedOffersResolver } from './resolvers/saved-offers.resolver';
import { SavedOffersComponent } from './saved-offers/saved-offers.component';
import { MessagesComponent } from './messages/messages.component';
import { ProfileComponent } from './profile/profile.component';
import { AuthGuard } from './guards/auth.guard';
import { SearchOffersComponent } from './search-offers/search-offers.component';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AddOfferComponent } from './add-offer/add-offer.component';
import { AuthComponent } from './auth/auth.component';
import { NotLoggedGuard } from './guards/not-logged.guard';
import { HomeComponent } from './home/home.component';
import { RegisterComponent } from './register/register.component';
import { Roles } from './types/roles.enum';
import { RoleGuard } from './guards/role.guard';
import { ProfileResolver } from './resolvers/profile.resolver';
import { UsersChatListResolver } from './resolvers/users-chat-list.resolver';
import { OfferDetailsComponent } from './offer-details/offer-details.component';
import { OfferDetailResolver } from './resolvers/offer-detail.resolver';
import { OfferListResolver } from './resolvers/offer-list.resolver';

const routes: Routes = [
  { path: 'home', component: HomeComponent },
  { path: 'login', component: AuthComponent, canActivate: [NotLoggedGuard] },
  {
    path: 'register',
    component: RegisterComponent,
    canActivate: [NotLoggedGuard],
  },
  {
    path: 'add-offer',
    component: AddOfferComponent,
    canActivate: [AuthGuard, RoleGuard],
    data: { role: Roles.HUNTER },
  },
  {
    path: 'search-offers',
    component: SearchOffersComponent,
    resolve: {
      offerWithLength: OfferListResolver,
    },
    canActivate: [AuthGuard],
  },
  {
    path: 'offer-details/:id',
    component: OfferDetailsComponent,
    canActivate: [AuthGuard],
    resolve: {
      offer: OfferDetailResolver,
    },
  },
  {
    path: 'saved-offers',
    component: SavedOffersComponent,
    canActivate: [AuthGuard],
    resolve: {
      offers: SavedOffersResolver,
    },
  },
  {
    path: 'profile',
    component: ProfileComponent,
    resolve: {
      profile: ProfileResolver,
    },
  },
  {
    path: 'messages',
    component: MessagesComponent,
    resolve: {
      users: UsersChatListResolver,
    },
  },
  { path: '**', redirectTo: 'home' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
