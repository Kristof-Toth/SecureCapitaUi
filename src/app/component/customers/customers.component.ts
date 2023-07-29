import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import {
  BehaviorSubject,
  catchError,
  map,
  Observable,
  of,
  startWith,
} from 'rxjs';
import { DataState } from 'src/app/enum/datastate.enum';
import { CustomHttpResponse, Page } from 'src/app/interface/appstates';
import { Customer } from 'src/app/interface/customer';
import { State } from 'src/app/interface/state';
import { User } from 'src/app/interface/user';
import { CustomerService } from 'src/app/service/customer.service';
import { UserService } from 'src/app/service/user.service';

@Component({
  selector: 'app-customers',
  templateUrl: './customers.component.html',
  styleUrls: ['./customers.component.css'],
})
export class CustomersComponent implements OnInit {
  customersState$: Observable<State<CustomHttpResponse<Page & User>>>;
  private dataSubject = new BehaviorSubject<CustomHttpResponse<Page & User>>(
    null
  );
  private isLoadingSubject = new BehaviorSubject<boolean>(false);
  isLoading$ = this.isLoadingSubject.asObservable();
  private currentPageSubject = new BehaviorSubject<number>(0);
  currentPage$ = this.currentPageSubject.asObservable();
  private showLogSubject = new BehaviorSubject<boolean>(false);
  showLog$ = this.showLogSubject.asObservable();
  readonly DataState = DataState;

  constructor(
    private userService: UserService,
    private customerService: CustomerService
  ) {}

  ngOnInit(): void {
    this.customersState$ = this.customerService.searchCustomers$().pipe(
      map((response) => {
        console.log(response);
        this.dataSubject.next(response);
        return {
          dataState: DataState.LOADED,
          appData: response,
        };
      }),
      startWith({ dataState: DataState.LOADING }),
      catchError((error: string) => {
        return of({
          dataState: DataState.ERROR,
          error,
        });
      })
    );
  }

  searchCustomers(searchForm: NgForm): void {
    this.currentPageSubject.next(0);
    this.customersState$ = this.customerService
      .searchCustomers$(searchForm.value.name)
      .pipe(
        map((response) => {
          console.log(response);
          this.dataSubject.next(response);
          return {
            dataState: DataState.LOADED,
            appData: response,
          };
        }),
        startWith({
          dataState: DataState.LOADED,
          appData: this.dataSubject.value,
        }),
        catchError((error: string) => {
          return of({
            dataState: DataState.ERROR,
            error,
          });
        })
      );
  }

  goToPage(pageNumber?: number, name?: string): void {
    this.customersState$ = this.customerService
      .searchCustomers$(name, pageNumber)
      .pipe(
        map((response) => {
          console.log(response);
          this.dataSubject.next(response);
          this.currentPageSubject.next(pageNumber);
          return {
            dataState: DataState.LOADED,
            appData: response,
          };
        }),
        startWith({
          dataState: DataState.LOADED,
          appData: this.dataSubject.value,
        }),
        catchError((error: string) => {
          return of({
            dataState: DataState.ERROR,
            appData: this.dataSubject.value,
            error,
          });
        })
      );
  }

  goToNextOrPreviousPage(direction?: string, name?: string): void {
    this.goToPage(
      direction === 'forward'
        ? this.currentPageSubject.value + 1
        : this.currentPageSubject.value - 1,
      name
    );
  }

  selectCustomer(customer: Customer): void {}
}
