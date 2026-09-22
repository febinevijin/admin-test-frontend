import React, { useContext, useEffect, useState } from "react";
import {
  Block,
  BlockBetween,
  BlockContent,
  BlockHead,
  BlockHeadContent,
  BlockTitle,
  Icon,
  PreviewCard,
} from "../../../components/Component";
import Head from "../../../layout/head/Head";
import Content from "../../../layout/content/Content";
import { Link } from "react-router-dom";
import { Button } from "reactstrap";
import { AuthContext } from "../../../context/AuthContext"; // adjust based on your path
import axiosInstance from "../../../utils/AxiosInstance";

function AllAnnouncement() {
  const [notifications, setNotifications] = useState([]);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const limit = 10;
  const { adminInfo } = useContext(AuthContext);

  const fetchNotifications = async (pg = 1) => {
    try {
      const res = await axiosInstance.get(`/notification/admin/all?limit=${limit}&page=${pg}`, {
        headers: {
          Authorization: `Bearer ${adminInfo?.token}`,
          "Content-Type": "application/json",
        },
      });

      if (res.data.success) {
        setNotifications(res.data.data.data);
        setTotal(res.data.data.total);
        setPage(pg);
      }
    } catch (err) {
      console.error("Failed to fetch notifications", err.message);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  const handleNext = () => {
    const totalPages = Math.ceil(total / limit);
    if (page < totalPages) {
      fetchNotifications(page + 1);
    }
  };

  const handlePrev = () => {
    if (page > 1) {
      fetchNotifications(page - 1);
    }
  };

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this notification?");
    if (!confirmDelete) return;

    try {
      const res = await axiosInstance.delete(`/notification/admin/delete/${id}`, {
        headers: {
          Authorization: `Bearer ${adminInfo?.token}`,
        },
      });

      if (res.data.success) {
        alert("Notification deleted successfully!");
        setNotifications((prev) => prev.filter((item) => item._id !== id));
      }
    } catch (err) {
      console.error("Failed to delete notification", err.message);
      alert("Something went wrong. Please try again.");
    }
  };

  return (
    <>
      <Head title="All Notification" />
      <Content>
        <BlockHead size="sm">
          <BlockBetween className="g-3">
            <BlockContent>
              <BlockTitle>All Notifications</BlockTitle>
            </BlockContent>
            <BlockHeadContent>
              <Link to={`${process.env.PUBLIC_URL}/notification`}>
                <Button color="light btn-lg">
                  <Icon name="arrow-left me-1" />
                  <span className="p-0">Back</span>
                </Button>
              </Link>
            </BlockHeadContent>
          </BlockBetween>
        </BlockHead>

        <Block size="lg">
          {notifications.map((item) => (
            <PreviewCard key={item._id} className="col-md-12 mb-4">
              <div className="d-flex justify-content-between">
                <h6>{item.title}</h6>
                <Button color="danger" size="sm" onClick={() => handleDelete(item._id)}>
                  Delete
                </Button>
              </div>
              <p className="text-end text-muted">{new Date(item.createdAt).toLocaleDateString()}</p>
              <div dangerouslySetInnerHTML={{ __html: item.description }} />
            </PreviewCard>
          ))}

          <div className="d-flex justify-content-between mt-4">
            <Button color="secondary" disabled={page === 1} onClick={handlePrev}>
              Previous
            </Button>
            <span className="align-self-center">
              Page {page} of {Math.ceil(total / limit)}
            </span>
            <Button color="primary" disabled={page >= Math.ceil(total / limit)} onClick={handleNext}>
              Next
            </Button>
          </div>
        </Block>
      </Content>
    </>
  );
}

export default AllAnnouncement;

