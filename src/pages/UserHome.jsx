import React, { Component } from "react";
import { connect } from "react-redux";
import AuthNavbar from "../components/AuthNavbar";
import Loader from "../components/Loader";
import PropTypes from "prop-types";
import Feed from "../components/Feed";
import PostWhine from "../components/PostWhine";
import Profile from "../components/Profile";
import { getUserData, getPaginatedFeed } from "../redux/actions/userActions";
import { loadSuggestions } from "../redux/actions/dataActions";
import WhineView from "../components/WhineView";
import MobileSearch from "../components/MobileSearch";
import FollowSuggestion from "../components/FollowSuggestion";
import MobileTopNav from "../components/MobileTopNav";
import NotiModal from "../components/NotiModal";
import ajax from "../assets/static/ajax.gif";
import { Helmet } from "react-helmet";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPen } from "@fortawesome/free-solid-svg-icons";
const callerType = "feed";

export class UserHome extends Component {
  constructor() {
    super();
    this.state = {
      device: "",
      profileOpen: false,
      notiOpen: false,
      whineOpen: false,
      editOpen: false,
      searchOpen: false,
      listenerSet: false,
      reached: false,
    };
  }
  componentWillMount() {
    if (window.innerWidth <= 1028) {
      this.setState({ device: "small" });
    } else {
      this.setState({ device: "large" });
    }
    this.props.getUserData();
    setTimeout(() => {
      if (!this.props.user.authenticated) {
        window.location.href = "/";
      }
    }, 8000);
  }
  componentDidMount() {
    const unsub = setInterval(() => {
      if (document.querySelector(".feed-container")) {
        document
          .querySelector(".feed-container")
          .addEventListener("scroll", (e) => {
            //  console.log(e.target.scrollHeight, e.target.scrollTop + e.target.offsetHeight);
            if (
              e.target.scrollHeight <
              e.target.scrollTop + e.target.offsetHeight
            ) {
              this.testScroll();
            }
          });
        clearInterval(unsub);
      }
    }, 1000);
    window.addEventListener("resize", () => {
      if (window.innerWidth <= 1028 && this.state.device !== "small") {
        this.setState({ device: "small" });
      } else if (window.innerWidth >= 1300 && this.state.device !== "large") {
        this.setState({ device: "large" });
      }
    });
    this.props.loadSuggestions();
  }
  testScroll = () => {
    if (!this.props.user.pagedFetching && this.props.user.moreData) {
      console.log("called");
      this.props.getPaginatedFeed(this.props.user.refs);
    }
  };
  setDivCenter = function () {
    var div = document.querySelector(".whine-view-container");
    var Mheight = div.offsetHeight;
    var Wheight = window.innerHeight;
    div.style.top = (Wheight - Mheight) / 2 + window.pageYOffset + "px";
  };

