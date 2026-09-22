import React from 'react'
import { Button, Card, CardBody, Col, Row } from 'reactstrap'
import Content from '../../../layout/content/Content'
import Head from '../../../layout/head/Head'
import { Block, BlockBetween, BlockContent, BlockDes, BlockHead, BlockTitle } from '../../../components/Component'
import { useQuill } from 'react-quilljs'

function SendEmail() {

    const { quillRef } = useQuill();

    return (
        <>
            <Head title="Email"></Head>
            <Content>
                <BlockHead size="sm">
                    <BlockBetween className="g-3">
                        <BlockContent>
                            <BlockTitle>Email</BlockTitle>
                            <BlockDes className="text-soft">
                                <p>Send email to all users.</p>
                            </BlockDes>
                        </BlockContent>
                    </BlockBetween>
                </BlockHead>
                <Block>
                    <Card className="card-bordered">
                        <CardBody className="card-inner">
                            <Row className="gy-4">
                            <Col md="12">
                                    <div className="form-group">
                                        <label className="form-label" htmlFor="subject">
                                            Email Address
                                        </label>
                                        <input
                                            type="email"
                                            id="email"
                                            name="email"
                                            className="form-control"
                                            placeholder='Paste Email Address Here...'
                                        />
                                    </div>
                                </Col>

                                <Col md="12">
                                    <div className="form-group">
                                        <label className="form-label" htmlFor="subject">
                                            Subject
                                        </label>
                                        <input
                                            type="text"
                                            id="subject"
                                            name="subject"
                                            className="form-control"
                                            placeholder='Write Subject Here...'
                                        />
                                    </div>
                                </Col>

                                <Col md="12">
                                    <div >
                                        <div ref={quillRef} />
                                    </div>
                                </Col>

                                <div class="col-sm-5 col-md-12 ms-auto">
                                    <Button color="light" className="me-2 btn-lg">Cancel</Button>
                                    <Button color="success" className="btn-lg">Send</Button>
                                </div>
                            </Row>
                        </CardBody>
                    </Card>
                </Block>
            </Content>
        </>
    )
}

export default SendEmail
