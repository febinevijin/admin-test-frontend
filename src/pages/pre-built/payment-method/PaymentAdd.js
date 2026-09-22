import React, { useContext, useState, useEffect, useRef } from "react";
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
import { useNavigate } from "react-router-dom";
import Head from "../../../layout/head/Head";
import axiosInstance from "../../../utils/AxiosInstance";
import { AuthContext } from "../../../context/AuthContext";
import useShowToast from "../../hooks/useShowToast";

const PaymentAdd = () => {
  const navigate = useNavigate();
  const { adminInfo } = useContext(AuthContext);

  const [paymentMethod, setPaymentMethod] = useState({
    paymentMethodName: "",
    minAmount: 0,
    maxAmount: 0,
    percentageCharge: 0,
    walletAddress: "",
    walletQRCode: "",
    logo: "",
    isActive: true,
  });

  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState(null);
  const showToast = useShowToast();

  // File states
  const [logoFile, setLogoFile] = useState(null);
  const [qrFile, setQrFile] = useState(null);
  const [logoPreview, setLogoPreview] = useState(null);
  const [qrPreview, setQrPreview] = useState(null);

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

  // Upload image to Cloudinary
  const uploadToCloudinary = async (file) => {
    // Validate file
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

      const response = await fetch(
        `https://api.cloudinary.com/v1_1/${REACT_APP_CLOUDINARY_CLOUD_NAME}/image/upload`,
        {
          method: "POST",
          body: formData,
        },
      );

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
  };

  // Handle file selection (store file and show preview)
  const handleFileSelect = (e, field) => {
    const file = e.target.files[0];

    if (!file) {
      // User cleared the input
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
      // Clear the old URL from paymentMethod state
      setPaymentMethod((prev) => ({
        ...prev,
        walletQRCode: "",
      }));
    }

    // DO NOT reset the input value here - this was the issue!
    // We'll keep the file in the input
  };

  // Handle form submission with Cloudinary upload
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Check if logo is required but not provided
    if (!paymentMethod.logo && !logoFile) {
      showToast("Error", "Please upload a logo image", "warning");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // Upload logo to Cloudinary if selected
      let logoUrl = paymentMethod.logo;
      if (logoFile) {
        const uploadedUrl = await uploadToCloudinary(logoFile);
        if (uploadedUrl) {
          logoUrl = uploadedUrl;
        } else {
          setLoading(false);
          return; // Upload failed, error already shown in upload function
        }
      }

      // Upload QR code to Cloudinary if selected
      let qrUrl = paymentMethod.walletQRCode;
      if (qrFile) {
        const uploadedUrl = await uploadToCloudinary(qrFile);
        if (uploadedUrl) {
          qrUrl = uploadedUrl;
        } else {
          setLoading(false);
          return; // Upload failed, error already shown in upload function
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

      await axiosInstance.post(`/admin/payment-method/create`, payload, {
        headers: {
          Authorization: `Bearer ${adminInfo.token}`,
        },
      });

      showToast("Done", "Payment method added!", "success");

      // Clean up object URLs
      if (logoPreview) URL.revokeObjectURL(logoPreview);
      if (qrPreview) URL.revokeObjectURL(qrPreview);

      navigate(`${process.env.PUBLIC_URL}/payment-method`);
    } catch (err) {
      console.error("Submit error:", err);
      showToast("Error", err?.response?.data?.message || "Failed to add payment method. Please try again.", "warning");
      setError(err?.response?.data?.message || "Failed to add payment method. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Remove logo
  const removeLogo = () => {
    if (logoPreview) URL.revokeObjectURL(logoPreview);
    setLogoFile(null);
    setLogoPreview(null);
    setPaymentMethod((prev) => ({
      ...prev,
      logo: "",
    }));
    if (logoInputRef.current) {
      logoInputRef.current.value = "";
    }
  };

  // Remove QR code
  const removeQr = () => {
    if (qrPreview) URL.revokeObjectURL(qrPreview);
    setQrFile(null);
    setQrPreview(null);
    setPaymentMethod((prev) => ({
      ...prev,
      walletQRCode: "",
    }));
    if (qrInputRef.current) {
      qrInputRef.current.value = "";
    }
  };

  return (
    <>
      <Head title="Add Payment Method"></Head>
      <Content>
        <BlockHead size="sm">
          <BlockBetween className="g-3">
            <BlockContent>
              <BlockTitle>Add Payment Method</BlockTitle>
              <BlockDes className="text-soft">
                <p>Add new client payment method</p>
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
                      Logo (Image) <span className="text-danger">*</span>
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
                          required={!paymentMethod.logo && !logoFile}
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
                          <Button color="danger" size="sm" className="ms-2" type="button" onClick={removeLogo}>
                            <Icon name="cross" />
                          </Button>
                          <small className="text-info ms-2">File selected (will upload on save)</small>
                        </div>
                      )}

                      {/* Show already uploaded logo */}
                      {paymentMethod.logo && !logoPreview && (
                        <div className="mt-2">
                          <img src={paymentMethod.logo} alt="Logo" style={{ maxHeight: "50px", borderRadius: "4px" }} />
                          <small className="text-success ms-2">✓ Uploaded</small>
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
                          <Button color="danger" size="sm" className="ms-2" type="button" onClick={removeQr}>
                            <Icon name="cross" />
                          </Button>
                          <small className="text-info ms-2">File selected (will upload on save)</small>
                        </div>
                      )}

                      {/* Show already uploaded QR code */}
                      {paymentMethod.walletQRCode && !qrPreview && (
                        <div className="mt-2">
                          <img
                            src={paymentMethod.walletQRCode}
                            alt="QR Code"
                            style={{ maxHeight: "50px", borderRadius: "4px" }}
                          />
                          <small className="text-success ms-2">✓ Uploaded</small>
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
                          {uploading ? "Uploading..." : "Saving..."}
                        </>
                      ) : (
                        "Save Changes"
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

export default PaymentAdd;
