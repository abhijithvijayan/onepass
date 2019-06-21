/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React, {Component} from 'react';
import {Platform, StyleSheet, Text, View} from 'react-native';
import forge from 'node-forge';
import unorm from 'unorm';
import hkdf from 'js-crypto-hkdf';
import trimLeft from 'trim-left';
import trimRight from 'trim-right';
import * as sha256 from 'fast-sha256';

const instructions = Platform.select({
  ios: 'Press Cmd+R to reload,\n' + 'Cmd+D or shake for dev menu',
  android:
    'Double tap R on your keyboard to reload,\n' +
    'Shake or press menu button for dev menu',
});

type Props = {};
const normaliseMasterPassword = password => {
  /* Trim white-spaces */
  const leftTrimmed = trimLeft(password);
  const rightTrimmed = trimRight(leftTrimmed);
  const combiningCharacters = /[\u0300-\u036F]/g;
  /* Normalisation */
  return unorm.nfkd(rightTrimmed).replace(combiningCharacters, '');
};

const generateSalt = () => {
  const salt = forge.random.getBytesSync(16);
  console.log('16 byte salt', salt);
  const email = 'ABC@gmail.com';
  const lowerCaseEmail = email.toLowerCase();
  console.log('lowercase email: ', lowerCaseEmail);
  // generate 32 byte salt
  return hkdf.compute(salt, 'SHA-256', 32, '', lowerCaseEmail).then(derived => {
      return derived.key;
  });
};

const generateDerivedKey = async () => {
  const normalisedMasterPassword = normaliseMasterPassword('masterPassword');
  console.log('normalised master password : ', normalisedMasterPassword);
  try {
      const salt = await generateSalt();
      console.log('32 byte salt : ', salt);
      return sha256.pbkdf2(normalisedMasterPassword, salt, 100000, 32);
  } catch (err) {
      console.log(err);
  }
};

export default class App extends Component<Props> {
  constructor(props) {
      super(props);
      this.state = { derivedKey: null };
  }

  async componentDidMount() {
      const key = await generateDerivedKey();
      this.setState({
          derivedKey: key,
      });
  }

  render() {
    return (
      <View style={styles.container}>
        <Text style={styles.welcome}>OnePass Password Manager</Text>
        <Text style={styles.instructions}>32 Byte Derived Key : {this.state.derivedKey}</Text>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
  welcome: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
  },
  instructions: {
    textAlign: 'center',
    color: '#333333',
    marginBottom: 5,
  },
});
