import React from 'react'
import { Link, NavLink, withRouter } from 'react-router-dom'
import SiteID from '../SiteID'
import './Footer.scss'

const Footer = ({ currentUser }) => {
    const year = new Date().getFullYear()

    return (
        <div className="footer">
            <div className="inner-footer">
                <div className="footer-columns">
                    <SiteID />
                    <nav className="footer-nav">
                        <NavLink to="/colors">Colors</NavLink>
                        <NavLink to="/palettes">Palettes</NavLink>
                        <NavLink to="/pro">Go Pro</NavLink>
                        <NavLink to="/faq">FAQ</NavLink>
                        <NavLink to="/contact">Contact Us</NavLink>
                    </nav>
                    <div className="footer-social-links">
                        <ul className="nostyle social-links">
                            <li>
                                <a
                                    href="https://github.com/joshuaiz/hexy2"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                >
                                    <svg
                                        id="Layer_1"
                                        xmlns="http://www.w3.org/2000/svg"
                                        width="100"
                                        height="100"
                                        viewBox="0 0 100 100"
                                    >
                                        <path
                                            className="st0"
                                            d="M50.6,3.3C24,3.3,2.4,24.9,2.4,51.5c0,21.3,13.8,39.4,33,45.8c2.4,0.4,3.3-1,3.3-2.3c0-1.1,0-4.2-0.1-8.2	c-13.4,2.9-16.3-6.5-16.3-6.5c-2.2-5.6-5.4-7.1-5.4-7.1c-4.4-3,0.3-2.9,0.3-2.9c4.8,0.3,7.4,5,7.4,5c4.3,7.4,11.3,5.2,14,4	c0.4-3.1,1.7-5.2,3.1-6.5c-10.7-1.2-22-5.4-22-23.8c0-5.3,1.9-9.6,5-12.9c-0.5-1.2-2.2-6.1,0.5-12.8c0,0,4.1-1.3,13.3,4.9	c3.8-1.1,8-1.6,12.1-1.6c4.1,0,8.2,0.6,12.1,1.6c9.2-6.2,13.3-4.9,13.3-4.9c2.6,6.6,1,11.5,0.5,12.8c3.1,3.4,5,7.7,5,12.9	c0,18.5-11.3,22.6-22,23.8c1.7,1.5,3.3,4.4,3.3,8.9c0,6.5-0.1,11.7-0.1,13.2c0,1.3,0.9,2.8,3.3,2.3c19.2-6.4,33-24.5,33-45.8	C98.9,24.9,77.3,3.3,50.6,3.3z"
                                        />
                                    </svg>
                                </a>
                            </li>
                            <li>
                                <a
                                    href="https://studio.bio"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                >
                                    <svg
                                        id="Layer_1"
                                        xmlns="http://www.w3.org/2000/svg"
                                        width="100"
                                        height="100"
                                        viewBox="0 0 100 100"
                                    >
                                        <path
                                            className="st0"
                                            d="M63.2,26.3C53.1,26.3,45,34.4,45,44.5s8.2,18.2,18.2,18.2s18.2-8.2,18.2-18.2S73.2,26.3,63.2,26.3z M63.2,53.1c-4.8,0-8.6-3.9-8.6-8.6s3.9-8.6,8.6-8.6s8.6,3.9,8.6,8.6S67.9,53.1,63.2,53.1z"
                                        />
                                        <path
                                            className="st0"
                                            d="M49.6,95.9c-12.3,0-23.8-4.8-32.5-13.5C8.5,73.8,3.7,62.2,3.7,50s4.8-23.8,13.5-32.5S37.3,4,49.6,4 c12.3,0,23.8,4.8,32.5,13.5S95.5,37.7,95.5,50s-4.8,23.8-13.5,32.5C73.4,91.1,61.9,95.9,49.6,95.9z M49.6,6.9 c-11.5,0-22.3,4.5-30.5,12.6C11,27.6,6.5,38.4,6.5,50S11,72.3,19.1,80.4c8.1,8.1,19,12.6,30.5,12.6s22.3-4.5,30.5-12.6 c8.1-8.1,12.6-19,12.6-30.5s-4.5-22.3-12.6-30.5C71.9,11.4,61.1,6.9,49.6,6.9z"
                                        />
                                        <path
                                            className="st0"
                                            d="M47.6,94.4c1.4-3.7,2.2-7.7,2.2-11.9c0-18.1-14.7-32.7-32.7-32.7c-4.2,0-8.2,0.8-11.9,2.2 c0.3,6.1,1.8,11.8,4.2,17c2.3-1.3,4.9-2,7.7-2c8.6,0,15.5,6.9,15.5,15.5c0,2.8-0.7,5.4-2,7.6C35.8,92.6,41.5,94.1,47.6,94.4z"
                                        />
                                        <circle
                                            className="st0"
                                            cx="28.9"
                                            cy="29.7"
                                            r="6.1"
                                        />
                                    </svg>
                                </a>
                            </li>
                        </ul>
                    </div>
                    <div className="email-capture">
                        <h3>Get cool Hexy color news in your inbox.</h3>
                        <form name="email" method="post">
                            <input
                                type="hidden"
                                name="form-name"
                                value="email"
                            />

                            <label htmlFor="email">Email</label>
                            <input
                                type="email"
                                name="email"
                                placeholder="you@youremail.com"
                            />
                            <p className="small">
                                We won't spam or sell or share your email with
                                anyone. Ever.
                            </p>
                            <button className="button" type="submit">
                                Send
                            </button>
                        </form>
                    </div>
                </div>

                <div className="copyright">
                    <p>
                        © {year}{' '}
                        <a
                            href="https://studio.bio/"
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            studio.bio Creative LLC
                        </a>
                        . All rights reserved.{' '}
                        <Link to="/terms">Terms of Use</Link>&nbsp;|&nbsp;
                        <Link to="/privacy-policy">Privacy Policy</Link>
                    </p>
                </div>
            </div>
        </div>
    )
}

export default withRouter(Footer)
