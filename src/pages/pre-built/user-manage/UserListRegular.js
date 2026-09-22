import React, { useContext, useEffect, useState } from "react";
import {
  DropdownMenu,
  DropdownToggle,
  UncontrolledDropdown,
  DropdownItem
} from "reactstrap";
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
  UserAvatar,
  PaginationComponent,
  Button,
  DataTable,
  DataTableBody,
  DataTableHead,
  DataTableRow,
  DataTableItem,
  TooltipComponent,
  RSelect,
} from "../../../components/Component";
import Content from "../../../layout/content/Content";
import Head from "../../../layout/head/Head";
import { filterRole, filterStatus, userData } from "./UserData";
import { bulkActionOptions, findUpper } from "../../../utils/Utils";
import { Link } from "react-router-dom";
import { UserContext } from "./UserContext";
import EditModal from "./EditModal";
import AddModal from "./AddModal";
import { AuthContext } from "../../../context/AuthContext";
import axiosInstance from "../../../utils/AxiosInstance";
import { formatDistanceToNow } from "date-fns";



const UserListRegularPage = () => {
  const { contextData } = useContext(UserContext);
  const [data, setData] = contextData;

  const [sm, updateSm] = useState(false);
  const [tablesm, updateTableSm] = useState(false);
  const [onSearch, setonSearch] = useState(true);
  const [onSearchText, setSearchText] = useState("");
  const [modal, setModal] = useState({
    edit: false,
    add: false,
  });
  const [editId, setEditedId] = useState();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    balance: 0,
    phone: "",
    status: "Active",
  });
  const [editFormData, setEditFormData] = useState({
    name: "",
    email: "",
    balance: 0,
    phone: "",
    status: "",
  });
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

  // unselects the data on mount
  useEffect(() => {
    let newData;
    newData = userData.map((item) => {
      item.checked = false;
      return item;
    });
    setData([...newData]);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // Changing state value when searching name
  useEffect(() => {
    if (onSearchText !== "") {
      const filteredObject = userData.filter((item) => {
        return (
          item.name.toLowerCase().includes(onSearchText.toLowerCase()) ||
          item.email.toLowerCase().includes(onSearchText.toLowerCase())
        );
      });
      setData([...filteredObject]);
    } else {
      setData([...userData]);
    }
  }, [onSearchText, setData]);

  // function to set the action to be taken in table header
  const onActionText = (e) => {
    setActionText(e.value);
  };

  // onChange function for searching name
  const onFilterChange = (e) => {
    setSearchText(e.target.value);
  };

  // function to change the selected property of an item
  const onSelectChange = (e, id) => {
    let newData = data;
    let index = newData.findIndex((item) => item.id === id);
    newData[index].checked = e.currentTarget.checked;
    setData([...newData]);
  };

  // function to reset the form
  const resetForm = () => {
    setFormData({
      name: "",
      email: "",
      balance: 0,
      phone: "",
      status: "Active",
    });
  };

  const closeModal = () => {
    setModal({ add: false });
    resetForm();
  };

  const closeEditModal = () => {
    setModal({ edit: false });
    resetForm();
  };

  // submit function to add a new item
  const onFormSubmit = (submitData) => {
    const { name, email, balance, phone } = submitData;
    let submittedData = {
      id: data.length + 1,
      avatarBg: "purple",
      name: name,
      role: "Customer",
      email: email,
      balance: balance,
      phone: phone,
      emailStatus: "success",
      kycStatus: "alert",
      lastLogin: "10 Feb 2020",
      status: formData.status,
      country: "Bangladesh",
    };
    setData([submittedData, ...data]);
    resetForm();
    setModal({ edit: false }, { add: false });
  };

  // submit function to update a new item
  const onEditSubmit = (submitData) => {
    const { name, email, phone } = submitData;
    let submittedData;
    let newitems = data;
    newitems.forEach((item) => {
      if (item.id === editId) {
        submittedData = {
          id: item.id,
          avatarBg: item.avatarBg,
          name: name,
          image: item.image,
          role: item.role,
          email: email,
          balance: editFormData.balance,
          phone: phone,
          emailStatus: item.emailStatus,
          kycStatus: item.kycStatus,
          lastLogin: item.lastLogin,
          status: editFormData.status,
          country: item.country,
        };
      }
    });
    let index = newitems.findIndex((item) => item.id === editId);
    newitems[index] = submittedData;
    setModal({ edit: false });
  };

  // function that loads the want to editted data
  const onEditClick = (id) => {
    data.forEach((item) => {
      if (item.id === id) {
        setEditFormData({
          name: item.name,
          email: item.email,
          status: item.status,
          phone: item.phone,
          balance: item.balance,
        });
        setModal({ edit: true }, { add: false });
        setEditedId(id);
      }
    });
  };

  // function to change the check property of an item
  const selectorCheck = (e) => {
    let newData;
    newData = data.map((item) => {
      item.checked = e.currentTarget.checked;
      return item;
    });
    setData([...newData]);
  };

  // function which fires on applying selected action
  const onActionClick = (e) => {
    if (actionText === "suspend") {
      let newData = data.map((item) => {
        if (item.checked === true) item.status = "Suspend";
        return item;
      });
      setData([...newData]);
    } else if (actionText === "delete") {
      let newData;
      newData = data.filter((item) => item.checked !== true);
      setData([...newData]);
    }
  };

  // function to toggle the search option
  const toggle = () => setonSearch(!onSearch);

  // Get current list, pagination
  const indexOfLastItem = currentPage * itemPerPage;
  const indexOfFirstItem = indexOfLastItem - itemPerPage;
  const currentItems = data.slice(indexOfFirstItem, indexOfLastItem);

  // Change Page
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  // code written by backend developer
  // ********************************
  const [users, setUsers] = useState([]);
  const [total, setTotal] = useState();
  const [loadingUserId, setLoadingUserId] = useState(null);
  const [statusFilter, setStatusFilter] = useState(""); // State for status filter

  const { adminInfo } = useContext(AuthContext); // Use your actual context

  const handleStatusFilterChange = (selectedOption) => {
    setStatusFilter(selectedOption.value); // Assuming the options are in { value: "0", label: "Active" } format
  };

  const resetFilters = () => {
    setStatusFilter(""); // Reset status filter
    // setOnSearchText(""); // Reset search query
    fetchUsers(); // Re-fetch users with reset filters
  };

  const fetchUsers = async () => {
    try {
      const response = await axiosInstance.get(
        `/admin/users/list?limit=${itemPerPage}&page=${currentPage}&search=${onSearchText}&status=${statusFilter}`,
        {
          headers: {
            Authorization: `Bearer ${adminInfo.token}`, // Use the token from adminInfo context
          },
        }
      );
      // console.log(response.data.data.users);
      // Set the fetched users
      setUsers(response.data.data.users);
      
      setTotal(Number(response.data.data.count));
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [currentPage, adminInfo, itemPerPage, onSearchText, statusFilter]);

  // function to change to suspend property for an item
  const suspendUser = async (id) => {
    if (loadingUserId) return; // Prevent further clicks if already loading

    setLoadingUserId(id); // Set the current user as loading

    try {
      const response = await axiosInstance.put(
        `/admin/users/toggle-status/${id}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${adminInfo.token}`, // Use the token from adminInfo context
          },
        }
      );
      if (response.data.success === true) {
        let newData = users;
        let index = newData.findIndex((item) => item._id === id);
        newData[index].isActive = !newData[index].isActive;
        setUsers([...newData]);
      }
      if (data.success === false && data.status === "failure") {
        console.error("Error updating user status:", data.message);
      }
    } catch (error) {
      console.error("Error updating user status:", error);
    } finally {
      setLoadingUserId(null); // Reset loading state after API call
    }
  };

  // ********************************

  return (
    <React.Fragment>
      <Head title="User List"></Head>
      <Content>
        <BlockHead size="sm">
          <BlockBetween>
            <BlockHeadContent>
              <BlockTitle tag="h3" page>
                Users Lists
              </BlockTitle>
              <BlockDes className="text-soft">
                <p>You have total {total} users.</p>
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
                      <h5 className="title">User Lists</h5>
                    </div>
                  </div>
                </div>
                <div className="card-tools me-n1">
                  <ul className="btn-toolbar gx-1">
                    <li>
                      <a
                        href="#search"
                        onClick={(ev) => {
                          ev.preventDefault();
                          toggle();
                        }}
                        className="btn btn-icon search-toggle toggle-search"
                      >
                        <Icon name="search"></Icon>
                      </a>
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
                                    <span className="sub-title dropdown-title">Filter Users</span>
                                    <div className="dropdown">
                                      <a
                                        href="#more"
                                        onClick={(ev) => {
                                          ev.preventDefault();
                                        }}
                                        className="btn btn-sm btn-icon"
                                      >
                                        <Icon name="more-h"></Icon>
                                      </a>
                                    </div>
                                  </div>
                                  <div className="dropdown-body dropdown-body-rg">
                                    <Row className="gx-6 gy-3">
                                      {/* <Col size="6">
                                        <div className="custom-control custom-control-sm custom-checkbox">
                                          <input type="checkbox" className="custom-control-input" id="hasBalance" />
                                          <label className="custom-control-label" htmlFor="hasBalance">
                                            {" "}
                                            Have Balance
                                          </label>
                                        </div>
                                      </Col> */}
                                      {/* <Col size="6">
                                        <div className="custom-control custom-control-sm custom-checkbox">
                                          <input type="checkbox" className="custom-control-input" id="hasKYC" />
                                          <label className="custom-control-label" htmlFor="hasKYC">
                                            {" "}
                                            KYC Verified
                                          </label>
                                        </div>
                                      </Col> */}
                                      {/* <Col size="6">
                                        <div className="form-group">
                                          <label className="overline-title overline-title-alt">Role</label>
                                          <RSelect options={filterRole} placeholder="Any Role" />
                                        </div>
                                      </Col> */}
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
                                      {/* <Col size="12">
                                        <div className="form-group">
                                          <button type="button" className="btn btn-secondary">
                                            Filter
                                          </button>
                                        </div>
                                      </Col> */}
                                    </Row>
                                  </div>
                                  <div className="dropdown-foot between">
                                    <a
                                      href="#reset"
                                      onClick={(ev) => {
                                        ev.preventDefault();
                                        resetFilters();
                                      }}
                                      className="clickable"
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
                                <DropdownToggle color="tranparent" className="btn btn-trigger btn-icon dropdown-toggle">
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
                      className="search-back btn-icon toggle-search active"
                      onClick={() => {
                        setSearchText("");
                        toggle();
                      }}
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
            <DataTableBody className="listTable">
              <DataTableHead>
                <DataTableRow className="nk-tb-col-check">
                  <div className="custom-control custom-control-sm custom-checkbox notext">
                    <input
                      type="checkbox"
                      className="custom-control-input"
                      onChange={(e) => selectorCheck(e)}
                      id="uid"
                    />
                    <label className="custom-control-label" htmlFor="uid"></label>
                  </div>
                </DataTableRow>
                <DataTableRow>
                  <span className="sub-text">ID</span>
                </DataTableRow>
                <DataTableRow>
                  <span className="sub-text">User</span>
                </DataTableRow>
                <DataTableRow>
                  <span className="sub-text">Deposit Balance</span>
                </DataTableRow>
                <DataTableRow>
                  <span className="sub-text">CURRENT Balance</span>
                </DataTableRow>
                <DataTableRow>
                  <span className="sub-text">Phone</span>
                </DataTableRow>
                {/* <DataTableRow size="lg">
                  <span className="sub-text">Verified</span>
                </DataTableRow> */}
                <DataTableRow>
                  <span className="sub-text">Last Login</span>
                </DataTableRow>
                <DataTableRow>
                  <span className="sub-text">Status</span>
                </DataTableRow>
                <DataTableRow className="nk-tb-col-tools text-end">
                  {/* <UncontrolledDropdown>
                    <DropdownToggle
                      color="tranparent"
                      className="btn btn-xs btn-outline-light btn-icon dropdown-toggle"
                    >
                      <Icon name="plus"></Icon>
                    </DropdownToggle>
                    <DropdownMenu end className="dropdown-menu-xs">
                      <ul className="link-tidy sm no-bdr">
                        <li>
                          <div className="custom-control custom-control-sm custom-checkbox">
                            <input type="checkbox" className="custom-control-input" id="bl" />
                            <label className="custom-control-label" htmlFor="bl">
                              Balance
                            </label>
                          </div>
                        </li>
                        <li>
                          <div className="custom-control custom-control-sm custom-checkbox">
                            <input type="checkbox" className="custom-control-input" id="bl" />
                            <label className="custom-control-label" htmlFor="bl">
                              Interest balance
                            </label>
                          </div>
                        </li>
                        <li>
                          <div className="custom-control custom-control-sm custom-checkbox">
                            <input type="checkbox" className="custom-control-input" id="ph" />
                            <label className="custom-control-label" htmlFor="ph">
                              Phone
                            </label>
                          </div>
                        </li>
                        <li>
                          <div className="custom-control custom-control-sm custom-checkbox">
                            <input type="checkbox" className="custom-control-input" id="st" />
                            <label className="custom-control-label" htmlFor="st">
                              Status
                            </label>
                          </div>
                        </li>
                      </ul>
                    </DropdownMenu>
                  </UncontrolledDropdown> */}
                </DataTableRow>
              </DataTableHead>
              {/*Head*/}
              {users.length > 0
                ? users.map((user) => {
                  return (
                    <DataTableItem key={user._id}>
                      <DataTableRow className="nk-tb-col-check">
                        <div className="custom-control custom-control-sm custom-checkbox notext">
                          <input
                            type="checkbox"
                            className="custom-control-input"
                            defaultChecked={user.checked}
                            id={user._id + "uid1"}
                            key={Math.random()}
                            onChange={(e) => onSelectChange(e, user._id)}
                          />
                          <label className="custom-control-label" htmlFor={user._id + "uid1"}></label>
                        </div>
                      </DataTableRow>
                      <DataTableRow>
                        <span>{`${user.ID} `}</span>
                      </DataTableRow>
                      <DataTableRow>
                        <Link to={`${process.env.PUBLIC_URL}/user-profile/${user._id}`}>
                          <div className="user-card">
                            {/* <UserAvatar
                                theme={item.avatarBg}
                                text={findUpper(item.name)}
                                image={item.image}
                              ></UserAvatar> */}
                            <div className="user-info">
                              <span className="tb-lead">
                                {`${user.firstName} ${user.lastName}`}
                                <span
                                  className={`dot dot-${
                                    user.status === true ? "success" : user.status === false ? "warning" : "danger"
                                  } d-md-none ms-1`}
                                ></span>
                              </span>
                              <span>{user.email}</span>
                            </div>
                          </div>
                        </Link>
                      </DataTableRow>
                      <DataTableRow className="text-nowrap">
                        <span className="tb-amount ">
                          {user.depositBalance.toFixed(2)} <span className="currency">USD</span>
                        </span>
                      </DataTableRow>
                      <DataTableRow className="text-nowrap">
                        <span className="tb-amount">
                          {user.earnedBalance.toFixed(2)} <span className="currency">USD</span>
                        </span>
                      </DataTableRow>
                      <DataTableRow className="text-nowrap">
                        <span>{`${user.countryCode} ${user.phone}`}</span>
                      </DataTableRow>
                      {/* <DataTableRow size="lg">
                          <ul className="list-status">
                            <li>
                              <Icon
                                className={`text-${
                                  item.emailStatus === "success"
                                    ? "success"
                                    : item.emailStatus === "pending"
                                    ? "info"
                                    : "secondary"
                                }`}
                                name={`${
                                  item.emailStatus === "success"
                                    ? "check-circle"
                                    : item.emailStatus === "alert"
                                    ? "alert-circle"
                                    : "alarm-alt"
                                }`}
                              ></Icon>{" "}
                              <span>Email</span>
                            </li>
                            <li>
                              <Icon
                                className={`text-${
                                  item.kycStatus === "success"
                                    ? "success"
                                    : item.kycStatus === "pending"
                                    ? "info"
                                    : item.kycStatus === "warning"
                                    ? "warning"
                                    : "secondary"
                                }`}
                                name={`${
                                  item.kycStatus === "success"
                                    ? "check-circle"
                                    : item.kycStatus === "pending"
                                    ? "alarm-alt"
                                    : "alert-circle"
                                }`}
                              ></Icon>{" "}
                              <span>KYC</span>
                            </li>
                          </ul>
                        </DataTableRow> */}

                      <DataTableRow className="text-nowrap">
                        {user.lastLogin ? (
                          <span>{formatDistanceToNow(new Date(user.lastLogin), { addSuffix: true })}</span>
                        ) : (
                          <span>Never logged in</span> // Or any other fallback text
                        )}
                      </DataTableRow>
                      <DataTableRow>
                        <span className={`tb-status text-${user.isActive ? "success" : "danger"}`}>
                          {user.isActive ? "Active" : "Inactive"}
                        </span>
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
                                  <Link to={`${process.env.PUBLIC_URL}/user-profile/${user._id}`}>
                                    <Icon name="edit"></Icon>
                                    <span>Edit</span>
                                  </Link>

                                  {user.status !== false && (
                                    <React.Fragment>
                                      <li className="divider"></li>
                                      <li
                                        onClick={() => {
                                          if (!loadingUserId) suspendUser(user._id);
                                        }}
                                        className={loadingUserId === user._id ? "disabled" : ""}
                                      >
                                        <DropdownItem
                                          tag="a"
                                          href="#suspend"
                                          onClick={(ev) => {
                                            ev.preventDefault();
                                          }}
                                        >
                                          <Icon name="na"></Icon>
                                          <span>{loadingUserId === user._id ? "Processing..." : "Suspend User"}</span>
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

        <AddModal
          modal={modal.add}
          formData={formData}
          setFormData={setFormData}
          closeModal={closeModal}
          onSubmit={onFormSubmit}
          filterStatus={filterStatus}
        />
        <EditModal
          modal={modal.edit}
          formData={editFormData}
          setFormData={setEditFormData}
          closeModal={closeEditModal}
          onSubmit={onEditSubmit}
          filterStatus={filterStatus}
        />
      </Content>
    </React.Fragment>
  );
};
export default UserListRegularPage;
