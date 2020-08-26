import React, { Component } from 'react'
import {connect} from 'react-redux'
import {Redirect} from 'react-router-dom'

import Input from '../../components/UI/Input/Input';
import Button from '../../components/UI/Button/Button';
import Spinner from '../../components/UI/Spinner/Spinner';
import classes from './Auth.css';
import * as actions from '../../store/actions/index';
import {checkValidity} from '../../hoc/Shared/utility';

class Auth extends Component {

    state = {
        controlForm: {
            email: {
                elementType: 'input',
                elementConfig: {
                    type: 'email',
                    placeholder: 'Your email'
                },
                value: '',
                validation: {
                    required: true,
                    isEmail: true
                },
                valid: false,
                touched: false
            },
            password: {
                    elementType: 'input',
                    elementConfig: {
                        type: 'password',
                        placeholder: 'Password'
                    },
                    value: '',
                    validation: {
                        required: true,
                        minLength: 6
                    },
                    valid: false,
                    touched: false
             },
    },
    isSignup: true
}

    componentDidMount () {
        if(!this.props.buildingBurger && this.props.authRedirectPath !=='/'){
            this.props.onSetAuthRedirectPath();
        }
    }

    inputChangedHandler = (event, inputIdentifier) => {
        const updatedOrderForm = {
            ...this.state.controlForm
        };
        const updatedFormElement = { 
            ...updatedOrderForm[inputIdentifier]
        };
        updatedFormElement.value = event.target.value;
        updatedFormElement.valid = checkValidity(updatedFormElement.value, updatedFormElement.validation);
        updatedFormElement.touched = true;
        updatedOrderForm[inputIdentifier] = updatedFormElement;
        
        let formIsValid = true;
        for (let inputIdentifier in updatedOrderForm) {
            formIsValid = updatedOrderForm[inputIdentifier].valid && formIsValid;
        }
        this.setState({controlForm: updatedOrderForm, formIsValid: formIsValid});
    }

    submitHandler = ( event ) => {
        event.preventDefault();
        this.props.onAuth(this.state.controlForm.email.value, this.state.controlForm.password.value, this.state.isSignup);
    }

    switchAuthModeHandler = () => {
        this.setState(prevState => {
            return {isSignup: !prevState.isSignup};
        });
    }

    render() {
        const formElementsArray = [];
        for (let key in this.state.controlForm) {
            formElementsArray.push({
                id: key,
                config: this.state.controlForm[key]
            });
        }
        let form = (
            <form onSubmit={this.submitHandler}>
                {formElementsArray.map(formElement => (
                    <Input 
                        key={formElement.id}
                        elementType={formElement.config.elementType}
                        elementConfig={formElement.config.elementConfig}
                        value={formElement.config.value}
                        invalid={!formElement.config.valid}
                        shouldValidate={formElement.config.validation}
                        touched={formElement.config.touched}
                        changed={(event) => this.inputChangedHandler(event, formElement.id)} />
                ))}
                <Button btnType="Success" disabled={!this.state.formIsValid}>SUBMIT</Button>
            </form>
        );
        if ( this.props.loading ) {
            form = <Spinner />;
        }

        let errorMessage =null;
        //console.log(this.props);
        if(this.props.error){
            errorMessage = (
                <p>{this.props.error.message}</p>
            );
        }

        let authredirect = null;
        if(this.props.isAuthenticated){
            authredirect = <Redirect to={this.props.authRedirectPath}/>
        }

        return (
            <div className={classes.Auth}>
                <h4>Enter your Contact Data</h4>
                {authredirect}
                {errorMessage}
                {form}
                <Button 
                clicked = {this.switchAuthModeHandler}
                btnType="Danger" >SWITCH TO {this.state.isSignup ? 'SIGNIN' : 'SIGNUP'}</Button>
            </div>
        );
    }
}

const mapStateToProps = state => {
    return {
        loading: state.auth.loading,
        error: state.auth.error,
        isAuthenticated: state.auth.token !== null,
        buildingBurger: state.burgerBuilder.building,
        authRedirectPath: state.auth.authRedirectPath
    };
};

const mapDispatchToProps = dispatch => {
    return {
        onAuth: (email, password, isSignup) => dispatch(actions.auth(email, password, isSignup)),
        onSetAuthRedirectPath: () => dispatch(actions.setAuthRedirectPath('/'))
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(Auth);