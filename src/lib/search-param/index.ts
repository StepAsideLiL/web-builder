import { createLoader, parseAsString, parseAsStringEnum } from "nuqs/server";

export enum Action {
  newPage = "new-page",
  edit = "edit",
}

// Describe your search params, and reuse this in useQueryStates / createSerializer:
export const pageActions = {
  // action: parseAsString.withDefault(""),
  action: parseAsStringEnum<Action>(Object.values(Action)).withDefault(
    Action.newPage,
  ),
  pageId: parseAsString.withDefault(""),
};

export const loadSearchParams = createLoader(pageActions);
