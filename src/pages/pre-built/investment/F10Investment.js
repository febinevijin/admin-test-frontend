import React, { useState, useEffect, useContext, useMemo, useCallback } from "react";
import Content from "../../../layout/content/Content";
import Head from "../../../layout/head/Head";
import { Link } from "react-router-dom";
import {
  Modal,
  ModalBody,
  Badge,
  Spinner,
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
  DataTable,
  DataTableBody,
  DataTableHead,
  DataTableRow,
  DataTableItem,
  PaginationComponent,
  RSelect,
} from "../../../components/Component";
import axiosInstance from "../../../utils/AxiosInstance";
import { AuthContext } from "../../../context/AuthContext";
import useShowToast from "../../hooks/useShowToast";

// Helper functions to safely extract display values and avoid object-as-child react errors
const formatUserOrEmail = (user) => {
  if (!user) return "User";
  if (typeof user === "string") return user;
  if (typeof user === "object") {
    const fullName = `${user.firstName || ""} ${user.lastName || ""}`.trim();
    if (fullName) return fullName;
    if (user.userName) return String(user.userName);
    if (user.email) return String(user.email);
    if (user.ID) return String(user.ID);
    if (user._id || user.id) return String(user._id || user.id);
    return "User";
  }
  return String(user);
};

const getEmail = (user) => {
  if (!user) return "";
  if (typeof user === "string") return user.includes("@") ? user : "";
  if (typeof user === "object" && user !== null) {
    if (typeof user.email === "string") return user.email;
    return "";
  }
  return "";
};

const getUserIdString = (user) => {
  if (!user) return "";
  if (typeof user === "string") return user;
  if (typeof user === "object" && user !== null) {
    return String(user.id || user._id || user.ID || "");
  }
  return "";
};

const getUserDisplayId = (user) => {
  if (!user) return "";
  if (typeof user === "string") return user;
  if (typeof user === "object" && user !== null) {
    return String(user.ID || user.id || user._id || "");
  }
  return "";
};

const statusOptions = [
  { value: "", label: "All Statuses" },
  { value: "0", label: "Pending" },
  { value: "1", label: "Approved" },
  { value: "2", label: "Rejected" },
];

