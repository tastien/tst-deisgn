import { MinusCircleOutlined, PlusOutlined } from '@ant-design/icons';
import { Button, Form, FormItemProps, TimePicker } from 'antd';
import _ from 'lodash';
import * as React from 'react';

import './style.less';

interface TimeIntervalProps {
  supportNextDay?: boolean;
  disabled?: boolean;
  maxCount?: number;
  formItemProps?: FormItemProps;
  addButtonName?: string;
}

const CustomTimePicker = (props: {
  value?: [any, any];
  onChange?: (value: [any, any]) => void;
}) => {
  const { value, onChange } = props;
  const [start, end] = value || [];
  const isTomorrow = React.useMemo(() => {
    if (!start || !end) return false;
    return !start.isBefore(end, 'minute');
  }, [start, end]);

  return (
    <div style={{ display: 'inline-block' }}>
      <TimePicker
        style={{ width: 140, marginRight: 16 }}
        value={start}
        format="HH:mm"
        onChange={(v) => {
          onChange?.([v, end]);
        }}
      />
      {isTomorrow && (
        <span id="supportNextDay" style={{ marginRight: 5 }}>
          次日
        </span>
      )}
      <TimePicker
        style={{ width: 140 }}
        value={end}
        format="HH:mm"
        onChange={(v) => {
          onChange?.([start, v]);
        }}
      />
    </div>
  );
};

const defaultFormItemProps = {
  name: 'openTimes',
};

const TimeInterval = React.memo<TimeIntervalProps>(
  ({
    supportNextDay,
    disabled,
    formItemProps,
    maxCount = 3,
    addButtonName = '新增时段',
  }) => {
    const name = formItemProps?.name || defaultFormItemProps.name;

    return (
      <Form.Item
        label={formItemProps?.label}
        required={formItemProps?.required}
        labelCol={formItemProps?.labelCol}
        wrapperCol={formItemProps?.wrapperCol}
      >
        <Form.List name={name}>
          {(fields, { add, remove }, { errors }) => (
            <>
              {fields.map((field) => {
                return (
                  <Form.Item
                    key={field.key}
                    wrapperCol={{ span: 24 }}
                    style={formItemProps?.style}
                  >
                    <Form.Item
                      {...field}
                      validateTrigger={['onChange', 'onBlur']}
                      rules={[{ required: true, message: '请选择时段' }]}
                      noStyle
                      wrapperCol={{ span: 12 }}
                      {..._.omit(formItemProps, 'label', 'name', 'required')}
                    >
                      {supportNextDay ? (
                        <CustomTimePicker />
                      ) : (
                        <TimePicker.RangePicker
                          style={{
                            width: 280,
                          }}
                          format="HH:mm"
                          disabled={disabled}
                        />
                      )}
                    </Form.Item>
                    {fields.length >= 1 && !disabled ? (
                      <MinusCircleOutlined
                        style={{ fontSize: 16 }}
                        className="tst-dynamic-delete-button"
                        onClick={() => remove(field.name)}
                      />
                    ) : null}
                  </Form.Item>
                );
              })}
              <Form.Item
                noStyle
                dependencies={[name]}
                wrapperCol={{ span: 12 }}
              >
                {({ getFieldValue }) => {
                  const times = getFieldValue(name);
                  return (
                    (!times || times.length < maxCount) && (
                      <Form.Item className="tst-time-interval-add-button">
                        <Button
                          type="link"
                          onClick={() => !disabled && add()}
                          icon={<PlusOutlined />}
                          disabled={disabled}
                          style={{ padding: 0 }}
                        >
                          {`${addButtonName}（最多允许${maxCount}个）`}
                        </Button>
                        {formItemProps?.required && (
                          <Form.ErrorList errors={errors} />
                        )}
                      </Form.Item>
                    )
                  );
                }}
              </Form.Item>
            </>
          )}
        </Form.List>
      </Form.Item>
    );
  },
);

export default TimeInterval;
