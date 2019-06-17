import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Dialog, DialogOverlay, DialogContent } from '@reach/dialog'
import Component from '@reach/component-component'
import { humanize } from '../../utils/helpers'
// import '@reach/dialog/styles.css'

const PriceModal = React.memo(function PriceModal({
    cart,
    addToCart,
    accountType,
    price
}) {
    // console.log('PriceModal', cart)
    return (
        <Component initialState={{ showDialog: false }}>
            {({ state, setState }) => (
                <div>
                    <button
                        className="button"
                        onClick={() => {
                            addToCart(accountType, price)
                            setState({ showDialog: true })
                        }}
                    >
                        Get {humanize(accountType)}!
                    </button>
                    <Dialog
                        isOpen={state.showDialog}
                        onDismiss={() =>
                            setState({
                                showDialog: false
                            })
                        }
                    >
                        <span
                            className="modal-close"
                            onClick={() => setState({ showDialog: false })}
                        >
                            &times;
                        </span>
                        <div className="modal-content">
                            <h3>
                                Hexy {humanize(accountType)} added to your cart!
                            </h3>
                            <p>
                                Go to{' '}
                                <Link to="/checkout">Checkout &rarr;</Link>.
                            </p>
                        </div>
                    </Dialog>
                </div>
            )}
        </Component>
    )
})

// PriceModal.whyDidYouRender = true

export default PriceModal
