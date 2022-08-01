import {SelectedBadgeComponent} from './generics/selected-badge/selected-badge.component';
import {CUSTOM_ELEMENTS_SCHEMA, NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';

import {AppRoutingModule} from './app-routing.module';
import {AppComponent} from './app.component';
import {NavComponent} from './nav/nav.component';
import {HomeComponent} from './home/home.component';
import {RegisterComponent} from './register/register.component';
import {AuthComponent} from './auth/auth.component';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {NotyService} from './services/noty.service';
import {HttpClientModule, HTTP_INTERCEPTORS} from '@angular/common/http';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {ToastrModule} from 'ngx-toastr';
import {AuthInterceptor} from './auth/auth.interceptor';
import {AddOfferComponent} from './add-offer/add-offer.component';
import {SearchOffersComponent} from './search-offers/search-offers.component';
import {ProfileComponent} from './profile/profile.component';
import {MessagesComponent} from './messages/messages.component';
import {MenubarModule} from 'primeng/menubar';
import {CardModule} from 'primeng/card';
import {ButtonModule} from 'primeng/button';
import {InputTextModule} from 'primeng/inputtext';
import {InputNumberModule} from 'primeng/inputnumber';
import {DividerModule} from 'primeng/divider';
import {TableModule} from 'primeng/table';
import {RouterModule} from '@angular/router';
import {CommonModule} from '@angular/common';
import {RadioButtonModule} from 'primeng/radiobutton';
import {InputTextareaModule} from 'primeng/inputtextarea';
import {DropdownModule} from 'primeng/dropdown';
import {FileUploadModule} from 'primeng/fileupload';
import {PaginatorModule} from 'primeng/paginator';
import {OrderListModule} from 'primeng/orderlist';
import {TooltipModule} from 'primeng/tooltip';
import {ChipsModule} from 'primeng/chips';
import {SliderModule} from 'primeng/slider';
import {SelectButtonModule} from 'primeng/selectbutton';
import {BadgeModule} from 'primeng/badge';
import {OfferDetailsComponent} from './offer-details/offer-details.component';
import {SavedOffersComponent} from './saved-offers/saved-offers.component';
import {CalendarModule} from 'primeng/calendar';
import {ContextMenuModule} from 'primeng/contextmenu';
import {CallComponent} from './call/call.component';
import {DynamicDialogModule} from 'primeng/dynamicdialog';
import {DecisionCallComponent} from './decision-call/decision-call.component';
import {ServiceWorkerModule} from '@angular/service-worker';
import {AccordionModule} from 'primeng/accordion';
import {environment} from '../environments/environment';
import {
  MessagesUserListRightClickItemsResolver
} from './infrastructure/right-click-dropdown/messagesUserListRightClickItemsResolver';
import {ContactsComponent} from './contacts/contacts.component';
import {HttpErrorResponseHandler} from './common/handlers/httpErrorResponseHandler';
import {MailListComponent} from './generics/mail-list/mail-list.component';
import {CreateMailComponent} from './create-mail/create-mail.component';
import {MailService} from "./services/mail.service";
import {FontAwesomeModule} from '@fortawesome/angular-fontawesome';
import {NgxSpinnerModule} from "ngx-spinner";
import {RippleModule} from "primeng/ripple";
import {ListboxModule} from "primeng/listbox";
import {ToCapitalizePipe} from './pipes/to-capitalize.pipe';
import {MenuModule} from "primeng/menu";
import {PanelModule} from "primeng/panel";

@NgModule({
  declarations: [
    AppComponent,
    NavComponent,
    HomeComponent,
    RegisterComponent,
    AuthComponent,
    AddOfferComponent,
    SearchOffersComponent,
    SelectedBadgeComponent,
    ProfileComponent,
    MessagesComponent,
    OfferDetailsComponent,
    SavedOffersComponent,
    CallComponent,
    DecisionCallComponent,
    ContactsComponent,
    MailListComponent,
    CreateMailComponent,
    ToCapitalizePipe,
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    CommonModule,
    RouterModule,
    AppRoutingModule,
    FontAwesomeModule,
    ReactiveFormsModule,
    FormsModule,
    BrowserAnimationsModule,
    ToastrModule.forRoot(),
    MenubarModule,
    CardModule,
    ButtonModule,
    InputTextModule,
    InputNumberModule,
    DividerModule,
    RadioButtonModule,
    InputTextareaModule,
    DropdownModule,
    NgxSpinnerModule,
    FileUploadModule,
    PaginatorModule,
    OrderListModule,
    TooltipModule,
    AccordionModule,
    ChipsModule,
    SliderModule,
    BadgeModule,
    TableModule,
    SelectButtonModule,
    CalendarModule,
    DynamicDialogModule,
    ContextMenuModule,
    ServiceWorkerModule.register('ngsw-worker.js', {
      enabled: environment.production,
      // Register the ServiceWorker as soon as the app is stable
      // or after 30 seconds (whichever comes first).
      registrationStrategy: 'registerWhenStable:30000',
    }),
    ServiceWorkerModule.register('ngsw-worker.js', {
      enabled: environment.production,
      // Register the ServiceWorker as soon as the application is stable
      // or after 30 seconds (whichever comes first).
      registrationStrategy: 'registerWhenStable:30000'
    }),
    RippleModule,
    ListboxModule,
    MenuModule,
    PanelModule,
  ],
  providers: [
    NotyService,
    HttpErrorResponseHandler,
    MailService,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true,
    },
    MessagesUserListRightClickItemsResolver,
  ],
  bootstrap: [AppComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class AppModule {
}
