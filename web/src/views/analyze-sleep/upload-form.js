import React, { useState } from 'react';
import _ from 'lodash';
import { Button, Container, CustomInput, Form, FormGroup, Label, Input, InputGroup, Col, Row, Alert } from 'reactstrap';
import { useForm } from 'react-hook-form';
import { analyzeSleep } from 'requests/analayze-sleep';

import './style.css';

const dateFieldSuffix = '-date';
const timeFieldSuffix = '-time';

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

const onSubmit = async (data) => {
  let formData = Object.fromEntries([...filterOutDateTimeFields(data), ...mergeDateTimeFields(data)]);
  formData = { ...formData, file: formData.file[0] };
  try {
    const results = await analyzeSleep(formData).toPromise();
    console.log(results);
  } catch (error) {
    console.error(error);
  }
};

const UploadForm = () => {
  const { register, handleSubmit, errors } = useForm();
  const { state, setState } = useState();

  return (
    <Container style={{ padding: '2em 0' }}>
      <Row>
        <Col sm="12" md={{ size: 8, offset: 2 }}>
          <Form onSubmit={handleSubmit(onSubmit)}>
            <h3 className="upload-form__file-input-title">Select or drop your recorded EEG file</h3>
            <div>
              <CustomInput
                innerRef={register({
                  required: 'A valid .txt raw EEG file must be selected.',
                  validate: (files) => {
                    const file = files[0];
                    if (file.type !== 'text/plain' || _.last(file.name.split('.')) !== 'txt') {
                      return 'A valid .txt raw OpenBCI EEG file must be selected.';
                    } else if (file.size >= 1.6e9) {
                      return 'File is too large. Must be less than 1.6 Gb.';
                    }
                  },
                })}
                bsSize="lg"
                accept=".txt, text/plain"
                type="file"
                id="file"
                name="file"
                className="test"
                label={
                  <div>
                    <i className="ni ni-cloud-upload-96 upload-form__file-input" />
                    <span className="upload-form__file-input-label-text"> Upload your OpenBCI file </span>
                  </div>
                }
              />
              <div className="upload-form__file-input-error-text">{errors.file?.message}</div>
            </div>

            {/* <h4 className="upload-form__journal-title">Journal</h4>
            <p>
              While recording your EEG data, you also gathered some informations about your device, yourself and your
              sleep:
            </p>
            <FormGroup>
              <Label for="openbci-device">OpenBCI device used</Label>
              <Row>
                <Col md={12}>
                  <CustomInput innerRef={register} required type="select" id="openbci-device" name="device">
                    <option>Cython</option>
                    <option>Ganglion</option>
                  </CustomInput>
                </Col>
              </Row>
            </FormGroup>

            <Row form>
              <Col md={6}>
                <FormGroup inline>
                  <Label for="sex">Sex*</Label>
                  <CustomInput required type="radio" id="male" name="sex" label="Male" />
                  <CustomInput required type="radio" id="female" name="sex" label="Female" />
                </FormGroup>
              </Col>
              <Col md={6}>
                <FormGroup>
                  <Label for="age">Age*</Label>
                  <Input
                    innerRef={register}
                    required
                    type="number"
                    name="age"
                    id="age"
                    min="0"
                    max="125"
                    placeholder="Enter your age"
                  />
                </FormGroup>
              </Col>
            </Row>

            <div>
              <Row form>
                <Col md={12}>
                  <FormGroup>
                    <Label>Time when OpenBCI stream started</Label>
                    <InputGroup>
                      <Input
                        innerRef={register}
                        required
                        type="date"
                        name={`stream_start${dateFieldSuffix}`}
                        id={`stream_start${dateFieldSuffix}`}
                        min={''}
                        max={''}
                        onChange={(e) => console.log(`${e.target.value}`)}
                      />
                      <Input
                        innerRef={register}
                        required
                        type="time"
                        name={`stream_start${timeFieldSuffix}`}
                        id={`stream_start${timeFieldSuffix}`}
                        min={''}
                        max={''}
                        onChange={(e) => console.log(`${e.target.value}`)}
                      />
                    </InputGroup>
                  </FormGroup>
                </Col>
              </Row>
              <Row form>
                <Col md={6}>
                  <FormGroup>
                    <Label>I went to bed at</Label>
                    <InputGroup>
                      <Input
                        innerRef={register}
                        required
                        type="date"
                        name={`bedtime${dateFieldSuffix}`}
                        id={`bedtime${dateFieldSuffix}`}
                        min={''}
                        max={''}
                        onChange={(e) => console.log(`${e.target.value}`)}
                      />
                      <Input
                        innerRef={register}
                        required
                        type="time"
                        name={`bedtime${timeFieldSuffix}`}
                        id={`bedtime${timeFieldSuffix}`}
                        min={''}
                        max={''}
                        onChange={(e) => console.log(`${e.target.value}`)}
                      />
                    </InputGroup>
                  </FormGroup>
                </Col>
                <Col md={6}>
                  <FormGroup>
                    <Label>And woke up at</Label>
                    <InputGroup>
                      <Input
                        innerRef={register}
                        required
                        type="date"
                        name={`wakeup${dateFieldSuffix}`}
                        id={`wakeup${dateFieldSuffix}`}
                        min={''}
                        max={moment().format('YYYY-MM-DD')}
                        onChange={(e) => console.log(`${moment().format('YYYY-MM-DD')}`)}
                      />
                      <Input
                        innerRef={register}
                        required
                        type="time"
                        name={`wakeup${timeFieldSuffix}`}
                        id={`wakeup${timeFieldSuffix}`}
                        min={''}
                        max={moment().format('HH:mm:ss')}
                        onChange={(e) => console.log(`${e.target.value}`)}
                      />
                    </InputGroup>
                  </FormGroup>
                </Col>
              </Row>
            </div>*/}

            <span>
              <Button block size="lg" className="btn-lg" color="primary">
                Analyze my sleep
              </Button>
            </span>
          </Form>
        </Col>
      </Row>
      <hr />
      <small className="text-muted">
        * Your age and gender are used to improve the quality of our prediction. Age and sex are features that have a
        significant impact on sleep.
      </small>
    </Container>
  );
};

export default UploadForm;
