import React, { useContext, useEffect, useState } from "react";
import Content from "../../../layout/content/Content";
import {
  Block,
  BlockBetween,
  BlockContent,
  BlockDes,
  BlockHead,
  BlockTitle,
  OverlineTitle,
  PreviewCard,
} from "../../../components/Component";
import { Row, Col, Button, Label } from "reactstrap";
import { AuthContext } from "../../../context/AuthContext";
import axiosInstance from "../../../utils/AxiosInstance";
import useShowToast from "../../hooks/useShowToast";

function PayoutSetting() {
  const { adminInfo } = useContext(AuthContext); // Get the admin info from AuthContext
  const [allowedDays, setAllowedDays] = useState([]); // State to store allowed days
  const [withdrawCharge, setWithdrawCharge] = useState(""); // State to store withdraw charge
  const [loading, setLoading] = useState(true); // Loading state
  const showToast = useShowToast();

  useEffect(() => {
    const fetchPayoutSettings = async () => {
      try {
        const response = await axiosInstance.get("/admin/withdraw-day/list", {
          headers: {
            Authorization: `Bearer ${adminInfo.token}`, // Send the token in the headers
          },
        });

        // Set allowed days and withdraw charge from API response
        setAllowedDays(response.data.data.allowedDays);
        setWithdrawCharge(response.data.data.withdrawCharge);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching payout settings:", error);
        setLoading(false);
      }
    };

    fetchPayoutSettings();
  }, [adminInfo.token]);

  // Function to handle Save Changes
  const handleSaveChanges = async () => {
    try {
      const selectedDays = Array.from(document.querySelectorAll('input[name="user-choose"]:checked')).map(
        (checkbox) => checkbox.value // Use value attribute of the checkbox
      );

      const response = await axiosInstance.put(
        "/admin/withdraw-day/update",
        {
          allowedDays: selectedDays,
          withdrawCharge: Number(withdrawCharge), // Send withdraw charge along with allowed days
        },
        {
          headers: {
            Authorization: `Bearer ${adminInfo.token}`, // Send the token in the headers
          },
        }
      );

      if (response.data.success) {
        showToast("Done", "Withdraw days and charge updated successfully!", "success");
        setAllowedDays(selectedDays); // Update state with new allowed days
        setWithdrawCharge(response.data.data.withdrawCharge); // Update state with new withdraw charge
      } else {
        showToast("Error", "Failed to update withdraw settings.", "warning");
      }
    } catch (error) {
      console.error("Error updating withdraw settings:", error);
      showToast("Error", "An error occurred while updating withdraw settings.", "warning");
    }
  };

  if (loading) {
    return <p>Loading...</p>;
  }

  // Function to check if a day is allowed
  const isDayAllowed = (value) => allowedDays.includes(value);

  return (
    <>
      <Content>
        <BlockHead size="sm">
          <BlockBetween className="g-3">
            <BlockContent>
              <BlockTitle>Withdraw Settings</BlockTitle>
              <BlockDes className="text-soft">
                <p>Choose days for withdraw and set withdraw charge</p>
              </BlockDes>
            </BlockContent>
          </BlockBetween>
        </BlockHead>

        <Block className="withdrawEdit">
          <Row className="g-gs">
            <Col md="6">
              <PreviewCard>
                <OverlineTitle className="preview-title">Choose Withdraw Days</OverlineTitle>
                <ul className="custom-control-group custom-control-vertical custom-control-stacked w-100">
                  {["0", "1", "2", "3", "4", "5", "6"].map((value, index) => (
                    <li key={value}>
                      <div className="custom-control custom-control-sm custom-checkbox custom-control-pro">
                        <input
                          type="checkbox"
                          className="custom-control-input"
                          id={`user-choose-s${value}`}
                          name="user-choose"
                          value={value} // Set value attribute
                          defaultChecked={isDayAllowed(value)} // Automatically check if the day is allowed
                        />
                        <label className="custom-control-label" htmlFor={`user-choose-s${value}`}>
                          <span className="day-card">
                            <span className="day-name">
                              {["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"][index]}
                            </span>
                          </span>
                        </label>
                      </div>
                    </li>
                  ))}
                </ul>

                <div className="form-group mt-3">
                  <Label className="form-label" htmlFor="withdrawalCharge">
                    Withdrawal Charge (%)
                  </Label>
                  <div className="form-control-wrap">
                    <input
                      type="text"
                      id="withdrawalCharge"
                      name="withdrawalCharge"
                      placeholder="Withdrawal Charge"
                      className="form-control"
                      value={withdrawCharge}
                      onChange={(e) => setWithdrawCharge(e.target.value)} // Update withdraw charge state
                    />
                  </div>
                </div>

                <div className="form-group mt-3">
                  <Button color="light" className="me-3" size="md">
                    Cancel
                  </Button>
                  <Button color="primary" size="md" onClick={handleSaveChanges}>
                    Save Changes
                  </Button>
                </div>
              </PreviewCard>
            </Col>
          </Row>
        </Block>
      </Content>
    </>
  );
}

export default PayoutSetting;
