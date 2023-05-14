import React, { Component } from 'react';
import { View, Text, Dimensions, StyleSheet, Image, TouchableOpacity, Alert } from 'react-native';
import * as MediaLibrary from "expo-media-library";
import * as Sharing from 'expo-sharing';
import * as SecureStore from 'expo-secure-store';
import * as ImagePicker from 'expo-image-picker';

var width = Dimensions.get('window').width;
var height = Dimensions.get('window').height;

class BigPhotoScreen extends Component {
    constructor(props) {
        super(props);
        this.state = {
        };
        this.delFunction = this.delFunction.bind(this);
        this.shareFunction = this.shareFunction.bind(this);
    }
    async shareFunction() {
        let uri = this.props.route.params.whichPhoto;
        let id = this.props.route.params.photoId

        await Sharing.shareAsync(uri)
            .catch((error) => {
                console.log(error.message);
                alert(error.message);
            })
    }

    async delFunction() {
        Sharing.isAvailableAsync()
            .catch((error) => {
                console.log(error.message);
                alert(error.message);
            })

        let uri = this.props.route.params.whichPhoto;
        let id = this.props.route.params.photoId

        await MediaLibrary.deleteAssetsAsync([id])
            .then((data) => {
                this.props.route.params.onGoBack();
                this.props.navigation.goBack();
            }).catch((error) => {
                console.log(error.message);
                alert(error.message);
            })
    }
    upload = async () => {

        let adressData = JSON.parse(await SecureStore.getItemAsync("adressData"))
        let ip = adressData[0].ip.toString()
        let port = adressData[0].port.toString()

        const data = new FormData();

        data.append('photo', {
            uri: this.props.route.params.whichPhoto,
            type: 'image/jpeg',
            name: this.props.route.params.photoname
        });

        try {
            const headers = { "Content-Type": "application/json" }
            const result = await fetch("http://" + ip + ":" + port + "/upload", {
                method: 'POST',
                body: data,

            })
            Alert.alert('Alert', 'Photo - file uploaded and saved.')
        }
        catch (e) {
            Alert.alert('Alert', 'Upload error')
            console.log(e)
        }

    }

    pickImage = async () => {
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.All,
            allowsEditing: true,
            aspect: [4, 3],
            quality: 1,
        });


        if (!result.cancelled) {
            let adressData = JSON.parse(await SecureStore.getItemAsync("adressData"))
            let ip = adressData[0].ip.toString()
            let port = adressData[0].port.toString()

            const data = new FormData();

            data.append('photo', {
                uri: result.uri,
                type: 'image/jpeg',
                name: 'this.props.route.params.photoname.jpeg'
            });

            try {
                const headers = { "Content-Type": "application/json" }
                const result = await fetch("http://" + ip + ":" + port + "/upload", {
                    method: 'POST',
                    body: data,

                })
                Alert.alert('Alert', 'Photo - file uploaded and saved.')
            }
            catch { Alert.alert('Alert', 'Upload error') }

        }
    };

    render() {
        const styles = StyleSheet.create({
            container: {
                width: width,
                height: height,
                backgroundColor: '#1a1f21',
                flex: 1,
                alignItems: 'center',
                paddingTop: 30
            },
            image: {
                width: '100%',
                height: '100%',
                borderRadius: 10
            },
            imageContainer: {
                width: '85%',
                height: '70%',
                marginBottom: 30
            },
            buttonsContainer: {
                width: '85%',
                height: 100,
                alignItems: 'center',
                justifyContent: 'center',
                flexDirection: 'row'
            },
            text: {
                fontSize: 17,
                color: 'white',
                padding: 15
            }
        });

        return (
            <View style={styles.container}>
                <View style={styles.imageContainer}>
                    <Image style={styles.image} source={{ uri: this.props.route.params.whichPhoto }} />
                </View>
                <View style={styles.buttonsContainer}>
                    <TouchableOpacity onPress={() => this.shareFunction()}>
                        <Text style={styles.text}>SHARE</Text>
                    </TouchableOpacity>

                    <TouchableOpacity onPress={() => this.delFunction()}>
                        <Text style={styles.text}>DELETE</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={this.upload}>
                        <Text style={styles.text}>UPLOAD</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={this.pickImage}>
                        <Text style={styles.text}>PICKER</Text>
                    </TouchableOpacity>
                </View>

            </View >
        );
    }
}

export default BigPhotoScreen;