const F10Investment = () => {
  const { adminInfo } = useContext(AuthContext);
  const showToast = useShowToast();

  // -------------------------------------------------------------
  // F10 MARKET VALUE & FIXED BASE PRICE STATE & API (GET & POST /admin/f10/rate)
  // -------------------------------------------------------------
  const [marketValueModal, setMarketValueModal] = useState(false);
  const [rate, setRate] = useState("");
  const [fixedValue, setFixedValue] = useState("");
  const [marketValueLoading, setMarketValueLoading] = useState(false);

  // Fetch current rate and fixed base value from backend
  const fetchMarketValue = useCallback(async () => {
    if (!adminInfo?.token) return;
    try {
      const res = await axiosInstance.get("/admin/f10/rate", {
        headers: { Authorization: `Bearer ${adminInfo.token}` },
      });
      const data = res.data?.data || res.data;
      if (data) {
        const rateVal = data.rate !== undefined ? data.rate : data.currentRate;
        if (rateVal !== undefined && rateVal !== null) {
          setRate(String(rateVal));
        }
        const baseVal = data.fixedValue !== undefined ? data.fixedValue : data.baseValue;
        if (baseVal !== undefined && baseVal !== null) {
          setFixedValue(String(baseVal));
        }
      }
    } catch (err) {
      console.error("Error fetching F10 market value / rate:", err);
    }
  }, [adminInfo?.token]);

  useEffect(() => {
    fetchMarketValue();
  }, [fetchMarketValue]);

  // Calculate live market value for 1 F10 token: fixedValue * (1 + rate / 100)
  const calculatedTokenPrice = useMemo(() => {
    const f = parseFloat(fixedValue);
    const r = parseFloat(rate);
    if (!isNaN(f) && f > 0) {
      const yieldRate = isNaN(r) ? 0 : r;
      return (f * (1 + yieldRate / 100)).toFixed(4);
    }
    return null;
  }, [fixedValue, rate]);

  // Handle Save F10 Fixed Base Price ($) & Daily Rate (%)
  const handleSaveMarketValue = async (e) => {
    if (e) e.preventDefault();
    const fixedNum = parseFloat(fixedValue);
    const rateNum = parseFloat(rate);

    if (isNaN(fixedNum) || fixedNum <= 0) {
      showToast("Error", "Please enter a valid fixed base price ($) greater than 0", "error");
      return;
    }
    if (isNaN(rateNum) || rateNum < 0) {
      showToast("Error", "Please enter a valid non-negative rate (%)", "error");
      return;
    }

    try {
      setMarketValueLoading(true);
      const payload = {
        fixedValue: fixedNum,
        rate: rateNum,
      };
      const res = await axiosInstance.post(
        "/admin/f10/rate",
        payload,
        { headers: { Authorization: `Bearer ${adminInfo?.token}` } }
      );
      showToast("Success", res.data?.message || "F10 Base Price & Rate saved successfully!", "success");
      setMarketValueModal(false);
      fetchMarketValue();
    } catch (err) {
      console.error("Error saving F10 market value / base price:", err);
      showToast("Error", err.response?.data?.message || "Failed to save F10 market value", "error");
    } finally {
      setMarketValueLoading(false);
    }
  };

  // -------------------------------------------------------------
  // WITHDRAWAL REQUESTS STATE (GET /admin/f10/withdraw-list)
  // -------------------------------------------------------------
  const [withdrawals, setWithdrawals] = useState([]);
  const [withdrawalsTotal, setWithdrawalsTotal] = useState(0);
  const [withdrawalsLoading, setWithdrawalsLoading] = useState(false);
  const [withdrawalsPage, setWithdrawalsPage] = useState(1);
  const [withdrawalsPerPage, setWithdrawalsPerPage] = useState(10);
  const [withdrawStatusFilter, setWithdrawStatusFilter] = useState(""); // "": All Statuses, "0": Pending, "1": Approved, "2": Rejected
  const [withdrawSearchText, setWithdrawSearchText] = useState("");
  const [onWithdrawSearch, setOnWithdrawSearch] = useState(true);

  // Approval & Rejection modals
  const [selectedWithdrawal, setSelectedWithdrawal] = useState(null);
  const [approveModal, setApproveModal] = useState(false);
  const [rejectModal, setRejectModal] = useState(false);
  const [rejectReason, setRejectReason] = useState("");
  const [verifyLoading, setVerifyLoading] = useState(false);

  // Fetch Withdrawal Requests
  const fetchWithdrawals = useCallback(async () => {
    if (!adminInfo?.token) return;
    try {
      setWithdrawalsLoading(true);
      const params = new URLSearchParams({
        page: withdrawalsPage,
        limit: withdrawalsPerPage,
      });
      if (withdrawStatusFilter !== "") {
        params.append("status", withdrawStatusFilter);
      }
      const res = await axiosInstance.get(`/admin/f10/withdraw-list?${params.toString()}`, {
        headers: { Authorization: `Bearer ${adminInfo.token}` },
      });
      const data = res.data?.data || res.data;
      if (data) {
        // Backend returns data.withdrawRequests array
        const list =
          data.withdrawRequests ||
          data.withdrawals ||
          data.requests ||
          data.withdrawList ||
          (Array.isArray(data) ? data : []);
        setWithdrawals(list);
        setWithdrawalsTotal(Number(data.totalCount ?? res.data?.totalCount ?? data.total ?? list.length ?? 0));
      }
    } catch (err) {
      console.error("Error fetching F10 withdrawals:", err);
    } finally {
      setWithdrawalsLoading(false);
    }
  }, [adminInfo?.token, withdrawalsPage, withdrawalsPerPage, withdrawStatusFilter]);

  useEffect(() => {
    fetchWithdrawals();
  }, [fetchWithdrawals]);

  // Client-side search filter
  const displayedWithdrawals = useMemo(() => {
    if (!withdrawSearchText.trim()) return withdrawals;
    const q = withdrawSearchText.toLowerCase();
    return withdrawals.filter((item) => {
      const name = `${item.userId?.firstName || ""} ${item.userId?.lastName || ""}`.toLowerCase();
      const username = (item.userId?.userName || "").toLowerCase();
      const email = (item.userId?.email || "").toLowerCase();
      const userCode = (item.userId?.ID || "").toLowerCase();
      const addr = (item.withdrawAddress || "").toLowerCase();
      const amount = (item.amount ? String(item.amount) : "").toLowerCase();
      return (
        name.includes(q) ||
        username.includes(q) ||
        email.includes(q) ||
        userCode.includes(q) ||
        addr.includes(q) ||
        amount.includes(q)
      );
    });
  }, [withdrawals, withdrawSearchText]);

  // Handle Verify Withdrawal (Approve / Reject with refund)
  const handleVerifyWithdrawal = async (status, reason = "") => {
    if (!selectedWithdrawal) return;
    try {
      setVerifyLoading(true);
      const payload = {
        withdrawRequestId: selectedWithdrawal._id || selectedWithdrawal.id,
        status: String(status),
        rejectReason: reason,
      };
      const res = await axiosInstance.put("/admin/f10/withdraw-verify", payload, {
        headers: { Authorization: `Bearer ${adminInfo?.token}` },
      });
      showToast(
        "Success",
        res.data?.message || (status === "1" ? "Withdrawal approved successfully!" : "Withdrawal rejected & refunded!"),
        "success"
      );
      setApproveModal(false);
      setRejectModal(false);
      setRejectReason("");
      setSelectedWithdrawal(null);
      fetchWithdrawals();
    } catch (err) {
      console.error("Error verifying F10 withdrawal:", err);
      showToast("Error", err.response?.data?.message || "Failed to verify withdrawal", "error");
    } finally {
      setVerifyLoading(false);
    }
  };

  // Status helper badges
  const renderStatusBadge = (status) => {
    if (typeof status === "object" && status !== null) {
      status = status.name || status.status || status.label || "Unknown";
    }
    const s = String(status);
    if (s === "0" || s === "Pending" || s === "ACTIVE") {
      return <Badge color="warning" className="badge-dim badge-sm">Pending</Badge>;
    }
    if (s === "1" || s === "Approved" || s === "Completed" || s === "COMPLETED") {
      return <Badge color="success" className="badge-dim badge-sm">Approved</Badge>;
    }
    if (s === "2" || s === "Rejected" || s === "Cancelled") {
      return <Badge color="danger" className="badge-dim badge-sm">Rejected</Badge>;
    }
    return <Badge color="secondary" className="badge-dim badge-sm">{s || "Unknown"}</Badge>;
  };

  return (
    <>
      <Head title="F10 Withdrawal Requests" />
      <Content>
        {/* Page Header with F10 Market Value Button */}
        <BlockHead size="sm">
          <BlockBetween>
            <BlockHeadContent>
              <BlockTitle page>F10 Withdrawal Requests</BlockTitle>
              <BlockDes className="text-soft">
                <p>You have total {withdrawalsTotal} withdrawal requests.</p>
              </BlockDes>
            </BlockHeadContent>
            <BlockHeadContent>
              <div className="d-flex align-items-center gap-2 flex-wrap">
                {fixedValue && (
                  <Badge color="light" className="badge-dim py-1 px-2 border">
                    Base: <strong className="text-primary ms-1">${Number(fixedValue).toFixed(2)}</strong>
                  </Badge>
                )}
                {rate && (
                  <Badge color="light" className="badge-dim py-1 px-2 border">
                    Rate: <strong className="text-success ms-1">{rate}%</strong>
                  </Badge>
                )}
                {calculatedTokenPrice && (
                  <Badge color="primary" className="badge-dim py-1 px-2">
                    1 F10: <strong>${calculatedTokenPrice}</strong>
                  </Badge>
                )}
                <Button
                  color="primary"
                  onClick={() => setMarketValueModal(true)}
                >
                  <Icon name="setting-alt" className="me-1"></Icon>
                  <span>F10 Rate</span>
                </Button>
              </div>
            </BlockHeadContent>
          </BlockBetween>
        </BlockHead>

        {/* Withdrawal Requests Table */}
        <Block>
          <DataTable className="card-stretch listTable">
            <div className="card-inner">
              <div className="card-title-group">
                <div className="card-title">
                  <h5 className="title">All Withdrawal Requests</h5>
                </div>
                <div className="card-tools me-n1">
                  <ul className="btn-toolbar gx-2">
                    <li>
                      <div className="form-control-wrap" style={{ minWidth: "160px" }}>
                        <RSelect
                          options={statusOptions}
                          value={statusOptions.find((opt) => opt.value === withdrawStatusFilter) || statusOptions[0]}
                          onChange={(opt) => {
                            setWithdrawStatusFilter(opt.value);
                            setWithdrawalsPage(1);
                          }}
                        />
                      </div>
                    </li>
                    <li>
                      <Button
                        href="#search"
                        onClick={(ev) => {
                          ev.preventDefault();
                          setOnWithdrawSearch(!onWithdrawSearch);
                          if (!onWithdrawSearch) setWithdrawSearchText("");
                        }}
                        className="btn-icon search-toggle toggle-search"
                      >
                        <Icon name="search"></Icon>
                      </Button>
                    </li>
                    <li>
                      <Button
                        color="light"
                        className="btn-icon"
                        onClick={() => fetchWithdrawals()}
                        title="Refresh"
                      >
                        <Icon name="reload"></Icon>
                      </Button>
                    </li>
                  </ul>
                </div>
                <div className={`card-search search-wrap ${!onWithdrawSearch ? "active" : ""}`}>
                  <div className="search-content">
                    <Button
                      onClick={() => {
                        setWithdrawSearchText("");
                        setOnWithdrawSearch(true);
                      }}
                      className="search-back btn-icon toggle-search"
                    >
                      <Icon name="arrow-left"></Icon>
                    </Button>
                    <input
                      type="text"
                      className="border-transparent form-focus-none form-control"
                      placeholder="Search by user or email"
                      value={withdrawSearchText}
                      onChange={(e) => setWithdrawSearchText(e.target.value)}
                    />
                  </div>
                </div>
              </div>
            </div>

            <DataTableBody bodyclass="nk-tb-tnx">
              <DataTableHead>
                <DataTableRow>
                  <span className="sub-text">User</span>
                </DataTableRow>
                <DataTableRow>
                  <span className="sub-text">Withdraw Address</span>
                </DataTableRow>
                <DataTableRow className="text-end">
                  <span>Amount</span>
                </DataTableRow>
                <DataTableRow>
                  <span>Requested Date</span>
                </DataTableRow>
                <DataTableRow className="text-center">
                  <span>Status</span>
                </DataTableRow>
                <DataTableRow className="text-center">
                  <span>Actions</span>
                </DataTableRow>
              </DataTableHead>

              {displayedWithdrawals.length > 0 &&
                displayedWithdrawals.map((item) => {
                  const isPending = String(item.status) === "0" || item.status === "Pending";
                  const profileId = getUserIdString(item.userId);
                  const displayId = getUserDisplayId(item.userId);
                  return (
                    <DataTableItem key={item._id || item.id}>
                      <DataTableRow>
                        {item.userId ? (
                          profileId ? (
                            <Link to={`${process.env.PUBLIC_URL}/user-profile/${profileId}`}>
                              <div className="user-card">
                                <div className="user-info">
                                  <span className="tb-lead">
                                    {formatUserOrEmail(item.userId)}
                                  </span>
                                  {getEmail(item.userId) && (
                                    <span className="sub-text fs-11px">{getEmail(item.userId)}</span>
                                  )}
                                  {displayId && (
                                    <span className="text-soft fs-12px">{displayId}</span>
                                  )}
                                </div>
                              </div>
                            </Link>
                          ) : (
                            <div className="user-card">
                              <div className="user-info">
                                <span className="tb-lead">
                                  {formatUserOrEmail(item.userId)}
                                </span>
                                {getEmail(item.userId) && (
                                  <span className="sub-text fs-11px">{getEmail(item.userId)}</span>
                                )}
                                {displayId && (
                                  <span className="text-soft fs-12px">{displayId}</span>
                                )}
                              </div>
                            </div>
                          )
                        ) : (
                          <span className="text-soft">User Unavailable</span>
                        )}
                      </DataTableRow>
                      <DataTableRow>
                        <span className="code font-monospace small text-break">
                          {item.withdrawAddress || "-"}
                        </span>
                      </DataTableRow>
                      <DataTableRow className="text-end text-nowrap">
                        <span className="tb-amount text-danger font-weight-bold">
                          -${Number(item.amount || 0).toLocaleString()} USD
                        </span>
                        {item.chargeAmount !== undefined && Number(item.chargeAmount) > 0 && (
                          <div className="sub-text fs-11px text-soft">
                            Fee: ${Number(item.chargeAmount).toLocaleString()} USD
                          </div>
                        )}
                      </DataTableRow>
                      <DataTableRow className="text-nowrap">
                        <span>
                          {item.appliedDate || item.createdAt
                            ? new Date(item.appliedDate || item.createdAt).toLocaleString()
                            : "-"}
                        </span>
                      </DataTableRow>
                      <DataTableRow className="text-center">
                        {renderStatusBadge(item.status)}
                      </DataTableRow>
                      <DataTableRow className="text-center text-nowrap">
                        {isPending ? (
                          <div className="d-flex justify-content-center align-items-center gap-2">
                            <Button
                              color="success"
                              size="sm"
                              className="btn-dim"
                              onClick={() => {
                                setSelectedWithdrawal(item);
                                setApproveModal(true);
                              }}
                            >
                              <Icon name="check" />
                              <span>Approve</span>
                            </Button>
                            <Button
                              color="danger"
                              size="sm"
                              className="btn-dim"
                              onClick={() => {
                                setSelectedWithdrawal(item);
                                setRejectReason("");
                                setRejectModal(true);
                              }}
                            >
                              <Icon name="cross" />
                              <span>Reject</span>
                            </Button>
                          </div>
                        ) : (
                          <span className="text-soft fs-12px d-block text-center">Processed</span>
                        )}
                      </DataTableRow>
                    </DataTableItem>
                  );
                })}
            </DataTableBody>

            {withdrawalsLoading ? (
              <div className="card-inner text-center p-5">
                <Spinner color="primary" />
              </div>
            ) : displayedWithdrawals.length === 0 ? (
              <div className="card-inner text-center p-5">
                <span className="text-gray">No withdrawal requests found</span>
              </div>
            ) : null}

            <div className="card-inner">
              <PaginationComponent
                itemPerPage={withdrawalsPerPage}
                totalItems={withdrawalsTotal}
                paginate={(page) => setWithdrawalsPage(page)}
                currentPage={withdrawalsPage}
              />
            </div>
          </DataTable>
        </Block>

        {/* ------------------------------------------------------------- */}
        {/* MODAL: F10 BASE PRICE & RATE (%) (GET & POST /admin/f10/rate) */}
        {/* ------------------------------------------------------------- */}
        <Modal
          isOpen={marketValueModal}
          toggle={() => !marketValueLoading && setMarketValueModal(!marketValueModal)}
          className="modal-dialog-centered"
          size="md"
        >
          <ModalBody>
            <a
              href="#close"
              onClick={(ev) => {
                ev.preventDefault();
                if (!marketValueLoading) setMarketValueModal(false);
              }}
              className="close"
            >
              <Icon name="cross-sm"></Icon>
            </a>
            <div className="p-2">
              <h5 className="title">F10 Investment</h5>
              {/* <p className="text-soft fs-12px mb-3">
                Configure the base purchase price per token and the daily yield rate.
              </p> */}
              <form onSubmit={handleSaveMarketValue}>
                {/* <div className="form-group">
                  <label className="form-label" htmlFor="f10FixedValue">
                    Fixed Base Price (USD)
                  </label>
                  <div className="form-control-wrap">
                    <div className="form-icon form-icon-right">
                      <Icon name="sign-usd" />
                    </div>
                    <input
                      id="f10FixedValue"
                      type="number"
                      step="any"
                      min="0.01"
                      className="form-control"
                      placeholder="e.g. 10"
                      value={fixedValue}
                      onChange={(e) => setFixedValue(e.target.value)}
                      required
                    />
                  </div>
                </div> */}

                <div className="form-group mt-3">
                  <label className="form-label" htmlFor="f10Rate">
                    Daily Percentage Rate (%)
                  </label>
                  <div className="form-control-wrap">
                    <div className="form-icon form-icon-right">
                      <Icon name="percent" />
                    </div>
                    <input
                      id="f10Rate"
                      type="number"
                      step="any"
                      min="0"
                      className="form-control"
                      placeholder="e.g. 2"
                      value={rate}
                      onChange={(e) => setRate(e.target.value)}
                      required
                    />
                  </div>
                </div>

                {calculatedTokenPrice && (
                  <div className="bg-light p-3 rounded mt-3 border">
                    <div className="d-flex justify-content-between align-items-center">
                      <div>
                        <span className="sub-text fw-bold text-dark d-block">1 F10 Token Market Value:</span>
                        <span className="text-soft fs-11px">Base × (1 + Rate / 100)</span>
                      </div>
                      <span className="fs-16px fw-bold text-success">
                        ${calculatedTokenPrice} USD
                      </span>
                    </div>
                  </div>
                )}

                <div className="form-group mt-4 d-flex justify-content-end">
                  <Button
                    color="light"
                    className="me-2"
                    type="button"
                    onClick={() => setMarketValueModal(false)}
                    disabled={marketValueLoading}
                  >
                    Cancel
                  </Button>
                  <Button color="primary" type="submit" disabled={marketValueLoading}>
                    {marketValueLoading ? (
                      <>
                        <Spinner size="sm" className="me-1" /> Saving...
                      </>
                    ) : (
                      "Save Changes"
                    )}
                  </Button>
                </div>
              </form>
            </div>
          </ModalBody>
        </Modal>

        {/* ------------------------------------------------------------- */}
        {/* MODAL: APPROVE WITHDRAWAL (PUT /admin/f10/withdraw-verify)    */}
        {/* ------------------------------------------------------------- */}
        <Modal
          isOpen={approveModal}
          toggle={() => !verifyLoading && setApproveModal(!approveModal)}
          className="modal-dialog-centered"
          size="md"
        >
          <ModalBody>
            <div className="p-3 text-center">
              <div className="nk-modal-head mb-3">
                <div className="nk-modal-icon bg-success-dim text-success mb-2">
                  <Icon name="check-circle" className="display-4"></Icon>
                </div>
                <h4 className="nk-modal-title title">Approve F10 Withdrawal</h4>
              </div>
              {selectedWithdrawal && (
                <div className="text-start bg-light p-3 rounded mb-3">
                  <div className="d-flex justify-content-between mb-1">
                    <span className="sub-text">User:</span>
                    <span className="caption-text font-weight-bold">
                      {formatUserOrEmail(selectedWithdrawal.userId)}
                    </span>
                  </div>
                  <div className="d-flex justify-content-between mb-1">
                    <span className="sub-text">Amount:</span>
                    <span className="caption-text font-weight-bold text-danger">
                      ${Number(selectedWithdrawal.amount || 0).toLocaleString()} USD
                    </span>
                  </div>
                  <div className="d-flex justify-content-between">
                    <span className="sub-text">Address:</span>
                    <span className="code font-monospace small text-break">
                      {typeof selectedWithdrawal.withdrawAddress === "string" ? selectedWithdrawal.withdrawAddress : "-"}
                    </span>
                  </div>
                </div>
              )}
              <p className="text-soft">
                Are you sure you want to approve this withdrawal request?
              </p>
              <div className="d-flex justify-content-center gap-2 mt-4">
                <Button
                  className="p-3"
                  color="light"
                  onClick={() => setApproveModal(false)}
                  disabled={verifyLoading}
                >
                  Cancel
                </Button>
                <Button
                  className="p-3"
                  color="success"
                  onClick={() => handleVerifyWithdrawal("1")}
                  disabled={verifyLoading}
                >
                  {verifyLoading ? <Spinner size="sm" /> : "Confirm Approval"}
                </Button>
              </div>
            </div>
          </ModalBody>
        </Modal>

        {/* ------------------------------------------------------------- */}
        {/* MODAL: REJECT WITHDRAWAL (PUT /admin/f10/withdraw-verify)      */}
        {/* ------------------------------------------------------------- */}
        <Modal
          isOpen={rejectModal}
          toggle={() => !verifyLoading && setRejectModal(!rejectModal)}
          className="modal-dialog-centered"
          size="md"
        >
          <ModalBody>
            <div className="p-2">
              <div className="nk-modal-head mb-2 text-danger">
                <h4 className="nk-modal-title title text-danger">Reject F10 Withdrawal</h4>
              </div>
              <div className="alert alert-warning py-2 mb-3">
                <Icon name="alert-circle" className="me-1" />
                <strong>Refund Notice:</strong> Rejecting this request will automatically refund the deducted amount of{" "}
                <strong>${Number(selectedWithdrawal?.amount || 0).toLocaleString()} USD</strong> back to the user's F10 balance.
              </div>
              <div className="d-flex justify-content-end gap-2 mt-4">
                <Button
                  className="p-3"
                  color="light"
                  onClick={() => setRejectModal(false)}
                  disabled={verifyLoading}
                >
                  Cancel
                </Button>
                <Button
                  className="p-3"
                  color="danger"
                  onClick={() => handleVerifyWithdrawal("2", rejectReason)}
                  disabled={verifyLoading}
                >
                  {verifyLoading ? <Spinner size="sm" /> : "Reject & Refund User"}
                </Button>
              </div>
            </div>
          </ModalBody>
        </Modal>
      </Content>
    </>
  );
};

export default F10Investment;
