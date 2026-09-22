import React, { useState, useEffect } from "react";
import Content from "../../../layout/content/Content";
import { Card } from "reactstrap";
import Head from "../../../layout/head/Head";
import {
  BlockBetween,
  BlockContent,
  BlockDes,
  BlockHead,
  BlockHeadContent,
  BlockTitle,
  Icon,
  InputSwitch,
  Button,
} from "../../../components/Component";
import UserProfileAside from "./UserProfileAside";
import { useLocation } from "react-router-dom";

const UserProfileNotificationPage = () => {
  const [sm, updateSm] = useState(false);
  const [mobileView, setMobileView] = useState(false);

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
              className={`card-aside card-aside-left user-aside toggle-slide toggle-slide-left toggle-break-lg ${
                sm ? "content-active" : ""
              }`}
            >
              <UserProfileAside updateSm={updateSm} sm={sm} user={ user} />
            </div>
            <div className="card-inner card-inner-lg">
              {sm && mobileView && <div className="toggle-overlay" onClick={() => updateSm(!sm)}></div>}
              <BlockHead size="lg">
                <BlockBetween>
                  <BlockHeadContent>
                    <BlockTitle tag="h4">Previliage Settings</BlockTitle>
                    <BlockDes>
                      <p>You will get only those we enabled Previliages.</p>
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

              <BlockContent>
                <div className="gy-3">
                  <div className="g-item">
                    <div className="custom-control custom-switch">
                      <InputSwitch id="custom-switch" checked label="Activate this user" />
                    </div>
                  </div>
                  <div className="g-item">
                    <div className="custom-control custom-switch">
                      <InputSwitch id="custom-switch1" checked label="Suspend this user" />
                    </div>
                  </div>
                  <div className="g-item">
                    <div className="custom-control custom-switch">
                      <InputSwitch id="custom-switch2" label="Email Verification" />
                    </div>
                  </div>
                  <div className="g-item">
                    <div className="custom-control custom-switch">
                      <InputSwitch id="custom-switch3" label="SMS Verification" />
                    </div>
                  </div>
                </div>
              </BlockContent>
            </div>
          </div>
        </Card>
      </Content>
    </React.Fragment>
  );
};

export default UserProfileNotificationPage;
