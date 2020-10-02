import thunk from "redux-thunk";
import configureStore, { MockStoreEnhanced } from "redux-mock-store";
import { RootState } from "./store";

export const generateMockStore = (state: RootState): MockStoreEnhanced<RootState> => {
  const mockStore = configureStore<RootState>([thunk]);
  const store = mockStore(state);

  store.clearActions();
  return store;
};