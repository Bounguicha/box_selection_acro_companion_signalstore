import { ChangeDetectorRef, Component, effect, inject, Input } from '@angular/core';
import { NgClass } from '@angular/common';
import { DataService } from '../../services/data.service';
import { boxStore } from '../../store/data.store';
import { KeyButton } from "../../interfaces/key-button";

@Component({
  selector: 'app-clickable-box',
  standalone: true,
  templateUrl: './clickable-box.component.html',
  styleUrls: ['./clickable-box.component.scss'],
  imports: [NgClass],
})
export class ClickableBoxComponent {
  @Input() index: number = 0; // Input to set the position of the box.

  public selectedIndex: number | null = null; // Tracks the selected box index.
  public value: string = '';
  public key: number = 0;

  private readonly store = inject(boxStore);
  public dataService: DataService = inject(DataService);

  /**
   * Reacts to changes in the store and updates the component's state.
   * Ensures the displayed value and selection index are in sync with the store.
   */
  constructor(
    private readonly cdr: ChangeDetectorRef
  ) {

    effect(() => {
      const signal = this.store.getBoxByIndex(this.index);

      this.handleBoxValueUpdate(signal()!); // Update box value.
      this.selectedIndex = this.dataService.selectedBoxIndex(); // Update selection state.

      this.cdr.markForCheck();
    });
  }

  /**
   * Handles click events on the box.
   * Updates the selected box index in the DataService.
   */
  public onElementClick(): void {
    this.dataService.setSelectedBoxIndex(this.index);
  }

  /**
   * Updates the display value and key based on the provided KeyButton data.
   * Resets values if the box data is not available.
   * @param boxValue Data object containing the key and value for the box.
   */
  private handleBoxValueUpdate(boxValue: KeyButton): void {
    if (boxValue) {
      this.value = boxValue.output;
      this.key = boxValue.key;
    } else {
      this.value = '';
      this.key = 0;
    }
  }
}
