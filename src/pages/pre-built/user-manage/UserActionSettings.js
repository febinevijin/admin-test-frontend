import React, { useState, useEffect, useContext } from "react";
import Content from "../../../layout/content/Content";
import { Card, Col, Modal, ModalBody, Row } from "reactstrap";
import Head from "../../../layout/head/Head";
import {
  Block,
  BlockBetween,
  BlockDes,
  BlockHead,
  BlockHeadContent,
  BlockTitle,
  Icon,
  Button,
  RSelect,
} from "../../../components/Component";
import { paymentOption, userData } from "./UserData";
import UserProfileAside from "./UserProfileAside";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { AuthContext } from "../../../context/AuthContext";
import axiosInstance from "../../../utils/AxiosInstance";
import useShowToast from "../../hooks/useShowToast";

const UserActionSettings = () => {
  const [sm, updateSm] = useState(false);
  const [mobileView, setMobileView] = useState(false);

  const [modalTab, setModalTab] = useState("1");
  // Add state for token management
  const [tokenModal, setTokenModal] = useState(false);
  const [tokenFormData, setTokenFormData] = useState({
    amount: "",
  });
  const [tokenModalTab, setTokenModalTab] = useState("1");
  // const [formData, setFormData] = useState({
  //   wallet: "Select Wallet",
  // });
  const [modal, setModal] = useState(false);

  // const onInputChange = (e) => {
  //   setFormData({ ...formData, [e.target.name]: e.target.value });
  // };

  // function to change the design view under 990 px
  const viewChange = () => {
    if (window.innerWidth < 990) {
      setMobileView(true);
    } else {
      setMobileView(false);
      updateSm(false);
    }
  };

  // add  this function by backend developer for temperory to remove error, and for future update
  // const submitForm = () => {
  //   console.log("enter into this function");
  // };

  useEffect(() => {
    viewChange();
    window.addEventListener("load", viewChange);
    window.addEventListener("resize", viewChange);
    document.getElementsByClassName("nk-header")[0].addEventListener("click", function () {
      updateSm(false);
    });
    return () => {
      window.removeEventListener("resize", viewChange);
      window.removeEventListener("load", viewChange);
    };
  }, []);

  // code by backend developer
  // ********************************
  const navigate = useNavigate();
  const location = useLocation();
  const user = location.state?.user; // Retrieve the passed user data
  const showToast = useShowToast();

  const [formData, setFormData] = useState({
    wallet: "",
    amount: "",
  });
  const { adminInfo } = useContext(AuthContext); // Accessing AuthContext for admin info

  const paymentOption = [
    { value: "mainBalance", label: "DEPOSIT BALANCE" },
    { value: "interestBalance", label: "CURRENT BALANCE" },
  ]; // Assuming wallet options

  const onInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };
  const userId = user._id;
  const submitForm = async (type) => {
    try {
      // API endpoint and userId (you might pass userId as prop or from context)
      const url = `/admin/users/manage-fund/${userId}`;

      // Data to be sent in the request body
      const requestData = {
        amount: Number(formData.amount),
        type: type, // "addAmount" or "subtractAmount"
        accountType: formData.wallet, // "mainBalance" or "interestBalance"
      };

      // Making the API call with Axios
      const response = await axiosInstance.put(url, requestData, {
        headers: {
          Authorization: `Bearer ${adminInfo.token}`, // Attaching Bearer token
        },
      });

      console.log(response.data); // Handling success response
      showToast("Done", "fund updated successfully", "success");
      setModal(false); // Close modal on success
      navigate(`/user-profile/${userId}`);
    } catch (error) {
      console.error("Error submitting form:", error); // Handle error
      showToast("Error", "Failed to update fund", "warning");
    }
  };

  // Function to handle token balance changes
  const handleTokenBalanceChange = async (type) => {
    const amountNumber = parseFloat(tokenFormData.amount);

    // Validate input
    if (isNaN(amountNumber)) {
      showToast("Error", "Please enter a valid amount", "warning");
      return;
    }

    if (amountNumber <= 0) {
      showToast("Error", "Amount must be greater than 0", "warning");
      return;
    }

    try {
      const url = `/admin/token/manage-token-fund/${userId}`;
      const response = await axiosInstance.put(
        url,
        {
          type: type,
          amount: amountNumber,
        },
        {
          headers: {
            Authorization: `Bearer ${adminInfo.token}`,
          },
        }
      );

      if (response.data.success) {
        showToast("Success", response.data.data.message, "success");
        setTokenModal(false);
        setTokenFormData({ amount: "" });
      }
    } catch (error) {
      console.error("Error managing token balance:", error);
      showToast("Error", error.response?.data?.message || "Failed to update token balance", "warning");
    }
  };

  const handleLoginAsUser = async () => {
    try {
      // Make the API call to login as user
      const response = await axiosInstance.post(
        `/auth/admin/login-as-user/${userId}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${adminInfo.token}`, // Pass the admin token in headers
          },
        }
      );

      // Get the data from the response
      const { data } = response.data;

      // Save the response data in localStorage
      // localStorage.setItem("filanUserInfo", JSON.stringify(data));

      // Open a new tab and pass the userId and token in the query params
      const Id = data._id; // Assuming the user ID is returned as `_id`
      const userToken = data.token; // Assuming token is returned as `token`
      const userLoginUrl = `${process.env.REACT_APP_PUBLIC_USER_URL}/auth-login?userId=${Id}&token=${userToken}`;

      window.open(userLoginUrl, "_blank");
    } catch (error) {
      console.error("Error logging in as user:", error);
      // Handle the error (you can show an alert or toast notification here)
    }
  };

  // ********************************

  return (
    <React.Fragment>
      <Head title="User List - Profile"></Head>
      <Content>
        <Card className="card-bordered">
          <div className="card-aside-wrap">
            <div
              className={`card-aside card-aside-left user-aside toggle-slide toggle-slide-left toggle-break-lg ${
                sm ? "content-active" : ""
              }`}
            >
              <UserProfileAside updateSm={updateSm} sm={sm} user={user} />
            </div>
            <div className="card-inner card-inner-lg">
              {sm && mobileView && <div className="toggle-overlay" onClick={() => updateSm(!sm)}></div>}
              <BlockHead size="lg">
                <BlockBetween>
                  <BlockHeadContent>
                    <BlockTitle tag="h4">Action Settings</BlockTitle>
                    <BlockDes>
                      <p>These Action will help you use fast.</p>
                    </BlockDes>
                  </BlockHeadContent>
                  <BlockHeadContent className="align-self-start d-lg-none">
                    <Button
                      className={`toggle btn btn-icon btn-trigger mt-n1 ${sm ? "active" : ""}`}
                      onClick={() => updateSm(!sm)}
                    >
                      <Icon name="menu-alt-r"></Icon>
                    </Button>
                  </BlockHeadContent>
                </BlockBetween>
              </BlockHead>

              <Block>
                <Card className="card-bordered">
                  <div className="card-inner-group">
                    <div className="card-inner">
                      <div className="between-center flex-wrap g-3">
                        <div className="nk-block-text">
                          <h6>Add or Subtract Fund</h6>
                          <p>Add or subtract fund of this user.</p>
                        </div>
                        <div className="nk-block-actions flex-shrink-sm-0">
                          <ul className="align-center flex-wrap flex-sm-nowrap gx-3 gy-2">
                            <li className="order-md-last">
                              <Button onClick={() => setModal(true)} color="primary">
                                <Icon className="btnIcon" name="wallet-alt" />
                                Add/Subtract
                              </Button>
                            </li>
                          </ul>
                        </div>
                      </div>
                    </div>
                    <div className="card-inner">
                      <div className="between-center flex-wrap g-3">
                        <div className="nk-block-text">
                          <h6>Add or Subtract Token Balance</h6>
                          <p>Add or subtract token balance of this user.</p>
                        </div>
                        <div className="nk-block-actions flex-shrink-sm-0">
                          <ul className="align-center flex-wrap flex-sm-nowrap gx-3 gy-2">
                            <li className="order-md-last">
                              <Button onClick={() => setTokenModal(true)} color="primary">
                                <Icon className="btnIcon" name="coins" />
                                Manage Token Balance
                              </Button>
                            </li>
                          </ul>
                        </div>
                      </div>
                    </div>
                    <div className="card-inner">
                      <div className="between-center flex-wrap g-3">
                        <div className="nk-block-text">
                          <h6>Transaction Log</h6>
                          <p>Transaction log of this user.</p>
                        </div>
                        <div className="nk-block-actions flex-shrink-sm-0">
                          <ul className="align-center flex-wrap flex-sm-nowrap gx-3 gy-2">
                            <li className="order-md-last">
                              <Link to={`${process.env.PUBLIC_URL}/user-transaction/${userId}`} state={{ user: user }}>
                                <Button color="primary">
                                  <Icon className="btnIcon" name="exchange" />
                                  Transaction Log
                                </Button>
                              </Link>
                            </li>
                          </ul>
                        </div>
                      </div>
                    </div>
                    <div className="card-inner">
                      <div className="between-center flex-wrap g-3">
                        <div className="nk-block-text">
                          <h6>Deposit Log</h6>
                          <p>Deposit Log of this user.</p>
                        </div>
                        <div className="nk-block-actions flex-shrink-sm-0">
                          <ul className="align-center flex-wrap flex-sm-nowrap gx-3 gy-2">
                            <li className="order-md-last">
                              <Link
                                to={`${process.env.PUBLIC_URL}/user-deposit-history/${userId}`}
                                state={{ user: user }}
                              >
                                <Button color="primary">
                                  <Icon className="btnIcon" name="coin" />
                                  Deposit Log
                                </Button>
                              </Link>
                            </li>
                          </ul>
                        </div>
                      </div>
                    </div>
                    <div className="card-inner">
                      <div className="between-center flex-wrap g-3">
                        <div className="nk-block-text">
                          <h6>Payout History</h6>
                          <p>payout history of this user.</p>
                        </div>
                        <div className="nk-block-actions flex-shrink-sm-0">
                          <ul className="align-center flex-wrap flex-sm-nowrap gx-3 gy-2">
                            <li className="order-md-last">
                              <Link to={`${process.env.PUBLIC_URL}/user-payout-list/${userId}`} state={{ user: user }}>
                                <Button color="primary">
                                  <Icon className="btnIcon" name="file-text" />
                                  Payout History
                                </Button>
                              </Link>
                            </li>
                          </ul>
                        </div>
                      </div>
                    </div>
                    <div className="card-inner">
                      <div className="between-center flex-wrap g-3">
                        <div className="nk-block-text">
                          <h6>Investment Log</h6>
                          <p>Investment log of this user.</p>
                        </div>
                        <div className="nk-block-actions flex-shrink-sm-0">
                          <ul className="align-center flex-wrap flex-sm-nowrap gx-3 gy-2">
                            <li className="order-md-last">
                              <Link
                                to={`${process.env.PUBLIC_URL}/user-investment-list/${userId}`}
                                state={{ user: user }}
                              >
                                <Button color="primary">
                                  <Icon className="btnIcon" name="coins" />
                                  Investment Log
                                </Button>
                              </Link>
                            </li>
                          </ul>
                        </div>
                      </div>
                    </div>
                    <div className="card-inner">
                      <div className="between-center flex-wrap g-3">
                        <div className="nk-block-text">
                          <h6>Refferal Log</h6>
                          <p>Refferal Log of this user.</p>
                        </div>
                        <div className="nk-block-actions flex-shrink-sm-0">
                          <ul className="align-center flex-wrap flex-sm-nowrap gx-3 gy-2">
                            <li className="order-md-last">
                              <Link to={`${process.env.PUBLIC_URL}/user-refer-list/${userId}`} state={{ user: user }}>
                                <Button color="primary">
                                  <Icon className="btnIcon" name="share" />
                                  Refferal Log
                                </Button>
                              </Link>
                            </li>
                          </ul>
                        </div>
                      </div>
                    </div>
                    <div className="card-inner">
                      <div className="between-center flex-wrap g-3">
                        <div className="nk-block-text">
                          <h6>KYC Records</h6>
                          <p>KYC records of this user.</p>
                        </div>
                        <div className="nk-block-actions flex-shrink-sm-0">
                          <ul className="align-center flex-wrap flex-sm-nowrap gx-3 gy-2">
                            <li className="order-md-last">
                              <Link to={`${process.env.PUBLIC_URL}/kyc-list`}>
                                <Button color="primary">
                                  <Icon className="btnIcon" name="article" />
                                  KYC Records
                                </Button>
                              </Link>
                            </li>
                          </ul>
                        </div>
                      </div>
                    </div>
                    <div className="card-inner">
                      <div className="between-center flex-wrap g-3">
                        <div className="nk-block-text">
                          <h6>Login as User</h6>
                          <p>Login as a user.</p>
                        </div>
                        <div className="nk-block-actions flex-shrink-sm-0">
                          <ul className="align-center flex-wrap flex-sm-nowrap gx-3 gy-2">
                            <li className="order-md-last">
                              <Button color="primary" onClick={handleLoginAsUser}>
                                <Icon className="btnIcon" name="signin" />
                                Login as User
                              </Button>
                            </li>
                          </ul>
                        </div>
                      </div>
                    </div>
                  </div>
                </Card>
              </Block>
              {/* Modal for Add/Subtract Balance */}
              <Modal isOpen={modal} className="modal-dialog-centered" size="lg" toggle={() => setModal(false)}>
                <a
                  href="#dropdownitem"
                  onClick={(ev) => {
                    ev.preventDefault();
                    setModal(false);
                  }}
                  className="close"
                >
                  <Icon name="cross-sm"></Icon>
                </a>
                <ModalBody>
                  <div className="p-2">
                    <h5 className="title">Add or Substract Balance</h5>
                    <ul className="nk-nav nav nav-tabs">
                      <li className="nav-item">
                        <a
                          className={`nav-link ${modalTab === "1" && "active"}`}
                          onClick={(ev) => {
                            ev.preventDefault();
                            setModalTab("1");
                          }}
                          href="#personal"
                        >
                          Add Balance
                        </a>
                      </li>
                      <li className="nav-item">
                        <a
                          className={`nav-link ${modalTab === "2" && "active"}`}
                          onClick={(ev) => {
                            ev.preventDefault();
                            setModalTab("2");
                          }}
                          href="#address"
                        >
                          Substract Balance
                        </a>
                      </li>
                    </ul>
                    {/* Add Balance Form */}
                    <div className="tab-content">
                      <div className={`tab-pane ${modalTab === "1" ? "active" : ""}`} id="personal">
                        <Row className="gy-4">
                          <Col md="6">
                            <div className="form-group">
                              <label className="form-label" htmlFor="address-county">
                                Select Wallet
                              </label>
                              <RSelect
                                options={paymentOption}
                                placeholder="Select a Wallet"
                                defaultValue={[
                                  {
                                    value: formData.wallet,
                                    label: formData.wallet,
                                  },
                                ]}
                                onChange={(e) => setFormData({ ...formData, wallet: e.value })}
                              />
                            </div>
                          </Col>
                          <Col md="6">
                            <div className="form-group">
                              <label className="form-label" htmlFor="amount">
                                Amount
                              </label>
                              <input
                                type="text"
                                id="amount"
                                name="amount"
                                onChange={(e) => onInputChange(e)}
                                defaultValue={formData.amount}
                                className="form-control"
                              />
                            </div>
                          </Col>
                          <Col size="12">
                            <ul className="align-center flex-wrap flex-sm-nowrap gx-4 gy-2 justify-content-end">
                              <li>
                                <a
                                  href="#dropdownitem"
                                  onClick={(ev) => {
                                    ev.preventDefault();
                                    setModal(false);
                                  }}
                                  className="link link-light"
                                >
                                  Cancel
                                </a>
                              </li>
                              <li>
                                <Button
                                  color="primary"
                                  size="lg"
                                  onClick={(ev) => {
                                    ev.preventDefault();
                                    submitForm("addAmount"); // Calling API to add balance
                                  }}
                                >
                                  Add Balance
                                </Button>
                              </li>
                            </ul>
                          </Col>
                        </Row>
                      </div>
                      {/* Subtract Balance Form */}
                      <div className={`tab-pane ${modalTab === "2" ? "active" : ""}`} id="address">
                        <Row className="gy-4">
                          <Col md="6">
                            <div className="form-group">
                              <label className="form-label" htmlFor="address-county">
                                Select Wallet
                              </label>
                              <RSelect
                                options={paymentOption}
                                placeholder="Select a Wallet"
                                defaultValue={[
                                  {
                                    value: formData.wallet,
                                    label: formData.wallet,
                                  },
                                ]}
                                onChange={(e) => setFormData({ ...formData, wallet: e.value })}
                              />
                            </div>
                          </Col>
                          <Col md="6">
                            <div className="form-group">
                              <label className="form-label" htmlFor="amount">
                                Amount
                              </label>
                              <input
                                type="text"
                                id="amount"
                                name="amount"
                                onChange={(e) => onInputChange(e)}
                                defaultValue={formData.amount}
                                className="form-control"
                              />
                            </div>
                          </Col>
                          <Col size="12">
                            <ul className="align-center flex-wrap flex-sm-nowrap gx-4 gy-2 justify-content-end">
                              <li>
                                <a
                                  href="#dropdownitem"
                                  onClick={(ev) => {
                                    ev.preventDefault();
                                    setModal(false);
                                  }}
                                  className="link link-light"
                                >
                                  Cancel
                                </a>
                              </li>
                              <li>
                                <Button color="primary" size="lg" onClick={() => submitForm("subtractAmount")}>
                                  Subtract Balance
                                </Button>
                              </li>
                            </ul>
                          </Col>
                        </Row>
                      </div>
                    </div>
                  </div>
                </ModalBody>
              </Modal>
              {/* Add the Token Balance Modal */}
              <Modal
                isOpen={tokenModal}
                className="modal-dialog-centered"
                size="lg"
                toggle={() => setTokenModal(false)}
              >
                <a
                  href="#dropdownitem"
                  onClick={(ev) => {
                    ev.preventDefault();
                    setTokenModal(false);
                  }}
                  className="close"
                >
                  <Icon name="cross-sm"></Icon>
                </a>
                <ModalBody>
                  <div className="p-2">
                    <h5 className="title">Add or Subtract Token Balance</h5>
                    <ul className="nk-nav nav nav-tabs">
                      <li className="nav-item">
                        <a
                          className={`nav-link ${tokenModalTab === "1" && "active"}`}
                          onClick={(ev) => {
                            ev.preventDefault();
                            setTokenModalTab("1");
                          }}
                          href="#token-add"
                        >
                          Add Token Balance
                        </a>
                      </li>
                      <li className="nav-item">
                        <a
                          className={`nav-link ${tokenModalTab === "2" && "active"}`}
                          onClick={(ev) => {
                            ev.preventDefault();
                            setTokenModalTab("2");
                          }}
                          href="#token-subtract"
                        >
                          Subtract Token Balance
                        </a>
                      </li>
                    </ul>
                    <div className="tab-content">
                      {/* Add Token Balance Form */}
                      <div className={`tab-pane ${tokenModalTab === "1" ? "active" : ""}`} id="token-add">
                        <Row className="gy-4">
                          <Col md="12">
                            <div className="form-group">
                              <label className="form-label" htmlFor="token-amount">
                                Token Amount
                              </label>
                              <input
                                type="number"
                                id="token-amount"
                                name="amount"
                                value={tokenFormData.amount}
                                onChange={(e) => setTokenFormData({ amount: e.target.value })}
                                className="form-control"
                                min="1"
                                step="1"
                              />
                            </div>
                          </Col>
                          <Col size="12">
                            <ul className="align-center flex-wrap flex-sm-nowrap gx-4 gy-2 justify-content-end">
                              <li>
                                <a
                                  href="#dropdownitem"
                                  onClick={(ev) => {
                                    ev.preventDefault();
                                    setTokenModal(false);
                                  }}
                                  className="link link-light"
                                >
                                  Cancel
                                </a>
                              </li>
                              <li>
                                <Button
                                  color="primary"
                                  size="lg"
                                  onClick={() => handleTokenBalanceChange("addAmount")}
                                  disabled={!tokenFormData.amount || isNaN(tokenFormData.amount)}
                                >
                                  Add Tokens
                                </Button>
                              </li>
                            </ul>
                          </Col>
                        </Row>
                      </div>
                      {/* Subtract Token Balance Form */}
                      <div className={`tab-pane ${tokenModalTab === "2" ? "active" : ""}`} id="token-subtract">
                        <Row className="gy-4">
                          <Col md="12">
                            <div className="form-group">
                              <label className="form-label" htmlFor="token-amount">
                                Token Amount
                              </label>
                              <input
                                type="number"
                                id="token-amount"
                                name="amount"
                                value={tokenFormData.amount}
                                onChange={(e) => setTokenFormData({ amount: e.target.value })}
                                className="form-control"
                                min="1"
                                step="1"
                              />
                            </div>
                          </Col>
                          <Col size="12">
                            <ul className="align-center flex-wrap flex-sm-nowrap gx-4 gy-2 justify-content-end">
                              <li>
                                <a
                                  href="#dropdownitem"
                                  onClick={(ev) => {
                                    ev.preventDefault();
                                    setTokenModal(false);
                                  }}
                                  className="link link-light"
                                >
                                  Cancel
                                </a>
                              </li>
                              <li>
                                <Button
                                  color="primary"
                                  size="lg"
                                  onClick={() => handleTokenBalanceChange("subtractAmount")}
                                  disabled={!tokenFormData.amount || isNaN(tokenFormData.amount)}
                                >
                                  Subtract Tokens
                                </Button>
                              </li>
                            </ul>
                          </Col>
                        </Row>
                      </div>
                    </div>
                  </div>
                </ModalBody>
              </Modal>
            </div>
          </div>
        </Card>
      </Content>
    </React.Fragment>
  );
};

export default UserActionSettings;
