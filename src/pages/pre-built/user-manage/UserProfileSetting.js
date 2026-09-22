import React, { useState, useEffect } from "react";
import Content from "../../../layout/content/Content";
import { Card, Badge, ModalBody, Modal, Col, Row } from "reactstrap";
import Head from "../../../layout/head/Head";
import {
  Block,
  BlockBetween,
  BlockDes,
  BlockHead,
  BlockHeadContent,
  BlockTitle,
  Icon,
  InputSwitch,
  Button,
} from "../../../components/Component";
import UserProfileAside from "./UserProfileAside";
import { Link, useLocation } from "react-router-dom";

const UserProfileSettingPage = () => {
  const [sm, updateSm] = useState(false);
  const [mobileView, setMobileView] = useState(false);
  const [passState, setPassState] = useState(false);

  // function to change the design view under 990 px
  const viewChange = () => {
    if (window.innerWidth < 990) {
      setMobileView(true);
    } else {
      setMobileView(false);
      updateSm(false);
    }
  };

  const [modal, setModal] = useState(false);

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
  const location = useLocation();
  const user = location.state?.user; // Retrieve the passed user data

  // ********************************

  return (
    <React.Fragment>
      <Head title="User List - Profile"></Head>
      <Content>
        <Card className="card-bordered">
          <div className="card-aside-wrap">
            <div
              className={`card-aside card-aside-left user-aside toggle-slide toggle-slide-left toggle-break-lg ${sm ? "content-active" : ""
                }`}
            >
              <UserProfileAside updateSm={updateSm} sm={sm} user={user} />
            </div>
            <div className="card-inner card-inner-lg">
              {sm && mobileView && <div className="toggle-overlay" onClick={() => updateSm(!sm)}></div>}
              <BlockHead size="lg">
                <BlockBetween>
                  <BlockHeadContent>
                    <BlockTitle tag="h4">Security Settings</BlockTitle>
                    <BlockDes>
                      <p>These settings will help you to keep your account secure.</p>
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
                          <h6>Change Password</h6>
                          <p>Set a unique password to protect your account.</p>
                        </div>
                        <div className="nk-block-actions flex-shrink-sm-0">
                          <ul className="align-center flex-wrap flex-sm-nowrap gx-3 gy-2">
                            <li className="order-md-last">
                              <Button onClick={() => setModal(true)} color="primary">Change Password</Button>
                            </li>
                            <li>
                              <em className="text-soft text-date fs-12px">
                                Last changed: <span>Oct 2, 2019</span>
                              </em>
                            </li>
                          </ul>
                        </div>
                      </div>
                    </div>
                    {/* <div className="card-body">
                      <div className="between-center flex-wrap flex-md-nowrap g-3">
                        <div className="nk-block-text">
                          <h6>
                            2 Factor Auth &nbsp;{" "}
                            <Badge color="success" className="ml-0">
                              Enabled
                            </Badge>
                          </h6>
                          <p>
                            Secure your account with 2FA security. When it is activated you will need to enter not only
                            your password, but also a special code using app. You will receive this code via mobile
                            application.{" "}
                          </p>
                        </div>
                        <div className="nk-block-actions">
                          <Link to={`${process.env.PUBLIC_URL}/kyc-details/`} className="btn bg-primary text-white">Disable</Link>
                        </div>
                      </div>
                    </div> */}
                  </div>
                </Card>
              </Block>

              <Modal isOpen={modal} className="modal-dialog-centered" size="md" toggle={() => setModal(false)}>
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
                    <h5 className="title">Plan Details</h5>
                    <div className="tab-content mt-4">
                      <Row>
                        <Col md="12">
                          <div className="form-group">
                            <div className="form-label-group">
                              <label className="form-label" htmlFor="password">
                                Enter Password
                              </label>
                            </div>
                            <div className="form-control-wrap">
                              <a
                                href="#password"
                                onClick={(ev) => {
                                  ev.preventDefault();
                                  setPassState(!passState);
                                }}
                                className={`form-icon lg form-icon-right passcode-switch ${passState ? "is-hidden" : "is-shown"}`}
                              >
                                <Icon name="eye" className="passcode-icon icon-show"></Icon>

                                <Icon name="eye-off" className="passcode-icon icon-hide"></Icon>
                              </a>
                              <input
                                type={passState ? "text" : "password"}
                                id="password"
                                placeholder="Enter your password"
                                className={`form-control-lg form-control ${passState ? "is-hidden" : "is-shown"}`}
                              />
                            </div>
                          </div>
                        </Col>
                        <Col md="12">
                          <div className="form-group mt-3">
                            <div className="form-label-group">
                              <label className="form-label" htmlFor="password">
                                Confirm Password
                              </label>
                            </div>
                            <div className="form-control-wrap">
                              <a
                                href="#password"
                                onClick={(ev) => {
                                  ev.preventDefault();
                                  setPassState(!passState);
                                }}
                                className={`form-icon lg form-icon-right passcode-switch ${passState ? "is-hidden" : "is-shown"}`}
                              >
                                <Icon name="eye" className="passcode-icon icon-show"></Icon>

                                <Icon name="eye-off" className="passcode-icon icon-hide"></Icon>
                              </a>
                              <input
                                type={passState ? "text" : "password"}
                                id="password"
                                placeholder="Re-Enter your password"
                                className={`form-control-lg form-control ${passState ? "is-hidden" : "is-shown"}`}
                              />
                            </div>
                          </div>
                        </Col>
                        <Col md="12">
                          <div className="form-group mt-5 d-flex justify-content-end">
                            <Button
                              color="light"
                              className="me-3"
                              size="md"
                              onClick={(ev) => {
                                ev.preventDefault();
                                setModal(false);
                              }}
                            >
                              Cancel
                            </Button>
                            <Button color="primary" size="md" type="submit">
                              Save
                            </Button>
                          </div>
                        </Col>
                      </Row>
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

export default UserProfileSettingPage;
