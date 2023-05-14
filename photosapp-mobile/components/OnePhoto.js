import React, { Component } from 'react';
import { View, Text, StyleSheet, Dimensions, Image, TouchableOpacity } from 'react-native';


class OnePhoto extends Component {
  constructor(props) {
    super(props);
    this.state = {
    };
  }


  render() {
    const styles = StyleSheet.create({
      container: {
        width: this.props.width,
        height: this.props.height,
        margin: 4,
      },
      imageContainer: {
        width: '100%',
        height: '100%',
        borderRadius: 10,
      },
      idContainer: {
        width: '60%',
        height: '20%',
        // backgroundColor: 'blue',
        top: '-20%',
        left: '40%',
        borderRadius: 10,
        justifyContent: 'center',
        alignItems: 'flex-end',

        // color: 'white'
      },
      plusContainer: {
        width: '100%',
        height: '100%',
        borderRadius: 10,
        top: '-120%',
        backgroundColor: '#ea1e63',
        opacity: 0.5

      },
      text: {
        fontSize: 10,
        color: 'white',
        fontWeight: 'bold',
        marginRight: 10
      }
    });
    if (!this.props.toRemove) {
      return (

        <TouchableOpacity style={styles.container} onPress={() => this.props.showBigPhoto(this.props.uri, this.props.id, this.props.filename)} onLongPress={() => this.props.addToRemoveArray(this.props.id)}>

          <Image style={styles.imageContainer} source={{ uri: this.props.uri }} />
          <View style={styles.idContainer}><Text style={styles.text}>{this.props.id}</Text></View>


        </TouchableOpacity>

      );
    }
    else {
      return (

        <TouchableOpacity style={styles.container} onPress={() => this.props.showBigPhoto(this.props.uri, this.props.id)} onLongPress={() => this.props.addToRemoveArray(this.props.id)}>

          <Image style={styles.imageContainer} source={{ uri: this.props.uri }} />
          <View style={styles.idContainer}><Text style={styles.text}>{this.props.id}</Text></View>
          <View style={styles.plusContainer}></View>
        </TouchableOpacity>

      );
    }
  }
}




export default OnePhoto;
