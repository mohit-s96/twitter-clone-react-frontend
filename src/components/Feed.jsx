import React from "react";
import "./component-styles/Feed.css";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHeart } from "@fortawesome/free-solid-svg-icons";
import { faReply } from "@fortawesome/free-solid-svg-icons";
import { faRetweet } from "@fortawesome/free-solid-svg-icons";
import { faChevronDown } from "@fortawesome/free-solid-svg-icons";
import { faTrash } from "@fortawesome/free-solid-svg-icons";
import relativeTime from "dayjs/plugin/relativeTime";
import { Link } from "react-router-dom";
import dayjs from "dayjs";
import {
  likeUnlikeWhine,
  postRewhine,
  deleteWhine,
} from "../redux/actions/userActions";
import { viewOneWhine } from "../redux/actions/dataActions";
import parseBody from "../util/parseBody";
import FollowSuggestion from "./FollowSuggestion";
dayjs.extend(relativeTime);

class Feed extends React.Component {
  constructor() {
    super();
    this.state = {
      modalOpen: "",
    };
  }
  render() {
    const {
      user: { userFeed, message },
    } = this.props;
    // let sortedFeed = [];
    // if(userFeed.length > 0){
    //     sortedFeed = userFeed.sort(function(a, b) {
    //         return (a.createdAt < b.createdAt) ? 1 : ((a.createdAt > b.createdAt) ? -1 : 0);
    //     });
    // }
    let whines = (
      <div className="single-feed-container">
        <h3>Loading</h3>;
      </div>
    );
    if (userFeed) {
      whines =
        userFeed.length > 0 ? (
          userFeed.map((x, i) => {
            if (i !== (userFeed.length < 10 ? 3 : 9)) {
              return (
                <div
                  className="single-feed-container"
                  key={
                    x.reWhinedBy
                      ? `${Math.random() * 10000 + x.whineId}`
                      : x.whineId
                  }
                >
                  <div
                    className="one-whine"
                    onClick={(e) =>
                      this.handleViewWhine(x.whineId, x.handle, e)
                    }
                  >
                    <div className="rewhine-message-container">
                      {x.reWhinedBy ? (
                        <div>
                          <span className="rewhine-icon">
                            <FontAwesomeIcon icon={faRetweet} />
                          </span>
                          <span className="rewhine-message">
                            {x.reWhinedBy} re-whined
                          </span>
                        </div>
                      ) : null}
                    </div>
                    <div className="handle-container">
                      <div className="whine-image">
                        <Link to={`/user/${x.handle}`}>
                          <img src={x.imgUrl} alt="user" />
                        </Link>
                      </div>
                      <Link to={`/user/${x.handle}`}>
                        <span className="handle-text">@{x.handle} · </span>
                      </Link>
                      <span className="whine-time">
                        {dayjs(x.createdAt).fromNow(true)}
                      </span>
                      <div className="delete-btn-feed">
                        {message.handle === x.handle ? (
                          <div>
                            <FontAwesomeIcon
                              icon={faChevronDown}
                              onClick={this.toggleDeleteView}
                              data-id={x.whineId}
                            />
                            {this.state.modalOpen === x.whineId ? (
                              <div
                                className="delete-modal"
                                onBlur={this.blurEvent}
                                tabIndex={0}
                                onClick={(e) =>
                                  this.deleteOneWhine(x.whineId, x.handle, e)
                                }
                              >
                                <FontAwesomeIcon icon={faTrash} />
                              </div>
                            ) : null}
                          </div>
                        ) : null}
                      </div>
                    </div>
                    <div className="whine-body-container">
                      <div className="whine-text">
                        <div
                          className="safe-click"
                          dangerouslySetInnerHTML={{
                            __html: parseBody(x.body),
                          }}
                        />
                      </div>
                      <div className="engagement-wrapper">
                        <div className="engagement">
                          <div
                            className="fa-container reply"
                            onClick={() =>
                              this.handleReply(x.whineId, x.handle)
                            }
                          >
                            <FontAwesomeIcon
                              className="replied"
                              icon={faReply}
                            />
                          </div>
                          <span className="engagement-count">{x.comments}</span>
                        </div>
                        <div className="engagement">
                          <div
                            className="fa-container rewhine"
                            onClick={() =>
                              this.handleRewhine(x.whineId, x.handle, message)
                            }
                          >
                            {message.rewhines.includes(x.whineId) ? (
                              <FontAwesomeIcon
                                icon={faRetweet}
                                className="rewhined"
                              />
                            ) : (
                              <FontAwesomeIcon icon={faRetweet} />
                            )}
                          </div>
                          <span className="engagement-count">{x.reWhines}</span>
                        </div>
                        <div className="engagement">
                          <div
                            className="fa-container like"
                            onClick={() =>
                              this.handleLike(x.whineId, x.handle, message)
                            }
                          >
                            {message.likes.includes(x.whineId) ? (
                              <FontAwesomeIcon
                                icon={faHeart}
                                className="liked"
                              />
                            ) : (
                              <FontAwesomeIcon icon={faHeart} />
                            )}
                          </div>
                          <span className="engagement-count">{x.likes}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            } else {
              return (
                <>
                  {window.innerWidth <= 1028 ? (
                    <div className="single-feed-container">
                      <FollowSuggestion />
                    </div>
                  ) : null}
                </>
              );
            }
          })
        ) : (
          <div
            className="single-feed-container"
            style={{
              margin: "1em",
            }}
          >
            No whines to show. Follow some more users to see why they are
            depressed
            <FollowSuggestion />
          </div>
        );
    }

    return whines;
  }

  deleteOneWhine = (id, handle, e) => {
    let body = {
      originalAuthor: handle,
      whineId: id,
    };
    this.props.deleteWhine(body, true, "");
    this.setState({
      modalOpen: "",
    });
  };

  blurEvent = (e) => {
    if (e.relatedTarget) {
      if (
        !e.relatedTarget.classList.contains("delete-modal") &&
        e.relatedTarget.tagName !== "svg" &&
        e.relatedTarget.tagName !== "path"
      ) {
        this.setState({
          modalOpen: "",
        });
      }
    } else if (e.relatedTarget === null) {
      this.setState({
        modalOpen: "",
      });
    }
  };
  handleLike = (id, handle, message) => {
    let likeAction = {};
    likeAction.whineId = id;
    likeAction.originalAuthor = handle;
    if (message.likes.includes(id)) {
      likeAction.type = "unlike";
    } else {
      likeAction.type = "like";
    }
    this.props.likeUnlikeWhine(likeAction, "");
  };
  handleReply = (id, handle) => {
    this.props.viewOneWhine(id, handle);
  };

  toggleDeleteView = (e) => {
    e.persist();
    this.setState(
      {
        modalOpen: e.target.getAttribute("data-id")
          ? e.target.getAttribute("data-id")
          : e.target.parentElement.getAttribute("data-id"),
      },
      () => {
        e.target.nextElementSibling
          ? e.target.nextElementSibling.focus()
          : e.target.parentElement.nextElementSibling.focus();
      }
    );
  };

  handleViewWhine = (id, handle, e) => {
    if (e.target.classList) {
      if (
        !e.target.classList.contains("whine-image") &&
        !e.target.classList.contains("handle-text") &&
        !e.target.classList.contains("liked") &&
        !e.target.classList.contains("fa-container") &&
        !e.target.classList.contains("whine-time") &&
        !e.target.classList.contains("rewhined") &&
        !e.target.classList.contains("replied") &&
        !e.target.classList.contains("match") &&
        e.target.tagName !== "path" &&
        e.target.tagName !== "IMG" &&
        e.target.tagName !== "svg"
      ) {
        this.props.viewOneWhine(id, handle);
        setTimeout(() => {
          if (this.props.toggleWhine) {
            this.props.toggleWhine();
          } else {
            document.querySelector(".overlay").style.display = "block";
          }
        }, 500);
      }
    }
  };

  handleRewhine = (id, handle, message) => {
    let rewhineAction = {};
    rewhineAction.whineId = id;
    rewhineAction.originalAuthor = handle;
    if (!message.rewhines.includes(id)) {
      this.props.postRewhine(rewhineAction, "");
    }
  };
}

Feed.propTypes = {
  user: PropTypes.object.isRequired,
  likeUnlikeWhine: PropTypes.func.isRequired,
  postRewhine: PropTypes.func.isRequired,
  viewOneWhine: PropTypes.func.isRequired,
  singleWhineData: PropTypes.object.isRequired,
  deleteWhine: PropTypes.func.isRequired,
};

const mapStateToProps = (state) => ({
  user: state.user,
  singleWhineData: state.data.singleWhineData,
  topUsers: state.data.topUsers,
  suggestionLoading: state.data.suggestionLoading,
});
const mapActionToProps = {
  likeUnlikeWhine,
  postRewhine,
  viewOneWhine,
  deleteWhine,
};

export default connect(mapStateToProps, mapActionToProps)(Feed);
