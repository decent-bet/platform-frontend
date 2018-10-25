import * as React from 'react'
import PublicAppBar from '../common/components/PublicAppBar'
import styles from '../common/components/listStyles'
import {
    Card,
    CardHeader,
    CardContent,
    Typography,
    Button,
    withStyles
} from '@material-ui/core'

function TermsAndConditions(props) {
    return (
        <React.Fragment>
            <PublicAppBar title="DECENT.BET TERMS AND CONDITIONS" />
            <Card className={props.classes.card}>
                <CardHeader title="DECENT.BET TERMS AND CONDITIONS" />
                <CardContent>
                    <Typography
                        component="div"
                        align="justify"
                        className={props.classes.ulist}
                    >
                        <ul>
                            <li>
                                Please carefully read this agreement (the{' '}
                                <strong>"Agreement"</strong>) in its entirety
                                prior to your use of{' '}
                                <Button
                                    size="small"
                                    color="primary"
                                    href="http://decent.bet"
                                    target="_blank"
                                >
                                    www.decent.bet
                                </Button>{' '}
                                (the “Site”) because these terms affect your
                                obligations and legal rights. This Agreement
                                describes the terms and conditions applicable to
                                the Site, the games on the Site, and associated
                                services provided by DCNT Limited (“Decent”),
                                together with its subsidiaries and any holding
                                company of Decent and any subsidiary of such
                                holding company and any associated company with
                                Decent. If you (the <strong>"User"</strong> or{' '}
                                <strong>"you"</strong>) are not comfortable with
                                this Agreement, do not use the Site.
                            </li>
                            <li>
                                We reserve the right to revise this Agreement,
                                or any part thereof. By opening an account,
                                using the Site and playing the Games, you agree
                                to be bound by these conditions. This Agreement
                                constitutes a legally binding agreement between
                                you and Decent.
                            </li>
                            <li>
                                Decent offers real money games such as casino
                                games and sports betting (“Games”) on the Site
                                on the terms and conditions governing your play
                                on Games set out below. In addition to the terms
                                and conditions of this Agreement, please review
                                our Privacy Policy as well as the other rules,
                                policies and terms and conditions relating to
                                the games and promotions available on the Site
                                as posted on the Site from time to time, which
                                are incorporated herein by reference, together
                                with such other policies of which you may be
                                notified of by us from time to time.
                            </li>
                            <li>
                                By clicking the "I Agree" button below as part
                                of the application process and using the Site,
                                you consent to the terms and conditions set
                                forth in this Agreement.
                            </li>
                        </ul>
                    </Typography>
                    <Typography
                        component="div"
                        align="justify"
                        className={props.classes.olist}
                    >
                        <ol type="1">
                            <li>
                                <strong>YOUR ACCOUNT</strong>
                                <ol type="1">
                                    <li>
                                        <strong>Authority.</strong> Decent
                                        retains authority over the issuing,
                                        maintenance, and closing of Users'
                                        accounts on the Site. The decision of
                                        Decent, as regards to any aspect of a
                                        User's account, use of the Games and/or
                                        Site, or dispute resolution, is final
                                        and shall not be open to review or
                                        appeal. The User’s account will provide
                                        access to the Site, made available to
                                        you under the terms of this Agreement,
                                        by Decent, as applicable to your
                                        geographical location. Any and all
                                        references in this Agreement to the term
                                        ‘User account’ or ‘account’ means your
                                        Decent account.
                                    </li>
                                    <li>
                                        <strong>Underage Gaming.</strong> Decent
                                        carries out age-verification checks on
                                        all customers at the time of account
                                        establishment. We reserve the right at
                                        any time to request from you evidence of
                                        age in order to ensure that minors are
                                        not using the Site. We further reserve
                                        the right to suspend or cancel your
                                        account and exclude you, temporarily or
                                        permanently, from using the Site if
                                        satisfactory proof of age is not
                                        provided or if we suspect that you are
                                        underage.
                                    </li>
                                    <li>
                                        <strong>Opening an Account.</strong> In
                                        consideration of our accepting your
                                        application to establish an account and
                                        our allowing you to play the Games, you
                                        represent, warrant, covenant and agree
                                        that, and acknowledge that we may rely
                                        on these representations, as follows:
                                        <br />
                                        <br />
                                        <ol type="a">
                                            <li>
                                                You have read and agree to abide
                                                by this Agreement;
                                            </li>
                                            <li>
                                                You are 18 years of age or over,
                                                of sound mind and capable of
                                                taking responsibility for your
                                                own actions and that you can
                                                enter into a legally binding
                                                agreement with us;
                                            </li>
                                            <li>
                                                You agree to provide accurate
                                                account opening information,
                                                including without limitation
                                                your correct date of birth;
                                            </li>
                                            <li>
                                                You will not allow any other
                                                person to access or use your
                                                account with Decent;
                                            </li>
                                            <li>
                                                You will refrain from the Games
                                                unless you are physically
                                                present in a permitted
                                                jurisdiction;
                                            </li>
                                            <li>
                                                You consent to the jurisdiction
                                                of Dominica to resolve any
                                                disputes arising out of Internet
                                                or mobile gaming;
                                            </li>
                                            <li>
                                                You consent to the monitoring
                                                and recording by Decent of any
                                                wagering communications and
                                                geographic location information;
                                            </li>
                                            <li>
                                                You acknowledge that Decent
                                                reserves the right to report
                                                unusual or suspicious activity
                                                to the proper authorities;
                                            </li>
                                            <li>
                                                You warrant that any names or
                                                images used by you in connection
                                                with the Site (for example, your
                                                user name and avatar) shall not
                                                infringe the intellectual
                                                property, privacy or other
                                                rights of any third party. You
                                                hereby grant Decent a worldwide,
                                                irrevocable, transferable,
                                                royalty free, sublicensable
                                                license to use such names and
                                                images for any purpose connected
                                                with the Site, subject to the
                                                terms of our Privacy Policy;
                                            </li>
                                            <li>
                                                Your participation in the Games
                                                is personal and not
                                                professional;
                                            </li>
                                            <li>
                                                You are solely responsible for
                                                recording, paying, and
                                                accounting for any tax or other
                                                levy that may be payable on any
                                                winnings to any relevant
                                                governmental or taxation
                                                authority;
                                            </li>
                                            <li>
                                                You are solely responsible for
                                                the acquisition, supply and
                                                maintenance of all the computer
                                                equipment, and
                                                telecommunications networks, and
                                                Internet access services, and of
                                                all other consents and
                                                permissions that you need to use
                                                in order to access our Site, and
                                                Decent shall have no liability
                                                whatsoever for any outages,
                                                slowness, capacity constraints
                                                or other deficiencies affecting
                                                the same;
                                            </li>
                                            <li>
                                                You fully understand the
                                                methods, rules, and procedures
                                                of the Games and, where and when
                                                appropriate, will seek advice or
                                                help when using our Site, and
                                                you accept and agree to abide by
                                                the rules of the Games as set
                                                out on the Site;
                                            </li>
                                            <li>
                                                You will place all wagers on
                                                Games through the various user
                                                interfaces provided on our Site
                                                and you will not wager through
                                                other means, including a robot
                                                player or equivalent mechanism
                                                (a “bot”). The use of programs
                                                designed to automatically place
                                                bets within certain parameters
                                                (i.e., “bots”) is not permitted
                                                on any Games on any part of the
                                                Site;
                                            </li>
                                            <li>
                                                You will not make offensive
                                                comments, use offensive or
                                                pornographic material or make
                                                potentially defamatory or
                                                inflammatory remarks in relation
                                                to any “chat” or “forum”
                                                facilities we provide and you
                                                accept that any postings made by
                                                you can be passed on to the
                                                relevant authorities should we
                                                deem this appropriate;
                                            </li>
                                            <li>
                                                You will not disguise or
                                                interfere in any way with the
                                                Internet protocol (“IP address”)
                                                of the computer you are using to
                                                access the Site or otherwise
                                                take steps to prevent us from
                                                correctly identifying the actual
                                                IP address of the computer you
                                                are using while accessing the
                                                Site;
                                            </li>
                                            <li>
                                                There is a risk of losing money
                                                when using the Site and that
                                                Decent has no responsibility to
                                                you for any such loss;
                                            </li>
                                            <li>
                                                Your use of the Site is at your
                                                sole option, discretion and
                                                risk;
                                            </li>
                                            <li>
                                                In compliance with our
                                                regulatory requirements and in
                                                order for you to access and use
                                                our software and/or our services
                                                through the Site you will need
                                                to provide us with certain
                                                personal details about yourself
                                                as well as consenting us (or
                                                third parties acting on our
                                                behalf) to have access to or
                                                make use of your location data
                                                and/or such other data or
                                                information that may be derived
                                                from your device/computer, to
                                                enable the Games and/or Site to
                                                be made available to you. You
                                                hereby consent to us (or third
                                                parties acting on our behalf) to
                                                access and use such data for the
                                                purposes outlined above. You are
                                                not permitted to use our Games
                                                and/or Site if you do not wish
                                                to be bound by this provision.
                                                Decent will process your
                                                personal details in accordance
                                                with and as set out in our
                                                Privacy Policy; and
                                            </li>
                                            <li>
                                                You are not currently
                                                self-excluded from any online or
                                                mobile gambling site and that
                                                you will inform us immediately
                                                if you enter into a
                                                self-exclusion agreement with
                                                any gambling provider.
                                            </li>
                                        </ol>
                                    </li>
                                    <li>
                                        <strong>Account Information.</strong>{' '}
                                        All account information provided by you
                                        will be processed with our Privacy
                                        Policy as set out herein. When
                                        establishing an account, you must
                                        provide us with the following
                                        information:
                                        <br />
                                        <br />
                                        <ol type="a">
                                            <li>Name;</li>
                                            <li>Date of birth;</li>
                                            <li>Country/region; and</li>
                                            <li>Email address</li>
                                        </ol>
                                        <p>
                                            By establishing an account, you
                                            hereby consent to Decent using third
                                            party services to verify your
                                            account information including, but
                                            not limited to, your age and
                                            identity. Only one account per
                                            verified person will be allowed. The
                                            account is unique to you and
                                            non-transferrable. Decent reserves
                                            the right to reject any application
                                            for an account for any reason it
                                            deems necessary.
                                        </p>
                                        <p>
                                            It is your responsibility to keep
                                            your account information current.
                                            Failure to do so may result in your
                                            failing to receive important
                                            account-related notifications and
                                            information from Decent, including
                                            changes we make to this Agreement.
                                        </p>
                                    </li>
                                    <li>
                                        <strong>Account Security.</strong>{' '}
                                        Decent will protect your account
                                        information in accordance with our
                                        Privacy Policy as set out herein. You
                                        are responsible for maintaining the
                                        security and confidentiality of your
                                        account. In particular, you agree to
                                        keep your username and password strictly
                                        confidential. You are responsible for
                                        any misuse of your password. Provided
                                        that we have been correctly supplied
                                        with the account information requested,
                                        we are entitled to assume that offers
                                        and transactions are made by you.
                                        <p>
                                            You should change your password on a
                                            regular basis and never disclose it
                                            to any third party. You undertake to
                                            protect your username and password
                                            in the same way that you would in
                                            respect of your bank card. Any
                                            failure to do so shall be at your
                                            sole risk and expense. If a third
                                            party accesses your account, you are
                                            solely responsible for that
                                            third-party actions, whether or not
                                            that third-party’s access was
                                            authorized by you.
                                        </p>
                                        <p>
                                            You will not attempt to sell or
                                            otherwise transfer the benefit of
                                            your account to any third-party, nor
                                            will you acquire or attempt to
                                            acquire an account which has been
                                            opened in the name of a third-party.
                                        </p>
                                    </li>
                                    <li>
                                        <strong>Depositing Tokens.</strong> To
                                        play Games for money on the Site, you
                                        need to link a wallet to your account
                                        and then deposit DBET Tokens (“DBET”)
                                        into a session smart contract from your
                                        linked wallet. You undertake that.
                                        <br />
                                        <br />
                                        <ol type="a">
                                            <li>
                                                All DBETs that you deposit into
                                                a smart contract originates from
                                                a payment source of which you
                                                are the legal owner;
                                            </li>
                                            <li>
                                                All DBETs that you deposit into
                                                a smart contract is free from
                                                and unconnected to any illegal
                                                and, in particular, does not
                                                originate from any illegal
                                                activity or source; and
                                            </li>
                                            <li>
                                                All DBET deposits made into a
                                                smart contract are authorized.
                                            </li>
                                        </ol>
                                        <p>
                                            You accept that all transactions may
                                            be checked for the detection of
                                            money laundering and that any
                                            transactions made by you which
                                            Decent deems suspicious may be
                                            reported to the appropriate
                                            authorities.
                                        </p>
                                    </li>
                                    <li>
                                        <strong>
                                            Giving False Information.
                                        </strong>{' '}
                                        You acknowledge that Decent and their
                                        respective affiliates will hold
                                        information with respect to your
                                        identity, including but not limited to
                                        your name, date of birth and email
                                        address. You agree that we rely on this
                                        information in entering into this
                                        Agreement with you and you agree to hold
                                        us harmless against any falsehood or
                                        inaccuracy in the information you
                                        provide us.
                                    </li>
                                    <li>
                                        <strong>
                                            Prohibited Jurisdictions.
                                        </strong>{' '}
                                        Decent prohibits persons located in
                                        (including temporary visitors) or
                                        residents of certain jurisdictions from
                                        engaging in Games (the “Prohibited
                                        Jurisdictions”). For the avoidance of
                                        doubt, the foregoing restriction on
                                        engaging in play from Prohibited
                                        Jurisdictions apply equally to residents
                                        and citizens of other nations while
                                        located in a Prohibited Jurisdiction.
                                        Any attempt to circumvent the
                                        restrictions on play by any persons
                                        located in a Prohibited Jurisdiction is
                                        a breach of this Agreement. An attempt
                                        at circumvention includes, but is not
                                        limited to, manipulating the information
                                        used by Decent to identify your location
                                        and providing Decent with false or
                                        misleading information regarding your
                                        location or place of residence. Any such
                                        attempt will entitle us to take such
                                        steps as we deem appropriate.
                                    </li>
                                </ol>
                            </li>
                            <li>
                                <strong>GAMES</strong>
                                <ol type="1">
                                    <li>
                                        <strong>
                                            License to use the Site.
                                        </strong>{' '}
                                        Decent grants you a limited license to
                                        access the Site and to play the Games
                                        provided that you comply with this
                                        Agreement. The availability of the Games
                                        on the Site does not constitute an offer
                                        or invitation by Decent to use the Site
                                        in any Prohibited Jurisdiction. You
                                        understand that we will block you from
                                        playing the Games if you are physically
                                        located in a Prohibited Jurisdiction.
                                        Your use of the Site confers no rights
                                        whatsoever to the content and related
                                        intellectual property rights contained
                                        on the Site. You agree not to monitor,
                                        use, or copy our Site or any of our web
                                        content on the Site. You will not
                                        attempt to hack, make unauthorized
                                        alterations to, or introduce any kind of
                                        malicious code to the Site by any means.
                                        Please note that the Site is not for use
                                        by (i) individuals under 18 years of
                                        age, (ii) individuals under the legal
                                        age of majority in their jurisdiction
                                        and (iii) individuals connecting to the
                                        Site from jurisdictions from which it is
                                        illegal to do so. Decent is not able to
                                        verify the legality of the Site in each
                                        jurisdiction and it is your
                                        responsibility to ensure that your use
                                        of the Site is lawful.
                                    </li>
                                    <li>
                                        <strong>Playing the Games.</strong> You
                                        understand that you may lose money when
                                        playing the Games and accept that you
                                        are fully responsible for any such loss.
                                        You accept that under no circumstances
                                        will any amounts lost by you be
                                        recoverable from us or our vendors,
                                        licensors, or suppliers.
                                    </li>
                                    <li>
                                        <strong>
                                            Cancellation, Termination,
                                            Suspension and Breach.
                                        </strong>{' '}
                                        We may restrict your access to the Site,
                                        prohibit you from participating in any
                                        and/or all Games, prohibit you from
                                        playing in a particular Game, refuse or
                                        limit any wager you make, and/or suspend
                                        or terminate your account in our
                                        absolute discretion without cause at any
                                        time including, without limitation, if:
                                        <br />
                                        <br />
                                        <ol type="a">
                                            <li>
                                                There is a technological
                                                failure;
                                            </li>
                                            <li>
                                                We reasonably believe that you
                                                breached any of the terms of
                                                this Agreement;
                                            </li>
                                            <li>
                                                You tamper or attempt to tamper
                                                with the Site in any way;
                                            </li>
                                            <li>
                                                You are committing any offense,
                                                e.g., by attempting to access or
                                                accessing the Games from a
                                                Prohibited Jurisdiction;
                                            </li>
                                            <li>
                                                You publish any actual or
                                                potentially defamatory,
                                                offensive, racist, harmful or
                                                obscene language or threatening
                                                material or any material that
                                                would violate any law or
                                                generally be considered to be
                                                offensive, via the Site whether
                                                using the chat function, the
                                                player images option or in
                                                correspondence with Decent’s
                                                staff;
                                            </li>
                                            <li>
                                                If formally requested by law
                                                enforcement, gaming regulators,
                                                or taxation or other
                                                authorities; or
                                            </li>
                                            <li>
                                                In the event that you fail to
                                                provide us with sufficient
                                                information to identify yourself
                                                in accordance with our internal
                                                procedures.
                                            </li>
                                        </ol>
                                    </li>
                                    <li>
                                        <strong>Changes to the Games.</strong>{' '}
                                        Decent may, in its absolute discretion,
                                        alter, amend or withdraw any particular
                                        Game or any part thereof, add other
                                        Games at any time, and alter prices,
                                        features, specifications, capabilities,
                                        functions and/or other characteristics
                                        of the Games at any time.
                                    </li>
                                    <li>
                                        <strong>Errors and Omissions.</strong>{' '}
                                        Decent makes every effort to ensure that
                                        we do not make errors in posting lines.
                                        However, if as a result of human error
                                        or system problems, a bet is accepted at
                                        an odd that is: materially different
                                        from those available in the general
                                        market at the time the bet was made; or
                                        clearly incorrect given the chance of
                                        the event occurring at the time the bet
                                        was made, then we reserve the right to
                                        cancel or void that wager, or to cancel
                                        or void a wager made after an event has
                                        started.
                                        <p>
                                            In addition, if there is any
                                            discrepancy between the gaming
                                            results on your computer and the
                                            results on our server or the
                                            blockchain, the results on our
                                            server or the blockchain shall be
                                            final and binding. If there is any
                                            discrepancy between your on-screen
                                            display and the balance in your
                                            wallet, the balance on Decent’s
                                            server or blockchain is deemed to be
                                            the balance in your account and this
                                            determination shall be final and
                                            binding.
                                        </p>
                                        <p>
                                            If you are incorrectly awarded any
                                            winnings as a result of (a) human
                                            error; (b) any defect or error in
                                            the software; or (c) the failure of
                                            the relevant Games product or the
                                            software to operate in accordance
                                            with the rules of the relevant Game,
                                            then Decent has the right to seek
                                            recovery from you for any amount
                                            overpaid to rectify any mistake,
                                            erroneous bets or wagers.
                                        </p>
                                        <p>
                                            Decent, and their respective
                                            licensors, vendors and suppliers,
                                            and the respective licensees,
                                            distributors, parents, subsidiaries,
                                            and affiliates of each, and all of
                                            their officers, directors, and
                                            employees will not be liable for any
                                            loss or damages which may be cause
                                            by the interception or misuse of any
                                            information transmitted over the
                                            Internet.
                                        </p>
                                    </li>
                                </ol>
                            </li>
                            <li>
                                <strong>GENERAL CONDITIONS</strong>
                                <ol type="1">
                                    <li>
                                        <strong>Rates.</strong> All transactions
                                        on the Site will take place at the
                                        current prevailing DBET rate. User
                                        acknowledges there is movement in DBET
                                        token value and they are aware of the
                                        impact fluctuations in the DBET token
                                        rate may have on the User’s balance
                                        before using the Site. Decent will not
                                        be held responsible for gains and losses
                                        incurred by Users that utilize the Site.
                                    </li>
                                    <li>
                                        <strong>Intellectual Property.</strong>{' '}
                                        The term "Decent.bet", the domain name
                                        “decent.bet”, and any other trademarks,
                                        service marks, signs, trade names and/or
                                        domain names used by Decent on the Site
                                        from time to time (the{' '}
                                        <strong>"Trade Marks"</strong>
                                        ), are the trademarks, service marks,
                                        signs, trade names and/or domain names
                                        of Dcent and/or its licensors, and these
                                        entities reserve all rights to such
                                        Trade Marks. In addition, all content on
                                        the Site, including, but not limited to,
                                        images, pictures, graphics, photographs,
                                        animations, videos, music, audio and
                                        text (the{' '}
                                        <strong>"Site Content"</strong>) belongs
                                        to Decent and/or its licensors and is
                                        protected by copyright and/or other
                                        intellectual property or other rights.
                                        You hereby acknowledge that by using the
                                        Site you obtain no rights in the Site
                                        content and/or the Trade Marks, or any
                                        part thereof. Under no circumstances may
                                        you use the Site content and/or the
                                        Trade Marks without Decent’s prior
                                        written consent. Additionally, you agree
                                        not to do anything that will harm or
                                        potentially harm the rights, including
                                        the intellectual property rights, held
                                        by Decent and/or its licensors in the
                                        Trade Marks or the Site content nor will
                                        you do anything that damages the image
                                        or reputation of Decent, its
                                        subsidiaries, employees, directors,
                                        officers and consultants. You hereby
                                        assign to Decent absolutely any and all
                                        copyright and other intellectual
                                        property rights throughout the world in
                                        all media whether now known or hereafter
                                        developed, for the full period of
                                        copyright, including by way of present
                                        assignment of future copyright, and all
                                        other rights whatsoever, in any bets,
                                        chat postings, game play, or any other
                                        interaction made by you while playing
                                        the Games.
                                    </li>
                                    <li>
                                        <strong>No Warranties.</strong>
                                        <ol type="a">
                                            <li>
                                                Decent disclaims any and all
                                                warranties, expressed or
                                                implied, in connection with the
                                                Games and/or Site which is
                                                provided to you "AS IS" and we
                                                provide you with no warranty or
                                                representation whatsoever
                                                regarding its quality, fitness
                                                for purpose, completeness or
                                                accuracy.{' '}
                                            </li>
                                            <li>
                                                Regardless of our efforts to
                                                provide you with service of the
                                                highest quality, safety and
                                                security, we make no warranty
                                                that the Games and/or Site will
                                                be uninterrupted, timely or
                                                error-free, that defects will be
                                                corrected or that the Site shall
                                                be free from viruses, bugs or
                                                other contaminants.
                                            </li>
                                            <li>
                                                Decent reserves the right to
                                                suspend, discontinue, modify,
                                                remove or add to the Games
                                                and/or Site in its absolute
                                                discretion with immediate effect
                                                and without an obligation to
                                                provide you with notice where we
                                                consider it necessary to do so,
                                                including (for example) where we
                                                receive information that you
                                                have entered into any
                                                self-exclusion agreement with
                                                any gambling provider or where
                                                we deem it necessary for the
                                                management, maintenance or
                                                update of the Site and we shall
                                                not be liable in any way
                                                whatsoever for any loss suffered
                                                as a consequence of any decision
                                                made by Decent in this regard.
                                            </li>
                                        </ol>
                                    </li>

                                    <li>
                                        <strong>Indemnification.</strong> You
                                        agree to fully indemnify, defend and
                                        hold harmless Decent, the Decent group
                                        of companies and its shareholders,
                                        directors and employees from and against
                                        all claims, demands, liabilities,
                                        damages, losses, costs and expenses,
                                        including legal fees and any other
                                        charges whatsoever, howsoever caused,
                                        that may arise as a result of:
                                        <br />
                                        <br />
                                        <ol type="a">
                                            <li>
                                                your breach of this Agreement,
                                                in whole or in part;
                                            </li>
                                            <li>
                                                violation by you of any law or
                                                any third-party rights; and
                                            </li>
                                            <li>
                                                use by you of the Site or use by
                                                any other person accessing the
                                                Site using your login
                                                credentials, whether or not with
                                                your authorization.
                                            </li>
                                        </ol>
                                    </li>

                                    <li>
                                        <strong>
                                            Limitation of Liability.
                                        </strong>{' '}
                                        Under no circumstances, including
                                        negligence, shall Decent or any other
                                        member of the Decent group of companies,
                                        be liable for any special, incidental,
                                        direct, indirect or consequential
                                        damages whatsoever (including, without
                                        limitation, damages for loss of business
                                        profits, business interruption, loss of
                                        business information, or any other
                                        pecuniary loss) arising out of the use
                                        (or misuse) of the Site even if Decent
                                        had prior knowledge of the possibility
                                        of such damages. Any allowable claim, if
                                        any, which you may bring against Decent
                                        must be brought no later than sixty (60)
                                        days after the date of the event giving
                                        rise to the claim. You hereby waive any
                                        right to bring any claim not brought
                                        within such period. Nothing in this
                                        Agreement shall exclude or limit
                                        Decent’s liability for: (a) death or
                                        personal injury resulting from its
                                        negligence; or (b) fraud or fraudulent
                                        misrepresentation.{' '}
                                    </li>

                                    <li>
                                        <strong>Third Party Software.</strong>{' '}
                                        The Site may contain third party
                                        software that is proprietary to the
                                        licensor or its suppliers and subject to
                                        the copyright laws of the United States
                                        and other jurisdictions (the{' '}
                                        <strong>“Licensed Software”</strong>
                                        ). User’s use of the Licensed Software
                                        is subject to compliance with all of the
                                        terms and conditions of this Agreement.
                                        The Licensed Software may not be
                                        altered, modified or extracted from the
                                        Site. User’s use is limited to “Internal
                                        Use” meaning use of the Licensed
                                        Software only in the course of the
                                        User’s customary and ordinary internal
                                        business or personal use and not for
                                        further resale, sublicensing or
                                        distribution. “Customary and ordinary
                                        internal business use” shall mean, for
                                        an end user that is an entity, use by
                                        such User, or its employees or
                                        authorized agents for the User’s
                                        customary and ordinary internal
                                        business. “Customary and ordinary
                                        personal use” shall mean use, by a User
                                        that is an individual, use by such User
                                        or a member of such User’s household for
                                        internal personal purposes. All such
                                        employees, agents, and household members
                                        shall be notified by the User as to the
                                        terms and conditions of this Agreement.
                                        All rights not expressly granted in the
                                        Licensed Software are reserved.
                                    </li>

                                    <li>
                                        <strong>Disputes.</strong> User accepts
                                        that the historical data of each Game
                                        shall be as recorded on the Decent
                                        servers. In the event of a discrepancy
                                        between the images displayed on your
                                        computer and the game records on
                                        Decent’s server, the latter shall
                                        prevail. If a User wishes to make a
                                        complaint, please contact customer
                                        support.{' '}
                                    </li>

                                    <li>
                                        <strong>Amendment.</strong> Decent
                                        reserves the right to update or modify
                                        this Agreement or any part thereof at
                                        any time without notice and you will be
                                        bound by such amended Agreement within
                                        14 days of it being posted at the Site.
                                        Therefore, we encourage you to visit the
                                        Site regularly and check the terms and
                                        conditions contained in the version of
                                        the Agreement in force at such time.
                                        Your continued use of the Site shall be
                                        deemed to attest to your agreement to
                                        any amendments to the Agreement.
                                    </li>

                                    <li>
                                        <strong>Governing Law.</strong> The
                                        Agreement and any matters relating
                                        hereto shall be governed by, and
                                        construed in accordance with, the laws
                                        of Dominica. You irrevocably agree that,
                                        subject as provided below, the courts of
                                        Dominica shall have exclusive
                                        jurisdiction in relation to any claim,
                                        dispute or difference concerning the
                                        Agreement and you irrevocably waive any
                                        right that you may have to object to an
                                        action being brought in those courts, or
                                        to claim that the action has been
                                        brought in an inconvenient forum, or
                                        that those courts do not have
                                        jurisdiction. Nothing in this clause
                                        shall limit the right of Decent to take
                                        proceedings against you in any other
                                        court of competent jurisdiction, nor
                                        shall the taking of proceedings in any
                                        one or more jurisdictions preclude the
                                        taking of proceedings in any other
                                        jurisdictions, whether concurrently or
                                        not, to the extent permitted by the law
                                        of such other jurisdiction.
                                    </li>

                                    <li>
                                        <strong>Severability.</strong> If a
                                        provision of this Agreement is or
                                        becomes illegal, invalid or
                                        unenforceable in any jurisdiction, that
                                        shall not affect the validity or
                                        enforceability in that jurisdiction of
                                        any other provision hereof or the
                                        validity or enforceability in other
                                        jurisdictions of that or any other
                                        provision hereof.
                                    </li>

                                    <li>
                                        <strong>Assignment.</strong> Decent
                                        reserves the right to assign this
                                        agreement, in whole or in part, at any
                                        time without notice. User may not assign
                                        any of his/her rights or obligations
                                        under this Agreement.
                                    </li>

                                    <li>
                                        <strong>Waiver.</strong> No waiver by
                                        Decent of any breach of any provision of
                                        this Agreement (including the failure of
                                        Decent to require strict and literal
                                        performance of or compliance with any
                                        provision of this Agreement) shall in
                                        any way be construed as a waiver of any
                                        subsequent breach of such provision or
                                        of any breach of any other provision of
                                        this Agreement.
                                    </li>

                                    <li>
                                        <strong>Third Party Rights.</strong>{' '}
                                        Nothing in this Agreement shall create
                                        or confer any rights or other benefits
                                        in favor of any third parties not party
                                        to this Agreement other than with
                                        respect to any company within the Decent
                                        group of companies and third party
                                        providers.
                                    </li>

                                    <li>
                                        <strong>
                                            Relationship of the Parties.
                                        </strong>{' '}
                                        Nothing in this Agreement shall create
                                        or be deemed to create a partnership,
                                        agency, trust arrangement, fiduciary
                                        relationship or joint venture between
                                        you and us.
                                    </li>

                                    <li>
                                        <strong>Entire Agreement.</strong> This
                                        Agreement constitutes the entire
                                        understanding and agreement between you
                                        and us regarding the Site and supersedes
                                        any prior agreement, understanding, or
                                        arrangement between you and us.
                                    </li>

                                    <li>
                                        <strong>
                                            Communications and Notices.
                                        </strong>{' '}
                                        Communications and notices to be given
                                        by you to us under this Agreement (other
                                        than those exchanges of information
                                        occurring in the normal operation of the
                                        Site) should be provided to us at
                                        <Button
                                            size="small"
                                            color="primary"
                                            href="mailto:support@decent.bet"
                                        >
                                            support@decent.bet
                                        </Button>{' '}
                                    </li>

                                    <li>
                                        <strong>Information Services.</strong>{' '}
                                        From time to time, Decent may provide
                                        you with access to various information
                                        and content via our Site, emails, or any
                                        other means of communication. Further,
                                        Decent may provide you with links to
                                        third-party websites which may include
                                        information. This information is
                                        supplied “as is” and is for information
                                        purposes only. Use of such information
                                        is entirely at your own risk. To the
                                        fullest extent permitted by law, Decent,
                                        nor any other party makes any
                                        representations or warranties of any
                                        kind, including but not limited to, the
                                        accuracy, quality, or completeness of
                                        the information. Neither Decent nor any
                                        other party shall be liable for any
                                        action taken by you as a result of your
                                        reliance on any such information or for
                                        any loss or damage suffered by you as a
                                        result of your use of such information.
                                        Any links to third party websites do not
                                        constitute an endorsement by Decent or
                                        any other party of any products or
                                        services available on such websites. You
                                        use such websites at your own risk and
                                        neither Decent or any other party takes
                                        any responsibility for the content on,
                                        or use of, such websites.{' '}
                                    </li>

                                    <li>
                                        <strong>Force Majeure.</strong> Neither
                                        Decent nor any other party will be
                                        liable for any loss or damage that you
                                        may suffer in respect of an event of
                                        Force Majeure. For the purposes of this
                                        Agreement, “Force Majeure” means any
                                        event outside our reasonable control
                                        affecting our ability to perform any of
                                        our obligations under this Agreement.
                                    </li>
                                </ol>
                            </li>
                        </ol>
                    </Typography>
                </CardContent>
            </Card>
        </React.Fragment>
    )
}

export default withStyles(styles, { withTheme: true })(TermsAndConditions)
