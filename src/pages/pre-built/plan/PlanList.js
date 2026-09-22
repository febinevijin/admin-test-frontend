import React, { useContext, useEffect, useState } from "react";
import Content from "../../../layout/content/Content";
import {
  Block,
  BlockBetween,
  BlockContent,
  BlockDes,
  BlockHead,
  BlockHeadContent,
  BlockTitle,
  Icon,
  InputSwitch,
  PreviewAltCard,
  RSelect,
  UserAvatar,
} from "../../../components/Component";
import {
  Alert,
  Button,
  Card,
  Col,
  DropdownItem,
  DropdownMenu,
  DropdownToggle,
  Label,
  Modal,
  ModalBody,
  Row,
  UncontrolledDropdown,
} from "reactstrap";
import { Link, useNavigate } from "react-router-dom";
import Head from "../../../layout/head/Head";
import { AuthContext } from "../../../context/AuthContext";
import axiosInstance from "../../../utils/AxiosInstance";
import { AcuralType, PriceType, ReturnType } from "../../../utils/enum";
import useShowToast from "../../hooks/useShowToast";
import Swal from "sweetalert2";

export const defaultOptions = [
  { value: 3, label: "3 Months"},
  { value: 6, label: "6 Months"},
  { value: 9, label: "9 Months"},
  { value: 12, label: "12 Months" },
];

