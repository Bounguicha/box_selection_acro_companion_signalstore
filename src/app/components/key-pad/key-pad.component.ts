import { ChangeDetectionStrategy, ChangeDetectorRef, Component, effect, inject } from '@angular/core';
import { BUTTON_CATEGORIES_MAP } from '../../constants/button-config';
import { BUTTON_CATEGORIES } from '../../enums/enums';
import { MatButton } from '@angular/material/button';
import { DataService } from '../../services/data.service';
import { NgStyle } from "@angular/common";
import { boxStore } from "../../store/data.store";
import {KeyButton} from "../../interfaces/key-button";

@Component({
  selector: 'app-key-pad',
  imports: [
    MatButton,
    NgStyle,
  ],
  templateUrl: './key-pad.component.html',
  standalone: true,
  styleUrl: './key-pad.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class KeyPadComponent {

  // Map of button categories and their associated buttons
  protected buttonList: Map<BUTTON_CATEGORIES, KeyButton[]> = BUTTON_CATEGORIES_MAP;

  // List of all categories
  protected buttonCategories: BUTTON_CATEGORIES[] = Object.values(BUTTON_CATEGORIES);

  // Index of the currently selected box
  index: number = 0;

  // Tracks which button was last clicked
  clickedButton = 0;

  private dataService: DataService = inject(DataService);
  private boxStore = inject(boxStore);

  constructor(private cdr: ChangeDetectorRef) {
    effect(() => {
      // Gets the current selected box index
      this.index = this.dataService.selectedBoxIndex()!;

      // Gets the current box's data from the box store
      const signal = this.boxStore.getBoxByIndex(this.index);

      this.clickedButton = signal()?.key!;
      this.cdr.markForCheck();
    });
  }

  /**
   * Handles the button click event on the keypad.
   * @param keyButton - The button that was clicked, contains button properties.
   */
  onButtonClick(keyButton: KeyButton): void {
    this.boxStore.addBox(this.index, keyButton);
    this.boxStore.writeToStorage();

    // Moves to the next box
    this.dataService.setSelectedBoxIndex(this.index + 1);
  }
}
