import React, { useState } from "react";
import { Modal, Form, Input, Divider, Upload, Image } from "antd";
import moment from "moment";

function ViewModal({ isModalVisible, setModalVisible, data }) {
  return (
    <Modal
      title="Viewing Patient Data"
      onCancel={() => setModalVisible(false)}
      getContainer={false}
      keyboard={false}
      footer={null}
      visible={isModalVisible}
    >
      <Form
        layout="vertical"
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
            action="/upload.do"
            disabled={true}
          >
            <img src={data.uri} alt="avatar" style={{ width: "100%" }} />
          </Upload>
        </Form.Item>

        <p style={{ fontWeight: "bold", marginBottom: "5%" }}>
          Patient's Demographic
        </p>
        <Form.Item label="Diagnosis" style={{ width: "80%" }}>
          <Input
            placeholder="input placeholder"
            value={data.diagnosis}
            disabled
          />
        </Form.Item>
        <Form.Item label="Onset Date" style={{ width: "80%" }}>
          <Input
            placeholder="input placeholder"
            value={data.onset_date}
            disabled
          />
        </Form.Item>
        <Form.Item label="First Name" style={{ width: "80%" }}>
          <Input
            placeholder="input placeholder"
            value={data.first_name}
            disabled
          />
        </Form.Item>
        <Form.Item label="Last Name" style={{ width: "80%" }}>
          <Input
            placeholder="input placeholder"
            value={data.last_name}
            disabled
          />
        </Form.Item>
        <Form.Item label="Age" style={{ width: "80%" }}>
          <Input placeholder="input placeholder" value={data.age} disabled />
        </Form.Item>
        <Form.Item
          label="Gender"
          style={{ width: "80%" }}
          initialValue={"Male"}
        >
          <Input placeholder="input placeholder" value={data.gender} disabled />
        </Form.Item>
        <Form.Item label="Address" style={{ width: "80%" }}>
          <Input
            placeholder="input placeholder"
            value={data.address}
            disabled
          />
        </Form.Item>
        <Form.Item label="Contact #" style={{ width: "80%" }}>
          <Input
            placeholder="input placeholder"
            value={data.contact_num}
            disabled
          />
        </Form.Item>
        <Divider />
        <p style={{ fontWeight: "bold", marginBottom: "5%" }}>
          Case Identification
        </p>

        <Form.Item label="Caretaker / Guardian Name" style={{ width: "80%" }}>
          <Input
            placeholder="input placeholder"
            value={data.caretaker}
            disabled
          />
        </Form.Item>
        <Form.Item
          label="Caretaker / Guardian Contact #"
          style={{ width: "80%" }}
        >
          <Input
            placeholder="input placeholder"
            value={data.caretaker_num}
            disabled
          />
        </Form.Item>
        <Form.Item label="Patient Workplace / School" style={{ width: "80%" }}>
          <Input
            placeholder="input placeholder"
            value={data.workplace}
            disabled
          />
        </Form.Item>
        <Form.Item
          label="Patient Workplace / School Address"
          style={{ width: "80%" }}
        >
          <Input
            placeholder="input placeholder"
            value={data.workplace_address}
            disabled
          />
        </Form.Item>
        <Form.Item label="Was hospitalized ?" style={{ width: "80%" }}>
          <Input
            placeholder="input placeholder"
            value={data.was_hospitalized}
            disabled
          />
        </Form.Item>
        <Divider />
        <p style={{ fontWeight: "bold", marginBottom: "5%" }}>
          Supporting Lab Findings
        </p>
        <div style={{ width: "80%" }}>
          <Image.PreviewGroup>
            {data?.medical_file?.map((item) => {
              return (
                <Image
                  width={100}
                  height={100}
                  src={item.url}
                  style={{ marginHorizontal: "5%" }}
                  key={item.name}
                />
              );
            })}
          </Image.PreviewGroup>
        </div>

        <Divider />
        <p style={{ fontWeight: "bold", marginBottom: "5%" }}>Reporting</p>
        <Form.Item label="Reporting Site" style={{ width: "80%" }}>
          <Input
            disabled
            value={data.reporting_site}
            style={{ textTransform: "capitalize" }}
          />
        </Form.Item>
        <Form.Item label="Reporting Date" style={{ width: "80%" }}>
          <Input disabled value={moment(data.reporting_date).format("LL")} />
        </Form.Item>
      </Form>
    </Modal>
  );
}

export default ViewModal;