const PlanList = () => {
  const [priceType, setPriceType] = useState("0"); // Default to 'fixed' mode
  // console.log(process.env.REACT_APP_PUBLIC_USER_URL);
  const [formData, setFormData] = useState({
    planName: "",
    badgeName: "",
    fixedAmount: "",
    minAmount: "",
    maxAmount: "",
    // acural: AcuralType.EVERY_HOUR, // Default to EVERY_HOUR
    // returnType: ReturnType.LIFE_TIME, // Default to LIFE_TIME
    maturity: 6, // Default to empty
    capitalBack: false,
    featured: false,
    status: true,
  });

  // Handle RSelect change event for maturity
  const handleMaturityChange = (selectedOption) => {
    setFormData({
      ...formData,
      maturity: selectedOption.value, // Update maturity value in the formData
    });
  };

  const [plans, setPlans] = useState([]);
  const [modal, setModal] = useState(false);
  const [userInfo, setUserInfo] = useState(false);
  const navigate = useNavigate();
  const showToast = useShowToast();

  const { adminInfo } = useContext(AuthContext); // Accessing the adminInfo from AuthContext
  //   const navigate = useNavigate();

  const clearFormData = () => {
    setFormData({
      planName: "",
      badgeName: "",
      fixedAmount: "",
      minAmount: "",
      maxAmount: "",
      maturity: 6,
      capitalBack: false,
      featured: false,
      status: true,
    });
    setPriceType("fixed"); // Reset price type to "fixed"
  };

  // Function to close the modal and clear the form
  const closeModal = () => {
    setModal(false); // Close the modal
    clearFormData(); // Clear form data
  };

  const fetchPlans = async () => {
    try {
      const token = adminInfo?.token; // Assuming token is stored in adminInfo
      const response = await axiosInstance.get("/admin/plan", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setPlans(response.data.data.plans); // Assuming the API response structure
    } catch (error) {
      console.error("Error fetching plan data:", error);
    }
  };

  // Fetching Plan List from API
  useEffect(() => {
    if (adminInfo?.token) {
      fetchPlans();
    }
  }, [adminInfo]);

  const handleCheckboxChange = () => {
    setPriceType((prevType) => (prevType === "0" ? "1" : "0"));
  };

  const onInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleCheckboxToggle = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.checked });
  };

  //   const submitForm = () => {
  //     let submitData = {
  //       ...formData,
  //     };
  //     setUserInfo(submitData);
  //     setModal(false);
  //     };

  const submitForm = async () => {
    const dataToSend = {
      planName: formData.planName,
      priceType: priceType,
      // acural: formData.acural,
      // return: formData.returnType,

      capitalBack: formData.capitalBack,
      featured: formData.featured,
      status: formData.status,
    };
    dataToSend.maturity = Number(formData.maturity);
    // if (formData.returnType === ReturnType.PERIOD) {
    //   dataToSend.maturity = Number(formData.maturity);
    // }

    if (priceType === PriceType.FIXED) {
      dataToSend.fixedAmount = Number(formData.fixedAmount);
    } else {
      dataToSend.minAmount = Number(formData.minAmount);
      dataToSend.maxAmount = Number(formData.maxAmount);
    }

    try {
      if (formData._id) {
        // Update existing plan
        const response = await axiosInstance.put(`/admin/plan/edit/${formData._id}`, dataToSend, {
          headers: {
            Authorization: `Bearer ${adminInfo.token}`,
            "Content-Type": "application/json",
          },
        });
        if (response.data.success) {
          // console.log("Plan updated successfully:", response.data.data);
          showToast("Done", "Plan updated successfully", "success");
          setModal(false); // Close modal after success
          clearFormData()
        } else {
          console.error("Failed to update plan:", response.data);
          showToast("Error", "Failed to update plan", "warning");
        }
      } else {
        // Create new plan
        const response = await axiosInstance.post("/admin/plan/create", dataToSend, {
          headers: {
            Authorization: `Bearer ${adminInfo.token}`,
            "Content-Type": "application/json",
          },
        });
        if (response.data.success) {
          // console.log("Plan created successfully:", response.data.data);
          showToast("Done", "Plan created successfully", "success");
          clearFormData();
          setModal(false); // Close modal after success
          // Clear the form after a successful plan creation
          setFormData({
            planName: "",
            badgeName: "",
            fixedAmount: "",
            minAmount: "",
            maxAmount: "",
            // acural: AcuralType.EVERY_HOUR,
            // returnType: ReturnType.LIFE_TIME,
            maturity: 6,
            capitalBack: false,
            featured: false,
            status: true,
          });
          // Optionally reset priceType if needed
          setPriceType("fixed");
        } else {
          console.error("Failed to create plan:", response.data);
          showToast("Error", "Failed to create plan", "warning");
        }
      }
      // Fetch updated plans
      fetchPlans();
    } catch (error) {
      console.error("Error submitting the plan:", error);
    }
  };

  const handleEdit = (plan) => {
    // Pre-fill the form with the selected plan's data
    setFormData({
      _id: plan._id,
      planName: plan.planName,
      badgeName: plan.badgeName || "", // If badgeName is optional
      fixedAmount: plan.fixedAmount || "", // Handle fixed or range
      minAmount: plan.minAmount || "",
      maxAmount: plan.maxAmount || "",
      // acural: plan.acural,
      // returnType: plan.return,
      // acural: plan.acural || AcuralType.EVERY_HOUR,
      returnType: plan.return || ReturnType.LIFE_TIME,
      maturity: plan.maturity || "",
      capitalBack: plan.capitalBack,
      featured: plan.featured,
      status: plan.status,
    });

    // Set the price type based on the plan data
    setPriceType(plan.priceType === PriceType.FIXED ? "0" : "1");

    // Open the modal for editing
    setModal(true);
  };

  // Function to handle delete plan
  const handleDelete = async (planId) => {
    // Display confirmation message using SweetAlert
    const confirmDelete = await Swal.fire({
      title: "Are you sure?",
      text: "Do you want to delete this plan?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    });

    if (confirmDelete.isConfirmed) {
      try {
        // Call delete API
        const response = await axiosInstance.put(
          `/admin/plan/delete/${planId}`,
          {},
          {
            headers: {
              Authorization: `Bearer ${adminInfo.token}`, // Pass token from AuthContext
            },
          }
        );

        if (response.data.success) {
          // Remove the deleted plan from the state
          const updatedPlans = plans.filter((item) => item._id !== planId);
          setPlans(updatedPlans);

          // Display success message
          Swal.fire("Deleted!", "Your plan has been deleted.", "success");
        }
      } catch (error) {
        Swal.fire("Error!", "Failed to delete the plan.", "error");
        console.error("Delete Plan Error:", error);
      }
    }
  };

  

  return (
    <>
      <Head title="Plan List"></Head>
      <Content>
        <BlockHead size="sm">
          <BlockBetween className="g-3">
            <BlockContent>
              <BlockTitle>Plan List</BlockTitle>
              <BlockDes className="text-soft">
                <p>Select and Edit Plan List.</p>
              </BlockDes>
            </BlockContent>
            <BlockHeadContent>
              <Button onClick={() => setModal(true)} color="primary me-2">
                <Icon name="plus"></Icon>
                <span>Add</span>
              </Button>
              <Link to={`${process.env.PUBLIC_URL}/plan-details`}>
                <Button color="light">
                  <Icon name="percent"></Icon>
                  <span>Profit</span>
                </Button>
              </Link>
            </BlockHeadContent>
          </BlockBetween>
        </BlockHead>

        {/* Block Section to list Plans */}
        <Block>
          <Row className="g-gs">
            {plans.length > 0 ? (
              plans.map((plan) => (
                <Col sm={6} md={4} xxl={3} key={plan._id}>
                  <Card className="card-bordered pricing">
                    <UncontrolledDropdown>
                      <DropdownToggle tag="a" className="dropdown-toggle btn btn-icon btn-trigger paymentTop">
                        <Icon name="more-v"></Icon>
                      </DropdownToggle>
                      <DropdownMenu end>
                        <ul className="link-list-opt no-bdr">
                          <li>
                            <DropdownItem tag="a" href="#edit" onClick={() => handleEdit(plan)}>
                              <Icon name="edit"></Icon>
                              <span>Edit</span>
                            </DropdownItem>
                          </li>
                          <li className="divider"></li>
                          <li>
                            <DropdownItem
                              href="#suspend"
                              onClick={(ev) => {
                                ev.preventDefault();
                                handleDelete(plan._id); // Call handleDelete with the plan ID
                              }}
                            >
                              <Icon name="trash"></Icon>
                              <span>Delete</span>
                            </DropdownItem>
                          </li>
                        </ul>
                      </DropdownMenu>
                    </UncontrolledDropdown>
                    <div className="pricing-head">
                      <div className="pricing-title">
                        <h4 className="card-title title">{plan.planName}</h4>
                        <p className="sub-text">
                          {plan.priceType === PriceType.FIXED
                            ? `Fixed Amount: $${plan.fixedAmount}`
                            : `Price Type: Range`}
                        </p>
                      </div>
                      <div className="card-text">
                        {/* Acural Type */}
                        {/* <h4 className="list">
                          <Icon name="check-circle" /> Acural Type:
                          <Alert color="info alert-fill">
                            {(() => {
                              switch (plan.acural) {
                                case AcuralType.EVERY_HOUR:
                                  return "Every Hour";
                                case AcuralType.EVERY_DAY:
                                  return "Every Day";
                                case AcuralType.EVERY_WEEK:
                                  return "Every Week";
                                case AcuralType.EVERY_MONTH:
                                  return "Every Month";
                                case AcuralType.EVERY_YEAR:
                                  return "Every Year";
                                default:
                                  return "Unknown";
                              }
                            })()}
                          </Alert>
                        </h4> */}

                        {/* Return Type */}
                        {/* <h4 className="list">
                          <Icon name="check-circle" /> Return Type:
                          <Alert color="info alert-fill">
                            {plan.return === ReturnType.LIFE_TIME ? "Lifetime" : "Period"}
                          </Alert>
                        </h4> */}

                        {/* Maturity */}
                        <h4 className="list">
                          <Icon name="check-circle" /> Maturity:
                          <Alert color="info alert-fill">{plan.maturity} months</Alert>
                        </h4>

                        {/* Capital Back */}
                        <h4 className="list">
                          <Icon name="check-circle" /> Capital Back:
                          <Alert color={plan.capitalBack ? "success alert-fill" : "danger alert-fill"}>
                            {plan.capitalBack ? "Yes" : "No"}
                          </Alert>
                        </h4>

                        {/* Featured */}
                        <h4 className="list">
                          <Icon name="check-circle" /> Featured:
                          <Alert color={plan.featured ? "success alert-fill" : "danger alert-fill"}>
                            {plan.featured ? "Yes" : "No"}
                          </Alert>
                        </h4>

                        {/* Status */}
                        <h4 className="list">
                          <Icon name="check-circle" /> Status:
                          <Alert color={plan.status ? "success alert-fill" : "danger alert-fill"}>
                            {plan.status ? "Active" : "Inactive"}
                          </Alert>
                        </h4>
                      </div>
                    </div>
                  </Card>
                </Col>
              ))
            ) : (
              <p>No plans available</p>
            )}
          </Row>
        </Block>

        <Modal isOpen={modal} className="modal-dialog-centered" size="md" toggle={closeModal}>
          <a
            href="#dropdownitem"
            onClick={(ev) => {
              ev.preventDefault();
              closeModal(); // Call closeModal to close and clear form data
            }}
            className="close"
          >
            <Icon name="cross-sm"></Icon>
          </a>
          <ModalBody>
            <div className="p-2">
              <h5 className="title">Plan Details</h5>

              <div className="tab-content">
                <Row>
                  {/* Plan Name */}
                  <Col md="12" className="mt-4">
                    <div className="form-group">
                      <Label className="form-label" htmlFor="planName">
                        Plan Name
                      </Label>
                      <div className="form-control-wrap">
                        <input
                          type="text"
                          id="planName"
                          name="planName"
                          placeholder="Enter Plan Name"
                          className="form-control"
                          value={formData.planName}
                          onChange={onInputChange}
                        />
                      </div>
                    </div>
                  </Col>

                  {/* Price Type Toggle */}
                  <Col md="12" className="mt-4">
                    <div className="form-group">
                      <Label className="form-label me-5">Plan Price Type</Label>
                      <div className="custom-control custom-switch">
                        <input
                          type="checkbox"
                          className="custom-control-input"
                          id="priceTypeToggle"
                          checked={priceType === "0"} // Check if it's in 'range' mode
                          onChange={handleCheckboxChange}
                        />
                        <label className="custom-control-label" htmlFor="priceTypeToggle">
                          {priceType === "0" ? "Fixed" : "Range"}
                        </label>
                      </div>
                    </div>
                  </Col>

                  {/* Conditional Inputs based on Price Type */}
                  {priceType === "0" ? (
                    <Col md="12" className="mt-3">
                      <div className="form-group">
                        <Label className="form-label" htmlFor="fixedAmount">
                          Fixed Amount
                        </Label>
                        <div className="form-control-wrap">
                          <input
                            type="text"
                            id="fixedAmount"
                            name="fixedAmount"
                            placeholder="Enter Fixed Amount"
                            className="form-control"
                            value={formData.fixedAmount}
                            onChange={onInputChange}
                          />
                        </div>
                      </div>
                    </Col>
                  ) : (
                    <>
                      <Col md="6" className="mt-3">
                        <div className="form-group">
                          <Label className="form-label" htmlFor="minAmount">
                            Min Amount
                          </Label>
                          <div className="form-control-wrap">
                            <input
                              type="text"
                              id="minAmount"
                              name="minAmount"
                              placeholder="Enter Min Amount"
                              className="form-control"
                              value={formData.minAmount}
                              onChange={onInputChange}
                            />
                          </div>
                        </div>
                      </Col>

                      <Col md="6" className="mt-3">
                        <div className="form-group">
                          <Label className="form-label" htmlFor="maxAmount">
                            Max Amount
                          </Label>
                          <div className="form-control-wrap">
                            <input
                              type="text"
                              id="maxAmount"
                              name="maxAmount"
                              placeholder="Enter Max Amount"
                              className="form-control"
                              value={formData.maxAmount}
                              onChange={onInputChange}
                            />
                          </div>
                        </div>
                      </Col>
                    </>
                  )}

                  {/* Acural Dropdown */}
                  {/* <Col md="12" className="mt-3">
                    <div className="form-group">
                      <Label className="form-label" htmlFor="acural">
                        Acural
                      </Label>
                      <div className="form-control-wrap">
                        <select
                          id="acural"
                          name="acural"
                          className="form-control"
                          value={formData.acural}
                          onChange={onInputChange}
                        >
                          <option value="0">Every Hour</option>
                          <option value="1">Every Day</option>
                          <option value="2">Every Week</option>
                          <option value="3">Every Month</option>
                          <option value="4">Every Year</option>
                        </select>
                      </div>
                    </div>
                  </Col> */}

                  {/* Return Type Dropdown */}
                  {/* <Col md="12" className="mt-3">
                    <div className="form-group">
                      <Label className="form-label" htmlFor="returnType">
                        Return Type
                      </Label>
                      <div className="form-control-wrap">
                        <select
                          id="returnType"
                          name="returnType"
                          className="form-control"
                          value={formData.returnType}
                          onChange={onInputChange}
                        >
                          <option value="0">Lifetime</option>
                          <option value="1">Period</option>
                        </select>
                      </div>
                    </div>
                  </Col> */}

                  {/* Maturity Input (for Period Return Type) */}
                  {/* {formData.returnType === "1" && ( */}
                  <Col md="12" className="mt-3">
                    <div className="form-group">
                      <Label className="form-label" htmlFor="maturity">
                        Maturity (in months)
                      </Label>
                      {/* <div className="form-control-wrap">
                          <input
                            type="number"
                            id="maturity"
                            name="maturity"
                            placeholder="Enter Maturity Period"
                            className="form-control"
                            value={6}
                            onChange={onInputChange}
                          />
                        </div> */}

                      <RSelect
                        options={defaultOptions}
                        value={defaultOptions.find((option) => option.value === formData.maturity)}
                        onChange={handleMaturityChange}
                      />
                    </div>
                  </Col>
                  {/* )} */}

                  {/* Capital Back, Featured, and Status Toggles */}
                  <div className="mt-3">
                    <Label className="form-label">Actions</Label>
                    <Col className="d-flex flexStyle">
                      <div className="form-group col-md-3">
                        {" "}
                        <div className="custom-control custom-switch">
                          {" "}
                          <input
                            type="checkbox"
                            className="custom-control-input"
                            name="status"
                            id="activate"
                            checked={formData.status}
                            onChange={handleCheckboxToggle}
                          />{" "}
                          <label className="custom-control-label" htmlFor="activate">
                            {" "}
                            Activate{" "}
                          </label>{" "}
                        </div>{" "}
                      </div>
                      <div className="form-group col-md-4">
                        <div className="custom-control custom-switch">
                          <input
                            type="checkbox"
                            className="custom-control-input"
                            name="capitalBack"
                            id="capital"
                            checked={formData.capitalBack}
                            onChange={handleCheckboxToggle}
                          />
                          <label className="custom-control-label" htmlFor="capital">
                            Capital Back
                          </label>
                        </div>
                      </div>

                      <div className="form-group col-md-3">
                        <div className="custom-control custom-switch">
                          <input
                            type="checkbox"
                            className="custom-control-input"
                            name="featured"
                            id="featured"
                            checked={formData.featured}
                            onChange={handleCheckboxToggle}
                          />
                          <label className="custom-control-label" htmlFor="featured">
                            Featured
                          </label>
                        </div>
                      </div>
                    </Col>
                  </div>

                  {/* Action Buttons */}
                  <Col size="12">
                    <ul className="align-center flex-wrap flex-sm-nowrap gx-4 gy-2 justify-content-end mt-3">
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
                          size="md"
                          onClick={(ev) => {
                            ev.preventDefault();
                            submitForm();
                          }}
                        >
                          Create
                        </Button>
                      </li>
                    </ul>
                  </Col>
                </Row>
              </div>
            </div>
          </ModalBody>
        </Modal>
      </Content>
    </>
  );
};

export default PlanList;
