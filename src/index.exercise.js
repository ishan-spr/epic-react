// 🐨 you'll need to import react and createRoot from react-dom up here

import React from "react";
import { createRoot } from "react-dom"
import { Logo } from "components/logo";
import '@reach/dialog/styles.css'
import Dialog from "@reach/dialog";
import { VisuallyHidden } from "@reach/visually-hidden";


function LoginForm({ onSubmit, buttonText }) {
    function handleSubmit(event) {
        event.preventDefault()
        const { username, password } = event.target.elements

        onSubmit({
            username: username.value,
            password: password.value,
        })
    }

    return (
        <form onSubmit={handleSubmit}>
            <div>
                <label htmlFor="username">Username</label>
                <input id="username" />
            </div>
            <div>
                <label htmlFor="password">Password</label>
                <input id="password" type="password" />
            </div>
            <div>
                <button type="submit">{buttonText}</button>
            </div>
        </form>
    )
}

function App() {
    const [openLogin, setOpenlogin] = React.useState(false)
    const [openegister, setOpenRegister] = React.useState(false)

    const loginClose = () => (setOpenlogin(false))
    const registerClose = () => (setOpenRegister(false))

    function login(formData) {
        console.log('login', formData)
    }

    function register(formData) {
        console.log('register', formData)
    }

    return (
        <>
            <Logo />
            <h1>Bookshelf</h1>
            <button onClick={() => (setOpenlogin(true))}>Login</button>
            <button onClick={() => (setOpenRegister(true))}>Register</button>
            <Dialog isOpen={openLogin} onDismiss={loginClose}>
                <button className="close-button" onClick={loginClose}>
                    <VisuallyHidden>Close</VisuallyHidden>
                    <span aria-hidden>×</span>
                </button>
                <LoginForm onSubmit={login} buttonText={"Login"} />
            </Dialog>
            <Dialog isOpen={openegister} onDismiss={registerClose}>
                <button className="close-button" onClick={registerClose}>
                    <VisuallyHidden>Close</VisuallyHidden>
                    <span aria-hidden>×</span>
                </button>
                <LoginForm onSubmit={register} buttonText={"Register"} />
            </Dialog>
        </>
    )
}

const root = createRoot(document.getElementById('root'))
root.render(<App />)
export { root }
