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
  PreviewCard,
} from "../../../components/Component";
import { Form, Row, Col, Label, Button } from "reactstrap";
import { AuthContext } from "../../../context/AuthContext";
import axiosInstance from "../../../utils/AxiosInstance";
import { Link } from "react-router-dom";
import Head from "../../../layout/head/Head";
import useShowToast from "../../hooks/useShowToast";

// const PlanEdit = () => {
//   const { adminInfo } = useContext(AuthContext); // Get the admin info from AuthContext
//   const [currentInterest, setCurrentInterest] = useState(null); // State to store current interest
//   const [newInterest, setNewInterest] = useState(""); // State to manage new interest value
//   const [loading, setLoading] = useState(true); // Loading state

//   useEffect(() => {
//     const fetchInterest = async () => {
//       try {
//         const response = await axiosInstance.get("/admin/interest/list", {
//           headers: {
//             Authorization: `Bearer ${adminInfo.token}`, // Send the token in the headers
//           },
//         });

//         if (response.data.success) {
//           setCurrentInterest(response.data.data.currentInterest); // Set current interest from API response
//           setNewInterest(response.data.data.currentInterest); // Initialize newInterest with current interest
//         } else {
//           console.error("Failed to fetch interest data.");
//         }
//         setLoading(false);
//       } catch (error) {
//         console.error("Error fetching interest data:", error);
//         setLoading(false);
//       }
//     };

//     fetchInterest();
//   }, [adminInfo.token]);

//   const handleSaveChanges = async () => {
//     try {
//       const response = await axiosInstance.put(
//         "/admin/interest/update",
//         {
//           currentInterest: Number(newInterest),
//         },
//         {
//           headers: {
//             Authorization: `Bearer ${adminInfo.token}`, // Send the token in the headers
//           },
//         }
//       );

//       if (response.data.success) {
//         alert("Interest updated successfully!");
//         setCurrentInterest(newInterest); // Update state with new interest
//       } else {
//         alert("Failed to update interest.");
//       }
//     } catch (error) {
//       console.error("Error updating interest:", error);
//       alert("An error occurred while updating the interest.");
//     }
//   };

//   if (loading) {
//     return <p>Loading...</p>; // Show loading message while fetching data
//   }

//   return (
//     <>
//       <Head title="Edit Plan" />
//       <Content>
//         <BlockHead size="sm">
//           <BlockBetween className="g-3">
//             <BlockContent>
//               <BlockTitle>Edit Plan Profit</BlockTitle>
//               <BlockDes className="text-soft">
//                 <p>Add Profit % each day</p>
//               </BlockDes>
//             </BlockContent>
//             <BlockHeadContent>
//               <Link to={`${process.env.PUBLIC_URL}/plan-list`}>
//                 <Button color="light" outline className="bg-white d-none d-sm-inline-flex">
//                   <Icon name="arrow-left" />
//                   <span>Back</span>
//                 </Button>
//                 <Button color="light" outline className="btn-icon bg-white d-inline-flex d-sm-none">
//                   <Icon name="arrow-left" />
//                 </Button>
//               </Link>
//             </BlockHeadContent>
//           </BlockBetween>
//         </BlockHead>

