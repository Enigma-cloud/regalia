import React, { Component } from 'react';
import { connect } from 'react-redux';

import CustomFormContainer from '../custom-form-container/custom-form-container.component';
import CustomForm from '../custom-form/custom-form.component';
import FormInput from '../form-input/form-input.component';
import CustomButton from '../custom-button/custom-button.component';

import { displayToast } from '../../redux/toast-notif/toast-notif.actions';
import { toastMessages } from '../../redux/toast-notif/toast-notif.messages';

import { auth, createUserProfileDocument } from '../../firebase/firebase.utils';
import { createUserWithEmailAndPassword } from 'firebase/auth';

import './sign-up.styles.scss';

class SignUp extends Component {
    constructor() {
        super();

        this.state = {
            displayName: '',
            email: '',
            password: '',
            confirmPassword: ''
        }
    }

    handleSubmit = async (e) => {
        e.preventDefault();

        const { displayName, email, password, confirmPassword } = this.state;
        // Default toast styling
        let toastType = 'success'

        if (password !== confirmPassword) {
            toastType = 'error';

            this.props.displayToastProp({
                ...toastMessages[toastType],
                description: `Passwords do not match, please try again`,
            });   
            return null;
        }

        try {
            const { user } = await createUserWithEmailAndPassword(auth, email, password);
            await createUserProfileDocument(user, { displayName });

            this.props.displayToastProp({
                ...toastMessages[toastType],
                title: `Welcome, ${displayName}`,
                description: 'You have succesfully registered an account',
            });   

            this.setState({
                displayName: '',
                email: '',
                password: '',
                confirmPassword: ''
            })
        } catch (error) {
            toastType = 'error';

            this.props.displayToastProp({
                ...toastMessages[toastType],
                title: `Oops, something unexpected happened`,
                description: `An error occured whilst signing up, please try again`,
            });   
            return null;
        }
    }

    handleChange = (e) => {
        const { name, value } = e.target;

        this.setState({[name]: value});
    }

    render() {
        const { displayName, email, password, confirmPassword } = this.state;

        return (
            <CustomFormContainer>
                <h2 className='title'>Don't have an account?</h2>
                <span>Sign up with your email and password</span>
                <CustomForm onSubmit={this.handleSubmit}>
                    <div>
                        <FormInput 
                            type='text'
                            name='displayName'
                            value={displayName}
                            onChange={this.handleChange}
                            label='Name'
                            required
                        />
                        <FormInput 
                            type='email'
                            name='email'
                            value={email}
                            onChange={this.handleChange}
                            label='Email'
                            required
                        />
                        <FormInput 
                            type='password'
                            name='password'
                            value={password}
                            onChange={this.handleChange}
                            label='Password'
                            required
                        />
                        <FormInput 
                            type='password'
                            name='confirmPassword'
                            value={confirmPassword}
                            onChange={this.handleChange}
                            label='Confirm Password'
                            required
                        />
                    </div>
                    <div>
                        <CustomButton type='submit'>Sign Up</CustomButton>
                    </div>
                </CustomForm>
            </CustomFormContainer>
        )
    }
}

const mapDispatchToProps = (dispatch) => ({
    displayToastProp: content => dispatch(displayToast(content))
});

export default connect(null, mapDispatchToProps)(SignUp);