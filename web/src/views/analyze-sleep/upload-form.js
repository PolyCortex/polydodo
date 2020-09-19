import React from 'react';
import { Button, Container, CustomInput, Form, FormGroup, Label, Input, InputGroup, Col, Row } from 'reactstrap';
import { useForm } from 'react-hook-form';

const dateFieldSuffix = '-date';
const timeFieldSuffix = '-time';

const filterInDateTimeFields = (data) =>
  Object.keys(data)
    .filter((field) => field.endsWith(timeFieldSuffix))
    .map((field) => field.replace(timeFieldSuffix, ''));

const filterOutDateTimeFields = (data) =>
  Object.entries(data).filter(([fieldName, value]) => !(fieldName.endsWith(dateFieldSuffix) || fieldName.endsWith(timeFieldSuffix)));

const mergeDateTimeFields = (data) =>
  filterInDateTimeFields(data).map((fieldPrefix) => [
    fieldPrefix,
    new Date(
      Object.entries(data)
        .filter(([fieldName, value]) => fieldName.startsWith(fieldPrefix))
        .map(([fieldName, value]) => value)
        .join(' '),
    ),
  ]);

const UploadForm = () => {
  const { register, handleSubmit } = useForm();
  const onSubmit = (data) => {
    const newFormData = Object.fromEntries([...filterOutDateTimeFields(data), ...mergeDateTimeFields(data)]);
    console.log(newFormData);
  };

  return (
    <Container style={{ padding: '2em 0' }}>
      <Row>
        <Col sm="12" md={{ size: 8, offset: 2 }}>
          <Form onSubmit={handleSubmit(onSubmit)}>
            <h3>Please enter your EEG recorded data and the information related to it:</h3>

            <CustomInput
              innerRef={register}
              required
              accept=".csv, text/plain"
              bsSize="lg"
              type="file"
              id="openbci-file"
              name="openbci-file"
              label="Upload an OpenBCI CSV file"
            />

            <FormGroup>
              <Label for="openbci-device">OpenBCI device</Label>
              <Row>
                <Col md={6}>
                  <CustomInput innerRef={register} required type="select" id="openbci-device" name="device">
                    <option></option>
                    <option>Cython</option>
                    <option>Ganglion</option>
                  </CustomInput>
                </Col>
              </Row>
            </FormGroup>

            <FormGroup inline>
              <Label>Name</Label>
              <Row form>
                <Col md={6}>
                  <Input innerRef={register} required type="text" name="firstName" id="firstName" placeholder="First name" />
                </Col>
                <Col md={6}>
                  <Input innerRef={register} required type="text" name="lastName" id="lastName" placeholder="Last name" />
                </Col>
              </Row>
            </FormGroup>

            <Row form>
              <Col md={6}>
                <FormGroup inline>
                  <Label for="sex">Sex</Label>
                  <CustomInput required type="radio" id="male" name="sex" label="Male" />
                  <CustomInput required type="radio" id="female" name="sex" label="Female" />
                </FormGroup>
              </Col>
              <Col md={6}>
                <FormGroup>
                  <Label for="age">Age</Label>
                  <Input innerRef={register} required type="number" name="age" id="age" min="0" max="125" placeholder="Enter your age" />
                </FormGroup>
              </Col>
            </Row>

            <div>
              <Row form>
                <Col md={6}>
                  <FormGroup>
                    <Label>Time when OpenBCI stream started</Label>
                    <InputGroup>
                      <Input innerRef={register} required type="date" name={`stream-start${dateFieldSuffix}`} id={`stream-start${dateFieldSuffix}`} />
                      <Input innerRef={register} required type="time" name={`stream-start${timeFieldSuffix}`} id={`stream-start${timeFieldSuffix}`} />
                    </InputGroup>
                  </FormGroup>
                </Col>
                <Col md={6}>
                  <FormGroup>
                    <Label>I went to bed at</Label>
                    <InputGroup>
                      <Input innerRef={register} required type="date" name={`bedtime${dateFieldSuffix}`} id={`bedtime${dateFieldSuffix}`} />
                      <Input innerRef={register} required type="time" name={`bedtime${timeFieldSuffix}`} id={`bedtime${timeFieldSuffix}`} />
                    </InputGroup>
                  </FormGroup>
                </Col>
              </Row>
              <Row form>
                <Col md={6}>
                  <FormGroup>
                    <Label>I think I fell asleep at</Label>
                    <InputGroup>
                      <Input innerRef={register} required type="date" name={`sleeping${dateFieldSuffix}`} id={`sleeping${dateFieldSuffix}`} />
                      <Input innerRef={register} required type="time" name={`sleeping${timeFieldSuffix}`} id={`sleeping${timeFieldSuffix}`} />
                    </InputGroup>
                  </FormGroup>
                </Col>
                <Col md={6}>
                  <FormGroup>
                    <Label>And woke up at</Label>
                    <InputGroup>
                      <Input innerRef={register} required type="date" name={`wakeup${dateFieldSuffix}`} id={`wakeup${dateFieldSuffix}`} />
                      <Input innerRef={register} required type="time" name={`wakeup${timeFieldSuffix}`} id={`wakeup${timeFieldSuffix}`} />
                    </InputGroup>
                  </FormGroup>
                </Col>
              </Row>
            </div>

            <Button size="lg" color="primary">
              Analyze my sleep
            </Button>
          </Form>
        </Col>
      </Row>
    </Container>
  );
};

export default UploadForm;
