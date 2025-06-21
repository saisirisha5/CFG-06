import React, { useRef, useState } from "react";
import { Animated, FlatList, KeyboardAvoidingView, Platform, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";

export default function Chatbot() {
  const [visible, setVisible] = useState(false);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([
    { id: '1', from: 'bot', text: 'Hello! How can I help you?' }
  ]);
  const slideAnim = useRef(new Animated.Value(0)).current;

  const openChat = () => {
    setVisible(true);
    Animated.timing(slideAnim, {
      toValue: 1,
      duration: 300,
      useNativeDriver: true,
    }).start();
  };

  const closeChat = () => {
    Animated.timing(slideAnim, {
      toValue: 0,
      duration: 300,
      useNativeDriver: true,
    }).start(() => setVisible(false));
  };

  const sendMessage = () => {
    if (input.trim() === "") return;
    setMessages([...messages, { id: Date.now().toString(), from: 'user', text: input }]);
    setInput("");
    // Simulate bot reply
    setTimeout(() => {
      setMessages(msgs => [...msgs, { id: Date.now().toString(), from: 'bot', text: 'You said: ' + input }]);
    }, 800);
  };

  return (
    <View style={StyleSheet.absoluteFill} pointerEvents="box-none">
      {/* Floating Chatbot Icon */}
      {!visible && (
        <TouchableOpacity style={styles.fab} onPress={openChat}>
          <Text style={{ fontSize: 32 }}>🤖</Text>
        </TouchableOpacity>
      )}
      {/* Chat Window */}
      {visible && (
        <Animated.View
          style={[
            styles.chatWindow,
            {
              transform: [{ translateY: slideAnim.interpolate({ inputRange: [0, 1], outputRange: [400, 0] }) }],
            },
          ]}
        >
          <View style={styles.header}>
            <Text style={styles.headerTitle}>Chatbot</Text>
            <TouchableOpacity onPress={closeChat}>
              <Text style={{ fontSize: 22, marginLeft: 8 }}>✖️</Text>
            </TouchableOpacity>
          </View>
          <FlatList
            data={messages}
            keyExtractor={item => item.id}
            renderItem={({ item }) => (
              <View style={[styles.message, item.from === 'user' ? styles.userMsg : styles.botMsg]}>
                <Text style={{ color: item.from === 'user' ? '#fff' : '#222' }}>{item.text}</Text>
              </View>
            )}
            contentContainerStyle={{ padding: 12 }}
            style={{ flex: 1 }}
            inverted
          />
          <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : undefined}>
            <View style={styles.inputRow}>
              <TextInput
                style={styles.input}
                value={input}
                onChangeText={setInput}
                placeholder="Type a message..."
                placeholderTextColor="#aaa"
              />
              <TouchableOpacity style={styles.sendBtn} onPress={sendMessage}>
                <Text style={{ fontSize: 22 }}>📤</Text>
              </TouchableOpacity>
            </View>
          </KeyboardAvoidingView>
        </Animated.View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  fab: {
    position: 'absolute',
    right: 24,
    bottom: 36,
    backgroundColor: '#fff',
    borderRadius: 32,
    width: 64,
    height: 64,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
  chatWindow: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    height: 400,
    backgroundColor: '#fff',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 8,
    overflow: 'hidden',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    backgroundColor: '#3a3a8a',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
  },
  headerTitle: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  message: {
    marginVertical: 4,
    padding: 10,
    borderRadius: 16,
    maxWidth: '80%',
  },
  userMsg: {
    backgroundColor: '#3a3a8a',
    alignSelf: 'flex-end',
  },
  botMsg: {
    backgroundColor: '#eee',
    alignSelf: 'flex-start',
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 8,
    backgroundColor: '#f5f5f5',
  },
  input: {
    flex: 1,
    height: 40,
    backgroundColor: '#fff',
    borderRadius: 20,
    paddingHorizontal: 16,
    fontSize: 16,
    marginRight: 8,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  sendBtn: {
    backgroundColor: '#3a3a8a',
    borderRadius: 20,
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
