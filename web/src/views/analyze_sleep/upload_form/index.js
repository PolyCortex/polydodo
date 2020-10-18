import React from 'react';
import moment from 'moment';
import { Button, Container, CustomInput, Form, FormGroup, Label, Input, InputGroup, Col, Row, Alert } from 'reactstrap';
import { useForm } from 'react-hook-form';

import {
  ACCEPTED_FILE_EXTENSION,
  ACCEPTED_FILE_TYPE,
  DEVICES,
  MAX_AGE,
  MAX_FILE_UPLOAD_SIZE,
  MIN_AGE,
} from './constants';

import './style.css';
import useGlobalState from 'hooks/useGlobalState';

const dateFieldSuffix = '_date';
const timeFieldSuffix = '_time';

const filterInDateTimeFields = (data) =>
  Object.keys(data)
    .filter((field) => field.endsWith(timeFieldSuffix))
    .map((field) => field.replace(timeFieldSuffix, ''));

const filterOutDateTimeFields = (data) =>
  Object.entries(data).filter(([name, value]) => !(name.endsWith(dateFieldSuffix) || name.endsWith(timeFieldSuffix)));

const mergeDateTimeFields = (data) =>
  filterInDateTimeFields(data).map((fieldPrefix) => [
    fieldPrefix,
    new Date(
      Object.entries(data)
        .filter(([fieldName, value]) => fieldName.startsWith(fieldPrefix))
        .map(([fieldName, value]) => value)
        .join(' '),
    ).getTime(),
  ]);

