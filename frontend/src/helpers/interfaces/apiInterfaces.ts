import { System } from "@src/store/reducers/generated";

export type ModifiedSystem = System & {
  processor: string;
};
