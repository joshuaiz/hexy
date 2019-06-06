import React from 'react'
import { withRouter } from 'react-router-dom'
import PriceTable from './PriceTable'
import './GoPro.scss'

const GoPro = () => {
    return (
        <div className="gopro">
            <h1 className="page-title">Hexy Accounts</h1>
            <PriceTable />
        </div>
    )
}

export default withRouter(GoPro)