const UploadForm = () => {
  const { register, handleSubmit, getValues, errors } = useForm();
  const [postFormError, setPostFormError] = useGlobalState('postFormError');
  const [, setSubmittedFormData] = useGlobalState('submittedFormData');

  return (
    <Container style={{ padding: '2em 0' }}>
      <Row>
        <Col sm="12" md={{ size: 8, offset: 2 }}>
          <Form
            onSubmit={handleSubmit((data) => {
              let formData = Object.fromEntries([...filterOutDateTimeFields(data), ...mergeDateTimeFields(data)]);
              formData = { ...formData, file: formData.file[0] };
              setSubmittedFormData(formData);
            })}
          >
            <h3 className="upload-form__file-input-title">Select or drop your recorded EEG file</h3>
            <div>
              <CustomInput
                innerRef={register({
                  required: 'A valid .txt raw EEG file must be selected.',
                  validate: (files) => {
                    const file = files[0];
                    if (file.type !== ACCEPTED_FILE_TYPE || !file.name.endsWith(ACCEPTED_FILE_EXTENSION)) {
                      return 'A valid .txt raw OpenBCI EEG file must be selected.';
                    } else if (file.size >= MAX_FILE_UPLOAD_SIZE) {
                      return 'File is too large. Must be less than 1.6 Gb.';
                    }
                  },
                })}
                bsSize="lg"
                accept=".txt, text/plain"
                type="file"
                id="file"
                name="file"
                label={
                  <div>
                    <i className="ni ni-cloud-upload-96 upload-form__file-input" />
                    <span className="upload-form__file-input-label-text"> Upload your OpenBCI file </span>
                  </div>
                }
              />
              <div className="upload-form__error-text">{errors.file?.message}</div>
            </div>

            <h4 className="upload-form__journal-title">Journal</h4>
            <p>
              While recording your EEG data, you also gathered some informations about your device, yourself and your
              sleep:
            </p>
            <FormGroup>
              <Label for="openbci-device">OpenBCI device used</Label>
              <Row>
                <Col md={12}>
                  <CustomInput
                    innerRef={register({ required: 'A selection must be made.' })}
                    type="select"
                    id="openbci-device"
                    name="device"
                  >
                    <option defaultValue></option>
                    <option value={DEVICES.CYTON}>Cyton</option>
                    <option value={DEVICES.GANGLION}>Ganglion</option>
                  </CustomInput>
                  <div className="upload-form__error-text">{errors.device?.message}</div>
                </Col>
              </Row>
            </FormGroup>

            <Row form>
              <Col md={6}>
                <FormGroup inline>
                  <Label for="sex">Sex*</Label>
                  <CustomInput
                    innerRef={register({ required: 'A selection must be made.' })}
                    type="radio"
                    value="M"
                    id="male"
                    name="sex"
                    label="Male"
                  />
                  <CustomInput
                    innerRef={register({ required: 'A selection must be made.' })}
                    type="radio"
                    value="F"
                    id="female"
                    name="sex"
                    label="Female"
                  />
                  <div className="upload-form__error-text">{errors.sex?.message}</div>
                </FormGroup>
              </Col>
              <Col md={6}>
                <FormGroup>
                  <Label for="age">Age*</Label>
                  <Input
                    innerRef={register({
                      required: 'A number must be provided',
                      min: { value: MIN_AGE, message: 'Please provide a positive integer' },
                      max: { value: MAX_AGE, message: 'Age cannot be more than 125 y/o' },
                    })}
                    type="number"
                    name="age"
                    id="age"
                    placeholder="Enter your age"
                  />
                  <div className="upload-form__error-text">{errors.age?.message}</div>
                </FormGroup>
              </Col>
            </Row>

            <div>
              <Row form>
                <Col md={12}>
                  <FormGroup>
                    <Label>The recording started at : </Label>
                    <InputGroup>
                      <Input
                        innerRef={register({
                          required: 'Date is required.',
                          validate: () => {
                            const streamStart = moment(
                              getValues('stream_start_date') + ' ' + getValues('stream_start_time'),
                              'YYYY-MM-DD HH:mm',
                            );
                            const bedTime = moment(
                              getValues('bedtime_date') + ' ' + getValues('bedtime_time'),
                              'YYYY-MM-DD HH:mm',
                            );
                            if (streamStart.isAfter(bedTime)) {
                              return 'Stream start must be prior to bedtime.';
                            }
                          },
                        })}
                        type="date"
                        name={`stream_start${dateFieldSuffix}`}
                        id={`stream_start${dateFieldSuffix}`}
                      />
                      <Input
                        innerRef={register({ required: 'Time is required.' })}
                        type="time"
                        name={`stream_start${timeFieldSuffix}`}
                        id={`stream_start${timeFieldSuffix}`}
                      />
                    </InputGroup>
                    <div className="upload-form__error-text">
                      {errors.stream_start_date?.message}
                      <br />
                      {errors.stream_start_time?.message}
                    </div>
                  </FormGroup>
                </Col>
              </Row>
              <Row form>
                <Col md={6}>
                  <FormGroup>
                    <Label>I went to bed at :</Label>
                    <InputGroup>
                      <Input
                        innerRef={register({
                          required: 'Date is required.',
                          validate: (_) => {
                            const bedtime = moment(
                              getValues('bedtime_date') + ' ' + getValues('bedtime_time'),
                              'YYYY-MM-DD HH:mm',
                            );
                            const wakeup = moment(
                              getValues('wakeup_date') + ' ' + getValues('wakeup_time'),
                              'YYYY-MM-DD HH:mm',
                            );
                            if (bedtime.isAfter(wakeup)) {
                              return 'Bedtime must be prior to wake up.';
                            }
                          },
                        })}
                        type="date"
                        name={`bedtime${dateFieldSuffix}`}
                        id={`bedtime${dateFieldSuffix}`}
                      />
                      <Input
                        innerRef={register({ required: 'Time is required.' })}
                        type="time"
                        name={`bedtime${timeFieldSuffix}`}
                        id={`bedtime${timeFieldSuffix}`}
                      />
                    </InputGroup>
                    <div className="upload-form__error-text">
                      {errors.bedtime_date?.message}
                      <br />
                      {errors.bedtime_time?.message}
                    </div>
                  </FormGroup>
                </Col>
                <Col md={6}>
                  <FormGroup>
                    <Label>And woke up at :</Label>
                    <InputGroup>
                      <Input
                        innerRef={register({
                          required: 'Date is required.',
                          validate: (_) => {
                            const wakeup = moment(
                              getValues('wakeup_date') + ' ' + getValues('wakeup_time'),
                              'YYYY-MM-DD HH:mm',
                            );
                            if (wakeup.isAfter(moment())) {
                              return 'Wake up must be prior to now.';
                            }
                          },
                        })}
                        type="date"
                        name={`wakeup${dateFieldSuffix}`}
                        id={`wakeup${dateFieldSuffix}`}
                      />
                      <Input
                        innerRef={register({ required: 'Time is required.' })}
                        type="time"
                        name={`wakeup${timeFieldSuffix}`}
                        id={`wakeup${timeFieldSuffix}`}
                      />
                    </InputGroup>
                    <div className="upload-form__error-text">
                      {errors.wakeup_date?.message}
                      <br />
                      {errors.wakeup_time?.message}
                    </div>
                  </FormGroup>
                </Col>
              </Row>
            </div>

            <Row className="justify-content-center">
              <Button
                block
                size="lg"
                className="btn btn-lg mt-4 w-50"
                color="primary"
                type="submit"
                onClick={() => setPostFormError(null)}
              >
                Analyze my sleep
              </Button>
            </Row>
            {postFormError && (
              <Row className="justify-content-center">
                <Alert color="danger" size="lg" className="mt-4">
                  <span>
                    <strong>An occured while processing your file...</strong>
                    <br />
                    Make sure you uploaded the correct file. Perhaps the information you entered in your journal does
                    not match the file provided.
                  </span>
                </Alert>
              </Row>
            )}
          </Form>
        </Col>
      </Row>
      <hr />
      <small className="text-muted">
        * Your age and sex are used to improve the quality of our prediction. Age and sex are features that have a
        significant impact on sleep.
      </small>
    </Container>
  );
};

export default UploadForm;
