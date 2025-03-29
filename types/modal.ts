export type TModalState = {
  isActivationOpen: boolean;
  isAuthOpen: boolean;
  isClubCrudOpen: boolean;
  [key: `setTimer_${string}`]: boolean | undefined;
};
