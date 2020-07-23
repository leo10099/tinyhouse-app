import React, { useState } from "react";
import {
  Layout,
  Typography,
  Form,
  Input,
  InputNumber,
  Radio,
  Upload,
  Button,
} from "antd";
import { Viewer } from "../../lib/types";
import { Link, useHistory } from "react-router-dom";
import { ListingType, HostListingInput } from "../../lib/graphql/globalTypes";
import {
  BankOutlined,
  HomeOutlined,
  PlusOutlined,
  LoadingOutlined,
} from "@ant-design/icons";
import {
  iconColor,
  displayErrorMessage,
  displaySuccessNotification,
} from "../../lib/utils";
import { UploadChangeParam } from "antd/lib/upload";
import { useMutation } from "@apollo/react-hooks";
import { HOST_LISTING } from "../../lib/graphql/mutations/HostListing";
import {
  HostListingVariables,
  HostListing as HostListingData,
} from "../../lib/graphql/mutations/HostListing/__generated__/HostListing";
import { Store } from "antd/lib/form/interface";
// import { useScrollToTop } from "../../lib/hooks";

async function getBase64Value(img: File | Blob): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.addEventListener("load", () => {
      resolve(reader.result as string);
    });
    reader.addEventListener("error", (error) => {
      reject(error.target?.error?.message);
    });
    reader.readAsDataURL(img);
  });
}

function validateFileUpload(file: File) {
  const fileIsValidImage =
    file.type === "image/jpeg" || file.type === "image/png";
  const fileSizeInMB = file.size / 1024 / 1024;
  const fileIsVaildSize = fileSizeInMB < 1;

  if (!fileIsValidImage) {
    displayErrorMessage("You're only able to upload valid JPG or PNG files!");
    return false;
  }

  if (!fileIsVaildSize) {
    displayErrorMessage(
      "You're only able to upload valid images files of under 1MB in size!"
    );
    return false;
  }

  return true;
}

