import React from 'react'
import { Link } from 'react-router-dom'
import { ReactComponent as Share } from '../../images/share.svg'

const Questions = () => {
    return (
        <div className="questions">
            <dl>
                <dt>What is Hexy?</dt>
                <dd>
                    <p>
                        Hexy is an interactive compendium of all named hex
                        colors. The master color list comes from the{' '}
                        <a
                            href="https://github.com/meodai/color-names"
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            color-names
                        </a>{' '}
                        project to which we owe a great deal of gratitude.
                    </p>

                    <p>
                        We built Hexy as a tool to find cool colors quickly and
                        easily to use in any kind of design projects. What makes
                        Hexy different is that it has a huge library of colors
                        yet by limiting them to named hex colors, it is a
                        manageable list.
                    </p>
                </dd>

                <dt>Do I need an account to use Hexy?</dt>
                <dd>
                    <p>
                        Hexy is free to use however you need an account to
                        export and save palettes. Free accounts can export 5
                        colors per palette and save 5 private palettes to their
                        profile. A <Link to="/pro">Hexy Pro</Link> account will
                        give you more ways to save and share up to 15 colors and
                        up to unlimited palettes.
                    </p>
                </dd>

                <dt>
                    What are the benefits of a <Link to="/pro">Hexy Pro</Link>{' '}
                    account?
                </dt>
                <dd>
                    <p>
                        Hexy Pro account holders can export up to 15 colors per
                        palette, save unlimited private palettes to their
                        profile, export to .scss, and have early access to new
                        colors and features.
                    </p>
                </dd>

                <dt>
                    What does <Share /> "share to public palettes" mean?
                </dt>
                <dd>
                    <p>
                        This icon can be found on saved palettes on your{' '}
                        <Link to="/account">Account page</Link>.
                    </p>
                    <p>
                        Anyone using Hexy without an account or when not logged
                        in can save favorite colors to a public palette which
                        will be added to the palettes feed on the{' '}
                        <Link to="/palettes">Palettes page</Link>.
                    </p>
                    <p>
                        Yet, if you have a Hexy account at any level you can
                        save palettes privately. The <Share /> icon then allows
                        you to share your palettes to the public feed at your
                        discretion.
                    </p>
                    <p>
                        Note that once you share your palette publicly, you
                        can't make it private again so please be sure you want
                        it to be seen. Yet we *do* encourage sharing so please
                        make your palettes public and let the world see your
                        color creations.
                    </p>
                </dd>
            </dl>
        </div>
    )
}

export default Questions
