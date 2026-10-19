import React from "react";
import PropTypes from "prop-types";
import {
  Input,
  Button,
  Modal,
  Form,
  Select,
  Avatar,
  Popover,
  Icon,
} from "antd";
import { withRouter } from "react-router-dom";
import { requestOpportunitiesData } from "../../actions/opportunitiesActions";

import "./vertical-menu.scss";

const Search = Input.Search;
const Option = Select.Option;
const FormItem = Form.Item;

const fieldTwoList = {
  Accounts: "Rep: ",
  Contacts: "Email: ",
  Opportunities: "Contact: ",
};
const fieldThreeList = {
  Accounts: "Territory: ",
  Contacts: "Phone #: ",
  Opportunities: "ARR: ",
};

const userProfileContent = (
  // <div>
  //   <span>Visitor: &#9;&#9;</span>
  //   <span style={{ float: 'right' }}>{window.userInfo.visitor}</span>
  //   <br></br>
  //   <span>Account: &#9;&#9;</span>
  //   <span style={{ float: 'right' }}>{window.userInfo.account}</span>
  //   <br></br>
  //   <span>Role: &#9;&#9;</span>
  //   <span style={{ float: 'right' }}>{window.userInfo.role}</span>
  // </div>
  <table className="user-info-table">
    <tbody>
      <tr>
        <td>Visitor:</td>
        <td style={{ width: "10px" }}></td>
        <td>{window.userInfo.visitor}</td>
      </tr>
      <tr>
        <td>Account:</td>
        <td style={{ width: "10px" }}></td>
        <td>{window.userInfo.account}</td>
      </tr>
      <tr>
        <td>Role:</td>
        <td style={{ width: "10px" }}></td>
        <td>{window.userInfo.role}</td>
      </tr>
    </tbody>
  </table>
);

const ShowHeader = function (props) {
  if (props.title === "Mobile") {
    return null;
  }

  return (
    <div className="name-and-new">
      <h1>{props.title}</h1>
    </div>
  );
};

class Body extends React.Component {
  constructor(props) {
    super(props);

    // visible -> whether the modal should show or not (from "Add New")
    // OKLoading -> created a loading effect for the clicking ok on the modal
    // addNewFormData -> this is the information that gets updated, and eventualyl sent with Add New
    this.state = {
      title: props.title,
      visible: false,
      loading: false,
      addNewFormData: {
        value: "Accounts",
        fieldOne: "",
        fieldTwo: "",
        fieldThree: "",
      },
    };
  }

  // Open Modal
  _onAddNew(e) {
    e.preventDefault();

    // Set state of modal based on current page
    const path = window.location.pathname;
    const addNewFormData = Object.assign({}, this.state.addNewFormData);

    if (path.includes("accounts")) {
      addNewFormData["value"] = "Accounts";
    } else if (path.includes("contacts")) {
      addNewFormData["value"] = "Contacts";
    } else {
      addNewFormData["value"] = "Opportunities";
    }

    this.setState({
      addNewFormData,
    });

    this.setState({
      visible: true,
    });
  }

  // Close Modal
  _handleCancel(e) {
    this.setState({
      visible: false,
    });
  }

  _handleOk(e) {
    this.setState({ loading: true });
    setTimeout(() => {
      this.setState({
        loading: false,
        visible: false,
      });

      // Set local Storage objs
      localStorage.setItem(
        "addNewFormData",
        JSON.stringify(this.state.addNewFormData)
      );
      localStorage.setItem("loading", false);

      // Track record creation
      if (typeof pendo !== "undefined") {
        pendo.track("Record Created", {
          recordType: this.state.addNewFormData.value,
          recordName: this.state.addNewFormData.fieldOne,
          fieldTwoValue: this.state.addNewFormData.fieldTwo,
          fieldThreeValue: this.state.addNewFormData.fieldThree,
        });
      }

      this.props.history.push({
        pathname: this.state.addNewFormData.value + "/new/details",
        state: {
          field1: this.state.addNewFormData,
        },
      });
    }, 1000);
  }

  // Change <select> <option> value and set State
  _onHandleSelectChange(value) {
    let addNewFormData = Object.assign({}, this.state.addNewFormData);
    addNewFormData["value"] = value;
    this.setState({
      addNewFormData,
    });
  }

