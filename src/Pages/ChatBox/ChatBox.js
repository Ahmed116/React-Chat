import React from "react";
import { Card } from "react-bootstrap";
import ReactLoading from "react-loading";
import "react-toastify/dist/ReactToastify.css";
import firebase from "../../Services/firebase";
import Images from "../../ProjectImages/ProjectImages";
import moment from "moment";
import "./ChatBox.css";
import LoginString from "../Login/LoginStrings";
import "bootstrap/dist/css/bootstrap.min.css";
import CustomDialogContent from "../../Components/CustomDialog";
import { Alert, CustomDialog } from "react-st-modal";

export default class ChatBox extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: false,
      isShowSticker: false,

      inputValue: "",
    };

    this.currentUserName = localStorage.getItem(LoginString.Name);

    this.currentUserId = localStorage.getItem(LoginString.ID);

    this.currentUserPhoto = localStorage.getItem(LoginString.PhotoURL);

    this.currentUserDocumentId = localStorage.getItem(
      LoginString.FirebaseDocumentId
    );

    this.stateChanged = localStorage.getItem(LoginString.UPLOAD_CHANGED);

    this.currentPeerUser = this.props.currentPeerUser;

    this.groupChatId = null;

    this.listMessage = [];

    this.currentPeerUserMessages = [];
    this.removeListener = null;
    this.currentPhotoFile = null;
    firebase
      .firestore()
      .collection("users")
      .doc(this.currentPeerUser.documentkey)
      .get()
      .then((docRef) => {
        this.currentPeerUserMessages = docRef.data().messages;
      });
  }
  componentDidUpdate() {
    this.scrollToBottom();
  }

  componentWillReceiveProps(newProps) {
    if (newProps.currentPeerUser) {
      this.currentPeerUser = newProps.currentPeerUser;
      this.getListHistory();
    }
  }
  componentDidMount() {
    this.getListHistory();
  }
  componentWillUnmount() {
    if (this.removeListener) {
      this.removeListener();
    }
  }

  getListHistory = () => {
    if (this.removeListener) {
      this.removeListener();
    }
    this.listMessage.length = 0;
    this.setState({ isLoading: true });
    if (
      this.hashString(this.currentUserId) <=
      this.hashString(this.currentPeerUser.id)
    ) {
      this.groupChatId = `${this.currentUserId}-${this.currentPeerUser.id}`;
    } else {
      this.groupChatId = `${this.currentPeerUser.id}-${this.currentUserId}`;
    }

    //Get history and listen new data added

    this.removeListener = firebase
      .firestore()
      .collection("Messages")
      .doc(this.groupChatId)
      .collection(this.groupChatId)
      .onSnapshot(
        (snapshot) => {
          console.log(snapshot, 'snapshot')
          this.listMessage = snapshot.docs.map((doc) => doc.data())
          this.setState({ isLoading: false });
        },
        (err) => {
          this.props.showToast(0, err.toString());
        }
      );
  };

  //   type 0 = text
  //   type 1 = images
  //   type 2 = stickers

  onSendMessage = (content, type) => {
    if (this.state.isShowSticker && type === 2) {
      this.setState({ isShowSticker: false });
    }
    if (content.trim() === "") {
      return;
    }
    const timestamp = moment().valueOf().toString();

    const itemMessage = {
      idFrom: this.currentUserId,
      idTo: this.currentPeerUser.id,
      timestamp: timestamp,
      content: content.trim(),
      type: type,
    };

    firebase
      .firestore()
      .collection("Messages")
      .doc(this.groupChatId)
      .collection(this.groupChatId)
      .doc(timestamp)
      .set(itemMessage)
      .then(() => {
        this.setState({ inputValue: "" });
      });

    const notificationMessages = this.currentPeerUserMessages.map((item) => {
      console.log(item.notificationId !== this.currentUserId);
      if (item.notificationId !== this.currentUserId) {
        return {
          notificationId: item.notificationId,
          number: item.number, //to send number of notifications
        };
      }
    });

    console.log(this.currentPeerUser, "this.currentPeerUser.documentkey");
    console.log(notificationMessages, "notificationMessages");

    firebase
      .firestore()
      .collection("users")
      .doc(this.currentPeerUser.documentkey)
      .update({ unReadMessages: this.currentPeerUser.unReadMessages + 1 })
      .then((data) => {})
      .catch((err) => {
        this.props.showToast(0, err.toString());
      });
  };
  scrollToBottom = () => {
    if (this.messagesEnd) {
      this.messagesEnd.scrollIntoView({});
    }
  };
  onKeyboardPress = (event) => {
    if (event.key === "Enter") {
      this.onSendMessage(this.state.inputValue, 0);
    }
  };
  openListSticker = () => {
    this.setState({ isShowSticker: !this.state.isShowSticker });
  };

  Prompt = async (item) => {
    console.log(item.timestamp, "MESSAGE");
    const content = await CustomDialog(
      <CustomDialogContent
        defaultValue={item.content}
        showToast={this.props.showToast}
        onSendMessage={this.onSendMessage}
        renderStickers={this.renderStickers}
        currentUserId={this.currentUserId}
        currentPeerUser={this.currentPeerUser}
        groupChatId={this.groupChatId}
        item={item}
        
      />,
      {
        title: "Edit Message?",
        showCloseIcon: true,
      }
    );
  };

  render() {
    return (
      <Card className="viewChatBoard">
        <div className="headerChatBoard">
          <img
            className="viewAvatarItem"
            src={this.currentPeerUser.URL}
            alt=""
          />
          <span className="textHeaderChatBoard">
            <p style={{ fontSize: "20px" }}> {this.currentPeerUser.name}</p>
          </span>
          <div className="aboutme">
            <span>
              <p>{this.currentPeerUser.description}</p>
            </span>
          </div>
        </div>
        <div className="viewListContentChat">
          {this.renderListMessage()}

          <div
            style={{ float: "left", clear: "both" }}
            ref={(el) => {
              this.messagesEnd = el;
            }}
          />
        </div>

        {this.state.isShowSticker ? this.renderStickers() : null}
        <div className="viewBottom">
          <img
            className="icOpenGallery"
            src={Images.input_file}
            alt="icon open gallery"
            onClick={() => this.refInput.click()}
          />
          <input
            ref={(el) => {
              this.refInput = el;
            }}
            accept="image/*"
            className="viewInputGallery"
            type="file"
            onChange={this.onChoosePhoto}
          />

          <img
            className="icOpenSticker"
            src={Images.sticker}
            alt="icon open sticker"
            onClick={this.openListSticker}
          />

          <input
            className="viewInput"
            placeholder="Type a message"
            value={this.state.inputValue}
            onChange={(event) => {
              this.setState({ inputValue: event.target.value });
            }}
            onKeyPress={this.onKeyboardPress}
          />
          <img
            className="icSend"
            src={Images.send}
            alt="icon send"
            onClick={() => this.onSendMessage(this.state.inputValue, 0)}
          />
        </div>
        {this.state.isLoading ? (
          <div className="viewLoading">
            <ReactLoading
              type={"spin"}
              color={"#203152"}
              height={"3%"}
              width={"3%"}
            />
          </div>
        ) : null}
      </Card>
    );
  }
  onChoosePhoto = (event) => {
    if (event.target.files && event.target.files[0]) {
      this.setState({ isLoading: true });
      this.currentPhotoFile = event.target.files[0];
      const prefixFiletype = event.target.files[0].type.toString();
      if (prefixFiletype.indexOf("image/") === 0) {
        this.uploadPhoto();
      } else {
        this.setState({ isLoading: false });
        this.props.showToast(0, "This file is not an image");
      }
    } else {
      this.setState({ isLoading: false });
    }
  };
  uploadPhoto = () => {
    if (this.currentPhotoFile) {
      const timestamp = moment().valueOf().toString();

      const uploadTask = firebase
        .storage()
        .ref()
        .child(timestamp)
        .put(this.currentPhotoFile);

      uploadTask.on(
        LoginString.UPLOAD_CHANGED,
        null,
        (err) => {
          this.setState({ isLoading: false });
          this.props.showToast(0, err.message);
        },
        () => {
          uploadTask.snapshot.ref.getDownloadURL().then((downloadURL) => {
            this.setState({ isLoading: false });
            this.onSendMessage(downloadURL, 1);
          });
        }
      );
    } else {
      this.setState({ isLoading: false });
      this.props.showToast(0, "File is null");
    }
  };
  renderListMessage = () => {
    if (this.listMessage.length > 0) {
      let viewListMessage = [];
      this.listMessage.forEach((item, index) => {
        if (item.idFrom === this.currentUserId) {
          if (item.type === 0) {
            viewListMessage.push(
              <div
                className="viewItemRight"
                key={item.timestamp}
                // onClick={() => this.Prompt(item)}
              >
                <div
                 onClick={() => this.Prompt(item)}
                 className="editIcon"><i className="fa-solid fa-pen-to-square"></i></div>
                <span className="textContentItem">{item.content}</span>
              </div>
            );
          } else if (item.type === 1) {
            viewListMessage.push(
              <div
                className="viewItemRight2"
                key={item.timestamp}
                // onClick={() => this.Prompt(item)}
              >
                <div
                 onClick={() => this.Prompt(item)}
                 className="editIcon"><i className="fa-solid fa-pen-to-square"></i></div>
                <img
                  className="imgItemRight"
                  src={item.content}
                  alt="content message"
                />
              </div>
            );
          } else {
            viewListMessage.push(
              <div
                className="viewItemRight3"
                key={item.timestamp}
                onClick={() => this.Prompt(item)}
              >
                <div
                 onClick={() => this.Prompt(item)}
                 className="editIcon"><i className="fa-solid fa-pen-to-square"></i></div>
                <img
                  className="imgItemRight"
                  src={this.getGifImage(item.content)}
                  alt="content message"
                />
              </div>
            );
          }
        } else {
          if (item.type === 0) {
            viewListMessage.push(
              <div className="viewWrapItemLeft" key={item.timestamp}>
                <div className="viewWrapItemLeft3">
                  {this.isLastMessageLeft(index) ? (
                    <img
                      src={this.currentPeerUser.URL}
                      alt="avatar"
                      className="peerAvatarLeft"
                    />
                  ) : (
                    <div className="viewPaddingLeft" />
                  )}
                  <div className="viewItemLeft">
                    <span className="textContentItem">{item.content}</span>
                  </div>
                </div>
                {this.isLastMessageLeft(index) ? (
                  <span className="textTimeLeft">
                    <div className="time">
                      {moment(Number(item.timestamp)).format("ll")}
                    </div>
                  </span>
                ) : null}
              </div>
            );
          } else if (item.type === 1) {
            viewListMessage.push(
              <div className="viewWrapItemLeft2" key={item.timestamp}>
                <div className="viewWrapItemLeft3">
                  {this.isLastMessageLeft(index) ? (
                    <img
                      src={this.currentPeerUser.URL}
                      alt="avatar"
                      className="peerAvatarLeft"
                    />
                  ) : (
                    <div className="viewPaddingLeft" />
                  )}
                  <div className="viewItemLeft2">
                    <img
                      className="imgItemLeft"
                      src={item.content}
                      alt="content message"
                    />
                  </div>
                </div>
                {this.isLastMessageLeft(index) ? (
                  <span className="textTimeLeft">
                    <div className="time">
                      {moment(Number(item.timestamp)).format("ll")}
                    </div>
                  </span>
                ) : null}
              </div>
            );
          } else {
            viewListMessage.push(
              <div className="viewWrapItemLeft2" key={item.timestamp}>
                <div className="viewWrapItemLeft3">
                  {this.isLastMessageLeft(index) ? (
                    <img
                      src={this.currentPeerUser.URL}
                      alt="avatar"
                      className="peerAvatarLeft"
                    />
                  ) : (
                    <div className="viewPaddingLeft" />
                  )}
                  <div className="viewItemLeft3" key={item.timestamp}>
                    <img
                      className="imgItemLeft"
                      src={this.getGifImage(item.content)}
                      alt="content message"
                    />
                  </div>
                </div>
                {this.isLastMessageLeft(index) ? (
                  <span className="textTimeLeft">
                    <div className="time">
                      <div className="timesetup">
                        {moment(Number(item.timestamp)).format("ll")}
                      </div>
                    </div>
                  </span>
                ) : null}
              </div>
            );
          }
        }
      });
      return viewListMessage;
    } else {
      return (
        <div className="viewWrapSayHi">
          <span className="textSayHi">Say hi to new friend</span>
          <img className="imgWaveHand" src={Images.wave_hand} alt="wave hand" />
        </div>
      );
    }
  };
  renderStickers = () => {
    return (
      <div className="viewStickers">
        <img
          className="imgSticker"
          src={Images.lego1}
          alt="sticker"
          onClick={() => {
            this.onSendMessage("lego1", 2);
          }}
        />
        <img
          className="imgSticker"
          src={Images.lego2}
          alt="sticker"
          onClick={() => this.onSendMessage("lego2", 2)}
        />
        <img
          className="imgSticker"
          src={Images.lego3}
          alt="sticker"
          onClick={() => this.onSendMessage("lego3", 2)}
        />
        <img
          className="imgSticker"
          src={Images.lego4}
          alt="sticker"
          onClick={() => this.onSendMessage("lego4", 2)}
        />
        <img
          className="imgSticker"
          src={Images.lego5}
          alt="sticker"
          onClick={() => this.onSendMessage("lego5", 2)}
        />
        <img
          className="imgSticker"
          src={Images.lego6}
          alt="sticker"
          onClick={() => this.onSendMessage("lego6", 2)}
        />

        <img
          className="imgSticker"
          src={Images.mimi1}
          alt="sticker"
          onClick={() => this.onSendMessage("mimi1", 2)}
        />
        <img
          className="imgSticker"
          src={Images.mimi2}
          alt="sticker"
          onClick={() => this.onSendMessage("mimi2", 2)}
        />

        <img
          className="imgSticker"
          src={Images.mimi4}
          alt="sticker"
          onClick={() => this.onSendMessage("mimi4", 2)}
        />
        <img
          className="imgSticker"
          src={Images.mimi5}
          alt="sticker"
          onClick={() => this.onSendMessage("mimi5", 2)}
        />
        <img
          className="imgSticker"
          src={Images.mimi6}
          alt="sticker"
          onClick={() => this.onSendMessage("mimi6", 2)}
        />
        <img
          className="imgSticker"
          src={Images.mimi7}
          alt="sticker"
          onClick={() => this.onSendMessage("mimi7", 2)}
        />
        <img
          className="imgSticker"
          src={Images.mimi8}
          alt="sticker"
          onClick={() => this.onSendMessage("mimi8", 2)}
        />
        <img
          className="imgSticker"
          src={Images.mimi9}
          alt="sticker"
          onClick={() => this.onSendMessage("mimi9", 2)}
        />
      </div>
    );
  };
  getGifImage = (value) => {
    switch (value) {
      case "lego1":
        return Images.lego1;
      case "lego2":
        return Images.lego2;
      case "lego3":
        return Images.lego3;
      case "lego4":
        return Images.lego4;
      case "lego5":
        return Images.lego5;
      case "lego6":
        return Images.lego6;
      case "mimi1":
        return Images.mimi1;
      case "mimi2":
        return Images.mimi2;
      case "mimi4":
        return Images.mimi4;
      case "mimi5":
        return Images.mimi5;
      case "mimi6":
        return Images.mimi6;
      case "mimi7":
        return Images.mimi7;
      case "mimi8":
        return Images.mimi8;
      case "mimi9":
        return Images.mimi9;
      default:
        return null;
    }
  };
  hashString = (str) => {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      hash += Math.pow(str.charCodeAt(i) * 31, str.length - i);
      hash = hash & hash; // Convert to 32bit integer
    }
    return hash;
  };
  isLastMessageLeft(index) {
    if (
      (index + 1 < this.listMessage.length &&
        this.listMessage[index + 1].idFrom === this.currentUserId) ||
      index === this.listMessage.length - 1
    ) {
      return true;
    } else {
      return false;
    }
  }

  isLastMessageRight(index) {
    if (
      (index + 1 < this.listMessage.length &&
        this.listMessage[index + 1].idFrom !== this.currentUserId) ||
      index === this.listMessage.length - 1
    ) {
      return true;
    } else {
      return false;
    }
  }
}
