import React from 'react'
import { Link } from 'react-router-dom'

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
            </dl>
        </div>
    )
}

export default Questions
