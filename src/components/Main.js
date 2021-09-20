import React, { Component } from 'react';


class Main extends Component {

  render() {
    return (
      <div className="container-fluid mt-5">
        <div className="row">
          <main role="main" className="col-lg-12 ml-auto mr-auto" style={{ maxWidth: '500px' }}>
            <div className="content mr-auto ml-auto">
              <p>&nbsp;</p>
              <form onSubmit={(e) => {
                e.preventDefault();
                const firstName = this.firstName.value;
                const lastName = this.lastName.value;
                if (!firstName || !lastName) {
                  alert('Please enter a valid name.')
                } else {
                  this.props.createProfile(firstName, lastName);
                }
              }} action="">
                <div className={'form-group mr-sm-2'}>
                  <label className={'mr-2'} htmlFor="First Name" >First Name: </label>
                  <input type="text"
                         id={'firstName'}
                         name={'First Name'}
                         ref={(input => {this.firstName = input})}
                         placeholder={'First Name...'}
                         className={'form-control'}
                  />
                </div>
                <div className={'form-group mr-sm-2'}>
                  <label className={'mr-2'} htmlFor="Last Name" >Last Name: </label>
                  <input type="text"
                         name={'Last Name'}
                         id={'lastName'}
                         ref={(input => {this.lastName = input})}
                         placeholder={'Last Name...'}
                         className={'form-control'}
                  />
                </div>
                <button className={'btn btn-primary'}>Create Profile</button>
              </form>
              <p>&nbsp;</p>
            </div>
          </main>
        </div>
      </div>
    );
  }
}

export default Main;