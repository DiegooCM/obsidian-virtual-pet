import { App } from "obsidian"
import { RefObject, useContext, useEffect, useRef } from "react"
import { AssetsContext } from "src/contexts/AssetsContext"
import { AssetsContextI, UserItems } from "src/types"
import { ShopModal } from "../shop/ShopModal";
import StatsHandler from "src/utils/statsHandler"

type PetTopBarT = {
  app: App,
  statsHandler: StatsHandler,
  setUserItems: React.Dispatch<React.SetStateAction<UserItems>>,
  coins: number
}

export function PetTopBar({app, statsHandler, setUserItems, coins}:PetTopBarT) {
  const coinRef: RefObject<HTMLImageElement | null> = useRef(null)
  const { getAsset } = useContext<AssetsContextI>(AssetsContext)

  useEffect(() => {
    // Add the coin asset to the coinRef
    getAsset("Others", "coin").then((asset) => {
      if (coinRef.current) coinRef.current.src = asset
    })
  }, [])

  return(
    <div
      className="top-bar"
    >
      <div 
        onClick={() =>
          new ShopModal(app, getAsset, statsHandler, setUserItems).open()
        }
        style={{display: "flex", cursor: "pointer"}}
      >
        <img className="top-bar-coin" ref={coinRef}/>
        <p
          className="coins-count"
        >
          {coins}
        </p>
      </div>
    </div>
  )
}

