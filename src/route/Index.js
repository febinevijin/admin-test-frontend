import React, { useLayoutEffect } from "react";
import { Routes,Route, useLocation } from "react-router-dom";
import { UserContextProvider } from "../pages/pre-built/user-manage/UserContext";

import Crypto from "../pages/Crypto";

import Component from "../pages/components/Index";
import Accordian from "../pages/components/Accordions";
import Alerts from "../pages/components/Alerts";
import Avatar from "../pages/components/Avatar";
import Badges from "../pages/components/Badges";
import Breadcrumbs from "../pages/components/Breadcrumbs";
import ButtonGroup from "../pages/components/ButtonGroup";
import Buttons from "../pages/components/Buttons";
import Cards from "../pages/components/Cards";
import Carousel from "../pages/components/Carousel";
import Dropdowns from "../pages/components/Dropdowns";
import FormElements from "../pages/components/forms/FormElements";
import FormLayouts from "../pages/components/forms/FormLayouts";
import FormValidation from "../pages/components/forms/FormValidation";
import DataTablePage from "../pages/components/table/DataTable";
import Modals from "../pages/components/Modals";
import Pagination from "../pages/components/Pagination";
import Popovers from "../pages/components/Popovers";
import Progress from "../pages/components/Progress";
import Spinner from "../pages/components/Spinner";
import Tabs from "../pages/components/Tabs";
import Toast from "../pages/components/Toast";
import Tooltips from "../pages/components/Tooltips";
import Typography from "../pages/components/Typography";
import CheckboxRadio from "../pages/components/forms/CheckboxRadio";
import AdvancedControls from "../pages/components/forms/AdvancedControls";
import InputGroup from "../pages/components/forms/InputGroup";
import FormUpload from "../pages/components/forms/FormUpload";
import NumberSpinner from "../pages/components/forms/NumberSpinner";
import NouiSlider from "../pages/components/forms/nouislider";
import WizardForm from "../pages/components/forms/WizardForm";
import UtilBorder from "../pages/components/UtilBorder";
import UtilColors from "../pages/components/UtilColors";
import UtilDisplay from "../pages/components/UtilDisplay";
import UtilEmbeded from "../pages/components/UtilEmbeded";
import UtilFlex from "../pages/components/UtilFlex";
import UtilOthers from "../pages/components/UtilOthers";
import UtilSizing from "../pages/components/UtilSizing";
import UtilSpacing from "../pages/components/UtilSpacing";
import UtilText from "../pages/components/UtilText";

import Blank from "../pages/others/Blank";
import Faq from "../pages/others/Faq";
import Regularv1 from "../pages/others/Regular-1";
import Regularv2 from "../pages/others/Regular-2";
import Terms from "../pages/others/Terms";
import BasicTable from "../pages/components/table/BasicTable";
import SpecialTablePage from "../pages/components/table/SpecialTable";
import ChartPage from "../pages/components/charts/Charts";
import EmailTemplate from "../pages/components/email-template/Email";
import NioIconPage from "../pages/components/crafted-icons/NioIcon";
import SVGIconPage from "../pages/components/crafted-icons/SvgIcons";

import UserListRegular from "../pages/pre-built/user-manage/UserListRegular";
import UserProfileRegular from "../pages/pre-built/user-manage/UserProfileRegular";
import UserProfileSetting from "../pages/pre-built/user-manage/UserProfileSetting";
import UserProfileNotification from "../pages/pre-built/user-manage/UserProfileNotification";
import KycListRegular from "../pages/pre-built/kyc-list-regular/KycListRegular";
import KycDetailsRegular from "../pages/pre-built/kyc-list-regular/kycDetailsRegular";
import TransListCrypto from "../pages/pre-built/trans-list/TransListCrypto";
import ReactToastify from "../pages/components/misc/ReactToastify";

import DateTimePicker from "../pages/components/forms/DateTimePicker";
import CardWidgets from "../pages/components/widgets/CardWidgets";
import ChartWidgets from "../pages/components/widgets/ChartWidgets";
import RatingWidgets from "../pages/components/widgets/RatingWidgets";
import SlickPage from "../pages/components/misc/Slick";
import SweetAlertPage from "../pages/components/misc/SweetAlert";
import BeautifulDnd from "../pages/components/misc/BeautifulDnd";
import DualListPage from "../pages/components/misc/DualListbox";
import GoogleMapPage from "../pages/components/misc/GoogleMap";
import JsTreePreview from "../pages/components/misc/JsTree";
import QuillPreview from "../pages/components/forms/rich-editor/QuillPreview";
import TinymcePreview from "../pages/components/forms/rich-editor/TinymcePreview";
import KnobPreview from "../pages/components/charts/KnobPreview";

