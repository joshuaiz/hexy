import React from 'react'
import Questions from './Questions'
import '../ScrollToTop'
import './FAQ.scss'
import ScrollToTop from '../ScrollToTop'

const FAQ = () => {
    return (
        <div className="faq">
            <ScrollToTop />
            <h1>FAQ - Frequently Asked Questions</h1>
            <Questions />
        </div>
    )
}

export default FAQ
