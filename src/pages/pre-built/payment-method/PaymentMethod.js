import React, { useContext, useEffect, useState } from 'react'
import Content from '../../../layout/content/Content'
import { Block, BlockBetween, BlockContent, BlockDes, BlockHead, BlockHeadContent, BlockTitle, Icon, InputSwitch, PreviewAltCard, PreviewCard, RSelect, UserAvatar } from '../../../components/Component'
import { Alert, Button, Card, Col, DropdownItem, DropdownMenu, DropdownToggle, Label, Modal, ModalBody, Row, UncontrolledDropdown } from 'reactstrap';
import { useNavigate } from 'react-router-dom';
import Head from '../../../layout/head/Head';
import axiosInstance from '../../../utils/AxiosInstance';
import { AuthContext } from '../../../context/AuthContext';
import Swal from 'sweetalert2';
import useShowToast from '../../hooks/useShowToast';


// const PaymentMethod = () => {

//     const [formData, setFormData] = useState({
//         name: "Abu Bin Ishtiak",
//         displayName: "Ishtiak",
//         phone: "818474958",
//         email: "info@softnio.com",
//         address: "2337 Kildeer Drive",
//         address2: "",
//         state: "Kentucky",
//         country: "Canada",
//     });
//     const [modal, setModal] = useState(false);
//     const [userInfo, setUserInfo] = useState(false);

//     const onInputChange = (e) => {
//         setFormData({ ...formData, [e.target.name]: e.target.value });
//     };

//     const submitForm = () => {
//         let submitData = {
//             ...formData,
//         };
//         setUserInfo(submitData);
//         setModal(false);
//     };

//     const navigate = useNavigate();

//     return (
//         <>
//             <Head title="Payment Method"></Head>
//             <Content>
//                 <BlockHead size="sm">
//                     <BlockBetween className="g-3">
//                         <BlockContent>
//                             <BlockTitle>Payment Method</BlockTitle>
//                             <BlockDes className="text-soft">
//                                 <p>Select and Edit Payment Method.</p>
//                             </BlockDes>
//                         </BlockContent>
//                         <BlockHeadContent>
//                             <ul className="nk-block-tools g-3">
//                                 <li>
//                                     <Button onClick={(ev) => {
//                                                         ev.preventDefault();
//                                                         navigate(`${process.env.PUBLIC_URL}/payment-method-details`);
//                                                     }} color="primary" className="btn-icon pe-2 ps-2">
//                                         <Icon name="edit"></Icon>
//                                         Edit Payment Method
//                                     </Button>
//                                 </li>
//                             </ul>
//                         </BlockHeadContent>
//                     </BlockBetween>
//                 </BlockHead>

//                 <Block>
//                     <Row className="g-gs">
//                         <Col sm={6} md={4} xxl={3}>
//                             <Card className="card-bordered pricing payment">
//                                 <div className="pricing-head">
//                                 <div className="pricing-title">
//                                         <h5 className="card-title titlePayment">Manual Payment</h5>
//                                     </div>
//                                     <div className="card-text">
//                                         <h4 className="list"><Icon name="check-circle" />Name :<span className='ms-auto'>Wallet</span></h4>
//                                         <h4 className="list"><Icon name="check-circle" />Status : <Alert color="success alert-fill">Yes</Alert></h4>
//                                     </div>
//                                 </div>
//                             </Card>
//                         </Col>
//                     </Row>
//                 </Block>
//             </Content>
//         </>
//     )
// }

// export default PaymentMethod



const PaymentMethod = () => {
  const [paymentMethods, setPaymentMethods] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const { adminInfo } = useContext(AuthContext); // Get adminInfo from AuthContext
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPaymentMethods = async () => {
      if (!adminInfo || !adminInfo.token) {
        setError("Not authorized or token missing");
        setLoading(false);
        return;
      }
      try {
        const response = await axiosInstance.get("/admin/payment-method", {
          headers: {
            Authorization: `Bearer ${adminInfo.token}`,
          },
        });
        setPaymentMethods(response.data.data.paymentMethods);
        setLoading(false);
      } catch (err) {
        setError("Failed to fetch payment methods");
        setLoading(false);
      }
    };

    fetchPaymentMethods();
  }, [adminInfo]);

  if (loading) {
    return (
      <Content>
        <p>Loading payment methods...</p>
      </Content>
    );
  }

  if (error) {
    return (
      <Content>
        <Alert color="danger">{error}</Alert>
      </Content>
    );
  }

  return (
    <>
      <Head title="Payment Method"></Head>
      <Content>
        <BlockHead size="sm">
          <BlockBetween className="g-3">
            <BlockContent>
              <BlockTitle>Payment Method</BlockTitle>
              <BlockDes className="text-soft">
                <p>Select and Edit Payment Method.</p>
              </BlockDes>
            </BlockContent>
            <BlockHeadContent>
              <Button onClick={() => navigate(`${process.env.PUBLIC_URL}/payment-method-add`)} color="primary me-2">
                <Icon name="plus"></Icon>
                <span>Add</span>
              </Button>
            </BlockHeadContent>
          </BlockBetween>
        </BlockHead>

        <Block>
          <Row className="g-gs">
            {paymentMethods.map((method) => (
              <Col sm={6} md={4} xxl={3} key={method._id}>
                <Card className="card-bordered pricing payment">
                <UncontrolledDropdown>
                      <DropdownToggle tag="a" className="dropdown-toggle btn btn-icon btn-trigger paymentTop">
                        <Icon name="more-v"></Icon>
                      </DropdownToggle>
                      <DropdownMenu end>
                        <ul className="link-list-opt no-bdr">
                          <li>
                            <DropdownItem tag="a" onClick={() =>
                      navigate(`${process.env.PUBLIC_URL}/payment-method-details/${method._id}`, { state: { method } })
                    }>
                              <Icon name="edit"></Icon>
                              <span>Edit</span>
                            </DropdownItem>
                          </li>
                        </ul>
                      </DropdownMenu>
                    </UncontrolledDropdown>
                  <div className="pricing-head">
                    <div className="pricing-title">
                      <h5 className="card-title titlePayment">{method.paymentMethodName}</h5>
                    </div>
                    <div className="card-text">
                      <h4 className="list">
                        <Icon name="check-circle" /> Min Amount:
                        <span className="ms-auto">{method.minAmount}</span>
                      </h4>
                      <h4 className="list">
                        <Icon name="check-circle" /> Max Amount:
                        <span className="ms-auto">{method.maxAmount}</span>
                      </h4>
                      <h4 className="list">
                        <Icon name="check-circle" /> Fixed Charge in %:
                        <span className="ms-auto">{method.percentageCharge}</span>
                      </h4>
                      <h4 className="list">
                        <Icon name="check-circle" /> Status:
                        {method.isActive ? (
                          <Alert color="success alert-fill">Active</Alert>
                        ) : (
                          <Alert color="danger alert-fill">Inactive</Alert>
                        )}
                      </h4>
                    </div>
                  </div>
                  {/* <Button
                    onClick={() =>
                      navigate(`${process.env.PUBLIC_URL}/payment-method-details/${method._id}`, { state: { method } })
                    }
                    color="primary"
                    className="btn-icon mt-2"
                  >
                    <Icon name="edit"></Icon> Edit {method.paymentMethodName}
                  </Button> */}
                </Card>
              </Col>
            ))}
          </Row>
        </Block>
      </Content>
    </>
  );
};

export default PaymentMethod;