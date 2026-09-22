import React, { useState, useEffect, useContext } from "react";
import Content from "../../../layout/content/Content";
import { Card} from "reactstrap";
import Head from "../../../layout/head/Head";
import DatePicker from "react-datepicker";
import { Modal, ModalBody } from "reactstrap";
import {
  Block,
  BlockBetween,
  BlockDes,
  BlockHead,
  BlockHeadContent,
  BlockTitle,
  Icon,
  Row,
  Col,
  Button,
  RSelect
} from "../../../components/Component";
import { countryOptions, userData } from "./UserData";
import { getDateStructured } from "../../../utils/Utils";
import UserProfileAside from "./UserProfileAside";
import { AuthContext } from "../../../context/AuthContext";
import axiosInstance from "../../../utils/AxiosInstance";
import { useParams } from "react-router-dom";
import useShowToast from "../../hooks/useShowToast";

const UserProfileRegularPage = () => {
  const [sm, updateSm] = useState(false);
  const [mobileView, setMobileView] = useState(false);
    const showToast = useShowToast();

  const [modalTab, setModalTab] = useState("1");
  const [userInfo, setUserInfo] = useState(userData[0]);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    userName: "",
    countryCode: "",
    phone: "",
    email: "",
    address: "",
    state: "",
    country: "",
  });
  const [modal, setModal] = useState(false);

  const onInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // const submitForm = () => {
  //   let submitData = {
  //     ...formData,
  //   };
  //   setUserInfo(submitData);
  //   setModal(false);
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

  // code written by backend developer
  // ********************************

  // fetch user details
  const [user, setUsers] = useState("");
  const { adminInfo } = useContext(AuthContext); // Use your actual context
  const { id } = useParams();
  const fetchUsers = async () => {
    try {
      const response = await axiosInstance.get(`/admin/users/details/${id}`, {
        headers: {
          Authorization: `Bearer ${adminInfo.token}`, // Use the token from adminInfo context
        },
      });
      // console.log(response.data.data);
      // Set the fetched users
      setUsers(response.data.data);
      // Map the fetched user data to formData
      const userData = response.data.data;
      console.log(userData);
      setFormData({
        firstName: userData.firstName, // Example mapping
        lastName: userData.lastName, // Example mapping
        userName: userData.userName,
        countryCode: userData.countryCode,
        phone: userData.phone,
        email: userData.email,
        address: userData.address || "", // Use appropriate fields from userData
        state: userData.state || "",
        country: userData.country || "",
      });
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };

  useEffect(() => {
    console.log("id in params: ", id);
    fetchUsers();
  }, [adminInfo, id]);

  // edit user details
  // Function to submit the form
  const submitForm = async () => {
    try {
      const response = await axiosInstance.put(
        `/admin/users/edit/${id}`,
        formData, // Pass formData directly
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${adminInfo.token}`, // Use token from AuthContext
          },
        }
      );

      // Check if the response was successful
      if (response.data.success) {
        // console.log("Profile updated successfully:", response.data.data);
         showToast("Done", "Profile updated successfully", "success");
        setModal(false); // Close the modal after successful update
         fetchUsers();
      } else {
        console.error("Error updating profile:", response.data);
          showToast("Error", "Failed to updating profile", "warning");
      }
    } catch (error) {
      console.error("Error:", error);
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
                    <BlockTitle tag="h4">Personal Information</BlockTitle>
                    <BlockDes>
                      <p>Basic information about user.</p>
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
                <div className="nk-data data-list">
                  <div className="data-head">
                    <h6 className="overline-title">Basics</h6>
                  </div>
                  <div className="data-item" onClick={() => setModal(true)}>
                    <div className="data-col">
                      <span className="data-label">First Name</span>
                      <span className="data-value">{user.firstName}</span>
                    </div>
                    <div className="data-col data-col-end">
                      <span className="data-more">
                        <Icon name="forward-ios"></Icon>
                      </span>
                    </div>
                  </div>
                  <div className="data-item" onClick={() => setModal(true)}>
                    <div className="data-col">
                      <span className="data-label">Las Name</span>
                      <span className="data-value">{user.lastName}</span>
                    </div>
                    <div className="data-col data-col-end">
                      <span className="data-more">
                        <Icon name="forward-ios"></Icon>
                      </span>
                    </div>
                  </div>
                  <div className="data-item" onClick={() => setModal(true)}>
                    <div className="data-col">
                      <span className="data-label">Username</span>
                      <span className="data-value">{user.userName}</span>
                    </div>
                    <div className="data-col data-col-end">
                      <span className="data-more">
                        <Icon name="forward-ios"></Icon>
                      </span>
                    </div>
                  </div>
                  <div className="data-item" onClick={() => setModal(true)}>
                    <div className="data-col">
                      <span className="data-label">Email</span>
                      <span className="data-value">{user.email}</span>
                    </div>
                    <div className="data-col data-col-end">
                      <span className="data-more">
                        <Icon name="forward-ios"></Icon>
                      </span>
                    </div>
                  </div>
                  <div className="data-item" onClick={() => setModal(true)}>
                    <div className="data-col">
                      <span className="data-label">Phone Number</span>
                      <span className="data-value">
                        {user.countryCode}
                        {user.phone}
                      </span>
                    </div>
                    <div className="data-col data-col-end">
                      <span className="data-more">
                        <Icon name="forward-ios"></Icon>
                      </span>
                    </div>
                  </div>
                  <div className="data-item" onClick={() => setModal(true)}>
                    <div className="data-col">
                      <span className="data-label">Address</span>
                      <span className="data-value">
                        {user.address},
                        <br />
                        {user.state}, {user.country}
                      </span>
                    </div>
                    <div className="data-col data-col-end">
                      <span className="data-more">
                        <Icon name="forward-ios"></Icon>
                      </span>
                    </div>
                  </div>
                  <div className="data-item" onClick={() => setModal(true)}>
                    <div className="data-col">
                      <span className="data-label">Withdrawal Wallet Address</span>
                      <span className="data-value">
                       add wallet address
                      </span>
                    </div>
                    <div className="data-col data-col-end">
                      <span className="data-more">
                        <Icon name="forward-ios"></Icon>
                      </span>
                    </div>
                  </div>
                </div>
                {/* <div className="nk-data data-list">
                  <div className="data-head">
                    <h6 className="overline-title">Preferences</h6>
                  </div>
                  <div className="data-item">
                    <div className="data-col">
                      <span className="data-label">Language</span>
                      <span className="data-value">English (United State)</span>
                    </div>
                    <div className="data-col data-col-end">
                      <a
                        href="#language"
                        onClick={(ev) => {
                          ev.preventDefault();
                        }}
                        className="link link-primary"
                      >
                        Change Language
                      </a>
                    </div>
                  </div>
                </div> */}
              </Block>

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
                    <h5 className="title">Update Profile</h5>
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
                          Personal
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
                          Address
                        </a>
                      </li>
                    </ul>
                    <div className="tab-content">
                      <div className={`tab-pane ${modalTab === "1" ? "active" : ""}`} id="personal">
                        <Row className="gy-4">
                          <Col md="6">
                            <div className="form-group">
                              <label className="form-label" htmlFor="full-name">
                                First Name
                              </label>
                              <input
                                type="text"
                                id="firstName"
                                className="form-control"
                                name="firstName"
                                onChange={(e) => onInputChange(e)}
                                defaultValue={formData.firstName}
                                placeholder="Enter firstName"
                              />
                            </div>
                          </Col>
                          <Col md="6">
                            <div className="form-group">
                              <label className="form-label" htmlFor="full-name">
                                last Name
                              </label>
                              <input
                                type="text"
                                id="lastName"
                                className="form-control"
                                name="lastName"
                                onChange={(e) => onInputChange(e)}
                                defaultValue={formData.lastName}
                                placeholder="Enter lastName"
                              />
                            </div>
                          </Col>
                          <Col md="6">
                            <div className="form-group">
                              <label className="form-label" htmlFor="display-name">
                                Username
                              </label>
                              <input
                                type="text"
                                id="userName"
                                className="form-control"
                                name="userName"
                                onChange={(e) => onInputChange(e)}
                                defaultValue={formData.userName}
                                placeholder="Enter userName"
                              />
                            </div>
                          </Col>
                          <Col md="6">
                            <div className="form-group">
                              <label className="form-label" htmlFor="countryCode">
                                country code
                              </label>
                              <input
                                type="text"
                                id="countryCode"
                                className="form-control"
                                name="countryCode"
                                onChange={(e) => onInputChange(e)}
                                defaultValue={formData.countryCode}
                                placeholder="country code"
                              />
                            </div>
                          </Col>
                          <Col md="6">
                            <div className="form-group">
                              <label className="form-label" htmlFor="phone-no">
                                Phone Number
                              </label>
                              <input
                                type="text"
                                id="phone"
                                className="form-control"
                                name="phone"
                                onChange={(e) => onInputChange(e)}
                                defaultValue={formData.phone}
                                placeholder="Phone Number"
                              />
                            </div>
                          </Col>
                          <Col md="6">
                            <div className="form-group">
                              <label className="form-label" htmlFor="email">
                                Email
                              </label>
                              <input
                                type="text"
                                id="email"
                                className="form-control"
                                name="email"
                                onChange={(e) => onInputChange(e)}
                                defaultValue={formData.email}
                                placeholder="Email Address"
                              />
                            </div>
                          </Col>
                          <Col size="12">
                            <div className="custom-control custom-switch">
                              <input type="checkbox" className="custom-control-input" id="latest-sale" />
                              <label className="custom-control-label" htmlFor="latest-sale">
                                Use full name to display{" "}
                              </label>
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
                                    submitForm();
                                  }}
                                >
                                  Update Profile
                                </Button>
                              </li>
                            </ul>
                          </Col>
                        </Row>
                      </div>
                      <div className={`tab-pane ${modalTab === "2" ? "active" : ""}`} id="address">
                        <Row className="gy-4">
                          <Col md="6">
                            <div className="form-group">
                              <label className="form-label" htmlFor="address-l1">
                                Address
                              </label>
                              <input
                                type="text"
                                id="address"
                                name="address"
                                onChange={(e) => onInputChange(e)}
                                defaultValue={formData.address}
                                className="form-control"
                              />
                            </div>
                          </Col>

                          <Col md="6">
                            <div className="form-group">
                              <label className="form-label" htmlFor="address-st">
                                State
                              </label>
                              <input
                                type="text"
                                id="address-st"
                                name="state"
                                onChange={(e) => onInputChange(e)}
                                defaultValue={formData.state}
                                className="form-control"
                              />
                            </div>
                          </Col>
                          <Col md="6">
                            <div className="form-group">
                              <label className="form-label" htmlFor="address-county">
                                Country
                              </label>
                              <RSelect
                                options={countryOptions}
                                placeholder="Select a country"
                                defaultValue={[
                                  {
                                    value: formData.country,
                                    label: formData.country,
                                  },
                                ]}
                                onChange={(e) => setFormData({ ...formData, country: e.value })}
                              />
                            </div>
                          </Col>
                          <Col md="6">
                            <div className="form-group">
                              <label className="form-label" htmlFor="address-st">
                               Withdrawal Wallet Address (BEP20)
                              </label>
                              <input
                                type="text"
                                id="address-st"
                                name="walletAddress"
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
                                <Button color="primary" size="lg" onClick={() => submitForm()}>
                                  Update Address
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

export default UserProfileRegularPage;
