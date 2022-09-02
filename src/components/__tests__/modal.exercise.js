import React from 'react'
import { render, screen, within } from '@testing-library/react'
import { Modal, ModalContents, ModalOpenButton } from '../modal'
import UserEvent from '@testing-library/user-event'

test('can be opened and closed', async () => {
    const label = 'Modal Label'
    const title = 'Modal Title'
    const content = 'Modal content'
    let user = UserEvent.setup()
    render(
        <Modal>
            <ModalOpenButton>
                <button>Open</button>
            </ModalOpenButton>
            <ModalContents aria-label={label} title={title}>
                <div>{content}</div>
            </ModalContents>
        </Modal>,
    )
    await user.click(screen.getByText('Open'))
    let modal = screen.getByRole('dialog')
    expect(modal).toBeInTheDocument()
    expect(modal).toHaveAttribute('aria-label', label)
    let inModal = within(modal)
    expect(inModal.getByRole('heading', { name: title })).toBeInTheDocument()
    expect(inModal.getByText(content)).toBeInTheDocument()

    await user.click(inModal.getByRole('button', { name: /close/i }))

    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
})
// 🐨 render the Modal, ModalOpenButton, and ModalContents
// 🐨 click the open button
// 🐨 verify the modal contains the modal contents, title, and label
// 🐨 click the close button
// 🐨 verify the modal is no longer rendered
// 💰 (use `query*` rather than `get*` or `find*` queries to verify it is not rendered)
// 💰 Remember all userEvent utils are async, so you need to await them.
