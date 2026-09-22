import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Icon, UserAvatar } from "../../../components/Component";
import { findUpper } from "../../../utils/Utils";
import {  DropdownItem, UncontrolledDropdown, DropdownMenu, DropdownToggle } from "reactstrap";

const UserProfileAside = ({ updateSm, sm, user }) => {
   
  const [profileName, setProfileName] = useState("Abu Bin Ishtiak");

  useEffect(() => {
    sm ? document.body.classList.add("toggle-shown") : document.body.classList.remove("toggle-shown");
  }, [sm]);

  return (
    <div className="card-inner-group">
      <div className="card-inner">
        <div className="user-card">
          <UserAvatar text={findUpper(profileName)} theme="primary" />
          <div className="user-info">
            <span className="lead-text">{user?.userName || "N/A"}</span>
            <span className="sub-text">{user?.email || "N/A"}</span>
          </div>
          <div className="user-action">
            <UncontrolledDropdown>
              <DropdownToggle tag="a" className="btn btn-icon btn-trigger me-n2">
                <Icon name="more-v"></Icon>
              </DropdownToggle>
              <DropdownMenu end>
                <ul className="link-list-opt no-bdr">
                  <li>
                    <DropdownItem
                      tag="a"
                      href="#dropdownitem"
                      onClick={(ev) => {
                        ev.preventDefault();
                      }}
                    >
                      <Icon name="camera-fill"></Icon>
                      <span>Change Photo</span>
                    </DropdownItem>
                  </li>
                  <li>
                    <DropdownItem
                      tag="a"
                      href="#dropdownitem"
                      onClick={(ev) => {
                        ev.preventDefault();
                      }}
                    >
                      <Icon name="edit-fill"></Icon>
                      <span>Update Profile</span>
                    </DropdownItem>
                  </li>
                </ul>
              </DropdownMenu>
            </UncontrolledDropdown>
          </div>
        </div>
      </div>
      <div className="card-inner">
        <div className="user-account-info py-0">
          <h6 className="overline-title-alt">Deposit Amount</h6>
          <div className="user-balance">$ {user?.depositBalance || 0}</div>
          <div className="user-balance-sub">
            current{" "}
            <span>
              <span className="currency currency-btc">$</span>
              {user?.earnedBalance || 0}
            </span>
          </div>
        </div>
      </div>
      <div className="card-inner p-0">
        <ul className="link-list-menu">
          <li onClick={() => updateSm(false)}>
            <Link
              to={`${process.env.PUBLIC_URL}/user-profile/${user._id}`}
              state={{ user: user }} // Pass the user object directly in state
              className={window.location.pathname === `${process.env.PUBLIC_URL}/user-profile` ? "active" : ""}
            >
              <Icon name="user-fill-c"></Icon>
              <span>Personal Information</span>
            </Link>
          </li>
          <li onClick={() => updateSm(false)}>
            <Link
              to={`${process.env.PUBLIC_URL}/user-profile-notification`}
              state={{ user: user }} // Pass the user object directly in state
              className={
                window.location.pathname === `${process.env.PUBLIC_URL}/user-profile-notification` ? "active" : ""
              }
            >
              <Icon name="bell-fill"></Icon>
              <span>Notification</span>
            </Link>
          </li>
          <li onClick={() => updateSm(false)}>
            <Link
              to={`${process.env.PUBLIC_URL}/user-profile-setting`}
              state={{ user: user }} // Pass the user object directly in state
              className={window.location.pathname === `${process.env.PUBLIC_URL}/user-profile-setting` ? "active" : ""}
            >
              <Icon name="lock-alt-fill"></Icon>
              <span>Security Setting</span>
            </Link>
          </li>

          <li onClick={() => updateSm(false)}>
            <Link
              to={`${process.env.PUBLIC_URL}/user-action-setting`}
              state={{ user: user }} // Pass the user object directly in state
              className={window.location.pathname === `${process.env.PUBLIC_URL}/user-action-setting` ? "active" : ""}
            >
              <Icon name="user-list-fill"></Icon>
              <span>Action Setting</span>
            </Link>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default UserProfileAside;
