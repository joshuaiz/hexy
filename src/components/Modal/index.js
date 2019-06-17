import React, { useEffect, useState } from 'react'
import { Dialog, DialogOverlay, DialogContent } from '@reach/dialog'
import Component from '@reach/component-component'
// import '@reach/dialog/styles.css'

const Modal = ({ content, error }) => {
    return (
        <Component initialState={{ showDialog: true }}>
            {({ state, setState }) => (
                <div className="modal-dialog">
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
                        {content}
                    </Dialog>
                </div>
            )}
        </Component>
    )
}

export default Modal
