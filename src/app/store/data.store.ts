import { signal, Signal, computed } from "@angular/core";
import { getState, patchState, signalStore, withMethods, withState } from "@ngrx/signals";
import { KeyButton } from "../interfaces/key-button";

type BoxState = {
  boxes: Signal<Map<number, KeyButton>>; // Stores boxes as a signal of a Map
};

const initialState: BoxState = {
  boxes: signal(new Map<number, KeyButton>()),
};

export const boxStore = signalStore(
  { providedIn: "root" },
  withState(initialState),
  withMethods((store) => {

    return {
      /**
       * Adds a box to the storage.
       * @param index The box index.
       * @param value The box value.
       */
      addBox(index: number, value: KeyButton): void {
        patchState(store, (state) => ({
          boxes: signal(new Map([...state.boxes(), [index, value]])),
        }));
      },

      /**
       * Retrieves a box based on its index.
       * @param index The box index.
       * @returns A Signal holding the KeyButton
       */
      getBoxByIndex(index: number): Signal<KeyButton | undefined> {
        return computed(() => {
          const boxesMap = getState(store).boxes();
          return boxesMap.get(index);
        });
      },

      /**
       * Clears all the boxes in the current state.
       */
      clearBoxes(): void {
        patchState(store, () => ({
          boxes: signal(new Map()), // Reset the boxes map to an empty instance
        }));
      },

      /**
       * Calculates the total sum of all "key" values in the boxes.
       * @returns A Signal holding the total sum.
       */
      calculateSum(): Signal<number> {
        return computed(() => {
          const boxes = getState(store).boxes();
          return Array.from(boxes.values()).reduce((acc, box) => acc + box.key, 0);
        });
      },

      /**
       * Reads the boxes from storage.
       */
      readFromStorage(): void {
        const savedBoxes = localStorage.getItem('boxes');
        if (savedBoxes) {
          const parsedBoxes = new Map<number, KeyButton>(JSON.parse(savedBoxes));
          patchState(store, () => ({
            boxes: signal(parsedBoxes),
          }));
        }
      },

      /**
       * Writes the current boxes state to the storage.
       */
      writeToStorage(): void {
        const boxes = getState(store).boxes();
        localStorage.setItem('boxes', JSON.stringify(Array.from(boxes.entries())));
      },

      /**
       * Clears the storage where boxes are saved.
       */
      clearStorage(): void {
        localStorage.clear();
      },
    };
  })
);
