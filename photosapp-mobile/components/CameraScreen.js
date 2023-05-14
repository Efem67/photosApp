import React, { Component } from 'react';
import { View, Text, StyleSheet, Dimensions, TouchableOpacity, Image, BackHandler, ToastAndroid } from 'react-native';
import { Camera } from "expo-camera";
import * as MediaLibrary from "expo-media-library";
import { useIsFocused } from '@react-navigation/native';


var width = Dimensions.get('window').width; //full width
var height = Dimensions.get('window').height; //full height

class CameraScreen extends Component {
    constructor(props) {
        super(props);
        this.state = {
            hasCameraPermission: null,
            type: Camera.Constants.Type.back,
            fotoPreview: '0'
        };
    }

    async componentDidMount() {

        let { status } = await Camera.requestCameraPermissionsAsync();
        this.setState({
            hasCameraPermission: status == 'granted'
        });
        BackHandler.addEventListener("hardwareBackPress", this.handleBackPress);

    }
    componentWillUnmount() {
        BackHandler.removeEventListener("hardwareBackPress", this.handleBackPress);
    }
    reverseCameraFunc = () => {
        this.setState({
            type: this.state.type === Camera.Constants.Type.back
                ? Camera.Constants.Type.front
                : Camera.Constants.Type.back,
        });
    }
    takePhotoFunc = async () => {
        if (this.camera) {
            let foto = await this.camera.takePictureAsync();
            let asset = await MediaLibrary.createAssetAsync(foto.uri);
            this.props.route.params.onGoBack();
            ToastAndroid.showWithGravity(
                'Zdjęcie wykonano',
                ToastAndroid.SHORT,
                ToastAndroid.BOTTOM
            );

            this.setState({
                fotoPreview: foto.uri
            });

            this.createPreview()
        }
    }
    createPreview = async () => {
        await this.tenSeconds()
        this.setState({
            fotoPreview: '0'
        });

    }
    tenSeconds = async () => {
        return new Promise(resolve => {
            setTimeout(function () {
                resolve("fast");
                console.log("szybka obietnica została wykonana");
            }, 6000);
        });
    }
    handleBackPress = () => {
        this.props.route.params.onGoBack();
        this.props.navigation.goBack()
        return true;
    }

    render() {

        const { hasCameraPermission } = this.state; // podstawienie zmiennej ze state
        if (hasCameraPermission == null) {
            return <View />;
        } else if (hasCameraPermission == false) {
            return <Text>brak dostępu do kamery</Text>;
        } else {
            if (this.state.fotoPreview === '0') {
                return (
                    <View style={{ flex: 1 }}>
                        <Camera
                            ref={ref => {
                                this.camera = ref; // Uwaga: referencja do kamery używana później
                            }}
                            style={{ flex: 1 }}
                            type={this.state.type}>

                            <View style={styles.buttonsContainer}>

                                <TouchableOpacity style={styles.reverseCamera} activeOpacity={.4} onPress={() => this.reverseCameraFunc()}>
                                    <Image tintColor="#ea1e63" style={styles.reverseIcon} source={require('../icons/reverseCameraIcon.png')} />
                                </TouchableOpacity>

                                <TouchableOpacity style={styles.takePhoto} activeOpacity={.4} onPress={() => this.takePhotoFunc()}>
                                    <Image tintColor="#ea1e63" style={styles.takePhotoIcon} source={require('../icons/takePhotoIcon.png')} />
                                </TouchableOpacity>
                            </View>
                        </Camera >
                    </View >
                );
            } else {
                return (
                    <View style={{ flex: 1 }}>


                        <Camera
                            ref={ref => {
                                this.camera = ref;
                            }}
                            style={{ flex: 1 }}
                            type={this.state.type}>
                            <View style={styles.buttonsContainer}>

                                <TouchableOpacity style={styles.reverseCamera} activeOpacity={.4} onPress={() => this.reverseCameraFunc()}>
                                    <Image tintColor="#ea1e63" style={styles.reverseIcon} source={require('../icons/reverseCameraIcon.png')} />
                                </TouchableOpacity>

                                <TouchableOpacity style={styles.takePhoto} activeOpacity={.4} onPress={() => this.takePhotoFunc()}>
                                    <Image tintColor="#ea1e63" style={styles.takePhotoIcon} source={require('../icons/takePhotoIcon.png')} />
                                </TouchableOpacity>
                            </View>
                        </Camera >
                        <View style={styles.previewContainer}>
                            <Image style={styles.previewPic} source={{ uri: this.state.fotoPreview }} />
                        </View>
                    </View >
                );
            }

        }
    }

}

const styles = StyleSheet.create({
    container: {
        width: width,
        height: height,
        backgroundColor: '#1a1f21',
        flex: 1,
        alignItems: 'center',
        paddingTop: 30
    },
    buttonsContainer: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'flex-end',
    },
    takePhoto: {
        width: 100,
        height: 100,
        backgroundColor: '#1a1f21',
        borderRadius: 50,
        marginBottom: 25,
        justifyContent: 'center',
        alignItems: 'center',
        opacity: 0.7
    },
    reverseCamera: {
        width: 75,
        height: 75,
        backgroundColor: '#1a1f21',
        borderRadius: 50,
        marginBottom: 35,
        marginRight: 30,
        justifyContent: 'center',
        alignItems: 'center',
        opacity: 0.7
    },
    edit: {
        width: 75,
        height: 75,
        backgroundColor: '#1a1f21',
        borderRadius: 50,
        marginBottom: 35,
        marginLeft: 30,
        justifyContent: 'center',
        alignItems: 'center',
        opacity: 0.7
    },
    reverseIcon: {
        width: 30,
        height: 30,
    },
    takePhotoIcon: {
        width: 50,
        height: 50,
    },
    previewPic: {
        width: 73,
        height: 98,
        borderRadius: 10
    },
    previewContainer: {
        position: 'absolute',
        width: 75,
        height: 100,
        top: "10%",
        left: "50%",
        transform: [{ translateX: -30 }, { translateY: -45 }],
        zIndex: 100,
        borderWidth: 1,
        borderColor: "#ea1e63",
        borderRadius: 10
    }

});

export default CameraScreen;
