import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import "../components/component-styles/Profile.css";
import { getPublicProfile } from "../redux/actions/dataActions";
import UnAuthNabar from "../components/UnAuthNavbar";
import AuthNavbar from "../components/AuthNavbar";
import Loader from "../components/Loader";
import PublicProfile from "../components/PublicProfile";
import PublicFeed from "../components/PublicFeed";
import MobileTopNav from "../components/MobileTopNav";
import MobileSearch from "../components/MobileSearch";
import { getOnlyUserData } from "../redux/actions/userActions";
import NotiModal from "../components/NotiModal";
import WhineView from "../components/WhineView";
import EditInfo from "../components/EditInfo";
import { withRouter } from "react-router-dom";
import { Helmet } from "react-helmet";
const callerType = "pfeed";
class UserProfile extends Component {
  constructor() {
    super();
    this.state = {
      device: "",
      profileOpen: false,
      notiOpen: false,
      whineOpen: false,
      updateOpen: false,
      searchOpen: false,
    };
  }
  componentWillMount() {
    if (window.innerWidth < 500) {
      this.setState({ device: "small" });
    } else {
      this.setState({ device: "large" });
    }
    this.props.getPublicProfile(this.props.match.params.handle, false);
    if (this.props.authenticated) {
      this.props.getOnlyUserData("reload");
    }
  }
  render() {
    return (
      <div>
        <Helmet>
          <title>{this.props.match.params.handle}</title>
        </Helmet>
        {this.props.netError ? (
          <Loader flag={true} />
        ) : !this.props.publicErrors.error ? (
          this.props.publoading || this.props.loading ? (
            <Loader />
          ) : this.state.device === "large" ? (
            <div>
              {this.props.authenticated ? <AuthNavbar /> : <UnAuthNabar />}
              <PublicProfile history={this.props.history} />
              <div className="feed-container">
                <PublicFeed />
              </div>
              {this.props.authenticated ? (
                <div
                  className="noti-container"
                  id="show-hide-noti"
                  onBlur={this.closeNotiModal}
                  tabIndex={0}
                >
                  <NotiModal />
                </div>
              ) : null}
              <div>
                <div className="overlay" id="overlay" onClick={this.closeView}>
                  <WhineView callerType={callerType} />
                </div>
              </div>
              <div>
                {
                  <div
                    className="overlay overlay2"
                    id="overlay2"
                    onClick={this._closeView}
                  >
                    <EditInfo />
                  </div>
                }
              </div>
            </div>
          ) : (
            <div>
              {!this.state.whineOpen &&
              !this.state.profileOpen &&
              !this.state.notiOpen &&
              !this.state.searchOpen ? (
                <>
                  <MobileTopNav
                    device={this.state.device}
                    toggleProfile={() => {
                      this.setState((p) => ({
                        profileOpen: !p.profileOpen,
                        whineOpen: false,
                        notiOpen: false,
                        searchOpen: false,
                      }));
                    }}
                  />
                  <div className="profile-modal-overlay">
                    <div
                      className="profile-container"
                      style={{ height: "100%" }}
                    >
                      <PublicFeed
                        toggleWhine={() => {
                          this.setState((p) => ({
                            whineOpen: !p.whineOpen,
                            notiOpen: false,
                            profileOpen: false,
                            searchOpen: false,
                          }));
                        }}
                        center={this.setDivCenter}
                      />
                    </div>
                  </div>
                </>
              ) : null}
              {this.state.searchOpen ? (
                <div className="profile-modal-overlay">
                  <div
                    className="profile-container"
                    style={{
                      backgroundColor: "#1da1f2",
                      position: "relative",
                      height: "95vh",
                    }}
                  >
                    <MobileSearch />
                  </div>
                </div>
              ) : null}
              {this.state.profileOpen ? (
                <div className="profile-modal-overlay">
                  <div className="profile-container" style={{ height: "100%" }}>
                    <PublicProfile
                      history={this.props.history}
                      editModal={() => {
                        this.setState(() => ({
                          notiOpen: false,
                          profileOpen: true,
                          whineOpen: false,
                          updateOpen: true,
                          searchOpen: false,
                        }));
                      }}
                    />
                  </div>
                </div>
              ) : null}
              {this.state.notiOpen ? (
                <div className="profile-modal-overlay">
                  <div
                    className="profile-container"
                    style={{ height: "100%", backgroundColor: "#1da1f2" }}
                  >
                    <NotiModal
                      toggleWhine={() => {
                        this.setState((p) => ({
                          whineOpen: !p.whineOpen,
                          notiOpen: false,
                          profileOpen: false,
                          updateOpen: false,
                          searchOpen: false,
                        }));
                      }}
                    />
                  </div>
                </div>
              ) : null}
              {this.state.whineOpen ? (
                <div className="profile-modal-overlay">
                  <div
                    className="profile-container"
                    style={{
                      backgroundColor: "#1da1f2",
                      position: "relative",
                      height: "95vh",
                    }}
                  >
                    <WhineView
                      callerType={callerType}
                      toggleWhine={() => {
                        this.setState((p) => ({
                          whineOpen: !p.whineOpen,
                          notiOpen: false,
                          profileOpen: false,
                          updateOpen: false,
                          searchOpen: false,
                        }));
                      }}
                    />
                  </div>
                </div>
              ) : null}
              {this.state.updateOpen ? (
                <div className="profile-modal-overlay">
                  <div className="profile-container" style={{ height: "95vh" }}>
                    <EditInfo
                      closeAll={() => {
                        this.setState(() => ({
                          notiOpen: false,
                          profileOpen: true,
                          whineOpen: false,
                          updateOpen: false,
                          searchOpen: false,
                        }));
                      }}
                    />
                  </div>
                </div>
              ) : null}
              {this.props.authenticated ? (
                <AuthNavbar
                  device={this.state.device}
                  toggleProfile={() => {
                    this.setState((p) => ({
                      profileOpen: !p.profileOpen,
                      whineOpen: false,
                      notiOpen: false,
                      updateOpen: false,
                      searchOpen: false,
                    }));
                  }}
                  toggleNoti={() => {
                    this.setState((p) => ({
                      notiOpen: !p.notiOpen,
                      profileOpen: false,
                      whineOpen: false,
                      updateOpen: false,
                      searchOpen: false,
                    }));
                  }}
                  closeAll={() => {
                    this.setState(() => ({
                      notiOpen: false,
                      profileOpen: false,
                      whineOpen: false,
                      updateOpen: false,
                      searchOpen: false,
                    }));
                  }}
                  openSearch={() => {
                    this.setState((p) => ({
                      searchOpen: !p.searchOpen,
                      notiOpen: false,
                      profileOpen: false,
                      whineOpen: false,
                      editOpen: false,
                    }));
                  }}
                />
              ) : (
                <UnAuthNabar
                  device={this.state.device}
                  closeAll={() => {
                    this.setState(() => ({
                      notiOpen: false,
                      profileOpen: false,
                      whineOpen: false,
                      updateOpen: false,
                    }));
                  }}
                  openSearch={() => {
                    this.setState((p) => ({
                      searchOpen: !p.searchOpen,
                      notiOpen: false,
                      profileOpen: false,
                      whineOpen: false,
                      editOpen: false,
                    }));
                  }}
                />
              )}
            </div>
          )
        ) : (
          <h3>Invalid User</h3>
        )}
      </div>
    );
  }

