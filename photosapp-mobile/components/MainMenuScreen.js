import React, { Component } from 'react';
import { View, Text, Button, TouchableOpacity, StyleSheet } from 'react-native';
import { Dimensions } from "react-native";
import * as MediaLibrary from "expo-media-library";

var width = Dimensions.get('window').width; //full width
var height = Dimensions.get('window').height; //full height




class MainMenuScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
    };
  }

  async componentDidMount() {
    let { status } = await MediaLibrary.requestPermissionsAsync();
    if (status !== 'granted') {
      alert('brak uprawnień do czytania image-ów z galerii')
    }
  }

  render() {
    return (
      <TouchableOpacity style={styles.mainContainer}
        title="go to screen2"
        onPress={() => this.props.navigation.navigate("PhotosScreen")}>
        <View>
          <View style={styles.container}>
            <Text style={styles.mainText}>Camera App</Text>
            <Text style={styles.text}>Take picture from camera</Text>
            <Text style={styles.text}>Save photo to device</Text>
            <Text style={styles.text}>Delete phot from device</Text>
          </View>
        </View>
      </TouchableOpacity>
    );
  }
}

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#ea1e63',
    width: width,
    height: height
  },
  container: {

  },
  text: {
    textAlign: 'center',
    margin: 5,
    color: 'white',
    fontSize: 15
  },
  mainText: {
    textAlign: 'center',
    marginBottom: 15,
    color: 'white',
    fontSize: 50,
    fontWeight: 'bold'
  }
});



export default MainMenuScreen;