export function Host({ viewer }: { viewer: Viewer }) {
  //useScrollToTop();

  const history = useHistory();

  const [imageLoading, setImageLoading] = useState(false);
  const [imageBase64Value, setImageBase64Value] = useState<string | null>(null);

  const [hostListing, { loading }] = useMutation<
    HostListingData,
    HostListingVariables
  >(HOST_LISTING, {
    onCompleted(data) {
      displaySuccessNotification("You've successfully created your listing!");
      history.push(`/listing/${data.hostListing.id}`);
    },
    onError() {
      displayErrorMessage(
        "Sorry! We weren't able to create your listing. Please try again later."
      );
    },
  });

  const [form] = Form.useForm();

  async function handleImageUpload({ file }: UploadChangeParam) {
    try {
      if (file.status === "uploading") {
        setImageLoading(true);
        return;
      }

      if (file.status === "done" && file.originFileObj) {
        const imageBase64Value = await getBase64Value(file.originFileObj);
        setImageBase64Value(imageBase64Value);
        setImageLoading(false);
      }
    } catch (error) {
      displayErrorMessage(
        `Sorry! There was an problem uploading your image: ${error}`
      );
      setImageLoading(false);
    }
  }

  function handleFormFinish(values: Store) {
    const fullAddress = `${values.address}, ${values.city}, ${values.state}, ${values.postalCode}`;

    const input: HostListingInput = {
      title: values.title,
      description: values.description,
      image: imageBase64Value as string,
      type: values.type,
      address: fullAddress,
      price: values.price * 100,
      numOfGuests: values.numOfGuests,
    };

    hostListing({ variables: { input } });
  }

  function handleFromFinishFailed() {
    displayErrorMessage("Please complete all required form fileds!");
  }

  if (!viewer.id || !viewer.hasWallet) {
    return (
      <Layout.Content className="host-content">
        <div className="host__form-header">
          <Typography.Title level={4} className="host__form-title">
            You'll have to be signed in and connected with Stripe to host a
            listing!
          </Typography.Title>
          <Typography.Text type="secondary">
            We only allow users who've signed in to our application and have
            connected with Stripe to host new listings. You can sign in at the{" "}
            <Link to="/login">/login</Link> page and connect with Stripe shortly
            after.
          </Typography.Text>
        </div>
      </Layout.Content>
    );
  }

  if (loading) {
    return (
      <Layout.Content className="host-content">
        <div className="host__form-header">
          <Typography.Title level={3} className="host__form-title">
            Please wait!
          </Typography.Title>
          <Typography.Text type="secondary">
            We're creating your listing now.
          </Typography.Text>
        </div>
      </Layout.Content>
    );
  }

  return (
    <Layout.Content className="host-content">
      <Form
        form={form}
        name="host_form"
        layout="vertical"
        onFinish={handleFormFinish}
        onFinishFailed={handleFromFinishFailed}
      >
        <div className="host__form-header">
          <Typography.Title level={3} className="host__form-title">
            Hi! Let's get started listing your place.
          </Typography.Title>
          <Typography.Text type="secondary">
            In this form, we'll collect some basic and additional information
            about your listing.
          </Typography.Text>
        </div>
        <Form.Item
          name="type"
          rules={[{ required: true, message: "Please select a home type!" }]}
          label="Home Type"
        >
          <Radio.Group>
            <Radio.Button value={ListingType.APARTMENT}>
              <BankOutlined style={{ color: iconColor }} />{" "}
              <span>Apartment</span>
            </Radio.Button>
            <Radio.Button value={ListingType.HOUSE}>
              <HomeOutlined style={{ color: iconColor }} /> <span>House</span>
            </Radio.Button>
          </Radio.Group>
        </Form.Item>
        <Form.Item
          name="numOfGuests"
          rules={[
            {
              required: true,
              message: "Plesae enter the max number of guests!",
            },
          ]}
          label="Max # of Guests"
        >
          <InputNumber min={1} placeholder="4" />
        </Form.Item>
        <Form.Item
          name="title"
          rules={[
            {
              required: true,
              message: "Please enter a title for your listing!",
            },
          ]}
          label="Title"
          extra="Max character count of 45"
        >
          <Input
            maxLength={45}
            placeholder="The iconic and luxurious Bel-Air mansion"
          />
        </Form.Item>
        <Form.Item
          name="description"
          rules={[
            {
              required: true,
              message: "Please enter a description for your listing!",
            },
          ]}
          label="Description of listing"
          extra="Max character count of 400"
        >
          <Input.TextArea
            rows={3}
            maxLength={400}
            placeholder="Modern, clean, and iconic home of the Fresh Prince. Situated in the heart of Bel-Air, Los Angeles."
          />
        </Form.Item>
        <Form.Item
          name="address"
          rules={[
            {
              required: true,
              message: "Please enter an address for your listing!",
            },
          ]}
          label="Address"
        >
          <Input placeholder="251 North Bristol Avenue" />
        </Form.Item>
        <Form.Item
          name="city"
          rules={[
            {
              required: true,
              message: "Please enter a city (or region) for your listing!",
            },
          ]}
          label="City/Town"
        >
          <Input placeholder="Los Angeles" />
        </Form.Item>
        <Form.Item
          name="state"
          rules={[
            {
              required: true,
              message: "Please enter a state for your listing!",
            },
          ]}
          label="State/Province"
        >
          <Input placeholder="California" />
        </Form.Item>
        <Form.Item
          name="postalCode"
          rules={[
            {
              required: true,
              message: "Please enter a zip code for your listing!",
            },
          ]}
          label="Zip/Postal Code"
        >
          <Input placeholder="Please enter a zip code for your listing!" />
        </Form.Item>
        <Form.Item
          name="image"
          rules={[
            {
              required: true,
              message: "Please provide an image for your listing!",
            },
          ]}
          label="Image"
          extra="Images have to be under 1MB in size and of type JPG or PNG"
        >
          <div className="host__form-image-upload">
            <Upload
              name="image"
              listType="picture-card"
              showUploadList={false}
              action="https://www.mocky.io/v2/5cc8019d300000980a055e76"
              beforeUpload={validateFileUpload}
              onChange={handleImageUpload}
              disabled={imageLoading}
            >
              {imageBase64Value !== null ? (
                <img src={imageBase64Value} alt="" />
              ) : (
                <div>
                  {imageLoading ? <LoadingOutlined /> : <PlusOutlined />}
                  <div className="ant-upload-text">Upload</div>
                </div>
              )}
            </Upload>
          </div>
        </Form.Item>
        <Form.Item
          name="price"
          rules={[
            {
              required: true,
              message: "Please enter a price for your listing!",
            },
          ]}
          label="Price"
          extra="All prices in $USD/day"
        >
          <InputNumber placeholder="120" min={0} />
        </Form.Item>
        <Form.Item>
          <Button type="primary" htmlType="submit">
            Submit
          </Button>
        </Form.Item>
      </Form>
    </Layout.Content>
  );
}
