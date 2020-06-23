import React from 'react';
import {
  StyleSheet,
  ScrollView,
  View,
  Text,
  TextInput,
  StatusBar,
  Dimensions,
  Image,
  TouchableOpacity
} from 'react-native';

import styles from './ChatStyle';
import WatsonChat from '../../../assets/scripts/chat';

class Chat extends React.Component {
  constructor(props) {
    super(props);
    this.url = '';
    this.iam_apikey = '';
    this.workspaceId = '';
    this.watson = new WatsonChat();
    this.watson.init(this.url, this.iam_apikey, this.workspaceId, true);

    this.state = {
      messages: [],
      chatInput: ''
    };
  }

  sendMessage = () => {
    let timeNowInputMsg = new Date().toLocaleTimeString();
    timeNowInputMsg = timeNowInputMsg.substr(
      0,
      timeNowInputMsg.lastIndexOf(':')
    );
    const inputMsgTime = this.watson.convertTimeToAMPM(timeNowInputMsg);
    const messages = this.state.messages.slice();
    messages.push(
      Object.assign(
        {},
        { msg: this.state.chatInput, isWatson: false, time: inputMsgTime }
      )
    );
    this.setState(
      {
        messages: messages
      },
      () => {
        this.watson.sendMessage(
          this.state.messages,
          this.state.chatInput,
          (err, msgs) => {
            if (msgs) {
              this.setState({
                messages: msgs,
                chatInput: ''
              });
            }
          }
        );
      }
    );
  };

  renderMessages = () => {
    const renderMessages = [];
    this.state.messages.map((message, index) => {
      if (message.isWatson) {
        renderMessages.push(
          <View style={styles.botMsgContainer} key={index + 1}>
            <View style={styles.botMsgWrapper}>
              <View style={styles.botMsg}>
                <Text style={styles.botChatboxHead}>BOT</Text>
                <Text style={styles.botChatText}>{message.msg}</Text>
              </View>
              <Text style={styles.botMsgTime}>{message.time}</Text>
            </View>
          </View>
        );
      } else {
        renderMessages.push(
          <View style={styles.userMsg} key={index + 1}>
            <Text style={styles.userChatboxHead}>USER</Text>
            <Text style={styles.userChatText}>{message.msg}</Text>
          </View>
        );
      }
    });
    return renderMessages;
  };
  render() {
    return (
      <>
        <View style={styles.parent}>
          <StatusBar backgroundColor="#303740" />
          <View style={styles.chatContainer}>
            <ScrollView style={styles.msgContainer}>
              {this.renderMessages()}
            </ScrollView>
          </View>
          <View style={styles.inputBoxContainer}>
            <TextInput
              placeholder="Your message here.."
              style={styles.chatboxTextInput}
              onChangeText={text => this.setState({ chatInput: text })}
              value={this.state.chatInput}
            />
            <TouchableOpacity
              onPress={() => {
                this.sendMessage();
              }}
            >
              <View style={styles.sendImage}>
                <Image
                  source={require('../../../assets/images/sendsimple.png')}
                  style={styles.sendImg}
                />
              </View>
            </TouchableOpacity>
          </View>
        </View>
      </>
    );
  }
}

export default Chat;
