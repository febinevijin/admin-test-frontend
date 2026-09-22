import React, { useContext, useEffect, useState } from "react";
import Content from "../../../layout/content/Content";
import Head from "../../../layout/head/Head";
import { Badge, Card } from "reactstrap";
import {
  Button,
  Block,
  BlockBetween,
  BlockDes,
  BlockHead,
  BlockHeadContent,
  BlockTitle,
  Icon,
  Row,
  Col,
  UserAvatar,
} from "../../../components/Component";
import { findUpper } from "../../../utils/Utils";
import { kycData } from "./KycData";
import { Link, useLocation, useParams } from "react-router-dom";
import { AuthContext } from "../../../context/AuthContext";
import axiosInstance from "../../../utils/AxiosInstance";
import { KYCDocTypeEnum, KYCStatusEnum } from "../../../utils/enum";


const KycDetailedPage = () => {
  const [user, setUser] = useState(null); // User state for storing fetched data
  const { kycId } = useParams(); // Get kycId from the route parameters
  const { adminInfo } = useContext(AuthContext); // Get adminInfo from AuthContext to access token
 const getDocTypeName = (docType) => {
   switch (docType) {
     case KYCDocTypeEnum.AADHAR:
       return "Aadhar";
     case KYCDocTypeEnum.PASSPORT:
       return "Passport";
     case KYCDocTypeEnum.DRIVINGLISECE:
       return "Driving License";
     default:
       return "ID Card";
   }
 };

 const getStatusClass = (status) => {
   switch (status) {
     case KYCStatusEnum.APPROVED:
       return "outline-success";
     case KYCStatusEnum.PENDING:
       return "outline-info";
     case KYCStatusEnum.REJECTED:
       return "outline-danger";
     case KYCStatusEnum.NOTSUBMITTED:
       return "outline-warning";
     default:
       return "outline-secondary";
   }
 };

 const getStatusName = (status) => {
   switch (status) {
     case KYCStatusEnum.APPROVED:
       return "Approved";
     case KYCStatusEnum.PENDING:
       return "Pending";
     case KYCStatusEnum.REJECTED:
       return "Rejected";
     case KYCStatusEnum.NOTSUBMITTED:
       return "Not Submitted";
     default:
       return "Unknown";
   }
 };
  useEffect(() => {
    const fetchKycDetails = async () => {
      if (kycId) {
        try {
          const response = await axiosInstance.get(`/admin/kyc/details/${kycId}`, {
            headers: {
              Authorization: `Bearer ${adminInfo.token}`, // Pass token for authorization
            },
          });
          setUser(response.data.data); // Update user state with response data
        } catch (error) {
          console.error("Error fetching KYC details:", error);
        }
      }
    };
    fetchKycDetails();
  }, [kycId, adminInfo]);

  // Conditionally render content when user data is available
  return (
    <>
      <Head title="KYC Details - Regular"></Head>
      {user && (
        <Content>
          <BlockHead size="sm">
            <BlockBetween className="g-3">
              <BlockHeadContent>
                <BlockTitle page>
                  KYCs / <strong className="text-primary small">{user.fullName}</strong>
                </BlockTitle>
                <BlockDes className="text-soft">
                  <ul className="list-inline">
                    <li>
                      Application ID: <span className="text-base">{user.userId.ID}</span>
                    </li>
                    <li>
                      Submitted At: <span className="text-base">{new Date(user.submittedOn).toLocaleString()}</span>
                    </li>
                  </ul>
                </BlockDes>
              </BlockHeadContent>
              <BlockHeadContent>
                <Link to={`${process.env.PUBLIC_URL}/kyclist`}>
                  <Button color="light" outline className="bg-white d-none d-sm-inline-flex">
                    <Icon name="arrow-left"></Icon>
                    <span>Back</span>
                  </Button>
                  <Button color="light" outline className="btn-icon bg-white d-inline-flex d-sm-none">
                    <Icon name="arrow-left"></Icon>
                  </Button>
                </Link>
              </BlockHeadContent>
            </BlockBetween>
          </BlockHead>

          <Block>
            <Row className="gy-5">
              <Col lg="5">
                <BlockHead>
                  <BlockHeadContent>
                    <BlockTitle tag="h5">Application Info</BlockTitle>
                    <p>Submission date, approve date, status etc.</p>
                  </BlockHeadContent>
                </BlockHead>
                <Card className="card-bordered">
                  <ul className="data-list is-compact">
                    <li className="data-item">
                      <div className="data-col">
                        <div className="data-label">Submitted By</div>
                        <div className="data-value">
                          {user.userId.firstName} {user.userId.lastName}
                        </div>
                      </div>
                    </li>
                    <li className="data-item">
                      <div className="data-col">
                        <div className="data-label">Submitted At</div>
                        <div className="data-value">{new Date(user.submittedOn).toLocaleString()}</div>
                      </div>
                    </li>
                    <li className="data-item">
                      <div className="data-col">
                        <div className="data-label">Status</div>
                        <div className="data-value">
                          <Badge
                            size="sm"
                            // color={
                            //   user.status === "1"
                            //     ? "outline-success"
                            //     : user.status === "0"
                            //     ? "outline-info"
                            //     : "outline-danger"
                            // }
                           color = {getStatusClass(user.status)}
                            className="badge-dim"
                          >
                            {getStatusName(user.status)}
                          </Badge>
                        </div>
                      </div>
                    </li>
                  </ul>
                </Card>

                <BlockHead>
                  <BlockHeadContent>
                    <BlockTitle tag="h5">Uploaded Documents</BlockTitle>
                    <p>Here are the user-uploaded documents.</p>
                  </BlockHeadContent>
                </BlockHead>

                <Card className="card-bordered">
                  <ul className="data-list is-compact">
                    <li className="data-item">
                      <div className="data-col">
                        <div className="data-label">Document Type</div>
                        <div className="data-value">{getDocTypeName(user.docType)}</div>
                      </div>
                    </li>
                    <li className="data-item">
                      <div className="data-col">
                        <div className="data-label">Front Side</div>
                        <div className="data-value uploadedImg">
                          <img src={user.docFrontSideImg} alt="Front Side" />
                        </div>
                      </div>
                    </li>
                    <li className="data-item">
                      <div className="data-col">
                        <div className="data-label">Back Side</div>
                        <div className="data-value uploadedImg">
                          <img src={user.docBackSideImg} alt="Back Side" />
                        </div>
                      </div>
                    </li>
                    <li className="data-item">
                      <div className="data-col">
                        <div className="data-label">Proof/Selfie</div>
                        <div className="data-value uploadedImg">
                          <img src={user.userImg} alt="Selfie" />
                        </div>
                      </div>
                    </li>
                  </ul>
                </Card>
              </Col>

              <Col lg="7">
                <BlockHead>
                  <BlockHeadContent>
                    <BlockTitle tag="h5">Applicant Information</BlockTitle>
                    <p>Basic info, like name, phone, address, country, etc.</p>
                  </BlockHeadContent>
                </BlockHead>
                <Card className="card-bordered">
                  <ul className="data-list is-compact">
                    <li className="data-item">
                      <div className="data-col">
                        <div className="data-label">Full Name</div>
                        <div className="data-value">{user.fullName}</div>
                      </div>
                    </li>
                    <li className="data-item">
                      <div className="data-col">
                        <div className="data-label">Email Address</div>
                        <div className="data-value">{user.userId.email}</div>
                      </div>
                    </li>
                    <li className="data-item">
                      <div className="data-col">
                        <div className="data-label">Phone Number</div>
                        <div className="data-value">{`${user.userId.countryCode} ${user.userId.phone}`}</div>
                      </div>
                    </li>
                    <li className="data-item">
                      <div className="data-col">
                        <div className="data-label">Date of Birth</div>
                        <div className="data-value">{user.age}</div>
                      </div>
                    </li>
                    <li className="data-item">
                      <div className="data-col">
                        <div className="data-label">Country</div>
                        <div className="data-value">{user.userId.country}</div>
                      </div>
                    </li>
                    <li className="data-item">
                      <div className="data-col">
                        <div className="data-label">Address</div>
                        <div className="data-value">{user.userId.address}</div>
                      </div>
                    </li>
                  </ul>
                </Card>
              </Col>
            </Row>
          </Block>
        </Content>
      )}
    </>
  );
};

export default KycDetailedPage;