//         <Block size="lg">
//           <PreviewCard className="col-md-6">
//             <Form className="formClass">
//               <Row className="g-gs">
//                 <Col>
//                   <div className="form-group">
//                     <Label className="form-label" htmlFor="profitPer">
//                       Sunday
//                     </Label>
//                     <div className="form-control-wrap">
//                       <input
//                         type="number"
//                         id="profitPer"
//                         placeholder="Sunday"
//                         className="form-control"
//                         value={newInterest || ""} // Set value from state
//                         onChange={(e) => setNewInterest(e.target.value)} // Update state on change
//                       />
//                     </div>
//                   </div>
//                   <div className="form-group">
//                     <Label className="form-label" htmlFor="profitPer">
//                       Monday
//                     </Label>
//                     <div className="form-control-wrap">
//                       <input
//                         type="number"
//                         id="profitPer"
//                         placeholder="Sunday"
//                         className="form-control"
//                         value={newInterest || ""} // Set value from state
//                         onChange={(e) => setNewInterest(e.target.value)} // Update state on change
//                       />
//                     </div>
//                   </div>
//                   <div className="form-group">
//                     <Label className="form-label" htmlFor="profitPer">
//                       Tuesday
//                     </Label>
//                     <div className="form-control-wrap">
//                       <input
//                         type="number"
//                         id="profitPer"
//                         placeholder="Sunday"
//                         className="form-control"
//                         value={newInterest || ""} // Set value from state
//                         onChange={(e) => setNewInterest(e.target.value)} // Update state on change
//                       />
//                     </div>
//                   </div>
//                   <div className="form-group">
//                     <Label className="form-label" htmlFor="profitPer">
//                       Wednesday
//                     </Label>
//                     <div className="form-control-wrap">
//                       <input
//                         type="number"
//                         id="profitPer"
//                         placeholder="Sunday"
//                         className="form-control"
//                         value={newInterest || ""} // Set value from state
//                         onChange={(e) => setNewInterest(e.target.value)} // Update state on change
//                       />
//                     </div>
//                   </div>
//                 </Col>
//                 <Col>
//                   <div className="form-group">
//                     <Label className="form-label" htmlFor="profitPer">
//                     Thursday
//                     </Label>
//                     <div className="form-control-wrap">
//                       <input
//                         type="number"
//                         id="profitPer"
//                         placeholder="Monday"
//                         className="form-control"
//                         value={newInterest || ""} // Set value from state
//                         onChange={(e) => setNewInterest(e.target.value)} // Update state on change
//                       />
//                     </div>
//                   </div>
//                   <div className="form-group">
//                     <Label className="form-label" htmlFor="profitPer">
//                     Friday
//                     </Label>
//                     <div className="form-control-wrap">
//                       <input
//                         type="number"
//                         id="profitPer"
//                         placeholder="Monday"
//                         className="form-control"
//                         value={newInterest || ""} // Set value from state
//                         onChange={(e) => setNewInterest(e.target.value)} // Update state on change
//                       />
//                     </div>
//                   </div>
//                   <div className="form-group">
//                     <Label className="form-label" htmlFor="profitPer">
//                     Saturday
//                     </Label>
//                     <div className="form-control-wrap">
//                       <input
//                         type="number"
//                         id="profitPer"
//                         placeholder="Monday"
//                         className="form-control"
//                         value={newInterest || ""} // Set value from state
//                         onChange={(e) => setNewInterest(e.target.value)} // Update state on change
//                       />
//                     </div>
//                   </div>
//                 </Col>

//                 <div className="form-group mt-5 d-flex justify-content-end">
//                   <Button color="light" className="me-3" size="md">
//                     Cancel
//                   </Button>
//                   <Button color="primary" size="md" onClick={handleSaveChanges}>
//                     Save Changes
//                   </Button>
//                 </div>
//               </Row>
//             </Form>
//           </PreviewCard>
//         </Block>
//       </Content>
//     </>
//   );
// };

// export default PlanEdit;

// ***************************************************************