import Error404Classic from "../pages/error/404-classic";
import Error404Modern from "../pages/error/404-modern";
import Error504Modern from "../pages/error/504-modern";
import Error504Classic from "../pages/error/504-classic";

import Login from "../pages/auth/Login";
import Register from "../pages/auth/Register";
import ForgotPassword from "../pages/auth/ForgotPassword";
import Success from "../pages/auth/Success";

import Layout from "../layout/Index";
import LayoutNoSidebar from "../layout/Index-nosidebar";
import UserActionSettings from "../pages/pre-built/user-manage/UserActionSettings";
import SendEmail from "../pages/pre-built/email/SendEmail";
import RefferLink from "../pages/pre-built/reffer/RefferLink";
import PaymentMethod from "../pages/pre-built/payment-method/PaymentMethod";
import PaymentEdit from "../pages/pre-built/payment-method/PaymentEdit";
import PaymentAdd from "../pages/pre-built/payment-method/PaymentAdd";
import InvestList from "../pages/pre-built/investment/InvestList";
import RechargeList from "../pages/pre-built/Recharge/RechargeList";
import PayoutSetting from "../pages/pre-built/payout/PayoutSetting";
import PlanList from "../pages/pre-built/plan/PlanList";
import PlanEdit from "../pages/pre-built/plan/PlanEdit";
import PayoutList from "../pages/pre-built/payout/PayoutList";
import TransHistory from "../pages/pre-built/history/TransHistory";
import InvestmentHistory from "../pages/pre-built/investment/InvestmentHistory";
import DepositHistory from "../pages/pre-built/deposit/DepositHistory";
import PayoutHistory from "../pages/pre-built/payout/PayoutHistory";
import RefferList from "../pages/pre-built/reffer/RefferList";
import PublicRoute from "../components/PublicRoute";
import ProtectedRoute from "../components/ProtectedRoute";
import TransListBasic from "../pages/pre-built/trans-list/TransListBasic";
import TransListByUserId from "../pages/pre-built/trans-list/TransListByUserId";
import UserDepositHistoryById from "../pages/pre-built/deposit/UserDepositHistoryById";
import UserPayoutListById from "../pages/pre-built/payout/userPayOutListById";
import UserInvestmentListById from "../pages/pre-built/investment/UserInvestmentListById";
import UserReferListById from "../pages/pre-built/reffer/UserReferListById";
import DepositRequest from "../pages/pre-built/deposit/DepositRequest";
import PayoutRequest from "../pages/pre-built/payout/PayoutRequest";
import Commission from "../pages/pre-built/reffer/Commission";
import KycList from "../pages/pre-built/kyc-list-regular/KycList";
import KycDetailedPage from "../pages/pre-built/kyc-list-regular/kycDetailedPage";
import Announcement from "../pages/pre-built/notification/Announcement";
import AllAnnouncement from "../pages/pre-built/notification/AllAnnouncement";
import FilanToken from "../pages/pre-built/filan-token/FilanToken";
import F10Investment from "../pages/pre-built/investment/F10Investment";


