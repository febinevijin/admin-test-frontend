import React, { useState, useEffect } from "react";
import Content from "../../../layout/content/Content";
import Head from "../../../layout/head/Head";
import {
  Modal,
  ModalBody,
  UncontrolledDropdown,
  DropdownMenu,
  DropdownToggle,
  
  DropdownItem,
  Badge,
} from "reactstrap";
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
import { Link } from "react-router-dom";

const KycListRegular = () => {
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
  const loadDetail = (id) => {
    let index = data.findIndex((item) => item.id === id);
    setDetail(data[index]);
  };

  // function to toggle the search option
  const toggle = () => setonSearch(!onSearch);

  // Get current list, pagination
  const indexOfLastItem = currentPage * itemPerPage;
  const indexOfFirstItem = indexOfLastItem - itemPerPage;
  const currentItems = data.slice(indexOfFirstItem, indexOfLastItem);

  // Change Page
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <>
      <Head title="KYC Lists - Regular"></Head>
      <Content>
        <BlockHead size="sm">
          <BlockBetween>
            <BlockHeadContent>
              <BlockTitle page>KYC Documents</BlockTitle>
              <BlockDes className="text-soft">
                <p>You have total {data.length} KYC documents.</p>
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
                    <li>
                      <Button
                        onClick={(ev) => {
                          ev.preventDefault();
                          toggle();
                        }}
                        className="btn-icon search-toggle toggle-search"
                      >
                        <Icon name="search"></Icon>
                      </Button>
                    </li>
                    <li className="btn-toolbar-sep"></li>
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
                                          <RSelect options={filterDoc} placeholder="Any Type" />
                                        </div>
                                      </Col>
                                      <Col size="6">
                                        <div className="form-group">
                                          <label className="overline-title overline-title-alt">Status</label>
                                          <RSelect options={filterStatus} placeholder="Any Status" />
                                        </div>
                                      </Col>
                                      <Col size="12">
                                        <div className="form-group">
                                          <Button type="button" color="secondary">
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
                                      }}
                                    >
                                      Reset Filter
                                    </a>
                                    <a
                                      href="#save"
                                      onClick={(ev) => {
                                        ev.preventDefault();
                                      }}
                                    >
                                      Save Filter
                                    </a>
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
                  <span>Checked by</span>
                </DataTableRow>
                <DataTableRow className="nk-tb-col-tools">&nbsp;</DataTableRow>
              </DataTableHead>

              {currentItems.length > 0
                ? currentItems.map((item) => {
                    return (
                      <DataTableItem key={item.id}>
                        <DataTableRow className="nk-tb-col-check">
                          <div className="custom-control custom-control-sm custom-checkbox notext">
                            <input
                              type="checkbox"
                              className="custom-control-input"
                              defaultChecked={item.check}
                              id={item.id + "uid1"}
                              key={Math.random()}
                              onChange={(e) => onSelectChange(e, item.id)}
                            />
                            <label className="custom-control-label" htmlFor={item.id + "uid1"}></label>
                          </div>
                        </DataTableRow>
                        <DataTableRow>
                          <Link to={`${process.env.PUBLIC_URL}/kyc-details/${item.id}`}>
                            <div className="user-card">
                              <UserAvatar
                                theme={item.avatarBg}
                                text={findUpper(item.name)}
                                image={item.image}
                              ></UserAvatar>
                              <div className="user-info">
                                <span className="tb-lead text-nowrap">
                                  {item.name}{" "}
                                  <span
                                    className={`dot dot-${
                                      item.status === "Approved"
                                        ? "success"
                                        : item.status === "Pending"
                                        ? "info"
                                        : "danger"
                                    } d-md-none ms-1`}
                                  ></span>
                                </span>
                                <span>{item.id}</span>
                              </div>
                            </div>
                          </Link>
                        </DataTableRow>
                        <DataTableRow>
                          <span className="tb-lead-sub">{item.doc}</span>
                        </DataTableRow>
                        <DataTableRow>
                          <ul className="list-inline list-download text-nowrap">
                            {item.front && (
                              <li>
                                Front Side{" "}
                                <a
                                  href="#download"
                                  onClick={(ev) => {
                                    ev.preventDefault();
                                  }}
                                  className="popup"
                                >
                                  <Icon name="download"></Icon>
                                </a>
                              </li>
                            )}
                            {item.back && (
                              <li>
                                Back Side{" "}
                                <a
                                  href="#download"
                                  onClick={(ev) => {
                                    ev.preventDefault();
                                  }}
                                  className="popup"
                                >
                                  <Icon name="download"></Icon>
                                </a>
                              </li>
                            )}
                          </ul>
                        </DataTableRow>
                        <DataTableRow className="text-nowrap">
                          <span className="tb-date">{item.date}</span>
                        </DataTableRow>
                        <DataTableRow>
                          <span
                            className={`tb-status text-${
                              item.status === "Approved" ? "success" : item.status === "Pending" ? "info" : "danger"
                            }`}
                          >
                            {item.status}
                          </span>
                          {item.status !== "Pending" && (
                            <TooltipComponent
                              icon="info"
                              direction="top"
                              id={item.id + "pendingless"}
                              text={`${item.status} at Dec 18, 2019 01:02 am`}
                            ></TooltipComponent>
                          )}
                          {!item.status === "Pending" && (
                            <span>
                              <TooltipComponent icon="info" direction="top" text={item.date} id={item.id} />
                            </span>
                          )}
                        </DataTableRow>
                        <DataTableRow>
                          <div className="user-card">
                            <UserAvatar theme="orange-dim" size="xs" text={findUpper(item.checked)}></UserAvatar>
                            <div className="user-name">
                              <span className="tb-lead text-nowrap">{item.checked} </span>
                            </div>
                          </div>
                        </DataTableRow>
                        <DataTableRow className="nk-tb-col-tools">
                          <ul className="nk-tb-actions gx-1">
                            <li>
                              <UncontrolledDropdown>
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
                                          loadDetail(item.id);
                                          setViewModal(true);
                                        }}
                                      >
                                        <Icon name="eye"></Icon>
                                        <span>Quick View</span>
                                      </DropdownItem>
                                    </li>
                                    <li>
                                      <Link
                                        to={`${process.env.PUBLIC_URL}/kyc-details/${item.id}`}
                                      >
                                        <Icon name="focus"></Icon>
                                        <span>View Details</span>
                                      </Link>
                                    </li>
                                    {item.status === "Rejected" ? null : item.status === "Approved" ? (
                                      <li onClick={() => onRejectClick(item.id)}>
                                        <DropdownItem
                                          tag="a"
                                          href="#reject"
                                          onClick={(ev) => {
                                            ev.preventDefault();
                                          }}
                                        >
                                          <Icon name="na"></Icon>
                                          <span>Reject User</span>
                                        </DropdownItem>
                                      </li>
                                    ) : (
                                      <React.Fragment>
                                        <li onClick={() => onApproveClick(item.id)}>
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
                                        <li onClick={() => onRejectClick(item.id)}>
                                          <DropdownItem
                                            tag="a"
                                            href="#suspend"
                                            onClick={(ev) => {
                                              ev.preventDefault();
                                            }}
                                          >
                                            <Icon name="na"></Icon>
                                            <span>Suspend User</span>
                                          </DropdownItem>
                                        </li>
                                      </React.Fragment>
                                    )}
                                  </ul>
                                </DropdownMenu>
                              </UncontrolledDropdown>
                            </li>
                          </ul>
                        </DataTableRow>
                      </DataTableItem>
                    );
                  })
                : null}
            </DataTableBody>
            <div className="card-inner">
              {currentItems.length > 0 ? (
                <PaginationComponent
                  noDown
                  itemPerPage={itemPerPage}
                  totalItems={data.length}
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
    </>
  );
};
export default KycListRegular;
