import React, {useEffect, useState, useRef } from 'react';
import { Text, View, TouchableOpacity,Button, TextInput, StyleSheet, ScrollView} from "react-native";
import {SafeAreaView, SafeAreaProvider} from 'react-native-safe-area-context';
import Slider from '@react-native-community/slider';

// ws://192.168.0.210/ws
export default function Index() {const [ws, setWs] = useState(null);
  const [message, setMessage] = useState('');
  const [receivedMessages, setReceivedMessages] = useState([]);

  useEffect(() => {
    const newWs = new WebSocket('ws://192.168.0.210/ws');

    newWs.onopen = () => {
      console.log('Connected to WebSocket server');
      setWs(newWs);
    };

    newWs.onmessage = event => {
      // console.log(`Received message: ${event.data}`);
      setReceivedMessages(prevMessages => [...prevMessages, event.data]);
    };

    newWs.onerror = error => {
      console.error('WebSocket error:', error);
    };

    newWs.onclose = () => {
      console.log('Disconnected from WebSocket server');
      setWs(null);
    };

    return () => {
      newWs.close();
    };
  }, []);

  const sendMessage = () => {
    if (ws && ws.readyState === WebSocket.OPEN) {
      ws.send(("a-"+message));
      setMessage('');
    }
  };
  const stopSeekingMsg = () => {
    if (ws && ws.readyState === WebSocket.OPEN) {
      ws.send('b');
    }
  };

  return (
    <>
      <TextInput
        value={message}
        onChangeText={setMessage}
        placeholder="enter target"
        inputMode='numeric'
      />
      <Button title="Send" onPress={sendMessage} />
      <View style={styles.separator}></View>
      <Button title="Stop Seeking" onPress={stopSeekingMsg} />
      <ScrollView
      style={styles.textBox}
      >
        <Text>Received Messages:</Text>
        {receivedMessages.toReversed().map((msg, index) => (
          <Text key={index}>{msg}</Text>
        ))}
      </ScrollView>
      
      
    </>
  );
}

const styles = StyleSheet.create({
  slider: {
    width: 400,
    height: 100
  },
  button:{
    backgroundColor: "red",
    padding:8,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 5
  },
  container: {
    flex: 1,
    justifyContent: "center",
    marginHorizontal: 16,
  },
  label: {
    fontSize: 16,
    marginBottom: 5,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 10,
  },
  error: {
    color: 'red',
    fontSize: 12,
    marginTop: 5,
  },
  fixToText: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  separator: {
    marginVertical: 40,
    borderBottomColor: '#737373',
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  textBox: {
    height: 600
  }
});