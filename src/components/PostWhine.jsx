import "./component-styles/PostWhine.css";
import React, {
  useState,
  useMemo,
  useRef,
  useCallback,
  useEffect,
} from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import { postWhine } from "../redux/actions/userActions";
import loader from "../assets/static/ajax-loader-blue.gif";
import throttle from "../util/throttle_func";
import "@draft-js-plugins/mention/lib/plugin.css";
import { EditorState } from "draft-js";
import Editor from "@draft-js-plugins/editor";
import { getSearchAutoComplete } from "../redux/actions/dataActions";
import createMentionPlugin, {
  defaultSuggestionsFilter,
} from "@draft-js-plugins/mention";

function PostWhine(props) {
  const [errors, setErrors] = useState("");
  const ref = useRef(null);
  const [editorState, setEditorState] = useState(() =>
    EditorState.createEmpty()
  );
  const [open, setOpen] = useState(true);
  const [suggestions, setSuggestions] = useState([]);
  useEffect(() => {
    setSuggestions(props.mentions);
  }, [props.mentions]);

  const { MentionSuggestions, plugins } = useMemo(() => {
    const mentionPlugin = createMentionPlugin({
      entityMutability: "IMMUTABLE",
      mentionPrefix: "@",
      supportWhitespace: false,
    });
    // eslint-disable-next-line no-shadow
    const { MentionSuggestions } = mentionPlugin;
    // eslint-disable-next-line no-shadow
    const plugins = [mentionPlugin];
    return { plugins, MentionSuggestions };
  }, []);

  const onOpenChange = useCallback((_open) => {
    setOpen(_open);
  }, []);
  const onSearchChange = useCallback(({ value }) => {
    if (value.trim().length) {
      throttle(props.getSearchAutoComplete(value, true), 50);
    }
    setSuggestions(defaultSuggestionsFilter(value, props.mentions));
  }, []);

  const handleClick = (e) => {
    e.preventDefault();
    let whineAction = {};
    let x = document.querySelector(".DraftEditor-editorContainer").textContent;
    whineAction.body = x;
    whineAction.body = whineAction.body.trim();
    whineAction.originalAuthor = "";
    if (whineAction.body.length <= 0) {
      setErrors("Can't be empty");
    } else if (whineAction.body.length > 300) {
      setErrors(
        `Whine is ${whineAction.body.length} characters long which exceeds character limit of 300`
      );
    } else {
      props.postWhine(whineAction);
      setEditorState(() => EditorState.createEmpty(""));
      setTimeout(() => {
        if (props.toggleEdit) {
          props.toggleEdit();
        }
      }, 500);
    }
  };
  return (
    <div className="post-input">
      {/* <div
          type="text"
          className="post-title post-message"
          id="post-message"
          data-placeholder="Complain about Something..."
          contentEditable="true"
          onKeyUp={this.handleChange}
        ></div> */}
      <Editor
        editorKey={"editor"}
        editorState={editorState}
        onChange={setEditorState}
        plugins={plugins}
        ref={ref}
        placeholder="Complain about Something"
      />
      <MentionSuggestions
        open={open}
        onOpenChange={onOpenChange}
        suggestions={suggestions}
        onSearchChange={onSearchChange}
        onAddMention={() => {
          // get the mention object selected
        }}
      />
      <button type="submit" className="btn-post" onClick={handleClick}>
        {props.whineLoading ? <img src={loader} alt="loading" /> : "Post"}
      </button>
      <div className="post-whine-error">{errors ? errors : null}</div>
    </div>
  );
}

PostWhine.propTypes = {
  whineLoading: PropTypes.bool.isRequired,
  postWhine: PropTypes.func.isRequired,
};

const mapStateToProps = (state) => ({
  whineLoading: state.user.whineLoading,
  mentions: state.data.mentions,
});
const mapActionToProps = {
  postWhine,
  getSearchAutoComplete,
};

export default connect(mapStateToProps, mapActionToProps)(PostWhine);