const Router = () => {
  const location = useLocation();
  useLayoutEffect(() => {
    window.scrollTo(0, 0);
  }, [location]);

  return (
    <Routes>
      <Route path={`${process.env.PUBLIC_URL}`} element={<Layout />}>
        {/* Protected Route for Home Page */}
        <Route
          index
          element={
            <ProtectedRoute>
              <Crypto />
            </ProtectedRoute>
          }
        ></Route>
        <Route path="_blank" element={<Blank />}></Route>

        {/* PLAN LIST LINKS */}
        {/* ************************************************************* */}
        <Route
          path="plan-list"
          element={
            <ProtectedRoute>
              <PlanList />
            </ProtectedRoute>
          }
        ></Route>
        {/* ************************************************************* */}

        {/* USER Manage LINKS */}
        {/* ************************************************************* */}
        <Route element={<UserContextProvider />}>
          <Route path="user-list" element={ <ProtectedRoute><UserListRegular /></ProtectedRoute>}></Route>
        </Route>
        <Route>
          <Route path="user-profile-notification" element={<UserProfileNotification />}></Route>
          <Route path="user-profile/:id" element={<ProtectedRoute><UserProfileRegular /></ProtectedRoute>}></Route>
          <Route path="user-profile-setting" element={<ProtectedRoute><UserProfileSetting /></ProtectedRoute>}></Route>
          <Route path="user-action-setting" element={<ProtectedRoute><UserActionSettings /></ProtectedRoute>}></Route>
        </Route>
        {/* ************************************************************* */}

        {/* USER ACTION SETTING LINKS */}
        {/* ************************************************************* */}
        <Route path="user-transaction/:id" element={<ProtectedRoute><TransListByUserId /></ProtectedRoute>}></Route>
        <Route path="user-deposit-history/:id" element={<ProtectedRoute><UserDepositHistoryById /></ProtectedRoute>}></Route>
        <Route path="user-payout-list/:id" element={<ProtectedRoute><UserPayoutListById /></ProtectedRoute>}></Route>
        <Route path="user-investment-list/:id" element={<ProtectedRoute><UserInvestmentListById /></ProtectedRoute>}></Route>
        <Route path="user-refer-list/:id" element={<ProtectedRoute><UserReferListById /></ProtectedRoute>}></Route>
        {/* ************************************************************* */}

        <Route path="email" element={<ProtectedRoute><SendEmail /></ProtectedRoute>}></Route>
        <Route path="all-notification" element={<ProtectedRoute><AllAnnouncement /></ProtectedRoute>}></Route>
        <Route path="notification" element={<ProtectedRoute><Announcement /></ProtectedRoute>}></Route>
        <Route path="refferal" element={<ProtectedRoute><RefferLink /></ProtectedRoute>}></Route>
        <Route path="commission" element={<ProtectedRoute><Commission /></ProtectedRoute>}></Route>
        <Route path="payment-method" element={<ProtectedRoute><PaymentMethod /></ProtectedRoute>}></Route>
        <Route path="payment-method-add" element={<ProtectedRoute><PaymentAdd /></ProtectedRoute>}></Route>
        <Route path="payment-method-details/:id" element={<ProtectedRoute><PaymentEdit /></ProtectedRoute>}></Route>

        <Route path="kyclist" element={<ProtectedRoute><KycList /></ProtectedRoute>}></Route>
        {/* <Route path="kyc-list" element={<KycListRegular />}></Route> */}
        <Route path="kyc-detailed/:kycId" element={<ProtectedRoute><KycDetailedPage /></ProtectedRoute>}></Route>
        {/* <Route path="kyc-details/:kycId" element={<KycDetailsRegular />}></Route> */}
        <Route path="transaction" element={<ProtectedRoute><TransListCrypto /></ProtectedRoute>}></Route>
        <Route path="investment-history" element={<ProtectedRoute><InvestList /></ProtectedRoute>}></Route>
        <Route path="f10-investment" element={<ProtectedRoute><F10Investment /></ProtectedRoute>}></Route>
        <Route path="fund" element={<ProtectedRoute><RechargeList /></ProtectedRoute>}></Route>
        <Route path="payout-req" element={<ProtectedRoute><PayoutRequest /></ProtectedRoute>}></Route>
        <Route path="payout-log" element={<ProtectedRoute><PayoutList /></ProtectedRoute>}></Route>
        <Route path="payout-setting" element={<ProtectedRoute><PayoutSetting /></ProtectedRoute>}></Route>

        <Route path="plan-details" element={<ProtectedRoute><PlanEdit /></ProtectedRoute>}></Route>

        <Route path="transaction-history" element={<ProtectedRoute><TransHistory /></ProtectedRoute>}></Route>
        {/* <Route path="investment-history" element={<InvestmentHistory />}></Route> */}
        <Route path="deposit-request" element={<ProtectedRoute><DepositRequest /></ProtectedRoute>}></Route>
        <Route path="deposit-history" element={<ProtectedRoute><DepositHistory /></ProtectedRoute>}></Route>
        <Route path="payout-request" element={<ProtectedRoute><PayoutHistory /></ProtectedRoute>}></Route>
        <Route path="reffer-list" element={<ProtectedRoute><RefferList /></ProtectedRoute>}></Route>
        <Route path="filan-token" element={<ProtectedRoute><FilanToken /></ProtectedRoute>}></Route>


        <Route path="pages">
          <Route path="terms-policy" element={<Terms />}></Route>
          <Route path="faq" element={<Faq />}></Route>
          <Route path="regular-v1" element={<Regularv1 />}></Route>
          <Route path="regular-v2" element={<Regularv2 />}></Route>
        </Route>

        <Route path="components">
          <Route index element={<Component />}></Route>
          <Route path="accordions" element={<Accordian />}></Route>
          <Route path="alerts" element={<Alerts />}></Route>
          <Route path="avatar" element={<Avatar />}></Route>
          <Route path="badges" element={<Badges />}></Route>
          <Route path="breadcrumbs" element={<Breadcrumbs />}></Route>
          <Route path="button-group" element={<ButtonGroup />}></Route>
          <Route path="buttons" element={<Buttons />}></Route>
          <Route path="cards" element={<Cards />}></Route>
          <Route path="carousel" element={<Carousel />}></Route>
          <Route path="dropdowns" element={<Dropdowns />}></Route>
          <Route path="form-elements" element={<FormElements />}></Route>
          <Route path="form-layouts" element={<FormLayouts />}></Route>
          <Route path="checkbox-radio" element={<CheckboxRadio />}></Route>
          <Route path="advanced-control" element={<AdvancedControls />}></Route>
          <Route path="input-group" element={<InputGroup />}></Route>
          <Route path="form-upload" element={<FormUpload />}></Route>
          <Route path="number-spinner" element={<NumberSpinner />}></Route>
          <Route path="form-validation" element={<FormValidation />}></Route>
          <Route path="datetime-picker" element={<DateTimePicker />}></Route>
          <Route path="modals" element={<Modals />}></Route>
          <Route path="pagination" element={<Pagination />}></Route>
          <Route path="popovers" element={<Popovers />}></Route>
          <Route path="progress" element={<Progress />}></Route>
          <Route path="spinner" element={<Spinner />}></Route>
          <Route path="tabs" element={<Tabs />}></Route>
          <Route path="toast" element={<Toast />}></Route>
          <Route path="tooltips" element={<Tooltips />}></Route>
          <Route path="typography" element={<Typography />}></Route>
          <Route path="noUislider" element={<NouiSlider />}></Route>
          <Route path="wizard-basic" element={<WizardForm />}></Route>
          <Route path="quill" element={<QuillPreview />}></Route>
          <Route path="tinymce" element={<TinymcePreview />}></Route>
          <Route path="util-border" element={<UtilBorder />}></Route>
          <Route path="util-colors" element={<UtilColors />}></Route>
          <Route path="util-display" element={<UtilDisplay />}></Route>
          <Route path="util-embeded" element={<UtilEmbeded />}></Route>
          <Route path="util-flex" element={<UtilFlex />}></Route>
          <Route path="util-others" element={<UtilOthers />}></Route>
          <Route path="util-sizing" element={<UtilSizing />}></Route>
          <Route path="util-spacing" element={<UtilSpacing />}></Route>
          <Route path="util-text" element={<UtilText />}></Route>

          <Route path="widgets">
            <Route path="cards" element={<CardWidgets />}></Route>
            <Route path="charts" element={<ChartWidgets />}></Route>
            <Route path="rating" element={<RatingWidgets />}></Route>
          </Route>

          <Route path="misc">
            <Route path="slick-slider" element={<SlickPage />}></Route>
            <Route path="sweet-alert" element={<SweetAlertPage />}></Route>
            <Route path="beautiful-dnd" element={<BeautifulDnd />}></Route>
            <Route path="dual-list" element={<DualListPage />}></Route>
            <Route path="map" element={<GoogleMapPage />}></Route>
            <Route path="toastify" element={<ReactToastify />}></Route>
            <Route path="jsTree" element={<JsTreePreview />}></Route>
          </Route>
        </Route>
        <Route path="charts">
          <Route path="chartjs" element={<ChartPage />}></Route>
          <Route path="knobs" element={<KnobPreview />}></Route>
        </Route>

        <Route path="table-basic" element={<BasicTable />}></Route>
        <Route path="table-datatable" element={<DataTablePage />}></Route>
        <Route path="table-special" element={<SpecialTablePage />}></Route>
        <Route path="email-template" element={<EmailTemplate />}></Route>
        <Route path="nioicon" element={<NioIconPage />}></Route>
        <Route path="svg-icons" element={<SVGIconPage />}></Route>
      </Route>
      <Route path={`${process.env.PUBLIC_URL}`} element={<LayoutNoSidebar />}>
        <Route path="auth-success" element={<Success />}></Route>
        <Route path="auth-reset" element={<ForgotPassword />}></Route>
        <Route path="auth-register" element={<Register />}></Route>
        {/* Public Route for Login */}
        <Route
          path="auth-login"
          element={
            <PublicRoute>
              <Login />
            </PublicRoute>
          }
        ></Route>
        <Route path="errors">
          <Route path="404-modern" element={<Error404Modern />}></Route>
          <Route path="404-classic" element={<Error404Classic />}></Route>
          <Route path="504-modern" element={<Error504Modern />}></Route>
          <Route path="504-classic" element={<Error504Classic />}></Route>
        </Route>
        <Route path="*" element={<Error404Modern />}></Route>
      </Route>
    </Routes>
  );
};
export default Router;
