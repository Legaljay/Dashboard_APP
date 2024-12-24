// import React from 'react';
// import ModalPop from '../../component/modalPop';
// import { BottomGuide } from '../../component/modals/agentGuide/Guide';
// import SetupAssistance from '../../Settings/SetupAssistance';
// import UpgradeToPlan from '../../Settings/UpgradeToPlan';
// import UpgradePlan from '../../Settings/UpgradePlan';
// import Pay from '../../component/modals/wallet/Pay';
// import RedeemGift from '../../component/modals/redeemgift';
// import RedeemSuccess from '../../component/modals/redeemgift/RedeemSuccess';
// import SettingsSvg from '../../Assets/svg/settings.svg';
// import { useDispatch } from 'react-redux';
// import { getCurrentPlan } from '../../features/profile/getCurrentPlanSlice';
// import { getGiftBalance } from '../../features/profile/getGiftBalanceSlice';

// interface ModalsProps {
//   state: {
//     openTourModal: boolean;
//     openSetupAssistance: boolean;
//     openUpgradeToPlan: boolean;
//     openUpgradePlan: boolean;
//     openPayModal: boolean;
//     openRedeemGift: boolean;
//     openRedeemSuccess: boolean;
//     plan: {
//       nextAvailablePlanAmount: number;
//       subscriptions: any;
//     };
//     businessID: string;
//   };
//   actions: {
//     setOpenTourModal: (open: boolean) => void;
//     setOpenSetupAssistance: (open: boolean) => void;
//     setOpenUpgradeToPlan: (open: boolean) => void;
//     setOpenUpgradePlan: (open: boolean) => void;
//     setOpenPayModal: (open: boolean) => void;
//     setOpenRedeemGift: (open: boolean) => void;
//     setOpenRedeemSuccess: (open: boolean) => void;
//   };
// }

// export const Modals: React.FC<ModalsProps> = ({ state, actions }) => {
//   const dispatch = useDispatch();
//   const [show, setShow] = React.useState(false);

//   const handleBottomSettingsGuide = () => {
//     localStorage.setItem("settings", "true");
//     actions.setOpenTourModal(false);
//   };

//   return (
//     <>
//       <ModalPop isOpen={state.openTourModal}>
//         <BottomGuide
//           title="Settings"
//           subtitle="Welcome to your Business Settings! Tailor and manage your account preferences. Ensure your account's security by setting up Two-Factor Authentication (2FA) for added protection."
//           link="View Settings"
//           handleClose={handleBottomSettingsGuide}
//           image={SettingsSvg}
//         />
//       </ModalPop>

//       <ModalPop isOpen={state.openSetupAssistance}>
//         <SetupAssistance
//           handleClose={() => actions.setOpenSetupAssistance(false)}
//           setOpenUpgradeToPlan={actions.setOpenUpgradeToPlan}
//         />
//       </ModalPop>

//       <ModalPop isOpen={state.openUpgradeToPlan}>
//         <UpgradeToPlan
//           handleClose={() => actions.setOpenUpgradeToPlan(false)}
//           setOpenUpgradePlan={actions.setOpenUpgradePlan}
//           amount={state.plan.nextAvailablePlanAmount}
//         />
//       </ModalPop>

//       <ModalPop isOpen={state.openUpgradePlan}>
//         <UpgradePlan
//           handleClose={() => actions.setOpenUpgradePlan(false)}
//           setOpenRedeemSuccess={actions.setOpenRedeemSuccess}
//           monthly_amount={state.plan.nextAvailablePlanAmount}
//           data={state.plan.subscriptions?.[1]}
//           refresh={() => dispatch(getCurrentPlan())}
//           setOpenPayModal={actions.setOpenPayModal}
//         />
//       </ModalPop>

//       <ModalPop isOpen={state.openPayModal}>
//         <Pay
//           handleClose={() => actions.setOpenPayModal(false)}
//           insufficient
//           setOpenRedeemGift={actions.setOpenRedeemGift}
//         />
//       </ModalPop>

//       <ModalPop isOpen={state.openRedeemGift}>
//         <RedeemGift
//           handleClose={() => actions.setOpenRedeemGift(false)}
//           back={() => {
//             actions.setOpenPayModal(true);
//             actions.setOpenRedeemGift(false);
//           }}
//           setShow={setShow}
//           setOpenRedeemSuccess={actions.setOpenRedeemSuccess}
//           refresh={() => dispatch(getGiftBalance(state.businessID))}
//         />
//       </ModalPop>

//       <ModalPop isOpen={state.openRedeemSuccess}>
//         <RedeemSuccess
//           handleClose={() => actions.setOpenRedeemSuccess(false)}
//           title="Upgrade Successful"
//           text1="You have successfully upgraded to the Business Plan"
//           label="Done"
//           redirectPath="/settings?page=billing&category=plan"
//         />
//       </ModalPop>
//     </>
//   );
// };
