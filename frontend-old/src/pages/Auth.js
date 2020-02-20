import React, {Component} from 'react';
import './Auth.css';
import AuthContext from '../context/auth-context';

class AuthPage extends Component {

    state = {
        isLogin: true
    };

    static contextTypes = AuthContext;

    constructor(props) {
        super(props);
        this.emailEl = React.createRef();
        this.passwordEl = React.createRef();
    }

    switchModeHandler = () => {
        this.setState(preState => {
            return {isLogin: !preState.isLogin}
        })
    }

    submitHandler = event => {
        event.preventDefault();

        const email = this.emailEl.current.value;
        const password = this.passwordEl.current.value;

        if (email.trim().length === 0 || password.trim().length === 0) {
            return;
        }
            // console.log(email,password);
        
        let requstBody = {
            query: `
                query {
                    login(email:"${email}",password:"${password}"){
                        userId,
                        token,
                        tokenExpiration
                    }
                }
            `
        };
        if (!this.state.isLogin) {
            requstBody = {
                query: `
                mutation {
                    createUser(userInput : {email:"${email}",password:"${password}"}){
                        _id,
                        email
                    }
                }
            `
            };
        }

        fetch("http://localhost:8000/graphql", {
            method: "POST",
            body: JSON.stringify(requstBody),
            headers: {
                'Content-type': 'application/json'     
            }
        }).then(res => {
            if (res.status !== 200 && res.status !== 201) {
                throw new Error('Failed');
            }
            return res.json();
        }).then(resData => {
            if (resData.data.login.token) {
                this.context.login(
                    resData.data.login.token,
                    resData.data.login.userId,
                    resData.data.login.tokenExpiration
                );
            }
            console.log(resData);
        }).catch(err => {
            console.log(err);
        });
    }


    render() {
        return (
            <form className="auth-form" onSubmit={this.submitHandler} >
            <div className="form-control">
              <label htmlFor="email">E-Mail</label>
              <input type="text" id="email" ref={this.emailEl} />
            </div>
            <div className="form-control">
              <label htmlFor="password">Password</label>
              <input type="password" id="password" ref={this.passwordEl} />
            </div>
            <div className="form-actions">
              <button type="submit">Submit</button>
              <button type="button" onClick={this.switchModeHandler}>
                        Switch to {this.state.isLogin ? 'SingUp' : 'login'}
              </button>
            </div>
          </form>
        );
    }
}

export default AuthPage;