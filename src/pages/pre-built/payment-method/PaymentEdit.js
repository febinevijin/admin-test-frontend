import React, { useContext, useState, useRef, useEffect } from "react";
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
import { Form, Row, Col, Label, Button, Input, Spinner } from "reactstrap";
import { useLocation, useNavigate } from "react-router-dom";
import Head from "../../../layout/head/Head";
import axiosInstance from "../../../utils/AxiosInstance";
import { AuthContext } from "../../../context/AuthContext";
import useShowToast from "../../hooks/useShowToast";

const PaymentEdit = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { method } = location.state || {};
  const { adminInfo } = useContext(AuthContext);
  const showToast = useShowToast();

  const [paymentMethod, setPaymentMethod] = useState({
    paymentMethodName: method?.paymentMethodName || "",
    minAmount: method?.minAmount || 0,
    maxAmount: method?.maxAmount || 0,
    percentageCharge: method?.percentageCharge || 0,
    walletAddress: method?.extraDetails?.walletAddress || "",
    walletQRCode: method?.extraDetails?.walletQRCode || "",
    logo: method?.logo || "",
    isActive: method?.isActive || false,
  });

  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState(null);

  // File states
  const [logoFile, setLogoFile] = useState(null);
  const [qrFile, setQrFile] = useState(null);
  const [logoPreview, setLogoPreview] = useState(null);
  const [qrPreview, setQrPreview] = useState(null);
  const [removeLogo, setRemoveLogo] = useState(false);
  const [removeQr, setRemoveQr] = useState(false);

  // Refs for file inputs
  const logoInputRef = useRef(null);
  const qrInputRef = useRef(null);

  // Clean up object URLs on unmount
  useEffect(() => {
    return () => {
      if (logoPreview) URL.revokeObjectURL(logoPreview);
      if (qrPreview) URL.revokeObjectURL(qrPreview);
    };
  }, [logoPreview, qrPreview]);

  // Handle input changes
  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setPaymentMethod({
      ...paymentMethod,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  // Upload image to Cloudinary (SAME METHOD as PaymentAdd)
  const uploadToCloudinary = async (file) => {
    if (!file) {
      showToast("Error", "No file selected", "error");
      return null;
    }

    // Validate file size (max 2MB)
    if (file.size > 2 * 1024 * 1024) {
      showToast("Error", "Image size must be less than 2MB", "error");
      return null;
    }

    // Validate file type
    const validTypes = ["image/jpeg", "image/png", "image/webp", "image/gif", "image/svg+xml"];
    if (!validTypes.includes(file.type)) {
      showToast("Error", "Please upload JPEG, PNG, WEBP, GIF, or SVG", "error");
      return null;
    }

    const formData = new FormData();
    formData.append("file", file);
    // formData.append("upload_preset", process.env.REACT_APP_CLOUDINARY_PRESET_NAME);
    formData.append("upload_preset", "filan_trading");
    formData.append("cloud_name", "dut1xljmc");
    // formData.append("cloud_name", process.env.REACT_APP_CLOUDINARY_CLOUD_NAME);
    const REACT_APP_CLOUDINARY_CLOUD_NAME = "dut1xljmc";

    try {
      setUploading(true);

      const response = await fetch(`https://api.cloudinary.com/v1_1/${REACT_APP_CLOUDINARY_CLOUD_NAME}/image/upload`, {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error?.message || `Upload failed: ${response.statusText}`);
      }

      const data = await response.json();

      if (data.secure_url) {
        return data.secure_url;
      } else {
        throw new Error("Upload failed - no URL returned");
      }
    } catch (error) {
      console.error("Cloudinary upload error:", error);
      showToast("Error", error.message || "Failed to upload image. Please try again.", "error");
      return null;
    } finally {
      setUploading(false);
    }
  };;

  // Handle file selection (SAME METHOD as PaymentAdd)
  const handleFileSelect = (e, field) => {
    const file = e.target.files[0];

    if (!file) {
      if (field === "logo") {
        setLogoFile(null);
        setLogoPreview(null);
        if (logoInputRef.current) logoInputRef.current.value = "";
      } else {
        setQrFile(null);
        setQrPreview(null);
        if (qrInputRef.current) qrInputRef.current.value = "";
      }
      return;
    }

    // Validate file
    if (file.size > 2 * 1024 * 1024) {
      showToast("Error", "Image size must be less than 2MB", "error");
      if (field === "logo" && logoInputRef.current) {
        logoInputRef.current.value = "";
      } else if (field === "walletQRCode" && qrInputRef.current) {
        qrInputRef.current.value = "";
      }
      return;
    }

    const validTypes = ["image/jpeg", "image/png", "image/webp", "image/gif", "image/svg+xml"];
    if (!validTypes.includes(file.type)) {
      showToast("Error", "Please upload JPEG, PNG, WEBP, GIF, or SVG", "error");
      if (field === "logo" && logoInputRef.current) {
        logoInputRef.current.value = "";
      } else if (field === "walletQRCode" && qrInputRef.current) {
        qrInputRef.current.value = "";
      }
      return;
    }

    // Store file for later upload
    if (field === "logo") {
      // Clean up old preview
      if (logoPreview) URL.revokeObjectURL(logoPreview);

      setLogoFile(file);
      const preview = URL.createObjectURL(file);
      setLogoPreview(preview);
      setRemoveLogo(false);
      // Clear the old URL from paymentMethod state
      setPaymentMethod((prev) => ({
        ...prev,
        logo: "",
      }));
    } else {
      // Clean up old preview
      if (qrPreview) URL.revokeObjectURL(qrPreview);

      setQrFile(file);
      const preview = URL.createObjectURL(file);
      setQrPreview(preview);
      setRemoveQr(false);
      // Clear the old URL from paymentMethod state
      setPaymentMethod((prev) => ({
        ...prev,
        walletQRCode: "",
      }));
    }
  };

  // Handle remove logo
  const handleRemoveLogo = () => {
    if (logoPreview) URL.revokeObjectURL(logoPreview);
    setLogoFile(null);
    setLogoPreview(null);
    setRemoveLogo(true);
    setPaymentMethod((prev) => ({
      ...prev,
      logo: "",
    }));
    if (logoInputRef.current) {
      logoInputRef.current.value = "";
    }
  };

  // Handle remove QR code
  const handleRemoveQr = () => {
    if (qrPreview) URL.revokeObjectURL(qrPreview);
    setQrFile(null);
    setQrPreview(null);
    setRemoveQr(true);
    setPaymentMethod((prev) => ({
      ...prev,
      walletQRCode: "",
    }));
    if (qrInputRef.current) {
      qrInputRef.current.value = "";
    }
  };

  // Handle form submission (SAME METHOD as PaymentAdd)
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      let logoUrl = paymentMethod.logo;

      // If logo should be removed
      if (removeLogo) {
        logoUrl = "";
      }
      // If new logo file is selected
      else if (logoFile) {
        const uploadedUrl = await uploadToCloudinary(logoFile);
        if (uploadedUrl) {
          logoUrl = uploadedUrl;
        } else {
          setLoading(false);
          return;
        }
      }

      let qrUrl = paymentMethod.walletQRCode;

      // If QR should be removed
      if (removeQr) {
        qrUrl = "";
      }
      // If new QR file is selected
      else if (qrFile) {
        const uploadedUrl = await uploadToCloudinary(qrFile);
        if (uploadedUrl) {
          qrUrl = uploadedUrl;
        } else {
          setLoading(false);
          return;
        }
      }

      const payload = {
        paymentMethodName: paymentMethod.paymentMethodName,
        minAmount: Number(paymentMethod.minAmount),
        maxAmount: Number(paymentMethod.maxAmount),
        percentageCharge: Number(paymentMethod.percentageCharge),
        logo: logoUrl,
        isActive: paymentMethod.isActive,
        extraDetails: {
          walletAddress: paymentMethod.walletAddress || undefined,
          walletQRCode: qrUrl || undefined,
        },
      };

      await axiosInstance.put(`/admin/payment-method/edit/${method._id}`, payload, {
        headers: {
          Authorization: `Bearer ${adminInfo.token}`,
        },
      });

      setLoading(false);
      showToast("Done", "Payment method updated successfully!", "success");

      // Clean up object URLs
      if (logoPreview) URL.revokeObjectURL(logoPreview);
      if (qrPreview) URL.revokeObjectURL(qrPreview);

      navigate(`${process.env.PUBLIC_URL}/payment-method`);
    } catch (err) {
      setLoading(false);
      showToast(
        "Error",
        err?.response?.data?.message || "Failed to update payment method. Please try again.",
        "warning",
      );
      setError(err?.response?.data?.message || "Failed to update payment method. Please try again.");
    }
  };

  return (
    <>
      <Head title="Edit Payment Method"></Head>
      <Content>
        <BlockHead size="sm">
          <BlockBetween className="g-3">
            <BlockContent>
              <BlockTitle>Edit Payment Method</BlockTitle>
              <BlockDes className="text-soft">
                <p>Managing client payment methods</p>
              </BlockDes>
            </BlockContent>
            <BlockHeadContent>
              <Button
                color="light"
                outline
                className="bg-white d-none d-sm-inline-flex"
                onClick={() => navigate(`${process.env.PUBLIC_URL}/payment-method`)}
              >
                <Icon name="arrow-left"></Icon>
                <span>Back</span>
              </Button>
            </BlockHeadContent>
          </BlockBetween>
        </BlockHead>

        <Block size="lg">
          <PreviewCard>
            <Form className="formClass" onSubmit={handleSubmit}>
              <Row className="g-gs">
                <Col md="4">
                  <div className="form-group">
                    <Label className="form-label" htmlFor="paymentMethodName">
                      Payment Method Name <span className="text-danger">*</span>
                    </Label>
                    <div className="form-control-wrap">
                      <input
                        type="text"
                        id="paymentMethodName"
                        name="paymentMethodName"
                        placeholder="e.g. Bank Transfer, Wallet, PayPal"
                        className="form-control"
                        value={paymentMethod.paymentMethodName}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                  </div>
                </Col>

                <Col md="4">
                  <div className="form-group">
                    <Label className="form-label" htmlFor="logo">
                      Logo (Image)
                    </Label>
                    <div className="form-control-wrap">
                      <div className="form-file">
                        <Input
                          type="file"
                          id="logoFile"
                          name="logoFile"
                          accept="image/*"
                          onChange={(e) => handleFileSelect(e, "logo")}
                          innerRef={logoInputRef}
                        />
                      </div>

                      {/* Show preview of selected file */}
                      {logoPreview && (
                        <div className="mt-2">
                          <img
                            src={logoPreview}
                            alt="Logo Preview"
                            style={{ maxHeight: "50px", borderRadius: "4px" }}
                          />
                          <Button color="danger" size="sm" className="ms-2" type="button" onClick={handleRemoveLogo}>
                            <Icon name="cross" />
                          </Button>
                          <small className="text-info ms-2">New file selected (will upload on save)</small>
                        </div>
                      )}

                      {/* Show existing logo if not removed and no new file selected */}
                      {paymentMethod.logo && !logoPreview && !removeLogo && (
                        <div className="mt-2">
                          <img src={paymentMethod.logo} alt="Logo" style={{ maxHeight: "50px", borderRadius: "4px" }} />
                          <Button color="danger" size="sm" className="ms-2" type="button" onClick={handleRemoveLogo}>
                            <Icon name="cross" />
                          </Button>
                          <small className="text-success ms-2">✓ Existing image</small>
                        </div>
                      )}

                      {/* Show removal indicator */}
                      {removeLogo && (
                        <div className="mt-2">
                          <small className="text-danger">Logo will be removed</small>
                          <Button
                            color="primary"
                            size="sm"
                            className="ms-2"
                            type="button"
                            onClick={() => {
                              setRemoveLogo(false);
                              // Restore the existing logo
                              if (method?.logo) {
                                setPaymentMethod((prev) => ({
                                  ...prev,
                                  logo: method.logo,
                                }));
                              }
                            }}
                          >
                            <Icon name="refresh" /> Restore
                          </Button>
                        </div>
                      )}

                      {uploading && (
                        <div className="mt-2">
                          <Spinner size="sm" color="primary" /> Uploading...
                        </div>
                      )}
                    </div>
                  </div>
                </Col>

                <Col md="4">
                  <Label className="form-label">
                    Minimum Deposit Amount <span className="text-danger">*</span>
                  </Label>
                  <div className="form-control-wrap">
                    <div className="input-group">
                      <input
                        type="number"
                        name="minAmount"
                        className="form-control"
                        placeholder="Minimum Deposit Amount"
                        value={paymentMethod.minAmount}
                        onChange={handleInputChange}
                        min="0"
                        required
                      />
                      <div className="input-group-append">
                        <span className="input-group-text">USD</span>
                      </div>
                    </div>
                  </div>
                </Col>

                <Col md="4">
                  <Label className="form-label">
                    Maximum Deposit Amount <span className="text-danger">*</span>
                  </Label>
                  <div className="form-control-wrap">
                    <div className="input-group">
                      <input
                        type="number"
                        name="maxAmount"
                        className="form-control"
                        placeholder="Maximum Deposit Amount"
                        value={paymentMethod.maxAmount}
                        onChange={handleInputChange}
                        min="0"
                        required
                      />
                      <div className="input-group-append">
                        <span className="input-group-text">USD</span>
                      </div>
                    </div>
                  </div>
                </Col>

                <Col md="4">
                  <Label className="form-label">
                    Percentage Charge <span className="text-danger">*</span>
                  </Label>
                  <div className="form-control-wrap">
                    <div className="input-group">
                      <input
                        type="number"
                        name="percentageCharge"
                        className="form-control"
                        placeholder="Percentage Charge"
                        value={paymentMethod.percentageCharge}
                        onChange={handleInputChange}
                        min="0"
                        required
                      />
                      <div className="input-group-append">
                        <span className="input-group-text">%</span>
                      </div>
                    </div>
                  </div>
                </Col>

                <Col md="4">
                  <div className="form-group">
                    <Label className="form-label" htmlFor="walletAddress">
                      Wallet Address
                    </Label>
                    <div className="form-control-wrap">
                      <input
                        type="text"
                        id="walletAddress"
                        name="walletAddress"
                        placeholder="Wallet Address"
                        className="form-control"
                        value={paymentMethod.walletAddress}
                        onChange={handleInputChange}
                      />
                    </div>
                  </div>
                </Col>

                <Col md="4">
                  <div className="form-group">
                    <Label className="form-label" htmlFor="walletQRCode">
                      Wallet QR Code
                    </Label>
                    <div className="form-control-wrap">
                      <div className="form-file">
                        <Input
                          type="file"
                          id="qrCodeFile"
                          name="qrCodeFile"
                          accept="image/*"
                          onChange={(e) => handleFileSelect(e, "walletQRCode")}
                          innerRef={qrInputRef}
                        />
                      </div>

                      {/* Show preview of selected QR code */}
                      {qrPreview && (
                        <div className="mt-2">
                          <img src={qrPreview} alt="QR Preview" style={{ maxHeight: "50px", borderRadius: "4px" }} />
                          <Button color="danger" size="sm" className="ms-2" type="button" onClick={handleRemoveQr}>
                            <Icon name="cross" />
                          </Button>
                          <small className="text-info ms-2">New file selected (will upload on save)</small>
                        </div>
                      )}

                      {/* Show existing QR code if not removed and no new file selected */}
                      {paymentMethod.walletQRCode && !qrPreview && !removeQr && (
                        <div className="mt-2">
                          <img
                            src={paymentMethod.walletQRCode}
                            alt="QR Code"
                            style={{ maxHeight: "50px", borderRadius: "4px" }}
                          />
                          <Button color="danger" size="sm" className="ms-2" type="button" onClick={handleRemoveQr}>
                            <Icon name="cross" />
                          </Button>
                          <small className="text-success ms-2">✓ Existing image</small>
                        </div>
                      )}

                      {/* Show removal indicator */}
                      {removeQr && (
                        <div className="mt-2">
                          <small className="text-danger">QR Code will be removed</small>
                          <Button
                            color="primary"
                            size="sm"
                            className="ms-2"
                            type="button"
                            onClick={() => {
                              setRemoveQr(false);
                              // Restore the existing QR code
                              if (method?.extraDetails?.walletQRCode) {
                                setPaymentMethod((prev) => ({
                                  ...prev,
                                  walletQRCode: method.extraDetails.walletQRCode,
                                }));
                              }
                            }}
                          >
                            <Icon name="refresh" /> Restore
                          </Button>
                        </div>
                      )}
                    </div>
                  </div>
                </Col>

                <Col md="4">
                  <Label className="form-label">Status</Label>
                  <div className="form-group">
                    <div className="custom-control custom-switch mt-2">
                      <input
                        type="checkbox"
                        className="custom-control-input"
                        id="isActive"
                        name="isActive"
                        checked={paymentMethod.isActive}
                        onChange={handleInputChange}
                      />
                      <label className="custom-control-label" htmlFor="isActive">
                        Activate
                      </label>
                    </div>
                  </div>
                </Col>

                <Col md="12">
                  <div className="form-group mt-5 d-flex justify-content-end">
                    <Button
                      color="light"
                      className="me-3"
                      size="md"
                      type="button"
                      onClick={() => {
                        // Clean up object URLs
                        if (logoPreview) URL.revokeObjectURL(logoPreview);
                        if (qrPreview) URL.revokeObjectURL(qrPreview);
                        navigate(`${process.env.PUBLIC_URL}/payment-method`);
                      }}
                    >
                      Cancel
                    </Button>
                    <Button color="primary" size="md" type="submit" disabled={loading || uploading}>
                      {loading || uploading ? (
                        <>
                          <Spinner size="sm" className="me-2" />
                          {uploading ? "Uploading..." : "Updating..."}
                        </>
                      ) : (
                        "Update Changes"
                      )}
                    </Button>
                  </div>
                </Col>

                {error && (
                  <Col md="12">
                    <div className="alert alert-danger mt-3">{error}</div>
                  </Col>
                )}
              </Row>
            </Form>
          </PreviewCard>
        </Block>
      </Content>
    </>
  );
};

export default PaymentEdit;