const PlanEdit = () => {
  const { adminInfo } = useContext(AuthContext); // Get the admin info from AuthContext
  const [weeklyInterest, setWeeklyInterest] = useState([]); // State to store weekly interest and time
  const [loading, setLoading] = useState(true); // Loading state
  const showToast = useShowToast();

  // Default data structure for weeklyInterest (Sunday to Saturday)
  const defaultWeeklyInterest =   [
            {
                day: "Sunday",
                interest: 0,
                time: "2024-09-20T18:53:12.232Z",
                _id: "66ecb8f938e4fb7ae8d948fc"
            },
            {
                day: "Monday",
                interest: 0,
                time: "2024-09-23T17:39:00.000Z",
                _id: "66ecb8f938e4fb7ae8d948fd"
            },
            {
                day: "Tuesday",
                interest: 0,
                time: "2024-09-24T20:15:00.000Z",
                _id: "66ecb8f938e4fb7ae8d948fe"
            },
            {
                day: "Wednesday",
                interest: 0,
                time: "2024-09-25T19:15:00.000Z",
                _id: "66ecb8f938e4fb7ae8d948ff"
            },
            {
                day: "Thursday",
                interest: 0,
                time: "2024-09-20T19:29:57.913Z",
                _id: "66ecb8f938e4fb7ae8d94900"
            },
            {
                day: "Friday",
                interest: 0,
                time: "2024-09-27T20:01:00.000Z",
                _id: "66ecb8f938e4fb7ae8d94901"
            },
            {
                day: "Saturday",
                interest: 0,
                time: "2024-09-20T13:30:55.463Z",
                _id: "66ecb8f938e4fb7ae8d94902"
            }
        ];
  // Fetch interest data on component mount
  useEffect(() => {
    const fetchInterest = async () => {
      try {
        const response = await axiosInstance.get("/admin/interest/list", {
          headers: {
            Authorization: `Bearer ${adminInfo.token}`, // Send the token in the headers
          },
        });

         if (response.data.success && response.data.data.weeklyInterest.length > 0) {
          setWeeklyInterest(response.data.data.weeklyInterest); // Set weeklyInterest from API response
        } else {
          setWeeklyInterest(defaultWeeklyInterest); // Use default if no data exists
        }
        setLoading(false);
      } catch (error) {
        console.error("Error fetching interest data:", error);
        setWeeklyInterest(defaultWeeklyInterest); // Use default if error occurs
        setLoading(false);
      }
    };

    fetchInterest();
  }, [adminInfo.token]);

  // Handle Save Changes for weekly interest
  const handleSaveChanges = async () => {
    try {
      const response = await axiosInstance.put(
        "/admin/interest/update",
        {
          weeklyInterest, // Send the updated weeklyInterest array
        },
        {
          headers: {
            Authorization: `Bearer ${adminInfo.token}`, // Send the token in the headers
          },
        }
      );

      if (response.data.success) {
        showToast("Done", "Interest updated successfully!", "success");
      } else {
        showToast("Error", "Failed to update interest.", "warning");
      }
    } catch (error) {
      console.error("Error updating interest:", error);

      showToast("Error", error.response.data.message, "warning");
    }
  };

  // Handle input changes for interest and time
  const handleInterestChange = (index, field, value) => {
    const updatedWeeklyInterest = [...weeklyInterest];

    if (field === "time") {
      // Extract the date part from the existing time (ISO string)
      const existingDate = new Date(updatedWeeklyInterest[index].time);
      const [hours, minutes] = value.split(":");

      // Update the time with the new hours and minutes
      existingDate.setUTCHours(hours, minutes);

      // Convert back to ISO string
      updatedWeeklyInterest[index].time = existingDate.toISOString();
    } else {
      // Convert interest to a number
      updatedWeeklyInterest[index][field] = Number(value);
    }

    setWeeklyInterest(updatedWeeklyInterest);
  };

  if (loading) {
    return <p>Loading...</p>; // Show loading message while fetching data
  }

  return (
    <>
      <Head title="Edit Plan" />
      <Content>
        <BlockHead size="sm">
          <BlockBetween className="g-3">
            <BlockContent>
              <BlockTitle>Edit Plan Profit</BlockTitle>
              <BlockDes className="text-soft">
                <p>Update Profit % and Time for Each Day</p>
              </BlockDes>
            </BlockContent>
            <BlockHeadContent>
              <Link to={`${process.env.PUBLIC_URL}/plan-list`}>
                <Button color="light" outline className="bg-white d-none d-sm-inline-flex">
                  <Icon name="arrow-left" />
                  <span>Back</span>
                </Button>
                <Button color="light" outline className="btn-icon bg-white d-inline-flex d-sm-none">
                  <Icon name="arrow-left" />
                </Button>
              </Link>
            </BlockHeadContent>
          </BlockBetween>
        </BlockHead>

        <Block size="lg">
          <PreviewCard className="col-md-6">
            <Form className="formClass">
              <Row className="g-gs">
                {weeklyInterest.map((dayInterest, index) => (
                  <Col key={index}>
                    <div className="form-group">
                      <Label className="form-label" htmlFor={`interest-${dayInterest.day}`}>
                        {dayInterest.day}
                      </Label>
                      <div className="form-control-wrap">
                        <label>%</label>
                        <input
                          type="number"
                          id={`interest-${dayInterest.day}`}
                          placeholder={dayInterest.day}
                          className="form-control"
                          value={dayInterest.interest || 0} // Set value from state
                          onChange={(e) => handleInterestChange(index, "interest", e.target.value)} // Update state on change
                        />
                      </div>
                      <div className="form-control-wrap mt-2">
                        <label>Time</label>
                        <input
                          type="time"
                          id={`time-${dayInterest.day}`}
                          className="form-control"
                          // Extract time portion from ISO string for display
                          value={new Date(dayInterest.time).toISOString().substring(11, 16)}
                          onChange={(e) => handleInterestChange(index, "time", e.target.value)} // Update time as "HH:mm"
                        />
                      </div>
                    </div>
                  </Col>
                ))}

                <div className="form-group mt-5 d-flex justify-content-end">
                  <Link to={`${process.env.PUBLIC_URL}/plan-list`}>
                    <Button color="light" className="me-3" size="md">
                      Cancel
                    </Button>
                  </Link>
                  <Button color="primary" size="md" onClick={handleSaveChanges}>
                    Save Changes
                  </Button>
                </div>
              </Row>
            </Form>
          </PreviewCard>
        </Block>
      </Content>
    </>
  );
};

export default PlanEdit;




