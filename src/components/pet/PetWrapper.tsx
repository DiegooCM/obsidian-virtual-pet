import { App } from "obsidian";
import { Ref } from "react";
import { AssetsProvider } from "src/contexts/AssetsContext";
import { PetViewRef } from "src/types";
import StatsHandler from "src/utils/statsHandler";
import PetView from "./PetView";

interface PetWrapperI {
  statsHandler: StatsHandler;
  app: App;
  ref: Ref<PetViewRef>;
}

export function PetWrapper({ statsHandler, app, ref }: PetWrapperI) {
  return (
    <AssetsProvider app={app}>
      <PetView statsHandler={statsHandler} app={app} ref={ref} />
    </AssetsProvider>
  );
}