  render() {
    const {
      user: { loading, authenticated },
    } = this.props;
    let x = !this.props.netError ? (
      !loading ? (
        authenticated ? (
          this.state.device === "large" ? (
            <div>
              <Helmet>
                <title>Home / Whiner</title>
              </Helmet>
              <AuthNavbar />
              <div className="feed-container">
                <PostWhine />
                <Feed />
                {this.props.user.pagedFetching ? (
                  <div
                    className="single-feed-container"
                    style={{ textAlign: "center", padding: "12px" }}
                  >
                    <img src={ajax} alt="ajax" />
                  </div>
                ) : null}
                {!this.props.user.moreData ? (
                  <div
                    className="single-feed-container"
                    style={{ textAlign: "center", padding: "12px" }}
                  >
                    <b>No more whines to show</b>
                  </div>
                ) : null}
              </div>
              <div className="profile-container">
                <Profile history={this.props.history} />
              </div>
              <div>
                <div className="overlay" id="overlay" onClick={this.closeView}>
                  <WhineView callerType={callerType} />
                </div>
              </div>
              <div>
                <FollowSuggestion />
              </div>
            </div>
          ) : (
            <div>
              <Helmet>
                <title>Home / Whiner</title>
              </Helmet>
              {/* <div className="feed-container"> */}
              {!this.state.whineOpen &&
              !this.state.profileOpen &&
              !this.state.notiOpen &&
              !this.state.editOpen &&
              !this.state.searchOpen ? (
                <>
                  <MobileTopNav
                    device={this.state.device}
                    toggleProfile={() => {
                      this.setState((p) => ({
                        profileOpen: !p.profileOpen,
                        whineOpen: false,
                        notiOpen: false,
                        editOpen: false,
                        searchOpen: false,
                      }));
                    }}
                  />
                  <div className="profile-modal-overlay">
                    <div
                      className="profile-container"
                      style={{ height: "100%" }}
                    >
                      <div className="feed-container">
                        <Feed
                          toggleWhine={() => {
                            this.setState((p) => ({
                              whineOpen: !p.whineOpen,
                              notiOpen: false,
                              profileOpen: false,
                              editOpen: false,
                              searchOpen: false,
                            }));
                          }}
                          center={this.setDivCenter}
                        />
                        {this.props.user.pagedFetching ? (
                          <div
                            className="single-feed-container"
                            style={{ textAlign: "center", padding: "12px" }}
                          >
                            <img src={ajax} alt="ajax" />
                          </div>
                        ) : null}
                        {!this.props.user.moreData ? (
                          <div
                            className="single-feed-container"
                            style={{ textAlign: "center", padding: "12px" }}
                          >
                            <b>No more whines to show</b>
                          </div>
                        ) : null}
                      </div>
                    </div>
                  </div>
                  <div
                    className="post-toggler"
                    onClick={() => {
                      this.setState((p) => ({
                        editOpen: !p.whineOpen,
                        notiOpen: false,
                        profileOpen: false,
                        whineOpen: false,
                        searchOpen: false,
                      }));
                    }}
                  >
                    <span>
                      <FontAwesomeIcon icon={faPen} />
                    </span>
                  </div>
                </>
              ) : null}
              {/* </div> */}
              {this.state.editOpen ? (
                <div className="profile-modal-overlay">
                  <div className="profile-container" style={{ height: "100%" }}>
                    <PostWhine
                      toggleEdit={() => {
                        this.setState((p) => ({
                          editOpen: false,
                          notiOpen: false,
                          profileOpen: false,
                          whineOpen: false,
                          searchOpen: false,
                        }));
                      }}
                    />
                  </div>
                </div>
              ) : null}
              {this.state.profileOpen ? (
                <div className="profile-modal-overlay">
                  <div className="profile-container" style={{ height: "100%" }}>
                    <Profile history={this.props.history} />
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
                          editOpen: false,
                          searchOpen: false,
                        }));
                      }}
                    />
                  </div>
                </div>
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
                          editOpen: false,
                          searchOpen: false,
                        }));
                      }}
                    />
                  </div>
                </div>
              ) : null}
              {/* <div><FollowSuggestion/></div> */}
              <AuthNavbar
                device={this.state.device}
                toggleProfile={() => {
                  this.setState((p) => ({
                    profileOpen: !p.profileOpen,
                    whineOpen: false,
                    notiOpen: false,
                    editOpen: false,
                    searchOpen: false,
                  }));
                }}
                toggleNoti={() => {
                  this.setState((p) => ({
                    notiOpen: !p.notiOpen,
                    profileOpen: false,
                    whineOpen: false,
                    editOpen: false,
                    searchOpen: false,
                  }));
                }}
                closeAll={() => {
                  this.setState(() => ({
                    notiOpen: false,
                    profileOpen: false,
                    whineOpen: false,
                    editOpen: false,
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
            </div>
          )
        ) : (
          <div>
            <p>redirect</p>
          </div>
        )
      ) : (
        <Loader />
      )
    ) : (
      <Loader flag={true} />
    );
    return x;
  }
  closeView = (e) => {
    if (e.target.classList.contains("overlay")) {
      // document.getElementById('whine-view-toggle').classList.remove('show-whine-container');
      document.getElementById("overlay").style.display = "none";
    }
  };
}

UserHome.propTypes = {
  user: PropTypes.object.isRequired,
  loadSuggestions: PropTypes.func.isRequired,
  getUserData: PropTypes.func.isRequired,
};
const mapStateToProps = (state) => ({
  user: state.user,
  netError: state.ui.netError,
});

const mapActionToProps = {
  getUserData,
  loadSuggestions,
  getPaginatedFeed,
};

export default connect(mapStateToProps, mapActionToProps)(UserHome);
