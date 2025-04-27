import React, { useState, useEffect, forwardRef, useImperativeHandle } from 'react';
import { createEvent, updateEvent } from '../services/event';
import {
  ModalForm,
  ProFormDateTimeRangePicker,
  ProFormSelect,
  ProFormText,
} from '@ant-design/pro-components';
import { Button, Form, message } from 'antd';
import { PlusOutlined } from '@ant-design/icons';

const EventTypes = ['Merger', 'Dividends', 'New Capital', 'Hire'];

const EventForm = forwardRef(({ refreshEvents, current = {}, clearCurrentEvent }, ref) => {
  const [form] = Form.useForm();
  const [visible, setVisible] = useState(false);

  // Display modal based on other components actions
  useImperativeHandle(ref, () => ({
    openModal: () => setVisible(true),
  }));

  // Create/update events
  const handleSubmit = async (values) => {
    let func = createEvent
    if (current.id) {
      func = updateEvent
      values.id = current.id
    }
    try {
      const event = await func(values)
      if (event) {
        await func(values);
        message.success(<b>Successfully {current.id ? 'updated' : 'created'} event!</b>);
        refreshEvents();
        setVisible(false);
        form.resetFields();
        return true;
      }
    } catch (err) {
      if (err.message) message.error(<b>{err.messsage}</b>)
    }
  };

  // Set initial values for form
  useEffect(() => {
    if (visible) {
      if (current?.id) {
        form.setFieldsValue({
          title: current.title,
          type: current.type,
          eventTime: current.eventTime,
        });
      } else {
        form.resetFields();
      }
    }
  }, [current, form, visible]);

  
  return (
    <>
      <Button
        onClick={() => setVisible(true)}
        type="primary"
        icon={<PlusOutlined />}
      >
        Add New Event
      </Button>
      <ModalForm
        title={`${current?.id ? 'Updating' : 'Create' } Event`}
        open={visible}
        form={form}
        onOpenChange={setVisible}
        autoFocusFirstInput
        modalProps={{
          okText: "Confirm",
          cancelText: "Cancel",
          destroyOnClose: true,
          onCancel: () => {
            form.resetFields();
            clearCurrentEvent();
            setVisible(false);
          },
        }}
        onFinish={handleSubmit}
      >
        <ProFormText
          name="title"
          label="Title"
          required
          placeholder="Please type title"
        />
        <ProFormSelect
          width="md"
          options={EventTypes.map(type => ({ value: type, label: type }))}
          name="type"
          label="Type"
          required
          placeholder="Please select type"
        />
        <ProFormDateTimeRangePicker
          showTime={{ format: 'HH:mm' }}
          format="YYYY-MM-DD HH:mm"
          name="eventTime"
          label="Start - End"
          required
          placeholder="Please choose date"
        />
      </ModalForm>
    </>
  );
});

export default EventForm;