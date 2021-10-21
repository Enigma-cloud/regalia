import React, { Component } from 'react';
import { connect } from 'react-redux';

import CustomFormContainer from '../custom-form-container/custom-form-container.component';
import CustomForm from '../custom-form/custom-form.component';
import FormInput from '../form-input/form-input.component';
import CustomButton from '../custom-button/custom-button.component';

import { displayToast } from '../../redux/toast-notif/toast-notif.actions';
import { toastMessages } from '../../redux/toast-notif/toast-notif.messages';

import { auth, signInWithGoogle } from '../../firebase/firebase.utils';
import { signInWithEmailAndPassword } from 'firebase/auth';

import './sign-in.styles.scss';

class SignIn extends Component {
    constructor(props) {
        super(props);

        this.state = {
            email: '',
            password: ''
        }
    }

    // Sign In with Email & Password
    handleSubmit = async (e) => {
        e.preventDefault();
        // Default toast styling
        let toastType = 'success'

        const { email, password } =  this.state;

        try {
            await signInWithEmailAndPassword(auth, email, password);

            this.setState({ email: '', password: ''});
        } catch (error) {
            toastType = 'error';

            this.props.displayToastProp({
                ...toastMessages[toastType],
                description: `Error occured while signing in with email and password, please try again`,
            });   
        }
    }

    handleChange = (e) => {
        const { value, name } = e.target;

        this.setState({ [name]: value })
    }

    render() {
        const { email, password } = this.state;

        return (
            <CustomFormContainer>
                <h2 className='title'>Already have an account?</h2>
                <span>Sign in with your email and password</span>   
                <CustomForm onSubmit={this.handleSubmit}>
                    <div>
                        <FormInput 
                            type="email" 
                            name="email" 
                            label="Email" 
                            handleChange={this.handleChange} 
                            value={email} 
                            required 
                        />
                        <FormInput 
                            type="password" 
                            name="password" 
                            label="Password" 
                            handleChange={this.handleChange} 
                            value={password} 
                            required 
                        />
                    </div>
                    <div className='button-container'>
                        <CustomButton type="submit">Sign in</CustomButton>
                        <CustomButton type="button" onClick={signInWithGoogle} isGoogleSignIn>Continue with Google</CustomButton>
                    </div>
                </CustomForm>
            </CustomFormContainer>
        )
    }
}

const mapDispatchToProps = (dispatch) => ({
    displayToastProp: content => dispatch(displayToast(content))
})

export default connect(null, mapDispatchToProps)(SignIn);