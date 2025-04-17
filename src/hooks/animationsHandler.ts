import { RefObject, useMemo } from "react";
import { PetViewT } from "src/types";

type Animations = "default" | "walk" | "sit" | "code";

interface Props {
  petContainerRef: RefObject<HTMLDivElement | null>;
  petRef: RefObject<HTMLImageElement | null>;
  animationRef: RefObject<HTMLImageElement | null>;
  view: PetViewT;
}

export class AnimationsHandler {
  private petContainerRef;
  private petRef;
  private animationRef;
  private isInProcess: boolean;
  private isFinished: boolean;
  private setTimeoutId: number;
  // Assets
  private walkingPath: string;
  private standingPath: string;
  private codingPath: string;
  private backgroundPath: string;

  constructor(props: Props) {
    this.walkingPath = useMemo(
        () =>
          props.view.app.vault.adapter.getResourcePath(
            "./.obsidian/plugins/obsidian-virtual-pet/images/walking.gif"
          ),
        []
      );
      this.standingPath = useMemo(
        () =>
          props.view.app.vault.adapter.getResourcePath(
            "./.obsidian/plugins/obsidian-virtual-pet/images/standing.gif"
          ),
        []
      );
    
      this.codingPath = useMemo(
        () =>
          props.view.app.vault.adapter.getResourcePath(
            "./.obsidian/plugins/obsidian-virtual-pet/images/coding.gif"
          ),
        []
      );
      


    this.petContainerRef = props.petContainerRef;
    this.petRef = props.petRef;
    this.animationRef = props.animationRef;
    this.isInProcess = false;
    this.isFinished = false;
    this.setTimeoutId = 0;
  }

  handleAnimation = (animation: Animations, time: number) => {
    if (this.isInProcess) {
      clearTimeout(this.setTimeoutId);
      this.isFinished = true;
    }

    const setAnimation = () => {
      if (animation === "walk") {
        this.sideWalks(time);
      } else if (animation === "code") {
        this.codes(time);
      }
    };
    setAnimation();
  };

  private handleFinishAnimation = () => {
    this.isFinished = false;
    this.isInProcess = false;

    if (this.petRef.current) this.petRef.current.src = this.standingPath;
  };

  private sideWalks(time: number) {
    this.isInProcess = true;
    let position = 0;
    if (this.petRef.current) {
      const leftValueString = window.getComputedStyle(this.petRef.current)[
        "left"
      ];
      position = parseFloat(leftValueString);
    }

    let reqId = 0;
    const speed = 6; //3

    if (this.petRef.current) this.petRef.current.src = this.walkingPath;

    // Moves the pet to the left, cheking if he reaches the limit (petContainer width)
    const moveRight = () => {
      const pageWidth = this.petContainerRef?.current?.offsetWidth;
      const elWidth = this.petRef?.current?.offsetWidth; // 64?
      if (
        position <
        (pageWidth && elWidth !== undefined ? pageWidth - elWidth : 180)
      ) {
        position += speed;
        if (this.petRef?.current)
          this.petRef.current.style.left = position + "px";

        handleState("right");
      } else {
        if (this.petRef?.current)
          this.petRef.current.style.transform = "scaleX(1)";

        moveLeft();
      }
    };

    // Moves the pet to the left, cheking if he reaches the limit (0)
    const moveLeft = () => {
      if (position !== 0) {
        position -= speed;
        if (this.petRef?.current)
          this.petRef.current.style.left = position + "px";
        handleState("left");
      } else {
        if (this.petRef?.current)
          this.petRef.current.style.transform = "scaleX(-1)";

        moveRight();
      }
    };

    const handleState = (side: string) => {
      setTimeout(() => {
        cancelAnimationFrame(reqId);

        if (!this.isFinished)
          reqId = requestAnimationFrame(
            side === "right" ? moveRight : moveLeft
          );
        else this.handleFinishAnimation();
      }, 220);
    };

    moveRight(); // TODO: Make something to see if the pet has to go to de right or to the left
    this.setTimeoutId = window.setTimeout(() => (this.isFinished = true), time); // Make a function?
  }

  private codes(time: number) {
    this.isInProcess = true;
    if (this.petRef.current) this.petRef.current.src = this.codingPath;

    this.setTimeoutId = window.setTimeout(() => this.handleFinishAnimation(), time);
  }
}
