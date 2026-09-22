import React, { useState, useEffect, useContext } from "react";
import Content from "../../../layout/content/Content";
import Head from "../../../layout/head/Head";
import { Modal, ModalBody, UncontrolledDropdown, DropdownMenu, DropdownToggle, DropdownItem, Badge } from "reactstrap";
import {
  Button,
  Block,
  BlockBetween,
  BlockDes,
  BlockHead,
  BlockHeadContent,
  BlockTitle,
  Icon,
  Col,
  Row,
  TooltipComponent,
  UserAvatar,
  DataTable,
  DataTableBody,
  DataTableHead,
  DataTableRow,
  DataTableItem,
  PaginationComponent,
  RSelect,
} from "../../../components/Component";
import { kycData, filterStatus, filterDoc, bulkActionKycOptions } from "./KycData";
import { findUpper } from "../../../utils/Utils";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../../../context/AuthContext";
import axiosInstance from "../../../utils/AxiosInstance";
import { KYCDocTypeEnum, KYCStatusEnum } from "../../../utils/enum";
import useShowToast from "../../hooks/useShowToast";

const KycList = () => {
  const [onSearch, setonSearch] = useState(true);
  const [onSearchText, setSearchText] = useState("");
  const [tablesm, updateTableSm] = useState(false);
  const [data, setData] = useState(kycData);
  const [viewModal, setViewModal] = useState(false);
  const [detail, setDetail] = useState({});
  const [actionText, setActionText] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemPerPage, setItemPerPage] = useState(10);
  const [sort, setSortState] = useState("");
  const [statusFilter, setStatusFilter] = useState(""); // State for status filter
  const [docFilter, setDocFilter] = useState(""); // State for doc filter
  const [selectedKycData, setSelectedKycData] = useState(null); // For storing the selected transaction details
  const [modalDetail, setModalDetail] = useState(false);
  const navigate = useNavigate();
  // Sorting data
  const sortFunc = (params) => {
    let defaultData = data;
    if (params === "asc") {
      let sortedData = defaultData.sort((a, b) => a.name.localeCompare(b.name));
      setData([...sortedData]);
    } else if (params === "dsc") {
      let sortedData = defaultData.sort((a, b) => b.name.localeCompare(a.name));
      setData([...sortedData]);
    }
  };

  // Changing state value when searching name
  useEffect(() => {
    if (onSearchText !== "") {
      const filteredObject = kycData.filter((item) => {
        return item.name.toLowerCase().includes(onSearchText.toLowerCase());
      });
      setData([...filteredObject]);
    } else {
      setData([...kycData]);
    }
  }, [onSearchText]);

  // onChange function for searching name
  const onFilterChange = (e) => {
    setSearchText(e.target.value);
  };

  // function to declare the state change
  const onActionText = (e) => {
    setActionText(e.value);
  };

  // function to select all the items of the table
  const selectorCheck = (e) => {
    let newData;
    newData = data.map((item) => {
      item.check = e.currentTarget.checked;
      return item;
    });
    setData([...newData]);
  };

  // function to change the property of an item of the table
  const onSelectChange = (e, id) => {
    let newData = data;
    let index = newData.findIndex((item) => item.id === id);
    newData[index].check = e.currentTarget.checked;
    setData([...newData]);
  };

  // function to fire actions after dropdowm select
  const onActionClick = (e) => {
    if (actionText === "Reject") {
      let newData = data.map((item) => {
        if (item.check === true) item.status = "Rejected";
        return item;
      });
      setData([...newData]);
    } else if (actionText === "Delete") {
      let newData;
      newData = data.filter((item) => item.check !== true);
      setData([...newData]);
    }
  };

  // function to change to approve property for an item
  const onApproveClick = (id) => {
    let newData = data;
    let index = newData.findIndex((item) => item.id === id);
    newData[index].status = "Approved";
    setData([...newData]);
  };

  // function to change to reject property for an item
  const onRejectClick = (id) => {
    let newData = data;
    let index = newData.findIndex((item) => item.id === id);
    newData[index].status = "Rejected";
    setData([...newData]);
  };

  // function to load detail data
  // const loadDetail = (id) => {
  //   let index = data.findIndex((item) => item.id === id);
  //   setDetail(data[index]);
  // };
  const loadDetail = (kyc) => {
    console.log("Loading detail: ", kyc);
    setSelectedKycData(kyc); // Set the selected transaction details
    toggleModalDetail(); // Open modal
  };
  const toggleModalDetail = () => {
    setModalDetail(!modalDetail); // Toggle modal visibility
  };

  // function to toggle the search option
  const toggle = () => setonSearch(!onSearch);

  // Get current list, pagination
  const indexOfLastItem = currentPage * itemPerPage;
  const indexOfFirstItem = indexOfLastItem - itemPerPage;
  const currentItems = data.slice(indexOfFirstItem, indexOfLastItem);

  // Change Page
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  // backend developer code
  // ******************************************************
  const { adminInfo } = useContext(AuthContext); // Assuming token is in adminInfo
  const [kycList, setKycList] = useState([]);
  const [total, setTotal] = useState();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false); // State to track if processing
  const showToast = useShowToast();

  const handleStatusFilterChange = (selectedOption) => {
    setStatusFilter(selectedOption.value);
  };
  const handleDocFilterChange = (selectedOption) => {
    setDocFilter(selectedOption.value);
  };

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
        return "success";
      case KYCStatusEnum.PENDING:
        return "info";
      case KYCStatusEnum.REJECTED:
        return "danger";
      case KYCStatusEnum.NOTSUBMITTED:
        return "warning";
      default:
        return "secondary";
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

  // Fetch KYC list data
  const fetchKycList = async () => {
    try {
      const { data } = await axiosInstance.get(
        `/admin/kyc/get-list?limit=${itemPerPage}&page=${currentPage}&type=${docFilter}&status=${statusFilter}`,
        {
          headers: {
            Authorization: `Bearer ${adminInfo.token}`, // Pass the token in the header
          },
        }
      );
      setKycList(data.data.kycList); // Update state with the KYC list data
      setTotal(Number(data.data.totalCount));
      setLoading(false);
    } catch (error) {
      setError("Failed to fetch KYC list");
      setLoading(false);
    }
  };

  // verify kyc details
  const updateKycStatus = async (id, status) => {
    setIsProcessing(true); // Set processing state to true
    try {
      // Make PUT request with axiosInstance
      const response = await axiosInstance.put(
        `/admin/kyc/toggle-status/${id}?status=${status}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${adminInfo.token}`, // Pass the token from adminInfo
          },
        }
      );
      // Update kycList with new data
      const updatedData = response.data.data;
      setKycList((prevList) => prevList.map((item) => (item._id === updatedData._id ? updatedData : item)));
      showToast("Done", "KYC status updated", "success");
    } catch (error) {
      console.error("Error updating KYC status:", error);
      showToast("Error", "Failed to updating KYC status", "warning");
    } finally {
      setIsProcessing(false); // Reset processing state
      toggleModalDetail();
    }
  };

  useEffect(() => {
    fetchKycList(); // Call fetchKycList when component mounts
  }, [adminInfo.token]);

  if (loading) {
    return <div>Loading...</div>; // Show loading spinner or message
  }

  if (error) {
    return <div>{error}</div>; // Show error message
  }

  const resetFilters = () => {
    setStatusFilter("");
    setDocFilter("");
    fetchKycList(); // Re-fetch data with reset filters
  };

  // ******************************************************

  return (
    <>
      <Head title="KYC Lists - Regular"></Head>
      <Content>
        <BlockHead size="sm">
          <BlockBetween>
            <BlockHeadContent>
              <BlockTitle page>KYC Documents</BlockTitle>
              <BlockDes className="text-soft">
                <p>You have total {total || 0} KYC documents.</p>
              </BlockDes>
            </BlockHeadContent>
          </BlockBetween>
        </BlockHead>

        <Block>
          <DataTable className="card-stretch">
            <div className="card-inner position-relative card-tools-toggle">
              <div className="card-title-group">
                <div className="card-tools">
                  <div className="form-inline flex-nowrap gx-3">
                    <div className="card-title">
                      <h5 className="title">KYC Lists</h5>
                    </div>
                  </div>
                </div>
                <div className="card-tools me-n1">
                  <ul className="btn-toolbar gx-1">
                    {/* <li>
                      <Button
                        onClick={(ev) => {
                          ev.preventDefault();
                          toggle();
                        }}
                        className="btn-icon search-toggle toggle-search"
                      >
                        <Icon name="search"></Icon>
                      </Button>
                    </li> */}
                    {/* <li className="btn-toolbar-sep"></li> */}
                    <li>
                      <div className="toggle-wrap">
                        <Button
                          className={`btn-icon btn-trigger toggle ${tablesm ? "active" : ""}`}
                          onClick={() => updateTableSm(true)}
                        >
                          <Icon name="menu-right"></Icon>
                        </Button>
                        <div className={`toggle-content ${tablesm ? "content-active" : ""}`}>
                          <ul className="btn-toolbar gx-1">
                            <li className="toggle-close">
                              <Button className="btn-icon btn-trigger toggle" onClick={() => updateTableSm(false)}>
                                <Icon name="arrow-left"></Icon>
                              </Button>
                            </li>
                            <li>
                              <UncontrolledDropdown>
                                <DropdownToggle tag="a" className="btn btn-trigger btn-icon dropdown-toggle">
                                  <div className="dot dot-primary"></div>
                                  <Icon name="filter-alt"></Icon>
                                </DropdownToggle>
                                <DropdownMenu
                                  end
                                  className="filter-wg dropdown-menu-xl"
                                  style={{ overflow: "visible" }}
                                >
                                  <div className="dropdown-head">
                                    <span className="sub-title dropdown-title">Advanced Filter</span>
                                  </div>
                                  <div className="dropdown-body dropdown-body-rg">
                                    <Row className="gx-6 gy-3">
                                      <Col size="6">
                                        <div className="form-group">
                                          <label className="overline-title overline-title-alt">Doc Type</label>
                                          <RSelect
                                            options={filterDoc}
                                            placeholder="Any Type"
                                            onChange={handleDocFilterChange}
                                          />
                                        </div>
                                      </Col>
                                      <Col size="6">
                                        <div className="form-group">
                                          <label className="overline-title overline-title-alt">Status</label>
                                          <RSelect
                                            options={filterStatus}
                                            placeholder="Any Status"
                                            onChange={handleStatusFilterChange}
                                          />
                                        </div>
                                      </Col>
                                      <Col size="12">
                                        <div className="form-group">
                                          <Button type="button" color="secondary" onClick={fetchKycList}>
                                            Filter
                                          </Button>
                                        </div>
                                      </Col>
                                    </Row>
                                  </div>
                                  <div className="dropdown-foot between">
                                    <a
                                      className="clickable"
                                      href="#reset"
                                      onClick={(ev) => {
                                        ev.preventDefault();
                                        resetFilters();
                                      }}
                                    >
                                      Reset Filter
                                    </a>
                                    {/* <a
                                      href="#save"
                                      onClick={(ev) => {
                                        ev.preventDefault();
                                      }}
                                    >
                                      Save Filter
                                    </a> */}
                                  </div>
                                </DropdownMenu>
                              </UncontrolledDropdown>
                            </li>
                            <li>
                              <UncontrolledDropdown>
                                <DropdownToggle tag="a" className="btn btn-trigger btn-icon dropdown-toggle">
                                  <Icon name="setting"></Icon>
                                </DropdownToggle>
                                <DropdownMenu end className="dropdown-menu-xs">
                                  <ul className="link-check">
                                    <li>
                                      <span>Show</span>
                                    </li>
                                    <li className={itemPerPage === 10 ? "active" : ""}>
                                      <DropdownItem
                                        tag="a"
                                        href="#dropdownitem"
                                        onClick={(ev) => {
                                          ev.preventDefault();
                                          setItemPerPage(10);
                                        }}
                                      >
                                        10
                                      </DropdownItem>
                                    </li>
                                    <li className={itemPerPage === 15 ? "active" : ""}>
                                      <DropdownItem
                                        tag="a"
                                        href="#dropdownitem"
                                        onClick={(ev) => {
                                          ev.preventDefault();
                                          setItemPerPage(15);
                                        }}
                                      >
                                        15
                                      </DropdownItem>
                                    </li>
                                  </ul>
                                  <ul className="link-check">
                                    <li>
                                      <span>Order</span>
                                    </li>
                                    <li className={sort === "dsc" ? "active" : ""}>
                                      <DropdownItem
                                        tag="a"
                                        href="#dropdownitem"
                                        onClick={(ev) => {
                                          ev.preventDefault();
                                          setSortState("dsc");
                                          sortFunc("dsc");
                                        }}
                                      >
                                        DESC
                                      </DropdownItem>
                                    </li>
                                    <li className={sort === "asc" ? "active" : ""}>
                                      <DropdownItem
                                        tag="a"
                                        href="#dropdownitem"
                                        onClick={(ev) => {
                                          ev.preventDefault();
                                          setSortState("asc");
                                          sortFunc("asc");
                                        }}
                                      >
                                        ASC
                                      </DropdownItem>
                                    </li>
                                  </ul>
                                </DropdownMenu>
                              </UncontrolledDropdown>
                            </li>
                          </ul>
                        </div>
                      </div>
                    </li>
                  </ul>
                </div>
              </div>
              <div className={`card-search search-wrap ${!onSearch && "active"}`}>
                <div className="card-body">
                  <div className="search-content">
                    <Button
                      onClick={() => {
                        setSearchText("");
                        toggle();
                      }}
                      className="search-back btn-icon toggle-search"
                    >
                      <Icon name="arrow-left"></Icon>
                    </Button>
                    <input
                      type="text"
                      className="border-transparent form-focus-none form-control"
                      placeholder="Search by user or email"
                      value={onSearchText}
                      onChange={(e) => onFilterChange(e)}
                    />
                    <Button className="search-submit btn-icon">
                      <Icon name="search"></Icon>
                    </Button>
                  </div>
                </div>
              </div>
            </div>
            <DataTableBody>
              <DataTableHead>
                <DataTableRow className="nk-tb-col-check">
                  <div className="custom-control custom-control-sm custom-checkbox notext">
                    <input
                      type="checkbox"
                      className="custom-control-input"
                      id="uid_1"
                      onChange={(e) => selectorCheck(e)}
                    />
                    <label className="custom-control-label" htmlFor="uid_1"></label>
                  </div>
                </DataTableRow>
                <DataTableRow>
                  <span>User</span>
                </DataTableRow>
                <DataTableRow>
                  <span>Doc Type</span>
                </DataTableRow>
                <DataTableRow>
                  <span>Documents</span>
                </DataTableRow>
                <DataTableRow>
                  <span>Submitted</span>
                </DataTableRow>
                <DataTableRow>
                  <span>Status</span>
                </DataTableRow>
                <DataTableRow>
                  <span>Action</span>
                </DataTableRow>
                <DataTableRow className="nk-tb-col-tools">&nbsp;</DataTableRow>
              </DataTableHead>

              {kycList.length > 0 ? (
                kycList.map((item) => (
                  <DataTableItem key={item._id}>
                    <DataTableRow className="nk-tb-col-check">
                      <div className="custom-control custom-control-sm custom-checkbox notext">
                        <input
                          type="checkbox"
                          className="custom-control-input"
                          defaultChecked={item.checked}
                          id={item._id + "uid1"}
                          key={Math.random()}
                          onChange={(e) => onSelectChange(e, item._id)}
                        />
                        <label className="custom-control-label" htmlFor={item._id + "uid1"}></label>
                      </div>
                    </DataTableRow>
                    <DataTableRow>
                      <Link
                        to={{
                          pathname: `${process.env.PUBLIC_URL}/kyc-detailed/${item._id}`,
                          state: { userDetails: item },
                        }}
                      >
                        <div className="user-card">
                          <UserAvatar
                            theme="primary"
                            text={item.fullName[0]} // Display user's first initial
                            image={item.userImg} // Display user profile picture
                          ></UserAvatar>
                          <div className="user-info">
                            <span className="tb-lead text-nowrap">
                              {item.fullName}{" "}
                              <span
                                className={`dot dot-${
                                  item.status === "Approved" ? "success" : item.status === "Pending" ? "info" : "danger"
                                } d-md-none ms-1`}
                              ></span>
                            </span>
                            <span>{item.userId.ID}</span> {/* User ID */}
                          </div>
                        </div>
                      </Link>
                    </DataTableRow>
                    <DataTableRow>
                      <span className="tb-lead-sub">{getDocTypeName(item.docType)}</span>
                    </DataTableRow>
                    <DataTableRow>
                      <ul className="list-inline list-download text-nowrap">
                        {item.docFrontSideImg && (
                          <li>
                            Front Side{" "}
                            <a href={item.docFrontSideImg} target="_blank" rel="noopener noreferrer">
                              <Icon name="eye"></Icon>
                            </a>
                          </li>
                        )}
                        {item.docBackSideImg && (
                          <li>
                            Back Side{" "}
                            <a href={item.docBackSideImg} target="_blank" rel="noopener noreferrer">
                              <Icon name="eye"></Icon>
                            </a>
                          </li>
                        )}
                      </ul>
                    </DataTableRow>
                    <DataTableRow className="text-nowrap">
                      <span className="tb-date">{new Date(item.submittedOn).toLocaleDateString()}</span>
                    </DataTableRow>

                    <DataTableRow>
                      <span className={`tb-status text-${getStatusClass(item.status)}`}>
                        {getStatusName(item.status)}
                      </span>
                    </DataTableRow>
                    {/* <DataTableRow>
                      <div className="user-card">
                        <UserAvatar
                          theme="orange-dim"
                          size="xs"
                          text={item.adminAction?.checkedBy?.charAt(0)}
                        ></UserAvatar>
                        <div className="user-name">
                          <span className="tb-lead text-nowrap">{item.adminAction?.checkedBy || "N/A"} </span>
                        </div>
                      </div>
                    </DataTableRow> */}
                    {/* <DataTableRow className="nk-tb-col-tools kycBtn"> */}
                    {/* <UncontrolledDropdown>
                        <DropdownToggle tag="a" className="dropdown-toggle btn btn-icon btn-trigger">
                          <Icon name="more-h"></Icon>
                        </DropdownToggle>
                        <DropdownMenu end>
                          <ul className="link-list-opt no-bdr">
                            <li>
                              <DropdownItem
                                tag="a"
                                href="#view"
                                onClick={(ev) => {
                                  ev.preventDefault();
                                  loadDetail(item._id);
                                  setViewModal(true);
                                }}
                              >
                                <Icon name="eye"></Icon>
                                <span>Quick View</span>
                              </DropdownItem>
                            </li>
                            <li>
                              <Link  to={{
                          pathname: `${process.env.PUBLIC_URL}/kyc-detailed/${item._id}`,
                          state: { userDetails: item },
                        }}>
                                <Icon name="focus"></Icon>
                                <span>View Details</span>
                              </Link>
                            </li>
                            {item.status === "Pending" && (
                              <>
                                <li onClick={() => onApproveClick(item._id)}>
                                  <DropdownItem
                                    tag="a"
                                    href="#approve"
                                    onClick={(ev) => {
                                      ev.preventDefault();
                                    }}
                                  >
                                    <Icon name="check-thick"></Icon>
                                    <span>Approve</span>
                                  </DropdownItem>
                                </li>
                                <li onClick={() => onRejectClick(item._id)}>
                                  <DropdownItem
                                    tag="a"
                                    href="#reject"
                                    onClick={(ev) => {
                                      ev.preventDefault();
                                    }}
                                  >
                                    <Icon name="na"></Icon>
                                    <span>Reject</span>
                                  </DropdownItem>
                                </li>
                              </>
                            )}
                          </ul>
                        </DropdownMenu>
                      </UncontrolledDropdown> */}

                    {/* {item.status === "0" ? (
                        isProcessing ? (
                          <p>Processing...</p> // Show processing message while API call is happening
                        ) : (
                          <>
                            <Button color="success" onClick={() => updateKycStatus(item._id, 1)}>
                              <Icon name="check"></Icon>
                            </Button>
                            <Button color="danger" onClick={() => updateKycStatus(item._id, 2)}>
                              <Icon name="cross"></Icon>
                            </Button>
                          </>
                        )
                      ) : null} */}
                    {/* </DataTableRow> */}
                    {/* Action buttons with details icon */}
                    <DataTableRow>
                      <ul>
                        <li
                          onClick={() => {
                            loadDetail(item);
                          }}
                        >
                          <TooltipComponent
                            tag="a"
                            containerClassName="bg-white btn btn-sm btn-outline-light btn-icon btn-tooltip"
                            id={`id-${item._id}-details`} // Prefix the ID with 'id-' to make it a valid CSS selector
                            icon="eye"
                            direction="top"
                            text="Details"
                          />
                        </li>
                      </ul>
                    </DataTableRow>
                  </DataTableItem>
                ))
              ) : (
                <p>No KYC records found.</p>
              )}
            </DataTableBody>
            <div className="card-inner">
              {currentItems.length > 0 ? (
                <PaginationComponent
                  noDown
                  itemPerPage={itemPerPage}
                  totalItems={total}
                  paginate={paginate}
                  currentPage={currentPage}
                />
              ) : (
                <div className="text-center">
                  <span className="text-silent">No data found</span>
                </div>
              )}
            </div>
          </DataTable>
        </Block>
      </Content>

      <Modal isOpen={viewModal} toggle={() => setViewModal(false)} className="modal-dialog-centered" size="lg">
        <ModalBody>
          <a
            href="#cancel"
            onClick={(ev) => {
              ev.preventDefault();
              setViewModal(false);
            }}
            className="close"
          >
            <Icon name="cross-sm"></Icon>
          </a>
          <div className="nk-modal-head">
            <h4 className="nk-modal-title title">
              KYC Details <small className="text-primary"> {detail.id}</small>
            </h4>
          </div>
          <div className="nk-tnx-details mt-sm-3">
            <Row className="gy-3">
              <Col lg={6}>
                <span className="sub-text"> ID</span>
                <span className="caption-text">{detail.id}</span>
              </Col>
              <Col lg={6}>
                <span className="sub-text">Applicant Name </span>
                <span className="caption-text text-break">{detail.name}</span>
              </Col>
              <Col lg={6}>
                <span className="sub-text">Document Type </span>
                <span className="caption-text">{detail.doc}</span>
              </Col>
              <Col lg={6}>
                <span className="sub-text">Status</span>
                <Badge
                  color={detail.status === "Approved" ? "success" : detail.status === "Pending" ? "info" : "danger"}
                  size="md"
                >
                  {detail.status}
                </Badge>
              </Col>
              <Col lg={6}>
                <span className="sub-text">Date</span>
                <span className="caption-text"> {detail.date}</span>
              </Col>
              <Col lg={6}>
                <span className="sub-text">Checked By</span>
                <span className="caption-text"> {detail.checked}</span>
              </Col>
            </Row>
          </div>
        </ModalBody>
      </Modal>

      {/* Modal to display kyc toggle details */}
      {selectedKycData && (
        <Modal isOpen={modalDetail} toggle={toggleModalDetail} className="modal-dialog-centered" size="md">
          <ModalBody>
            <a
              href="#cancel"
              onClick={(ev) => {
                ev.preventDefault();
                toggleModalDetail();
              }}
              className="close"
            >
              <Icon name="cross-sm"></Icon>
            </a>
            <div className="nk-modal-head mb-4">
              <h4 className="nk-modal-title title">
                KYC STATUS{" "}
                <small className="text-primary mt-2 d-block">
                  <span className={`tb-status text-${getStatusClass(selectedKycData.status)}`}>
                    {getStatusName(selectedKycData.status)}
                  </span>
                </small>
              </h4>
            </div>
            <div className="nk-tnx-details">
              <div className="nk-modal-head mt-5 mb-1">
                <h5 className="title">User Info</h5>
              </div>
              <Row className="gy-3">
                <Col lg={6}>
                  <span className="caption-text"> {selectedKycData.fullname}</span>
                  <span className="caption-text"> {selectedKycData.userId.ID}</span>
                  <span className="caption-text"> {selectedKycData.userId.userName}</span>
                </Col>
                {/* <Col lg={6}>
                  <span className="sub-text">Details</span>
                  <span className="caption-text"></span>
                </Col> */}
              </Row>

              {/* <div className="d-flex justify-content-end gap-3 mt-4">
                <Button color="success" onClick={() => updateKycStatus(selectedKycData._id, 1)}>
                  Approve
                </Button>
                <Button color="danger" onClick={() => updateKycStatus(selectedKycData._id, 2)}>
                  Reject
                </Button>
              </div> */}
              <div className="mt-3 float-end">
                {selectedKycData.status === "0" ? (
                  isProcessing ? (
                    <p>Processing...</p> // Show processing message while API call is happening
                  ) : (
                    <>
                      <Button
                        onClick={() =>
                          navigate(`${process.env.PUBLIC_URL}/kyc-detailed/${selectedKycData._id}`, {
                            state: { userDetails: selectedKycData },
                          })
                        }
                        color="info"
                        className="me-2"
                      >
                        More Details
                      </Button>

                      <Button color="danger" className="me-2" onClick={() => updateKycStatus(selectedKycData._id, 2)}>
                        <Icon name="cross"></Icon>
                      </Button>
                      <Button color="success" onClick={() => updateKycStatus(selectedKycData._id, 1)}>
                        <Icon name="check"></Icon>
                      </Button>
                    </>
                  )
                ) : (
                  <p className="text-success">Status updated</p>
                )}
              </div>
            </div>
          </ModalBody>
        </Modal>
      )}
    </>
  );
};
export default KycList;
