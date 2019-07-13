import React from 'react'
import { withRouter, Link } from 'react-router-dom'
import './Terms.scss'

const Terms = () => {
    return (
        <div className="terms">
            <h1>Hexy Terms of Use</h1>

            <p>
                <em>Last updated 07 July 2019</em>.
            </p>

            <p>
                By using the hexy.io web site/Hexy ("Service"), or any services
                of studio.bio Creative LLC, you are agreeing to be bound by the
                following terms and conditions ("Terms").
            </p>

            <h2>General Terms</h2>
            <ol>
                <li>
                    <p>
                        Where required by law, you must be over 13 years of age
                        to use this Service.
                    </p>
                </li>
                <li>
                    <p>
                        The Service is provided "as-is" with no warranties or
                        guarantees at your sole risk. Additional features may be
                        unlocked by getting a Hexy account. Some features
                        require a paid account. See Hexy{' '}
                        <Link to="/pro">Account levels and pricing</Link>.
                    </p>
                </li>
                <li>
                    <p>
                        Hexy uses third-party vendors and hosting partners to
                        provide the necessary hardware, software, networking,
                        storage, and related technology required to run the
                        Service. Hexy disclaims all liability and shall be held
                        harmless for any fault or failure of third party vendors
                        beyond the control of Hexy, studio.bio Creative LLC, its
                        agents and representatives.
                    </p>
                </li>
                <li>
                    <p>
                        <strong>
                            Hexy does not warrant that (i) the Service will meet
                            your specific requirements, (ii) the Service will be
                            uninterrupted, timely, secure, or error-free, (iii)
                            the results that may be obtained from the use of the
                            Service will be accurate or reliable, (iv) the
                            quality of any products, services, information, or
                            other material purchased or obtained by you through
                            the Service will meet your expectations, and (v) any
                            errors in the Service will be corrected. You
                            expressly understand and agree that Hexy shall not
                            be liable for any direct, indirect, incidental,
                            special, consequential or exemplary damages,
                            including but not limited to, damages for loss of
                            profits, goodwill, use, data or other intangible
                            losses (even if Hexy has been advised of the
                            possibility of such damages), resulting from: (i)
                            the use or the inability to use the Service; (ii)
                            the cost of procurement of substitute goods and
                            services resulting from any goods, data, information
                            or services purchased or obtained or messages
                            received or transactions entered into through or
                            from the Service; (iii) unauthorized access to or
                            alteration of your transmissions or data; (iv)
                            statements or conduct of any third-party on the
                            Service; (v) or any other matter relating to the
                            Service.
                        </strong>
                    </p>
                </li>
                <li>
                    <p>
                        You understand that the technical processing and
                        transmission of the Service, including your Content, may
                        be transferred unencrypted and involve (a) transmissions
                        over various networks; and (b) changes to conform and
                        adapt to technical requirements of connecting networks
                        or devices.
                    </p>
                </li>
                <li>
                    <p>
                        Posting "spam" content, solicitations, external links,
                        viruses, malware, worms, scripts or any unauthorized
                        content is explicity prohibited.
                    </p>
                </li>
            </ol>

            <h2>Account Terms</h2>
            <ol>
                <li>
                    <p>
                        The Service is for human accounts only. "Bot" or
                        automated accounts are not permitted.
                    </p>
                </li>
                <li>
                    <p>
                        You may use the Service for free however an account is
                        required to unlock additional features. To create an
                        account, you must have a valid email address and
                        password. <Link to="/pro">Pro accounts</Link> are paid
                        accounts and require a yearly fee.
                    </p>
                </li>
                <li>
                    <p>
                        It is the responsibility of the account holder (you) to
                        maintain the security of your login credentials. Hexy
                        will not and cannot be responsible for any loss or
                        damage due to your failure to protect your account and
                        login information.
                    </p>
                </li>
                <li>
                    <p>
                        You may not use the Service for any illegal or
                        unauthorized purpose.
                    </p>
                </li>

                <li>
                    <p>
                        The Service features user-generated content and you are
                        responsible for all activity that occurs under your
                        account. Profanity, hate speech, aggression, or other
                        forms of negative content are explicity prohibited and
                        will get you banned from The Service. Please don't be a
                        jerk.
                    </p>
                </li>
                <li>
                    <p>
                        Hexy accounts and account features are provided "as-is"
                        with no warranties or guarantees. Features may be added
                        or removed at any time for any reason at the sole
                        discretion of Hexy. If a feature is set for removal, we
                        will make all reasonable efforts to maintain the use of
                        that feature for current account holders until their
                        current account period expires. Any part of the Service
                        may be modified, discontinued, or suspended at any time
                        with or without warning.
                    </p>
                    <p>
                        Hexy shall not be liable to you or to any third-party
                        for any modification, suspension or discontinuance of
                        the Service or any features therein.
                    </p>
                </li>
            </ol>

            <h2>Hexy Pro (paid) Accounts</h2>
            <ol>
                <li>
                    <p>
                        Pro (paid) accounts are not automatically renewed. You
                        will be sent a reminder email before your Pro account
                        will expire.
                    </p>
                </li>
                <li>
                    <p>
                        Pro accounts require a yearly fee paid by credit card
                        securely through{' '}
                        <a
                            href="https://www.stripe.com/"
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            Stripe
                        </a>
                        . We do not store any credit card data on our servers
                        and any personal data collected is bound by our{' '}
                        <Link to="/privacy-policy">Privacy Policy</Link>.
                    </p>
                </li>
            </ol>

            <h2>Cancellation & Termination</h2>
            <ol>
                <li>
                    <p>
                        You may cancel/terminate your account at any time by
                        emailing{' '}
                        <a href="mailto:accounts@hexy.io">accounts@hexy.io</a>.
                    </p>
                </li>
                <li>
                    <p>
                        Once your account is cancelled/terminated, all account
                        data including saved palettes, favorites, and any other
                        content associated with your account will be deleted
                        permanently and immediately.{' '}
                        <strong>
                            Please make sure you have exported all of your
                            private palettes before cancelling — you will not be
                            able to retrieve these later.
                        </strong>
                    </p>
                </li>

                <li>
                    <p>
                        Hexy reserves the right to suspend or terminate your
                        account and refuse any and all current or future use of
                        the Service, or any other Hexy service, for any reason
                        at any time. Such termination of the Service will result
                        in the deactivation or deletion of your Account or your
                        access to your Account, and the forfeiture and
                        relinquishment of all Content in your Account. Hexy
                        reserves the right to refuse service to anyone for any
                        reason at any time.
                    </p>
                    <p>
                        In the event that Hexy takes action to suspend or
                        terminate an account, we will make a reasonable effort
                        to provide the affected account owner with a copy of
                        their account contents upon request, unless the account
                        was suspended or terminated due to unlawful conduct.
                    </p>
                </li>
            </ol>

            <h2>Provisions</h2>
            <ol>
                <li>
                    <p>
                        The failure of Hexy to exercise or enforce any right or
                        provision of these Terms shall not constitute a waiver
                        of such right or provision.
                    </p>
                </li>
                <li>
                    <p>
                        These Terms constitute the entire agreement between you
                        and Hexy and govern your use of the Service, superseding
                        any prior agreements between you and Hexy (including,
                        but not limited to, any prior versions of the Terms).
                        You agree that these Terms and your use of the Service
                        are governed under Illinois law.
                    </p>
                </li>
            </ol>

            <p>
                Questions about these Terms should be sent to support@hexi.io.
            </p>
        </div>
    )
}

export default withRouter(Terms)
