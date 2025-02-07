import {AfterViewInit, ChangeDetectionStrategy, ChangeDetectorRef, Component, inject} from '@angular/core';
import { DataService } from '../../services/data.service';
import { KeyPadComponent } from '../key-pad/key-pad.component';
import { ClickableBoxComponent } from '../clickable-box/clickable-box.component';
import { MatIcon } from '@angular/material/icon';
import { MatMiniFabButton } from '@angular/material/button';
import {boxStore} from "../../store/data.store";

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    KeyPadComponent,
    ClickableBoxComponent,
    MatIcon,
    MatMiniFabButton,
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush

})
export class HomeComponent implements AfterViewInit{
  public dataService: DataService = inject(DataService)
  public store = inject(boxStore)
  constructor(private cdr: ChangeDetectorRef) {
  }

  /**
   *  ensures the store is loaded from localStorage and triggers an initial change detection cycle.
   */
  ngAfterViewInit() {
    this.store.readFromStorage()
    this.cdr.detectChanges();
  }

  /**
   * Resets all data and clears the application state.
   */
  public resetBoxValues(): void {
    this.dataService.clearSelectedIndex(); // Clears the selected index in the service
    this.store.clearBoxes(); // Clears the sum map holding box values
    this.store.clearStorage();
  }


}