  closeView = (e) => {
    if (e.target.classList.contains("overlay")) {
      // document.getElementById('whine-view-toggle').classList.remove('show-whine-container');
      document.getElementById("overlay").style.display = "none";
    }
  };
  _closeView = (e) => {
    if (e.target.classList.contains("overlay2")) {
      // document.getElementById('whine-view-toggle').classList.remove('show-whine-container');
      document.getElementById("overlay2").style.display = "none";
    }
  };

  closeNotiModal = (e) => {
    if (!e.relatedTarget) {
      document.getElementById("show-hide-noti").classList.remove("show-notis");
    } else {
      if (!e.relatedTarget.classList.contains("dont-lose-focus")) {
        document
          .getElementById("show-hide-noti")
          .classList.remove("show-notis");
      }
    }
  };
}

UserProfile.propTypes = {
  publoading: PropTypes.bool.isRequired,
  authenticated: PropTypes.bool.isRequired,
  publicErrors: PropTypes.object.isRequired,
  getPublicProfile: PropTypes.func.isRequired,
  loading: PropTypes.bool.isRequired,
  getOnlyUserData: PropTypes.func.isRequired,
};
const mapActionToProps = {
  getPublicProfile,
  getOnlyUserData,
};
const mapStateToProps = (state) => ({
  publoading: state.data.publoading,
  publicErrors: state.ui.publicErrors,
  authenticated: state.user.authenticated,
  loading: state.user.loading,
  netError: state.ui.netError,
});

export default withRouter(
  connect(mapStateToProps, mapActionToProps)(UserProfile)
);
