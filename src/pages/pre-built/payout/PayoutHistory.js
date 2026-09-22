import React from 'react'
import Head from '../../../layout/head/Head'
import Content from '../../../layout/content/Content'
import { Block, BlockBetween, BlockDes, BlockHead, BlockHeadContent, BlockTitle, PreviewCard, ReactDataTable } from '../../../components/Component'
import { dataTableColumns2 } from '../../components/table/TableData'
import { userData } from '../user-manage/UserData'

function PayoutHistory() {
    return (
        <>
            <Head title="Payout Requests"></Head>
            <Content>
                <BlockHead size="sm">
                    <BlockBetween>
                        <BlockHeadContent>
                            <BlockTitle tag="h3" page>
                                Payout Requests
                            </BlockTitle>
                            <BlockDes className="text-soft">
                                <p>You have total 2,595 Requests.</p>
                            </BlockDes>
                        </BlockHeadContent>
                    </BlockBetween>
                </BlockHead>

                <Block size="lg">
                    <PreviewCard>
                        <ReactDataTable
                            data={userData}
                            columns={dataTableColumns2}
                            pagination
                            className="nk-tb-list"
                            selectableRows
                        />
                    </PreviewCard>
                </Block>
            </Content>
        </>
    )
}

export default PayoutHistory;
