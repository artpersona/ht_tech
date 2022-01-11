import React, { useState } from "react";
import Layout from "../../Layout/Layout";
import {
  Breadcrumb,
  Button,
  Table,
  Space,
  Modal,
  Form,
  Input,
  Select,
  Divider,
  Radio,
  Upload,
  DatePicker,
  message,
} from "antd";
import {
  PlusOutlined,
  InboxOutlined,
  LoadingOutlined,
} from "@ant-design/icons";
import moment from "moment";
import { useAuthContext } from "../../shared/contexts/AuthContext";
import { useAppContext } from "../../shared/contexts/AppContext";
import ViewModal from "./ViewModal";
import EditModal from "./EditModal";
const { Option } = Select;

function PatientManagement() {
  const [isModalVisible, setModalVisible] = useState(false);
  const [viewVisible, setViewVisible] = useState(false);
  const [editVisible, setEditVisible] = useState(false);

  const [form] = Form.useForm();

  const [wasHospitalized, setWasHospitalized] = useState(false);
  const [loading, setLoading] = useState(false);

  const [imgLoading, setImgLoading] = useState(false);
  const [imgUrl, setImgUrl] = useState("");

  const { loggedUser } = useAuthContext();
  const { addPatient, patients } = useAppContext();

  const [viewData, setViewData] = useState({});
  const [editData, setEditData] = useState({});

  console.log("view visible: ", viewVisible);

  const columns = [
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
      render: (text, record) => (
        <p
          style={{ textTransform: "capitalize" }}
        >{`${record.first_name} ${record.last_name}`}</p>
      ),
    },
    {
      title: "Diagnosis",
      dataIndex: "diagnosis",
      key: "diagnosis",
    },
    {
      title: "Age",
      dataIndex: "age",
      key: "age",
    },
    {
      title: "Gender",
      dataIndex: "gender",
      key: "gender",
    },
    {
      title: "Address",
      dataIndex: "address",
      key: "address",
    },
    {
      title: "Onset Date",
      dataIndex: "onset_date",
      key: "onset_date",
    },
    {
      title: "Reported Date",
      dataIndex: "reporting_date",
      key: "reporting_date",
    },

    {
      title: "Actions",
      key: "action",
      render: (text, record) => {
        console.log("record: ", record);
        return (
          <Space size="middle" key={record.id}>
            <Button
              type="primary"
              onClick={() => {
                setViewData(record);
                setViewVisible(true);
              }}
            >
              View
            </Button>
            <Button
              type="primary"
              onClick={() => {
                setEditData(record);
                setEditVisible(true);
              }}
              style={{ backgroundColor: "#001529" }}
            >
              Edit
            </Button>
          </Space>
        );
      },
    },
  ];

  const handleSubmit = (data) => {
    setLoading(true);
    addPatient(data)
      .then(() => {
        setLoading(false);
        message.success("Patient added successfully");
        form.resetFields();
        setImgUrl("");
        setModalVisible(false);
      })
      .catch((err) => {
        alert(err);
        setLoading(false);
      });
  };

  const normFile = (e) => {
    console.log("Upload event:", e);

    if (Array.isArray(e)) {
      return e;
    }

    return e && e.fileList;
  };

  function getBase64(img, callback) {
    const reader = new FileReader();
    reader.addEventListener("load", () => callback(reader.result));
    reader.readAsDataURL(img);
  }

  const handleChange = (info) => {
    getBase64(info.file.originFileObj, (imageUrl) => {
      setImgUrl(imageUrl);
      setImgLoading(false);
    });
  };

  const uploadButton = (
    <div>
      {imgLoading ? <LoadingOutlined /> : <PlusOutlined />}
      <div style={{ marginTop: 8 }}>Upload</div>
    </div>
  );

  return (
    <Layout>
      <Breadcrumb style={{ margin: "16px 0" }}>
        <Breadcrumb.Item>Patient Management</Breadcrumb.Item>
      </Breadcrumb>
      <div
        className="site-layout-background"
        style={{ padding: 24, minHeight: 360 }}
      >
        <Button
          type="primary"
          icon={<PlusOutlined />}
          style={{ marginBottom: "3%" }}
          onClick={() => setModalVisible(true)}
        >
          Add New Patient
        </Button>

        <Table columns={columns} dataSource={patients} rowKey="id" />
        <ViewModal
          isModalVisible={viewVisible}
          setModalVisible={setViewVisible}
          data={viewData}
        />
        <EditModal
          isModalVisible={editVisible}
          setModalVisible={setEditVisible}
          data={editData}
        />
      </div>

      <Modal
        title="Adding Patient"
        visible={isModalVisible}
        // onOk={handleSubmit}
        onCancel={() => setModalVisible(false)}
        getContainer={false}
        keyboard={false}
        footer={
          <Form.Item>
            <Button key="back" onClick={() => setModalVisible(false)}>
              Return
            </Button>
            <Button
              type="primary"
              htmlType="submit"
              form="patient_form"
              loading={loading}
            >
              Submit
            </Button>
          </Form.Item>
        }
      >
        <Form
          layout="vertical"
          form={form}
          onFinish={handleSubmit}
          onFinishFailed={() => alert("fuck")}
          id="patient_form"
        >
          <Form.Item
            name="uri"
            rules={[{ required: true, message: "Photo is required!" }]}
          >
            <Upload
              listType="picture-card"
              className="avatar-uploader"
              showUploadList={false}
              onChange={handleChange}
              action="/upload.do"
            >
              {imgUrl ? (
                <img src={imgUrl} alt="avatar" style={{ width: "100%" }} />
              ) : (
                uploadButton
              )}
            </Upload>
          </Form.Item>

          <p style={{ fontWeight: "bold", marginBottom: "5%" }}>
            Patient's Demographic
          </p>
          <Form.Item
            label="Diagnosis"
            style={{ width: "80%" }}
            name="diagnosis"
            rules={[{ required: true, message: "Diagnosis is required!" }]}
          >
            <Select
              initialValue="HIV"
              // onChange={handleChange}
              style={{ width: "100%" }}
              placeholder="Select Diagnosis"
            >
              <Option value="HIV">HIV</Option>
              <Option value="Tuberculosis">Tuberculosis</Option>
              <Option value="Pneumonia">Pneumonia</Option>
              <Option value="Infectious diarrhea">Infectious diarrhea</Option>
              <Option value="Malaria">Malaria</Option>
            </Select>
          </Form.Item>
          <Form.Item
            label="Onset Date"
            style={{ width: "80%" }}
            name="onset_date"
            rules={[{ required: true, message: "Onset Date is required!" }]}
          >
            <DatePicker style={{ width: "100%" }} />
          </Form.Item>
          <Form.Item
            label="First Name"
            style={{ width: "80%" }}
            name="first_name"
            rules={[
              { required: true, message: "Please input your first name!" },
            ]}
          >
            <Input placeholder="input placeholder" />
          </Form.Item>
          <Form.Item
            label="Last Name"
            style={{ width: "80%" }}
            name="last_name"
            rules={[
              { required: true, message: "Please input your last name!" },
            ]}
          >
            <Input placeholder="input placeholder" />
          </Form.Item>
          <Form.Item
            label="Age"
            style={{ width: "80%" }}
            name="age"
            rules={[{ required: true, message: "Age is requred!" }]}
          >
            <Input placeholder="input placeholder" />
          </Form.Item>
          <Form.Item
            label="Gender"
            style={{ width: "80%" }}
            name="gender"
            initialValue={"Male"}
          >
            <Select
              // onChange={handleChange}
              style={{ width: "100%" }}
            >
              <Option value="Male">Male</Option>
              <Option value="Female">Female</Option>
            </Select>
          </Form.Item>
          <Form.Item
            label="Address"
            style={{ width: "80%" }}
            name="address"
            rules={[{ required: true, message: "Please input your address!" }]}
          >
            <Input placeholder="input placeholder" />
          </Form.Item>
          <Form.Item
            label="Contact #"
            style={{ width: "80%" }}
            name="contact_num"
            rules={[
              { required: true, message: "Please input your contact number!" },
            ]}
          >
            <Input placeholder="input placeholder" />
          </Form.Item>
          <Divider />
          <p style={{ fontWeight: "bold", marginBottom: "5%" }}>
            Case Identification
          </p>

          <Form.Item
            label="Caretaker / Guardian Name"
            style={{ width: "80%" }}
            name="caretaker"
          >
            <Input placeholder="input placeholder" />
          </Form.Item>
          <Form.Item
            label="Caretaker / Guardian Contact #"
            style={{ width: "80%" }}
            name="caretaker_num"
          >
            <Input placeholder="input placeholder" />
          </Form.Item>
          <Form.Item
            label="Patient Workplace / School"
            style={{ width: "80%" }}
            name="workplace"
          >
            <Input placeholder="input placeholder" />
          </Form.Item>
          <Form.Item
            label="Patient Workplace / School Address"
            style={{ width: "80%" }}
            name="workplace_address"
          >
            <Input placeholder="input placeholder" />
          </Form.Item>
          <Form.Item
            label="Was hospitalized ?"
            style={{ width: "80%" }}
            name="was_hospitalized"
            rules={[{ required: true, message: "This field is required" }]}
          >
            <Radio.Group
              onChange={(e) => setWasHospitalized(e.target.value)}
              value={wasHospitalized}
            >
              <Radio value={true}>True</Radio>
              <Radio value={false}>False</Radio>
            </Radio.Group>
          </Form.Item>
          <Divider />
          <p style={{ fontWeight: "bold", marginBottom: "5%" }}>
            Supporting Lab Findings
          </p>
          <Form.Item style={{ width: "80%" }}>
            <Form.Item
              name="dragger"
              valuePropName="fileList"
              getValueFromEvent={normFile}
              noStyle
            >
              <Upload.Dragger name="files" action="/upload.do" multiple>
                <p className="ant-upload-drag-icon">
                  <InboxOutlined />
                </p>
                <p className="ant-upload-text">
                  Click or drag medical files to this area to upload
                </p>
                <p className="ant-upload-hint">
                  Please use appropriate file names
                </p>
              </Upload.Dragger>
            </Form.Item>
          </Form.Item>
          <Divider />
          <p style={{ fontWeight: "bold", marginBottom: "5%" }}>Reporting</p>
          <Form.Item
            label="Reporting Site"
            style={{ width: "80%" }}
            name="reporting_site"
            initialValue={loggedUser?.site}
          >
            <Input
              disabled
              value={loggedUser?.site}
              style={{ textTransform: "capitalize" }}
            />
          </Form.Item>
          <Form.Item
            label="Reporting Date"
            style={{ width: "80%" }}
            name="reporting_date"
            initialValue={moment().format("LL")}
          >
            <Input disabled value={moment().format("LL")} />
          </Form.Item>
        </Form>
      </Modal>
    </Layout>
  );
}

export default PatientManagement;
