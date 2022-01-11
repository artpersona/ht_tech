import React, { useState, useEffect } from "react";
import {
  Button,
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
import { useAppContext } from "../../shared/contexts/AppContext";

const { Option } = Select;

function EditModal({ isModalVisible, setModalVisible, data }) {
  const [form] = Form.useForm();
  const { updatePatient } = useAppContext();

  const [wasHospitalized, setWasHospitalized] = useState(false);
  const [loading, setLoading] = useState(false);

  const [imgLoading, setImgLoading] = useState(false);
  const [imgUrl, setImgUrl] = useState(data?.uri);
  const [fileList, setFileList] = useState([]);

  const [previewImage, setPreviewImage] = useState(null);
  const [previewVisible, setPreviewVisible] = useState(false);
  const [previewTitle, setPreviewTitle] = useState("");

  useEffect(() => {
    setImgUrl(data?.uri);
  }, [data?.uri]);

  useEffect(() => {
    let uid = -1;
    let tempFileList = [];
    data?.medical_file?.map((item) => {
      tempFileList.push({
        uid,
        name: item.name,
        status: "done",
        url: item.url,
      });
      uid--;
    });
    setFileList(tempFileList);
  }, [data?.medical_file]);

  const handleSubmit = (doc) => {
    doc.dragger = fileList;
    setLoading(true);
    updatePatient(doc, data.id)
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

  const handlePreview = async (file) => {
    if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj);
    }

    setPreviewImage(file.url || file.preview);
    setPreviewVisible(true);
    setPreviewTitle(
      file.name || file.url.substring(file.url.lastIndexOf("/") + 1)
    );
  };

  const handleListChange = ({ fileList }) => setFileList(fileList);

  return (
    <Modal
      title="Adding Patient"
      visible={isModalVisible}
      // onOk={handleSubmit}
      onCancel={() => {
        form.resetFields();
        setModalVisible(false);
      }}
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
          initialValue={data?.uri}
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
          initialValue={data.diagnosis}
        >
          <Select
            // onChange={handleChange}
            style={{ width: "100%" }}
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
          initialValue={moment(data.onset_date)}
        >
          <DatePicker style={{ width: "100%" }} />
        </Form.Item>
        <Form.Item
          label="First Name"
          style={{ width: "80%" }}
          name="first_name"
          rules={[{ required: true, message: "Please input your first name!" }]}
          initialValue={data.first_name}
        >
          <Input placeholder="input placeholder" />
        </Form.Item>
        <Form.Item
          label="Last Name"
          style={{ width: "80%" }}
          name="last_name"
          rules={[{ required: true, message: "Please input your last name!" }]}
          initialValue={data.last_name}
        >
          <Input placeholder="input placeholder" />
        </Form.Item>
        <Form.Item
          label="Age"
          style={{ width: "80%" }}
          name="age"
          rules={[{ required: true, message: "Age is requred!" }]}
          initialValue={data.age}
        >
          <Input placeholder="input placeholder" />
        </Form.Item>
        <Form.Item
          label="Gender"
          style={{ width: "80%" }}
          name="gender"
          initialValue={data.gender}
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
          initialValue={data.address}
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
          initialValue={data.contact_num}
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
          initialValue={data.caretaker}
        >
          <Input placeholder="input placeholder" />
        </Form.Item>
        <Form.Item
          label="Caretaker / Guardian Contact #"
          style={{ width: "80%" }}
          name="caretaker_num"
          initialValue={data.caretaker_num}
        >
          <Input placeholder="input placeholder" />
        </Form.Item>
        <Form.Item
          label="Patient Workplace / School"
          style={{ width: "80%" }}
          name="workplace"
          initialValue={data.workplace}
        >
          <Input placeholder="input placeholder" />
        </Form.Item>
        <Form.Item
          label="Patient Workplace / School Address"
          style={{ width: "80%" }}
          name="workplace_address"
          initialValue={data.workplace_address}
        >
          <Input placeholder="input placeholder" />
        </Form.Item>
        <Form.Item
          label="Was hospitalized ?"
          style={{ width: "80%" }}
          name="was_hospitalized"
          rules={[{ required: true, message: "This field is required" }]}
          initialValue={data.was_hospitalized}
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
        <Form.Item
          style={{ width: "80%" }}
          initialValue={fileList}
          name="dragger"
        >
          <Upload
            listType="picture-card"
            fileList={fileList}
            onPreview={handlePreview}
            onChange={handleListChange}
            action="/upload.do"
          >
            {fileList.length >= 8 ? null : uploadButton}
          </Upload>
          <Modal
            visible={previewVisible}
            title={previewTitle}
            footer={null}
            onCancel={() => setPreviewVisible(false)}
          >
            <img alt="example" style={{ width: "100%" }} src={previewImage} />
          </Modal>
        </Form.Item>
        <Divider />
        <p style={{ fontWeight: "bold", marginBottom: "5%" }}>Reporting</p>
        <Form.Item
          label="Reporting Site"
          style={{ width: "80%" }}
          name="reporting_site"
          initialValue={data?.reporting_site}
        >
          <Input
            disabled
            value={data?.site}
            style={{ textTransform: "capitalize" }}
          />
        </Form.Item>
        <Form.Item
          label="Reporting Date"
          style={{ width: "80%" }}
          name="reporting_date"
          initialValue={data?.reporting_date}
        >
          <Input disabled value={moment().format("LL")} />
        </Form.Item>
      </Form>
    </Modal>
  );
}

export default EditModal;