  // Change object that gets changed in Modal
  _onHandleChange(e) {
    let addNewFormData = Object.assign({}, this.state.addNewFormData);
    addNewFormData[e.target.name] = e.target.value;

    this.setState({
      addNewFormData,
    });
  }

  render() {
    const { title, visible, loading } = this.state;
    return (
      <>
        <div className="vertical-menu vertical-menu-top">
          {/* <div className="vertical-menu-item left title-container">
          <ShowHeader title={this.props.title} />
          </div> */}
          <div className="vertical-menu-item left search-container">
            <Search
              name="search"
              placeholder="Search"
              enterButton
              onSearch={(value) => {
                console.log(value);
                // Track search execution
                if (typeof pendo !== "undefined") {
                  pendo.track("Search Executed", {
                    searchQuery: value,
                    currentPage: window.location.pathname,
                    queryLength: value.length,
                  });
                }
              }}
            />
          </div>
          <div className="vertical-menu-item right avatar-container">
            <Popover
              placement="bottomRight"
              title="Profile"
              content={userProfileContent}
              className="user-profile"
              trigger="click"
            >
              <Avatar className="user-profile-avatar" size={40} icon="user" />
            </Popover>
          </div>
          <div className="vertical-menu-item right user-info-container">
            <span>{window.userInfo.visitorId}</span>
          </div>
          <div className="vertical-menu-item right divider-container">
            <div className="vertical-menu-divider"></div>
          </div>
          <div className="vertical-menu-item right help-container">
            <a
              id="help-button"
              href="http://help.pendo.io/"
              target="_blank"
              rel="noreferrer"
            >
              <img
                className="help-icon"
                src={"./images/help-icon.svg"}
                alt="help-icon"
              ></img>
            </a>
          </div>
        </div>
        <div className="vertical-menu vertical-menu-bottom">
          {/* <span className="button-span">SOME TEXT</span> */}
          <div className="vertical-menu-item left title-container">
            <ShowHeader title={this.props.title} />
          </div>
          <div className="vertical-menu-item right button-container">
            <Button
              type="primary"
              size="large"
              id="add-new"
              onClick={(e) => this._onAddNew(e)}
            >
              ADD NEW
            </Button>
          </div>
        </div>

        <Modal
          visible={visible}
          title="Create New"
          onOk={(e) => this._handleOk(e)}
          onCancel={(e) => this._handleCancel(e)}
          footer={[
            <Button key="back" onClick={(e) => this._handleCancel(e)}>
              Cancel
            </Button>,
            <Button
              key="submit"
              type="primary"
              onClick={(e) => this._handleOk(e)}
            >
              OK
            </Button>,
          ]}
        >
          <Form layout="vertical">
            <FormItem>
              <h3>Type:</h3>
              <Select
                value={this.state.addNewFormData.value}
                onChange={(value) => this._onHandleSelectChange(value)}
              >
                <Option value="Accounts">Account</Option>
                <Option value="Contacts">Contact</Option>
                <Option value="Opportunities">Opportunity</Option>
              </Select>
            </FormItem>
            <FormItem>
              <h3>Name:</h3>
              <Input
                value={this.state.addNewFormData.fieldOne}
                name="fieldOne"
                onChange={(e) => this._onHandleChange(e)}
              ></Input>
            </FormItem>
            <FormItem>
              <h3>{fieldTwoList[this.state.addNewFormData.value]}</h3>
              <Input
                value={this.state.addNewFormData.fieldTwo}
                name="fieldTwo"
                onChange={(e) => this._onHandleChange(e)}
              ></Input>
            </FormItem>
            <FormItem>
              <h3>{fieldThreeList[this.state.addNewFormData.value]}</h3>
              <Input
                value={this.state.addNewFormData.fieldThree}
                name="fieldThree"
                onChange={(e) => this._onHandleChange(e)}
              ></Input>
            </FormItem>
          </Form>
        </Modal>
      </>
    );
  }
}

export default withRouter(Body);

Body.propTypes = {
  title: PropTypes.string,
  history: PropTypes.object,
};

ShowHeader.propTypes = {
  title: PropTypes.string,
};
