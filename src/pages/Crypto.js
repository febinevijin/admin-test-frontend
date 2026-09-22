import React, { useContext, useEffect, useState } from "react";
import Head from "../layout/head/Head";
import Content from "../layout/content/Content";
import { Card, CardBody } from "reactstrap";
import {
  Block,
  BlockDes,
  BlockHead,
  BlockHeadContent,
  BlockBetween,
  BlockTitle,
  PreviewAltCard,
  Icon,
  Row,
  Col,
  LineChartExample,
} from "../components/Component";
import TrafficDougnut from "../components/partials/analytics/traffic-dougnut/TrafficDoughnut";
import { solidLineChart } from "./components/charts/ChartData";
import { AuthContext } from "../context/AuthContext";
import axiosInstance from "../utils/AxiosInstance";
import GraphWrapper from "./GraphWrapper";

const CryptoHomePage = () => {
  const { adminInfo } = useContext(AuthContext);
  const [sm, updateSm] = useState(false);
  const [graphData, setGraphData] = useState([]);
  const [weeklyInterest, setWeeklyInterest] = useState([]);
  const [totalCountData, setTotalCountData] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);

        // Fetch graph data
        const graphResponse = await axiosInstance.get("/admin/dashboard/graph-value", {
          headers: {
            Authorization: `Bearer ${adminInfo.token}`, // Assuming userInfo has a token property
          },
        });
        // Fetch graph data
        const commonInterestData = await axiosInstance.get("/admin/interest/list", {
          headers: {
            Authorization: `Bearer ${adminInfo.token}`, // Assuming userInfo has a token property
          },
        });

        // Fetch total count data
        const totalCountResponse = await axiosInstance.get("/admin/dashboard/total-count", {
          headers: {
            Authorization: `Bearer ${adminInfo.token}`,
          },
        });

        // Update state with the data from both APIs
        setGraphData(graphResponse.data.data);
        setWeeklyInterest(commonInterestData.data.data.weeklyInterest);

        setTotalCountData(totalCountResponse.data.data);

        setError(null);
      } catch (err) {
        console.error("Error fetching dashboard data:", err);
        setError("Failed to fetch data. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [adminInfo]);

  // Helper function to get today's interest data
  const getTodayInterestData = () => {
    const today = new Date().toLocaleString("en-US", { weekday: "long" }); // Get the current day name
    return weeklyInterest.find((item) => item.day === today);
  };

  const todayInterest = getTodayInterestData();

  const formatTime = (date) => {
    let hours = date.getUTCHours(); // Use UTC hours to prevent timezone mismatches
    const minutes = date.getUTCMinutes();
    const ampm = hours >= 12 ? "PM" : "AM";
    hours = hours % 12;
    hours = hours ? hours : 12; // if hour is 0, set it to 12
    const minutesStr = minutes < 10 ? "0" + minutes : minutes;
    return `${hours}:${minutesStr} ${ampm}`;
  };

  return (
    <>
      <Head title="Overview" />
      <Content>
        <BlockHead size="sm">
          <BlockBetween>
            <BlockHeadContent>
              <BlockTitle page>Overview</BlockTitle>
              <BlockDes className="text-soft">
                <p>Welcome to Dashboard Overview</p>
              </BlockDes>
            </BlockHeadContent>
          </BlockBetween>
        </BlockHead>
        {loading ? (
          <p>Loading...</p>
        ) : error ? (
          <p>{error}</p>
        ) : (
          <>
            <Block>
              <Row className="g-gs">
                <Col lg="8">
                  <PreviewAltCard className="h-100">
                    <GraphWrapper graphData={graphData.graphData} weeklyInterest={weeklyInterest} />
                    {/* <GraphWrapper /> */}

                    {/* <LineChartExample legend={true} data={solidLineChart} /> */}
                  </PreviewAltCard>
                </Col>
                {/* New Box to Display Today's Interest Data */}
                <Col lg="4">
                  <PreviewAltCard>
                    <div className="today-interest-box">
                      <h4 className="mb-4">Trade Profit</h4>
                      {todayInterest ? (
                        <div>
                          <h6>Day : &nbsp;&nbsp;&nbsp; {todayInterest.day}</h6>
                          <h6>Profit :&nbsp;&nbsp;&nbsp; {todayInterest.interest}%</h6>

                          {/* Manual time formatting */}
                          <h6>Credited at :&nbsp;&nbsp;&nbsp; {formatTime(new Date(todayInterest.time))}</h6>
                        </div>
                      ) : (
                        <p>No data for today.</p>
                      )}
                    </div>
                  </PreviewAltCard>
                </Col>
                {/* <Col lg="4">
                  <Row className="g-gs">
                    <Col md="6" lg="12">
                      <PreviewAltCard className="card-full">
                        <TrafficDougnut />
                      </PreviewAltCard>
                    </Col>
                  </Row>
                </Col> */}
              </Row>
            </Block>
            <Block>
              <Row className="g-gs">
                <Col md="4" lg="3">
                  <Card className="card-bordered mainCard">
                    <CardBody className="card-inner">
                      <Icon name="user" />
                      <div className="details">
                        <h5>{totalCountData.totalUsersCount || 0}</h5>
                        <p>Total Users</p>
                      </div>
                    </CardBody>
                  </Card>
                </Col>
                <Col md="4" lg="3">
                  <Card className="card-bordered mainCard">
                    <CardBody className="card-inner">
                      <Icon name="user-check" />
                      <div className="details">
                        <h5>{totalCountData.totalActiveUsersCount}</h5>
                        <p>Total Active Users</p>
                      </div>
                    </CardBody>
                  </Card>
                </Col>
                <Col md="4" lg="3">
                  <Card className="card-bordered mainCard">
                    <CardBody className="card-inner">
                      <Icon name="users" />
                      <div className="details">
                        <h5>{totalCountData.totalTodayJoinedUsers}</h5>
                        <p>Today Joined Users</p>
                      </div>
                    </CardBody>
                  </Card>
                </Col>
                {/* <Col md="4" lg="3">
              <Card className="card-bordered mainCard">
                <CardBody className="card-inner">
                  <Icon name="wallet" />
                  <div className="details">
                    <h5>55</h5>
                    <p>Total User Fund</p>
                  </div>
                </CardBody>
              </Card>
            </Col> */}
                {/* <Col md="4" lg="3">
              <Card className="card-bordered mainCard">
                <CardBody className="card-inner">
                  <Icon name="money" />
                  <div className="details">
                    <h5>{totalCountData.totalUsersCount}</h5>
                    <p>Total Interest Fund</p>
                  </div>
                </CardBody>
              </Card>
            </Col> */}
                <Col md="4" lg="3">
                  <Card className="card-bordered mainCard">
                    <CardBody className="card-inner">
                      <Icon name="list-round" />
                      <div className="details">
                        <h5>{totalCountData.planCount}</h5>
                        <p>Total Plans</p>
                      </div>
                    </CardBody>
                  </Card>
                </Col>
                <Col md="4" lg="3">
                  <Card className="card-bordered mainCard">
                    <CardBody className="card-inner">
                      <Icon name="invest" />
                      <div className="details">
                        <h5>{totalCountData.totalInvestment.toFixed(2)}</h5>
                        <p>Total Investment</p>
                      </div>
                    </CardBody>
                  </Card>
                </Col>
                <Col md="4" lg="3">
                  <Card className="card-bordered mainCard">
                    <CardBody className="card-inner">
                      <Icon name="invest" />
                      <div className="details">
                        <h5>{totalCountData.runningInvestment.toFixed(2)}</h5>
                        <p>Running Investment</p>
                      </div>
                    </CardBody>
                  </Card>
                </Col>
                <Col md="4" lg="3">
                  <Card className="card-bordered mainCard">
                    <CardBody className="card-inner">
                      <Icon name="calendar-check" />
                      <div className="details">
                        <h5>{totalCountData.completedInvestment}</h5>
                        <p>Complete Investment</p>
                      </div>
                    </CardBody>
                  </Card>
                </Col>
                <Col md="4" lg="3">
                  <Card className="card-bordered mainCard">
                    <CardBody className="card-inner">
                      <Icon name="invest" />
                      <div className="details">
                        <h5>{totalCountData.todaysInvestment.toFixed(2)}</h5>
                        <p>Today Invested</p>
                      </div>
                    </CardBody>
                  </Card>
                </Col>
                <Col md="4" lg="3">
                  <Card className="card-bordered mainCard">
                    <CardBody className="card-inner">
                      <Icon name="invest" />
                      <div className="details">
                        <h5>{totalCountData.monthlyInvestment.toFixed(2)}</h5>
                        <p>This Month Invested</p>
                      </div>
                    </CardBody>
                  </Card>
                </Col>
                <Col md="4" lg="3">
                  <Card className="card-bordered mainCard">
                    <CardBody className="card-inner">
                      <Icon name="cc-alt" />
                      <div className="details">
                        <h5>{totalCountData.totalUsersCount}</h5>
                        <p>Total Invested</p>
                      </div>
                    </CardBody>
                  </Card>
                </Col>
                <Col md="4" lg="3">
                  <Card className="card-bordered mainCard">
                    <CardBody className="card-inner">
                      <Icon name="wallet-in" />
                      <div className="details">
                        <h5>{totalCountData.monthlyDeposit.toFixed(2)}</h5>
                        <p>monthly Deposits</p>
                      </div>
                    </CardBody>
                  </Card>
                </Col>
                <Col md="4" lg="3">
                  <Card className="card-bordered mainCard">
                    <CardBody className="card-inner">
                      <Icon name="wallet-alt" />
                      <div className="details">
                        <h5>{totalCountData.totalDeposit.toFixed(2)}</h5>
                        <p>Total Deposits</p>
                      </div>
                    </CardBody>
                  </Card>
                </Col>
                <Col md="4" lg="3">
                  <Card className="card-bordered mainCard">
                    <CardBody className="card-inner">
                      <Icon name="coin" />
                      <div className="details">
                        <h5>{totalCountData.pendingDepositCount}</h5>
                        <p>Pending Deposit</p>
                      </div>
                    </CardBody>
                  </Card>
                </Col>

                <Col md="12">
                  <h5>Payout Statistics</h5>
                </Col>
                <Col md="4" lg="3">
                  <Card className="card-bordered mainCard">
                    <CardBody className="card-inner">
                      <Icon name="help" />
                      <div className="details">
                        <h5>{totalCountData.totalPendingRequests}</h5>
                        <p>Pending Request</p>
                      </div>
                    </CardBody>
                  </Card>
                </Col>
                <Col md="4" lg="3">
                  <Card className="card-bordered mainCard">
                    <CardBody className="card-inner">
                      <Icon name="help" />
                      <div className="details">
                        <h5>{totalCountData.totalApprovedRequests}</h5>
                        <p>Approved Request</p>
                      </div>
                    </CardBody>
                  </Card>
                </Col>
                <Col md="4" lg="3">
                  <Card className="card-bordered mainCard">
                    <CardBody className="card-inner">
                      <Icon name="wallet-out" />
                      <div className="details">
                        <h5>{totalCountData.todaysPayout.toFixed(2)}</h5>
                        <p>Today's Payout</p>
                      </div>
                    </CardBody>
                  </Card>
                </Col>
                <Col md="4" lg="3">
                  <Card className="card-bordered mainCard">
                    <CardBody className="card-inner">
                      <Icon name="money" />
                      <div className="details">
                        <h5>{totalCountData.monthlyPayout.toFixed(2)}</h5>
                        <p>This Month Payout</p>
                      </div>
                    </CardBody>
                  </Card>
                </Col>
                {/* <Col md="4" lg="3">
              <Card className="card-bordered mainCard">
                <CardBody className="card-inner">
                  <Icon name="file-docs" />
                  <div className="details">
                    <h5>{totalCountData.totalUsersCount}</h5>
                    <p>This Month Charge</p>
                  </div>
                </CardBody>
              </Card>
            </Col> */}
              </Row>
            </Block>
          </>
        )}
      </Content>
    </>
  );
};

export default CryptoHomePage;
