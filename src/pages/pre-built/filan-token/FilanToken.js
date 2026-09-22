import React, { useContext, useEffect, useState } from 'react'
import Head from '../../../layout/head/Head'
import Content from '../../../layout/content/Content'
import { Block, BlockBetween, BlockContent, BlockHead, BlockTitle, PreviewCard } from '../../../components/Component'
import { Button, Col, Input, Label, Row } from 'reactstrap'
// import { UserContext } from '../user-manage/UserContext'
import axiosInstance from '../../../utils/AxiosInstance'
import { AuthContext } from '../../../context/AuthContext'

// function FilanToken() {
//     const { adminInfo } = useContext(UserContext);
//     const [tokenRate, setTokenRate] = useState(0);
//     const [newRate, setNewRate] = useState("");
//     const [loading, setLoading] = useState({
//       fetch: false,
//       update: false,
//     });
//   return (
//     <>
//       <Head title="Filan Wallet"></Head>
//       <Content>
//         <BlockHead size="sm">
//           <BlockBetween className="g-3">
//             <BlockContent>
//               <BlockTitle>Filan Token</BlockTitle>
//             </BlockContent>
//           </BlockBetween>
//         </BlockHead>

//         <Block>
//           <Row>
//             <Col lg="4" className="mb-3">
//               <PreviewCard className="card-bordered reffer-card tot-reffer card1" bodyClass="card-inner-sm">
//                 <BlockHead className="pb-1">
//                   <BlockContent className="d-flex align-items-center justify-content-between">
//                     <BlockTitle className="text-uppercase text-1 mb-0 pt-2" tag="h6">
//                       Filan Token value
//                     </BlockTitle>
//                   </BlockContent>
//                   <div className="form-group mt-3">
//                     <div className="form-control-wrap">
//                       <Input id="default-0" placeholder="Filan Token Value" type="text" />
//                     </div>
//                   </div>
//                   <div className="form-group d-flex justify-content-end mt-3">
//                     <Button color="primary" type="submit" size="md">
//                       Submit
//                     </Button>
//                   </div>
//                 </BlockHead>
//               </PreviewCard>
//             </Col>
//           </Row>
//         </Block>
//       </Content>
//     </>
//   );
// }

function FilanToken() {
  const { adminInfo } = useContext(AuthContext);
  const [tokenRate, setTokenRate] = useState(0);
  const [newRate, setNewRate] = useState("");
  const [loading, setLoading] = useState({
    fetch: false,
    update: false,
  });
  const [lastUpdated, setLastUpdated] = useState("");

  // Fetch current token rate
  const fetchTokenRate = async () => {
    try {
      setLoading((prev) => ({ ...prev, fetch: true }));
      const { data } = await axiosInstance.get("/admin/token/rate", {
        headers: {
          Authorization: `Bearer ${adminInfo.token}`,
        },
      });

      if (data.success) {
        setTokenRate(data.data.rate);
        setLastUpdated(new Date(data.data.lastUpdated).toLocaleString());
      }
    } catch (error) {
      console.error("Error fetching token rate:", error);
      
     alert("Failed to load token rate");
    } finally {
      setLoading((prev) => ({ ...prev, fetch: false }));
    }
  };

  // Update token rate
  const updateTokenRate = async () => {
    const rateNumber = parseFloat(newRate);

    if (isNaN(rateNumber) || rateNumber <= 0) {
        alert("Please enter a valid rate (must be greater than 0)");
      return;
    }

    try {
      setLoading((prev) => ({ ...prev, update: true }));
      const { data } = await axiosInstance.post(
        "/admin/token/rate",
        { rate: rateNumber },
        {
          headers: {
            Authorization: `Bearer ${adminInfo.token}`,
          },
        }
      );

      if (data.success) {
        alert("Token rate updated successfully!");
        setTokenRate(data.data.rate);
        setLastUpdated(new Date(data.data.lastUpdated).toLocaleString());
        setNewRate("");
      }
    } catch (error) {
      console.error("Error updating token rate:", error);
      alert(error.response?.data?.message || "Failed to update token rate");
    } finally {
      setLoading((prev) => ({ ...prev, update: false }));
    }
  };

  // Fetch token rate on component mount
  useEffect(() => {
    fetchTokenRate();
  }, []);

  return (
    <>
      <Head title="Filan Token Rate"></Head>
      <Content>
        <BlockHead size="sm">
          <BlockBetween className="g-3">
            <BlockContent>
              <BlockTitle>Filan Token Rate</BlockTitle>
            </BlockContent>
          </BlockBetween>
        </BlockHead>

        <Block>
          <Row>
            <Col lg="4" className="mb-3">
              <PreviewCard className="card-bordered reffer-card tot-reffer card1" bodyClass="card-inner-sm">
                <BlockHead className="pb-1">
                  <BlockContent className="d-flex align-items-center justify-content-between">
                    <BlockTitle className="text-uppercase text-1 mb-0 pt-2" tag="h6">
                      Current Token Rate
                    </BlockTitle>
                  </BlockContent>

                  {loading.fetch ? (
                    <div className="mt-3 text-center">
                      <span className="text-soft">Loading...</span>
                    </div>
                  ) : (
                    <>
                      <div className="mt-3">
                        <h4 style={{ color: "#f4bd0e" }}>{tokenRate} USD = 1 Token</h4>
                        {lastUpdated && <p className="small text-soft">Last updated: {lastUpdated}</p>}
                      </div>

                      <div className="form-group mt-4">
                        <Label htmlFor="newRate">Update Token Rate</Label>
                        <div className="form-control-wrap">
                          <Input
                            id="newRate"
                            placeholder="Enter new rate (USD per token)"
                            type="number"
                            value={newRate}
                            onChange={(e) => setNewRate(e.target.value)}
                            min="0.01"
                            step="0.01"
                          />
                        </div>
                      </div>

                      <div className="form-group d-flex justify-content-end mt-3">
                        <Button
                          color="primary"
                          onClick={updateTokenRate}
                          disabled={!newRate || isNaN(newRate) || loading.update}
                        >
                          {loading.update ? "Updating..." : "Update Rate"}
                        </Button>
                      </div>
                    </>
                  )}
                </BlockHead>
              </PreviewCard>
            </Col>
          </Row>
        </Block>
      </Content>
    </>
  );
}


export default FilanToken
