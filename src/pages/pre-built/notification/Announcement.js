import React, { useContext, useRef, useState } from "react";
import { Button, Card, CardBody, Col, Row } from "reactstrap";
import Content from "../../../layout/content/Content";
import Head from "../../../layout/head/Head";
import {
  Block,
  BlockBetween,
  BlockContent,
  BlockDes,
  BlockHead,
  BlockHeadContent,
  BlockTitle,
} from "../../../components/Component";
import { Link } from "react-router-dom";
import { AuthContext } from "../../../context/AuthContext";
import { useQuill } from "react-quilljs";
import axiosInstance from "../../../utils/AxiosInstance";
import Swal from "sweetalert2";

function Announcement() {
  const { quill, quillRef } = useQuill();
  const [title, setTitle] = useState("");
  const { adminInfo } = useContext(AuthContext);

  // const handleSend = async () => {
  //   if (!title || !quill?.getText().trim()) {
  //     alert("Please provide a title and description");
  //     return;
  //   }

    const handleSend = async () => {
      if (!title || !quill?.getText().trim()) {
        Swal.fire({
          icon: "warning",
          title: "Missing Fields",
          text: "Please provide a title and description",
          confirmButtonColor: "#3085d6",
        });
        return;
      }

    const description = quill.root.innerHTML;

    try {
      const response = await axiosInstance.post(
        "/notification/admin/post",
        { title, description },
        {
          headers: {
            Authorization: `Bearer ${adminInfo?.token}`,
            "Content-Type": "application/json",
          },
        }
      );

        // alert(`Notification sent: ${response?.data?.data?.title}`);

        Swal.fire({
          icon: "success",
          title: "Notification Sent",
          text: `Title: ${response?.data?.data?.title}`,
          confirmButtonColor: "#3085d6",
        });


         setTitle("");
         quill.setText("");
    } catch (err) {
      // alert("Failed to send notification");

      Swal.fire({
        icon: "error",
        title: "Failed to Send",
        text: "Something went wrong while sending the notification.",
        confirmButtonColor: "#d33",
      });
      console.error(err);
    }
  };

  return (
    <>
      <Head title="Notification" />
      <Content>
        <BlockHead size="sm">
          <BlockBetween className="g-3">
            <BlockContent>
              <BlockTitle>Notification</BlockTitle>
              <BlockDes className="text-soft">
                <p>Send Announcement to all users.</p>
              </BlockDes>
            </BlockContent>
            <BlockHeadContent>
              <Link to={`${process.env.PUBLIC_URL}/all-notification`}>
                <Button color="primary btn-lg">All Notification</Button>
              </Link>
            </BlockHeadContent>
          </BlockBetween>
        </BlockHead>
        <Block>
          <Card className="card-bordered">
            <CardBody className="card-inner">
              <Row className="gy-4">
                <Col md="12">
                  <div className="form-group">
                    <label className="form-label">Title</label>
                    <input
                      type="text"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      className="form-control"
                      placeholder="Write Title Here..."
                    />
                  </div>
                </Col>

                <Col md="12">
                  <div>
                    <label className="form-label">Description</label>
                    <div ref={quillRef} />
                  </div>
                </Col>

                <div className="col-sm-5 col-md-12 ms-auto">
                  <Button color="light" className="me-2 btn-lg">
                    Cancel
                  </Button>
                  <Button color="success" className="btn-lg" onClick={handleSend}>
                    Send
                  </Button>
                </div>
              </Row>
            </CardBody>
          </Card>
        </Block>
      </Content>
    </>
  );
}

export default Announcement;
