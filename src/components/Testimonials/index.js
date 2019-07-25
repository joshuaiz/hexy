import React from 'react'
import { toTitleCase } from '../../utils/helpers'
import './Testimonials.scss'

const people = [
    {
        name: {
            title: 'miss',
            first: 'vanessa',
            last: 'vargas'
        },
        location: {
            street: '2800 w dallas st',
            city: 'fontana',
            state: 'mississippi',
            postcode: 61512,
            coordinates: {
                latitude: '-76.0419',
                longitude: '101.3009'
            },
            timezone: {
                offset: '-3:30',
                description: 'Newfoundland'
            }
        },
        email: 'vanessa.vargas@example.com',
        picture: {
            large: 'https://randomuser.me/api/portraits/women/58.jpg',
            medium: 'https://randomuser.me/api/portraits/med/women/58.jpg',
            thumbnail: 'https://randomuser.me/api/portraits/thumb/women/58.jpg'
        }
    },
    {
        name: {
            title: 'ms',
            first: 'rose',
            last: 'meyer'
        },
        location: {
            street: '603 taylor st',
            city: 'santa ana',
            state: 'north dakota',
            postcode: 97460,
            coordinates: {
                latitude: '75.9408',
                longitude: '171.2366'
            },
            timezone: {
                offset: '+3:30',
                description: 'Tehran'
            }
        },
        email: 'rose.meyer@example.com',
        picture: {
            large: 'https://randomuser.me/api/portraits/women/75.jpg',
            medium: 'https://randomuser.me/api/portraits/med/women/75.jpg',
            thumbnail: 'https://randomuser.me/api/portraits/thumb/women/75.jpg'
        }
    },
    {
        name: {
            title: 'mr',
            first: 'bobby',
            last: 'adams'
        },
        location: {
            street: '4581 ranchview dr',
            city: 'celina',
            state: 'montana',
            postcode: 16559,
            coordinates: {
                latitude: '44.8260',
                longitude: '-13.4072'
            },
            timezone: {
                offset: '-4:00',
                description: 'Atlantic Time (Canada), Caracas, La Paz'
            }
        },
        email: 'bobby.adams@example.com',
        picture: {
            large: 'https://randomuser.me/api/portraits/men/89.jpg',
            medium: 'https://randomuser.me/api/portraits/med/men/89.jpg',
            thumbnail: 'https://randomuser.me/api/portraits/thumb/men/89.jpg'
        }
    },
    {
        name: {
            title: 'miss',
            first: 'tara',
            last: 'watkins'
        },
        location: {
            street: '5858 valwood pkwy',
            city: 'clearwater',
            state: 'alaska',
            postcode: 14581,
            coordinates: {
                latitude: '-59.3755',
                longitude: '70.2440'
            },
            timezone: {
                offset: '+3:00',
                description: 'Baghdad, Riyadh, Moscow, St. Petersburg'
            }
        },
        email: 'tara.watkins@example.com',
        picture: {
            large: 'https://randomuser.me/api/portraits/women/6.jpg',
            medium: 'https://randomuser.me/api/portraits/med/women/6.jpg',
            thumbnail: 'https://randomuser.me/api/portraits/thumb/women/6.jpg'
        }
    },
    {
        name: {
            title: 'ms',
            first: 'daisy',
            last: 'carter'
        },
        location: {
            street: '6951 lakeview st',
            city: 'joliet',
            state: 'nevada',
            postcode: 60586,
            coordinates: {
                latitude: '4.3469',
                longitude: '-5.7511'
            },
            timezone: {
                offset: '+2:00',
                description: 'Kaliningrad, South Africa'
            }
        },
        email: 'daisy.carter@example.com',
        picture: {
            large: 'https://randomuser.me/api/portraits/women/20.jpg',
            medium: 'https://randomuser.me/api/portraits/med/women/20.jpg',
            thumbnail: 'https://randomuser.me/api/portraits/thumb/women/20.jpg'
        }
    },
    {
        name: {
            title: 'miss',
            first: 'harper',
            last: 'mills'
        },
        location: {
            street: '8164 taylor st',
            city: 'rockford',
            state: 'north carolina',
            postcode: 43354,
            coordinates: {
                latitude: '31.1661',
                longitude: '147.7253'
            },
            timezone: {
                offset: '-9:00',
                description: 'Alaska'
            }
        },
        email: 'harper.mills@example.com',
        picture: {
            large: 'https://randomuser.me/api/portraits/women/51.jpg',
            medium: 'https://randomuser.me/api/portraits/med/women/51.jpg',
            thumbnail: 'https://randomuser.me/api/portraits/thumb/women/51.jpg'
        }
    },
    {
        name: {
            title: 'mr',
            first: 'francisco',
            last: 'caldwell'
        },
        location: {
            street: '2075 valley view ln',
            city: 'fountain valley',
            state: 'north dakota',
            postcode: 76068,
            coordinates: {
                latitude: '-6.8399',
                longitude: '60.5614'
            },
            timezone: {
                offset: '-3:30',
                description: 'Newfoundland'
            }
        },
        email: 'francisco.caldwell@example.com',
        picture: {
            large: 'https://randomuser.me/api/portraits/men/11.jpg',
            medium: 'https://randomuser.me/api/portraits/med/men/11.jpg',
            thumbnail: 'https://randomuser.me/api/portraits/thumb/men/11.jpg'
        }
    },
    {
        name: {
            title: 'mr',
            first: 'eugene',
            last: 'hernandez'
        },
        location: {
            street: '7458 hickory creek dr',
            city: 'fort wayne',
            state: 'georgia',
            postcode: 76840,
            coordinates: {
                latitude: '-69.0029',
                longitude: '5.9244'
            },
            timezone: {
                offset: '-9:00',
                description: 'Alaska'
            }
        },
        email: 'eugene.hernandez@example.com',
        picture: {
            large: 'https://randomuser.me/api/portraits/men/73.jpg',
            medium: 'https://randomuser.me/api/portraits/med/men/73.jpg',
            thumbnail: 'https://randomuser.me/api/portraits/thumb/men/73.jpg'
        }
    },
    {
        name: {
            title: 'mr',
            first: 'marc',
            last: 'lane'
        },
        location: {
            street: '3302 camden ave',
            city: 'college station',
            state: 'washington',
            postcode: 18680,
            coordinates: {
                latitude: '17.1808',
                longitude: '-96.3530'
            },
            timezone: {
                offset: '-9:00',
                description: 'Alaska'
            }
        },
        email: 'marc.lane@example.com',
        picture: {
            large: 'https://randomuser.me/api/portraits/men/33.jpg',
            medium: 'https://randomuser.me/api/portraits/med/men/33.jpg',
            thumbnail: 'https://randomuser.me/api/portraits/thumb/men/33.jpg'
        }
    },
    {
        name: {
            title: 'mr',
            first: 'allen',
            last: 'graves'
        },
        location: {
            street: '4893 w belt line rd',
            city: 'olathe',
            state: 'maryland',
            postcode: 36705,
            coordinates: {
                latitude: '33.2554',
                longitude: '-148.8776'
            },
            timezone: {
                offset: '-2:00',
                description: 'Mid-Atlantic'
            }
        },
        email: 'allen.graves@example.com',
        picture: {
            large: 'https://randomuser.me/api/portraits/men/34.jpg',
            medium: 'https://randomuser.me/api/portraits/med/men/34.jpg',
            thumbnail: 'https://randomuser.me/api/portraits/thumb/men/34.jpg'
        }
    },
    {
        name: {
            title: 'miss',
            first: 'tracy',
            last: 'gordon'
        },
        location: {
            street: '6918 ranchview dr',
            city: 'fort collins',
            state: 'west virginia',
            postcode: 86299,
            coordinates: {
                latitude: '-35.7788',
                longitude: '-55.5358'
            },
            timezone: {
                offset: '+3:00',
                description: 'Baghdad, Riyadh, Moscow, St. Petersburg'
            }
        },
        email: 'tracy.gordon@example.com',
        picture: {
            large: 'https://randomuser.me/api/portraits/women/20.jpg',
            medium: 'https://randomuser.me/api/portraits/med/women/20.jpg',
            thumbnail: 'https://randomuser.me/api/portraits/thumb/women/20.jpg'
        }
    },
    {
        name: {
            title: 'ms',
            first: 'mary',
            last: 'cook'
        },
        location: {
            street: '1231 wheeler ridge dr',
            city: 'tyler',
            state: 'illinois',
            postcode: 58302,
            coordinates: {
                latitude: '11.3869',
                longitude: '91.4759'
            },
            timezone: {
                offset: '-9:00',
                description: 'Alaska'
            }
        },
        email: 'mary.cook@example.com',
        picture: {
            large: 'https://randomuser.me/api/portraits/women/93.jpg',
            medium: 'https://randomuser.me/api/portraits/med/women/93.jpg',
            thumbnail: 'https://randomuser.me/api/portraits/thumb/women/93.jpg'
        }
    }
]

const Testimonials = () => {
    return (
        <div className="testimonials-outer">
            <h2>Praise for Hexy</h2>
            <ul className="testimonials nostyle">
                {people.map((person, index) => {
                    return (
                        <li
                            className="testimonial"
                            key={person.location.postcode}
                        >
                            <div className="testimonial-wrap">
                                <div className="testimonial-avatar">
                                    <img src={person.picture.large} />
                                </div>
                                <div className="testimonial-author">
                                    <h3>
                                        {toTitleCase(person.name.first)}&nbsp;
                                        {toTitleCase(person.name.last)}
                                    </h3>
                                    <h4>{toTitleCase(person.location.city)}</h4>
                                </div>
                            </div>

                            <div className="testimonial-quote">
                                <p>
                                    Elit cibo nusquam qui ad, integre fuisset
                                    usu an, ex offendit convenire pro. At duo
                                    etiam eirmod contentiones. Id ius constituam
                                    cotidieque, usu decore latine persius te.
                                    Vel cu dictas doctus corrumpit.
                                </p>
                            </div>
                        </li>
                    )
                })}
            </ul>
        </div>
    )
}

export default Testimonials
